import { describe, expect, it } from "vitest";
import { glslFloat } from "./glsl";

describe("glslFloat", () => {
  it.each([
    [300, "300.0"],
    [18, "18.0"],
    [-2, "-2.0"],
    [0.5, "0.5"],
  ] as const)("formats %s as a GLSL float", (value, expected) => {
    expect(glslFloat(value)).toBe(expected);
  });

  it("rejects non-finite values", () => {
    expect(() => glslFloat(Number.POSITIVE_INFINITY)).toThrow();
  });
});
