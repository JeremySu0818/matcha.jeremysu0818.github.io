import { Vector3 } from "three";
import type { Tuple3 } from "../../../utils/threeTransforms";

const BASE_SCROLL_TARGETS = [
  [0, 6.6, 3.15],
  [0.16, 5.8, 2.72],
  [-0.42, 5.45, 2.52],
  [0.38, 5.28, 2.35],
  [-0.18, 4.92, 2.04],
  [0, 5.55, 2.55],
] as const satisfies readonly Tuple3[];

export const SCENE_CAMERA_CONFIG = {
  canvas: {
    farWorld: 80,
    fieldOfViewDegrees: 42,
    nearWorld: 0.1,
    positionWorld: [0, 2.2, 7.2] as const,
  },
  manual: {
    firstFrameMobileOffsetWorld: [0, 0.35, 0.8] as const,
    lookAtWorld: [0.11, -0.5, 0] as const,
    positionLerpRatioPerFrame: 0.12,
    topPositionDesktopWorld: [0.11, 8.2, 0.02] as const,
    topPositionMobileWorld: [0.11, 9.2, 0.02] as const,
    upWorld: [1, 0, 0] as const,
  },
  mobileScroll: {
    lookAtHeightWorld: 1.25,
    scaleRatio: 1.2,
    xScaleRatio: 1.2,
    yOffsetWorld: 0.35,
    zOffsetWorld: 0.8,
    zScaleRatio: 1.2,
  },
  renderer: {
    alpha: true,
    antialias: true,
    devicePixelRatioRange: [1, 2] as const,
    powerPreference: "high-performance" as const,
    shadows: true,
    toneMapping: 4,
    toneMappingExposure: 1.05,
  },
  scroll: {
    lookAtWorld: [0, 1.25, 0] as const,
    positionLerpRatioPerFrame: 0.07,
    targetHeightScale: 0.32,
    targetZoom: 2.3,
    upWorld: [0, 1, 0] as const,
  },
  scrollControls: {
    dampingSeconds: 0.18,
    distanceRatio: 1,
    pages: 6,
  },
} as const;

export function createScrollCameraTargets(): readonly Vector3[] {
  const { targetHeightScale, targetZoom } = SCENE_CAMERA_CONFIG.scroll;
  return BASE_SCROLL_TARGETS.map(([x, y, z]) => {
    const zoomedX = x * targetZoom;
    const zoomedY = y * targetZoom * targetHeightScale;
    const zoomedZ = z * targetZoom;
    return new Vector3(-zoomedZ, zoomedY, zoomedX);
  });
}
