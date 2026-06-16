import { useState, useEffect } from "react";
import { getBrowserLanguage } from "./language";
import type { SupportedLanguage } from "./language";
import { getTranslationCopy } from "./selectors";

export { getBrowserLanguage };
export {
  getCalculatorCopy,
  getLocaleCopy,
  getShadeCopy,
  getToolsCopy,
  getTranslationCopy,
} from "./selectors";
export type {
  CalculatorCopy,
  LocaleCopy,
  ShadeCopy,
  ToolsCopy,
  TranslationSchema,
} from "./types";
export type { SupportedLanguage };

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    return getBrowserLanguage();
  });

  useEffect(() => {
    const detectedLang = getBrowserLanguage();
    setLang(detectedLang);
  }, []);

  useEffect(() => {
    const t = getTranslationCopy(lang);
    document.title = t.metadata.title;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", t.metadata.description);
    }

    document.documentElement.lang = lang;
  }, [lang]);

  const t = getTranslationCopy(lang);

  return { t, lang };
}
