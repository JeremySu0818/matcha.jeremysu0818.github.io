import type { RefObject } from "react";
import { Vector3 } from "three";
import { mix, range, smoothstep } from "../../utils/easing";
import { mixTuple3 } from "../../utils/threeTransforms";
import { createScrollCameraTargets, SCENE_CAMERA_CONFIG } from "./config/camera";
import { SCENE_LIGHTING_CONFIG } from "./config/lighting";
import {
  MANUAL_RITUAL_CONFIG,
  RITUAL_LAYOUT_CONFIG,
  SCROLL_RITUAL_CONFIG,
} from "./config/ritual";
import { getTargetToolY, isNearBowl, MANUAL_TOOLS, sampleChasenW } from "./manualRitual";
import type { ManualStage, ManualToolPositions } from "./manualRitual";
import type { ManualRitualController } from "./useManualRitual";
import type { SceneMode } from "../../app/sceneMode";
import type { Tuple3 } from "../../utils/threeTransforms";
import type { Camera, DirectionalLight, Group } from "three";

export interface SceneObjectRefs {
  readonly bowl: RefObject<Group | null>;
  readonly chasen: RefObject<Group | null>;
  readonly kettle: RefObject<Group | null>;
  readonly keyLight: RefObject<DirectionalLight | null>;
  readonly sieve: RefObject<Group | null>;
}

export interface SceneFrameSnapshot {
  readonly camera: Camera;
  readonly elapsedSeconds: number;
  readonly glow: number;
  readonly idlePositions: ManualToolPositions;
  readonly lift: number;
  readonly manual: ManualRitualController;
  readonly mobile: boolean;
  readonly mode: SceneMode;
  readonly progress: number;
}

function applyMobileCameraTransform(cameraPosition: Vector3): void {
  const config = SCENE_CAMERA_CONFIG.mobileScroll;
  cameraPosition.z += config.zOffsetWorld;
  cameraPosition.y += config.yOffsetWorld;
  cameraPosition.x *= config.xScaleRatio;
  cameraPosition.y =
    config.lookAtHeightWorld +
    (cameraPosition.y - config.lookAtHeightWorld) * config.scaleRatio;
  cameraPosition.z *= config.zScaleRatio;
}

function updateCamera(
  camera: Camera,
  cameraTargets: readonly Vector3[],
  targetCamera: Vector3,
  firstFrameRef: RefObject<boolean>,
  mobile: boolean,
  mode: SceneMode,
  progress: number,
): void {
  if (mode === "manual") {
    if (firstFrameRef.current) {
      targetCamera.copy(cameraTargets[0]);
      if (mobile) applyMobileCameraTransform(targetCamera);
      camera.position.copy(targetCamera);
      firstFrameRef.current = false;
    }
    const config = SCENE_CAMERA_CONFIG.manual;
    const topPosition = mobile
      ? config.topPositionMobileWorld
      : config.topPositionDesktopWorld;
    camera.up.set(...config.upWorld);
    targetCamera.set(topPosition[0], topPosition[1], topPosition[2]);
    camera.position.lerp(targetCamera, config.positionLerpRatioPerFrame);
    camera.lookAt(...config.lookAtWorld);
    return;
  }

  firstFrameRef.current = false;
  const config = SCENE_CAMERA_CONFIG.scroll;
  camera.up.set(...config.upWorld);
  const stepFloat = progress * (cameraTargets.length - 1);
  const lowIndex = Math.floor(stepFloat);
  const highIndex = Math.min(cameraTargets.length - 1, lowIndex + 1);
  const localProgress = smoothstep(stepFloat - lowIndex);
  targetCamera
    .copy(cameraTargets[Math.min(cameraTargets.length - 1, lowIndex)])
    .lerp(cameraTargets[highIndex], localProgress);
  if (mobile) applyMobileCameraTransform(targetCamera);
  camera.position.lerp(targetCamera, config.positionLerpRatioPerFrame);
  camera.lookAt(...config.lookAtWorld);
}

