import { describe, expect, it } from "vitest";
import { getSceneStepTarget } from "./ritualNavigation";

describe("ritual navigation", () => {
  it("maps six steps across the existing scroll distance", () => {
    const element = document.createElement("div");
    Object.defineProperties(element, {
      clientHeight: { value: 900 },
      scrollHeight: { value: 6300 },
    });
    expect(getSceneStepTarget(element, 0, 6)).toEqual({ index: 0, top: 0 });
    expect(getSceneStepTarget(element, 3, 6)).toEqual({ index: 3, top: 3240 });
    expect(getSceneStepTarget(element, 9, 6)).toEqual({ index: 5, top: 5400 });
  });
});
