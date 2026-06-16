import type { TranslationSchema } from "../../i18n";

export const LANDING_SECTION_IDS = [
  "hero",
  "chapter-1",
  "chapter-2",
  "chapter-3",
  "chapter-4",
  "chapter-5",
  "final",
];

export function getLandingSteps(t: TranslationSchema) {
  return [
    {
      id: "hero",
      label: t.hero.title.replace(/\n/g, " "),
      subLabel: t.nav.home,
    },
    {
      id: "chapter-1",
      label: t.chapters.chapter1.title.replace(/\n/g, " "),
      subLabel: t.chapters.chapter1.eyebrow,
    },
    {
      id: "chapter-2",
      label: t.chapters.chapter2.title.replace(/\n/g, " "),
      subLabel: t.chapters.chapter2.eyebrow,
    },
    {
      id: "chapter-3",
      label: t.chapters.chapter3.title.replace(/\n/g, " "),
      subLabel: t.chapters.chapter3.eyebrow,
    },
    {
      id: "chapter-4",
      label: t.chapters.chapter4.title.replace(/\n/g, " "),
      subLabel: t.chapters.chapter4.eyebrow,
    },
    {
      id: "chapter-5",
      label: t.chapters.chapter5.title.replace(/\n/g, " "),
      subLabel: t.chapters.chapter5.eyebrow,
    },
    { id: "final", label: t.final.title, subLabel: t.final.eyebrow },
  ];
}
