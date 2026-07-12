import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShadeSimulator } from "./ShadeSimulator";

describe("shade simulator", () => {
  it("preserves the observed full-shade readings", () => {
    const { container, getByRole } = render(<ShadeSimulator lang="en" />);
    const slider = getByRole("slider", { name: "Shade Cultivation Simulation" });
    fireEvent.input(slider, { target: { value: "100" } });
    expect(container.querySelector(".shade-instrument__value")?.textContent).toBe("100%");
    expect(
      Array.from(container.querySelectorAll(".shade-reading strong"), (element) =>
        element.textContent,
      ),
    ).toEqual(["100%", "100%", "25%"]);
  });
});
