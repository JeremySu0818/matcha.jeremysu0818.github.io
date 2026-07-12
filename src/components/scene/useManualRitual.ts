import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { mix, smoothstep } from "../../utils/easing";
import { MANUAL_RITUAL_CONFIG, RITUAL_LAYOUT_CONFIG } from "./config/ritual";
import {
  cloneTuple,
  getContextAction,
  getDragCompletion,
  getToolUsePosition,
  isNearBowl,
  stageToStep,
} from "./manualRitual";
import { useManualRitualDrag } from "./useManualRitualDrag";
import type {
  ManualAnimation,
  ManualDragState,
  ManualStage,
  ManualTool,
  ManualToolPositions,
  WhiskState,
} from "./manualRitual";
import type { SceneMode } from "../../app/sceneMode";
import type { Tuple3 } from "../../utils/threeTransforms";
import type { ThreeEvent } from "@react-three/fiber";
import type { Camera, Group, Raycaster } from "three";

interface ManualToolRefs {
  readonly chasen: RefObject<Group | null>;
  readonly kettle: RefObject<Group | null>;
  readonly sieve: RefObject<Group | null>;
}

interface UseManualRitualOptions {
  readonly camera: Camera;
  readonly canvas: HTMLCanvasElement;
  readonly idlePositions: ManualToolPositions;
  readonly mobile: boolean;
  readonly mode: SceneMode;
  readonly onComplete?: () => void;
  readonly onStageChange?: (stage: ManualStage) => void;
  readonly onStepChange?: (step: number) => void;
  readonly raycaster: Raycaster;
  readonly resetToken: number;
  readonly toolRefs: ManualToolRefs;
}

interface ManualToolHandlers {
  readonly onContextMenu: (event: ThreeEvent<MouseEvent>) => void;
  readonly onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
}

export interface ManualRitualController {
  readonly advanceAnimation: (nowMs: number) => void;
  readonly animationRef: RefObject<ManualAnimation | null>;
  readonly dragRef: RefObject<ManualDragState | null>;
  readonly getToolHandlers: (tool: ManualTool) => ManualToolHandlers;
  readonly positionsRef: RefObject<ManualToolPositions>;
  readonly progressRef: RefObject<number>;
  readonly stageRef: RefObject<ManualStage>;
  readonly whiskStateRef: RefObject<WhiskState>;
}

