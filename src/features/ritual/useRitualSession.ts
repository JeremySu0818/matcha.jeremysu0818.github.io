import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { MANUAL_RITUAL_CONFIG } from "../../components/scene/config/ritual";
import type { SceneMode } from "../../app/sceneMode";
import type { ManualStage } from "../../components/scene/manualRitual";

interface UseRitualSessionOptions {
  readonly onSceneModeChange: (mode: SceneMode) => void;
  readonly sceneMode: SceneMode;
  readonly scrollElement: HTMLElement | null;
}

interface RitualSession {
  readonly activeStep: number;
  readonly dismissSwitcherHint: () => void;
  readonly handleManualComplete: () => void;
  readonly handleManualReplay: () => void;
  readonly handleSceneModeChange: (mode: SceneMode) => void;
  readonly manualDone: boolean;
  readonly manualResetToken: number;
  readonly manualStage: ManualStage;
  readonly manualStarted: boolean;
  readonly setActiveStep: Dispatch<SetStateAction<number>>;
  readonly setManualStage: Dispatch<SetStateAction<ManualStage>>;
  readonly setManualStarted: Dispatch<SetStateAction<boolean>>;
  readonly showSwitcherHint: boolean;
}

export function useRitualSession({
  onSceneModeChange,
  sceneMode,
  scrollElement,
}: UseRitualSessionOptions): RitualSession {
  const [activeStep, setActiveStep] = useState(sceneMode === "manual" ? 2 : 0);
  const [manualStarted, setManualStarted] = useState(false);
  const [manualDone, setManualDone] = useState(false);
  const [manualStage, setManualStage] =
    useState<ManualStage>("sieve-drag");
  const [manualResetToken, setManualResetToken] = useState(0);
  const [showSwitcherHint, setShowSwitcherHint] = useState(false);
  const completionTimeoutRef = useRef<number | null>(null);
  const hintShowTimeoutRef = useRef<number | null>(null);
  const hintHideTimeoutRef = useRef<number | null>(null);

  const clearCompletionTimeout = useCallback(() => {
    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  const clearHintTimeouts = useCallback(() => {
    if (hintShowTimeoutRef.current !== null) {
      window.clearTimeout(hintShowTimeoutRef.current);
      hintShowTimeoutRef.current = null;
    }
    if (hintHideTimeoutRef.current !== null) {
      window.clearTimeout(hintHideTimeoutRef.current);
      hintHideTimeoutRef.current = null;
    }
  }, []);

  const dismissSwitcherHint = useCallback(() => {
    clearHintTimeouts();
    setShowSwitcherHint(false);
  }, [clearHintTimeouts]);

  useEffect(() => {
    if (sceneMode !== "manual" || !manualDone) return;
    clearHintTimeouts();
    hintShowTimeoutRef.current = window.setTimeout(() => {
      setShowSwitcherHint(true);
      hintHideTimeoutRef.current = window.setTimeout(() => {
        setShowSwitcherHint(false);
      }, MANUAL_RITUAL_CONFIG.uiTiming.switcherHintVisibleMs);
    }, MANUAL_RITUAL_CONFIG.uiTiming.switcherHintDelayMs);
    return clearHintTimeouts;
  }, [clearHintTimeouts, manualDone, sceneMode]);

  useEffect(
    () => () => {
      clearCompletionTimeout();
      clearHintTimeouts();
    },
    [clearCompletionTimeout, clearHintTimeouts],
  );

  const resetScroll = useCallback(() => {
    scrollElement?.scrollTo({ behavior: "auto", top: 0 });
  }, [scrollElement]);

  const resetManualState = useCallback(() => {
    clearCompletionTimeout();
    clearHintTimeouts();
    setManualDone(false);
    setManualStarted(false);
    setManualStage("sieve-drag");
    setShowSwitcherHint(false);
  }, [clearCompletionTimeout, clearHintTimeouts]);

  const handleSceneModeChange = useCallback(
    (nextMode: SceneMode) => {
      resetManualState();
      setActiveStep(nextMode === "manual" ? 2 : 0);
      resetScroll();
      onSceneModeChange(nextMode);
    },
    [onSceneModeChange, resetManualState, resetScroll],
  );

  const handleManualReplay = useCallback(() => {
    resetManualState();
    setActiveStep(2);
    setManualResetToken((value) => value + 1);
    resetScroll();
  }, [resetManualState, resetScroll]);

  const handleManualComplete = useCallback(() => {
    clearCompletionTimeout();
    completionTimeoutRef.current = window.setTimeout(() => {
      setManualDone(true);
    }, MANUAL_RITUAL_CONFIG.uiTiming.completionDelayMs);
  }, [clearCompletionTimeout]);

  return {
    activeStep,
    dismissSwitcherHint,
    handleManualComplete,
    handleManualReplay,
    handleSceneModeChange,
    manualDone,
    manualResetToken,
    manualStage,
    manualStarted,
    setActiveStep,
    setManualStage,
    setManualStarted,
    showSwitcherHint,
  };
}
