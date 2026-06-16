export const ROUTE_BACKGROUNDS: Record<string, string> = {
  "": "/home-background.jpg",
  "#": "/home-background.jpg",
  "#make": "/make-background.png",
};

export const UNIQUE_BACKGROUNDS = Array.from(
  new Set(Object.values(ROUTE_BACKGROUNDS)),
);
