export const SCENE_LIGHTING_CONFIG = {
  ambient: {
    color: "#f8f4ec",
    intensity: 0.4,
  },
  environment: {
    intensity: 0.4,
    preset: "apartment" as const,
  },
  fill: {
    color: "#e8dcc8",
    intensity: 0.3,
    positionWorld: [3, 5, -3] as const,
  },
  key: {
    color: "#fff8ee",
    finishIntensity: 2.4,
    positionWorld: [0, 7, 0] as const,
    shadow: {
      bias: -0.0003,
      bottomWorld: -4,
      farWorld: 20,
      leftWorld: -4,
      mapSizePixels: 2048,
      nearWorld: 0.5,
      normalBias: 0.02,
      rightWorld: 4,
      topWorld: 4,
    },
    startIntensity: 1.6,
  },
  point: {
    color: "#d8e7b6",
    decay: 2,
    distanceWorld: 10,
    intensity: 0.15,
    positionWorld: [0, 3.5, 1.5] as const,
  },
  rim: {
    color: "#dce8d0",
    intensity: 0.2,
    positionWorld: [-1, 2, 6] as const,
  },
} as const;
