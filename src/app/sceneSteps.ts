import type { TranslationSchema } from "../i18n";

export function getSceneSteps(t: TranslationSchema): readonly {
  readonly id: string;
  readonly label: string;
  readonly subLabel: string;
}[] {
  return [
    { id: "intro", label: t.steps.intro.title, subLabel: t.overlay.ritual },
    {
      id: "powder",
      label: t.steps.powder.title,
      subLabel: t.steps.powder.eyebrow,
    },
    { id: "sift", label: t.steps.sift.title, subLabel: t.steps.sift.eyebrow },
    {
      id: "water",
      label: t.steps.water.title,
      subLabel: t.steps.water.eyebrow,
    },
    {
      id: "whisk",
      label: t.steps.whisk.title,
      subLabel: t.steps.whisk.eyebrow,
    },
    {
      id: "finish",
      label: t.steps.finish.title,
      subLabel: t.overlay.finalRecipe,
    },
  ];
}