function updateBowl(
  bowl: Group | null,
  elapsedSeconds: number,
  liftWorld: number,
  mode: SceneMode,
  progress: number,
): void {
  if (!bowl) return;
  const config = SCROLL_RITUAL_CONFIG.bowl;
  bowl.rotation.y =
    mode === "manual"
      ? Math.sin(elapsedSeconds * config.manualSpinFrequency) *
        config.manualSpinAmplitudeRadians
      : progress * config.spinRadiansPerProgress +
        Math.sin(elapsedSeconds * config.spinWobbleFrequency) *
          config.spinWobbleAmplitudeRadians;
  bowl.position.y =
    mode === "manual"
      ? Math.sin(elapsedSeconds * config.floatFrequency) *
        config.manualFloatAmplitudeWorld
      : liftWorld +
        Math.sin(elapsedSeconds * config.floatFrequency) *
          config.floatAmplitudeWorld;
  const finale = smoothstep(range(progress, ...config.finaleProgress));
  bowl.position.x = RITUAL_LAYOUT_CONFIG.bowl.groupPositionWorld[0];
  bowl.scale.setScalar(mix(1, config.finaleScaleRatio, finale));
}

function updateManualToolHeights(
  dragTool: string | null,
  idlePositions: ManualToolPositions,
  positions: ManualToolPositions,
  stage: ManualStage,
): void {
  for (const tool of MANUAL_TOOLS) {
    const targetY = getTargetToolY(
      tool,
      stage,
      dragTool === tool ? tool : null,
      idlePositions,
    );
    const [x, currentY, z] = positions[tool];
    positions[tool] = [
      x,
      mix(currentY, targetY, MANUAL_RITUAL_CONFIG.toolHeightLerpRatioPerFrame),
      z,
    ];
  }
}

function updateManualSieve(
  sieve: Group,
  elapsedSeconds: number,
  mobile: boolean,
  position: Tuple3,
  stage: ManualStage,
): void {
  const layout = RITUAL_LAYOUT_CONFIG.sieve;
  const shake = MANUAL_RITUAL_CONFIG.sieveShake;
  const shaking = stage === "sieve-shaking";
  const rollX = shaking
    ? Math.sin(elapsedSeconds * shake.rollFrequency) * shake.rollAmplitudeRadians
    : 0;
  const shakeX = shaking
    ? Math.sin(elapsedSeconds * shake.xFrequency) * shake.xAmplitudeWorld
    : 0;
  const using =
    stage === "sieve-ready" || stage === "sieve-shaking" || isNearBowl(position);
  if (shaking) {
    sieve.position.set(
      layout.use.positionWorld[0] + shakeX,
      layout.use.positionWorld[1],
      layout.use.positionWorld[2],
    );
  } else {
    sieve.position.set(...position);
  }
  sieve.rotation.order = "YXZ";
  const idleRotation = mobile
    ? layout.use.rotationYRadians
    : layout.idle.rotationYRadians;
  sieve.rotation.set(
    rollX,
    using ? layout.use.rotationYRadians : idleRotation,
    0,
  );
}

function updateScrollSieve(
  sieve: Group,
  elapsedSeconds: number,
  idlePosition: Tuple3,
  progress: number,
): void {
  const layout = RITUAL_LAYOUT_CONFIG.sieve;
  const config = SCROLL_RITUAL_CONFIG.sieve;
  const enter = smoothstep(range(progress, ...config.enterProgress));
  const leave = smoothstep(range(progress, ...config.leaveProgress));
  const active = enter * (1 - leave);
  const shakeActive =
    smoothstep(range(progress, ...config.shakeProgressStart)) *
    (1 - smoothstep(range(progress, ...config.shakeProgressEnd)));
  const rollX =
    Math.sin(elapsedSeconds * config.shakeFrequency) *
    config.shakeAmplitudeWorld *
    shakeActive;
  sieve.position.set(
    ...mixTuple3(idlePosition, layout.use.positionWorld, active),
  );
  sieve.rotation.order = "YXZ";
  sieve.rotation.set(
    rollX,
    mix(layout.idle.rotationYRadians, layout.use.rotationYRadians, active),
    0,
  );
}

function updateSieve(
  sieve: Group | null,
  elapsedSeconds: number,
  idlePosition: Tuple3,
  manualPosition: Tuple3,
  mobile: boolean,
  mode: SceneMode,
  progress: number,
  stage: ManualStage,
): void {
  if (!sieve) return;
  if (mode === "manual") {
    updateManualSieve(sieve, elapsedSeconds, mobile, manualPosition, stage);
  } else {
    updateScrollSieve(sieve, elapsedSeconds, idlePosition, progress);
  }
}

