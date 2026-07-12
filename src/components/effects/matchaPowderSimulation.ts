import { MATCHA_POWDER_EFFECT_CONFIG } from "./matchaPowderConfig";

interface Particle {
  readonly baseVelocityX: number;
  readonly baseVelocityY: number;
  readonly opacity: number;
  readonly radiusPixels: number;
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
}

interface Ripple {
  life: number;
  radiusPixels: number;
  readonly x: number;
  readonly y: number;
}

type RippleRing = (typeof MATCHA_POWDER_EFFECT_CONFIG.ripple.rings)[number];

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}

function createParticles(
  count: number,
  widthPixels: number,
  heightPixels: number,
): Particle[] {
  const config = MATCHA_POWDER_EFFECT_CONFIG.particle;
  return Array.from({ length: count }, () => ({
    baseVelocityX: randomBetween(...config.baseVelocityXPerFrame),
    baseVelocityY: randomBetween(...config.baseVelocityYPerFrame),
    opacity: randomBetween(...config.opacity),
    radiusPixels: randomBetween(...config.radiusPixels),
    velocityX: 0,
    velocityY: 0,
    x: Math.random() * widthPixels,
    y: Math.random() * heightPixels,
  }));
}

function drawRippleRing(
  context: CanvasRenderingContext2D,
  ripple: Ripple,
  ring: RippleRing,
): void {
  const radiusPixels = ripple.radiusPixels - ring.radiusOffsetPixels;
  if (radiusPixels <= 0) return;
  context.beginPath();
  context.arc(ripple.x, ripple.y, radiusPixels, 0, Math.PI * 2);
  context.strokeStyle = `rgba(${MATCHA_POWDER_EFFECT_CONFIG.ripple.lineColorRgb}, ${String(
    ripple.life * ring.lineOpacityMultiplier,
  )})`;
  context.lineWidth =
    ring.lineWidthPixels + ripple.life * ring.lineWidthLifeMultiplier;
  context.stroke();
}

function applyRippleRingForce(
  particle: Particle,
  ripple: Ripple,
  ring: RippleRing,
): void {
  const radiusPixels = ripple.radiusPixels - ring.radiusOffsetPixels;
  if (radiusPixels <= 0) return;
  const differenceX = particle.x - ripple.x;
  const differenceY = particle.y - ripple.y;
  const distancePixels = Math.hypot(differenceX, differenceY);
  const distanceFromRingPixels = Math.abs(distancePixels - radiusPixels);
  const thicknessPixels = MATCHA_POWDER_EFFECT_CONFIG.ripple.thicknessPixels;
  if (distanceFromRingPixels >= thicknessPixels) return;
  const forceRatio =
    (thicknessPixels - distanceFromRingPixels) / thicknessPixels;
  const directionX = differenceX / (distancePixels || 1);
  const directionY = differenceY / (distancePixels || 1);
  particle.velocityX +=
    directionX * forceRatio * ring.forceMultiplier * ripple.life;
  particle.velocityY +=
    directionY * forceRatio * ring.forceMultiplier * ripple.life;
}

export class MatchaPowderSimulation {
  private readonly context: CanvasRenderingContext2D;
  private readonly particles: Particle[];
  private readonly ripples: Ripple[] = [];
  private heightPixels: number;
  private widthPixels: number;

  constructor(
    context: CanvasRenderingContext2D,
    mobile: boolean,
    widthPixels: number,
    heightPixels: number,
  ) {
    this.context = context;
    this.widthPixels = widthPixels;
    this.heightPixels = heightPixels;
    const count = mobile
      ? MATCHA_POWDER_EFFECT_CONFIG.particle.count.mobile
      : MATCHA_POWDER_EFFECT_CONFIG.particle.count.desktop;
    this.particles = createParticles(count, widthPixels, heightPixels);
  }

  resize(
    canvas: HTMLCanvasElement,
    widthPixels: number,
    heightPixels: number,
    devicePixelRatio: number,
  ): void {
    this.widthPixels = widthPixels;
    this.heightPixels = heightPixels;
    canvas.width = widthPixels * devicePixelRatio;
    canvas.height = heightPixels * devicePixelRatio;
    canvas.style.width = `${String(widthPixels)}px`;
    canvas.style.height = `${String(heightPixels)}px`;
    this.context.scale(devicePixelRatio, devicePixelRatio);
  }

  addRipple(x: number, y: number): void {
    this.ripples.push({ life: 1, radiusPixels: 0, x, y });
  }

  frame(): void {
    this.context.clearRect(0, 0, this.widthPixels, this.heightPixels);
    this.updateAndDrawRipples();
    this.updateAndDrawParticles();
    this.context.globalAlpha = 1;
  }

  private updateAndDrawRipples(): void {
    const config = MATCHA_POWDER_EFFECT_CONFIG.ripple;
    for (let index = this.ripples.length - 1; index >= 0; index -= 1) {
      const ripple = this.ripples[index];
      ripple.radiusPixels +=
        (config.maximumRadiusPixels - ripple.radiusPixels) *
          config.radiusLerpRatioPerFrame +
        config.radiusGrowthPixelsPerFrame;
      ripple.life -= config.lifeDecayPerFrame;
      if (ripple.life <= 0) {
        this.ripples.splice(index, 1);
      } else {
        for (const ring of config.rings) {
          drawRippleRing(this.context, ripple, ring);
        }
      }
    }
  }

  private updateAndDrawParticles(): void {
    const config = MATCHA_POWDER_EFFECT_CONFIG.particle;
    this.context.fillStyle = config.color;
    for (const particle of this.particles) {
      particle.velocityX +=
        (particle.baseVelocityX - particle.velocityX) *
        config.velocityLerpRatioPerFrame;
      particle.velocityY +=
        (particle.baseVelocityY - particle.velocityY) *
        config.velocityLerpRatioPerFrame;
      for (const ripple of this.ripples) {
        for (const ring of MATCHA_POWDER_EFFECT_CONFIG.ripple.rings) {
          applyRippleRingForce(particle, ripple, ring);
        }
      }
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      this.wrapParticle(particle);
      this.context.globalAlpha = particle.opacity;
      this.context.beginPath();
      this.context.arc(
        particle.x,
        particle.y,
        particle.radiusPixels,
        0,
        Math.PI * 2,
      );
      this.context.fill();
    }
  }

  private wrapParticle(particle: Particle): void {
    const marginPixels = MATCHA_POWDER_EFFECT_CONFIG.particle.wrapMarginPixels;
    if (particle.y > this.heightPixels + marginPixels) {
      particle.y = -marginPixels;
    }
    if (particle.x > this.widthPixels + marginPixels) {
      particle.x = -marginPixels;
    }
    if (particle.x < -marginPixels) {
      particle.x = this.widthPixels + marginPixels;
    }
  }
}
