import {
  useEffect,
  useMemo,
  useRef,
  type JSX,
  type RefObject,
} from "react";
import { useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  type BufferGeometry,
  Color,
  DoubleSide,
  type Group,
  type Mesh,
  ShapeGeometry,
  type ShaderMaterial,
} from "three";
import { mix, range, smoothstep } from "../../utils/easing";
import { glslFloat } from "../../utils/glsl";
import { createBowlCrossSectionGeometry } from "./bowlCrossSectionGeometry";
import { WATER_FILL_CONFIG } from "./config/liquids";

interface WaterFillProps {
  bowlSrc: string;
  progressRef?: RefObject<number>;
}

interface WaterFillUniforms {
  readonly uColorDeep: { value: Color };
  readonly uColorEdge: { value: Color };
  readonly uFillRatio: { value: number };
  readonly uOpacity: { value: number };
  readonly uTime: { value: number };
}

type WaterFillMaterial = ShaderMaterial & {
  uniforms: WaterFillUniforms;
};

const vertexShader = `
  precision mediump float;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    vUv = position.xy;
    vDist = length(position.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waterShader = WATER_FILL_CONFIG.material.shader;

const fragmentShader = `
  precision mediump float;
  uniform float uOpacity;
  uniform vec3 uColorDeep;
  uniform vec3 uColorEdge;
  uniform float uTime;
  uniform float uFillRatio;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    float ripple = sin(vUv.x * ${glslFloat(waterShader.rippleSpatialFrequency)} + uTime * ${glslFloat(waterShader.rippleTimeFrequencyX)}) * cos(vUv.y * ${glslFloat(waterShader.rippleSpatialFrequency)} + uTime * ${glslFloat(waterShader.rippleTimeFrequencyY)}) * ${glslFloat(waterShader.rippleAmplitude)};
    float ring = sin(vDist * ${glslFloat(waterShader.ringSpatialFrequency)} - uTime * ${glslFloat(waterShader.ringTimeFrequency)}) * ${glslFloat(waterShader.ringAmplitude)};
    float edgeFade = smoothstep(0.0, 1.0, vDist / ${glslFloat(waterShader.edgeDistanceWorld)});
    vec3 color = mix(uColorDeep, uColorEdge, edgeFade + ripple + ring);   
    float rim = pow(edgeFade, ${glslFloat(waterShader.rimExponent)}) * ${glslFloat(waterShader.rimAmplitude)};
    color += vec3(rim);
    float alpha = uOpacity * (1.0 - edgeFade * ${glslFloat(waterShader.alphaEdgeMultiplier)});
    if (alpha < ${glslFloat(waterShader.discardOpacityThreshold)}) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

function createBowlCrossSection(
  bowlScene: Group,
  sectionY: number,
): ShapeGeometry {
  const config = WATER_FILL_CONFIG.geometry;
  const geometry = createBowlCrossSectionGeometry(bowlScene, {
    bowlModelYWorld: config.bowlModelYWorld,
    bowlScaleRatio: config.bowlScaleRatio,
    fallback: {
      kind: "shape",
      radiusWorld: config.fallbackRadiusRatio * config.bowlScaleRatio,
    },
    insetRatio: config.insetRatio,
    radialBins: config.radialBins,
    sampleBandWorld: config.sampleBandWorld,
    sectionYWorld: sectionY,
    smoothingRadiusBins: config.smoothingRadiusBins,
  });
  if (geometry instanceof ShapeGeometry) return geometry;
  geometry.dispose();
  throw new Error("Water fill requires a shape cross section.");
}

export function WaterFill({
  bowlSrc,
  progressRef,
}: Readonly<WaterFillProps>): JSX.Element {
  const meshRef = useRef<Mesh<BufferGeometry, WaterFillMaterial>>(null);
  const scroll = useScroll();
  const bowl = useGLTF(bowlSrc);

  const levelGeometries = useMemo(() => {
    const geometryConfig = WATER_FILL_CONFIG.geometry;
    const geoms: ShapeGeometry[] = [];
    for (let i = 0; i < geometryConfig.levelCount; i++) {
      const t = i / (geometryConfig.levelCount - 1);
      const y = mix(
        geometryConfig.yBottomWorld,
        geometryConfig.yTopWorld,
        t,
      );
      geoms.push(createBowlCrossSection(bowl.scene, y));
    }
    return geoms;
  }, [bowl.scene]);

  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uColorDeep: {
        value: new Color(WATER_FILL_CONFIG.material.deepColor),
      },
      uColorEdge: {
        value: new Color(WATER_FILL_CONFIG.material.edgeColor),
      },
      uTime: { value: 0 },
      uFillRatio: { value: 0 },
    }),
    [],
  );

  useEffect(
    () => () => {
      for (const geometry of levelGeometries) {
        geometry.dispose();
      }
    },
    [levelGeometries],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const progress = progressRef?.current ?? scroll.offset;

    const motion = WATER_FILL_CONFIG.motion;
    const geometryConfig = WATER_FILL_CONFIG.geometry;
    const totalFill = smoothstep(range(progress, ...motion.fillProgress));
    const fadeIn = smoothstep(range(progress, ...motion.fadeInProgress));
    const fadeOut = 1 - smoothstep(range(progress, ...motion.fadeOutProgress));
    const opacity =
      fadeIn * fadeOut * WATER_FILL_CONFIG.material.maximumOpacity;

    const surface = meshRef.current;
    surface.visible =
      opacity > WATER_FILL_CONFIG.material.visibleOpacityThreshold;

    if (!surface.visible) return;

    const levelIndex = Math.min(
      geometryConfig.levelCount - 1,
      Math.floor(totalFill * geometryConfig.levelCount),
    );
    const currentGeom = levelGeometries[levelIndex];
    if (surface.geometry !== currentGeom) {
      surface.geometry = currentGeom;
    }

    const waterY = mix(
      geometryConfig.yBottomWorld,
      geometryConfig.yTopWorld,
      totalFill,
    );

    const rippleY =
      Math.sin(clock.elapsedTime * motion.rippleFrequency) *
      motion.rippleAmplitudeWorld *
      fadeIn;
    surface.position.y = waterY + rippleY;

    const mat = surface.material;
    mat.uniforms.uOpacity.value = opacity;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uFillRatio.value = totalFill;

    const greenTint = smoothstep(
      range(progress, ...motion.greenTintProgress),
    );
    const tint = WATER_FILL_CONFIG.material.greenTint;
    mat.uniforms.uColorDeep.value.set(
      mix(tint.deepFromRgb[0], tint.deepToRgb[0], greenTint),
      mix(tint.deepFromRgb[1], tint.deepToRgb[1], greenTint),
      mix(tint.deepFromRgb[2], tint.deepToRgb[2], greenTint),
    );
    mat.uniforms.uColorEdge.value.set(
      mix(tint.edgeFromRgb[0], tint.edgeToRgb[0], greenTint),
      mix(tint.edgeFromRgb[1], tint.edgeToRgb[1], greenTint),
      mix(tint.edgeFromRgb[2], tint.edgeToRgb[2], greenTint),
    );
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[...WATER_FILL_CONFIG.rotationRadians]}
      position={[0, WATER_FILL_CONFIG.geometry.yBottomWorld, 0]}
      renderOrder={WATER_FILL_CONFIG.renderOrder}
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