function updateKettle(
  kettle: Group | null,
  idlePosition: Tuple3,
  manualPosition: Tuple3,
  mode: SceneMode,
  progress: number,
  stage: ManualStage,
): void {
  if (!kettle) return;
  const layout = RITUAL_LAYOUT_CONFIG.kettle;
  if (mode === "manual") {
    const using =
      stage === "kettle-ready" ||
      stage === "pouring" ||
      isNearBowl(
        manualPosition,
        MANUAL_RITUAL_CONFIG.drag.kettleDropRadiusWorld,
      );
    kettle.position.set(...manualPosition);
    const rotation = using
      ? layout.use.rotationRadians
      : layout.idle.rotationRadians;
    kettle.rotation.set(rotation[0], rotation[1], rotation[2]);
    return;
  }
  const config = SCROLL_RITUAL_CONFIG.kettle;
  const enter = smoothstep(range(progress, ...config.enterProgress));
  const leave = smoothstep(range(progress, ...config.leaveProgress));
  const active = enter * (1 - leave);
  kettle.position.set(
    ...mixTuple3(idlePosition, layout.use.positionWorld, active),
  );
  kettle.rotation.set(
    ...mixTuple3(layout.idle.rotationRadians, layout.use.rotationRadians, active),
  );
}

function getScrollChasenActive(progress: number): number {
  const { activePhases, activeStops } = SCROLL_RITUAL_CONFIG.chasen;
  const [firstStop, secondStop] = activeStops;
  if (progress >= activePhases.returnStart) {
    const returnProgress = range(
      progress,
      activePhases.returnStart,
      activePhases.returnEnd,
    );
    return 1 - smoothstep(returnProgress);
  }
  if (progress <= activePhases.approachStart) return 0;
  if (progress <= activePhases.approachEnd) {
    return (
      smoothstep(
        range(
          progress,
          activePhases.approachStart,
          activePhases.approachEnd,
        ),
      ) * firstStop
    );
  }
  if (progress <= activePhases.middleStart) return firstStop;
  if (progress <= activePhases.middleEnd) {
    return (
      firstStop +
      smoothstep(
        range(
          progress,
          activePhases.middleStart,
          activePhases.middleEnd,
        ),
      ) *
        (secondStop - firstStop)
    );
  }
  if (progress <= activePhases.descendStart) return secondStop;
  if (progress <= activePhases.descendEnd) {
    return (
      secondStop +
      smoothstep(
        range(
          progress,
          activePhases.descendStart,
          activePhases.descendEnd,
        ),
      ) *
        (1 - secondStop)
    );
  }
  return 1;
}

function getScrollChasenPosition(
  active: number,
  idlePosition: Tuple3,
  usePosition: Tuple3,
): Tuple3 {
  const { activeStops, highYWorld } = SCROLL_RITUAL_CONFIG.chasen;
  const [firstStop, secondStop] = activeStops;
  const highIdlePosition: Tuple3 = [
    idlePosition[0],
    highYWorld,
    idlePosition[2],
  ];
  const highUsePosition: Tuple3 = [
    usePosition[0],
    highYWorld,
    usePosition[2],
  ];
  if (active <= firstStop) {
    return mixTuple3(idlePosition, highIdlePosition, active / firstStop);
  }
  if (active <= secondStop) {
    return mixTuple3(
      highIdlePosition,
      highUsePosition,
      (active - firstStop) / (secondStop - firstStop),
    );
  }
  return mixTuple3(
    highUsePosition,
    usePosition,
    (active - secondStop) / (1 - secondStop),
  );
}

function updateManualChasen(
  chasen: Group,
  position: Tuple3,
  stage: ManualStage,
  whiskCount: number,
): void {
  const layout = RITUAL_LAYOUT_CONFIG.chasen;
  if (stage === "whisking" || stage === "done") {
    const whiskConfig = MANUAL_RITUAL_CONFIG.whisk;
    const whiskRatio = smoothstep(
      Math.min(1, whiskCount / whiskConfig.targetCount),
    );
    const rawTilt =
      (position[0] - layout.use.positionWorld[0]) *
      whiskConfig.tiltMultiplier;
    const tilt = Math.max(
      whiskConfig.tiltRangeRadians[0],
      Math.min(whiskConfig.tiltRangeRadians[1], rawTilt),
    );
    chasen.position.set(
      position[0],
      layout.use.positionWorld[1],
      position[2],
    );
    chasen.rotation.set(
      layout.use.rotationRadians[0],
      0,
      tilt * Math.max(whiskConfig.tiltMinimumRatio, whiskRatio),
    );
    return;
  }
  const using = isNearBowl(position);
  chasen.position.set(...position);
  const rotation = using
    ? layout.use.rotationRadians
    : layout.idle.rotationRadians;
  chasen.rotation.set(rotation[0], rotation[1], rotation[2]);
}

