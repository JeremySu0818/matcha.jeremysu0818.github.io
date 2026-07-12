import { mix, smoothstep } from "../../utils/easing";
import {
  MANUAL_RITUAL_CONFIG,
  RITUAL_LAYOUT_CONFIG,
  SCROLL_RITUAL_CONFIG,
} from "./config/ritual";
import type { SceneMode } from "../../app/sceneMode";
import type { Tuple3 } from "../../utils/threeTransforms";
import type { Vector3 } from "three";

export const MANUAL_TOOLS = ["sieve", "kettle", "chasen"] as const;

export type ManualTool = (typeof MANUAL_TOOLS)[number];

export type ManualStage =
  | "sieve-drag"
  | "sieve-ready"
  | "sieve-shaking"
  | "sieve-return"
  | "kettle-drag"
  | "kettle-ready"
  | "pouring"
  | "kettle-return"
  | "chasen-drag"
  | "whisking"
  | "chasen-return"
  | "done";

export interface ManualAnimation {
  readonly durationMs: number;
  readonly fromProgress: number;
  readonly onDone?: () => void;
  readonly startedAtMs: number;
  readonly toProgress: number;
}

export interface WhiskState {
  count: number;
  travelPixels: number;
}

export interface ManualDragState {
  inputScale: number;
  lastClientX: number;
  lastClientY: number;
  readonly pointerId: number;
  readonly startPoint: Vector3;
  readonly startPosition: Tuple3;
  readonly tool: ManualTool;
  readonly yWorld: number;
}

type ManualToolPlacement = "idle" | "use" | "dragged-use-height" | "unchanged";

export interface ManualDragCompletion {
  readonly complete?: boolean;
  readonly minimumProgress?: number;
  readonly nextStage?: ManualStage;
  readonly placement: ManualToolPlacement;
  readonly progress?: number;
  readonly resetWhisk?: boolean;
}

export interface ManualContextAction {
  readonly durationMs: number;
  readonly fromProgress: number;
  readonly nextStage: ManualStage;
  readonly progressAfterAnimation: number;
  readonly stageDuringAnimation: ManualStage;
}

export type ManualToolPositions = Record<ManualTool, Tuple3>;

export function cloneTuple(tuple: Tuple3): Tuple3 {
  return [tuple[0], tuple[1], tuple[2]];
}

export function getManualIdlePositions(
  mobile: boolean,
  mode: SceneMode,
): ManualToolPositions {
  const { chasen, kettle, sieve } = RITUAL_LAYOUT_CONFIG;
  if (mobile && mode === "manual") {
    return {
      chasen: cloneTuple(chasen.mobileIdlePositionWorld),
      kettle: cloneTuple(kettle.mobileIdlePositionWorld),
      sieve: cloneTuple(sieve.mobileIdlePositionWorld),
    };
  }
  return {
    chasen: cloneTuple(chasen.idle.positionWorld),
    kettle: cloneTuple(kettle.idle.positionWorld),
    sieve: cloneTuple(sieve.idle.positionWorld),
  };
}

export function getToolUsePosition(tool: ManualTool): Tuple3 {
  return RITUAL_LAYOUT_CONFIG[tool].use.positionWorld;
}

export function isNearBowl(
  position: Tuple3,
  radiusWorld: number = MANUAL_RITUAL_CONFIG.drag.bowlDropRadiusWorld,
): boolean {
  const [centerX, centerZ] = MANUAL_RITUAL_CONFIG.drag.bowlCenterWorld;
  return Math.hypot(position[0] - centerX, position[2] - centerZ) <= radiusWorld;
}

export function getDragCompletion(
  tool: ManualTool,
  stage: ManualStage,
  position: Tuple3,
): ManualDragCompletion {
  const { drag, progress } = MANUAL_RITUAL_CONFIG;
  if (tool === "sieve" && stage === "sieve-drag") {
    return isNearBowl(position)
      ? { nextStage: "sieve-ready", placement: "use", progress: progress.sieveReady }
      : { placement: "idle" };
  }
  if (tool === "sieve" && stage === "sieve-return") {
    return {
      minimumProgress: progress.kettleDrag,
      nextStage: "kettle-drag",
      placement: "idle",
    };
  }
  if (tool === "kettle" && stage === "kettle-drag") {
    return isNearBowl(position, drag.kettleDropRadiusWorld)
      ? { nextStage: "kettle-ready", placement: "use", progress: progress.kettleDrag }
      : { placement: "idle" };
  }
  if (tool === "kettle" && stage === "kettle-return") {
    return {
      minimumProgress: progress.kettleReturn,
      nextStage: "chasen-drag",
      placement: "idle",
    };
  }
  if (tool === "chasen" && stage === "chasen-drag") {
    return isNearBowl(position)
      ? {
          nextStage: "whisking",
          placement: "dragged-use-height",
          progress: progress.whisking,
          resetWhisk: true,
        }
      : { placement: "idle" };
  }
  if (tool === "chasen" && stage === "chasen-return") {
    return { complete: true, placement: "idle" };
  }
  return { placement: "unchanged" };
}

