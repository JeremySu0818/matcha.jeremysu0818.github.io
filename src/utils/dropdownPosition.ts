const DROPDOWN_VIEWPORT_GAP = 16;
const DROPDOWN_MENU_WIDTH_REM = 11;
const DROPDOWN_MAX_HEIGHT = 260;

export interface DropdownPosition {
  top: number;
  right: number;
  maxHeight: string;
  maxWidth: string;
}

export function getInitialDropdownPosition(): DropdownPosition {
  return {
    top: 0,
    right: DROPDOWN_VIEWPORT_GAP,
    maxHeight: `${String(DROPDOWN_MAX_HEIGHT)}px`,
    maxWidth: `calc(100vw - ${String(DROPDOWN_VIEWPORT_GAP * 2)}px)`,
  };
}

export function getDropdownPosition(anchorRect: DOMRect): DropdownPosition {
  const rootFontSize =
    parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
  const menuWidth = DROPDOWN_MENU_WIDTH_REM * rootFontSize;
  const preferredRight = window.innerWidth - anchorRect.right;
  const maxRight = Math.max(
    DROPDOWN_VIEWPORT_GAP,
    window.innerWidth - DROPDOWN_VIEWPORT_GAP - menuWidth,
  );
  const right = Math.min(
    maxRight,
    Math.max(DROPDOWN_VIEWPORT_GAP, preferredRight),
  );
  const top = Math.max(DROPDOWN_VIEWPORT_GAP, anchorRect.bottom + 8);
  const availableHeight = Math.max(
    96,
    window.innerHeight - top - DROPDOWN_VIEWPORT_GAP,
  );

  return {
    top,
    right,
    maxHeight: `${String(Math.min(DROPDOWN_MAX_HEIGHT, availableHeight))}px`,
    maxWidth: `calc(100vw - ${String(DROPDOWN_VIEWPORT_GAP * 2)}px)`,
  };
}
