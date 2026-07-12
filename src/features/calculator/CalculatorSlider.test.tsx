import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CalculatorSlider } from "./CalculatorSlider";

describe("calculator slider keyboard input", () => {
  it("accepts a typed value and restores the controlled value on blur", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CalculatorSlider
        label="Concentration"
        value={2.86}
        min={2}
        max={4}
        step={0.01}
        unit="g/100ml"
        onChange={onChange}
      />,
    );
    const numberInput = screen.getByRole("spinbutton", {
      name: "Concentration",
    });
    await user.clear(numberInput);
    await user.type(numberInput, "3.5");
    expect(onChange).toHaveBeenLastCalledWith(3.5);
    await user.tab();
    if (!(numberInput instanceof HTMLInputElement)) {
      throw new Error("Calculator value control is not an input element.");
    }
    expect(numberInput.value).toBe("2.86");
  });
});
