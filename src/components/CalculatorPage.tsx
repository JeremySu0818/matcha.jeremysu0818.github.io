import { useEffect } from "react";
import { Header } from "./Header";
import { TeaCalculator } from "../features/calculator/TeaCalculator";
import { useTranslation } from "../i18n";
import { calculatorTranslations } from "../i18n/calculatorTranslations";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
  registerScrollPositionGetter,
} from "../utils/scrollRegistry";

export function CalculatorPage() {
  const { t, lang } = useTranslation();
  const copy = calculatorTranslations[lang] ?? calculatorTranslations.en;

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
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth font-sans text-white"
    >
      <div className="relative z-10 w-full">
        <Header
          activeLink="make"
          darkTheme={true}
          pointerEventsNone={false}
          onLoadAnimation={true}
        />

        <main className="mx-auto w-full max-w-5xl px-8 pb-32 pt-32 md:px-16 md:pt-40">
          <div className="mb-12 max-w-2xl animate-fade-in-up delay-300">
            <div className="mb-6 inline-flex items-center gap-4">
              <span className="h-[1px] w-12 bg-white/60"></span>
              <span className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-white/90">
                {copy.eyebrow}
              </span>
            </div>
            <h1 className="heading-serif mt-4 text-4xl leading-tight drop-shadow-sm md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/90 drop-shadow">
              {copy.description}
            </p>
          </div>

          <div>
            <TeaCalculator copy={copy} />
          </div>
        </main>
      </div>
    </div>
  );
}
