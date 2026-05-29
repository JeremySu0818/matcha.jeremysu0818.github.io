import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  MeshPhysicalMaterial,
  Object3D,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { range, smoothstep } from '../../utils/easing';

type WaterStreamProps = {
  progress: number;
  mobile: boolean;
};

const dummy = new Object3D();

export function WaterStream({ progress, mobile }: WaterStreamProps) {
  const streamRef = useRef<Group>(null);
  const dropletsRef = useRef<InstancedMesh<SphereGeometry, MeshPhysicalMaterial>>(null);
  const dropletCount = mobile ? 36 : 78;

  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(1.7, 2.14, 0.08),
        new Vector3(1.02, 1.65, 0.05),
        new Vector3(0.42, 1.08, 0.02),
        new Vector3(0.1, 0.82, 0),
      ]),
    [],
  );

  const tube = useMemo(() => new TubeGeometry(curve, 96, 0.022, 14, false), [curve]);

  useFrame(({ clock }) => {
    const pour = smoothstep(range(progress, 0.46, 0.58)) * (1 - smoothstep(range(progress, 0.61, 0.68)));

    if (streamRef.current) {
      streamRef.current.visible = pour > 0.02;
      streamRef.current.scale.setScalar(0.65 + pour * 0.5);
      streamRef.current.children.forEach((child) => {
        if ('material' in child && child.material instanceof MeshPhysicalMaterial) {
          child.material.opacity = pour * 0.58;
        }
      });
    }

    if (!dropletsRef.current) {
      return;
    }

    for (let index = 0; index < dropletCount; index += 1) {
      const offset = (index / dropletCount + clock.elapsedTime * 0.46) % 1;
      const point = curve.getPoint(offset);
      const jitter = Math.sin(index * 3.41 + clock.elapsedTime * 8) * 0.03;

      dummy.position.set(point.x + jitter * 0.25, point.y - offset * 0.06, point.z + jitter);
      dummy.scale.setScalar((0.012 + (index % 5) * 0.002) * pour);
      dummy.updateMatrix();
      dropletsRef.current.setMatrixAt(index, dummy.matrix as Matrix4);
    }

    dropletsRef.current.instanceMatrix.needsUpdate = true;
    dropletsRef.current.material.opacity = pour * 0.65;
  });

  return (
    <group ref={streamRef}>
      <mesh geometry={tube}>
        <meshPhysicalMaterial
          color="#d8f0e8"
          roughness={0.04}
          transmission={0.65}
          thickness={0.5}
          ior={1.33}
          transparent
          opacity={0}
          depthWrite={false}
          envMapIntensity={1.5}
        />
      </mesh>
      <instancedMesh ref={dropletsRef} args={[undefined, undefined, dropletCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshPhysicalMaterial
          color="#c8e8dc"
          roughness={0.03}
          transmission={0.5}
          thickness={0.3}
          ior={1.33}
          transparent
          opacity={0}
          depthWrite={false}
          envMapIntensity={1.2}
        />
      </instancedMesh>
      <mesh position={[0.12, 0.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 0.018, 48]} />
        <meshPhysicalMaterial
          color="#8aad5e"
          roughness={0.35}
          transparent
          opacity={0.25}
          clearcoat={0.3}
          clearcoatRoughness={0.3}
        />
      </mesh>
    </group>
  );
}
