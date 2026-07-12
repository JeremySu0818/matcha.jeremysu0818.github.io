import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
} from "react";
import { createPortal } from "react-dom";
import { SCENE_MODES } from "../app/sceneMode";
import { useTranslation } from "../i18n";
import {
  getDropdownPosition,
  getInitialDropdownPosition,
} from "../utils/dropdownPosition";
import type { SceneMode } from "../app/sceneMode";

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
}: Readonly<SceneModeSelectorProps>): JSX.Element {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState(getInitialDropdownPosition);
  const [buttonWidth, setButtonWidth] = useState(0);
  const isInteractive = Boolean(onModeChange);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos(getDropdownPosition(rect));
    setButtonWidth(rect.width);
  }, []);

  useEffect(() => {
    if (!isOpen && !showHint) return undefined;

    updatePosition();
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
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
  }, [isOpen, showHint, updatePosition]);

  const handleToggle = () => {
    if (!isInteractive) return;
    if (!isOpen) {
      onHintDismiss?.();
      updatePosition();
    }
    setIsOpen((open) => !open);
  };

  const handleModeChange = (nextMode: SceneMode) => {
    onModeChange?.(nextMode);
    setIsOpen(false);
  };

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className={`editorial-dropdown mode-menu ${
            darkTheme ? "editorial-dropdown--dark" : "editorial-dropdown--paper"
          }`}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            maxWidth: menuPos.maxWidth,
          }}
          role="listbox"
          aria-label={t.sceneMode.label}
        >
          <p className="mode-menu__label">{t.sceneMode.label}</p>
          {SCENE_MODES.map((nextMode, index) => {
            const isSelected = nextMode === mode;
            return (
              <button
                type="button"
                key={nextMode}
                onClick={() => { handleModeChange(nextMode); }}
                className={`mode-menu__option ${isSelected ? "is-selected" : ""}`}
                role="option"
                aria-selected={isSelected}
              >
                <span aria-hidden="true">0{index + 1}</span>
                <strong>{t.sceneMode[nextMode]}</strong>
              </button>
            );
          })}
        </div>,
        document.body,
      )
    : null;

  const hint = showHint && !isOpen
    ? createPortal(
        <div
          className={`mode-hint ${darkTheme ? "mode-hint--dark" : "mode-hint--paper"}`}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: Math.max(12, menuPos.right + (buttonWidth - 260) / 2),
          }}
          role="status"
        >
          <span aria-hidden="true">03</span>
          <p>{t.overlay.switcherHint}</p>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="header-control mode-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.sceneMode.label}
        tabIndex={isInteractive ? 0 : -1}
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
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
        <span>{t.sceneMode[mode]}</span>
        <i className={isOpen ? "is-open" : ""} aria-hidden="true" />
      </button>
      {dropdown}
      {hint}
    </>
  );
}
