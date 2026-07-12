import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Plane, Vector2, Vector3 } from "three";
import { MANUAL_RITUAL_CONFIG, RITUAL_LAYOUT_CONFIG } from "./config/ritual";
import {
  canDragTool,
  clampDragWorld,
  cloneTuple,
} from "./manualRitual";
import type {
  ManualDragState,
  ManualStage,
  ManualTool,
  ManualToolPositions,
} from "./manualRitual";
import type { SceneMode } from "../../app/sceneMode";
import type { Tuple3 } from "../../utils/threeTransforms";
import type { ThreeEvent } from "@react-three/fiber";
import type { Camera, Raycaster } from "three";

interface UseManualRitualDragOptions {
  readonly applyManualPosition: (tool: ManualTool, position: Tuple3) => void;
  readonly camera: Camera;
  readonly canvas: HTMLCanvasElement;
  readonly dragRef: RefObject<ManualDragState | null>;
  readonly finishManualDrag: (tool: ManualTool) => void;
  readonly mobile: boolean;
  readonly mode: SceneMode;
  readonly positionsRef: RefObject<ManualToolPositions>;
  readonly raycaster: Raycaster;
  readonly registerWhiskMotion: (
    clientX: number,
    clientY: number,
    drag: ManualDragState,
    position: Tuple3,
  ) => void;
  readonly stageRef: RefObject<ManualStage>;
}

interface ManualRitualDragController {
  readonly cancelDrag: () => void;
  readonly startDrag: (
    tool: ManualTool,
    event: ThreeEvent<PointerEvent>,
  ) => void;
}

function getDragHeightWorld(tool: ManualTool): number {
  if (tool === "sieve") return RITUAL_LAYOUT_CONFIG.sieve.use.positionWorld[1];
  if (tool === "kettle") {
    return RITUAL_LAYOUT_CONFIG.kettle.use.positionWorld[1];
  }
  return MANUAL_RITUAL_CONFIG.drag.chasenLiftYWorld;
}

export function useManualRitualDrag({
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
}: UseManualRitualDragOptions): ManualRitualDragController {
  const cleanupListenersRef = useRef<(() => void) | null>(null);
  const dragPlaneRef = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const dragPlaneNormalRef = useRef(new Vector3(0, 1, 0));
  const dragPointRef = useRef(new Vector3());
  const pointerRef = useRef(new Vector2());

  const cancelDrag = useCallback(() => {
    cleanupListenersRef.current?.();
    cleanupListenersRef.current = null;
    dragRef.current = null;
  }, [dragRef]);

  useEffect(() => cancelDrag, [cancelDrag]);

  useEffect(() => {
    if (mode !== "manual") {
      cancelDrag();
    }
  }, [cancelDrag, mode]);

  const projectPointerToDragPlane = useCallback(
    (clientX: number, clientY: number, yWorld: number, point: Vector3) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      dragPlaneRef.current.set(dragPlaneNormalRef.current, -yWorld);
      raycaster.setFromCamera(pointerRef.current, camera);
      return raycaster.ray.intersectPlane(dragPlaneRef.current, point);
    },
    [camera, canvas, raycaster],
  );

  const continueDrag = useCallback(
    (event: PointerEvent | TouchEvent, clientX: number, clientY: number) => {
      const drag = dragRef.current;
      if (mode !== "manual" || !drag) return;
      event.preventDefault();
      event.stopPropagation();
      const point = dragPointRef.current;
      if (!projectPointerToDragPlane(clientX, clientY, drag.yWorld, point)) return;

      const currentPosition = positionsRef.current[drag.tool];
      const nextPosition: Tuple3 = [
        clampDragWorld(
          drag.startPosition[0] +
            (point.x - drag.startPoint.x) * drag.inputScale,
        ),
        currentPosition[1],
        clampDragWorld(
          drag.startPosition[2] +
            (point.z - drag.startPoint.z) * drag.inputScale,
        ),
      ];
      const epsilon = MANUAL_RITUAL_CONFIG.drag.pointerMoveEpsilonWorld;
      const moved =
        Math.abs(nextPosition[0] - currentPosition[0]) > epsilon ||
        Math.abs(nextPosition[2] - currentPosition[2]) > epsilon;
      if (moved) {
        applyManualPosition(drag.tool, nextPosition);
      }
      registerWhiskMotion(clientX, clientY, drag, nextPosition);
    },
    [
      applyManualPosition,
      dragRef,
      mode,
      positionsRef,
      projectPointerToDragPlane,
      registerWhiskMotion,
    ],
  );

  const startDrag = useCallback(
    (tool: ManualTool, event: ThreeEvent<PointerEvent>) => {
      if (mode !== "manual" || !canDragTool(tool, stageRef.current)) return;
      event.stopPropagation();
      event.nativeEvent.preventDefault();

      const targetYWorld = getDragHeightWorld(tool);
      const point = dragPointRef.current;
      if (
        !projectPointerToDragPlane(
          event.nativeEvent.clientX,
          event.nativeEvent.clientY,
          targetYWorld,
          point,
        )
      ) {
        return;
      }

      const drag: ManualDragState = {
        inputScale:
          mobile && event.nativeEvent.pointerType !== "mouse"
            ? MANUAL_RITUAL_CONFIG.drag.mobileTouchScaleRatio
            : 1,
        lastClientX: event.nativeEvent.clientX,
        lastClientY: event.nativeEvent.clientY,
        pointerId: event.pointerId,
        startPoint: point.clone(),
        startPosition: cloneTuple(positionsRef.current[tool]),
        tool,
        yWorld: targetYWorld,
      };
      dragRef.current = drag;
      canvas.setPointerCapture(event.pointerId);

      const removeDocumentListeners = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchcancel", handleTouchEnd);
      };
      const finishDrag = (endEvent: PointerEvent | TouchEvent) => {
        endEvent.preventDefault();
        endEvent.stopPropagation();
        canvas.releasePointerCapture(drag.pointerId);
        removeDocumentListeners();
        cleanupListenersRef.current = null;
        finishManualDrag(tool);
      };
      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId === drag.pointerId) {
          continueDrag(moveEvent, moveEvent.clientX, moveEvent.clientY);
        }
      };
      const handlePointerEnd = (endEvent: PointerEvent) => {
        if (endEvent.pointerId === drag.pointerId) {
          finishDrag(endEvent);
        }
      };
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const touch =
          moveEvent.touches.item(0) ?? moveEvent.changedTouches.item(0);
        if (touch) {
          continueDrag(moveEvent, touch.clientX, touch.clientY);
        }
      };
      const handleTouchEnd = (endEvent: TouchEvent) => {
        finishDrag(endEvent);
      };

      cleanupListenersRef.current = removeDocumentListeners;
      document.addEventListener("pointermove", handlePointerMove, { passive: false });
      document.addEventListener("pointerup", handlePointerEnd, { passive: false });
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });
      document.addEventListener("touchcancel", handleTouchEnd, { passive: false });
    },
    [
      canvas,
      continueDrag,
      dragRef,
      finishManualDrag,
      mobile,
      mode,
      positionsRef,
      projectPointerToDragPlane,
      stageRef,
    ],
  );

  return { cancelDrag, startDrag };
}
