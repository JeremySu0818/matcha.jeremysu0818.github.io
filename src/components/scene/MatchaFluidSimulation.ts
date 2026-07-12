import { MATCHA_FLUID_CONFIG } from "./config/fluid";
import type {
  FluidRipple,
  FluidStir,
  FluidVector,
  WallDamping,
} from "./matchaFluidTypes";

interface ConstrainedCollision {
  readonly deltaU: number;
  readonly deltaV: number;
  readonly friction: number;
  readonly u: number;
  readonly v: number;
}

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function smoothstep(minimum: number, maximum: number, value: number): number {
  const ratio = clamp((value - minimum) / (maximum - minimum), 0, 1);
  return ratio * ratio * (3 - 2 * ratio);
}

export class MatchaFluidSimulation {
  private readonly ripples: FluidRipple[] = [];
  private readonly stirs: FluidStir[] = [];
  private heightPixels: number;
  private timeStateSeconds = 0;
  private widthPixels: number;

  constructor(sizePixels: number) {
    this.widthPixels = sizePixels;
    this.heightPixels = sizePixels;
  }

  get timeSeconds(): number {
    return this.timeStateSeconds;
  }

  setSize(sizePixels: number): void {
    this.widthPixels = sizePixels;
    this.heightPixels = sizePixels;
  }

  reset(): void {
    this.ripples.length = 0;
    this.stirs.length = 0;
    const initial = MATCHA_FLUID_CONFIG.initialRipples;
    for (let index = 0; index < initial.count; index += 1) {
      this.addRipple(
        randomBetween(0, this.widthPixels),
        randomBetween(0, this.heightPixels),
        randomBetween(...initial.forceRange),
        randomBetween(...initial.radiusPixelsRange),
      );
    }
  }

  dispose(): void {
    this.ripples.length = 0;
    this.stirs.length = 0;
  }

  addCollisionStir(
    u: number,
    v: number,
    deltaU: number,
    deltaV: number,
    force = 1,
  ): void {
    const constrained = this.constrainToBowl(u, v, deltaU, deltaV);
    if (!constrained) return;
    const speed = Math.hypot(constrained.deltaU, constrained.deltaV);
    const collision = MATCHA_FLUID_CONFIG.collision;
    if (speed < collision.minimumSpeedUv && force < collision.minimumForce) {
      return;
    }
    this.addStir(
      constrained.u * this.widthPixels,
      constrained.v * this.heightPixels,
      constrained.deltaU * this.widthPixels,
      constrained.deltaV * this.heightPixels,
      force * constrained.friction,
    );
    if (
      speed > collision.rippleSpeedThresholdUv ||
      force > collision.rippleStrengthThreshold
    ) {
      this.addRipple(
        constrained.u * this.widthPixels,
        constrained.v * this.heightPixels,
        Math.min(
          collision.rippleForceMaximum,
          force * collision.rippleForceMultiplier,
        ),
        collision.rippleRadiusBasePixels +
          speed *
            this.widthPixels *
            collision.rippleRadiusSpeedMultiplier,
      );
    }
  }

  frame(deltaSeconds: number): void {
    const deltaConfig = MATCHA_FLUID_CONFIG.simulation.deltaSeconds;
    const rawDelta = Math.min(
      deltaConfig.maximum,
      Math.max(deltaConfig.minimum, deltaSeconds),
    );
    this.timeStateSeconds += rawDelta;
    this.update();
  }

  baseFlow(x: number, y: number, timeSeconds: number): FluidVector {
    const normalizedX = x / this.widthPixels;
    const normalizedY = y / this.heightPixels;
    const speed = MATCHA_FLUID_CONFIG.simulation.flowSpeed;
    const field = MATCHA_FLUID_CONFIG.flowField;
    const first = Math.sin(
      normalizedY * field.primaryX.spatialFrequency +
        timeSeconds *
          (field.primaryX.timeBaseFrequency +
            speed * field.primaryX.timeFlowMultiplier),
    );
    const second = Math.sin(
      (normalizedX + normalizedY) * field.diagonalX.spatialFrequency -
        timeSeconds *
          (field.diagonalX.timeBaseFrequency +
            speed * field.diagonalX.timeFlowMultiplier),
    );
    const third = Math.cos(
      normalizedX * field.primaryY.spatialFrequency -
        timeSeconds *
          (field.primaryY.timeBaseFrequency +
            speed * field.primaryY.timeFlowMultiplier),
    );
    const fourth = Math.sin(
      (normalizedX - normalizedY) * field.diagonalY.spatialFrequency +
        timeSeconds *
          (field.diagonalY.timeBaseFrequency +
            speed * field.diagonalY.timeFlowMultiplier),
    );
    return {
      x:
        first * field.primaryX.influence +
        second * field.diagonalX.influence,
      y:
        third * field.primaryY.influence +
        fourth * field.diagonalY.influence,
    };
  }

