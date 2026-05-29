import { useEffect, useRef, useState } from 'react';
import { useScroll } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { steps } from '../../data/steps';

gsap.registerPlugin(ScrollTrigger);

const recipeRows = [
  ['Matcha', '2 g'],
  ['Water', '70 ml'],
  ['Temperature', '75 C'],
  ['Whisk', '20 s'],
];

export function NarrativeOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.copy-panel').forEach((panel) => {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 60, filter: 'blur(14px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power3.out',
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

      gsap.utils.toArray<HTMLElement>('.eyebrow').forEach((el) => {
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

      gsap.to(rootRef.current, {
        '--ambient': 'rgba(228, 238, 205, 0.9)',
        '--ambient-soft': 'rgba(151, 184, 117, 0.38)',
        scrollTrigger: {
          trigger: rootRef.current,
          scroller: scroll.el,
          start: '45% center',
          end: '72% center',
          scrub: 1,
        },
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

  return (
    <>
      <div className="nav-bar">
        <span className="nav-brand">Matcha</span>
        <span className="nav-step">
          {currentStep === 0 ? '' : currentStep >= 5 ? 'Ritual' : `${String(currentStep).padStart(2, '0')} / 04`}
        </span>
      </div>

      <div className="progress-track hidden sm:flex">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`progress-dot ${idx <= currentStep ? 'active' : ''}`}
          />
        ))}
      </div>

      {currentStep === 0 && (
        <div className="scroll-hint">
          <div className="scroll-hint-line" />
          <span className="scroll-hint-text">Scroll</span>
        </div>
      )}

      <div
        ref={rootRef}
        className="ambient-wash pointer-events-none relative w-screen overflow-hidden"
      >
        <div className="fine-grid fixed inset-0 opacity-50" />
        {steps.map((step, index) => {
          const isFinal = step.id === 'finish';
          const alignment =
            step.align === 'center'
              ? 'items-center text-center'
              : step.align === 'left'
                ? 'items-start text-left pl-8 pr-8 sm:pl-[10vw]'
                : 'items-end text-left pl-8 pr-8 sm:pr-[10vw]';

          return (
            <section
              key={step.id}
              className={`relative flex h-screen w-screen flex-col ${alignment}`}
              aria-label={step.title}
            >
              <div
                className={`copy-panel z-10 flex max-w-[38rem] flex-col ${
                  isFinal ? 'mt-[10vh]' : index === 0 ? 'mt-[16vh]' : 'mt-[22vh]'
                }`}
              >
                {step.eyebrow ? (
                  <p className="eyebrow mb-5">{step.eyebrow}</p>
                ) : null}

                {isFinal ? (
                  <div className="w-[min(88vw,28rem)] rounded-xl border border-white/60 bg-white/50 p-7 text-left shadow-elevated sm:p-9">
                    <h2 className="heading-serif text-3xl text-matcha-ink sm:text-4xl">
                      {step.title}
                    </h2>
                    <div className="divider-line mt-6" />
                    <div className="mt-2">
                      {recipeRows.map(([label, value]) => (
                        <div key={label}>
                          <div className="recipe-row">
                            <span className="recipe-label">{label}</span>
                            <span className="recipe-value">{value}</span>
                          </div>
                          <div className="divider-line" />
                        </div>
                      ))}
                    </div>
                    <p className="body-text mt-7 text-base text-matcha-deep/70 sm:text-lg">
                      {step.body}
                    </p>
                  </div>
                ) : (
                  <>
                    <h1
                      className={`heading-serif text-matcha-ink ${
                        index === 0
                          ? 'text-[clamp(4.5rem,17vw,11rem)]'
                          : 'text-[clamp(2.8rem,8.5vw,7.2rem)]'
                      }`}
                    >
                      {step.title}
                    </h1>
                    <p className="body-text mt-6 max-w-[26rem] text-base text-matcha-deep/60 sm:text-lg">
                      {step.body}
                    </p>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
