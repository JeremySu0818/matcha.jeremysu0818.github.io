import { useCallback, useEffect, useState } from "react";
import {
  SCROLL_RESTORE_MOTION,
  startScrollAnimation,
} from "../../utils/scrollAnimation";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
  registerScrollPositionGetter,
} from "../../utils/scrollRegistry";
import { LANDING_SECTION_IDS } from "./landingNavigation";

interface LandingScrollNavigation {
  readonly activeStep: number;
  readonly handleStepClick: (index: number) => void;
}

export function useLandingScrollNavigation(): LandingScrollNavigation {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const container = document.getElementById("landing-scroll-container");
    if (!container) return undefined;

    const unregisterHome = registerScrollPositionGetter(
      "",
      () => container.scrollTop,
    );
    const unregisterHashHome = registerScrollPositionGetter(
      "#",
      () => container.scrollTop,
    );
    const savedPosition = readSavedScrollPosition(window.location.hash || "#");
    let rafId = 0;
    let timeoutId = 0;
    let animationDelayTimeoutId = 0;
    let observer: ResizeObserver | null = null;
    let cancelScrollAnimation = (): void => undefined;

    if (savedPosition !== null) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        rafId = requestAnimationFrame(() => {
          const maxScrollTop = Math.max(
            0,
            container.scrollHeight - container.clientHeight,
          );
          container.scrollTo({
            top: Math.min(savedPosition, maxScrollTop),
            behavior: "auto",
          });
          clearSavedScrollPosition();
        });
      } else {
        let animationQueued = false;
        let animated = false;
        const startTime = performance.now();
        const animateScrollRestore = (targetTop: number): void => {
          cancelScrollAnimation = startScrollAnimation({
            fromTop: container.scrollTop,
            onComplete: clearSavedScrollPosition,
            onUpdate: (top) => {
            container.scrollTo({
                top,
              behavior: "auto",
            });
            },
            targetTop,
          });
        };

        const tryRestore = () => {
          if (animated) return;

          const maxScrollTop = Math.max(
            0,
            container.scrollHeight - container.clientHeight,
          );
          const targetTop = Math.min(savedPosition, maxScrollTop);
          const readyToAnimate =
            maxScrollTop >= savedPosition ||
            performance.now() - startTime > 1500;

          if (readyToAnimate) {
            animationQueued = true;
            container.scrollTo({ top: 0, behavior: "auto" });
            animationDelayTimeoutId = window.setTimeout(() => {
              animated = true;
              animateScrollRestore(targetTop);
            }, SCROLL_RESTORE_MOTION.delayMs);
            return;
          }

          rafId = requestAnimationFrame(tryRestore);
        };

        rafId = requestAnimationFrame(tryRestore);

        observer = new ResizeObserver(() => {
          if (!animationQueued) {
            tryRestore();
          }
        });
        observer.observe(container);

        timeoutId = window.setTimeout(() => {
          if (!animationQueued) {
            tryRestore();
          }
        }, 1600);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      cancelScrollAnimation();
      window.clearTimeout(timeoutId);
      window.clearTimeout(animationDelayTimeoutId);
      observer?.disconnect();
      unregisterHome();
      unregisterHashHome();
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("landing-scroll-container");
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + container.clientHeight / 2;

      for (let i = LANDING_SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(
          `section-${LANDING_SECTION_IDS[i]}`,
        );
        if (el && scrollPos >= el.offsetTop) {
          setActiveStep(i);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => { container.removeEventListener("scroll", handleScroll); };
  }, []);

  const handleStepClick = useCallback((index: number) => {
    const el = document.getElementById(
      `section-${LANDING_SECTION_IDS[index]}`,
    );
    const container = document.getElementById("landing-scroll-container");
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, []);

  return { activeStep, handleStepClick };
}
