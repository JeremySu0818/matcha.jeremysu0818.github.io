import { useEffect, useRef, useState } from 'react';
import { useScroll } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '../../i18n';
import { NavigationDots } from '../NavigationDots';

gsap.registerPlugin(ScrollTrigger);

export type Step = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  align: 'left' | 'right' | 'center';
};

function getStepAlignment(align: Step['align']) {
  if (align === 'center') {
    return 'items-center text-left md:text-center px-8 md:px-24';
  }

  if (align === 'left') {
    return 'items-center md:items-start text-left px-8 md:px-24';
  }

  return 'items-center md:items-end text-left px-8 md:px-24';
}

function getPanelMargin(isFinal: boolean, index: number) {
  if (isFinal) {
    return 'mt-[10vh]';
  }

  if (index === 0) {
    return 'mt-[16vh]';
  }

  return 'mt-[22vh]';
}

interface NarrativeOverlayProps {
  onBack: () => void;
}

export function NarrativeOverlay({ onBack }: NarrativeOverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const localizedSteps = [
    {
      id: 'intro',
      title: t.steps.intro.title,
      body: t.steps.intro.body,
      align: 'center' as const,
    },
    {
      id: 'powder',
      eyebrow: t.steps.powder.eyebrow,
      title: t.steps.powder.title,
      body: t.steps.powder.body,
      align: 'right' as const,
    },
    {
      id: 'sift',
      eyebrow: t.steps.sift.eyebrow,
      title: t.steps.sift.title,
      body: t.steps.sift.body,
      align: 'left' as const,
    },
    {
      id: 'water',
      eyebrow: t.steps.water.eyebrow,
      title: t.steps.water.title,
      body: t.steps.water.body,
      align: 'right' as const,
    },
    {
      id: 'whisk',
      eyebrow: t.steps.whisk.eyebrow,
      title: t.steps.whisk.title,
      body: t.steps.whisk.body,
      align: 'left' as const,
    },
    {
      id: 'finish',
      title: t.steps.finish.title,
      body: t.steps.finish.body,
      align: 'center' as const,
    },
  ];

  const recipeRows = [
    [t.overlay.matcha, '2 g'],
    [t.overlay.warmWater, '70 ml'],
    [t.overlay.waterTemp, '75°C'],
  ];

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.hero-copy-panel').forEach((panel) => {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: panel,
              scroller: scroll.el,
              start: 'top 78%',
              end: 'center 38%',
              scrub: 0.6,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.eyebrow-anim').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              scroller: scroll.el,
              start: 'top 82%',
              end: 'center 48%',
              scrub: 0.5,
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [scroll.el]);

  useEffect(() => {
    const interval = setInterval(() => {
      const progress = scroll.offset;
      const step = Math.min(5, Math.floor(progress * 5.5));
      setCurrentStep(step);
    }, 120);
    return () => clearInterval(interval);
  }, [scroll]);

  const steps = [
    { id: 'intro', label: t.steps.intro.title, subLabel: t.overlay.ritual },
    { id: 'powder', label: t.steps.powder.title, subLabel: t.steps.powder.eyebrow },
    { id: 'sift', label: t.steps.sift.title, subLabel: t.steps.sift.eyebrow },
    { id: 'water', label: t.steps.water.title, subLabel: t.steps.water.eyebrow },
    { id: 'whisk', label: t.steps.whisk.title, subLabel: t.steps.whisk.eyebrow },
    { id: 'finish', label: t.steps.finish.title, subLabel: t.overlay.finalRecipe },
  ];

  const handleStepClick = (index: number) => {
    if (scroll.el) {
      const containerHeight = scroll.el.clientHeight;
      scroll.el.scrollTo({
        top: index * containerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="nav-bar text-white">
        <span className="nav-step !text-white/60">
          {currentStep === 0 ? '' : currentStep >= 5 ? t.overlay.ritual : `${String(currentStep).padStart(2, '0')} / 04`}
        </span>
      </div>

      <NavigationDots
        steps={steps}
        activeStep={currentStep}
        onStepClick={handleStepClick}
        darkTheme={false}
      />

      <div
        ref={rootRef}
        className="pointer-events-none relative w-screen overflow-hidden"
      >
        {localizedSteps.map((step, index) => {
          const isFinal = step.id === 'finish';
          const alignment = getStepAlignment(step.align);
          const panelMargin = getPanelMargin(isFinal, index);

          return (
            <section
              key={step.id}
              className={`relative flex h-screen w-screen flex-col justify-center ${alignment}`}
              aria-label={step.title}
            >
              <div
                className={`${index === 0 ? 'hero-copy-panel' : 'copy-panel'} z-10 flex w-full flex-col ${
                  index === 0 ? 'max-w-4xl items-start text-left md:items-center md:text-center' : 'md:w-[460px]'
                } ${panelMargin}`}
              >
                {index === 0 ? (
                  <>
                    <div className="mb-6 inline-flex items-center gap-4 eyebrow-anim animate-fade-in-up-on-load delay-300">
                      <span className="h-[1px] w-12 bg-matcha-ink/60"></span>
                      <span className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-matcha-ink/90">
                        {step.eyebrow || 'A Ritual of Focus'}
                      </span>
                    </div>
                    <h1 className="heading-serif text-[4.5rem] font-normal leading-[0.9] tracking-tight md:text-[9rem] text-matcha-ink animate-fade-in-up-on-load delay-500">
                      {step.title}
                    </h1>
                    <p className="mt-10 max-w-2xl text-xl leading-relaxed text-matcha-ink animate-fade-in-up-on-load delay-700">
                      {step.body}
                    </p>
                  </>
                ) : (
                  <div className={
                    isFinal
                      ? "glass-card w-full rounded-[2rem] border border-white/30 bg-white/20 p-8 shadow-glass md:p-10 text-left pointer-events-auto"
                      : "glass-card-desktop w-full text-left pointer-events-auto p-6 md:rounded-[2rem] md:border md:border-white/30 md:bg-white/20 md:p-10 md:shadow-glass"
                  }>
                    {step.eyebrow ? (
                      <span className="eyebrow block font-mono text-xs uppercase tracking-[0.25em] text-matcha-ink/70 eyebrow-anim">
                        {step.eyebrow}
                      </span>
                    ) : (
                      isFinal && (
                        <span className="eyebrow block font-mono text-xs uppercase tracking-[0.25em] text-matcha-ink/70 eyebrow-anim">
                          {t.overlay.finalRecipe}
                        </span>
                      )
                    )}
                    
                    <h2 className="heading-serif mb-6 mt-3 text-3xl leading-tight drop-shadow-sm md:text-4xl text-matcha-ink">
                      {step.title}
                    </h2>
                    <div className="mb-6 h-[1px] w-full bg-white/30"></div>

                    {isFinal ? (
                      <>
                        <div className="mb-6">
                          {recipeRows.map(([label, value]) => (
                            <div key={label}>
                              <div className="flex items-baseline justify-between gap-8 py-3">
                                <span className="font-sans text-[0.8125rem] text-matcha-ink/70 tracking-[0.04em]">{label}</span>
                                <span className="font-mono text-[0.875rem] font-medium text-matcha-ink tracking-[0.02em]">{value}</span>
                              </div>
                              <div className="h-[1px] w-full bg-white/10"></div>
                            </div>
                          ))}
                        </div>
                        <p className="body-text text-base md:text-lg leading-relaxed text-matcha-ink mb-8">
                          {step.body}
                        </p>
                        <div className="flex justify-center w-full">
                          <button
                            onClick={onBack}
                            className="group relative flex items-center overflow-hidden rounded-full border border-white/50 bg-white/20 px-10 py-5 transition-all duration-500 hover:bg-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] focus:outline-none"
                          >
                            <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-white">
                              {t.overlay.back}
                            </span>
                            <span className="ml-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-matcha-ink transition-transform duration-500 group-hover:scale-110">
                              →
                            </span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="body-text mb-4 text-base md:text-lg leading-relaxed text-matcha-ink">
                        {step.body}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {index === 0 && (
                <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-50">
                  <div className="animate-fade-in-up-on-load delay-900">
                    <div className="flex flex-col items-center gap-4 animate-bounce">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-matcha-ink/80">Scroll</span>
                      <div className="h-12 w-[1px] bg-matcha-ink/50"></div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

