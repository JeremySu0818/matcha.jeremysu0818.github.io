import { beforeEach, describe, expect, it } from "vitest";
import {
  clearSavedScrollPosition,
  getScrollPositionForRoute,
  readSavedScrollPosition,
  registerScrollPositionGetter,
  saveScrollPosition,
} from "./scrollRegistry";

describe("scroll registry", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("normalizes both home route forms", () => {
    const unregister = registerScrollPositionGetter("", () => 124.6);
    expect(getScrollPositionForRoute("#")).toBeCloseTo(124.6, 12);
    unregister();
    expect(getScrollPositionForRoute("#")).toBe(0);
  });

  it("uses the existing session storage contract", () => {
    saveScrollPosition("#3d", 97.6);
    expect(sessionStorage.getItem("matcha_scroll_route")).toBe("#3d");
    expect(sessionStorage.getItem("matcha_scroll_position")).toBe("98");
    expect(readSavedScrollPosition("#3d")).toBe(98);
    expect(readSavedScrollPosition("#make")).toBeNull();
    clearSavedScrollPosition();
    expect(readSavedScrollPosition("#3d")).toBeNull();
  });
});
