import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from 'three';
import { range, smoothstep } from '../../utils/easing';

type PowderParticlesProps = {
  progress: number;
  count: number;
};

type Grain = {
  start: Vector3;
  end: Vector3;
  drift: Vector3;
  size: number;
  delay: number;
  phase: number;
};

const dummy = new Object3D();
const colorA = new Color('#5c8a3e');
const colorB = new Color('#a8c870');
const colorC = new Color('#7aaa52');

function seeded(index: number) {
  const x = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function PowderParticles({ progress, count }: PowderParticlesProps) {
  const meshRef = useRef<InstancedMesh<SphereGeometry, MeshStandardMaterial>>(null);
  const grains = useMemo<Grain[]>(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = seeded(index) * Math.PI * 2;
        const radius = seeded(index + 13) * 0.78;
        const endRadius = Math.sqrt(seeded(index + 29)) * 0.78;
        const endAngle = seeded(index + 41) * Math.PI * 2;

        return {
          start: new Vector3(
            Math.cos(angle) * radius * 0.9,
            3.2 + seeded(index + 7) * 1.9,
            Math.sin(angle) * radius * 0.62,
          ),
          end: new Vector3(Math.cos(endAngle) * endRadius, 0.74, Math.sin(endAngle) * endRadius),
          drift: new Vector3(
            (seeded(index + 5) - 0.5) * 0.38,
            0,
            (seeded(index + 17) - 0.5) * 0.28,
          ),
          size: 0.015 + seeded(index + 23) * 0.024,
          delay: seeded(index + 31) * 0.34,
          phase: seeded(index + 47) * Math.PI * 2,
        };
      }),
    [count],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const fall = range(progress, 0.14, 0.3);
    const sift = smoothstep(range(progress, 0.31, 0.45));
    const settle = smoothstep(range(progress, 0.25, 0.38));
    const opacity = Math.max(range(progress, 0.11, 0.16), 1 - range(progress, 0.56, 0.64) * 0.72);

    grains.forEach((grain, index) => {
      const local = smoothstep(Math.max(0, Math.min(1, (fall - grain.delay * 0.42) / 0.72)));
      const gravity = local * local;
      const fine = 1 - sift * 0.46;
      const suspended = Math.sin(clock.elapsedTime * 2.2 + grain.phase) * 0.015 * (1 - settle);

      dummy.position.copy(grain.start).lerp(grain.end, gravity);
      dummy.position.addScaledVector(grain.drift, Math.sin(local * Math.PI) * 0.68);
      dummy.position.y += suspended;
      dummy.scale.setScalar(grain.size * fine * Math.max(0.55, opacity));
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(index, dummy.matrix as Matrix4);

      const t = seeded(index + 59);
      const particleColor = t < 0.33
        ? colorA.clone().lerp(colorC, t * 3)
        : colorC.clone().lerp(colorB, (t - 0.33) * 1.5);
      meshRef.current!.setColorAt(index, particleColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.material.opacity = Math.max(0, opacity);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial
        color="#6a9a48"
        roughness={0.88}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
