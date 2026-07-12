import { range, smoothstep } from "../../utils/easing";
import { POWDER_PARTICLE_CONFIG } from "./config/effects";
import type { Matrix4Tuple } from "three";

export interface PowderParticleData {
  readonly clumpOffsetX: Float64Array;
  readonly clumpOffsetY: Float64Array;
  readonly clumpOffsetZ: Float64Array;
  readonly delay: Float64Array;
  readonly landX: Float64Array;
  readonly landZ: Float64Array;
  readonly positions: Float32Array;
  readonly randomX: Float32Array;
  readonly randomY: Float32Array;
  readonly randomZ: Float32Array;
  readonly siftOffsetX: Float64Array;
  readonly siftOffsetZ: Float64Array;
  readonly sizes: Float32Array;
}

function seeded(index: number): number {
  const random = POWDER_PARTICLE_CONFIG.random;
  const value =
    Math.sin(index * random.seedFrequency + random.seedOffset) *
    random.multiplier;
  return value - Math.floor(value);
}

function createPrimaryRandoms(count: number): readonly [
  Float32Array,
  Float32Array,
  Float32Array,
] {
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const z = new Float32Array(count);
  const offsets = POWDER_PARTICLE_CONFIG.random.offsets.primary;
  for (let index = 0; index < count; index += 1) {
    x[index] = seeded(index + offsets[0]);
    y[index] = seeded(index + offsets[1]);
    z[index] = seeded(index + offsets[2]);
  }
  return [x, y, z];
}

function populateStaticMotion(
  data: PowderParticleData,
  count: number,
): void {
  const fall = POWDER_PARTICLE_CONFIG.fall;
  const siftOffsets = POWDER_PARTICLE_CONFIG.random.offsets.sift;
  for (let index = 0; index < count; index += 1) {
    const randomX = data.randomX[index];
    const randomY = data.randomY[index];
    const randomZ = data.randomZ[index];
    const clumpAngle = randomX * Math.PI * 2;
    const clumpRadius = Math.sqrt(randomY) * fall.clumpRadiusWorld;
    data.clumpOffsetX[index] = Math.cos(clumpAngle) * clumpRadius;
    data.clumpOffsetZ[index] = Math.sin(clumpAngle) * clumpRadius;
    data.clumpOffsetY[index] =
      (randomZ - 0.5) * fall.clumpHeightRangeWorld;
    const siftAngle = seeded(index + siftOffsets[0]) * Math.PI * 2;
    const siftRadius =
      Math.sqrt(seeded(index + siftOffsets[1])) * fall.siftRadiusWorld;
    data.siftOffsetX[index] = Math.cos(siftAngle) * siftRadius;
    data.siftOffsetZ[index] =
      Math.sin(siftAngle) * siftRadius * fall.siftZScaleRatio;
    const landAngle = randomZ * Math.PI * 2;
    const landRadius = Math.sqrt(randomX) * fall.landRadiusWorld;
    data.landX[index] = Math.cos(landAngle) * landRadius;
    data.landZ[index] = Math.sin(landAngle) * landRadius;
    data.delay[index] =
      fall.delayProgress[0] +
      randomX * (fall.delayProgress[1] - fall.delayProgress[0]);
  }
}

export function createPowderParticleData(
  count: number,
): PowderParticleData {
  const [randomX, randomY, randomZ] = createPrimaryRandoms(count);
  const data: PowderParticleData = {
    clumpOffsetX: new Float64Array(count),
    clumpOffsetY: new Float64Array(count),
    clumpOffsetZ: new Float64Array(count),
    delay: new Float64Array(count),
    landX: new Float64Array(count),
    landZ: new Float64Array(count),
    positions: new Float32Array(count * 3),
    randomX,
    randomY,
    randomZ,
    siftOffsetX: new Float64Array(count),
    siftOffsetZ: new Float64Array(count),
    sizes: new Float32Array(count),
  };
  const sizeRange = POWDER_PARTICLE_CONFIG.random.sizeRangeRatio;
  for (let index = 0; index < count; index += 1) {
    data.sizes[index] =
      sizeRange[0] + seeded(index) * (sizeRange[1] - sizeRange[0]);
  }
  populateStaticMotion(data, count);
  return data;
}

function writeClumpPosition(
  data: PowderParticleData,
  index: number,
  fallProgress: number,
  outputOffset: number,
): void {
  const config = POWDER_PARTICLE_CONFIG.fall;
  const currentOffsetX =
    data.clumpOffsetX[index] +
    (data.siftOffsetX[index] - data.clumpOffsetX[index]) * fallProgress;
  const currentOffsetZ =
    data.clumpOffsetZ[index] +
    (data.siftOffsetZ[index] - data.clumpOffsetZ[index]) * fallProgress;
  const currentOffsetY =
    (data.clumpOffsetY[index] +
      data.randomX[index] * config.clumpDragRatio * fallProgress) *
    (1 - fallProgress);
  data.positions[outputOffset] =
    config.clumpCenterWorld[0] + currentOffsetX;
  data.positions[outputOffset + 1] =
    config.clumpCenterWorld[1] -
    config.clumpFallDistanceWorld * fallProgress * fallProgress +
    currentOffsetY;
  data.positions[outputOffset + 2] =
    config.clumpCenterWorld[2] + currentOffsetZ;
}

