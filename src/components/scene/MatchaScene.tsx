import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Environment, Float, useScroll } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DirectionalLight,
  Group,
  MeshPhysicalMaterial,
  Plane,
  PerspectiveCamera,
  Vector3,
} from "three";
import type { SceneMode } from "../../app/sceneMode";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { asset } from "../../utils/assets";
import { mix, range, smoothstep } from "../../utils/easing";
import { mixTuple3, type Tuple3 } from "../../utils/threeTransforms";
import { FoamSurface } from "./FoamSurface";
import { Model } from "./Model";
import { PowderParticles } from "./PowderParticles";
import { WaterFill } from "./WaterFill";
import { WaterStream } from "./WaterStream";
import {
  cameraTargets,
  chasenIdle,
  chasenUse,
  kettleIdle,
  kettleUse,
  sampleChasenW,
  sieveIdle,
  sieveUse,
  supportSurfaceY,
  teaTrayPosition,
} from "./sceneMotion";

gsap.registerPlugin(ScrollTrigger);

type ManualTool = "sieve" | "kettle" | "chasen";
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
  | "done";

type ManualAnimation = {
  from: number;
  to: number;
  startedAt: number;
  duration: number;
  onDone?: () => void;
};

type DragState = {
  tool: ManualTool;
  pointerId: number;
  y: number;
  offset: Vector3;
};

interface MatchaSceneProps {
  mode?: SceneMode;
  onManualStepChange?: (step: number) => void;
  onManualStageChange?: (stage: ManualStage) => void;
  onManualComplete?: () => void;
}

const MANUAL_START_PROGRESS = 0.16;
const BOWL_DROP_RADIUS = 0.72;

function cloneTuple(tuple: Tuple3): Tuple3 {
  return [tuple[0], tuple[1], tuple[2]];
}

function isNearBowl(position: Tuple3, radius = BOWL_DROP_RADIUS) {
  return Math.hypot(position[0] - 0.11, position[2]) <= radius;
}

function clampDrag(value: number) {
  return Math.max(-3.2, Math.min(3.2, value));
}

function stageToStep(stage: ManualStage) {
  if (stage.startsWith("sieve")) return 2;
  if (stage.startsWith("kettle") || stage === "pouring") return 3;
  if (stage === "done") return 5;
  return 4;
}

