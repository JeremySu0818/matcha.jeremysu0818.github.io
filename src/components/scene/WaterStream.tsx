import {
  useEffect,
  useMemo,
  useRef,
  type ComponentRef,
  type JSX,
  type RefObject,
} from "react";
import { MeshTransmissionMaterial, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  type Group,
  type Mesh,
  TubeGeometry,
  Vector3,
} from "three";
import { range, smoothstep } from "../../utils/easing";
import { WATER_STREAM_CONFIG } from "./config/liquids";

interface WaterStreamProps {
  kettleRef: RefObject<Group | null>;
  progressRef?: RefObject<number>;
}

function createWaterGeometry(curve: CatmullRomCurve3): TubeGeometry {
  const config = WATER_STREAM_CONFIG.curve;
  const geometry = new TubeGeometry(
    curve,
    config.tubeSegments,
    config.radiusWorld,
    config.radialSegments,
    false,
  );
  const position = geometry.attributes.position;

  for (let ring = 0; ring <= config.tubeSegments; ring += 1) {
    const t = ring / config.tubeSegments;
    const center = curve.getPointAt(t);
    const sourceTaper = smoothstep(
      range(t, ...config.sourceTaperProgress),
    );
    const radiusScale = Math.max(config.minimumRadiusScale, sourceTaper);

    for (let radial = 0; radial <= config.radialSegments; radial += 1) {
      const index = ring * (config.radialSegments + 1) + radial;
      const x = position.getX(index);
      const y = position.getY(index);
      const z = position.getZ(index);

      position.setXYZ(
        index,
        center.x + (x - center.x) * radiusScale,
        center.y + (y - center.y) * radiusScale,
        center.z + (z - center.z) * radiusScale,
      );
    }
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

export function WaterStream({
  kettleRef,
  progressRef,
}: Readonly<WaterStreamProps>): JSX.Element {
  const streamRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ComponentRef<typeof MeshTransmissionMaterial>>(null);
  const scroll = useScroll();

  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        ...WATER_STREAM_CONFIG.curve.initialPointsWorld.map(
          (point) => new Vector3(...point),
        ),
      ]),
    [],
  );

  const tube = useMemo(() => createWaterGeometry(curve), [curve]);
  const currentGeometryRef = useRef(tube);
  const scratch = useMemo(
    () => ({
      bowlPoint: new Vector3(),
      lowerControlPoint: new Vector3(),
      sourceDirection: new Vector3(),
      sourcePoint: new Vector3(),
      spoutPoint: new Vector3(),
      targetPoint: new Vector3(),
      upperControlPoint: new Vector3(),
    }),
    [],
  );

  useEffect(
    () => () => {
      currentGeometryRef.current.dispose();
    },
    [],
  );

  useFrame(({ clock }) => {
    const progress = progressRef?.current ?? scroll.offset;
    const motion = WATER_STREAM_CONFIG.motion;
    const pour =
      smoothstep(range(progress, ...motion.pourStartProgress)) *
      (1 - smoothstep(range(progress, ...motion.pourEndProgress)));
    const isVisible = pour > motion.visibleThreshold;

    if (streamRef.current) {
      streamRef.current.visible = isVisible;
    }

    if (isVisible && kettleRef.current && meshRef.current) {
      kettleRef.current.updateMatrixWorld(true);

      const curveConfig = WATER_STREAM_CONFIG.curve;
      const spout = kettleRef.current.getObjectByName(
        curveConfig.spoutObjectName,
      );
      const p0 = scratch.spoutPoint;
      if (spout) {
        spout.localToWorld(p0.set(...curveConfig.spoutLocalPoint));
      } else {
        p0.set(...curveConfig.fallbackSourceWorld);
      }

      const pourProgress = range(progress, ...motion.pourPathProgress);
      const bowlPoint = scratch.bowlPoint.set(
        pourProgress * curveConfig.targetProgressXWorld +
          curveConfig.targetEndWorld[0],
        curveConfig.targetEndWorld[1],
        pourProgress * curveConfig.targetProgressZWorld,
      );
      const streamDirection = scratch.sourceDirection
        .copy(bowlPoint)
        .sub(p0)
        .normalize();
      const sourcePoint = scratch.sourcePoint
        .copy(p0)
        .addScaledVector(
          streamDirection,
          curveConfig.sourceDirectionOffsetWorld,
        );
      sourcePoint.x += curveConfig.sourceOffsetWorld[0];
      sourcePoint.y += curveConfig.sourceOffsetWorld[1];
      sourcePoint.z += curveConfig.sourceOffsetWorld[2];
      const targetPoint = scratch.targetPoint
        .copy(bowlPoint)
        .addScaledVector(
          streamDirection,
          curveConfig.targetDirectionOffsetWorld,
        );
      const dx = targetPoint.x - sourcePoint.x;
      const dz = targetPoint.z - sourcePoint.z;

      const p1 = scratch.upperControlPoint.set(
        sourcePoint.x + dx * curveConfig.upperControl.horizontalRatio,
        sourcePoint.y + curveConfig.upperControl.yOffsetWorld,
        sourcePoint.z + dz * curveConfig.upperControl.horizontalRatio,
      );
      const p2 = scratch.lowerControlPoint.set(
        sourcePoint.x + dx * curveConfig.lowerControl.horizontalRatio,
        targetPoint.y + curveConfig.lowerControl.yOffsetFromTargetWorld,
        sourcePoint.z + dz * curveConfig.lowerControl.horizontalRatio,
      );

      curve.points[0].copy(sourcePoint);
      curve.points[1].copy(p1);
      curve.points[2].copy(p2);
      curve.points[3].copy(targetPoint);

      currentGeometryRef.current.dispose();
      const nextGeometry = createWaterGeometry(curve);
      currentGeometryRef.current = nextGeometry;
      meshRef.current.geometry = nextGeometry;
    }

    if (materialRef.current) {
      materialRef.current.opacity =
        pour * WATER_STREAM_CONFIG.material.maximumOpacity;
      materialRef.current.time =
        clock.elapsedTime * WATER_STREAM_CONFIG.material.timeScale;
    }
  });

  return (
    <group ref={streamRef}>
      <mesh ref={meshRef} geometry={tube}>
        <MeshTransmissionMaterial
          ref={materialRef}
          color={WATER_STREAM_CONFIG.material.color}
          roughness={WATER_STREAM_CONFIG.material.roughness}
          transmission={WATER_STREAM_CONFIG.material.transmission}
          thickness={WATER_STREAM_CONFIG.material.thickness}
          ior={WATER_STREAM_CONFIG.material.indexOfRefraction}
          distortion={WATER_STREAM_CONFIG.material.distortion}
          distortionScale={WATER_STREAM_CONFIG.material.distortionScale}
          temporalDistortion={WATER_STREAM_CONFIG.material.temporalDistortion}
          transparent
          depthWrite={false}
          envMapIntensity={WATER_STREAM_CONFIG.material.environmentIntensity}
        />
      </mesh>
    </group>
  );
}
