export const MATCHA_POWDER_EFFECT_CONFIG = {
  particle: {
    baseVelocityXPerFrame: [-0.2, 0.4] as const,
    baseVelocityYPerFrame: [0.5, 2] as const,
    color: "#4e6331",
    count: {
      desktop: 1400,
      mobile: 700,
    },
    opacity: [0.3, 1] as const,
    radiusPixels: [0.2, 1.2] as const,
    velocityLerpRatioPerFrame: 0.05,
    wrapMarginPixels: 5,
  },
  ripple: {
    lifeDecayPerFrame: 0.015,
    lineColorRgb: "132, 155, 92",
    maximumRadiusPixels: 90,
    radiusGrowthPixelsPerFrame: 2,
    radiusLerpRatioPerFrame: 0.05,
    rings: [
      {
        forceMultiplier: 2.5,
        lineOpacityMultiplier: 0.4,
        lineWidthLifeMultiplier: 1.5,
        lineWidthPixels: 1,
        radiusOffsetPixels: 0,
      },
      {
        forceMultiplier: 1.5,
        lineOpacityMultiplier: 0.25,
        lineWidthLifeMultiplier: 1,
        lineWidthPixels: 1,
        radiusOffsetPixels: 20,
      },
      {
        forceMultiplier: 0.8,
        lineOpacityMultiplier: 0.12,
        lineWidthLifeMultiplier: 0.6,
        lineWidthPixels: 1,
        radiusOffsetPixels: 40,
      },
    ] as const,
    thicknessPixels: 15,
  },
} as const;
