import {
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createInkTextScrollTrigger } from "./inkTextAnimation";
import {
  haveSameRevealLines,
  measureWrappedInkLines,
  normalizeInkLabel,
  type RevealLine,
} from "./inkTextLayout";

gsap.registerPlugin(ScrollTrigger);

interface InkTextRevealProps {
  readonly className?: string;
  readonly scroller?: string | HTMLElement | null;
  readonly text: string;
}

function selectRevealLines(
  nextLines: RevealLine[],
): (currentLines: RevealLine[]) => RevealLine[] {
  return (currentLines) =>
    haveSameRevealLines(currentLines, nextLines) ? currentLines : nextLines;
}

function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

function useWrappedInkLines(
  ref: RefObject<HTMLDivElement | null>,
  text: string,
): readonly RevealLine[] {
  const [lines, setLines] = useState<RevealLine[]>(() => [
    { id: "0", text },
  ]);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    let measureFrame = 0;
    let refreshFrame = 0;
    let cancelled = false;
    const updateLines = (): void => {
      if (cancelled) return;
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(() => {
        if (cancelled) return;
        const nextLines = measureWrappedInkLines(element, text);
        setLines(selectRevealLines(nextLines));
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(refreshScrollTriggers);
      });
    };
    updateLines();
    const resizeObserver = new ResizeObserver(updateLines);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateLines);
    void document.fonts.ready.then(updateLines, () => undefined);
    return () => {
      cancelled = true;
      cancelAnimationFrame(measureFrame);
      cancelAnimationFrame(refreshFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLines);
    };
  }, [ref, text]);
  return lines;
}

function useInkTextAnimation(
  ref: RefObject<HTMLDivElement | null>,
  lines: readonly RevealLine[],
  scroller: string | HTMLElement | null | undefined,
): void {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const trigger = createInkTextScrollTrigger(element, scroller);
    return () => {
      trigger?.kill();
    };
  }, [lines, ref, scroller]);
}

export function InkTextReveal({
  text,
  className = "",
  scroller,
}: Readonly<InkTextRevealProps>): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const lines = useWrappedInkLines(ref, text);
  useInkTextAnimation(ref, lines, scroller);
  return (
    <div
      ref={ref}
      className={`ink-text-reveal ${className}`}
      aria-label={normalizeInkLabel(text)}
    >
      {lines.map((line) => (
        <span
          key={line.id}
          aria-hidden="true"
          className={`ink-text-reveal__line ${
            line.blank ? "ink-text-reveal__line--blank" : ""
          }`}
        >
          {line.blank ? "\u00a0" : line.text}
        </span>
      ))}
    </div>
  );
}
