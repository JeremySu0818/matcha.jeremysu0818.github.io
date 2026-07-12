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

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("matcha_language");
    if (saved && isSupportedLanguage(saved)) {
      return saved;
    }
  }

  if (typeof navigator === "undefined") return "en";

  const languages =
    navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  for (const lang of languages) {
    const normalized = lang.toLowerCase();

    if (isSupportedLanguage(normalized)) {
      return normalized;
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

    if (isSupportedLanguage(base)) {
      return base;
    }
  }

  return "en";
}
