import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SceneMode } from "../app/sceneMode";
import { SCENE_MODES } from "../app/sceneMode";
import { useTranslation } from "../i18n";

interface SceneModeSelectorProps {
  mode: SceneMode;
  darkTheme?: boolean;
  onModeChange: (mode: SceneMode) => void;
}

export function SceneModeSelector({
  mode,
  darkTheme = false,
  onModeChange,
}: SceneModeSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

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
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleModeChange = (nextMode: SceneMode) => {
    onModeChange(nextMode);
    setIsOpen(false);
  };

  const buttonTextColor = darkTheme
    ? "text-white/60 drop-shadow-sm"
    : "text-matcha-ink/60 drop-shadow-sm";

  const optionStyle = (isSelected: boolean) =>
    darkTheme
      ? isSelected
        ? "bg-white/20 text-white font-medium"
        : "text-white/75 hover:text-white hover:bg-white/10"
      : isSelected
        ? "bg-matcha-ink/10 text-matcha-ink font-semibold"
        : "text-matcha-ink/75 hover:text-matcha-ink hover:bg-matcha-ink/5";

  const modeLabel = t.sceneMode[mode];

  const dropdownMenu = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className="lang-dropdown-portal"
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 99999,
          }}
        >
          <div
            className={`lang-dropdown-glass frosted-surface ${
              darkTheme ? "frosted-surface-dark" : "frosted-surface-light"
            }`}
            style={{
              width: "11rem",
              maxHeight: "260px",
              overflowY: "auto",
              borderRadius: "1rem",
              border: "1px solid var(--glass-border)",
              color: darkTheme ? "#fff" : "#1f3128",
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
              animation: "langDropdownIn 0.25s cubic-bezier(0.16,1,0.3,1)",
              transformOrigin: "top right",
            }}
          >
            <div style={{ padding: "4px" }}>
              {SCENE_MODES.map((nextMode) => {
                const isSelected = nextMode === mode;
                return (
                  <button
                    key={nextMode}
                    onClick={() => handleModeChange(nextMode)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors duration-200 cursor-pointer ${optionStyle(isSelected)}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {t.sceneMode[nextMode]}
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
        aria-label={t.sceneMode.label}
      >
        <div
          className={`flex items-center gap-1.5 transition-colors duration-300 text-sm scalable-lang-btn tracking-wider ${buttonTextColor}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80 w-[1em] h-[1em]"
          >
            <path d="M21 12a9 9 0 1 1-9-9" />
            <path d="M21 3v7h-7" />
            <path d="M21 10 12 3" />
          </svg>
          <span>{modeLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} opacity-60 w-[0.7em] h-[0.7em]`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>
      {dropdownMenu}
    </>
  );
}
