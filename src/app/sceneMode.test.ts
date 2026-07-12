import { beforeEach, describe, expect, it } from "vitest";
import {
  readSceneMode,
  saveSceneMode,
  SCENE_MODE_STORAGE_KEY,
} from "./sceneMode";

describe("scene mode persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to manual mode", () => {
    expect(readSceneMode()).toBe("manual");
  });

  it("round-trips the existing storage key", () => {
    saveSceneMode("scroll");
    expect(localStorage.getItem(SCENE_MODE_STORAGE_KEY)).toBe("scroll");
    expect(readSceneMode()).toBe("scroll");
  });

  it("ignores an invalid persisted value", () => {
    localStorage.setItem(SCENE_MODE_STORAGE_KEY, "invalid");
    expect(readSceneMode()).toBe("manual");
  });
});