export function MatchaScene({
  mode = "scroll",
  onManualStepChange,
  onManualStageChange,
  onManualComplete,
}: MatchaSceneProps) {
  const mobile = useMediaQuery("(max-width: 720px)");
  const scroll = useScroll();
  const { camera } = useThree();
  const bowlRef = useRef<Group>(null);
  const sieveRef = useRef<Group>(null);
  const kettleRef = useRef<Group>(null);
  const chasenRef = useRef<Group>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const gsapState = useRef({ glow: 0, lift: 0 });
  const manualProgressRef = useRef(MANUAL_START_PROGRESS);
  const manualStageRef = useRef<ManualStage>("sieve-drag");
  const [, setManualStage] = useState<ManualStage>("sieve-drag");
  const manualCompleteRef = useRef(false);
  const manualAnimationRef = useRef<ManualAnimation | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragPlaneRef = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const dragPointRef = useRef(new Vector3());
  const manualPositionsRef = useRef<Record<ManualTool, Tuple3>>({
    sieve: cloneTuple(sieveIdle.position),
    kettle: cloneTuple(kettleIdle.position),
    chasen: cloneTuple(chasenIdle.position),
  });
  const whiskStateRef = useRef({
    count: 0,
    travel: 0,
  });
  const tabletopMaterial = useMemo(() => {
    return new MeshPhysicalMaterial({
      color: "#dfc8a8",
      roughness: 0.72,
      clearcoat: 0.06,
      clearcoatRoughness: 0.7,
      envMapIntensity: 0.5,
    });
  }, []);

  const getToolGroup = useCallback((tool: ManualTool) => {
    if (tool === "sieve") return sieveRef.current;
    if (tool === "kettle") return kettleRef.current;
    return chasenRef.current;
  }, []);

  const applyManualPosition = useCallback(
    (tool: ManualTool, position: Tuple3) => {
      manualPositionsRef.current[tool] = position;
      getToolGroup(tool)?.position.set(...position);
    },
    [getToolGroup],
  );

  const snapToolIdle = useCallback(
    (tool: ManualTool) => {
      const position =
        tool === "sieve"
          ? sieveIdle.position
          : tool === "kettle"
            ? kettleIdle.position
            : chasenIdle.position;
      applyManualPosition(tool, cloneTuple(position));
    },
    [applyManualPosition],
  );

  const snapToolUse = useCallback(
    (tool: ManualTool) => {
      const position =
        tool === "sieve"
          ? sieveUse.position
          : tool === "kettle"
            ? kettleUse.position
            : chasenUse.position;
      applyManualPosition(tool, cloneTuple(position));
    },
    [applyManualPosition],
  );

  const updateManualStage = useCallback(
    (stage: ManualStage) => {
      manualStageRef.current = stage;
      setManualStage(stage);
      onManualStepChange?.(stageToStep(stage));
      onManualStageChange?.(stage);
    },
    [onManualStepChange, onManualStageChange],
  );

  const getTargetY = useCallback(
    (tool: ManualTool, stage: ManualStage) => {
      if (tool === "sieve") {
        const isUse =
          stage === "sieve-ready" ||
          stage === "sieve-shaking" ||
          stage === "sieve-return";
        const isDragging = dragRef.current?.tool === "sieve";
        return isUse || isDragging ? sieveUse.position[1] : sieveIdle.position[1];
      }
      if (tool === "kettle") {
        const isUse =
          stage === "kettle-ready" ||
          stage === "pouring" ||
          stage === "kettle-return";
        const isDragging = dragRef.current?.tool === "kettle";
        return isUse || isDragging ? kettleUse.position[1] : kettleIdle.position[1];
      }
      // tool === "chasen"
      const isWhisking = stage === "whisking" || stage === "done";
      const isDragging = dragRef.current?.tool === "chasen";
      if (isWhisking) return chasenUse.position[1];
      if (isDragging) return 1.5;
      return chasenIdle.position[1];
    },
    [],
  );

  const startManualAnimation = useCallback(
    (
      from: number,
      to: number,
      duration: number,
      onDone?: () => void,
    ) => {
      manualProgressRef.current = from;
      manualAnimationRef.current = {
        from,
        to,
        duration,
        onDone,
        startedAt: performance.now(),
      };
    },
    [],
  );

  const canDragTool = useCallback((tool: ManualTool) => {
    const stage = manualStageRef.current;
    if (tool === "sieve") {
      return stage === "sieve-drag" || stage === "sieve-return";
    }
    if (tool === "kettle") {
      return stage === "kettle-drag" || stage === "kettle-return";
    }
    return stage === "chasen-drag" || stage === "whisking";
  }, []);

  const completeManualRitual = useCallback(() => {
    if (manualCompleteRef.current) return;
    manualCompleteRef.current = true;
    manualProgressRef.current = 1;
    updateManualStage("done");
    onManualComplete?.();
  }, [onManualComplete, updateManualStage]);

  const registerWhiskMotion = useCallback(
    (event: ThreeEvent<PointerEvent>, position: Tuple3) => {
      if (manualStageRef.current !== "whisking" || !isNearBowl(position)) {
        return;
      }

      const movement =
        Math.abs(event.nativeEvent.movementX) +
        Math.abs(event.nativeEvent.movementY);
      if (movement < 2) {
        return;
      }

      const whiskState = whiskStateRef.current;
      whiskState.travel += movement;

      while (whiskState.travel >= 22 && whiskState.count < 30) {
        whiskState.travel -= 22;
        whiskState.count += 1;
      }

      const whiskRatio = Math.min(1, whiskState.count / 30);
      manualProgressRef.current = mix(0.76, 0.98, smoothstep(whiskRatio));

      if (whiskState.count >= 30) {
        completeManualRitual();
      }
    },
    [completeManualRitual],
  );

  const handleManualPointerDown = useCallback(
    (tool: ManualTool) => (event: ThreeEvent<PointerEvent>) => {
      if (mode !== "manual" || !canDragTool(tool)) return;

      event.stopPropagation();
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);

      const current = manualPositionsRef.current[tool];
      const plane = dragPlaneRef.current;
      const point = dragPointRef.current;

      const targetY =
        tool === "sieve"
          ? sieveUse.position[1]
          : tool === "kettle"
            ? kettleUse.position[1]
            : 1.5;

      plane.set(new Vector3(0, 1, 0), -targetY);

      if (!event.ray.intersectPlane(plane, point)) {
        return;
      }

      dragRef.current = {
        tool,
        pointerId: event.pointerId,
        y: targetY,
        offset: point.clone().sub(new Vector3(current[0], targetY, current[2])),
      };
    },
    [canDragTool, mode],
  );

  const handleManualPointerMove = useCallback(
    (tool: ManualTool) => (event: ThreeEvent<PointerEvent>) => {
      const drag = dragRef.current;
      if (mode !== "manual" || !drag || drag.tool !== tool) return;

      event.stopPropagation();
      const plane = dragPlaneRef.current;
      const point = dragPointRef.current;
      plane.set(new Vector3(0, 1, 0), -drag.y);

      if (!event.ray.intersectPlane(plane, point)) {
        return;
      }

      const nextPosition: Tuple3 = [
        clampDrag(point.x - drag.offset.x),
        manualPositionsRef.current[tool][1],
        clampDrag(point.z - drag.offset.z),
      ];
      applyManualPosition(tool, nextPosition);
      registerWhiskMotion(event, nextPosition);
    },
    [applyManualPosition, mode, registerWhiskMotion],
  );

  const handleManualPointerUp = useCallback(
    (tool: ManualTool) => (event: ThreeEvent<PointerEvent>) => {
      const drag = dragRef.current;
      if (mode !== "manual" || !drag || drag.tool !== tool) return;

      event.stopPropagation();
      (event.target as HTMLElement).releasePointerCapture?.(drag.pointerId);
      dragRef.current = null;

      const stage = manualStageRef.current;
      const position = manualPositionsRef.current[tool];

      if (tool === "sieve" && stage === "sieve-drag") {
        if (isNearBowl(position)) {
          snapToolUse("sieve");
          manualProgressRef.current = 0.18;
          updateManualStage("sieve-ready");
        } else {
          snapToolIdle("sieve");
        }
      }

      if (tool === "sieve" && stage === "sieve-return") {
        snapToolIdle("sieve");
        manualProgressRef.current = Math.max(manualProgressRef.current, 0.43);
        updateManualStage("kettle-drag");
      }

      if (tool === "kettle" && stage === "kettle-drag") {
        if (isNearBowl(position, 1.8)) {
          snapToolUse("kettle");
          manualProgressRef.current = 0.48;
          updateManualStage("kettle-ready");
        } else {
          snapToolIdle("kettle");
        }
      }

      if (tool === "kettle" && stage === "kettle-return") {
        snapToolIdle("kettle");
        manualProgressRef.current = Math.max(manualProgressRef.current, 0.68);
        updateManualStage("chasen-drag");
      }

      if (tool === "chasen" && stage === "chasen-drag") {
        if (isNearBowl(position)) {
          snapToolUse("chasen");
          whiskStateRef.current = { count: 0, travel: 0 };
          manualProgressRef.current = 0.76;
          updateManualStage("whisking");
        } else {
          snapToolIdle("chasen");
        }
      }
    },
    [mode, snapToolIdle, snapToolUse, updateManualStage],
  );

  const handleManualContextMenu = useCallback(
    (tool: ManualTool) => (event: ThreeEvent<MouseEvent>) => {
      if (mode !== "manual") return;

      event.stopPropagation();
      event.nativeEvent.preventDefault();

      const stage = manualStageRef.current;
      if (tool === "sieve" && stage === "sieve-ready") {
        snapToolUse("sieve");
        updateManualStage("sieve-shaking");
        startManualAnimation(0.18, 0.46, 4000, () => {
          updateManualStage("sieve-return");
        });
      }

      if (tool === "kettle" && stage === "kettle-ready") {
        snapToolUse("kettle");
        updateManualStage("pouring");
        startManualAnimation(0.49, 0.66, 2700, () => {
          updateManualStage("kettle-return");
        });
      }
    },
    [mode, snapToolUse, startManualAnimation, updateManualStage],
  );

  const manualHandlers = useCallback(
    (tool: ManualTool) => ({
      onPointerDown: handleManualPointerDown(tool),
      onPointerMove: handleManualPointerMove(tool),
      onPointerUp: handleManualPointerUp(tool),
      onContextMenu: handleManualContextMenu(tool),
    }),
    [
      handleManualContextMenu,
      handleManualPointerDown,
      handleManualPointerMove,
      handleManualPointerUp,
    ],
  );

  useEffect(() => {
    const target = gsapState.current;
    const intro = gsap.to(target, {
      lift: 0.18,
      glow: 0.45,
      ease: "none",
      scrollTrigger: {
        trigger: scroll.el,
        scroller: scroll.el,
        start: "top top",
        end: "18% top",
        scrub: 1,
      },
    });

    const finish = gsap.to(target, {
      glow: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scroll.el,
        scroller: scroll.el,
        start: "78% top",
        end: "100% bottom",
        scrub: 1,
      },
    });

    return () => {
      intro.kill();
      finish.kill();
    };
  }, [scroll.el]);

  useEffect(() => {
    if (mode !== "manual") {
      dragRef.current = null;
      manualAnimationRef.current = null;
      return;
    }

    manualCompleteRef.current = false;
    manualProgressRef.current = MANUAL_START_PROGRESS;
    manualAnimationRef.current = null;
    whiskStateRef.current = { count: 0, travel: 0 };
    manualPositionsRef.current = {
      sieve: cloneTuple(sieveIdle.position),
      kettle: cloneTuple(kettleIdle.position),
      chasen: cloneTuple(chasenIdle.position),
    };
    sieveRef.current?.position.set(...sieveIdle.position);
    kettleRef.current?.position.set(...kettleIdle.position);
    chasenRef.current?.position.set(...chasenIdle.position);
    updateManualStage("sieve-drag");
  }, [mode, updateManualStage]);

  useFrame(({ clock }) => {
    const manualAnimation = manualAnimationRef.current;
    if (mode === "manual" && manualAnimation) {
      const elapsed = performance.now() - manualAnimation.startedAt;
      const ratio = Math.min(1, elapsed / manualAnimation.duration);
      manualProgressRef.current = mix(
        manualAnimation.from,
        manualAnimation.to,
        smoothstep(ratio),
      );

      if (ratio >= 1) {
        manualAnimationRef.current = null;
        manualAnimation.onDone?.();
      }
    }

    const progress =
      mode === "manual" ? manualProgressRef.current : scroll.offset;

    if (mode === "manual") {
      const stage = manualStageRef.current;
      for (const tool of ["sieve", "kettle", "chasen"] as ManualTool[]) {
        const targetY = getTargetY(tool, stage);
        const currentPos = manualPositionsRef.current[tool];
        const currentY = currentPos[1];
        const nextY = mix(currentY, targetY, 0.15);
        manualPositionsRef.current[tool] = [currentPos[0], nextY, currentPos[2]] as unknown as Tuple3;
      }
    }

    if (mode === "manual") {
      const topCamera = new Vector3(0.11, mobile ? 9.2 : 8.2, 0.02);
      camera.up.set(1, 0, 0);
      camera.position.lerp(topCamera, 0.12);
      (camera as PerspectiveCamera).lookAt(0.11, -0.5, 0);
    } else {
      camera.up.set(0, 1, 0);
      const stepFloat = progress * 5;
      const low = Math.floor(stepFloat);
      const high = Math.min(5, low + 1);
      const local = smoothstep(stepFloat - low);
      const camFrom = cameraTargets[Math.min(5, low)];
      const camTo = cameraTargets[high];
      const targetCamera = camFrom.clone().lerp(camTo, local);

      if (mobile) {
        targetCamera.z += 0.8;
        targetCamera.y += 0.35;
        targetCamera.x = targetCamera.x * 1.2;
        targetCamera.y = 1.25 + (targetCamera.y - 1.25) * 1.2;
        targetCamera.z = targetCamera.z * 1.2;
      }

      camera.position.lerp(targetCamera, 0.07);
      (camera as PerspectiveCamera).lookAt(0, 1.25, 0);
    }

    const bowlSpin = progress * Math.PI * 1.72;
    if (bowlRef.current) {
      bowlRef.current.rotation.y =
        mode === "manual"
          ? Math.sin(clock.elapsedTime * 0.25) * 0.02
          : bowlSpin + Math.sin(clock.elapsedTime * 0.35) * 0.08;
      bowlRef.current.position.y =
        mode === "manual"
          ? Math.sin(clock.elapsedTime * 0.7) * 0.006
          : gsapState.current.lift + Math.sin(clock.elapsedTime * 0.7) * 0.014;
      const finale = smoothstep(range(progress, 0.82, 1));
      bowlRef.current.position.x = mix(0.11, 0.11, finale);
      bowlRef.current.scale.setScalar(mix(1, 1.08, finale));
    }

    if (sieveRef.current) {
      if (mode === "manual") {
        const stage = manualStageRef.current;
        const manualPosition = manualPositionsRef.current.sieve;
        const shakeActive = stage === "sieve-shaking" ? 1 : 0;
        const rollX = Math.sin(clock.elapsedTime * 18) * 0.04 * shakeActive;
        const shakeX = Math.sin(clock.elapsedTime * 24) * 0.035 * shakeActive;
        const isUsePosition =
          stage === "sieve-ready" ||
          stage === "sieve-shaking" ||
          isNearBowl(manualPosition);

        if (stage === "sieve-shaking") {
          sieveRef.current.position.set(
            sieveUse.position[0] + shakeX,
            sieveUse.position[1],
            sieveUse.position[2],
          );
        } else {
          sieveRef.current.position.set(...manualPosition);
        }
        sieveRef.current.rotation.order = "YXZ";
        sieveRef.current.rotation.set(
          rollX,
          isUsePosition ? sieveUse.rotationY : sieveIdle.rotationY,
          0,
        );
      } else {
        const enter = smoothstep(range(progress, 0.08, 0.19));
        const leave = smoothstep(range(progress, 0.41, 0.49));
        const active = enter * (1 - leave);
        const shakeActive =
          smoothstep(range(progress, 0.19, 0.22)) *
          (1 - smoothstep(range(progress, 0.35, 0.38)));
        const rollX = Math.sin(clock.elapsedTime * 14) * 0.0175 * shakeActive;
        sieveRef.current.position.set(
          ...mixTuple3(sieveIdle.position, sieveUse.position, active),
        );
        sieveRef.current.rotation.order = "YXZ";
        sieveRef.current.rotation.set(
          rollX,
          mix(sieveIdle.rotationY, sieveUse.rotationY, active),
          0,
        );
      }
    }

    if (kettleRef.current) {
      if (mode === "manual") {
        const stage = manualStageRef.current;
        const isUsePosition =
          stage === "kettle-ready" ||
          stage === "pouring" ||
          isNearBowl(manualPositionsRef.current.kettle, 1.8);
        kettleRef.current.position.set(...manualPositionsRef.current.kettle);
        kettleRef.current.rotation.set(
          ...(isUsePosition ? kettleUse.rotation : kettleIdle.rotation),
        );
      } else {
        const enter = smoothstep(range(progress, 0.38, 0.48));
        const leave = smoothstep(range(progress, 0.65, 0.73));
        const active = enter * (1 - leave);
        kettleRef.current.position.set(
          ...mixTuple3(kettleIdle.position, kettleUse.position, active),
        );
        kettleRef.current.rotation.set(
          ...mixTuple3(kettleIdle.rotation, kettleUse.rotation, active),
        );
      }
    }

    if (chasenRef.current) {
      if (mode === "manual") {
        const stage = manualStageRef.current;
        if (stage === "whisking" || stage === "done") {
          const whiskStrength =
            stage === "done"
              ? 0
              : smoothstep(Math.min(1, whiskStateRef.current.count / 30));
          const [wPathX, wPathZ] = sampleChasenW(clock.elapsedTime);
          const wMotionX = wPathX * Math.max(0.4, whiskStrength);
          const wMotionZ = wPathZ * Math.max(0.4, whiskStrength);
          chasenRef.current.position.set(
            chasenUse.position[0] + wMotionX,
            chasenUse.position[1],
            chasenUse.position[2] + wMotionZ,
          );
          chasenRef.current.rotation.set(
            chasenUse.rotation[0],
            0,
            wMotionX * 0.35,
          );
        } else {
          const isUsePosition = isNearBowl(manualPositionsRef.current.chasen);
          chasenRef.current.position.set(...manualPositionsRef.current.chasen);
          chasenRef.current.rotation.set(
            ...(isUsePosition ? chasenUse.rotation : chasenIdle.rotation),
          );
        }
      } else {
        const whiskIn = smoothstep(range(progress, 0.76, 0.78));
        const whiskOut = 1 - smoothstep(range(progress, 0.87, 0.89));
        const whisk = whiskIn * whiskOut;
        const [wPathX, wPathZ] = sampleChasenW(clock.elapsedTime);
        const wMotionX = wPathX * whisk;
        const wMotionZ = wPathZ * whisk;

        let active = 0;
        if (progress < 0.88) {
          if (progress <= 0.48) {
            active = 0;
          } else if (progress <= 0.54) {
            const t = (progress - 0.48) / (0.54 - 0.48);
            active = smoothstep(t) * 0.33;
          } else if (progress <= 0.66) {
            active = 0.33;
          } else if (progress <= 0.71) {
            const t = (progress - 0.66) / (0.71 - 0.66);
            active = 0.33 + smoothstep(t) * 0.34;
          } else if (progress <= 0.73) {
            active = 0.67;
          } else if (progress <= 0.77) {
            const t = (progress - 0.73) / (0.77 - 0.73);
            active = 0.67 + smoothstep(t) * 0.33;
          } else {
            active = 1.0;
          }
        } else {
          const t = Math.min(1, Math.max(0, (progress - 0.88) / (0.96 - 0.88)));
          active = 1.0 - smoothstep(t);
        }

        const chasenUsePosition: Tuple3 = [
          chasenUse.position[0] + wMotionX,
          chasenUse.position[1],
          chasenUse.position[2] + wMotionZ,
        ];
        const chasenUseRotation: Tuple3 = [
          chasenUse.rotation[0],
          0,
          wMotionX * 0.35,
        ];

        let chasenPos: Tuple3;
        const Y_high = 1.5;
        const p1 = chasenIdle.position;
        const p2: Tuple3 = [p1[0], Y_high, p1[2]];
        const p3: Tuple3 = [
          chasenUse.position[0],
          Y_high,
          chasenUse.position[2],
        ];
        const p4 = chasenUsePosition;

        if (active <= 0.33) {
          chasenPos = mixTuple3(
            p1,
            p2,
            Math.max(0, Math.min(1, active / 0.33)),
          );
        } else if (active <= 0.67) {
          chasenPos = mixTuple3(
            p2,
            p3,
            Math.max(0, Math.min(1, (active - 0.33) / 0.34)),
          );
        } else {
          chasenPos = mixTuple3(
            p3,
            p4,
            Math.max(0, Math.min(1, (active - 0.67) / 0.33)),
          );
        }

        chasenRef.current.position.set(...chasenPos);
        chasenRef.current.rotation.set(
          ...mixTuple3(chasenIdle.rotation, chasenUseRotation, active),
        );
      }
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity = mix(1.6, 2.4, gsapState.current.glow);
      keyLightRef.current.position.x = mix(0, 0, gsapState.current.glow);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#f8f4ec" />
      <directionalLight
        ref={keyLightRef}
        castShadow
        position={[0, 7, 0]}
        intensity={1.6}
        color="#fff8ee"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <directionalLight position={[3, 5, -3]} intensity={0.3} color="#e8dcc8" />
      <directionalLight
        position={[-1, 2, 6]}
        intensity={0.2}
        color="#dce8d0"
      />
      <pointLight
        position={[0, 3.5, 1.5]}
        intensity={0.15}
        color="#d8e7b6"
        distance={10}
        decay={2}
      />
      <Environment preset="apartment" environmentIntensity={0.4} />

      <Model
        src={asset("models/room.glb")}
        position={[-4.26, -5.675, 1.25]}
        scale={5}
        keepOriginalMaterials
      />

      <group position={[0, supportSurfaceY, 0]}>
        <Model
          src={asset("models/tea-tray.glb")}
          position={teaTrayPosition as [number, number, number]}
          rotation={[0, Math.PI / 2, 0]}
          keepOriginalMaterials
        />
      </group>

      <Float speed={0.75} rotationIntensity={0.08} floatIntensity={0.08}>
        <group ref={bowlRef} position={[0.11, 0, 0]}>
          <Model
            src={asset("models/tea-bowl.glb")}
            scale={0.4}
            rotation={[0, 0, 0]}
            position={[0, -0.2, 0]}
          />
          <FoamSurface
            textureSrc={asset("textures/matcha-surface.png")}
            bowlSrc={asset("models/tea-bowl.glb")}
            progressRef={mode === "manual" ? manualProgressRef : undefined}
          />
          <WaterFill
            bowlSrc={asset("models/tea-bowl.glb")}
            progressRef={mode === "manual" ? manualProgressRef : undefined}
          />

          <mesh visible={false} position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.35, 0.25, 0.3, 16]} />
            <meshBasicMaterial />
          </mesh>
        </group>
      </Float>

      <group position={[0.11, 0, 0]}>
        <PowderParticles
          count={20000}
          mobile={mobile}
          progressRef={mode === "manual" ? manualProgressRef : undefined}
        />
      </group>

      <group
        ref={sieveRef}
        position={sieveIdle.position as [number, number, number]}
        {...manualHandlers("sieve")}
      >
        {mode === "manual" && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.25, 0.32, 1.25]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <Model
          src={asset("models/sieve.glb")}
          scale={14}
          keepOriginalMaterials
        />
      </group>

      <group
        ref={kettleRef}
        position={kettleIdle.position as [number, number, number]}
        {...manualHandlers("kettle")}
      >
        {mode === "manual" && (
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.3, 0.9, 1.3]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <Model src={asset("models/kettle.glb")} scale={0.1} />
      </group>

      <WaterStream
        mobile={mobile}
        kettleRef={kettleRef}
        progressRef={mode === "manual" ? manualProgressRef : undefined}
      />

      <group
        ref={chasenRef}
        position={chasenIdle.position as [number, number, number]}
        {...manualHandlers("chasen")}
      >
        {mode === "manual" && (
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.75, 1.15, 0.75]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <Model
          src={asset("models/chasen.glb")}
          scale={13}
          rotation={[Math.PI, 0, 0]}
        />
      </group>
    </>
  );
}
