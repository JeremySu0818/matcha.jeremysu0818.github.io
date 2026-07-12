import { beforeEach, describe, expect, it } from "vitest";
import {
  readSavedCalculatorValues,
  readSavedTeaType,
} from "./calculatorStorage";

describe("calculator persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores valid saved values without losing defaults", () => {
    localStorage.setItem(
      "matcha_tea_calculator_values",
      JSON.stringify({ latte: { serving: 120, milkRatio: 3 } }),
    );
    const values = readSavedCalculatorValues();
    expect(values.latte.serving).toBe(120);
    expect(values.latte.milkRatio).toBe(3);
    expect(values.latte.temperature).toBe(75);
  });

  it("falls back cleanly for malformed storage", () => {
    localStorage.setItem("matcha_tea_type", "invalid");
    localStorage.setItem("matcha_tea_calculator_values", "{");
    expect(readSavedTeaType()).toBe("usucha");
    expect(readSavedCalculatorValues().usucha.serving).toBe(70);
  });
});
