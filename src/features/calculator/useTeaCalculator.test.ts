import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTeaCalculator } from "./useTeaCalculator";

describe("useTeaCalculator", () => {
  it("preserves teaType tab when reset is called", () => {
    const { result } = renderHook(() => useTeaCalculator());

    act(() => {
      result.current.setTeaType("koicha");
    });
    expect(result.current.teaType).toBe("koicha");

    act(() => {
      result.current.update({ serving: 99 });
    });
    expect(result.current.current.serving).toBe(99);

    act(() => {
      result.current.reset();
    });

    expect(result.current.teaType).toBe("koicha");
    expect(result.current.current.serving).not.toBe(99);
  });
});
