export type TeaType = "koicha" | "usucha" | "latte";

export interface TeaConfig {
  labelKey: TeaType;
  servingMin: number;
  servingMax: number;
  servingDefault: number;
  concentrationMin: number;
  concentrationMax: number;
  concentrationDefault: number;
  temperatureMin: number;
  temperatureMax: number;
  temperatureDefault: number;
  milkRatioMin?: number;
  milkRatioMax?: number;
  milkRatioDefault?: number;
}

export interface CalculationResult {
  powderG: number;
  waterMl: number;
  milkMl: number;
  targetTemperature: number;
  hotWaterMl: number;
  coldWaterMl: number;
  hotTemperature: number;
  coldTemperature: number;
}

export const TEA_TYPES: TeaType[] = ["koicha", "usucha", "latte"];

export const TEA_CONFIGS: Record<TeaType, TeaConfig> = {
  koicha: {
    labelKey: "koicha",
    servingMin: 20,
    servingMax: 120,
    servingDefault: 40,
    concentrationMin: 8.3,
    concentrationMax: 14.3,
    concentrationDefault: 12.5,
    temperatureMin: 60,
    temperatureMax: 85,
    temperatureDefault: 70,
  },
  usucha: {
    labelKey: "usucha",
    servingMin: 40,
    servingMax: 200,
    servingDefault: 70,
    concentrationMin: 2,
    concentrationMax: 4,
    concentrationDefault: 2.86,
    temperatureMin: 60,
    temperatureMax: 85,
    temperatureDefault: 75,
  },
  latte: {
    labelKey: "latte",
    servingMin: 100,
    servingMax: 400,
    servingDefault: 380,
    concentrationMin: 5,
    concentrationMax: 20,
    concentrationDefault: 10,
    temperatureMin: 60,
    temperatureMax: 85,
    temperatureDefault: 75,
    milkRatioMin: 2,
    milkRatioMax: 6,
    milkRatioDefault: 3.75,
  },
};

export function calculateWaterMix(
  totalWaterMl: number,
  targetTemperature: number,
  coldTemperature: number,
  hotTemperature: number,
) {
  if (
    hotTemperature === coldTemperature ||
    targetTemperature >= hotTemperature
  ) {
    return { hotMl: totalWaterMl, coldMl: 0 };
  }
  if (targetTemperature <= coldTemperature) {
    return { hotMl: 0, coldMl: totalWaterMl };
  }

  const hotFraction =
    (targetTemperature - coldTemperature) / (hotTemperature - coldTemperature);
  const hotMl = Math.round(totalWaterMl * hotFraction);
  return { hotMl, coldMl: totalWaterMl - hotMl };
}

export function calculateRecipe(
  teaType: TeaType,
  servingMl: number,
  concentration: number,
  targetTemperature: number,
  waterPercent = 25,
  coldTemperature = 0,
  hotTemperature = 100,
): CalculationResult {
  let waterMl = servingMl;
  let milkMl = 0;

  if (teaType === "latte") {
    waterMl = servingMl * (waterPercent / 100);
    milkMl = servingMl - waterMl;
  }

  const roundedWaterMl = Math.round(waterMl);
  const waterMix = calculateWaterMix(
    roundedWaterMl,
    targetTemperature,
    coldTemperature,
    hotTemperature,
  );

  return {
    powderG: Math.round(((waterMl * concentration) / 100) * 10) / 10,
    waterMl: roundedWaterMl,
    milkMl: Math.round(milkMl),
    targetTemperature,
    hotWaterMl: waterMix.hotMl,
    coldWaterMl: waterMix.coldMl,
    hotTemperature,
    coldTemperature,
  };
}
