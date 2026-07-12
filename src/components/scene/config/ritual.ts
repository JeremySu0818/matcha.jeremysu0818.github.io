import type { Tuple3 } from "../../../utils/threeTransforms";

const supportSurfaceYWorld = -1.36;
const teaTrayPositionWorld = [0, 0.02, 0] as const satisfies Tuple3;
const teaTrayTopYWorld = supportSurfaceYWorld + teaTrayPositionWorld[1] + 0.1;

export const RITUAL_LAYOUT_CONFIG = {
  bowl: {
    float: {
      floatIntensity: 0.08,
      rotationIntensity: 0.08,
      speed: 0.75,
    },
    groupPositionWorld: [0.11, 0, 0] as const,
    interactionCollider: {
      positionWorld: [0, -0.35, 0] as const,
      radiusBottomWorld: 0.25,
      radiusTopWorld: 0.35,
      radialSegments: 16,
      heightWorld: 0.3,
    },
    modelPositionWorld: [0, -0.2, 0] as const,
    modelScaleRatio: 0.4,
  },
  chasen: {
    hitBoxPositionWorld: [0, 0.35, 0] as const,
    hitBoxSizeWorld: [0.75, 1.15, 0.75] as const,
    idle: {
      positionWorld: [-1.01, teaTrayTopYWorld + 0.2515, teaTrayPositionWorld[2] + 3] as const,
      rotationRadians: [0.25, 0, 0] as const,
    },
    mobileIdlePositionWorld: [teaTrayPositionWorld[0] - 2, teaTrayTopYWorld + 0.2515, -0.8] as const,
    modelRotationRadians: [Math.PI, 0, 0] as const,
    modelScaleRatio: 13,
    use: {
      positionWorld: [0.11, 0.02, -0.07] as const,
      rotationRadians: [-0.08, 0, 0] as const,
    },
  },
  kettle: {
    hitBoxPositionWorld: [0, 0.35, 0] as const,
    hitBoxSizeWorld: [1.3, 0.9, 1.3] as const,
    idle: {
      positionWorld: [teaTrayPositionWorld[0] + 0.49, teaTrayTopYWorld + 0.02, teaTrayPositionWorld[2] + 3] as const,
      rotationRadians: [0, -Math.PI / 2, 0] as const,
    },
    mobileIdlePositionWorld: [teaTrayPositionWorld[0] - 2, teaTrayTopYWorld + 0.02, 0.8] as const,
    modelScaleRatio: 0.1,
    use: {
      positionWorld: [0.139, 1.107, 1.663] as const,
      rotationRadians: [0.3, -Math.PI / 2, 0.72] as const,
    },
  },
  powderOriginWorld: [0.11, 0, 0] as const,
  room: {
    positionWorld: [-4.26, -5.675, 1.25] as const,
    scaleRatio: 5,
  },
  sieve: {
    hitBoxPositionWorld: [0, 0, 0] as const,
    hitBoxSizeWorld: [1.25, 0.32, 1.25] as const,
    idle: {
      positionWorld: [teaTrayPositionWorld[0] + 0.3, teaTrayTopYWorld + 0.3895, teaTrayPositionWorld[2] - 2.5] as const,
      rotationYRadians: 0.18 + (80 * Math.PI) / 180 + Math.PI / 2,
    },
    mobileIdlePositionWorld: [teaTrayPositionWorld[0] + 2, teaTrayTopYWorld + 0.3895, 0] as const,
    modelScaleRatio: 14,
    use: {
      positionWorld: [0.03, 1.82, 0.01] as const,
      rotationYRadians: Math.PI / 2,
    },
  },
  supportSurfaceYWorld,
  teaTray: {
    positionWorld: teaTrayPositionWorld,
    rotationRadians: [0, Math.PI / 2, 0] as const,
  },
} as const;

export const MANUAL_RITUAL_CONFIG = {
  animation: {
    kettlePourDurationMs: 2700,
    sieveShakeDurationMs: 4200,
  },
  drag: {
    bowlCenterWorld: [0.11, 0] as const,
    bowlDropRadiusWorld: 0.72,
    chasenLiftYWorld: 1.5,
    clampWorld: [-3.2, 3.2] as const,
    kettleDropRadiusWorld: 1.8,
    mobileTouchScaleRatio: 1.15,
    pointerMoveEpsilonWorld: 0.01,
  },
  progress: {
    chasenReturn: 0.98,
    complete: 1,
    kettleDrag: 0.49,
    kettlePourEnd: 0.66,
    kettleReturn: 0.68,
    sieveReady: 0.18,
    start: 0.16,
    whisking: 0.76,
  },
  uiTiming: {
    completionDelayMs: 3000,
    switcherHintDelayMs: 1500,
    switcherHintVisibleMs: 20000,
  },
  toolHeightLerpRatioPerFrame: 0.15,
  sieveShake: {
    rollAmplitudeRadians: 0.04,
    rollFrequency: 18,
    xAmplitudeWorld: 0.035,
    xFrequency: 24,
  },
  whisk: {
    minimumPointerTravelPixels: 2,
    progressEnd: 0.98,
    progressStart: 0.76,
    targetCount: 300,
    tiltMinimumRatio: 0.35,
    tiltMultiplier: 0.45,
    tiltRangeRadians: [-0.22, 0.22] as const,
    travelPixelsPerCount: 26,
  },
} as const;

export const SCROLL_RITUAL_CONFIG = {
  bowl: {
    finaleProgress: [0.82, 1] as const,
    finaleScaleRatio: 1.08,
    floatAmplitudeWorld: 0.014,
    floatFrequency: 0.7,
    manualFloatAmplitudeWorld: 0.006,
    manualSpinAmplitudeRadians: 0.02,
    manualSpinFrequency: 0.25,
    spinRadiansPerProgress: Math.PI * 1.72,
    spinWobbleAmplitudeRadians: 0.08,
    spinWobbleFrequency: 0.35,
  },
  chasen: {
    activeStops: [0.33, 0.67, 1] as const,
    activePhases: {
      approachEnd: 0.54,
      approachStart: 0.48,
      descendEnd: 0.77,
      descendStart: 0.73,
      middleEnd: 0.71,
      middleStart: 0.66,
      returnEnd: 0.96,
      returnStart: 0.88,
    },
    highYWorld: 1.5,
    whiskProgress: [0.76, 0.9] as const,
    whiskVisibleEnd: [0.87, 0.89] as const,
    whiskVisibleStart: [0.76, 0.78] as const,
  },
  kettle: {
    enterProgress: [0.38, 0.48] as const,
    leaveProgress: [0.65, 0.73] as const,
  },
  sieve: {
    enterProgress: [0.08, 0.19] as const,
    leaveProgress: [0.41, 0.49] as const,
    shakeAmplitudeWorld: 0.0175,
    shakeFrequency: 14,
    shakeProgressEnd: [0.35, 0.38] as const,
    shakeProgressStart: [0.19, 0.22] as const,
  },
  whiskPath: {
    frequency: 10.8,
    points: [
      [-1, 1],
      [-0.5, -1],
      [0, 1],
      [0.5, -1],
      [1, 1],
    ] as const,
    xScaleWorld: 0.1596,
    zScaleWorld: 0.2926,
  },
} as const;
