import { useEffect, useRef } from "react";
import { useScroll } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../../i18n";

gsap.registerPlugin(ScrollTrigger);

export type Step = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
};

interface NarrativeOverlayProps {
  hidden?: boolean;
  onAction: () => void;
  actionLabel: string;
}

export function NarrativeOverlay({
  hidden = false,
  onAction,
  actionLabel,
}: NarrativeOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();
  const { t } = useTranslation();

  const localizedSteps: Step[] = [
    {
      id: "intro",
      eyebrow: t.hero.eyebrow,
      title: t.steps.intro.title,
      body: t.steps.intro.body,
      align: "center",
    },
    {
      id: "powder",
      eyebrow: t.steps.powder.eyebrow,
      title: t.steps.powder.title,
      body: t.steps.powder.body,
      align: "right",
    },
    {
      id: "sift",
      eyebrow: t.steps.sift.eyebrow,
      title: t.steps.sift.title,
      body: t.steps.sift.body,
      align: "left",
    },
    {
      id: "water",
      eyebrow: t.steps.water.eyebrow,
      title: t.steps.water.title,
      body: t.steps.water.body,
      align: "right",
    },
    {
      id: "whisk",
      eyebrow: t.steps.whisk.eyebrow,
      title: t.steps.whisk.title,
      body: t.steps.whisk.body,
      align: "left",
    },
    {
      id: "finish",
      title: t.steps.finish.title,
      body: t.steps.finish.body,
      align: "center",
    },
  ];

  const recipeRows = [
    [t.overlay.matcha, "2 g"],
    [t.overlay.warmWater, "70 ml"],
    [t.overlay.waterTemp, "75°C"],
  ];

  useEffect(() => {
    if (
      hidden ||
      !rootRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>(".scene-narrative__eyebrow")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, x: -14 },
            {
              autoAlpha: 1,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                scroller: scroll.el,
                start: "top 84%",
                end: "center 52%",
                scrub: 0.5,
              },
            },
          );
        });
    }, rootRef);

    return () => ctx.revert();
  }, [hidden, scroll.el]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="scene-narrative">
      {localizedSteps.map((step, index) => {
        const isIntro = index === 0;
        const isFinal = step.id === "finish";

        return (
          <section
            key={step.id}
            className={`scene-narrative__section scene-narrative__section--${step.align} ${
              isIntro ? "is-intro" : ""
            } ${isFinal ? "is-final" : ""}`}
            aria-label={step.title}
          >
            {isIntro ? (
              <div className="scene-intro-copy">
                <div className="scene-intro-copy__folio" aria-hidden="true">
                  01 / 06
                </div>
                <p className="editorial-eyebrow scene-narrative__eyebrow">
                  {step.eyebrow}
                </p>
                <h1>{step.title}</h1>
                <p className="scene-intro-copy__body">{step.body}</p>
              </div>
            ) : isFinal ? (
              <div className="scene-recipe-sheet">
                <div className="scene-recipe-sheet__folio" aria-hidden="true">
                  06 / 06
                </div>
                <p className="editorial-eyebrow scene-narrative__eyebrow">
                  {t.overlay.finalRecipe}
                </p>
                <h2>{step.title}</h2>
                <div className="scene-recipe-sheet__rows">
                  {recipeRows.map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <p className="scene-recipe-sheet__body">{step.body}</p>
                <button type="button" onClick={onAction} className="editorial-action">
                  <span>{actionLabel}</span>
                  <i aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="scene-annotation">
                <div className="scene-annotation__line" aria-hidden="true" />
                <span className="scene-annotation__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")} / 06
                </span>
                {step.eyebrow && (
                  <p className="editorial-eyebrow scene-narrative__eyebrow">
                    {step.eyebrow}
                  </p>
                )}
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </div>
            )}

            {isIntro && (
              <div className="scene-scroll-cue" aria-hidden="true">
                <span>{t.hero.scroll}</span>
                <i />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
