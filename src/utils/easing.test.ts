import { describe, expect, it } from "vitest";
import { clamp, mix, range, smoothstep } from "./easing";

describe("scene easing", () => {
  it("preserves clamping and interpolation behavior", () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(clamp(3, 2, 4)).toBe(3);
    expect(range(0.5, 0.25, 0.75)).toBe(0.5);
    expect(smoothstep(0.5)).toBe(0.5);
    expect(mix(10, 20, 0.25)).toBe(12.5);
  });
});
