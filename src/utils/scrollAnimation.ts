export const SCROLL_RESTORE_MOTION = {
  delayMs: 300,
  distanceDurationMultiplier: 0.6,
  maximumDurationMs: 1400,
  minimumDurationMs: 900,
} as const;

interface ScrollAnimationOptions {
  readonly fromTop: number;
  readonly onComplete: () => void;
  readonly onUpdate: (top: number) => void;
  readonly targetTop: number;
}

function getScrollRestoreDuration(distance: number): number {
  return Math.min(
    SCROLL_RESTORE_MOTION.maximumDurationMs,
    Math.max(
      SCROLL_RESTORE_MOTION.minimumDurationMs,
      Math.abs(distance) * SCROLL_RESTORE_MOTION.distanceDurationMultiplier,
    ),
  );
}

function easeInOutCubic(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function startScrollAnimation({
  fromTop,
  onComplete,
  onUpdate,
  targetTop,
}: ScrollAnimationOptions): () => void {
  const distance = targetTop - fromTop;
  const duration = getScrollRestoreDuration(distance);
  const animationStart = performance.now();
  let frameId = 0;
  const step = (now: number): void => {
    const progress = Math.min(1, (now - animationStart) / duration);
    onUpdate(fromTop + distance * easeInOutCubic(progress));
    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      onComplete();
    }
  };
  frameId = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(frameId);
  };
}
