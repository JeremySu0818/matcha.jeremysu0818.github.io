import { describe, expect, it } from "vitest";
import { FOAM_SURFACE_CONFIG, WATER_FILL_CONFIG } from "./liquids";

describe("liquid scene configuration", () => {
  it("keeps the final matcha surface at the filled water level", () => {
    expect(FOAM_SURFACE_CONFIG.positionWorld[1]).toBe(
      WATER_FILL_CONFIG.geometry.yTopWorld,
    );
  });
});
