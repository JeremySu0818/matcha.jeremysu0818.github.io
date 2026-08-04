import {
  useEffect,
  useMemo,
  useRef,
  type JSX,
  type RefObject,
} from "react";
import { useGLTF, useScroll, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CanvasTexture,
  type CircleGeometry,
  Color,
  DoubleSide,
  type Group,
  LinearFilter,
  type Mesh,
  type ShapeGeometry,
  type ShaderMaterial,
  Vector3,
} from "three";
import { mix, range, smoothstep } from "../../utils/easing";
import { glslFloat } from "../../utils/glsl";
import { createBowlCrossSectionGeometry } from "./bowlCrossSectionGeometry";
import { FOAM_SURFACE_CONFIG } from "./config/liquids";
import { MatchaTextureDeformer } from "./matchaFluid";

interface FoamSurfaceProps {
  textureSrc: string;
  bowlSrc: string;
  progressRef?: RefObject<number>;
  chasenRef?: RefObject<Group | null>;
}

const vertexShader = `
  precision mediump float;
  varying vec2 vSurface;

  void main() {
    vSurface = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform float uImageSize;
  varying vec2 vSurface;

  void main() {
    vec2 oversizedUv = vSurface / uImageSize + vec2(${glslFloat(FOAM_SURFACE_CONFIG.material.shaderUvCenter)});
    vec4 texel = texture2D(uTexture, oversizedUv);
    vec3 color = mix(texel.rgb, texel.rgb * uTint, ${glslFloat(FOAM_SURFACE_CONFIG.material.shaderTintBlendRatio)});
    float alpha = texel.a * uOpacity;

    if (alpha < ${glslFloat(FOAM_SURFACE_CONFIG.material.discardOpacityThreshold)}) {
      discard;
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

function createInnerWallSectionGeometry(
  bowlScene: Group,
): CircleGeometry | ShapeGeometry {
  const config = FOAM_SURFACE_CONFIG.geometry;
  return createBowlCrossSectionGeometry(bowlScene, {
    bowlModelYWorld: config.bowlModelYWorld,
    bowlScaleRatio: config.bowlScaleRatio,
    fallback: {
      kind: "circle",
      radiusWorld: config.fallbackRadiusWorld,
      segments: config.fallbackSegments,
    },
    insetRatio: config.insetRatio,
    radialBins: config.radialBins,
    sampleBandWorld: config.sampleBandWorld,
    sectionYWorld: config.surfaceYWorld,
    smoothingRadiusBins: config.smoothingRadiusBins,
  });
}

export function FoamSurface({
  textureSrc,
  bowlSrc,
  progressRef,
  chasenRef,
}: Readonly<FoamSurfaceProps>): JSX.Element {
  const meshRef =
    useRef<Mesh<ShapeGeometry | CircleGeometry, ShaderMaterial>>(null);
  const previousStirRef = useRef<{ u: number; v: number } | null>(null);
  const scroll = useScroll();
  const texture = useTexture(textureSrc);
  const bowl = useGLTF(bowlSrc);
  const chasenWorldPoint = useMemo(() => new Vector3(), []);
  const chasenLocalPoint = useMemo(() => new Vector3(), []);
  const fluidTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const canvasTexture = new CanvasTexture(canvas);
    canvasTexture.colorSpace = texture.colorSpace;
    canvasTexture.minFilter = LinearFilter;
    canvasTexture.magFilter = LinearFilter;
    return canvasTexture;
  }, [texture.colorSpace]);
  const fluid = useMemo(
    () =>
      new MatchaTextureDeformer(
        fluidTexture,
        texture.image as CanvasImageSource,
      ),
    [fluidTexture, texture],
  );

  const geometry = useMemo(
    () => createInnerWallSectionGeometry(bowl.scene),
    [bowl.scene],
  );
  const uniforms = useMemo(
    () => ({
      uTexture: { value: fluidTexture },
      uTint: { value: new Color(FOAM_SURFACE_CONFIG.material.tint) },
      uOpacity: { value: 0 },
      uImageSize: {
        value: FOAM_SURFACE_CONFIG.material.textureImageSizeWorld,
      },
    }),
    [fluidTexture],
  );

  useEffect(() => {
    return () => {
      fluid.dispose();
      fluidTexture.dispose();
      geometry.dispose();
    };
  }, [fluid, fluidTexture, geometry]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) {
      return;
    }

    const progress = progressRef?.current ?? scroll.offset;
    const whisk = smoothstep(
      range(progress, ...FOAM_SURFACE_CONFIG.motion.fadeWhiskProgress),
    );
    const final = smoothstep(
      range(progress, ...FOAM_SURFACE_CONFIG.motion.fadeFinalProgress),
    );
    const fadeIn = Math.max(whisk, final);
    const surface = meshRef.current;
    const material = surface.material;

    surface.visible =
      fadeIn > FOAM_SURFACE_CONFIG.material.visibleOpacityThreshold;
    surface.scale.setScalar(1);

    surface.position.y =
      FOAM_SURFACE_CONFIG.positionWorld[1] +
      Math.sin(
        clock.elapsedTime * FOAM_SURFACE_CONFIG.motion.rippleFrequency,
      ) *
        FOAM_SURFACE_CONFIG.motion.rippleAmplitudeWorld *
        fadeIn;
    material.uniforms.uOpacity.value = mix(
      0,
      FOAM_SURFACE_CONFIG.material.maximumOpacity,
      fadeIn,
    );

    const collisionActive =
      fadeIn > FOAM_SURFACE_CONFIG.material.visibleOpacityThreshold &&
      progress > FOAM_SURFACE_CONFIG.collision.progress[0] &&
      progress < FOAM_SURFACE_CONFIG.collision.progress[1];

    if (collisionActive && chasenRef?.current) {
      chasenRef.current.getWorldPosition(chasenWorldPoint);
      chasenLocalPoint.copy(chasenWorldPoint);
      surface.worldToLocal(chasenLocalPoint);

      const u =
        chasenLocalPoint.x /
          FOAM_SURFACE_CONFIG.material.textureImageSizeWorld +
        FOAM_SURFACE_CONFIG.material.shaderUvCenter;
      const v =
        chasenLocalPoint.y /
          FOAM_SURFACE_CONFIG.material.textureImageSizeWorld +
        FOAM_SURFACE_CONFIG.material.shaderUvCenter;
      const previous = previousStirRef.current;
      const du = previous ? u - previous.u : 0;
      const dv = previous ? v - previous.v : 0;
      const speed = Math.hypot(du, dv);
      const collision = FOAM_SURFACE_CONFIG.collision;
      const force =
        Math.min(
          collision.forceMaximum,
          collision.forceBase + speed * collision.forceSpeedMultiplier,
        ) * Math.max(collision.forceMinimumRatio, whisk);

      fluid.addCollisionStir(u, v, du, dv, force);
      previousStirRef.current = { u, v };
    } else {
      previousStirRef.current = null;
    }

    fluid.frame(delta);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[...FOAM_SURFACE_CONFIG.positionWorld]}
      rotation={[...FOAM_SURFACE_CONFIG.rotationRadians]}
      renderOrder={FOAM_SURFACE_CONFIG.renderOrder}
      visible={false}
    >
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest
        side={DoubleSide}
      />
    </mesh>
  );
}
