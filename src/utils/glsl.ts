export function glslFloat(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error("GLSL numeric literals must be finite.");
  }
  return Number.isInteger(value) ? `${String(value)}.0` : String(value);
}