export function useManualRitual({
  camera,
  canvas,
  idlePositions,
  mobile,
  mode,
  onComplete,
  onStageChange,
  onStepChange,
  raycaster,
  resetToken,
  toolRefs,
}: UseManualRitualOptions): ManualRitualController {
  const progressRef = useRef<number>(MANUAL_RITUAL_CONFIG.progress.start);
  const stageRef = useRef<ManualStage>("sieve-drag");
  const completeRef = useRef(false);
  const animationRef = useRef<ManualAnimation | null>(null);
  const dragRef = useRef<ManualDragState | null>(null);
  const positionsRef = useRef<ManualToolPositions>({
    chasen: cloneTuple(idlePositions.chasen),
    kettle: cloneTuple(idlePositions.kettle),
    sieve: cloneTuple(idlePositions.sieve),
  });
  const whiskStateRef = useRef<WhiskState>({ count: 0, travelPixels: 0 });

  const getToolGroup = useCallback(
    (tool: ManualTool): Group | null => toolRefs[tool].current,
    [toolRefs],
  );

  const applyManualPosition = useCallback(
    (tool: ManualTool, position: Tuple3) => {
      positionsRef.current[tool] = position;
      getToolGroup(tool)?.position.set(...position);
    },
    [getToolGroup],
  );

  const snapToolIdle = useCallback(
    (tool: ManualTool) => {
      applyManualPosition(tool, cloneTuple(idlePositions[tool]));
    },
    [applyManualPosition, idlePositions],
  );

  const snapToolUse = useCallback(
    (tool: ManualTool) => {
      applyManualPosition(tool, cloneTuple(getToolUsePosition(tool)));
    },
    [applyManualPosition],
  );

  const updateStage = useCallback(
    (stage: ManualStage) => {
      stageRef.current = stage;
      onStepChange?.(stageToStep(stage));
      onStageChange?.(stage);
    },
    [onStageChange, onStepChange],
  );

  const completeRitual = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    progressRef.current = MANUAL_RITUAL_CONFIG.progress.complete;
    updateStage("done");
    onComplete?.();
  }, [onComplete, updateStage]);

  const beginChasenReturn = useCallback(() => {
    progressRef.current = MANUAL_RITUAL_CONFIG.progress.chasenReturn;
    updateStage("chasen-return");
  }, [updateStage]);

  const registerWhiskMotion = useCallback(
    (
      clientX: number,
      clientY: number,
      drag: ManualDragState,
      position: Tuple3,
    ) => {
      if (stageRef.current !== "whisking" || !isNearBowl(position)) {
        drag.lastClientX = clientX;
        drag.lastClientY = clientY;
        return;
      }

      const pointerTravelPixels =
        (Math.abs(clientX - drag.lastClientX) +
          Math.abs(clientY - drag.lastClientY)) *
        drag.inputScale;
      drag.lastClientX = clientX;
      drag.lastClientY = clientY;
      const whiskConfig = MANUAL_RITUAL_CONFIG.whisk;
      if (pointerTravelPixels < whiskConfig.minimumPointerTravelPixels) return;

      const whiskState = whiskStateRef.current;
      whiskState.travelPixels += pointerTravelPixels;
      while (
        whiskState.travelPixels >= whiskConfig.travelPixelsPerCount &&
        whiskState.count < whiskConfig.targetCount
      ) {
        whiskState.travelPixels -= whiskConfig.travelPixelsPerCount;
        whiskState.count += 1;
      }

      const whiskRatio = Math.min(1, whiskState.count / whiskConfig.targetCount);
      progressRef.current = mix(
        whiskConfig.progressStart,
        whiskConfig.progressEnd,
        smoothstep(whiskRatio),
      );
      if (whiskState.count >= whiskConfig.targetCount) {
        beginChasenReturn();
      }
    },
    [beginChasenReturn],
  );

  const finishManualDrag = useCallback(
    (tool: ManualTool) => {
      const drag = dragRef.current;
      if (mode !== "manual" || drag?.tool !== tool) return;
      dragRef.current = null;
      const position = positionsRef.current[tool];
      const completion = getDragCompletion(tool, stageRef.current, position);

      if (completion.placement === "idle") snapToolIdle(tool);
      if (completion.placement === "use") snapToolUse(tool);
      if (completion.placement === "dragged-use-height") {
        applyManualPosition("chasen", [
          position[0],
          RITUAL_LAYOUT_CONFIG.chasen.use.positionWorld[1],
          position[2],
        ]);
      }
      if (completion.resetWhisk) {
        whiskStateRef.current = { count: 0, travelPixels: 0 };
      }
      if (completion.progress !== undefined) {
        progressRef.current = completion.progress;
      }
      if (completion.minimumProgress !== undefined) {
        progressRef.current = Math.max(
          progressRef.current,
          completion.minimumProgress,
        );
      }
      if (completion.nextStage) updateStage(completion.nextStage);
      if (completion.complete) completeRitual();
    },
    [
      applyManualPosition,
      completeRitual,
      dragRef,
      mode,
      snapToolIdle,
      snapToolUse,
      updateStage,
    ],
  );

  const { cancelDrag, startDrag } = useManualRitualDrag({
    applyManualPosition,
    camera,
    canvas,
    dragRef,
    finishManualDrag,
    mobile,
    mode,
    positionsRef,
    raycaster,
    registerWhiskMotion,
    stageRef,
  });

  const startAnimation = useCallback(
    (action: NonNullable<ReturnType<typeof getContextAction>>) => {
      progressRef.current = action.fromProgress;
      animationRef.current = {
        durationMs: action.durationMs,
        fromProgress: action.fromProgress,
        onDone: () => {
          updateStage(action.nextStage);
        },
        startedAtMs: performance.now(),
        toProgress: action.progressAfterAnimation,
      };
    },
    [updateStage],
  );

  const handleContextMenu = useCallback(
    (tool: ManualTool, event: ThreeEvent<MouseEvent>) => {
      if (mode !== "manual") return;
      event.stopPropagation();
      event.nativeEvent.preventDefault();
      const action = getContextAction(tool, stageRef.current);
      if (!action) return;
      snapToolUse(tool);
      updateStage(action.stageDuringAnimation);
      startAnimation(action);
    },
    [mode, snapToolUse, startAnimation, updateStage],
  );

  const getToolHandlers = useCallback(
    (tool: ManualTool): ManualToolHandlers => ({
      onContextMenu(event) {
        handleContextMenu(tool, event);
      },
      onPointerDown(event) {
        startDrag(tool, event);
      },
    }),
    [handleContextMenu, startDrag],
  );

  const advanceAnimation = useCallback((nowMs: number) => {
    const animation = animationRef.current;
    if (!animation) return;
    const elapsedMs = nowMs - animation.startedAtMs;
    const ratio = Math.min(1, elapsedMs / animation.durationMs);
    progressRef.current = mix(
      animation.fromProgress,
      animation.toProgress,
      smoothstep(ratio),
    );
    if (ratio >= 1) {
      animationRef.current = null;
      animation.onDone?.();
    }
  }, []);

  useEffect(() => {
    if (mode !== "manual") {
      cancelDrag();
      animationRef.current = null;
      return;
    }
    completeRef.current = false;
    progressRef.current = MANUAL_RITUAL_CONFIG.progress.start;
    animationRef.current = null;
    whiskStateRef.current = { count: 0, travelPixels: 0 };
    positionsRef.current = {
      chasen: cloneTuple(idlePositions.chasen),
      kettle: cloneTuple(idlePositions.kettle),
      sieve: cloneTuple(idlePositions.sieve),
    };
    toolRefs.sieve.current?.position.set(...idlePositions.sieve);
    toolRefs.kettle.current?.position.set(...idlePositions.kettle);
    toolRefs.chasen.current?.position.set(...idlePositions.chasen);
    updateStage("sieve-drag");
  }, [
    cancelDrag,
    idlePositions,
    mode,
    resetToken,
    toolRefs,
    updateStage,
  ]);

  return {
    advanceAnimation,
    animationRef,
    dragRef,
    getToolHandlers,
    positionsRef,
    progressRef,
    stageRef,
    whiskStateRef,
  };
}
