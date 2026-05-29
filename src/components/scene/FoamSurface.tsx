import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { CylinderGeometry, Mesh, MeshPhysicalMaterial, RepeatWrapping, SRGBColorSpace } from 'three';
import { mix, range, smoothstep } from '../../utils/easing';

type FoamSurfaceProps = {
  progress: number;
  textureUrl: string;
};

export function FoamSurface({ progress, textureUrl }: FoamSurfaceProps) {
  const meshRef = useRef<Mesh<CylinderGeometry, MeshPhysicalMaterial>>(null);
  const texture = useTexture(textureUrl);

  const geometry = useMemo(() => new CylinderGeometry(1.08, 1.02, 0.035, 128), []);

  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.4, 1.4);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    const water = smoothstep(range(progress, 0.43, 0.58));
    const whisk = smoothstep(range(progress, 0.62, 0.82));
    const final = smoothstep(range(progress, 0.78, 0.98));

    meshRef.current.scale.setScalar(mix(0.18, 1, Math.max(water, whisk, final)));
    meshRef.current.rotation.y = clock.elapsedTime * 0.1 + whisk * 1.2;
    meshRef.current.position.y = 0.645 + Math.sin(clock.elapsedTime * 1.4) * 0.003 * whisk;
    meshRef.current.material.opacity = mix(0, 0.94, Math.max(water * 0.7, whisk, final));
    meshRef.current.material.roughness = mix(0.65, 0.32, final);
    meshRef.current.material.clearcoat = mix(0.2, 0.55, final);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0.64, 0]} receiveShadow>
      <meshPhysicalMaterial
        map={texture}
        color="#7a9e52"
        transparent
        opacity={0}
        roughness={0.5}
        metalness={0}
        clearcoat={0.4}
        clearcoatRoughness={0.25}
        sheen={0.18}
        sheenColor="#a8c872"
        envMapIntensity={0.8}
      />
    </mesh>
  );
}
