import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SceneMode } from "../app/sceneMode";
import { SCENE_MODES } from "../app/sceneMode";
import { useTranslation } from "../i18n";
import {
  getDropdownPosition,
  getInitialDropdownPosition,
} from "../utils/dropdownPosition";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface SceneModeSelectorProps {
  mode: SceneMode;
  darkTheme?: boolean;
  onModeChange?: (mode: SceneMode) => void;
  showHint?: boolean;
  onHintDismiss?: () => void;
}

export function SceneModeSelector({
  mode,
  darkTheme = false,
  onModeChange,
  showHint = false,
  onHintDismiss,
}: SceneModeSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 720px)");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState(getInitialDropdownPosition);
  const [btnWidth, setBtnWidth] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintClosing, setHintClosing] = useState(false);

  useEffect(() => {
    if (showHint) {
      setHintVisible(true);
      setHintClosing(false);
    } else {
      if (hintVisible) {
        setHintClosing(true);
        const timer = setTimeout(() => {
          setHintVisible(false);
          setHintClosing(false);
        }, 600); // match animation duration (0.6s)
        return () => clearTimeout(timer);
      }
    }
  }, [showHint, hintVisible]);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos(getDropdownPosition(rect));
    setBtnWidth(rect.width);
  }, []);

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (isOpen || showHint) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen, showHint, updatePosition]);

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
    if (!onModeChange) return;
    onModeChange(nextMode);
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    if (!isInteractive) return;
    if (!isOpen) {
      onHintDismiss?.();
    }
    setIsOpen(!isOpen);
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
  const isInteractive = Boolean(onModeChange);

  const renderModeIcon = () => (
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
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );

  const renderChevronIcon = (isRotated = false) => (
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
      className={`opacity-60 w-[0.7em] h-[0.7em] transition-transform duration-300 ${isRotated ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

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
              maxWidth: menuPos.maxWidth,
              maxHeight: menuPos.maxHeight,
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

  const showHintCard = (hintVisible || showHint) && !isOpen;

  const hintCard = showHintCard
    ? createPortal(
        <div
          style={{
            position: "fixed",
            top: menuPos.top + 4,
            right: menuPos.right + (btnWidth - 220) / 2,
            width: "220px",
            zIndex: 99998,
            transform: isMobile ? "scale(0.8)" : "none",
            transformOrigin: "top center",
          }}
        >
          <div
            className="frosted-surface shadow-glass backdrop-blur-2xl border border-white/30 rounded-2xl p-4 text-center pointer-events-none"
            style={{
              animation: hintClosing
                ? "slideUpOut 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) forwards"
                : "slideDownIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
              backgroundColor: darkTheme ? "rgba(31, 49, 40, 0.4)" : "rgba(255, 255, 255, 0.2)",
              color: darkTheme ? "#fff" : "#1f3128",
            }}
          >
            <p className="text-[14px] font-medium tracking-wide leading-relaxed">
              {t.overlay.switcherHint}
            </p>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggleOpen}
        className={`flex items-center ${isInteractive ? "cursor-pointer pointer-events-auto" : "pointer-events-none"}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.sceneMode.label}
        tabIndex={isInteractive ? 0 : -1}
      >
        <div
          className={`flex items-center gap-1.5 transition-colors duration-300 text-sm scalable-lang-btn tracking-wider ${buttonTextColor}`}
        >
          <span className="scalable-mode-trigger">
            <span className="scalable-mode-trigger-current">
              {renderModeIcon()}
              <span>{modeLabel}</span>
              {renderChevronIcon(isOpen)}
            </span>
          </span>
        </div>
      </button>
      {dropdownMenu}
      {hintCard}
    </>
  );
}
