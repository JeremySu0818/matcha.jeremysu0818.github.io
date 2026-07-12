import { useEffect, useState } from "react";
import { measureHeaderLuminance } from "./headerContrast";

const HEADER_SELECTOR = ".site-header";
const LIGHT_TEXT_THRESHOLD = 0.48;

export function useLandingHeaderTheme(lang: string): boolean {
  const [useLightText, setUseLightText] = useState(true);
  useEffect(() => {
    const container = document.getElementById("landing-scroll-container");
    const header = container?.querySelector<HTMLElement>(HEADER_SELECTOR);
    if (!container || !header) return undefined;
    let frameId = 0;
    let lastMeasured: boolean | null = null;
    const measure = (): void => {
      frameId = 0;
      const averageLuminance = measureHeaderLuminance(header);
      if (averageLuminance === null) return;
      const nextUseLightText = averageLuminance < LIGHT_TEXT_THRESHOLD;
      if (nextUseLightText === lastMeasured) return;
      lastMeasured = nextUseLightText;
      setUseLightText(nextUseLightText);
    };
    const scheduleMeasure = (): void => {
      if (frameId === 0) frameId = requestAnimationFrame(measure);
    };
    container.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(header);
    observer.observe(container);
    scheduleMeasure();
    return () => {
      container.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      observer.disconnect();
      if (frameId !== 0) cancelAnimationFrame(frameId);
    };
  }, [lang]);
  return useLightText;
}
