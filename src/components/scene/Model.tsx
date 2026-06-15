import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { Mesh, type Group } from "three";
import { applyModelMaterial } from "./modelMaterials";

type ModelProps = ThreeElements["group"] & {
  src: string;
  keepOriginalMaterials?: boolean;
};

export function Model({ src, keepOriginalMaterials, ...props }: ModelProps) {
  const gltf = useGLTF(src);

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

      object.material = Array.isArray(object.material)
        ? object.material.map(applyModelMaterial)
        : applyModelMaterial(object.material);
    });

    return scene;
  }, [gltf.scene, keepOriginalMaterials]);

  return (
    <group {...props}>
      <primitive object={clone} />
    </group>
  );
}
