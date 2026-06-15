export const SUPPORTED_LANGUAGES = [
  "ar",
  "cs",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt-br",
  "ru",
  "tr",
  "vi",
  "zh-cn",
  "zh-tw",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("matcha_language");
    if (saved && (SUPPORTED_LANGUAGES as readonly string[]).includes(saved)) {
      return saved as SupportedLanguage;
    }
  }

  if (typeof navigator === "undefined") return "en";

  const languages = navigator.languages || [navigator.language];
  for (const lang of languages) {
    if (!lang) continue;
    const normalized = lang.toLowerCase();

    if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
      return normalized as SupportedLanguage;
    }

    const base = normalized.split("-")[0];

    if (base === "zh") {
      if (
        normalized.includes("cn") ||
        normalized.includes("sg") ||
        normalized.includes("hans")
      ) {
        return "zh-cn";
      }
      return "zh-tw";
    }

    if (base === "pt") {
      return "pt-br";
    }

    if (SUPPORTED_LANGUAGES.includes(base as SupportedLanguage)) {
      return base as SupportedLanguage;
    }
  }

  return "en";
}
