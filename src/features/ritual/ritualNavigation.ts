interface SceneStepTarget {
  readonly index: number;
  readonly top: number;
}

export function getSceneStepTarget(
  scrollElement: HTMLElement,
  requestedIndex: number,
  stepCount: number,
): SceneStepTarget {
  const maximumScrollTop = Math.max(
    0,
    scrollElement.scrollHeight - scrollElement.clientHeight,
  );
  const maximumStep = Math.max(0, stepCount - 1);
  const index = Math.min(maximumStep, Math.max(0, requestedIndex));
  const top =
    maximumStep === 0
      ? 0
      : Math.round((maximumScrollTop * index) / maximumStep);
  return { index, top };
}
