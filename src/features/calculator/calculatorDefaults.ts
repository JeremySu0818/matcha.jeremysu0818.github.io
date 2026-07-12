import { TEA_CONFIGS, TEA_TYPES, type TeaType } from "./calculator";

export interface CalculatorValue {
  readonly coldTemperature: number;
  readonly concentration: number;
  readonly hotTemperature: number;
  readonly milkRatio: number;
  readonly serving: number;
  readonly temperature: number;
}

export type CalculatorValues = Record<TeaType, CalculatorValue>;

export const getDefaultValues = (): CalculatorValues =>
  Object.fromEntries(
    TEA_TYPES.map((type) => {
      const config = TEA_CONFIGS[type];
      return [
        type,
        {
          serving: config.servingDefault,
          concentration: config.concentrationDefault,
          temperature: config.temperatureDefault,
          milkRatio: config.milkRatioDefault ?? 3.75,
          coldTemperature: 0,
          hotTemperature: 100,
        },
      ];
    }),
  ) as CalculatorValues;
