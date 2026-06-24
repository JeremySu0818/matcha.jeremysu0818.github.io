import { useEffect, useState } from "react";
import {
  clearSavedScrollPosition,
  readSavedScrollPosition,
  registerScrollPositionGetter,
} from "../../utils/scrollRegistry";
import { LANDING_SECTION_IDS } from "./landingNavigation";

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

    if (savedPosition !== null) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: savedPosition });
        clearSavedScrollPosition();
      });
    }

    return () => {
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
