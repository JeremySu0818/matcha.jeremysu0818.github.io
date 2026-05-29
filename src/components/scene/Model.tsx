import { useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import {
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Group,
  type Material,
  type Texture,
} from 'three';

type ModelProps = ThreeElements['group'] & {
  src: string;
  keepOriginalMaterials?: boolean;
};

export function Model({ src, keepOriginalMaterials, ...props }: ModelProps) {
  const gltf = useGLTF(src);
  const ceramic = useTexture(`${import.meta.env.BASE_URL}textures/ceramic-glaze.png`);
  const bamboo = useTexture(`${import.meta.env.BASE_URL}textures/bamboo-fiber.png`);
  const steel = useTexture(`${import.meta.env.BASE_URL}textures/brushed-steel.png`);

  const textures = useMemo(() => {
    const configured = {
      ceramicOuter: ceramic,
      ceramicInner: ceramic,
      bamboo,
      bambooDark: bamboo,
      steel,
      darkSteel: steel,
      black: steel,
    };

    Object.values(configured).forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(1.35, 1.35);
      texture.needsUpdate = true;
    });

    bamboo.repeat.set(1.1, 1.8);
    steel.repeat.set(1.65, 1.1);

    return configured;
  }, [bamboo, ceramic, steel]);

  const clone = useMemo(() => {
    const scene = gltf.scene.clone(true) as Group;

    scene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }

      object.castShadow = true;
      object.receiveShadow = true;

      if (keepOriginalMaterials) {
        return;
      }

      const apply = (material: Material) => {
        let materialName = material.name as keyof typeof textures | 'material0' | 'cha_sen' | 'himo';
        
        if (materialName === 'material0') materialName = 'ceramicOuter';
        if (materialName === 'cha_sen') materialName = 'bamboo';
        if (materialName === 'himo') materialName = 'bambooDark';

        const texture = textures[materialName as keyof typeof textures] as Texture | undefined;

        if (texture || materialName === 'ceramicOuter' || materialName === 'bamboo' || materialName === 'bambooDark') {
          const next = new MeshPhysicalMaterial();
          if (texture) next.map = texture;

          if (materialName === 'steel') {
            next.color.set('#d0d2ce');
            next.metalness = 0.94;
            next.roughness = 0.16;
            next.envMapIntensity = 1.4;
            next.clearcoat = 0.15;
            next.clearcoatRoughness = 0.3;
          } else if (materialName === 'darkSteel') {
            next.color.set('#8a908a');
            next.metalness = 0.88;
            next.roughness = 0.22;
            next.envMapIntensity = 1.2;
          } else if (materialName === 'black') {
            next.color.set('#1e211c');
            next.metalness = 0.35;
            next.roughness = 0.35;
            next.envMapIntensity = 0.8;
          } else if (materialName === 'bamboo') {
            next.color.set('#d8b470');
            next.metalness = 0;
            next.roughness = 0.65;
            next.sheen = 0.12;
            next.sheenColor.set('#f0d898');
          } else if (materialName === 'bambooDark') {
            next.color.set('#9e7845');
            next.metalness = 0;
            next.roughness = 0.72;
            next.sheen = 0.08;
            next.sheenColor.set('#c8a060');
          } else if (materialName === 'ceramicOuter') {
            next.color.set('#ddd5c4');
            next.metalness = 0;
            next.roughness = 0.45;
            next.clearcoat = 0.38;
            next.clearcoatRoughness = 0.4;
            next.sheen = 0.1;
            next.sheenColor.set('#f5efe3');
            next.envMapIntensity = 0.9;
          } else if (materialName === 'ceramicInner') {
            next.color.set('#e8e0cf');
            next.metalness = 0;
            next.roughness = 0.38;
            next.clearcoat = 0.45;
            next.clearcoatRoughness = 0.35;
            next.sheen = 0.08;
            next.sheenColor.set('#f8f3e8');
            next.envMapIntensity = 0.85;
          } else {
            next.color.set('#f0e8d8');
            next.metalness = 0;
            next.roughness = 0.45;
          }

          next.needsUpdate = true;
          return next;
        }

        return material.clone();
      };

      object.material = Array.isArray(object.material)
        ? object.material.map(apply)
        : apply(object.material);
    });

    return scene;
  }, [gltf.scene, textures]);

  return (
    <group {...props}>
      <primitive object={clone} />
    </group>
  );
}
