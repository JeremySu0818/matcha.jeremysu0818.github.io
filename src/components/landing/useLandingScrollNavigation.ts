import { useEffect, useState } from "react";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
  registerScrollPositionGetter,
} from "../../utils/scrollRegistry";
import { LANDING_SECTION_IDS } from "./landingNavigation";

const SCROLL_RESTORE_DELAY_MS = 300;

export function useLandingScrollNavigation() {
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

    if (savedPosition !== null) {
      let animationQueued = false;
      let animated = false;
      const startTime = performance.now();
      const easeInOutCubic = (progress: number) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const animateScrollRestore = (targetTop: number) => {
        const fromTop = container.scrollTop;
        const distance = targetTop - fromTop;
        const duration = Math.min(
          1400,
          Math.max(900, Math.abs(distance) * 0.6),
        );
        const animationStart = performance.now();

        const step = (now: number) => {
          const progress = Math.min(1, (now - animationStart) / duration);
          const eased = easeInOutCubic(progress);
          container.scrollTo({
            top: fromTop + distance * eased,
            behavior: "auto",
          });

          if (progress < 1) {
            rafId = requestAnimationFrame(step);
            return;
          }

          clearSavedScrollPosition();
        };

        rafId = requestAnimationFrame(step);
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
          }, SCROLL_RESTORE_DELAY_MS);
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

    return () => {
      cancelAnimationFrame(rafId);
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

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStepClick = (index: number) => {
    const el = document.getElementById(
      `section-${LANDING_SECTION_IDS[index]}`,
    );
    const container = document.getElementById("landing-scroll-container");
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return { activeStep, handleStepClick };
}
