import { useMemo, useRef, type RefObject } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  Matrix4,
  Group,
} from "three";
import { range, smoothstep } from "../../utils/easing";

type PowderParticlesProps = {
  count: number;
  mobile: boolean;
  progressRef?: RefObject<number>;
  bowlRef?: RefObject<Group | null>;
};

const vertexShader = `
  precision mediump float;
  uniform float uSize;
  attribute float aSize;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aSize * (300.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    vec3 color = mix(uColorA, uColorB, gl_PointCoord.y * 0.6 + 0.2);
    gl_FragColor = vec4(color, alpha * uOpacity * 0.85);
  }
`;

function seeded(index: number) {
  const x = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function PowderParticles({
  count,
  mobile,
  progressRef,
  bowlRef,
}: PowderParticlesProps) {
  const pointsRef = useRef<Points<BufferGeometry, ShaderMaterial>>(null);
  const scroll = useScroll();

  const [positions, sizes, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const rnd = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      sz[i] = 0.3 + seeded(i) * 0.7;
      rnd[i * 3] = seeded(i + 19);
      rnd[i * 3 + 1] = seeded(i + 53);
      rnd[i * 3 + 2] = seeded(i + 97);
    }
    return [pos, sz, rnd];
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    geom.setAttribute("position", new BufferAttribute(positions, 3));
    geom.setAttribute("aSize", new BufferAttribute(sizes, 1));
    return geom;
  }, [positions, sizes]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: mobile ? 0.06 : 0.18 },
      uOpacity: { value: 0 },
      uColorA: { value: new Color("#568339") },
      uColorB: { value: new Color("#9bbd63") },
    }),
    [mobile],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return;
    }

    const progress = progressRef?.current ?? scroll.offset;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    const fallProgress = range(progress, 0.18, 0.27);
    const leave = smoothstep(range(progress, 0.45, 0.53));
    const pourDissolve = range(progress, 0.52, 0.66) * 0.4;
    const whiskDissolve = range(progress, 0.76, 0.90) * 0.6;
    const dissolve = pourDissolve + whiskDissolve;
    const baseOpacity = 1.0 - dissolve;

    const relativeMatrix = new Matrix4();
    if (bowlRef?.current && pointsRef.current) {
      relativeMatrix.copy(pointsRef.current.matrixWorld).invert().multiply(bowlRef.current.matrixWorld);
    }
    const e = relativeMatrix.elements;

    for (let i = 0; i < count; i++) {
      const rx = randoms[i * 3];
      const ry = randoms[i * 3 + 1];
      const rz = randoms[i * 3 + 2];

      const angle = rx * Math.PI * 2;
      const radius = Math.sqrt(ry) * 0.35;

      const clumpOffsetX = Math.cos(angle) * radius;
      const clumpOffsetZ = Math.sin(angle) * radius;
      const clumpOffsetY = (rz - 0.5) * 0.55;

      const siftAngle = seeded(i + 211) * Math.PI * 2;
      const siftRadius = Math.sqrt(seeded(i + 263)) * 0.42;
      const siftOffsetX = Math.cos(siftAngle) * siftRadius;
      const siftOffsetZ = Math.sin(siftAngle) * siftRadius * 0.7;

      const angleLand = rz * Math.PI * 2;
      const radiusLand = Math.sqrt(rx) * 0.35;
      const landX = Math.cos(angleLand) * radiusLand;
      const landZ = Math.sin(angleLand) * radiusLand;

      const delay = 0.27 + rx * 0.07;

      let x = 0;
      let y = 0;
      let z = 0;

      if (progress < 0.27) {
        const clumpY = 3.6 - 1.82 * (fallProgress * fallProgress);
        const dragFactor = rx * 0.22;

        const currentOffsetX =
          clumpOffsetX + (siftOffsetX - clumpOffsetX) * fallProgress;
        const currentOffsetZ =
          clumpOffsetZ + (siftOffsetZ - clumpOffsetZ) * fallProgress;
        const currentOffsetY =
          (clumpOffsetY + dragFactor * fallProgress) * (1.0 - fallProgress);

        x = -0.08 + currentOffsetX;
        z = 0.01 + currentOffsetZ;
        y = clumpY + currentOffsetY;
      } else if (progress < delay) {
        const sieveZ = 0.01 + leave * 1.6;
        x = -0.08 + siftOffsetX;
        z = sieveZ + siftOffsetZ;
        y = 1.78;
      } else {
        const grainFall = range(progress, delay, delay + 0.15);

        const leaveDelay = smoothstep(range(delay, 0.45, 0.53));
        const sieveZDelay = 0.01 + leaveDelay * 1.6;

        const startX = -0.08 + siftOffsetX;
        const startY = 1.77;
        const startZ = sieveZDelay + siftOffsetZ;

        const endX = landX;
        const bowlColliderY = -0.45 + 1.2 * (radiusLand * radiusLand);

        const powderColliderY =
          0.08 * Math.exp(-(landX * landX + landZ * landZ) / 0.015);
        const endY = bowlColliderY + powderColliderY;
        const endZ = landZ;

        const finalX = e[0] * endX + e[4] * endY + e[8] * endZ + e[12];
        const finalY = e[1] * endX + e[5] * endY + e[9] * endZ + e[13];
        const finalZ = e[2] * endX + e[6] * endY + e[10] * endZ + e[14];

        if (grainFall < 1.0) {
          const spreadFactor = Math.sin(grainFall * Math.PI) * 0.18;
          const driftX = (ry - 0.5) * spreadFactor;
          const driftZ = (rz - 0.5) * spreadFactor;

          const microDriftX =
            Math.sin(grainFall * 4.5 + ry * 8) * 0.03 * spreadFactor;
          const microDriftZ =
            Math.cos(grainFall * 3.8 + rz * 8) * 0.03 * spreadFactor;

          const gravityFall = grainFall * grainFall;

          x = startX + (finalX - startX) * grainFall + driftX + microDriftX;
          y = startY + (finalY - startY) * gravityFall;
          z = startZ + (finalZ - startZ) * grainFall + driftZ + microDriftZ;
        } else {
          x = finalX;
          y = finalY;
          z = finalZ;
        }
      }

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;

    const mat = pointsRef.current.material as ShaderMaterial;
    if (mat && mat.uniforms) {
      mat.uniforms.uOpacity.value = Math.max(0, baseOpacity);
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
