export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function range(progress: number, start: number, end: number): number {
  return clamp((progress - start) / (end - start));
}

export function smoothstep(value: number): number {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
}

export function mix(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}
