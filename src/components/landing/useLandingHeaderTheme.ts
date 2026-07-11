import { useEffect, useState } from 'react';

const HEADER_SELECTOR = '.site-header';
const TEXT_REGION_SELECTOR =
  '.site-header__brand, .site-header__link, .header-control';
const SECTION_SELECTOR = '.landing-hero, .exhibition-section';
const LIGHT_TEXT_THRESHOLD = 0.48;

interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(value: string): ParsedColor | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'transparent') return null;

  const rgbMatch = normalized.match(
    /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/,
  );
  if (rgbMatch) {
    const alphaValue = rgbMatch[4];
    const alpha = alphaValue
      ? alphaValue.endsWith('%')
        ? Number.parseFloat(alphaValue) / 100
        : Number.parseFloat(alphaValue)
      : 1;
    return {
      r: Number.parseFloat(rgbMatch[1]),
      g: Number.parseFloat(rgbMatch[2]),
      b: Number.parseFloat(rgbMatch[3]),
      a: Math.max(0, Math.min(1, alpha)),
    };
  }

  const hexMatch = normalized.match(/^#([\da-f]{3,8})$/i);
  if (!hexMatch) return null;
  const hex = hexMatch[1];
  const expanded =
    hex.length <= 4
      ? hex
          .split('')
          .map((part) => part + part)
          .join('')
      : hex;
  const hasAlpha = expanded.length === 8;
  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
    a: hasAlpha ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1,
  };
}

function luminance({ r, g, b }: ParsedColor): number {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function getTextRegionPoints(region: Element): Array<[number, number]> {
  const rect = region.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return [];

  const xOffsets = [0.2, 0.5, 0.8];
  const yOffsets = [0.25, 0.5, 0.75];
  return yOffsets.flatMap((yOffset) =>
    xOffsets.map(
      (xOffset) =>
        [
          rect.left + rect.width * xOffset,
          rect.top + rect.height * yOffset,
        ] as [number, number],
    ),
  );
}

function getUnderlyingLuminance(
  point: [number, number],
  header: Element,
): number | null {
  const stack = document
    .elementsFromPoint(point[0], point[1])
    .filter((element) => !header.contains(element) && element !== header);
  if (stack.length === 0) return null;

  const sectionIndex = stack.findIndex((element) =>
    element.matches(SECTION_SELECTOR),
  );
  const section = sectionIndex >= 0 ? stack[sectionIndex] : null;

  for (const element of section ? stack.slice(0, sectionIndex) : stack) {
    const style = window.getComputedStyle(element);
    const background = parseColor(style.backgroundColor);
    if (background && background.a >= 0.85) return luminance(background);
  }

  if (section) {
    const style = window.getComputedStyle(section);
    const background = parseColor(style.backgroundColor);
    if (background && background.a > 0.05) return luminance(background);

    const sectionText = parseColor(style.color);
    if (sectionText) return 1 - luminance(sectionText);
  }

  for (const element of stack) {
    const style = window.getComputedStyle(element);
    const background = parseColor(style.backgroundColor);
    if (background && background.a > 0.05) return luminance(background);
  }

  return null;
}

function measureHeaderLuminance(header: Element): number | null {
  const regions = Array.from(header.querySelectorAll(TEXT_REGION_SELECTOR));
  const points = regions.flatMap(getTextRegionPoints);
  if (points.length === 0) return null;

  const previousVisibility = (header as HTMLElement).style.visibility;
  (header as HTMLElement).style.visibility = 'hidden';
  try {
    const samples = points
      .map((point) => getUnderlyingLuminance(point, header))
      .filter((value): value is number => value !== null);
    if (samples.length === 0) return null;
    return samples.reduce((sum, value) => sum + value, 0) / samples.length;
  } finally {
    (header as HTMLElement).style.visibility = previousVisibility;
  }
}

export function useLandingHeaderTheme(lang: string): boolean {
  const [useLightText, setUseLightText] = useState(true);

  useEffect(() => {
    const container = document.getElementById('landing-scroll-container');
    const header = container?.querySelector(HEADER_SELECTOR);
    if (!container || !header) return undefined;

    let frameId = 0;
    let lastMeasured: boolean | null = null;

    const measure = () => {
      frameId = 0;
      const averageLuminance = measureHeaderLuminance(header);
      if (averageLuminance === null) return;
      const nextUseLightText = averageLuminance < LIGHT_TEXT_THRESHOLD;
      if (nextUseLightText === lastMeasured) return;
      lastMeasured = nextUseLightText;
      setUseLightText(nextUseLightText);
    };

    const scheduleMeasure = () => {
      if (frameId === 0) frameId = requestAnimationFrame(measure);
    };

    container.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(header);
    observer.observe(container);
    scheduleMeasure();

    return () => {
      container.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      observer.disconnect();
      if (frameId !== 0) cancelAnimationFrame(frameId);
    };
  }, [lang]);

  return useLightText;
}
