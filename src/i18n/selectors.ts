import type { SupportedLanguage } from "./language";
import { localeCopies } from "./locales";

export function getLocaleCopy(lang: SupportedLanguage) {
  return localeCopies[lang] ?? localeCopies.en;
}

export function getTranslationCopy(lang: SupportedLanguage) {
  return getLocaleCopy(lang).translation;
}

export function getToolsCopy(lang: SupportedLanguage) {
  return getLocaleCopy(lang).tools;
}

export function getShadeCopy(lang: SupportedLanguage) {
  return getLocaleCopy(lang).shade;
}

export function getCalculatorCopy(lang: SupportedLanguage) {
  return getLocaleCopy(lang).calculator;
}
