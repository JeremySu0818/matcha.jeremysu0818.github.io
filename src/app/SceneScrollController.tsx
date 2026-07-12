import { useCallback, useEffect, useRef, type JSX } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  SCROLL_RESTORE_MOTION,
  startScrollAnimation,
} from "../utils/scrollAnimation";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
} from "../utils/scrollRegistry";

const MAX_SCROLL_RESTORE_FRAMES = 30;

type RestorableScrollState = ReturnType<typeof useScroll> & {
  scroll: { current: number };
};

export function SceneReadyTrigger({
  onReady,
}: Readonly<{ onReady: () => void }>): null {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

interface SceneScrollControllerProps {
  onScrollElementChange: (el: HTMLElement | null) => void;
  onStepChange: (step: number) => void;
  stepCount: number;
  enabled?: boolean;
}

export function SceneScrollController({
  onScrollElementChange,
  onStepChange,
  stepCount,
  enabled = true,
}: Readonly<SceneScrollControllerProps>): JSX.Element | null {
  const scroll = useScroll() as RestorableScrollState;
  const activeStepRef = useRef(0);
  const syncStepFromScrollElement = useCallback(() => {
    if (!enabled) return;

    const maxScrollTop = Math.max(
      1,
      scroll.el.scrollHeight - scroll.el.clientHeight,
    );
    const progress = Math.min(
      1,
      Math.max(0, scroll.el.scrollTop / maxScrollTop),
    );
    const maxStep = Math.max(0, stepCount - 1);
    const step = Math.min(maxStep, Math.max(0, Math.round(progress * maxStep)));

    if (step !== activeStepRef.current) {
      activeStepRef.current = step;
      onStepChange(step);
    }
  }, [enabled, onStepChange, scroll.el, stepCount]);

  useEffect(() => {
    onScrollElementChange(scroll.el);
    return () => { onScrollElementChange(null); };
  }, [onScrollElementChange, scroll.el]);

  useEffect(() => {
    const handleScroll = () => { syncStepFromScrollElement(); };
    const handleResize = () => { syncStepFromScrollElement(); };

    scroll.el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    syncStepFromScrollElement();

    return () => {
      scroll.el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scroll.el, syncStepFromScrollElement]);

  useEffect(() => {
    const savedPosition = readSavedScrollPosition("#3d");
    if (!enabled || savedPosition === null) return;

    let frameId = 0;
    let frameCount = 0;
    let delayTimeoutId = 0;
    let animationQueued = false;
    let cancelScrollAnimation = (): void => undefined;

    const syncScrollState = (top: number): void => {
      const maxScrollTop = Math.max(0, scroll.el.scrollHeight - scroll.el.clientHeight);
      const restoredPosition = Math.min(top, maxScrollTop);
      const restoredProgress =
        maxScrollTop <= 0 ? 0 : restoredPosition / maxScrollTop;

      scroll.el.scrollTop = restoredPosition;
      scroll.scroll.current = restoredProgress;
      scroll.el.dispatchEvent(new Event("scroll"));
      syncStepFromScrollElement();
    };

    const animateScrollRestore = (targetTop: number): void => {
      cancelScrollAnimation = startScrollAnimation({
        fromTop: scroll.el.scrollTop,
        onComplete: clearSavedScrollPosition,
        onUpdate: syncScrollState,
        targetTop,
      });
    };

    const restoreScrollPosition = () => {
      if (animationQueued) return;

      const maxScrollTop = scroll.el.scrollHeight - scroll.el.clientHeight;
      const canRestore = maxScrollTop > 0 || savedPosition === 0;

      if (!canRestore && frameCount < MAX_SCROLL_RESTORE_FRAMES) {
        frameCount += 1;
        frameId = requestAnimationFrame(restoreScrollPosition);
        return;
      }

      animationQueued = true;
      const restoredPosition = Math.min(savedPosition, Math.max(0, maxScrollTop));
      syncScrollState(0);
      delayTimeoutId = window.setTimeout(() => {
        animateScrollRestore(restoredPosition);
      }, SCROLL_RESTORE_MOTION.delayMs);
    };

    frameId = requestAnimationFrame(restoreScrollPosition);

    return () => {
      cancelAnimationFrame(frameId);
      cancelScrollAnimation();
      window.clearTimeout(delayTimeoutId);
    };
  }, [enabled, scroll.el, scroll.scroll, syncStepFromScrollElement]);

  useFrame(() => {
    if (!enabled) return;
    syncStepFromScrollElement();
  });

  return null;
}
