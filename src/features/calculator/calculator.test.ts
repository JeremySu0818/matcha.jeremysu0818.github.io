import { describe, expect, it } from "vitest";
import { calculateRecipe, calculateWaterMix } from "./calculator";
import { getDefaultValues } from "./calculatorDefaults";

describe("calculator domain", () => {
  it("preserves every default recipe input", () => {
    expect(getDefaultValues()).toEqual({
      koicha: {
        coldTemperature: 0,
        concentration: 12.5,
        hotTemperature: 100,
        milkRatio: 3.75,
        serving: 40,
        temperature: 70,
      },
      latte: {
        coldTemperature: 0,
        concentration: 10,
        hotTemperature: 100,
        milkRatio: 3.75,
        serving: 380,
        temperature: 75,
      },
      usucha: {
        coldTemperature: 0,
        concentration: 2.86,
        hotTemperature: 100,
        milkRatio: 3.75,
        serving: 70,
        temperature: 75,
      },
    });
  });

  it("keeps the observed 75 degree water mix", () => {
    expect(calculateWaterMix(70, 75, 0, 100)).toEqual({
      coldMl: 17,
      hotMl: 53,
    });
  });

  it("handles temperature boundaries without invalid ratios", () => {
    expect(calculateWaterMix(70, 100, 0, 100)).toEqual({ coldMl: 0, hotMl: 70 });
    expect(calculateWaterMix(70, 0, 0, 100)).toEqual({ coldMl: 70, hotMl: 0 });
    expect(calculateWaterMix(70, 50, 20, 20)).toEqual({ coldMl: 0, hotMl: 70 });
  });

  it("keeps the observed customized latte result", () => {
    expect(
      calculateRecipe("latte", 120, 12, 70, 100 / 4.75, 20, 90),
    ).toEqual({
      coldTemperature: 20,
      coldWaterMl: 7,
      hotTemperature: 90,
      hotWaterMl: 18,
      milkMl: 95,
      powderG: 3,
      targetTemperature: 70,
      waterMl: 25,
    });
  });
});
