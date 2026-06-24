import {
  createElement,
  ElementType,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type InkTextRevealProps = {
  as?: ElementType;
  text: string;
  className?: string;
  lineClassName?: string;
  scroller?: string | HTMLElement | null;
  lockPrintHeadToViewport?: boolean;
};

type RevealLine = {
  id: string;
  text: string;
  blank?: boolean;
};

type SegmenterConstructor = new (
  locale?: string,
  options?: { granularity: "grapheme" },
) => {
  segment(input: string): Iterable<{ segment: string }>;
};

function splitGraphemes(text: string) {
  const intlWithSegmenter = Intl as typeof Intl & {
    Segmenter?: SegmenterConstructor;
  };

  if (intlWithSegmenter.Segmenter) {
    return Array.from(
      new intlWithSegmenter.Segmenter(undefined, {
        granularity: "grapheme",
      }).segment(text),
      ({ segment }) => segment,
    );
  }

  return Array.from(text);
}

function normalizeLabel(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function sameLines(current: RevealLine[], next: RevealLine[]) {
  if (current.length !== next.length) return false;

  return current.every((line, index) => {
    const nextLine = next[index];
    return line.text === nextLine.text && line.blank === nextLine.blank;
  });
}

function measureWrappedLines(element: HTMLElement, text: string): RevealLine[] {
  const computedStyle = window.getComputedStyle(element);
  const maxWidth =
    element.clientWidth -
    parseFloat(computedStyle.paddingLeft || "0") -
    parseFloat(computedStyle.paddingRight || "0");

  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    return [{ id: "0", text }];
  }

  const measure = document.createElement("span");
  measure.style.position = "absolute";
  measure.style.visibility = "hidden";
  measure.style.whiteSpace = "nowrap";
  measure.style.pointerEvents = "none";
  measure.style.fontFamily = computedStyle.fontFamily;
  measure.style.fontSize = computedStyle.fontSize;
  measure.style.fontStyle = computedStyle.fontStyle;
  measure.style.fontWeight = computedStyle.fontWeight;
  measure.style.letterSpacing = computedStyle.letterSpacing;
  measure.style.textTransform = computedStyle.textTransform;
  element.appendChild(measure);

  const lines: RevealLine[] = [];
  let currentLine = "";

  const pushLine = (value: string, forceBlank = false) => {
    if (!forceBlank && value.length === 0) return;

    lines.push({
      id: String(lines.length),
      text: value,
      blank: forceBlank,
    });
  };

  splitGraphemes(text.replace(/\r\n/g, "\n")).forEach((segment) => {
    if (segment === "\n" || segment === "\r") {
      pushLine(currentLine, currentLine.length === 0);
      currentLine = "";
      return;
    }

    const candidate = currentLine + segment;
    measure.textContent = candidate;

    if (measure.offsetWidth > maxWidth && currentLine.trim().length > 0) {
      pushLine(currentLine.trimEnd());
      currentLine = segment.trimStart();
      return;
    }

    currentLine = candidate;
  });

  pushLine(currentLine);
  element.removeChild(measure);

  return lines.length > 0 ? lines : [{ id: "0", text }];
}

const SMOOTH_REVEAL_DURATION = 0.42;
const LINE_WINDOW = 1.35;
const LINE_STRIDE = 0.72;
const LOCKED_PRINT_HEAD_EDGE_WIDTH = 0.75;
const MIN_LINE_PRINT_WEIGHT = 1;

function resolveScroller(scroller?: string | HTMLElement | null) {
  if (!scroller) return undefined;
  if (typeof scroller === "string") return document.querySelector(scroller) || undefined;
  return scroller;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function getLineProgress(progress: number, index: number, lineCount: number) {
  const length = Math.max(1, (lineCount - 1) * LINE_STRIDE + LINE_WINDOW);
  const start = index * LINE_STRIDE;
  return clamp01((progress * length - start) / LINE_WINDOW);
}

function getLinePrintWeight(line: HTMLElement) {
  const width = line.getBoundingClientRect().width;
  const textLength = normalizeLabel(line.textContent || "").length;

  if (Number.isFinite(width) && width > 0) {
    return Math.max(MIN_LINE_PRINT_WEIGHT, width);
  }

  return Math.max(MIN_LINE_PRINT_WEIGHT, textLength);
}

function renderWeightedLine(line: HTMLElement, progress: number) {
  const width = Math.max(1, line.getBoundingClientRect().width);
  const stop = clamp01(progress) * width;
  const edge = Math.min(width, stop + LOCKED_PRINT_HEAD_EDGE_WIDTH);

  line.style.backgroundImage = `linear-gradient(90deg, var(--ink-reveal-active) 0px, var(--ink-reveal-active) ${stop.toFixed(
    3,
  )}px, var(--ink-reveal-idle) ${edge.toFixed(
    3,
  )}px, var(--ink-reveal-idle) 100%)`;
  line.style.backgroundPosition = "0% 0%";
  line.style.backgroundSize = "100% 100%";
}

function renderWeightedSequentialLines(
  lineElements: HTMLElement[],
  progress: number,
) {
  const weights = lineElements.map(getLinePrintWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const printPosition = clamp01(progress) * Math.max(MIN_LINE_PRINT_WEIGHT, totalWeight);
  let consumedWeight = 0;

  lineElements.forEach((line, index) => {
    const lineStart = consumedWeight;
    const lineWeight = weights[index] ?? MIN_LINE_PRINT_WEIGHT;
    const lineEnd = lineStart + lineWeight;
    consumedWeight = lineEnd;

    if (printPosition <= lineStart) {
      renderWeightedLine(line, 0);
      return;
    }

    if (printPosition >= lineEnd) {
      renderWeightedLine(line, 1);
      return;
    }

    renderWeightedLine(line, (printPosition - lineStart) / lineWeight);
  });
}

function renderLineProgress(line: HTMLElement, progress: number) {
  const backgroundPosition = 100 - clamp01(progress) * 100;

  line.style.backgroundImage = "";
  line.style.backgroundSize = "";
  line.style.backgroundPosition = `${backgroundPosition.toFixed(3)}% 0%`;
}

export function InkTextReveal({
  as: Component = "div",
  text,
  className = "",
  lineClassName = "",
  scroller,
  lockPrintHeadToViewport = false,
}: InkTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<RevealLine[]>(() => [
    { id: "0", text },
  ]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    let cancelled = false;

    const updateLines = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cancelled || !ref.current) return;
        const nextLines = measureWrappedLines(ref.current, text);
        setLines((currentLines) =>
          sameLines(currentLines, nextLines) ? currentLines : nextLines,
        );
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    updateLines();

    const resizeObserver = new ResizeObserver(updateLines);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateLines);
    document.fonts?.ready.then(updateLines);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLines);
    };
  }, [text]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let progressTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const scrollerElement = resolveScroller(scroller);
      const lineElements = gsap.utils.toArray<HTMLElement>(
        ".ink-text-reveal__line",
        element,
      );
      const visibleLineCount = Math.max(1, lineElements.length);
      const revealDistance = Math.max(
        element.offsetHeight * 1.4,
        window.innerHeight * 0.7,
      );
      const progressState = { value: 0 };

      const renderProgress = (progress: number) => {
        const safeProgress = clamp01(progress);

        if (lockPrintHeadToViewport) {
          renderWeightedSequentialLines(lineElements, safeProgress);
          return;
        }

        lineElements.forEach((line, index) => {
          renderLineProgress(
            line,
            getLineProgress(safeProgress, index, visibleLineCount),
          );
        });
      };

      const setProgress = (nextProgress: number, immediate = false) => {
        const targetProgress = clamp01(nextProgress);

        if (immediate || lockPrintHeadToViewport) {
          progressTween?.kill();
          progressTween = null;
          progressState.value = targetProgress;
          renderProgress(targetProgress);
          return;
        }

        progressTween = gsap.to(progressState, {
          value: targetProgress,
          duration: SMOOTH_REVEAL_DURATION,
          ease: "power3.out",
          overwrite: true,
          onUpdate: () => renderProgress(progressState.value),
        });
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        renderProgress(1);
        return;
      }

      renderProgress(0);

      ScrollTrigger.create({
        trigger: element,
        scroller: scrollerElement,
        start: "top 91%",
        end: () => `+=${revealDistance}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
        onRefresh: (self) => {
          setProgress(self.progress, true);
        },
      });
    }, element);

    return () => {
      progressTween?.kill();
      ctx.revert();
    };
  }, [lines, scroller, lockPrintHeadToViewport]);

  return createElement(
    Component,
    {
      ref,
      className: `ink-text-reveal ${className}`,
      "aria-label": normalizeLabel(text),
    },
    lines.map((line) => (
      <span
        key={line.id}
        aria-hidden="true"
        className={`ink-text-reveal__line ${
          line.blank ? "ink-text-reveal__line--blank" : ""
        } ${lineClassName}`}
      >
        {line.blank ? "\u00a0" : line.text}
      </span>
    )),
  );
}
