export interface RevealLine {
  readonly blank?: boolean;
  readonly id: string;
  readonly text: string;
}

function splitGraphemes(text: string): string[] {
  return Array.from(
    new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
    ({ segment }) => segment,
  );
}

export function normalizeInkLabel(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function haveSameRevealLines(
  current: readonly RevealLine[],
  next: readonly RevealLine[],
): boolean {
  if (current.length !== next.length) return false;
  return current.every((line, index) => {
    const nextLine = next[index];
    return line.text === nextLine.text && line.blank === nextLine.blank;
  });
}

function parseCssPixels(value: string): number {
  const pixels = Number.parseFloat(value);
  return Number.isFinite(pixels) ? pixels : 0;
}

export function measureWrappedInkLines(
  element: HTMLElement,
  text: string,
): RevealLine[] {
  const computedStyle = window.getComputedStyle(element);
  const maxWidth =
    element.clientWidth -
    parseCssPixels(computedStyle.paddingLeft) -
    parseCssPixels(computedStyle.paddingRight);
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
  const pushLine = (value: string, forceBlank = false): void => {
    if (!forceBlank && value.length === 0) return;
    lines.push({ blank: forceBlank, id: String(lines.length), text: value });
  };
  for (const segment of splitGraphemes(text.replace(/\r\n/g, "\n"))) {
    if (segment === "\n" || segment === "\r") {
      pushLine(currentLine, currentLine.length === 0);
      currentLine = "";
      continue;
    }
    const candidate = currentLine + segment;
    measure.textContent = candidate;
    if (measure.offsetWidth > maxWidth && currentLine.trim().length > 0) {
      pushLine(currentLine.trimEnd());
      currentLine = segment.trimStart();
    } else {
      currentLine = candidate;
    }
  }
  pushLine(currentLine);
  element.removeChild(measure);
  return lines.length > 0 ? lines : [{ id: "0", text }];
}
