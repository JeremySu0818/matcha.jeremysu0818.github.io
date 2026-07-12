import { MeshPhysicalMaterial, type Material } from "three";
import {
  RITUAL_MATERIAL_ALIASES,
  RITUAL_MATERIAL_CONFIG,
  type RitualMaterialName,
} from "./config/materials";

function isRitualMaterialName(name: string): name is RitualMaterialName {
  return Object.hasOwn(RITUAL_MATERIAL_CONFIG, name);
}

function createRitualMaterial(name: RitualMaterialName): MeshPhysicalMaterial {
  const preset = RITUAL_MATERIAL_CONFIG[name];
  const next = new MeshPhysicalMaterial();
  next.color.set(preset.color);
  next.metalness = preset.metalness;
  next.roughness = preset.roughness;
  if ("environmentIntensity" in preset) {
    next.envMapIntensity = preset.environmentIntensity;
  }
  if ("clearcoat" in preset) next.clearcoat = preset.clearcoat;
  if ("clearcoatRoughness" in preset) {
    next.clearcoatRoughness = preset.clearcoatRoughness;
  }
  if ("sheen" in preset) next.sheen = preset.sheen;
  if ("sheenColor" in preset) next.sheenColor.set(preset.sheenColor);
  next.needsUpdate = true;
  return next;
}

function normalizeMaterialName(materialName: string): string {
  return RITUAL_MATERIAL_ALIASES.get(materialName) ?? materialName;
}

export function applyModelMaterial(material: Material): Material {
  const materialName = normalizeMaterialName(material.name);
  return isRitualMaterialName(materialName)
    ? createRitualMaterial(materialName)
    : material.clone();
}
