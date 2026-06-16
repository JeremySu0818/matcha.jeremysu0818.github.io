import { useEffect, useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
} from "../utils/scrollRegistry";

const MAX_SCROLL_RESTORE_FRAMES = 30;

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
}

export function SceneScrollController({
  onScrollElementChange,
  onStepChange,
  stepCount,
}: SceneScrollControllerProps) {
  const scroll = useScroll() as RestorableScrollState;
  const activeStepRef = useRef(0);

  const syncStepFromScrollElement = () => {
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
  }, [scroll.el, onStepChange, stepCount]);

  useEffect(() => {
    const savedPosition = readSavedScrollPosition("#3d");
    if (savedPosition === null) return;

    let frameId = 0;
    let frameCount = 0;

    const restoreScrollPosition = () => {
      const maxScrollTop = scroll.el.scrollHeight - scroll.el.clientHeight;
      const canRestore = maxScrollTop > 0 || savedPosition === 0;

      if (!canRestore && frameCount < MAX_SCROLL_RESTORE_FRAMES) {
        frameCount += 1;
        frameId = requestAnimationFrame(restoreScrollPosition);
        return;
      }

      const restoredPosition = Math.min(savedPosition, Math.max(0, maxScrollTop));
      const restoredProgress =
        maxScrollTop <= 0 ? 0 : restoredPosition / maxScrollTop;

      scroll.el.scrollTop = restoredPosition;
      scroll.scroll.current = restoredProgress;
      scroll.el.dispatchEvent(new Event("scroll"));
      syncStepFromScrollElement();
      clearSavedScrollPosition();
    };

    frameId = requestAnimationFrame(restoreScrollPosition);

    return () => cancelAnimationFrame(frameId);
  }, [scroll.el]);

  useFrame(() => {
    syncStepFromScrollElement();
  });

  return null;
}
