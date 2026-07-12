import { describe, expect, it } from "vitest";
import {
  getContextAction,
  getDragCompletion,
  getManualIdlePositions,
  sampleChasenW,
} from "./manualRitual";

describe("manual ritual state transitions", () => {
  const bowlPosition = [0.11, 1, 0] as const;
  const distantPosition = [3, 1, 3] as const;
  const expectPosition = (
    actual: readonly [number, number, number],
    expected: readonly [number, number, number],
  ): void => {
    expected.forEach((value, index) => {
      expect(actual[index]).toBeCloseTo(value, 12);
    });
  };

  it("preserves desktop and mobile tool staging positions", () => {
    const desktopPositions = getManualIdlePositions(false, "manual");
    const mobilePositions = getManualIdlePositions(true, "manual");
    expectPosition(desktopPositions.chasen, [-1.01, -0.9885, 3]);
    expectPosition(desktopPositions.kettle, [0.49, -1.22, 3]);
    expectPosition(desktopPositions.sieve, [0.3, -0.8505, -2.5]);
    expectPosition(mobilePositions.chasen, [-2, -0.9885, -0.8]);
    expectPosition(mobilePositions.kettle, [-2, -1.22, 0.8]);
    expectPosition(mobilePositions.sieve, [2, -0.8505, 0]);
  });

  it("requires each tool to reach the bowl before advancing", () => {
    expect(getDragCompletion("sieve", "sieve-drag", distantPosition)).toEqual({
      placement: "idle",
    });
    expect(getDragCompletion("sieve", "sieve-drag", bowlPosition)).toEqual({
      nextStage: "sieve-ready",
      placement: "use",
      progress: 0.18,
    });
    expect(getDragCompletion("kettle", "kettle-drag", bowlPosition)).toEqual({
      nextStage: "kettle-ready",
      placement: "use",
      progress: 0.49,
    });
    expect(getDragCompletion("chasen", "chasen-drag", bowlPosition)).toEqual({
      nextStage: "whisking",
      placement: "dragged-use-height",
      progress: 0.76,
      resetWhisk: true,
    });
  });

  it("preserves return and completion stages", () => {
    expect(getDragCompletion("sieve", "sieve-return", distantPosition)).toEqual({
      minimumProgress: 0.49,
      nextStage: "kettle-drag",
      placement: "idle",
    });
    expect(getDragCompletion("kettle", "kettle-return", distantPosition)).toEqual({
      minimumProgress: 0.68,
      nextStage: "chasen-drag",
      placement: "idle",
    });
    expect(getDragCompletion("chasen", "chasen-return", distantPosition)).toEqual({
      complete: true,
      placement: "idle",
    });
  });

  it("preserves context-menu animation timing", () => {
    expect(getContextAction("sieve", "sieve-ready")).toEqual({
      durationMs: 4200,
      fromProgress: 0.18,
      nextStage: "sieve-return",
      progressAfterAnimation: 0.49,
      stageDuringAnimation: "sieve-shaking",
    });
    expect(getContextAction("kettle", "kettle-ready")).toEqual({
      durationMs: 2700,
      fromProgress: 0.49,
      nextStage: "kettle-return",
      progressAfterAnimation: 0.66,
      stageDuringAnimation: "pouring",
    });
  });

  it("keeps the whisk path closed and deterministic", () => {
    expect(sampleChasenW(0)).toEqual([-0.1596, -0.2926]);
    expect(sampleChasenW(8 / 10.8)).toEqual([-0.1596, -0.2926]);
  });
});