export function getContextAction(
  tool: ManualTool,
  stage: ManualStage,
): ManualContextAction | null {
  const { animation, progress } = MANUAL_RITUAL_CONFIG;
  if (tool === "sieve" && stage === "sieve-ready") {
    return {
      durationMs: animation.sieveShakeDurationMs,
      fromProgress: progress.sieveReady,
      nextStage: "sieve-return",
      progressAfterAnimation: progress.kettleDrag,
      stageDuringAnimation: "sieve-shaking",
    };
  }
  if (tool === "kettle" && stage === "kettle-ready") {
    return {
      durationMs: animation.kettlePourDurationMs,
      fromProgress: progress.kettleDrag,
      nextStage: "kettle-return",
      progressAfterAnimation: progress.kettlePourEnd,
      stageDuringAnimation: "pouring",
    };
  }
  return null;
}

export function clampDragWorld(value: number): number {
  const [minimum, maximum] = MANUAL_RITUAL_CONFIG.drag.clampWorld;
  return Math.max(minimum, Math.min(maximum, value));
}

export function stageToStep(stage: ManualStage): number {
  if (stage.startsWith("sieve")) return 2;
  if (stage.startsWith("kettle") || stage === "pouring") return 3;
  if (stage === "done") return 5;
  return 4;
}

export function canDragTool(tool: ManualTool, stage: ManualStage): boolean {
  if (tool === "sieve") {
    return stage === "sieve-drag" || stage === "sieve-return";
  }
  if (tool === "kettle") {
    return stage === "kettle-drag" || stage === "kettle-return";
  }
  return stage === "chasen-drag" || stage === "whisking" || stage === "chasen-return";
}

export function getTargetToolY(
  tool: ManualTool,
  stage: ManualStage,
  draggingTool: ManualTool | null,
  idlePositions: ManualToolPositions,
): number {
  if (tool === "sieve") {
    const isUsing = stage === "sieve-ready" || stage === "sieve-shaking" || stage === "sieve-return";
    return isUsing || draggingTool === tool
      ? RITUAL_LAYOUT_CONFIG.sieve.use.positionWorld[1]
      : idlePositions.sieve[1];
  }
  if (tool === "kettle") {
    const isUsing = stage === "kettle-ready" || stage === "pouring" || stage === "kettle-return";
    return isUsing || draggingTool === tool
      ? RITUAL_LAYOUT_CONFIG.kettle.use.positionWorld[1]
      : idlePositions.kettle[1];
  }
  if (stage === "whisking" || stage === "done") {
    return RITUAL_LAYOUT_CONFIG.chasen.use.positionWorld[1];
  }
  if (draggingTool === tool) {
    return MANUAL_RITUAL_CONFIG.drag.chasenLiftYWorld;
  }
  return idlePositions.chasen[1];
}

export function sampleChasenW(elapsedSeconds: number): readonly [number, number] {
  const { frequency, points, xScaleWorld, zScaleWorld } = SCROLL_RITUAL_CONFIG.whiskPath;
  const segmentCount = (points.length - 1) * 2;
  const phase = (elapsedSeconds * frequency) % segmentCount;
  const segment = Math.floor(phase);
  const forward = segment < points.length - 1;
  const fromIndex = forward ? segment : segmentCount - segment;
  const toIndex = forward ? fromIndex + 1 : fromIndex - 1;
  const localProgress = smoothstep(phase - segment);
  const from = points[fromIndex];
  const to = points[toIndex];
  const pathX = mix(from[0], to[0], localProgress);
  const pathZ = mix(from[1], to[1], localProgress);
  return [-pathZ * xScaleWorld, pathX * zScaleWorld];
}
