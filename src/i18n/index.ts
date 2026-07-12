import { useEffect, useMemo } from "react";
import { getBrowserLanguage } from "./language";
import { getTranslationCopy } from "./selectors";
import type { SupportedLanguage } from "./language";

export {
  getCalculatorCopy,
  getShadeCopy,
  getToolsCopy,
} from "./selectors";
export type {
  CalculatorCopy,
  TranslationSchema,
} from "./types";
export type { SupportedLanguage };

interface TranslationResult {
  readonly lang: SupportedLanguage;
  readonly t: ReturnType<typeof getTranslationCopy>;
}

export function useTranslation(): TranslationResult {
  const lang = useMemo(() => getBrowserLanguage(), []);

  useEffect(() => {
    const t = getTranslationCopy(lang);
    document.title = t.metadata.title;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", t.metadata.description);
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = getTranslationCopy(lang);

  return { t, lang };
}
