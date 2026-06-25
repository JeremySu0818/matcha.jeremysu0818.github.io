import { useEffect, useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
} from "../utils/scrollRegistry";

const MAX_SCROLL_RESTORE_FRAMES = 30;
const SCROLL_RESTORE_DELAY_MS = 300;
const MIN_SCROLL_RESTORE_DURATION_MS = 900;
const MAX_SCROLL_RESTORE_DURATION_MS = 1400;

type RestorableScrollState = ReturnType<typeof useScroll> & {
  scroll: { current: number };
};

export function SceneReadyTrigger({ onReady }: { onReady: () => void }) {
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
}: SceneScrollControllerProps) {
  const scroll = useScroll() as RestorableScrollState;
  const activeStepRef = useRef(0);
  const easeInOutCubic = (progress: number) =>
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const syncStepFromScrollElement = () => {
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
  };

  useEffect(() => {
    onScrollElementChange(scroll.el);
    return () => onScrollElementChange(null);
  }, [onScrollElementChange, scroll.el]);

  useEffect(() => {
    const handleScroll = () => syncStepFromScrollElement();
    const handleResize = () => syncStepFromScrollElement();

    scroll.el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    syncStepFromScrollElement();

    return () => {
      scroll.el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scroll.el, onStepChange, stepCount, enabled]);

  useEffect(() => {
    const savedPosition = readSavedScrollPosition("#3d");
    if (!enabled || savedPosition === null) return;

    let frameId = 0;
    let frameCount = 0;
    let delayTimeoutId = 0;
    let animationQueued = false;

    const syncScrollState = (top: number) => {
      const maxScrollTop = Math.max(0, scroll.el.scrollHeight - scroll.el.clientHeight);
      const restoredPosition = Math.min(top, maxScrollTop);
      const restoredProgress =
        maxScrollTop <= 0 ? 0 : restoredPosition / maxScrollTop;

      scroll.el.scrollTop = restoredPosition;
      scroll.scroll.current = restoredProgress;
      scroll.el.dispatchEvent(new Event("scroll"));
      syncStepFromScrollElement();
    };

    const animateScrollRestore = (targetTop: number) => {
      const fromTop = scroll.el.scrollTop;
      const distance = targetTop - fromTop;
      const duration = Math.min(
        MAX_SCROLL_RESTORE_DURATION_MS,
        Math.max(
          MIN_SCROLL_RESTORE_DURATION_MS,
          Math.abs(distance) * 0.6,
        ),
      );
      const animationStart = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - animationStart) / duration);
        const eased = easeInOutCubic(progress);
        syncScrollState(fromTop + distance * eased);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
          return;
        }

        clearSavedScrollPosition();
      };

      frameId = requestAnimationFrame(step);
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
      }, SCROLL_RESTORE_DELAY_MS);
    };

    frameId = requestAnimationFrame(restoreScrollPosition);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(delayTimeoutId);
    };
  }, [scroll.el, enabled]);

  useFrame(() => {
    if (!enabled) return;
    syncStepFromScrollElement();
  });

  return null;
}
