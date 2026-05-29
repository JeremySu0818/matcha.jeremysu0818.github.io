import { useEffect, useMemo, useRef } from 'react';
import { ContactShadows, Environment, Float, Html, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DirectionalLight,
  Group,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { mix, range, smoothstep } from '../../utils/easing';
import { FoamSurface } from './FoamSurface';
import { Model } from './Model';
import { PowderParticles } from './PowderParticles';
import { WaterStream } from './WaterStream';

gsap.registerPlugin(ScrollTrigger);

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const supportSurfaceY = -1.36;

const cameraTargets = [
  new Vector3(0, 6.6, 3.15),
  new Vector3(0.16, 5.8, 2.72),
  new Vector3(-0.42, 5.45, 2.52),
  new Vector3(0.38, 5.28, 2.35),
  new Vector3(-0.18, 4.92, 2.04),
  new Vector3(0, 5.55, 2.55),
];

export function MatchaScene() {
  const mobile = useMediaQuery('(max-width: 720px)');
  const scroll = useScroll();
  const { camera } = useThree();
  const bowlRef = useRef<Group>(null);
  const sieveRef = useRef<Group>(null);
  const kettleRef = useRef<Group>(null);
  const chasenRef = useRef<Group>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const gsapState = useRef({ glow: 0, lift: 0 });
  const woodTexture = useTexture(asset('textures/wood-tray.png'));

  const tabletopMaterial = useMemo(() => {
    const texture = woodTexture.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(3.5, 3.5);
    texture.needsUpdate = true;

    return new MeshPhysicalMaterial({
      map: texture,
      color: '#dfc8a8',
      roughness: 0.72,
      clearcoat: 0.06,
      clearcoatRoughness: 0.7,
      envMapIntensity: 0.5,
    });
  }, [woodTexture]);

  useEffect(() => {
    const target = gsapState.current;
    const intro = gsap.to(target, {
      lift: 0.18,
      glow: 0.45,
      ease: 'none',
      scrollTrigger: {
        trigger: scroll.el,
        scroller: scroll.el,
        start: 'top top',
        end: '18% top',
        scrub: 1,
      },
    });

    const finish = gsap.to(target, {
      glow: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: scroll.el,
        scroller: scroll.el,
        start: '78% top',
        end: '100% bottom',
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
    }

    camera.position.lerp(targetCamera, 0.07);
    (camera as PerspectiveCamera).lookAt(0, 0.38, 0);

    const bowlSpin = progress * Math.PI * 1.72;
    if (bowlRef.current) {
      bowlRef.current.rotation.y = bowlSpin + Math.sin(clock.elapsedTime * 0.35) * 0.08;
      bowlRef.current.position.y = gsapState.current.lift + Math.sin(clock.elapsedTime * 0.7) * 0.014;
      const finale = smoothstep(range(progress, 0.82, 1));
      bowlRef.current.position.x = mix(0, 0, finale);
      bowlRef.current.scale.setScalar(mix(1, 1.08, finale));
    }

    if (sieveRef.current) {
      const enter = smoothstep(range(progress, 0.28, 0.39));
      const leave = smoothstep(range(progress, 0.42, 0.5));
      sieveRef.current.visible = enter > 0.02 && leave < 0.98;
      sieveRef.current.position.set(mix(-2.2, -0.05, enter) + leave * 1.6, 1.82, 0.12);
      sieveRef.current.rotation.set(-0.34, 0.18 + enter * 0.25, -0.1 + Math.sin(clock.elapsedTime * 18) * 0.012 * enter);
    }

    if (kettleRef.current) {
      const enter = smoothstep(range(progress, 0.42, 0.52));
      const leave = smoothstep(range(progress, 0.6, 0.7));
      kettleRef.current.visible = enter > 0.02 && leave < 0.99;
      kettleRef.current.position.set(mix(3.5, 1.42, enter) + leave * 2.3, mix(2.9, 2.15, enter), -0.22);
      kettleRef.current.rotation.set(0.12, -0.35, mix(-0.1, -0.7, enter) + leave * 0.28);
    }

    if (chasenRef.current) {
      const enter = smoothstep(range(progress, 0.58, 0.68));
      const whisk = smoothstep(range(progress, 0.66, 0.82));
      const leave = smoothstep(range(progress, 0.82, 0.92));
      const wMotion = Math.sin(clock.elapsedTime * (mobile ? 12 : 18)) * (mobile ? 0.13 : 0.22) * whisk;
      chasenRef.current.visible = enter > 0.02 && leave < 0.99;
      chasenRef.current.position.set(wMotion - leave * 1.2, mix(2.7, 0.98, enter) + leave * 1.4, 0.08);
      chasenRef.current.rotation.set(mix(0.25, -0.08, enter), 0, wMotion * 0.35);
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity = mix(2.4, 3.6, gsapState.current.glow);
      keyLightRef.current.position.x = mix(-4, -2.4, gsapState.current.glow);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#f8f4ec" />
      <directionalLight
        ref={keyLightRef}
        castShadow
        position={[-4, 7, 5]}
        intensity={2.4}
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
      <directionalLight position={[3, 5, -3]} intensity={0.5} color="#e8dcc8" />
      <directionalLight position={[-1, 2, 6]} intensity={0.35} color="#dce8d0" />
      <pointLight position={[0, 3.5, 1.5]} intensity={0.25} color="#d8e7b6" distance={10} decay={2} />
      <Environment preset="apartment" environmentIntensity={0.65} />

      <group position={[0, supportSurfaceY, 0]}>
        <Model
          src={asset('models/tea-tray.glb')}
          position={[0, 0.02, 0]}
          keepOriginalMaterials
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.055, 0]}
          receiveShadow
          material={tabletopMaterial}
        >
          <planeGeometry args={[11, 11, 42, 42]} />
        </mesh>
        <ContactShadows
          position={[0, -0.05, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={4}
          color="#3a2f20"
        />
      </group>

      <Float speed={0.75} rotationIntensity={0.08} floatIntensity={0.08}>
        <group ref={bowlRef}>
          <Model src={asset('models/tea-bowl-new.glb')} scale={0.4} rotation={[0, 0, 0]} position={[0, -0.2, 0]} />
          <FoamSurface progress={scroll.offset} textureUrl={asset('textures/matcha-foam.png')} />
          <Html
            transform
            occlude
            position={[1.38, 0.98, 0]}
            className="hidden select-none rounded-md border border-matcha-deep/8 bg-white/45 px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-matcha-deep/55 shadow-glass backdrop-blur-xl sm:block"
          >
            75 C micro foam
          </Html>
        </group>
      </Float>

      <PowderParticles progress={scroll.offset} count={mobile ? 170 : 460} />

      <group ref={sieveRef} visible={false}>
        <Model src={asset('models/sieve.glb')} scale={14} keepOriginalMaterials />
      </group>

      <group ref={kettleRef} visible={false}>
        <Model src={asset('models/kettle.glb')} scale={0.82} />
      </group>

      <WaterStream progress={scroll.offset} mobile={mobile} />

      <group ref={chasenRef} visible={false}>
        <Model src={asset('models/chasen-new.glb')} scale={13} rotation={[Math.PI, 0, 0]} />
      </group>
    </>
  );
}
