import { MeshPhysicalMaterial, type Material } from 'three';

const materialNames = [
  'steel',
  'darkSteel',
  'black',
  'bamboo',
  'bambooDark',
  'ceramicOuter',
  'ceramicInner',
];

function normalizeMaterialName(materialName: string) {
  if (materialName === 'material0') {
    return 'ceramicOuter';
  }

  if (materialName === 'cha_sen') {
    return 'bamboo';
  }

  if (materialName === 'himo') {
    return 'bambooDark';
  }

  return materialName;
}

export function applyModelMaterial(material: Material) {
  const materialName = normalizeMaterialName(material.name);

  if (!materialNames.includes(materialName)) {
    return material.clone();
  }

  const next = new MeshPhysicalMaterial();

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
  }

  next.needsUpdate = true;
  return next;
}
