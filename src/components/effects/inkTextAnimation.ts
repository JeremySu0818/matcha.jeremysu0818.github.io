import { ScrollTrigger } from "gsap/ScrollTrigger";
import { normalizeInkLabel } from "./inkTextLayout";

const LOCKED_PRINT_HEAD_EDGE_WIDTH = 0.75;
const MIN_LINE_PRINT_WEIGHT = 1;

interface InkLineData {
  readonly height: number;
  readonly localTop: number;
  readonly weight: number;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function resolveScroller(
  scroller?: string | HTMLElement | null,
): HTMLElement | undefined {
  if (!scroller) return undefined;
  return typeof scroller === "string"
    ? (document.querySelector<HTMLElement>(scroller) ?? undefined)
    : scroller;
}

function getLinePrintWeight(line: HTMLElement): number {
  const width = line.getBoundingClientRect().width;
  const textLength = normalizeInkLabel(line.textContent).length;
  return Number.isFinite(width) && width > 0
    ? Math.max(MIN_LINE_PRINT_WEIGHT, width)
    : Math.max(MIN_LINE_PRINT_WEIGHT, textLength);
}

function measureLineData(
  element: HTMLElement,
  lineElements: readonly HTMLElement[],
): InkLineData[] {
  const elementRect = element.getBoundingClientRect();
  return lineElements.map((line) => {
    const lineRect = line.getBoundingClientRect();
    return {
      height: lineRect.height,
      localTop: lineRect.top - elementRect.top,
      weight: getLinePrintWeight(line),
    };
  });
}

function renderWeightedLine(
  line: HTMLElement,
  progress: number,
  cachedWidth: number,
): void {
  const width = Math.max(1, cachedWidth);
  const stop = clamp01(progress) * width;
  const edge = Math.min(width, stop + LOCKED_PRINT_HEAD_EDGE_WIDTH);
  line.style.backgroundImage = `linear-gradient(90deg, var(--ink-reveal-active) 0px, var(--ink-reveal-active) ${stop.toFixed(3)}px, var(--ink-reveal-idle) ${edge.toFixed(3)}px, var(--ink-reveal-idle) 100%)`;
  line.style.backgroundPosition = "0% 0%";
  line.style.backgroundSize = "100% 100%";
}

function getViewportProgress(
  anchorY: number,
  lineTop: number,
  lineHeight: number,
): number {
  const lineBottom = lineTop + lineHeight;
  if (lineBottom <= anchorY) return 1;
  if (lineTop >= anchorY) return 0;
  return clamp01((anchorY - lineTop) / Math.max(1, lineHeight));
}

function getSequentialProgress(
  printPosition: number,
  lineStart: number,
  lineWeight: number,
): number {
  if (printPosition <= lineStart) return 0;
  if (printPosition >= lineStart + lineWeight) return 1;
  return (printPosition - lineStart) / lineWeight;
}

function renderViewportLockedLines(
  element: HTMLElement,
  lineElements: readonly HTMLElement[],
  lineData: readonly InkLineData[],
  scrollerElement: HTMLElement | undefined,
  scrollProgress: number,
): void {
  const scrollerRect = (
    scrollerElement ?? document.documentElement
  ).getBoundingClientRect();
  const anchorY = scrollerRect.top + scrollerRect.height * 0.8;
  const totalWeight = lineData.reduce((sum, data) => sum + data.weight, 0);
  if (totalWeight <= 0) return;
  const printPosition =
    clamp01(scrollProgress) * Math.max(MIN_LINE_PRINT_WEIGHT, totalWeight);
  const elementRect = element.getBoundingClientRect();
  let consumedWeight = 0;
  for (let index = 0; index < lineElements.length; index += 1) {
    const line = lineElements[index];
    const data = lineData[index];
    const lineStart = consumedWeight;
    consumedWeight += data.weight;
    const viewportProgress = getViewportProgress(
      anchorY,
      elementRect.top + data.localTop,
      data.height,
    );
    const sequentialProgress = getSequentialProgress(
      printPosition,
      lineStart,
      data.weight,
    );
    renderWeightedLine(
      line,
      Math.max(viewportProgress, sequentialProgress),
      data.weight,
    );
  }
}

export function createInkTextScrollTrigger(
  element: HTMLElement,
  scroller: string | HTMLElement | null | undefined,
): ScrollTrigger | null {
  const scrollerElement = resolveScroller(scroller);
  const lineElements = Array.from(
    element.querySelectorAll<HTMLElement>(".ink-text-reveal__line"),
  );
  const revealDistance = Math.max(
    element.offsetHeight * 1.4,
    window.innerHeight * 0.7,
  );
  let lineData: InkLineData[] = [];
  const renderProgress = (progress: number): void => {
    renderViewportLockedLines(
      element,
      lineElements,
      lineData,
      scrollerElement,
      progress,
    );
  };
  const refreshLineData = (): void => {
    lineData = measureLineData(element, lineElements);
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }
  renderProgress(0);
  return ScrollTrigger.create({
    end: () => `+=${String(revealDistance)}`,
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      refreshLineData();
      renderProgress(self.progress);
    },
    onUpdate: (self) => {
      renderProgress(self.progress);
    },
    scroller: scrollerElement,
    start: "top 91%",
    trigger: element,
  });
}