  wallDamping(x: number, y: number): WallDamping {
    const bowl = MATCHA_FLUID_CONFIG.bowl;
    const differenceX = x / this.widthPixels - bowl.centerUv;
    const differenceY = y / this.heightPixels - bowl.centerUv;
    const radius = Math.hypot(differenceX, differenceY);
    const wall = smoothstep(
      bowl.radiusRatio * bowl.wallFrictionStartRatio,
      bowl.radiusRatio,
      radius,
    );
    return {
      damping: 1 - wall * bowl.wallDampingMultiplier,
      wall,
      x: radius > bowl.minimumNormalizedRadius ? differenceX / radius : 0,
      y: radius > bowl.minimumNormalizedRadius ? differenceY / radius : 0,
    };
  }

  displacementAt(x: number, y: number, cellTime: number): FluidVector {
    const simulation = MATCHA_FLUID_CONFIG.simulation;
    const displacement = MATCHA_FLUID_CONFIG.flowField.displacement;
    const energy =
      (displacement.baseEnergy +
        simulation.agitation * displacement.agitationEnergyMultiplier) *
      (1 -
        simulation.viscosity * displacement.viscosityEnergyMultiplier);
    const amplitude = simulation.deformationPixels;
    const flow = this.baseFlow(x, y, cellTime);
    const wall = this.wallDamping(x, y);
    let deltaX =
      flow.x * amplitude * displacement.xAmplitudeRatio * energy * wall.damping;
    let deltaY =
      flow.y * amplitude * displacement.yAmplitudeRatio * energy * wall.damping;

    const stirConfig = MATCHA_FLUID_CONFIG.stir;
    for (const stir of this.stirs) {
      const ageSeconds = this.timeStateSeconds - stir.startSeconds;
      const life = 1 - ageSeconds / stirConfig.lifetimeSeconds;
      const offsetX = x - stir.x;
      const offsetY = y - stir.y;
      const distanceSquared = offsetX * offsetX + offsetY * offsetY;
      const radius =
        stirConfig.radiusBasePixels +
        stirConfig.radiusAgitationMultiplierPixels * simulation.agitation;
      if (distanceSquared < radius * radius) {
        const distance =
          Math.sqrt(distanceSquared) + stirConfig.distanceEpsilonPixels;
        const falloff =
          Math.pow(1 - distance / radius, stirConfig.falloffExponent) * life;
        const swirlX = -offsetY / distance;
        const swirlY = offsetX / distance;
        const push =
          (stir.velocityX * offsetX + stir.velocityY * offsetY) /
          (distance + stirConfig.pushDistanceOffsetPixels);
        const wallFriction =
          1 - wall.wall * stirConfig.wallFrictionMultiplier;
        deltaX +=
          (stir.velocityX * stirConfig.velocityInfluence +
            swirlX * push * stirConfig.swirlInfluence) *
          falloff *
          stir.force *
          wallFriction;
        deltaY +=
          (stir.velocityY * stirConfig.velocityInfluence +
            swirlY * push * stirConfig.swirlInfluence) *
          falloff *
          stir.force *
          wallFriction;
      }
    }

    const rippleConfig = MATCHA_FLUID_CONFIG.ripple;
    for (const ripple of this.ripples) {
      const ageSeconds = this.timeStateSeconds - ripple.startSeconds;
      const offsetX = x - ripple.x;
      const offsetY = y - ripple.y;
      const distance =
        Math.hypot(offsetX, offsetY) + rippleConfig.distanceEpsilonPixels;
      const waveFront =
        ageSeconds * ripple.radiusPixels * rippleConfig.waveFrontSpeedRatio;
      const band = Math.abs(distance - waveFront);
      if (band < ripple.radiusPixels * rippleConfig.bandRadiusRatio) {
        const ring =
          Math.sin(
            distance * rippleConfig.spatialFrequency -
              ageSeconds * rippleConfig.timeFrequency +
              ripple.seed,
          ) *
          Math.exp(
            -band /
              (ripple.radiusPixels * rippleConfig.ringDecayRadiusRatio),
          );
        const life = Math.pow(
          1 - ageSeconds / rippleConfig.lifetimeSeconds,
          rippleConfig.lifeExponent,
        );
        const magnitude =
          ring *
          life *
          ripple.force *
          amplitude *
          rippleConfig.magnitudeRatio *
          wall.damping;
        deltaX += (offsetX / distance) * magnitude;
        deltaY += (offsetY / distance) * magnitude;
      }
    }

    return { x: deltaX, y: deltaY };
  }

