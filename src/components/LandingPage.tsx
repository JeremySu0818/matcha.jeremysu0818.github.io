import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "../i18n";
import { Header } from "./Header";
import { NavigationDots } from "./NavigationDots";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
  registerScrollPositionGetter,
} from "../utils/scrollRegistry";

interface LandingPageProps {
  onEnter: () => void;
}

import { ScrollReveal } from "./ScrollReveal";
import { ShadeSimulator } from "./interactive/ShadeSimulator";
import { ToolsShowcase } from "./interactive/ToolsShowcase";

export function LandingPage({ onEnter }: LandingPageProps) {
  const { t, lang } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [bottomMaskFade, setBottomMaskFade] = useState(0);

  useEffect(() => {
    const container = document.getElementById("landing-scroll-container");
    if (!container) return undefined;

    const unregisterHome = registerScrollPositionGetter(
      "",
      () => container.scrollTop,
    );
    const unregisterHashHome = registerScrollPositionGetter(
      "#",
      () => container.scrollTop,
    );
    const savedPosition = readSavedScrollPosition(window.location.hash || "#");

    if (savedPosition !== null) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: savedPosition });
        clearSavedScrollPosition();
      });
    }

    return () => {
      unregisterHome();
      unregisterHashHome();
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("landing-scroll-container");
    if (!container) return;

    const handleScroll = () => {
      const sectionIds = [
        "hero",
        "chapter-1",
        "chapter-2",
        "chapter-3",
        "chapter-4",
        "chapter-5",
        "final",
      ];
      const scrollPos = container.scrollTop + container.clientHeight / 2;
      const maxScrollTop = Math.max(
        1,
        container.scrollHeight - container.clientHeight,
      );
      const scrollProgress = container.scrollTop / maxScrollTop;
      const fadeProgress = Math.min(
        1,
        Math.max(0, (scrollProgress - 0.65) / 0.25),
      );

      setBottomMaskFade(fadeProgress);

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${sectionIds[i]}`);
        if (el && scrollPos >= el.offsetTop) {
          setActiveStep(i);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStepClick = (index: number) => {
    const sectionIds = [
      "hero",
      "chapter-1",
      "chapter-2",
      "chapter-3",
      "chapter-4",
      "chapter-5",
      "final",
    ];
    const el = document.getElementById(`section-${sectionIds[index]}`);
    const container = document.getElementById("landing-scroll-container");
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const steps = [
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

  const renderTitle = (text: string) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div
      id="landing-scroll-container"
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth font-sans text-white"
    >
      <div
        className="fixed bottom-0 left-0 right-0 h-36 origin-bottom bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-30"
        style={{
          opacity: 1 - bottomMaskFade,
          transform: `translateY(${bottomMaskFade * 2.5}rem) scaleY(${1 - bottomMaskFade * 0.2})`,
        }}
      />

      <div className="relative z-10 w-full">
        <Header
          activeLink="home"
          darkTheme={true}
          pointerEventsNone={false}
          onLoadAnimation={true}
        />

        <section
          id="section-hero"
          className="relative flex min-h-screen w-full flex-col justify-center px-8 md:px-24"
        >
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-4 animate-fade-in-up delay-300">
              <span className="h-[1px] w-12 bg-white/60"></span>
              <span className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-white/90">
                {t.hero.eyebrow}
              </span>
            </div>
            <h1 className="heading-serif text-[4.5rem] font-normal leading-[0.9] tracking-tight drop-shadow-lg md:text-[9rem] animate-fade-in-up delay-500">
              {renderTitle(t.hero.title)}
            </h1>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white drop-shadow animate-fade-in-up delay-700">
              {t.hero.description}
            </p>
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none">
            <div className="animate-fade-in-up delay-900">
              <div className="flex flex-col items-center gap-4 animate-bounce">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/80">
                  {t.hero.scroll}
                </span>
                <div className="h-12 w-[1px] bg-white/50"></div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="section-chapter-1"
          className="flex min-h-screen w-full items-center justify-end px-8 py-24 md:px-24"
        >
          <ScrollReveal className="w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              {t.chapters.chapter1.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight drop-shadow-sm md:text-5xl">
              {renderTitle(t.chapters.chapter1.title)}
            </h2>
            <div className="mb-8 h-[1px] w-full bg-white/30"></div>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter1.p1}
            </p>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter1.p2}
            </p>
            <p className="body-text text-lg leading-relaxed text-white">
              {t.chapters.chapter1.p3}
            </p>
          </ScrollReveal>
        </section>

        <section
          id="section-chapter-2"
          className="flex min-h-screen w-full items-center justify-start px-8 py-24 md:px-24"
        >
          <ScrollReveal className="w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              {t.chapters.chapter2.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight drop-shadow-sm md:text-5xl">
              {renderTitle(t.chapters.chapter2.title)}
            </h2>
            <div className="mb-8 h-[1px] w-full bg-white/30"></div>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter2.p1}
            </p>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter2.p2}
            </p>
            <p className="body-text text-lg leading-relaxed text-white">
              {t.chapters.chapter2.p3}
            </p>

            <ShadeSimulator lang={lang} />
          </ScrollReveal>
        </section>

        <section
          id="section-chapter-3"
          className="flex min-h-screen w-full items-center justify-end px-8 py-24 md:px-24"
        >
          <div className="w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              {t.chapters.chapter3.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight drop-shadow-sm md:text-5xl">
              {renderTitle(t.chapters.chapter3.title)}
            </h2>
            <div className="mb-8 h-[1px] w-full bg-white/30"></div>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter3.p1}
            </p>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter3.p2}
            </p>
            <p className="body-text text-lg leading-relaxed text-white">
              {t.chapters.chapter3.p3}
            </p>

            <ToolsShowcase lang={lang} />
          </div>
        </section>

        <section
          id="section-chapter-4"
          className="flex min-h-screen w-full items-center justify-start px-8 py-24 md:px-24"
        >
          <div className="w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              {t.chapters.chapter4.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight drop-shadow-sm md:text-5xl">
              {renderTitle(t.chapters.chapter4.title)}
            </h2>
            <div className="mb-8 h-[1px] w-full bg-white/30"></div>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter4.p1}
            </p>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter4.p2}
            </p>
            <p className="body-text text-lg leading-relaxed text-white">
              {t.chapters.chapter4.p3}
            </p>
          </div>
        </section>

        <section
          id="section-chapter-5"
          className="flex min-h-screen w-full items-center justify-end px-8 py-24 md:px-24"
        >
          <div className="w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              {t.chapters.chapter5.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight drop-shadow-sm md:text-5xl">
              {renderTitle(t.chapters.chapter5.title)}
            </h2>
            <div className="mb-8 h-[1px] w-full bg-white/30"></div>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter5.p1}
            </p>
            <p className="body-text mb-6 text-lg leading-relaxed text-white">
              {t.chapters.chapter5.p2}
            </p>
            <p className="body-text text-lg leading-relaxed text-white">
              {t.chapters.chapter5.p3}
            </p>
          </div>
        </section>

        <section
          id="section-final"
          className="flex min-h-[85vh] w-full flex-col items-center justify-center px-8 py-24 text-center md:px-24"
        >
          <div className="flex w-full max-w-4xl flex-col items-center rounded-[2rem] border border-white/30 bg-white/20 p-12 shadow-glass backdrop-blur-3xl md:p-24">
            <span className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
              {t.final.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 text-5xl drop-shadow-sm md:text-6xl">
              {t.final.title}
            </h2>
            <p className="body-text mb-6 max-w-2xl text-xl leading-relaxed text-white">
              {t.final.p1}
            </p>
            <p className="body-text mb-14 max-w-2xl text-xl leading-relaxed text-white/90">
              {t.final.p2}
            </p>
            <button
              onClick={onEnter}
              className="group relative flex items-center overflow-hidden rounded-full border border-white/50 bg-white/20 px-10 py-5 transition-all duration-500 hover:bg-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] focus:outline-none"
            >
              <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-white">
                {t.final.button}
              </span>
              <span className="ml-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-matcha-ink transition-transform duration-500 group-hover:scale-110">
                →
              </span>
            </button>
          </div>
        </section>
      </div>
      <NavigationDots
        steps={steps}
        activeStep={activeStep}
        onStepClick={handleStepClick}
        darkTheme={true}
      />
    </div>
  );
}
