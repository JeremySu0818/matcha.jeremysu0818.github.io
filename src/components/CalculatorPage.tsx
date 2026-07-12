import { useEffect, type JSX } from "react";
import { TeaCalculator } from "../features/calculator/TeaCalculator";
import { getCalculatorCopy, useTranslation } from "../i18n";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
  registerScrollPositionGetter,
} from "../utils/scrollRegistry";
import { Header } from "./Header";
import type { SceneMode } from "../app/sceneMode";

interface CalculatorPageProps {
  sceneMode: SceneMode;
}

export function CalculatorPage({
  sceneMode,
}: Readonly<CalculatorPageProps>): JSX.Element {
  const { lang } = useTranslation();
  const copy = getCalculatorCopy(lang);

  useEffect(() => {
    const container = document.getElementById("calculator-scroll-container");
    if (!container) return undefined;

    const unregister = registerScrollPositionGetter(
      "#make",
      () => container.scrollTop,
    );
    const savedPosition = readSavedScrollPosition("#make");

    if (savedPosition !== null) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: savedPosition });
        clearSavedScrollPosition();
      });
    }

    return unregister;
  }, []);

  return (
    <div
      id="calculator-scroll-container"
      className="site-scroll calculator-page"
    >
      <Header
        activeLink="make"
        darkTheme
        pointerEventsNone={false}
        onLoadAnimation
        sceneMode={sceneMode}
      />

      <main className="calculator-page__layout">
        <header className="calculator-intro">
          <div className="calculator-intro__folio" aria-hidden="true">
            <span>03</span>
            <i />
          </div>
          <div className="calculator-intro__copy">
            <p className="editorial-eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <div className="calculator-intro__measure" aria-hidden="true">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </header>

        <div className="calculator-instrument">
          <TeaCalculator copy={copy} />
        </div>
      </main>
    </div>
  );
}
