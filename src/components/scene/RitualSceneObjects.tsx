import type { RefObject, JSX  } from "react";
import { Float } from "@react-three/drei";
import { asset } from "../../utils/assets";
import { POWDER_PARTICLE_CONFIG } from "./config/effects";
import { RITUAL_LAYOUT_CONFIG } from "./config/ritual";
import { FoamSurface } from "./FoamSurface";
import { Model } from "./Model";
import { PowderParticles } from "./PowderParticles";
import { WaterFill } from "./WaterFill";
import { WaterStream } from "./WaterStream";
import type { ManualRitualController } from "./useManualRitual";
import type { SceneMode } from "../../app/sceneMode";
import type { Group } from "three";

interface RitualSceneObjectsProps {
  readonly bowlRef: RefObject<Group | null>;
  readonly chasenRef: RefObject<Group | null>;
  readonly idlePositions: {
    readonly chasen: readonly [number, number, number];
    readonly kettle: readonly [number, number, number];
    readonly sieve: readonly [number, number, number];
  };
  readonly kettleRef: RefObject<Group | null>;
  readonly manual: ManualRitualController;
  readonly mobile: boolean;
  readonly mode: SceneMode;
  readonly sieveRef: RefObject<Group | null>;
}

export function RitualSceneObjects({
  bowlRef,
  chasenRef,
  idlePositions,
  kettleRef,
  manual,
  mobile,
  mode,
  sieveRef,
}: RitualSceneObjectsProps): JSX.Element {
  const layout = RITUAL_LAYOUT_CONFIG;
  const manualProgressRef = mode === "manual" ? manual.progressRef : undefined;
  const sieveHandlers = manual.getToolHandlers("sieve");
  const kettleHandlers = manual.getToolHandlers("kettle");
  const chasenHandlers = manual.getToolHandlers("chasen");
  return (
    <>
      <Model
        src={asset("models/room.glb")}
        position={[...layout.room.positionWorld]}
        scale={layout.room.scaleRatio}
        keepOriginalMaterials
      />

      <group position={[0, layout.supportSurfaceYWorld, 0]}>
        <Model
          src={asset("models/tea-tray.glb")}
          position={[...layout.teaTray.positionWorld]}
          rotation={[...layout.teaTray.rotationRadians]}
          keepOriginalMaterials
        />
      </group>

      <Float
        speed={layout.bowl.float.speed}
        rotationIntensity={layout.bowl.float.rotationIntensity}
        floatIntensity={layout.bowl.float.floatIntensity}
      >
        <group ref={bowlRef} position={[...layout.bowl.groupPositionWorld]}>
          <Model
            src={asset("models/tea-bowl.glb")}
            scale={layout.bowl.modelScaleRatio}
            rotation={[0, 0, 0]}
            position={[...layout.bowl.modelPositionWorld]}
          />
          <FoamSurface
            textureSrc={asset("textures/matcha-surface.png")}
            bowlSrc={asset("models/tea-bowl.glb")}
            progressRef={manualProgressRef}
            chasenRef={chasenRef}
          />
          <WaterFill
            bowlSrc={asset("models/tea-bowl.glb")}
            progressRef={manualProgressRef}
          />
          <mesh
            visible={false}
            position={[...layout.bowl.interactionCollider.positionWorld]}
          >
            <cylinderGeometry
              args={[
                layout.bowl.interactionCollider.radiusTopWorld,
                layout.bowl.interactionCollider.radiusBottomWorld,
                layout.bowl.interactionCollider.heightWorld,
                layout.bowl.interactionCollider.radialSegments,
              ]}
            />
            <meshBasicMaterial />
          </mesh>
        </group>
      </Float>

      <group position={[...layout.powderOriginWorld]}>
        <PowderParticles
          count={POWDER_PARTICLE_CONFIG.count}
          mobile={mobile}
          progressRef={manualProgressRef}
          bowlRef={bowlRef}
        />
      </group>

      <group
        ref={sieveRef}
        position={[...idlePositions.sieve]}
        {...sieveHandlers}
      >
        {mode === "manual" && (
          <mesh position={[...layout.sieve.hitBoxPositionWorld]}>
            <boxGeometry args={[...layout.sieve.hitBoxSizeWorld]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <Model
          src={asset("models/sieve.glb")}
          scale={layout.sieve.modelScaleRatio}
          keepOriginalMaterials
        />
      </group>

      <group
        ref={kettleRef}
        position={[...idlePositions.kettle]}
        {...kettleHandlers}
      >
        {mode === "manual" && (
          <mesh position={[...layout.kettle.hitBoxPositionWorld]}>
            <boxGeometry args={[...layout.kettle.hitBoxSizeWorld]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <Model
          src={asset("models/kettle.glb")}
          scale={layout.kettle.modelScaleRatio}
        />
      </group>

      <WaterStream kettleRef={kettleRef} progressRef={manualProgressRef} />

      <group
        ref={chasenRef}
        position={[...idlePositions.chasen]}
        {...chasenHandlers}
      >
        {mode === "manual" && (
          <mesh position={[...layout.chasen.hitBoxPositionWorld]}>
            <boxGeometry args={[...layout.chasen.hitBoxSizeWorld]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        <Model
          src={asset("models/chasen.glb")}
          scale={layout.chasen.modelScaleRatio}
          rotation={[...layout.chasen.modelRotationRadians]}
        />
      </group>
    </>
  );
}
