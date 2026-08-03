import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateRecipe,
  TEA_CONFIGS,
  type CalculationResult,
  type TeaConfig,
  type TeaType,
} from "./calculator";
import {
  getDefaultValues,
  type CalculatorValue,
  type CalculatorValues,
} from "./calculatorDefaults";
import {
  readSavedCalculatorValues,
  readSavedTeaType,
  saveCalculatorValues,
  saveTeaType,
} from "./calculatorStorage";

export interface TeaCalculatorController {
  readonly config: TeaConfig;
  readonly current: CalculatorValue;
  readonly ratioDenominator: number;
  readonly reset: () => void;
  readonly result: CalculationResult;
  readonly setTeaType: (teaType: TeaType) => void;
  readonly teaType: TeaType;
  readonly update: (patch: Partial<CalculatorValue>) => void;
}

export function useTeaCalculator(): TeaCalculatorController {
  const [teaType, setTeaType] = useState<TeaType>(readSavedTeaType);
  const [values, setValues] = useState<CalculatorValues>(
    readSavedCalculatorValues,
  );
  useEffect(() => {
    saveTeaType(teaType);
  }, [teaType]);
  useEffect(() => {
    saveCalculatorValues(values);
  }, [values]);
  const reset = useCallback(() => {
    setValues(getDefaultValues());
  }, []);
  const update = useCallback(
    (patch: Partial<CalculatorValue>) => {
      setValues((previous) => ({
        ...previous,
        [teaType]: { ...previous[teaType], ...patch },
      }));
    },
    [teaType],
  );
  const config = TEA_CONFIGS[teaType];
  const current = values[teaType];
  const waterPercent = 100 / (1 + current.milkRatio);
  const result = useMemo(
    () =>
      calculateRecipe(
        teaType,
        current.serving,
        current.concentration,
        current.temperature,
        waterPercent,
        current.coldTemperature,
        current.hotTemperature,
      ),
    [teaType, current, waterPercent],
  );
  const ratioDenominator =
    current.concentration > 0
      ? Math.round((100 / current.concentration) * 10) / 10
      : 0;
  return {
    config,
    current,
    ratioDenominator,
    reset,
    result,
    setTeaType,
    teaType,
    update,
  };
}
