import type { JSX, RefObject } from "react";
import { Environment } from "@react-three/drei";
import { SCENE_LIGHTING_CONFIG } from "./config/lighting";
import type { DirectionalLight } from "three";

interface SceneLightingProps {
  readonly keyLightRef: RefObject<DirectionalLight | null>;
}

export function SceneLighting({ keyLightRef }: SceneLightingProps): JSX.Element {
  const { ambient, environment, fill, key, point, rim } =
    SCENE_LIGHTING_CONFIG;
  return (
    <>
      <ambientLight intensity={ambient.intensity} color={ambient.color} />
      <directionalLight
        ref={keyLightRef}
        castShadow
        position={key.positionWorld}
        intensity={key.startIntensity}
        color={key.color}
        shadow-mapSize-width={key.shadow.mapSizePixels}
        shadow-mapSize-height={key.shadow.mapSizePixels}
        shadow-bias={key.shadow.bias}
        shadow-normalBias={key.shadow.normalBias}
        shadow-camera-left={key.shadow.leftWorld}
        shadow-camera-right={key.shadow.rightWorld}
        shadow-camera-top={key.shadow.topWorld}
        shadow-camera-bottom={key.shadow.bottomWorld}
        shadow-camera-near={key.shadow.nearWorld}
        shadow-camera-far={key.shadow.farWorld}
      />
      <directionalLight
        position={fill.positionWorld}
        intensity={fill.intensity}
        color={fill.color}
      />
      <directionalLight
        position={rim.positionWorld}
        intensity={rim.intensity}
        color={rim.color}
      />
      <pointLight
        position={point.positionWorld}
        intensity={point.intensity}
        color={point.color}
        distance={point.distanceWorld}
        decay={point.decay}
      />
      <Environment
        preset={environment.preset}
        environmentIntensity={environment.intensity}
      />
    </>
  );
}
