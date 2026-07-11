import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type SupportedLanguage,
  SUPPORTED_LANGUAGES,
  getBrowserLanguage,
} from "../i18n/language";
import {
  getScrollPositionForRoute,
  saveScrollPosition,
} from "../utils/scrollRegistry";
import {
  getDropdownPosition,
  getInitialDropdownPosition,
} from "../utils/dropdownPosition";

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  "zh-tw": "繁體中文",
  "zh-cn": "简体中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  "pt-br": "Português",
  ru: "Русский",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  tr: "Türkçe",
  nl: "Nederlands",
  pl: "Polski",
  cs: "Čeština",
  hu: "Magyar",
  hi: "हिन्दी",
  ar: "العربية",
};

interface LanguageSelectorProps {
  darkTheme?: boolean;
}

export function LanguageSelector({ darkTheme = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState(getInitialDropdownPosition);
  const currentLang =
    typeof window !== "undefined" ? getBrowserLanguage() : "en";

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    setMenuPos(getDropdownPosition(buttonRef.current.getBoundingClientRect()));
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    updatePosition();
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current) return undefined;
    const frame = requestAnimationFrame(() => {
      scrollContainerRef.current
        ?.querySelector<HTMLElement>('[aria-selected="true"]')
        ?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    localStorage.setItem("matcha_language", langCode);
    const hash = window.location.hash;
    saveScrollPosition(hash, getScrollPositionForRoute(hash));
    window.location.reload();
  };

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className={`editorial-dropdown language-menu ${
            darkTheme ? "editorial-dropdown--dark" : "editorial-dropdown--paper"
          }`}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            maxWidth: menuPos.maxWidth,
            maxHeight: menuPos.maxHeight,
          }}
          role="listbox"
          aria-label={LANGUAGE_NAMES[currentLang]}
        >
          <div ref={scrollContainerRef} className="language-menu__scroll">
            {SUPPORTED_LANGUAGES.map((langCode, index) => {
              const isSelected = langCode === currentLang;
              return (
                <button
                  type="button"
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`language-menu__option ${
                    isSelected ? "is-selected" : ""
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  lang={langCode}
                  dir={langCode === "ar" ? "rtl" : "ltr"}
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{LANGUAGE_NAMES[langCode]}</strong>
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="header-control language-trigger"
        aria-label={LANGUAGE_NAMES[currentLang]}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
        </svg>
        <span>{LANGUAGE_NAMES[currentLang]}</span>
        <i className={isOpen ? "is-open" : ""} aria-hidden="true" />
      </button>
      {dropdown}
    </>
  );
}
