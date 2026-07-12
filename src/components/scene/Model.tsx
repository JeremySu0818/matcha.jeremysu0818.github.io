import { useEffect, useMemo, type JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { type Material, Mesh } from "three";
import { applyModelMaterial } from "./modelMaterials";
import type { ThreeElements } from "@react-three/fiber";

type ModelProps = ThreeElements["group"] & {
  readonly src: string;
  readonly keepOriginalMaterials?: boolean;
};

interface PreparedModel {
  readonly materials: ReadonlySet<Material>;
  readonly scene: ThreeElements["primitive"]["object"];
}

function isModelMesh(object: object): object is Mesh {
  return object instanceof Mesh;
}

export function Model({
  src,
  keepOriginalMaterials,
  ...props
}: Readonly<ModelProps>): JSX.Element {
  const gltf = useGLTF(src);

  const prepared = useMemo<PreparedModel>(() => {
    const scene = gltf.scene.clone(true);
    const materials = new Set<Material>();

    scene.traverse((object) => {
      if (!isModelMesh(object)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (keepOriginalMaterials) return;

      object.material = Array.isArray(object.material)
        ? object.material.map(applyModelMaterial)
        : applyModelMaterial(object.material);
      if (Array.isArray(object.material)) {
        for (const material of object.material) materials.add(material);
      } else {
        materials.add(object.material);
      }
    });

    return { materials, scene };
  }, [gltf.scene, keepOriginalMaterials]);

  useEffect(
    () => () => {
      for (const material of prepared.materials) material.dispose();
    },
    [prepared],
  );

  return (
    <group {...props}>
      <primitive object={prepared.scene} />
    </group>
  );
}
