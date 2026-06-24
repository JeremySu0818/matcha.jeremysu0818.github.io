import { useTranslation } from "../i18n";
import type { SceneMode } from "../app/sceneMode";
import { Header } from "./Header";
import { NavigationDots } from "./NavigationDots";
import { InkTextReveal } from "./effects/InkTextReveal";
import { ShadeSimulator } from "./interactive/ShadeSimulator";
import { ToolsShowcase } from "./interactive/ToolsShowcase";
import { getLandingSteps } from "./landing/landingNavigation";
import { renderTitle } from "./landing/renderTitle";
import { useLandingScrollNavigation } from "./landing/useLandingScrollNavigation";

interface LandingPageProps {
  onEnter: () => void;
  sceneMode: SceneMode;
}

const landingScroller = "#landing-scroll-container";

function ChapterText({
  eyebrow,
  title,
  paragraphs,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <>
      <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
        {eyebrow}
      </span>
      <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight text-white drop-shadow-sm md:text-5xl">
        {renderTitle(title)}
      </h2>
      <div className="mb-8 h-[1px] w-full max-w-[18rem] bg-white/35"></div>
      <InkTextReveal
        as="div"
        text={paragraphs.join("\n\n")}
        scroller={landingScroller}
        lockPrintHeadToViewport={true}
        className="ink-text-reveal--light body-text text-lg leading-loose"
      />
    </>
  );
}

export function LandingPage({ onEnter, sceneMode }: LandingPageProps) {
  const { t, lang } = useTranslation();
  const { activeStep, handleStepClick } = useLandingScrollNavigation();
  const steps = getLandingSteps(t);

  return (
    <div
      id="landing-scroll-container"
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth font-sans text-white"
    >
      <div className="relative z-10 w-full">
        <Header
          activeLink="home"
          darkTheme={true}
          pointerEventsNone={false}
          onLoadAnimation={true}
          sceneMode={sceneMode}
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
          <div className="landing-copy-panel w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <ChapterText
              eyebrow={t.chapters.chapter1.eyebrow}
              title={t.chapters.chapter1.title}
              paragraphs={[
                t.chapters.chapter1.p1,
                t.chapters.chapter1.p2,
                t.chapters.chapter1.p3,
              ]}
            />
          </div>
        </section>

        <section
          id="section-chapter-2"
          className="flex min-h-screen w-full items-center justify-start px-8 py-24 md:px-24"
        >
          <div className="landing-copy-panel w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <ChapterText
              eyebrow={t.chapters.chapter2.eyebrow}
              title={t.chapters.chapter2.title}
              paragraphs={[
                t.chapters.chapter2.p1,
                t.chapters.chapter2.p2,
                t.chapters.chapter2.p3,
              ]}
            />
            <ShadeSimulator lang={lang} />
          </div>
        </section>

        <section
          id="section-chapter-3"
          className="flex min-h-screen w-full items-center justify-end px-8 py-24 md:px-24"
        >
          <div className="landing-copy-panel w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <ChapterText
              eyebrow={t.chapters.chapter3.eyebrow}
              title={t.chapters.chapter3.title}
              paragraphs={[
                t.chapters.chapter3.p1,
                t.chapters.chapter3.p2,
                t.chapters.chapter3.p3,
              ]}
            />
            <ToolsShowcase lang={lang} />
          </div>
        </section>

        <section
          id="section-chapter-4"
          className="flex min-h-screen w-full items-center justify-start px-8 py-24 md:px-24"
        >
          <div className="landing-copy-panel w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <ChapterText
              eyebrow={t.chapters.chapter4.eyebrow}
              title={t.chapters.chapter4.title}
              paragraphs={[
                t.chapters.chapter4.p1,
                t.chapters.chapter4.p2,
                t.chapters.chapter4.p3,
              ]}
            />
          </div>
        </section>

        <section
          id="section-chapter-5"
          className="flex min-h-screen w-full items-center justify-end px-8 py-24 md:px-24"
        >
          <div className="landing-copy-panel w-full rounded-[2rem] border border-white/30 bg-white/20 p-10 shadow-glass backdrop-blur-2xl md:w-[680px] md:p-16">
            <ChapterText
              eyebrow={t.chapters.chapter5.eyebrow}
              title={t.chapters.chapter5.title}
              paragraphs={[
                t.chapters.chapter5.p1,
                t.chapters.chapter5.p2,
                t.chapters.chapter5.p3,
              ]}
            />
          </div>
        </section>

        <section
          id="section-final"
          className="flex min-h-[85vh] w-full flex-col items-center justify-center px-8 py-24 text-center md:px-24"
        >
          <div className="landing-copy-panel flex w-full max-w-4xl flex-col items-center rounded-[2rem] border border-white/30 bg-white/20 p-12 shadow-glass backdrop-blur-3xl md:p-24">
            <span className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
              {t.final.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 text-5xl text-white md:text-6xl">
              {t.final.title}
            </h2>
            <p className="body-text mb-6 max-w-2xl text-xl leading-loose text-white">
              {t.final.p1}
            </p>
            <p className="body-text mb-14 max-w-2xl text-xl leading-loose text-white/90">
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