function writeSievePosition(
  data: PowderParticleData,
  index: number,
  leave: number,
  outputOffset: number,
): void {
  const config = POWDER_PARTICLE_CONFIG.fall;
  data.positions[outputOffset] =
    config.clumpCenterWorld[0] + data.siftOffsetX[index];
  data.positions[outputOffset + 1] = config.sieveHeightWorld;
  data.positions[outputOffset + 2] =
    config.clumpCenterWorld[2] +
    leave * config.sieveLeaveDistanceWorld +
    data.siftOffsetZ[index];
}

function writeFallingPosition(
  data: PowderParticleData,
  index: number,
  progress: number,
  matrix: Matrix4Tuple,
  outputOffset: number,
): void {
  const config = POWDER_PARTICLE_CONFIG.fall;
  const grainFall = range(
    progress,
    data.delay[index],
    data.delay[index] + config.durationProgress,
  );
  const leaveDelay = smoothstep(
    range(data.delay[index], ...config.sieveLeaveProgress),
  );
  const startX = config.clumpCenterWorld[0] + data.siftOffsetX[index];
  const startY = config.sieveLandingStartHeightWorld;
  const startZ =
    config.clumpCenterWorld[2] +
    leaveDelay * config.sieveLeaveDistanceWorld +
    data.siftOffsetZ[index];
  const landX = data.landX[index];
  const landZ = data.landZ[index];
  const radiusLandSquared =
    data.randomX[index] * config.landRadiusWorld * config.landRadiusWorld;
  const bowlColliderY =
    config.bowlColliderBaseYWorld +
    config.bowlColliderCurve * radiusLandSquared;
  const powderColliderY =
    config.powderColliderAmplitudeWorld *
    Math.exp(
      -(landX * landX + landZ * landZ) /
        config.powderColliderWidthSquaredWorld,
    );
  const landingY = bowlColliderY + powderColliderY;
  const endX =
    matrix[0] * landX +
    matrix[4] * landingY +
    matrix[8] * landZ +
    matrix[12];
  const endY =
    matrix[1] * landX +
    matrix[5] * landingY +
    matrix[9] * landZ +
    matrix[13];
  const endZ =
    matrix[2] * landX +
    matrix[6] * landingY +
    matrix[10] * landZ +
    matrix[14];
  if (grainFall >= 1) {
    data.positions[outputOffset] = endX;
    data.positions[outputOffset + 1] = endY;
    data.positions[outputOffset + 2] = endZ;
    return;
  }
  const spreadFactor =
    Math.sin(grainFall * Math.PI) * config.spreadAmplitudeWorld;
  const driftX = (data.randomY[index] - 0.5) * spreadFactor;
  const driftZ = (data.randomZ[index] - 0.5) * spreadFactor;
  const microDriftX =
    Math.sin(
      grainFall * config.microDriftFrequency[0] +
        data.randomY[index] * config.microDriftSeedMultiplier,
    ) *
    config.microDriftAmplitudeWorld *
    spreadFactor;
  const microDriftZ =
    Math.cos(
      grainFall * config.microDriftFrequency[1] +
        data.randomZ[index] * config.microDriftSeedMultiplier,
    ) *
    config.microDriftAmplitudeWorld *
    spreadFactor;
  data.positions[outputOffset] =
    startX + (endX - startX) * grainFall + driftX + microDriftX;
  data.positions[outputOffset + 1] =
    startY + (endY - startY) * grainFall * grainFall;
  data.positions[outputOffset + 2] =
    startZ + (endZ - startZ) * grainFall + driftZ + microDriftZ;
}

export function updatePowderParticlePositions(
  data: PowderParticleData,
  progress: number,
  relativeMatrix: Matrix4Tuple,
): number {
  const config = POWDER_PARTICLE_CONFIG;
  const fallProgress = range(progress, ...config.fall.progress);
  const leave = smoothstep(range(progress, ...config.fall.sieveLeaveProgress));
  for (let index = 0; index < data.sizes.length; index += 1) {
    const outputOffset = index * 3;
    if (progress < config.fall.progress[1]) {
      writeClumpPosition(data, index, fallProgress, outputOffset);
    } else if (progress < data.delay[index]) {
      writeSievePosition(data, index, leave, outputOffset);
    } else {
      writeFallingPosition(
        data,
        index,
        progress,
        relativeMatrix,
        outputOffset,
      );
    }
  }
  const dissolve =
    range(progress, ...config.dissolve.pourProgress) *
      config.dissolve.pourMultiplier +
    range(progress, ...config.dissolve.whiskProgress) *
      config.dissolve.whiskMultiplier;
  return Math.max(0, 1 - dissolve);
}
