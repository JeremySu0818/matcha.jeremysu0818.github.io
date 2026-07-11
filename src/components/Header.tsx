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
  const showSceneModeSelector = Boolean(sceneMode && onSceneModeChange);
  const animationClass = onLoadAnimation
    ? "site-header--animate"
    : "site-header--animate-on-load";

  const links = [
    { id: "home" as const, href: "#", label: t.nav.home, number: "01" },
    { id: "3d" as const, href: "#3d", label: t.nav.scene3d, number: "02" },
    {
      id: "make" as const,
      href: "#make",
      label: calculatorCopy.nav,
      number: "03",
    },
  ];

  return (
    <header
      className={`site-header ${darkTheme ? "site-header--light" : "site-header--ink"} ${
        pointerEventsNone ? "site-header--passthrough" : ""
      } ${animationClass}`}
    >
      <a className="site-header__brand" href="#" aria-label={t.header.title}>
        <span>{t.header.title}</span>
        <i aria-hidden="true" />
      </a>

      <nav className="site-header__nav" aria-label={t.header.title}>
        {links.map((link) => {
          const isActive = activeLink === link.id;
          return (
            <a
              key={link.id}
              href={link.href}
              className={`site-header__link ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="site-header__link-number" aria-hidden="true">
                {link.number}
              </span>
              <span className="site-header__link-label">{link.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="site-header__controls">
        {sceneMode && (
          <div
            className={`site-header__mode ${showSceneModeSelector ? "" : "is-hidden"}`}
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
