import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getBrowserLanguage } from '../i18n/language';
import { getScrollPositionForRoute, saveScrollPosition } from '../utils/scrollRegistry';

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  'zh-tw': '繁體中文',
  'zh-cn': '简体中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'it': 'Italiano',
  'pt-br': 'Português',
  'ru': 'Русский',
  'vi': 'Tiếng Việt',
  'id': 'Bahasa Indonesia',
  'tr': 'Türkçe',
  'nl': 'Nederlands',
  'pl': 'Polski',
  'cs': 'Čeština',
  'hu': 'Magyar',
  'hi': 'हिन्दी',
  'ar': 'العربية',
};

interface LanguageSelectorProps {
  darkTheme?: boolean;
}

export function LanguageSelector({ darkTheme = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const currentLang = typeof window !== 'undefined' ? getBrowserLanguage() : 'en';

  // Automatically scroll active language into view when dropdown opens
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const timer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const activeElement = container.querySelector('[aria-selected="true"]') as HTMLElement;
        if (activeElement) {
          const containerRect = container.getBoundingClientRect();
          const elemRect = activeElement.getBoundingClientRect();
          const relativeTop = elemRect.top - containerRect.top + container.scrollTop;

          const isAbove = relativeTop < container.scrollTop;
          const isBelow = relativeTop + elemRect.height > container.scrollTop + container.clientHeight;

          if (isAbove || isBelow) {
            const targetScrollTop = relativeTop - container.clientHeight / 2 + elemRect.height / 2;
            container.scrollTo({
              top: Math.max(0, targetScrollTop),
              behavior: 'smooth',
            });
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Calculate position of the portal dropdown relative to the button
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    localStorage.setItem('matcha_language', langCode);

    const hash = window.location.hash;
    saveScrollPosition(hash, getScrollPositionForRoute(hash));
    window.location.reload();
  };

  const buttonTextColor = darkTheme
    ? 'text-white/60 drop-shadow-sm'
    : 'text-matcha-ink/60 drop-shadow-sm';

  const optionStyle = (isSelected: boolean) => darkTheme
    ? isSelected
      ? 'bg-white/20 text-white font-medium'
      : 'text-white/75 hover:text-white hover:bg-white/10'
    : isSelected
      ? 'bg-matcha-ink/10 text-matcha-ink font-semibold'
      : 'text-matcha-ink/75 hover:text-matcha-ink hover:bg-matcha-ink/5';

  // The dropdown rendered via portal directly on <body>
  const dropdownMenu = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className="lang-dropdown-portal"
          style={{
            position: 'fixed',
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 99999,
          }}
        >
          <div
            ref={scrollContainerRef}
            className={`lang-dropdown-glass frosted-surface ${
              darkTheme ? 'frosted-surface-dark' : 'frosted-surface-light'
            }`}
            style={{
              width: '11rem',
              maxHeight: '260px',
              overflowY: 'auto',
              borderRadius: '1rem',
              border: '1px solid var(--glass-border)',
              color: darkTheme ? '#fff' : '#1f3128',
              fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
              animation: 'langDropdownIn 0.25s cubic-bezier(0.16,1,0.3,1)',
              transformOrigin: 'top right',
            }}
          >
            <div style={{ padding: '4px' }}>
              {SUPPORTED_LANGUAGES.map((langCode) => {
                const isSelected = langCode === currentLang;
                return (
                  <button
                    key={langCode}
                    onClick={() => handleLanguageChange(langCode)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors duration-200 cursor-pointer ${optionStyle(isSelected)}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {LANGUAGE_NAMES[langCode] || langCode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer pointer-events-auto"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className={`flex items-center gap-1.5 transition-colors duration-300 text-sm scalable-lang-btn tracking-wider ${buttonTextColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 w-[1em] h-[1em]">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>{LANGUAGE_NAMES[currentLang] || currentLang}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} opacity-60 w-[0.7em] h-[0.7em]`}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>
      {dropdownMenu}
    </>
  );
}
