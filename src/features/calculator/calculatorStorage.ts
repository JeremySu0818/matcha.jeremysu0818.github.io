import { type TeaType } from "./calculator";
import {
  getDefaultValues,
  type CalculatorValue,
  type CalculatorValues,
} from "./calculatorDefaults";

const TEA_TYPE_STORAGE_KEY = "matcha_tea_type";
const CALCULATOR_VALUES_STORAGE_KEY = "matcha_tea_calculator_values";
const VALUE_KEYS = [
  "coldTemperature",
  "concentration",
  "hotTemperature",
  "milkRatio",
  "serving",
  "temperature",
] as const satisfies readonly (keyof CalculatorValue)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTeaType(value: string | null): value is TeaType {
  return value === "koicha" || value === "usucha" || value === "latte";
}

function mergeStoredValue(
  stored: unknown,
  defaults: CalculatorValue,
): CalculatorValue {
  if (!isRecord(stored)) return defaults;
  const merged = { ...defaults };
  for (const key of VALUE_KEYS) {
    const value = stored[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      merged[key] = value;
    }
  }
  return merged;
}

export function readSavedTeaType(): TeaType {
  const saved = localStorage.getItem(TEA_TYPE_STORAGE_KEY);
  return isTeaType(saved) ? saved : "usucha";
}

export function saveTeaType(teaType: TeaType): void {
  localStorage.setItem(TEA_TYPE_STORAGE_KEY, teaType);
}

export function readSavedCalculatorValues(): CalculatorValues {
  const defaults = getDefaultValues();
  const saved = localStorage.getItem(CALCULATOR_VALUES_STORAGE_KEY);
  if (!saved) return defaults;
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!isRecord(parsed)) return defaults;
    return {
      koicha: mergeStoredValue(parsed.koicha, defaults.koicha),
      latte: mergeStoredValue(parsed.latte, defaults.latte),
      usucha: mergeStoredValue(parsed.usucha, defaults.usucha),
    };
  } catch {
    return defaults;
  }
}

export function saveCalculatorValues(values: CalculatorValues): void {
  localStorage.setItem(CALCULATOR_VALUES_STORAGE_KEY, JSON.stringify(values));
}
