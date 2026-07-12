import { beforeEach, describe, expect, it } from "vitest";
import { getBrowserLanguage, SUPPORTED_LANGUAGES } from "./language";
import { localeCopies } from "./locales";

function collectEmptyCopyPaths(value: unknown, path: readonly string[] = []): string[] {
  if (typeof value === "string") {
    return value.trim().length === 0 ? [path.join(".")] : [];
  }
  if (typeof value !== "object" || value === null) {
    return [];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    collectEmptyCopyPaths(child, [...path, key]),
  );
}

describe("internationalization contract", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides complete non-empty copy for all twenty languages", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(20);
    expect(Object.keys(localeCopies)).toEqual([...SUPPORTED_LANGUAGES]);
    for (const language of SUPPORTED_LANGUAGES) {
      expect(collectEmptyCopyPaths(localeCopies[language])).toEqual([]);
    }
  });

  it("keeps every localized tool bound to the same public assets", () => {
    const expectedTools = [
      { id: "chawan", modelSrc: "/models/tea-bowl.glb", scale: 1 },
      { id: "chasen", modelSrc: "/models/chasen.glb", scale: 1.2 },
      { id: "chashaku", modelSrc: "/models/chashaku.glb", scale: 1.5 },
    ];
    for (const language of SUPPORTED_LANGUAGES) {
      expect(
        localeCopies[language].tools.tools.map(({ id, modelSrc, scale }) => ({
          id,
          modelSrc,
          scale,
        })),
      ).toEqual(expectedTools);
    }
  });

  it("uses the existing language storage key", () => {
    localStorage.setItem("matcha_language", "ar");
    expect(getBrowserLanguage()).toBe("ar");
    localStorage.setItem("matcha_language", "unsupported");
    expect(getBrowserLanguage()).not.toBe("unsupported");
  });
});