  private constrainToBowl(
    u: number,
    v: number,
    deltaU: number,
    deltaV: number,
  ): ConstrainedCollision | null {
    const bowl = MATCHA_FLUID_CONFIG.bowl;
    const centerX = u - bowl.centerUv;
    const centerY = v - bowl.centerUv;
    const radius = Math.hypot(centerX, centerY);
    if (radius > bowl.radiusRatio + bowl.collisionMarginRatio) return null;
    const normalX =
      radius > bowl.minimumNormalizedRadius ? centerX / radius : 0;
    const normalY =
      radius > bowl.minimumNormalizedRadius ? centerY / radius : 0;
    const wall = smoothstep(
      bowl.radiusRatio * bowl.wallFrictionStartRatio,
      bowl.radiusRatio,
      radius,
    );
    const normalVelocity = deltaU * normalX + deltaV * normalY;
    const tangentU = deltaU - normalVelocity * normalX;
    const tangentV = deltaV - normalVelocity * normalY;
    const inwardU = Math.min(0, normalVelocity) * normalX;
    const inwardV = Math.min(0, normalVelocity) * normalY;
    const clampedRadius = Math.min(radius, bowl.radiusRatio);
    const safeRadius =
      radius > bowl.minimumNormalizedRadius ? clampedRadius / radius : 1;
    const constraint = bowl.constraint;
    return {
      deltaU:
        tangentU *
          (constraint.tangentBaseRatio +
            wall * constraint.tangentWallMultiplier) +
        inwardU * (1 - wall * constraint.inwardWallMultiplier),
      deltaV:
        tangentV *
          (constraint.tangentBaseRatio +
            wall * constraint.tangentWallMultiplier) +
        inwardV * (1 - wall * constraint.inwardWallMultiplier),
      friction: 1 - wall * constraint.frictionWallMultiplier,
      u: bowl.centerUv + centerX * safeRadius,
      v: bowl.centerUv + centerY * safeRadius,
    };
  }

  private addRipple(
    x: number,
    y: number,
    force: number = MATCHA_FLUID_CONFIG.ripple.defaultForce,
    radiusPixels: number = MATCHA_FLUID_CONFIG.ripple.defaultRadiusPixels,
  ): void {
    this.ripples.push({
      force,
      radiusPixels,
      seed: Math.random() * MATCHA_FLUID_CONFIG.ripple.seedRange,
      startSeconds: this.timeStateSeconds,
      x,
      y,
    });
    if (this.ripples.length > MATCHA_FLUID_CONFIG.limits.ripples) {
      this.ripples.shift();
    }
  }

  private addStir(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    force = 1,
  ): void {
    this.stirs.push({
      force,
      startSeconds: this.timeStateSeconds,
      velocityX,
      velocityY,
      x,
      y,
    });
    if (this.stirs.length > MATCHA_FLUID_CONFIG.limits.stirs) {
      this.stirs.shift();
    }
  }

  private update(): void {
    const currentTime = this.timeStateSeconds;
    this.removeExpired(
      this.ripples,
      currentTime,
      MATCHA_FLUID_CONFIG.ripple.lifetimeSeconds,
    );
    this.removeExpired(
      this.stirs,
      currentTime,
      MATCHA_FLUID_CONFIG.stir.lifetimeSeconds,
    );
  }

  private removeExpired(
    items: { readonly startSeconds: number }[],
    currentTimeSeconds: number,
    lifetimeSeconds: number,
  ): void {
    let writeIndex = 0;
    for (const item of items) {
      if (currentTimeSeconds - item.startSeconds < lifetimeSeconds) {
        items[writeIndex] = item;
        writeIndex += 1;
      }
    }
    items.length = writeIndex;
  }
}
