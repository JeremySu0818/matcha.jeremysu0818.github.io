import { useRef, useState, useLayoutEffect } from "react";
import type { SceneMode } from "../app/sceneMode";
import { getCalculatorCopy, useTranslation } from "../i18n";
import { LanguageSelector } from "./LanguageSelector";
import { SceneModeSelector } from "./SceneModeSelector";

interface HeaderProps {
  activeLink: "home" | "3d" | "make";
  darkTheme?: boolean;
  pointerEventsNone?: boolean;
  onLoadAnimation?: boolean;
  sceneMode?: SceneMode;
  onSceneModeChange?: (mode: SceneMode) => void;
  showSwitcherHint?: boolean;
  onSwitcherHintDismiss?: () => void;
}

export function Header({
  activeLink,
  darkTheme = false,
  pointerEventsNone = false,
  onLoadAnimation = false,
  sceneMode,
  onSceneModeChange,
  showSwitcherHint = false,
  onSwitcherHintDismiss,
}: HeaderProps) {
  const { t, lang } = useTranslation();
  const calculatorCopy = getCalculatorCopy(lang);
  const headerRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleResize = () => {
      header.style.setProperty("--header-scale", "1");

      const primary = header.querySelector<HTMLElement>(
        ".scalable-header-primary",
      );
      const controls = header.querySelector<HTMLElement>(
        ".scalable-header-controls",
      );
      const clientWidth = header.clientWidth;
      const headerStyle = window.getComputedStyle(header);
      const paddingLeft = parseFloat(headerStyle.paddingLeft || "0");
      const paddingRight = parseFloat(headerStyle.paddingRight || "0");
      const parsedColumnGap = parseFloat(headerStyle.columnGap);
      const parsedGap = parseFloat(headerStyle.gap);
      const headerGap = Number.isFinite(parsedColumnGap)
        ? parsedColumnGap
        : Number.isFinite(parsedGap)
          ? parsedGap
          : 0;
      const availableWidth = clientWidth - paddingLeft - paddingRight;
      const contentWidth =
        (primary?.scrollWidth ?? 0) + (controls?.scrollWidth ?? 0) + headerGap;

      if (contentWidth > availableWidth && availableWidth > 0) {
        const calculatedScale = (availableWidth / contentWidth) * 0.98;
        const finalScale = Math.max(0.42, Math.min(1, calculatedScale));
        setScale(finalScale);
        header.style.setProperty("--header-scale", String(finalScale));
      } else {
        setScale(1);
        header.style.setProperty("--header-scale", "1");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(header);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [activeLink, calculatorCopy.nav, lang, t.header.title, t.nav.home, t.nav.scene3d]);

  const headerClass = pointerEventsNone
    ? "fixed left-0 top-0 z-50 flex w-full items-center justify-between pointer-events-none scalable-header"
    : "fixed left-0 top-0 z-50 flex w-full items-center justify-between scalable-header";

  const containerClass = pointerEventsNone
    ? "scalable-header-primary pointer-events-auto"
    : "scalable-header-primary";

  const navClass = pointerEventsNone
    ? "scalable-header-nav pointer-events-auto"
    : "scalable-header-nav";

  const logoColor = darkTheme ? "text-white" : "text-matcha-ink";
  const navTextColor = darkTheme ? "text-white" : "text-matcha-ink";

  const animSuffix = onLoadAnimation ? "" : "-on-load";
  const delay100 = `animate-fade-in-up${animSuffix} delay-100`;
  const delay200 = `animate-fade-in-up${animSuffix} delay-200`;
  const delay300 = `animate-fade-in-up${animSuffix} delay-300`;
  const showSceneModeSelector = Boolean(sceneMode && onSceneModeChange);

  return (
    <header
      ref={headerRef}
      className={headerClass}
      style={{ "--header-scale": scale } as React.CSSProperties}
    >
      <div className={containerClass}>
        <div
          className={`heading-serif tracking-widest drop-shadow-md scalable-title ${logoColor} ${delay100}`}
        >
          {t.header.title}
        </div>
        <nav className={`${navClass} ${delay200}`}>
          <a
            href="#"
            className="flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-sans tracking-wider transition-colors duration-300 drop-shadow-sm scalable-nav-link ${
                activeLink === "home"
                  ? `${navTextColor} font-medium`
                  : `${navTextColor}/60 group-hover:${navTextColor}`
              }`}
            >
              {t.nav.home}
            </span>
            <span
              className={`w-full h-[1.5px] rounded-full mt-1 transition-transform duration-300 origin-center ${
                activeLink === "home"
                  ? `scale-x-100 ${darkTheme ? "bg-white" : "bg-matcha-ink"}`
                  : `scale-x-0 group-hover:scale-x-50 ${
                      darkTheme ? "bg-white/40" : "bg-matcha-ink/40"
                    }`
              }`}
            />
          </a>
          <a
            href="#3d"
            className="flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-sans tracking-wider transition-colors duration-300 drop-shadow-sm scalable-nav-link ${
                activeLink === "3d"
                  ? `${navTextColor} font-medium`
                  : `${navTextColor}/60 group-hover:${navTextColor}`
              }`}
            >
              {t.nav.scene3d}
            </span>
            <span
              className={`w-full h-[1.5px] rounded-full mt-1 transition-transform duration-300 origin-center ${
                activeLink === "3d"
                  ? `scale-x-100 ${darkTheme ? "bg-white" : "bg-matcha-ink"}`
                  : `scale-x-0 group-hover:scale-x-50 ${
                      darkTheme ? "bg-white/40" : "bg-matcha-ink/40"
                    }`
              }`}
            />
          </a>
          <a
            href="#make"
            className="flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-sans tracking-wider transition-colors duration-300 drop-shadow-sm scalable-nav-link ${
                activeLink === "make"
                  ? `${navTextColor} font-medium`
                  : `${navTextColor}/60 group-hover:${navTextColor}`
              }`}
            >
              {calculatorCopy.nav}
            </span>
            <span
              className={`w-full h-[1.5px] rounded-full mt-1 transition-transform duration-300 origin-center ${
                activeLink === "make"
                  ? `scale-x-100 ${darkTheme ? "bg-white" : "bg-matcha-ink"}`
                  : `scale-x-0 group-hover:scale-x-50 ${
                      darkTheme ? "bg-white/40" : "bg-matcha-ink/40"
                    }`
              }`}
            />
          </a>
        </nav>
      </div>
      <div className={`${delay300} scalable-header-controls`}>
        {sceneMode && (
          <div
            className={showSceneModeSelector ? "" : "invisible pointer-events-none"}
            aria-hidden={showSceneModeSelector ? undefined : true}
          >
            <SceneModeSelector
              mode={sceneMode}
              darkTheme={darkTheme}
              onModeChange={onSceneModeChange}
              showHint={showSwitcherHint}
              onHintDismiss={onSwitcherHintDismiss}
            />
          </div>
        )}
        <LanguageSelector darkTheme={darkTheme} />
      </div>
    </header>
  );
}
