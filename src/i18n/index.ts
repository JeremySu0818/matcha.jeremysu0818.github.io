import { useState, useEffect } from 'react';
import { translations } from './translations';
import { getBrowserLanguage } from './language';
import type { SupportedLanguage } from './language';
import type { TranslationSchema } from './translations';

export { getBrowserLanguage };
export type { TranslationSchema, SupportedLanguage };

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    return getBrowserLanguage();
  });

  useEffect(() => {
    const detectedLang = getBrowserLanguage();
    setLang(detectedLang);

    // Dynamic SEO update based on active language
    const t = translations[detectedLang] || translations['en'];
    document.title = t.metadata.title;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', t.metadata.description);
    }

    document.documentElement.lang = detectedLang;
  }, []);

  const t = translations[lang] || translations['en'];

  return { t, lang };
}
