import { useMemo, useRef, type RefObject } from 'react';
import { MeshTransmissionMaterial, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  Group,
  Mesh,
  TubeGeometry,
  Vector3,
} from 'three';
import { range, smoothstep } from '../../utils/easing';

type WaterStreamProps = {
  mobile: boolean;
  kettleRef: RefObject<Group | null>;
};

const tubularSegments = 128;
const radialSegments = 18;
const streamRadius = 0.016;

function createWaterGeometry(curve: CatmullRomCurve3) {
  const geometry = new TubeGeometry(curve, tubularSegments, streamRadius, radialSegments, false);
  const position = geometry.attributes.position;

  for (let ring = 0; ring <= tubularSegments; ring += 1) {
    const t = ring / tubularSegments;
    const center = curve.getPointAt(t);
    const sourceTaper = smoothstep(range(t, 0, 0.50));
    const radiusScale = Math.max(0.001, sourceTaper);

    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const index = ring * (radialSegments + 1) + radial;
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

export function WaterStream({ mobile, kettleRef }: WaterStreamProps) {
  const streamRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<any>(null);
  const scroll = useScroll();

  const curve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-0.45, 1.64, 0.11),
        new Vector3(-0.30, 1.10, 0.07),
        new Vector3(-0.15, 0.47, 0.036),
        new Vector3(0.0, -0.15, 0.0),
      ]),
    [],
  );

  const tube = useMemo(() => createWaterGeometry(curve), [curve]);

  useFrame(({ clock }) => {
    const progress = scroll.offset;
    const pour = smoothstep(range(progress, 0.49, 0.52)) * (1 - smoothstep(range(progress, 0.62, 0.64)));
    const isVisible = pour > 0.02;

    if (streamRef.current) {
      streamRef.current.visible = isVisible;
    }

    if (isVisible && kettleRef?.current && meshRef.current) {
      kettleRef.current.updateMatrixWorld(true);

      const p0 = new Vector3();
      const spout = kettleRef.current.getObjectByName('kettle_spout');
      if (spout) {
        spout.localToWorld(p0.set(-12.5852, 11.6278, 0.0));
      } else {
        p0.set(-0.45, 1.64, 0.11);
      }

      const pourProgress = range(progress, 0.49, 0.64);
      const bowlPoint = new Vector3(-pourProgress * 0.3, -0.15, -pourProgress * 0.1);
      const streamDirection = bowlPoint.clone().sub(p0).normalize();
      const sourcePoint = p0.clone().addScaledVector(streamDirection, 0.06);
      sourcePoint.x -= 0.01;
      sourcePoint.y += 0.02;
      sourcePoint.z += 0.05;
      const targetPoint = bowlPoint.clone().addScaledVector(streamDirection, 0.08);
      const dx = targetPoint.x - sourcePoint.x;
      const dz = targetPoint.z - sourcePoint.z;

      const p1 = new Vector3(
        sourcePoint.x + dx * 0.25,
        sourcePoint.y - 0.025,
        sourcePoint.z + dz * 0.25,
      );
      const p2 = new Vector3(
        sourcePoint.x + dx * 0.65,
        targetPoint.y + 0.35,
        sourcePoint.z + dz * 0.65,
      );

      curve.points[0].copy(sourcePoint);
      curve.points[1].copy(p1);
      curve.points[2].copy(p2);
      curve.points[3].copy(targetPoint);

      meshRef.current.geometry.dispose();
      meshRef.current.geometry = createWaterGeometry(curve);
    }

    if (materialRef.current) {
      materialRef.current.opacity = pour * 0.95;
      materialRef.current.time = clock.elapsedTime * 2.0;
    }
  });

  return (
    <group ref={streamRef}>
      <mesh ref={meshRef} geometry={tube}>
        <MeshTransmissionMaterial
          ref={materialRef}
          color="#ffffff"
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          ior={1.33}
          distortion={0.3}
          distortionScale={0.8}
          temporalDistortion={0.5}
          transparent
          depthWrite={false}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
