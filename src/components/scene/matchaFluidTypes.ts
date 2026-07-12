export interface FluidRipple {
  readonly force: number;
  readonly radiusPixels: number;
  readonly seed: number;
  readonly startSeconds: number;
  readonly x: number;
  readonly y: number;
}

export interface FluidStir {
  readonly force: number;
  readonly startSeconds: number;
  readonly velocityX: number;
  readonly velocityY: number;
  readonly x: number;
  readonly y: number;
}

export interface FoamDustParticle {
  readonly alpha: number;
  readonly radiusPixels: number;
  readonly seed: number;
  readonly x: number;
  readonly y: number;
}

export interface FluidVector {
  readonly x: number;
  readonly y: number;
}

export interface WallDamping extends FluidVector {
  readonly damping: number;
  readonly wall: number;
}
