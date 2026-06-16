import { TEA_CONFIGS, TEA_TYPES, type TeaType } from "./calculator";

export type CalculatorValues = Record<
  TeaType,
  {
    serving: number;
    concentration: number;
    temperature: number;
    milkRatio: number;
    coldTemperature: number;
    hotTemperature: number;
  }
>;

export const getDefaultValues = () =>
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
