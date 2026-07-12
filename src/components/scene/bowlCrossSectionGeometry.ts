import {
  CircleGeometry,
  type Group,
  Mesh,
  type Object3D,
  Shape,
  ShapeGeometry,
  Vector3,
} from "three";

interface CircleFallback {
  readonly kind: "circle";
  readonly radiusWorld: number;
  readonly segments: number;
}

interface ShapeFallback {
  readonly kind: "shape";
  readonly radiusWorld: number;
}

interface BowlCrossSectionConfig {
  readonly bowlModelYWorld: number;
  readonly bowlScaleRatio: number;
  readonly fallback: CircleFallback | ShapeFallback;
  readonly insetRatio: number;
  readonly radialBins: number;
  readonly sampleBandWorld: number;
  readonly sectionYWorld: number;
  readonly smoothingRadiusBins: number;
}

interface SectionSample {
  readonly x: number;
  readonly z: number;
}

interface SectionBounds {
  readonly maximumX: number;
  readonly maximumZ: number;
  readonly minimumX: number;
  readonly minimumZ: number;
}

function isGeometryMesh(object: Object3D): object is Mesh {
  return object instanceof Mesh;
}

function collectSectionSamples(
  bowlScene: Group,
  config: BowlCrossSectionConfig,
): SectionSample[] {
  const sectionY =
    (config.sectionYWorld - config.bowlModelYWorld) /
    config.bowlScaleRatio;
  const samples: SectionSample[] = [];
  const vertex = new Vector3();
  bowlScene.updateMatrixWorld(true);
  bowlScene.traverse((object) => {
    if (!isGeometryMesh(object)) return;
    const position = object.geometry.getAttribute("position");
    for (let index = 0; index < position.count; index += 1) {
      vertex
        .fromBufferAttribute(position, index)
        .applyMatrix4(object.matrixWorld);
      if (Math.abs(vertex.y - sectionY) <= config.sampleBandWorld) {
        samples.push({ x: vertex.x, z: vertex.z });
      }
    }
  });
  return samples;
}

function createFallbackGeometry(
  fallback: CircleFallback | ShapeFallback,
): CircleGeometry | ShapeGeometry {
  if (fallback.kind === "circle") {
    return new CircleGeometry(fallback.radiusWorld, fallback.segments);
  }
  const shape = new Shape();
  shape.absarc(0, 0, fallback.radiusWorld, 0, Math.PI * 2, false);
  return new ShapeGeometry(shape);
}

function getSectionBounds(samples: readonly SectionSample[]): SectionBounds {
  let minimumX = Infinity;
  let maximumX = -Infinity;
  let minimumZ = Infinity;
  let maximumZ = -Infinity;
  for (const sample of samples) {
    minimumX = Math.min(minimumX, sample.x);
    maximumX = Math.max(maximumX, sample.x);
    minimumZ = Math.min(minimumZ, sample.z);
    maximumZ = Math.max(maximumZ, sample.z);
  }
  return { maximumX, maximumZ, minimumX, minimumZ };
}

function measureInnerRadii(
  samples: readonly SectionSample[],
  bins: number,
  centerX: number,
  centerZ: number,
): number[] {
  const innerRadii = new Array<number>(bins).fill(Infinity);
  for (const sample of samples) {
    const angle = Math.atan2(sample.z - centerZ, sample.x - centerX);
    const bin =
      Math.floor(((angle + Math.PI) / (Math.PI * 2)) * bins) % bins;
    const radius = Math.hypot(sample.x - centerX, sample.z - centerZ);
    innerRadii[bin] = Math.min(innerRadii[bin], radius);
  }
  return innerRadii;
}

function fillMissingRadii(innerRadii: readonly number[]): number[] {
  const bins = innerRadii.length;
  const finiteRadii = innerRadii.filter(Number.isFinite);
  const fallbackRadius =
    finiteRadii.length > 0
      ? finiteRadii.reduce((sum, radius) => sum + radius, 0) /
        finiteRadii.length
      : 0.5;
  return innerRadii.map((radius, index) => {
    if (Number.isFinite(radius)) return radius;
    for (let offset = 1; offset < bins / 2; offset += 1) {
      const previous = innerRadii[(index - offset + bins) % bins];
      const next = innerRadii[(index + offset) % bins];
      if (Number.isFinite(previous) && Number.isFinite(next)) {
        return (previous + next) / 2;
      }
      if (Number.isFinite(previous)) return previous;
      if (Number.isFinite(next)) return next;
    }
    return fallbackRadius;
  });
}

function smoothRadii(
  radii: readonly number[],
  smoothingRadiusBins: number,
): number[] {
  const bins = radii.length;
  return Array.from(radii.keys(), (index) => {
    let sum = 0;
    let count = 0;
    for (
      let offset = -smoothingRadiusBins;
      offset <= smoothingRadiusBins;
      offset += 1
    ) {
      sum += radii[(index + offset + bins) % bins];
      count += 1;
    }
    return sum / count;
  });
}

function createSectionShape(
  radii: readonly number[],
  centerX: number,
  centerZ: number,
  config: BowlCrossSectionConfig,
): ShapeGeometry {
  const points = radii.map((radius, index) => {
    const angle = (index / config.radialBins) * Math.PI * 2 - Math.PI;
    const insetRadius =
      radius * config.bowlScaleRatio * config.insetRatio;
    return [
      centerX * config.bowlScaleRatio + Math.cos(angle) * insetRadius,
      centerZ * config.bowlScaleRatio + Math.sin(angle) * insetRadius,
    ] as const;
  });
  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    shape.lineTo(points[index][0], points[index][1]);
  }
  shape.closePath();
  return new ShapeGeometry(shape);
}

export function createBowlCrossSectionGeometry(
  bowlScene: Group,
  config: BowlCrossSectionConfig,
): CircleGeometry | ShapeGeometry {
  const samples = collectSectionSamples(bowlScene, config);
  if (samples.length === 0) return createFallbackGeometry(config.fallback);
  const bounds = getSectionBounds(samples);
  const centerX = (bounds.minimumX + bounds.maximumX) / 2;
  const centerZ = (bounds.minimumZ + bounds.maximumZ) / 2;
  const measuredRadii = measureInnerRadii(
    samples,
    config.radialBins,
    centerX,
    centerZ,
  );
  const filledRadii = fillMissingRadii(measuredRadii);
  const smoothedRadii = smoothRadii(
    filledRadii,
    config.smoothingRadiusBins,
  );
  return createSectionShape(smoothedRadii, centerX, centerZ, config);
}
