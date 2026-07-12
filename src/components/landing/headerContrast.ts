const TEXT_REGION_SELECTOR =
  ".site-header__brand, .site-header__link, .header-control";
const SECTION_SELECTOR = ".landing-hero, .exhibition-section";

interface ParsedColor {
  readonly a: number;
  readonly b: number;
  readonly g: number;
  readonly r: number;
}

function parseAlpha(value: string | undefined): number {
  if (value === undefined) return 1;
  const alpha = value.endsWith("%")
    ? Number.parseFloat(value) / 100
    : Number.parseFloat(value);
  return Math.max(0, Math.min(1, alpha));
}

function parseRgbColor(value: string): ParsedColor | null {
  if (!value.startsWith("rgb(") && !value.startsWith("rgba(")) return null;
  const start = value.indexOf("(");
  const end = value.lastIndexOf(")");
  if (start < 0 || end <= start) return null;
  const parts = value
    .slice(start + 1, end)
    .replaceAll(",", " ")
    .replace("/", " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const red = Number.parseFloat(parts[0]);
  const green = Number.parseFloat(parts[1]);
  const blue = Number.parseFloat(parts[2]);
  if (![red, green, blue].every(Number.isFinite)) return null;
  return { a: parseAlpha(parts[3]), b: blue, g: green, r: red };
}

function parseHexColor(value: string): ParsedColor | null {
  if (!value.startsWith("#")) return null;
  const source = value.slice(1);
  if (![3, 4, 6, 8].includes(source.length)) return null;
  if (!Array.from(source).every((character) => /[\da-f]/i.test(character))) {
    return null;
  }
  const expanded =
    source.length <= 4
      ? Array.from(source).map((part) => part + part).join("")
      : source;
  return {
    a:
      expanded.length === 8
        ? Number.parseInt(expanded.slice(6, 8), 16) / 255
        : 1,
    b: Number.parseInt(expanded.slice(4, 6), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    r: Number.parseInt(expanded.slice(0, 2), 16),
  };
}

function parseColor(value: string): ParsedColor | null {
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0 || normalized === "transparent") return null;
  return parseRgbColor(normalized) ?? parseHexColor(normalized);
}

function linearizeColorChannel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function luminance({ r, g, b }: ParsedColor): number {
  return (
    0.2126 * linearizeColorChannel(r) +
    0.7152 * linearizeColorChannel(g) +
    0.0722 * linearizeColorChannel(b)
  );
}

function getTextRegionPoints(region: Element): (readonly [number, number])[] {
  const rect = region.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return [];
  const points: (readonly [number, number])[] = [];
  for (const yOffset of [0.25, 0.5, 0.75]) {
    for (const xOffset of [0.2, 0.5, 0.8]) {
      points.push([
        rect.left + rect.width * xOffset,
        rect.top + rect.height * yOffset,
      ]);
    }
  }
  return points;
}

function getOpaqueBackgroundLuminance(element: Element): number | null {
  const background = parseColor(
    window.getComputedStyle(element).backgroundColor,
  );
  return background && background.a >= 0.85
    ? luminance(background)
    : null;
}

function getSectionLuminance(section: Element): number | null {
  const style = window.getComputedStyle(section);
  const background = parseColor(style.backgroundColor);
  if (background && background.a > 0.05) return luminance(background);
  const sectionText = parseColor(style.color);
  return sectionText ? 1 - luminance(sectionText) : null;
}

function getUnderlyingLuminance(
  point: readonly [number, number],
  header: HTMLElement,
): number | null {
  const stack = document
    .elementsFromPoint(point[0], point[1])
    .filter((element) => !header.contains(element) && element !== header);
  if (stack.length === 0) return null;
  const sectionIndex = stack.findIndex((element) =>
    element.matches(SECTION_SELECTOR),
  );
  const section = sectionIndex >= 0 ? stack[sectionIndex] : null;
  const foregroundStack = section ? stack.slice(0, sectionIndex) : stack;
  for (const element of foregroundStack) {
    const value = getOpaqueBackgroundLuminance(element);
    if (value !== null) return value;
  }
  if (section) {
    const value = getSectionLuminance(section);
    if (value !== null) return value;
  }
  for (const element of stack) {
    const background = parseColor(
      window.getComputedStyle(element).backgroundColor,
    );
    if (background && background.a > 0.05) return luminance(background);
  }
  return null;
}

export function measureHeaderLuminance(
  header: HTMLElement,
): number | null {
  const regions = Array.from(header.querySelectorAll(TEXT_REGION_SELECTOR));
  const points = regions.flatMap(getTextRegionPoints);
  if (points.length === 0) return null;
  const previousVisibility = header.style.visibility;
  header.style.visibility = "hidden";
  try {
    const samples = points
      .map((point) => getUnderlyingLuminance(point, header))
      .filter((value): value is number => value !== null);
    return samples.length === 0
      ? null
      : samples.reduce((sum, value) => sum + value, 0) / samples.length;
  } finally {
    header.style.visibility = previousVisibility;
  }
}
