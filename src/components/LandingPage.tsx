import type { JSX } from "react";
import { useTranslation } from "../i18n";
import { InkTextReveal } from "./effects/InkTextReveal";
import { Header } from "./Header";
import { ShadeSimulator } from "./interactive/ShadeSimulator";
import { ToolsShowcase } from "./interactive/ToolsShowcase";
import { getLandingSteps } from "./landing/landingNavigation";
import { renderTitle } from "./landing/renderTitle";
import { useLandingHeaderTheme } from "./landing/useLandingHeaderTheme";
import { useLandingScrollNavigation } from "./landing/useLandingScrollNavigation";
import { NavigationDots } from "./NavigationDots";
import type { SceneMode } from "../app/sceneMode";

interface LandingPageProps {
  onEnter: () => void;
  sceneMode: SceneMode;
}

const landingScroller = "#landing-scroll-container";

export function LandingPage({
  onEnter,
  sceneMode,
}: Readonly<LandingPageProps>): JSX.Element {
  const { t, lang } = useTranslation();
  const { activeStep, handleStepClick } = useLandingScrollNavigation();
  const steps = getLandingSteps(t);
  const useLightHeaderText = useLandingHeaderTheme(lang);
  const useLightNavigation = [0, 2, 4, 6].includes(activeStep);

  const history = [
    {
      year: "1191",
      title: t.chapters.chapter1.card1Title,
      badge: t.chapters.chapter1.card1Badge,
      text: t.chapters.chapter1.p1,
    },
    {
      year: "1500s",
      title: t.chapters.chapter1.card2Title,
      badge: t.chapters.chapter1.card2Badge,
      text: t.chapters.chapter1.p2,
    },
    {
      year: "Wabi-Sabi",
      title: t.chapters.chapter1.card3Title,
      badge: t.chapters.chapter1.card3Badge,
      text: t.chapters.chapter1.p3,
    },
  ];

  const principles = [
    {
      kanji: "和",
      title: t.chapters.chapter4.waTitle,
      desc: t.chapters.chapter4.waDesc,
    },
    {
      kanji: "敬",
      title: t.chapters.chapter4.keiTitle,
      desc: t.chapters.chapter4.keiDesc,
    },
    {
      kanji: "清",
      title: t.chapters.chapter4.seiTitle,
      desc: t.chapters.chapter4.seiDesc,
    },
    {
      kanji: "寂",
      title: t.chapters.chapter4.jakuTitle,
      desc: t.chapters.chapter4.jakuDesc,
    },
  ];

  const process = [
    {
      number: "01",
      title: t.chapters.chapter5.card1Title,
      badge: t.chapters.chapter5.card1Badge,
      text: t.chapters.chapter5.p1,
    },
    {
      number: "02",
      title: t.chapters.chapter5.card2Title,
      badge: t.chapters.chapter5.card2Badge,
      text: t.chapters.chapter5.p2,
    },
    {
      number: "03",
      title: t.chapters.chapter5.card3Title,
      badge: t.chapters.chapter5.card3Badge,
      text: t.chapters.chapter5.p3,
    },
  ];

  return (
    <div
      id="landing-scroll-container"
      className="site-scroll landing-exhibition"
    >
      <Header
        activeLink="home"
        darkTheme={useLightHeaderText}
        pointerEventsNone={false}
        onLoadAnimation
        sceneMode={sceneMode}
      />

      <main className="landing-main">
        <section id="section-hero" className="landing-hero">
          <div className="landing-hero__rule" aria-hidden="true" />
          <div className="landing-hero__index" aria-hidden="true">
            <span>01</span>
            <span>07</span>
          </div>

          <div className="landing-hero__title-block">
            <p className="editorial-eyebrow landing-hero__eyebrow">
              {t.hero.eyebrow}
            </p>
            <h1 className="display-title landing-hero__title">
              {renderTitle(t.hero.title)}
            </h1>
          </div>

          <div className="landing-hero__note">
            <span className="landing-hero__note-mark" aria-hidden="true" />
            <p>{t.hero.description}</p>
          </div>

          <div className="landing-hero__scroll" aria-hidden="true">
            <span>{t.hero.scroll}</span>
            <i />
          </div>
        </section>

        <section id="section-chapter-1" className="exhibition-section archive-section">
          <header className="section-heading archive-section__heading">
            <p className="editorial-eyebrow">{t.chapters.chapter1.eyebrow}</p>
            <h2>{renderTitle(t.chapters.chapter1.title)}</h2>
          </header>

          <div className="archive-timeline">
            <div className="archive-timeline__axis" aria-hidden="true" />
            {history.map((item, index) => (
              <article className="archive-entry" key={item.year}>
                <div className="archive-entry__marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="archive-entry__date">{item.year}</div>
                <div className="archive-entry__copy">
                  <p className="archive-entry__badge">{item.badge}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="section-chapter-2" className="exhibition-section shade-section">
          <div className="shade-section__copy">
            <header className="section-heading section-heading--compact">
              <p className="editorial-eyebrow">{t.chapters.chapter2.eyebrow}</p>
              <h2>{renderTitle(t.chapters.chapter2.title)}</h2>
            </header>

            <InkTextReveal
              text={[t.chapters.chapter2.p1, t.chapters.chapter2.p2].join(
                "\n\n",
              )}
              scroller={landingScroller}
              className="ink-text-reveal--light editorial-body shade-section__body"
            />

            <p className="shade-section__footnote">
              <span aria-hidden="true">02.1</span>
              {t.chapters.chapter2.p3}
            </p>
          </div>

          <div className="shade-section__instrument">
            <ShadeSimulator lang={lang} />
          </div>
        </section>

        <section id="section-chapter-3" className="exhibition-section tools-section">
          <header className="section-heading tools-section__heading">
            <p className="editorial-eyebrow">{t.chapters.chapter3.eyebrow}</p>
            <h2>{renderTitle(t.chapters.chapter3.title)}</h2>
          </header>

          <div className="tools-section__essay">
            <span className="tools-section__folio" aria-hidden="true">03</span>
            <InkTextReveal
              text={[
                t.chapters.chapter3.p1,
                t.chapters.chapter3.p2,
                t.chapters.chapter3.p3,
              ].join("\n\n")}
              scroller={landingScroller}
              className="ink-text-reveal--dark editorial-body"
            />
          </div>

          <div className="tools-section__showcase">
            <ToolsShowcase lang={lang} />
          </div>
        </section>

        <section id="section-chapter-4" className="exhibition-section principles-section">
          <header className="section-heading principles-section__heading">
            <p className="editorial-eyebrow">{t.chapters.chapter4.eyebrow}</p>
            <h2>{renderTitle(t.chapters.chapter4.title)}</h2>
            <p className="principles-section__intro">{t.chapters.chapter4.p1}</p>
          </header>

          <div className="principle-field">
            {principles.map((item, index) => (
              <article className="principle" key={item.kanji}>
                <span className="principle__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="principle__kanji" lang="ja">
                  {item.kanji}
                </span>
                <div className="principle__copy">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="principles-section__closing">
            <p>{t.chapters.chapter4.p2}</p>
            <p>{t.chapters.chapter4.p3}</p>
          </div>
        </section>

        <section id="section-chapter-5" className="exhibition-section process-section">
          <header className="section-heading process-section__heading">
            <p className="editorial-eyebrow">{t.chapters.chapter5.eyebrow}</p>
            <h2>{renderTitle(t.chapters.chapter5.title)}</h2>
          </header>

          <ol className="ritual-process">
            {process.map((item) => (
              <li className="ritual-process__step" key={item.number}>
                <div className="ritual-process__number" aria-hidden="true">
                  {item.number}
                </div>
                <div className="ritual-process__pulse" aria-hidden="true" />
                <p className="ritual-process__badge">{item.badge}</p>
                <h3>{item.title}</h3>
                <p className="ritual-process__body">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="section-final" className="exhibition-section final-section">
          <div className="final-section__orbit" aria-hidden="true" />
          <div className="final-section__title">
            <p className="editorial-eyebrow">{t.final.eyebrow}</p>
            <h2>{renderTitle(t.final.title)}</h2>
          </div>
          <div className="final-section__copy">
            <p>{t.final.p1}</p>
            <p>{t.final.p2}</p>
            <button type="button" className="editorial-action" onClick={onEnter}>
              <span>{t.final.button}</span>
              <i aria-hidden="true" />
            </button>
          </div>
          <div className="final-section__edition" aria-hidden="true">07 / 07</div>
        </section>
      </main>

      <NavigationDots
        steps={steps}
        activeStep={activeStep}
        onStepClick={handleStepClick}
        darkTheme={useLightNavigation}
      />
    </div>
  );
}
