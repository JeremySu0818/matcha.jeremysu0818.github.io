import { useMemo, useRef } from "react";
import type { JSX } from "react";
import { useThree } from "@react-three/fiber";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getManualIdlePositions } from "./manualRitual";
import { RitualSceneObjects } from "./RitualSceneObjects";
import { SceneLighting } from "./SceneLighting";
import { useManualRitual } from "./useManualRitual";
import { useSceneFrame } from "./useSceneFrame";
import type { ManualStage } from "./manualRitual";
import type { SceneMode } from "../../app/sceneMode";
import type { DirectionalLight, Group } from "three";

export type { ManualStage } from "./manualRitual";

interface MatchaSceneProps {
  readonly mode?: SceneMode;
  readonly onManualComplete?: () => void;
  readonly onManualStageChange?: (stage: ManualStage) => void;
  readonly onManualStepChange?: (step: number) => void;
  readonly resetToken?: number;
}

export function MatchaScene({
  mode = "manual",
  onManualComplete,
  onManualStageChange,
  onManualStepChange,
  resetToken = 0,
}: MatchaSceneProps): JSX.Element {
  const mobile = useMediaQuery("(max-width: 720px)");
  const { camera, gl, raycaster } = useThree();
  const bowlRef = useRef<Group>(null);
  const sieveRef = useRef<Group>(null);
  const kettleRef = useRef<Group>(null);
  const chasenRef = useRef<Group>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const idlePositions = useMemo(
    () => getManualIdlePositions(mobile, mode),
    [mobile, mode],
  );
  const toolRefs = useMemo(
    () => ({ chasen: chasenRef, kettle: kettleRef, sieve: sieveRef }),
    [],
  );
  const sceneRefs = useMemo(
    () => ({
      bowl: bowlRef,
      chasen: chasenRef,
      kettle: kettleRef,
      keyLight: keyLightRef,
      sieve: sieveRef,
    }),
    [],
  );
  const manual = useManualRitual({
    camera,
    canvas: gl.domElement,
    idlePositions,
    mobile,
    mode,
    onComplete: onManualComplete,
    onStageChange: onManualStageChange,
    onStepChange: onManualStepChange,
    raycaster,
    resetToken,
    toolRefs,
  });

  useSceneFrame({
    camera,
    idlePositions,
    manual,
    mobile,
    mode,
    refs: sceneRefs,
  });

  return (
    <>
      <SceneLighting keyLightRef={keyLightRef} />
      <RitualSceneObjects
        bowlRef={bowlRef}
        chasenRef={chasenRef}
        idlePositions={idlePositions}
        kettleRef={kettleRef}
        manual={manual}
        mobile={mobile}
        mode={mode}
        sieveRef={sieveRef}
      />
    </>
  );
}
