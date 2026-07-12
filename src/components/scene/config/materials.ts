export type RitualMaterialName =
  | "bamboo"
  | "bambooDark"
  | "black"
  | "ceramicInner"
  | "ceramicOuter"
  | "darkSteel"
  | "steel";

interface RitualMaterialPreset {
  readonly clearcoat?: number;
  readonly clearcoatRoughness?: number;
  readonly color: string;
  readonly environmentIntensity?: number;
  readonly metalness: number;
  readonly roughness: number;
  readonly sheen?: number;
  readonly sheenColor?: string;
}

export const RITUAL_MATERIAL_ALIASES = new Map<string, RitualMaterialName>([
  ["cha_sen", "bamboo"],
  ["himo", "bambooDark"],
  ["material0", "ceramicOuter"],
]);

export const RITUAL_MATERIAL_CONFIG = {
  bamboo: {
    color: "#d8b470",
    metalness: 0,
    roughness: 0.65,
    sheen: 0.12,
    sheenColor: "#f0d898",
  },
  bambooDark: {
    color: "#9e7845",
    metalness: 0,
    roughness: 0.72,
    sheen: 0.08,
    sheenColor: "#c8a060",
  },
  black: {
    color: "#1e211c",
    environmentIntensity: 0.8,
    metalness: 0.35,
    roughness: 0.35,
  },
  ceramicInner: {
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
    color: "#e8e0cf",
    environmentIntensity: 0.85,
    metalness: 0,
    roughness: 0.38,
    sheen: 0.08,
    sheenColor: "#f8f3e8",
  },
  ceramicOuter: {
    clearcoat: 0.38,
    clearcoatRoughness: 0.4,
    color: "#ddd5c4",
    environmentIntensity: 0.9,
    metalness: 0,
    roughness: 0.45,
    sheen: 0.1,
    sheenColor: "#f5efe3",
  },
  darkSteel: {
    color: "#8a908a",
    environmentIntensity: 1.2,
    metalness: 0.88,
    roughness: 0.22,
  },
  steel: {
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    color: "#d0d2ce",
    environmentIntensity: 1.4,
    metalness: 0.94,
    roughness: 0.16,
  },
} as const satisfies Readonly<Record<RitualMaterialName, RitualMaterialPreset>>;
