const scrollPositionGetters = new Map<
  string,
  () => number | null | undefined
>();

function normalizeRoute(route: string): string {
  return route === "" ? "#" : route;
}

export function registerScrollPositionGetter(
  route: string,
  getScrollTop: () => number | null | undefined,
): () => void {
  const normalizedRoute = normalizeRoute(route);
  scrollPositionGetters.set(normalizedRoute, getScrollTop);

  return () => {
    const current = scrollPositionGetters.get(normalizedRoute);
    if (current === getScrollTop) {
      scrollPositionGetters.delete(normalizedRoute);
    }
  };
}

export function getScrollPositionForRoute(route: string): number {
  const getter = scrollPositionGetters.get(normalizeRoute(route));
  const position = getter?.();
  return typeof position === "number" && Number.isFinite(position)
    ? position
    : 0;
}

export function readSavedScrollPosition(route: string): number | null {
  const savedRoute = sessionStorage.getItem("matcha_scroll_route");
  const savedPosition = sessionStorage.getItem("matcha_scroll_position");

  if (
    normalizeRoute(savedRoute ?? "") !== normalizeRoute(route) ||
    !savedPosition
  ) {
    return null;
  }

  const position = Number.parseInt(savedPosition, 10);
  return Number.isNaN(position) ? null : position;
}

export function clearSavedScrollPosition(): void {
  sessionStorage.removeItem("matcha_scroll_position");
  sessionStorage.removeItem("matcha_scroll_route");
}

export function saveScrollPosition(route: string, position: number): void {
  sessionStorage.setItem(
    "matcha_scroll_position",
    String(Math.max(0, Math.round(position))),
  );
  sessionStorage.setItem("matcha_scroll_route", normalizeRoute(route));
}