function updateScrollChasen(
  chasen: Group,
  elapsedSeconds: number,
  idlePosition: Tuple3,
  progress: number,
): void {
  const layout = RITUAL_LAYOUT_CONFIG.chasen;
  const config = SCROLL_RITUAL_CONFIG.chasen;
  const whisk =
    smoothstep(range(progress, ...config.whiskVisibleStart)) *
    (1 - smoothstep(range(progress, ...config.whiskVisibleEnd)));
  const [pathX, pathZ] = sampleChasenW(elapsedSeconds);
  const usePosition: Tuple3 = [
    layout.use.positionWorld[0] + pathX * whisk,
    layout.use.positionWorld[1],
    layout.use.positionWorld[2] + pathZ * whisk,
  ];
  const useRotation: Tuple3 = [
    layout.use.rotationRadians[0],
    0,
    pathX * whisk * MANUAL_RITUAL_CONFIG.whisk.tiltMultiplier,
  ];
  const active = getScrollChasenActive(progress);
  chasen.position.set(
    ...getScrollChasenPosition(active, idlePosition, usePosition),
  );
  chasen.rotation.set(
    ...mixTuple3(layout.idle.rotationRadians, useRotation, active),
  );
}

function updateChasen(
  chasen: Group | null,
  elapsedSeconds: number,
  idlePosition: Tuple3,
  manualPosition: Tuple3,
  mode: SceneMode,
  progress: number,
  stage: ManualStage,
  whiskCount: number,
): void {
  if (!chasen) return;
  if (mode === "manual") {
    updateManualChasen(chasen, manualPosition, stage, whiskCount);
  } else {
    updateScrollChasen(chasen, elapsedSeconds, idlePosition, progress);
  }
}

export class SceneFrameRuntime {
  private readonly cameraTargets = createScrollCameraTargets();
  private readonly firstFrameRef: RefObject<boolean> = { current: true };
  private readonly targetCamera = new Vector3();

  constructor(private readonly refs: SceneObjectRefs) {}

  update({
    camera,
    elapsedSeconds,
    glow,
    idlePositions,
    lift,
    manual,
    mobile,
    mode,
    progress,
  }: SceneFrameSnapshot): void {
    if (mode === "manual") {
      manual.advanceAnimation(performance.now());
      updateManualToolHeights(
        manual.dragRef.current?.tool ?? null,
        idlePositions,
        manual.positionsRef.current,
        manual.stageRef.current,
      );
    }
    updateCamera(
      camera,
      this.cameraTargets,
      this.targetCamera,
      this.firstFrameRef,
      mobile,
      mode,
      progress,
    );
    updateBowl(
      this.refs.bowl.current,
      elapsedSeconds,
      lift,
      mode,
      progress,
    );
    updateSieve(
      this.refs.sieve.current,
      elapsedSeconds,
      idlePositions.sieve,
      manual.positionsRef.current.sieve,
      mobile,
      mode,
      progress,
      manual.stageRef.current,
    );
    updateKettle(
      this.refs.kettle.current,
      idlePositions.kettle,
      manual.positionsRef.current.kettle,
      mode,
      progress,
      manual.stageRef.current,
    );
    updateChasen(
      this.refs.chasen.current,
      elapsedSeconds,
      idlePositions.chasen,
      manual.positionsRef.current.chasen,
      mode,
      progress,
      manual.stageRef.current,
      manual.whiskStateRef.current.count,
    );
    if (this.refs.keyLight.current) {
      this.refs.keyLight.current.intensity = mix(
        SCENE_LIGHTING_CONFIG.key.startIntensity,
        SCENE_LIGHTING_CONFIG.key.finishIntensity,
        glow,
      );
    }
  }
}
