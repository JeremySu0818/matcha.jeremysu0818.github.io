export type SceneMode = "scroll" | "manual";

export const SCENE_MODE_STORAGE_KEY = "matcha_scene_mode";

export const SCENE_MODES: readonly SceneMode[] = ["scroll", "manual"];

function isSceneMode(value: string | null): value is SceneMode {
  return value === "scroll" || value === "manual";
}

export function readSceneMode(): SceneMode {
  if (typeof window === "undefined") {
    return "manual";
  }

  const saved = window.localStorage.getItem(SCENE_MODE_STORAGE_KEY);
  return isSceneMode(saved) ? saved : "manual";
}

export function saveSceneMode(mode: SceneMode): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SCENE_MODE_STORAGE_KEY, mode);
}
