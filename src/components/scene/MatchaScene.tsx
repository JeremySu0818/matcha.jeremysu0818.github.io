import { useEffect, useMemo, useRef } from "react";
import { Environment, Float, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DirectionalLight,
  Group,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Vector3,
} from "three";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { asset } from "../../utils/assets";
import { mix, range, smoothstep } from "../../utils/easing";
import { mixTuple3, type Tuple3 } from "../../utils/threeTransforms";
import { FoamSurface } from "./FoamSurface";
import { Model } from "./Model";
import { PowderParticles } from "./PowderParticles";
import { WaterFill } from "./WaterFill";
import { WaterStream } from "./WaterStream";

gsap.registerPlugin(ScrollTrigger);

const supportSurfaceY = -1.36;
const teaTrayPosition: Tuple3 = [0.5, 0.02, 0];
const teaTrayTopY = supportSurfaceY + teaTrayPosition[1] + 0.1;

const sieveIdle = {
  position: [
    teaTrayPosition[0],
    teaTrayTopY + 0.3895,
    teaTrayPosition[2] - 2.5,
  ] as Tuple3,
  rotationY: 0.18 + (80 * Math.PI) / 180 + Math.PI / 2,
};

const sieveUse = {
  position: [-0.05, 1.82, 0.12] as Tuple3,
  rotationY: 0.43 + (80 * Math.PI) / 180,
};

const kettleIdle = {
  position: [
    teaTrayPosition[0],
    teaTrayTopY + 0.02,
    teaTrayPosition[2] + 3,
  ] as Tuple3,
  rotation: [0, -1.285, 0] as Tuple3,
};

const kettleUse = {
  position: [0.029, 1.107, 1.663] as Tuple3,
  rotation: [0.3, -1.285, 0.72] as Tuple3,
};

const chasenIdle = {
  position: [-1, teaTrayTopY + 0.2515, teaTrayPosition[2] + 3] as Tuple3,
  rotation: [0.25, 0, 0] as Tuple3,
};

const chasenUse = {
  position: [0, 0.02, -0.07] as Tuple3,
  rotation: [-0.08, 0, 0] as Tuple3,
};

const chasenWPoints = [
  [-1, 1],
  [-0.5, -1],
  [0, 1],
  [0.5, -1],
  [1, 1],
] as const;

function sampleChasenW(elapsedTime: number): [number, number] {
  const segmentCount = (chasenWPoints.length - 1) * 2;
  const phase = (elapsedTime * 10.8) % segmentCount;
  const segment = Math.floor(phase);
  const forward = segment < chasenWPoints.length - 1;
  const fromIndex = forward ? segment : segmentCount - segment;
  const toIndex = forward ? fromIndex + 1 : fromIndex - 1;
  const local = smoothstep(phase - segment);
  const from = chasenWPoints[fromIndex];
  const to = chasenWPoints[toIndex];

  const pathX = mix(from[0], to[0], local);
  const pathZ = mix(from[1], to[1], local);

  return [-pathZ * 0.1596, pathX * 0.2926];
}

const baseCameraTargets = [
  new Vector3(0, 6.6, 3.15),
  new Vector3(0.16, 5.8, 2.72),
  new Vector3(-0.42, 5.45, 2.52),
  new Vector3(0.38, 5.28, 2.35),
  new Vector3(-0.18, 4.92, 2.04),
  new Vector3(0, 5.55, 2.55),
];

const cameraTargets = baseCameraTargets.map((v) => {
  const vZoomed = v.clone().multiplyScalar(2.3);
  vZoomed.y *= 0.32;
  return new Vector3(-vZoomed.z, vZoomed.y, vZoomed.x);
});

export function MatchaScene() {
  const mobile = useMediaQuery("(max-width: 720px)");
  const scroll = useScroll();
  const { camera } = useThree();
  const bowlRef = useRef<Group>(null);
  const sieveRef = useRef<Group>(null);
  const kettleRef = useRef<Group>(null);
  const chasenRef = useRef<Group>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const gsapState = useRef({ glow: 0, lift: 0 });
  const tabletopMaterial = useMemo(() => {
    return new MeshPhysicalMaterial({
      color: "#dfc8a8",
      roughness: 0.72,
      clearcoat: 0.06,
      clearcoatRoughness: 0.7,
      envMapIntensity: 0.5,
    });
  }, []);

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

  useFrame(({ clock }) => {
    const progress = scroll.offset;
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

    const bowlSpin = progress * Math.PI * 1.72;
    if (bowlRef.current) {
      bowlRef.current.rotation.y =
        bowlSpin + Math.sin(clock.elapsedTime * 0.35) * 0.08;
      bowlRef.current.position.y =
        gsapState.current.lift + Math.sin(clock.elapsedTime * 0.7) * 0.014;
      const finale = smoothstep(range(progress, 0.82, 1));
      bowlRef.current.position.x = mix(0, 0, finale);
      bowlRef.current.scale.setScalar(mix(1, 1.08, finale));
    }

    if (sieveRef.current) {
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

    if (kettleRef.current) {
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

    if (chasenRef.current) {
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
      const p3: Tuple3 = [chasenUse.position[0], Y_high, chasenUse.position[2]];
      const p4 = chasenUsePosition;

      if (active <= 0.33) {
        chasenPos = mixTuple3(p1, p2, Math.max(0, Math.min(1, active / 0.33)));
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
        <group ref={bowlRef}>
          <Model
            src={asset("models/tea-bowl.glb")}
            scale={0.4}
            rotation={[0, 0, 0]}
            position={[0, -0.2, 0]}
          />
          <FoamSurface
            textureSrc={asset("textures/matcha-surface.png")}
            bowlSrc={asset("models/tea-bowl.glb")}
          />
          <WaterFill bowlSrc={asset("models/tea-bowl.glb")} />

          <mesh visible={false} position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.35, 0.25, 0.3, 16]} />
            <meshBasicMaterial />
          </mesh>
        </group>
      </Float>

      <PowderParticles count={20000} mobile={mobile} />

      <group
        ref={sieveRef}
        position={sieveIdle.position as [number, number, number]}
      >
        <Model
          src={asset("models/sieve.glb")}
          scale={14}
          keepOriginalMaterials
        />
      </group>

      <group
        ref={kettleRef}
        position={kettleIdle.position as [number, number, number]}
      >
        <Model src={asset("models/kettle.glb")} scale={0.1} />
      </group>

      <WaterStream mobile={mobile} kettleRef={kettleRef} />

      <group
        ref={chasenRef}
        position={chasenIdle.position as [number, number, number]}
      >
        <Model
          src={asset("models/chasen.glb")}
          scale={13}
          rotation={[Math.PI, 0, 0]}
        />
      </group>
    </>
  );
}
