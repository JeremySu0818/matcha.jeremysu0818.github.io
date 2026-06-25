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
          <div className="absolute left-1/4 top-1/3 w-[30rem] h-[30rem] rounded-full bg-matcha-leaf/10 blur-[120px] pointer-events-none -z-10" />

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
          className="flex min-h-screen w-full items-center justify-center px-8 py-24 md:px-24"
        >
          <div className="max-w-6xl w-full flex flex-col gap-12">
            <div className="max-w-2xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                {t.chapters.chapter1.eyebrow}
              </span>
              <div className="w-fit">
                <h2 className="heading-serif mb-6 mt-4 text-4xl leading-tight text-white drop-shadow-sm md:text-5xl">
                  {renderTitle(t.chapters.chapter1.title)}
                </h2>
                <div className="h-[1px] w-full bg-matcha-leaf/60"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  year: "1191",
                  title: t.chapters.chapter1.card1Title,
                  text: t.chapters.chapter1.p1,
                  badge: t.chapters.chapter1.card1Badge,
                  icon: (
                    <svg className="w-6 h-6 text-matcha-foam" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" fillOpacity="0.1" />
                    </svg>
                  )
                },
                {
                  year: "1500s",
                  title: t.chapters.chapter1.card2Title,
                  text: t.chapters.chapter1.p2,
                  badge: t.chapters.chapter1.card2Badge,
                  icon: (
                    <svg className="w-6 h-6 text-matcha-foam" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9c0 0 1 6 8 6s8-6 8-6H4z" fill="currentColor" fillOpacity="0.1" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15v1.5a1 1 0 001 1h4a1 1 0 001-1V15" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5c.5-1 1-1 1.5 0s1 1 1.5 0M13 5c.5-1 1-1 1.5 0s1 1 1.5 0" />
                    </svg>
                  )
                },
                {
                  year: "Wabi-Sabi",
                  title: t.chapters.chapter1.card3Title,
                  text: t.chapters.chapter1.p3,
                  badge: t.chapters.chapter1.card3Badge,
                  icon: (
                    <svg className="w-6 h-6 text-matcha-foam" viewBox="0 0 420.70543 476.82181" fill="none" stroke="currentColor" strokeWidth="28">
                      <g transform="translate(73.6, 83.4) scale(0.65)">
                        <g transform="translate(-38.50022, 38.82181)">
                          <path
                            d="M43,438c-19,-148 19,-290 175,-413c74,-58 160,-67 236,-63c25,171 -40,333 -196,414c-74,39 -152,61 -215,62z"
                            fill="currentColor"
                            fillOpacity="0.1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M64,410c81,-105 200,-247 368,-427"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </g>
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="group relative rounded-[2rem] border border-white/30 bg-white/20 p-8 shadow-glass backdrop-blur-2xl transition-all duration-500 hover:border-white/40 hover:bg-white/25 hover:-translate-y-2 flex flex-col justify-between min-h-[320px]"
                >
                  <div className="absolute top-4 right-6 font-mono text-[10px] text-white/60 tracking-widest uppercase">
                    {item.badge}
                  </div>
                  <div>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div className="font-mono text-3xl font-light text-matcha-foam/90 mb-1">
                      {item.year}
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="body-text text-sm leading-relaxed text-white/80 group-hover:text-white transition-colors duration-300">
                      {item.text}
                    </p>
                  </div>
                  <div className="mt-6 w-full h-[1px] bg-white/10 group-hover:bg-white/35 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="section-chapter-2"
          className="flex min-h-screen w-full items-center justify-center px-8 py-24 md:px-24"
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                {t.chapters.chapter2.eyebrow}
              </span>
              <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight text-white drop-shadow-sm md:text-5xl">
                {renderTitle(t.chapters.chapter2.title)}
              </h2>
              <div className="mb-8 h-[1px] w-full bg-matcha-leaf/60"></div>
              <InkTextReveal
                as="div"
                text={[t.chapters.chapter2.p1, t.chapters.chapter2.p2, t.chapters.chapter2.p3].join("\n\n")}
                scroller={landingScroller}
                lockPrintHeadToViewport={true}
                className="ink-text-reveal--light body-text text-base leading-loose text-white/90"
              />
            </div>

            <div className="lg:col-span-7 w-full">
              <div className="rounded-[2.5rem] border border-white/30 bg-white/20 p-8 md:p-12 shadow-glass backdrop-blur-2xl transition-all duration-500 hover:border-white/40">
                <ShadeSimulator lang={lang} />
              </div>
            </div>
          </div>
        </section>

        <section
          id="section-chapter-3"
          className="flex min-h-screen w-full items-center justify-center px-8 py-24 md:px-24"
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 w-full order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/20 p-8 md:p-12 shadow-glass backdrop-blur-2xl transition-all duration-500 hover:border-white/40">
                <ToolsShowcase lang={lang} />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col order-1 lg:order-2">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                {t.chapters.chapter3.eyebrow}
              </span>
              <h2 className="heading-serif mb-8 mt-4 text-4xl leading-tight text-white drop-shadow-sm md:text-5xl">
                {renderTitle(t.chapters.chapter3.title)}
              </h2>
              <div className="mb-8 h-[1px] w-full bg-matcha-leaf/60"></div>
              <InkTextReveal
                as="div"
                text={[t.chapters.chapter3.p1, t.chapters.chapter3.p2, t.chapters.chapter3.p3].join("\n\n")}
                scroller={landingScroller}
                lockPrintHeadToViewport={true}
                className="ink-text-reveal--light body-text text-base leading-loose text-white/90"
              />
            </div>
          </div>
        </section>

        <section
          id="section-chapter-4"
          className="flex min-h-screen w-full items-center justify-center px-8 py-24 md:px-24"
        >
          <div className="max-w-6xl w-full flex flex-col gap-12">
            <div className="max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                {t.chapters.chapter4.eyebrow}
              </span>
              <h2 className="heading-serif mb-6 mt-4 text-4xl leading-tight text-white drop-shadow-sm md:text-5xl">
                {renderTitle(t.chapters.chapter4.title)}
              </h2>
              <div className="h-[1px] w-full bg-matcha-leaf/60 mb-6"></div>
              <InkTextReveal
                as="div"
                text={[t.chapters.chapter4.p2, t.chapters.chapter4.p3].join("\n\n")}
                scroller={landingScroller}
                lockPrintHeadToViewport={true}
                className="ink-text-reveal--light body-text text-base leading-loose text-white/90"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  kanji: "和",
                  romaji: "Wa",
                  title: t.chapters.chapter4.waTitle,
                  desc: t.chapters.chapter4.waDesc,
                },
                {
                  kanji: "敬",
                  romaji: "Kei",
                  title: t.chapters.chapter4.keiTitle,
                  desc: t.chapters.chapter4.keiDesc,
                },
                {
                  kanji: "清",
                  romaji: "Sei",
                  title: t.chapters.chapter4.seiTitle,
                  desc: t.chapters.chapter4.seiDesc,
                },
                {
                  kanji: "寂",
                  romaji: "Jaku",
                  title: t.chapters.chapter4.jakuTitle,
                  desc: t.chapters.chapter4.jakuDesc,
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-[2rem] border border-white/30 bg-white/20 p-6 md:p-8 shadow-glass backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/25 hover:border-white/40"
                >
                  <div className="absolute right-6 bottom-4 select-none pointer-events-none text-white/5 font-serif text-8xl md:text-9xl transition-all duration-500 group-hover:scale-110 group-hover:text-white/10">
                    {item.kanji}
                  </div>
                  
                  <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px] md:min-h-[200px]">
                    <div>
                      <span className="font-mono text-xs font-bold tracking-[0.25em] text-matcha-foam/80 uppercase">
                        {item.romaji}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl text-white mt-2 mb-4 group-hover:text-matcha-foam transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="font-sans text-xs md:text-sm leading-relaxed text-white/70 group-hover:text-white/90 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-glass backdrop-blur-2xl">
              <p className="font-sans text-sm font-light leading-relaxed text-white/60 italic">
                {t.chapters.chapter4.p1}
              </p>
            </div>
          </div>
        </section>

        <section
          id="section-chapter-5"
          className="flex min-h-screen w-full items-center justify-center px-8 py-24 md:px-24"
        >
          <div className="max-w-6xl w-full flex flex-col gap-12">
            <div className="max-w-2xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                {t.chapters.chapter5.eyebrow}
              </span>
              <div className="w-fit">
                <h2 className="heading-serif mb-6 mt-4 text-4xl leading-tight text-white drop-shadow-sm md:text-5xl">
                  {renderTitle(t.chapters.chapter5.title)}
                </h2>
                <div className="h-[1px] w-full bg-matcha-leaf/60"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: t.chapters.chapter5.card1Title,
                  text: t.chapters.chapter5.p1,
                  badge: t.chapters.chapter5.card1Badge,
                },
                {
                  step: "02",
                  title: t.chapters.chapter5.card2Title,
                  text: t.chapters.chapter5.p2,
                  badge: t.chapters.chapter5.card2Badge,
                },
                {
                  step: "03",
                  title: t.chapters.chapter5.card3Title,
                  text: t.chapters.chapter5.p3,
                  badge: t.chapters.chapter5.card3Badge,
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-[2rem] border border-white/30 bg-white/20 p-8 shadow-glass backdrop-blur-2xl transition-all duration-500 hover:border-white/40 hover:bg-white/25 hover:-translate-y-2 flex flex-col justify-between min-h-[320px]"
                >
                  <div className="absolute top-4 right-6 font-mono text-[10px] text-white/60 tracking-widest uppercase">
                    {item.badge}
                  </div>
                  
                  <div>
                    <div className="font-mono text-5xl font-extralight text-matcha-foam/40 mb-6 group-hover:text-matcha-foam transition-colors duration-500">
                      {item.step}
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="body-text text-sm leading-relaxed text-white/80 group-hover:text-white transition-colors duration-300">
                      {item.text}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-white/30 group-hover:text-white/60 transition-colors">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em]">{t.chapters.chapter5.eyebrow}</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="section-final"
          className="flex min-h-[90vh] w-full flex-col items-center justify-center px-8 py-24 text-center md:px-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-[0.03]">
            <svg viewBox="0 0 100 100" className="w-[40rem] h-[40rem] text-white">
              <path d="M 50,5 A 45,45 0 1,0 95,50" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          <div className="landing-copy-panel flex w-full max-w-4xl flex-col items-center rounded-[3rem] border border-white/30 bg-white/20 p-12 shadow-glass backdrop-blur-3xl md:p-24 transition-all duration-500 hover:border-white/40">
            <span className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.25em] text-white/70">
              {t.final.eyebrow}
            </span>
            <h2 className="heading-serif mb-8 text-5xl text-white md:text-6xl drop-shadow-md">
              {renderTitle(t.final.title)}
            </h2>
            <p className="body-text mb-6 max-w-2xl text-lg md:text-xl leading-loose text-white">
              {t.final.p1}
            </p>
            <p className="body-text mb-14 max-w-2xl text-lg md:text-xl leading-loose text-white/80">
              {t.final.p2}
            </p>
            <button
              onClick={onEnter}
              className="group relative flex items-center overflow-hidden rounded-full border border-white/50 bg-white/20 px-10 py-5 transition-all duration-500 hover:bg-white/25 hover:border-white hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] focus:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-matcha-foam/0 via-matcha-foam/10 to-matcha-foam/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-white relative z-10">
                {t.final.button}
              </span>
              <span className="ml-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-matcha-ink transition-transform duration-500 group-hover:scale-110 group-hover:translate-x-1 relative z-10">
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
