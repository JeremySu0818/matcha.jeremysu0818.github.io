import { useEffect, useMemo, useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SceneFrameRuntime,
  type SceneObjectRefs,
} from "./sceneFrameRuntime";
import type { ManualToolPositions } from "./manualRitual";
import type { ManualRitualController } from "./useManualRitual";
import type { SceneMode } from "../../app/sceneMode";
import type { Camera } from "three";

gsap.registerPlugin(ScrollTrigger);

interface UseSceneFrameOptions {
  readonly camera: Camera;
  readonly idlePositions: ManualToolPositions;
  readonly manual: ManualRitualController;
  readonly mobile: boolean;
  readonly mode: SceneMode;
  readonly refs: SceneObjectRefs;
}

interface GsapSceneState {
  glow: number;
  lift: number;
}

export function useSceneFrame({
  camera,
  idlePositions,
  manual,
  mobile,
  mode,
  refs,
}: UseSceneFrameOptions): void {
  const scroll = useScroll();
  const gsapStateRef = useRef<GsapSceneState>({ glow: 0, lift: 0 });
  const runtime = useMemo(() => new SceneFrameRuntime(refs), [refs]);

  useEffect(() => {
    const target = gsapStateRef.current;
    const intro = gsap.to(target, {
      ease: "none",
      glow: 0.45,
      lift: 0.18,
      scrollTrigger: {
        end: "18% top",
        scroller: scroll.el,
        scrub: 1,
        start: "top top",
        trigger: scroll.el,
      },
    });
    const finish = gsap.to(target, {
      ease: "none",
      glow: 1,
      scrollTrigger: {
        end: "100% bottom",
        scroller: scroll.el,
        scrub: 1,
        start: "78% top",
        trigger: scroll.el,
      },
    });
    return () => {
      intro.kill();
      finish.kill();
    };
  }, [scroll.el]);

  useFrame(({ clock }) => {
    const progress =
      mode === "manual" ? manual.progressRef.current : scroll.offset;
    runtime.update({
      camera,
      elapsedSeconds: clock.elapsedTime,
      glow: gsapStateRef.current.glow,
      idlePositions,
      lift: gsapStateRef.current.lift,
      manual,
      mobile,
      mode,
      progress,
    });
  });
}
