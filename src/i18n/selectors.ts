import { localeCopies } from "./locales";
import type { SupportedLanguage } from "./language";
import type {
  CalculatorCopy,
  LocaleCopy,
  ShadeCopy,
  ToolsCopy,
  TranslationSchema,
} from "./types";

function getLocaleCopy(lang: SupportedLanguage): LocaleCopy {
  return localeCopies[lang];
}

export function getTranslationCopy(
  lang: SupportedLanguage,
): TranslationSchema {
  return getLocaleCopy(lang).translation;
}

export function getToolsCopy(lang: SupportedLanguage): ToolsCopy {
  return getLocaleCopy(lang).tools;
}

export function getShadeCopy(lang: SupportedLanguage): ShadeCopy {
  return getLocaleCopy(lang).shade;
}

export function getCalculatorCopy(lang: SupportedLanguage): CalculatorCopy {
  return getLocaleCopy(lang).calculator;
}
