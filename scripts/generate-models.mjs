import fs from 'node:fs/promises';
import path from 'node:path';
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const outputDir = path.resolve('public/models');

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;

    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        this.onloadend?.({ target: this });
      });
    }

    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        const base64 = Buffer.from(buffer).toString('base64');
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
        this.onloadend?.({ target: this });
      });
    }
  };
}

const materials = {
  ceramicOuter: new MeshPhysicalMaterial({
    color: '#ddd5c4',
    roughness: 0.52,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.42,
    sheen: 0.08,
    sheenColor: '#f5efe3',
  }),
  ceramicInner: new MeshPhysicalMaterial({
    color: '#eee8d5',
    roughness: 0.38,
    clearcoat: 0.42,
    clearcoatRoughness: 0.35,
    sheen: 0.06,
    sheenColor: '#f8f3e8',
  }),
  matcha: new MeshPhysicalMaterial({
    color: '#7a9e52',
    roughness: 0.48,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
    sheen: 0.12,
    sheenColor: '#b8d48a',
  }),
  steel: new MeshStandardMaterial({
    color: '#c8ccc6',
    roughness: 0.18,
    metalness: 0.92,
  }),
  darkSteel: new MeshStandardMaterial({
    color: '#6b726c',
    roughness: 0.24,
    metalness: 0.85,
  }),
  bamboo: new MeshStandardMaterial({
    color: '#d4b06a',
    roughness: 0.68,
  }),
  bambooDark: new MeshStandardMaterial({
    color: '#9a7542',
    roughness: 0.75,
  }),
  black: new MeshStandardMaterial({
    color: '#1e211c',
    roughness: 0.42,
    metalness: 0.15,
  }),
};

for (const [name, material] of Object.entries(materials)) {
  material.name = name;
}

function addMesh(group, geometry, material, transform = {}) {
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (transform.position) mesh.position.set(...transform.position);
  if (transform.rotation) mesh.rotation.set(...transform.rotation);
  if (transform.scale) mesh.scale.set(...transform.scale);

  group.add(mesh);
  return mesh;
}

function makeCylinderBetween(start, end, radius, material, radialSegments = 10) {
  const direction = new Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new CylinderGeometry(radius, radius, length, radialSegments);
  const mesh = new Mesh(geometry, material);
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function createTeaBowl() {
  const group = new Group();
  group.name = 'procedural_matcha_bowl';

  const outerProfile = [
    new Vector2(0.22, -0.02),
    new Vector2(0.28, 0),
    new Vector2(0.42, 0.04),
    new Vector2(0.58, 0.1),
    new Vector2(0.72, 0.2),
    new Vector2(0.86, 0.34),
    new Vector2(0.96, 0.48),
    new Vector2(1.06, 0.64),
    new Vector2(1.14, 0.78),
    new Vector2(1.2, 0.88),
    new Vector2(1.22, 0.94),
    new Vector2(1.2, 0.98),
    new Vector2(1.18, 1.0),
  ];
  const innerProfile = [
    new Vector2(0.3, 0.1),
    new Vector2(0.42, 0.14),
    new Vector2(0.56, 0.2),
    new Vector2(0.7, 0.3),
    new Vector2(0.82, 0.42),
    new Vector2(0.92, 0.56),
    new Vector2(0.98, 0.68),
    new Vector2(1.04, 0.8),
    new Vector2(1.06, 0.88),
    new Vector2(1.04, 0.94),
    new Vector2(1.02, 0.96),
  ];

  addMesh(group, new LatheGeometry(outerProfile, 164), materials.ceramicOuter);
  addMesh(
    group,
    new LatheGeometry(innerProfile, 164),
    materials.ceramicInner,
    { rotation: [0, Math.PI, 0] },
  );
  addMesh(group, new TorusGeometry(1.17, 0.038, 16, 164), materials.ceramicOuter, {
    position: [0, 0.98, 0],
  });
  addMesh(group, new CylinderGeometry(0.26, 0.34, 0.06, 96), materials.ceramicOuter, {
    position: [0, -0.02, 0],
  });
  addMesh(group, new CylinderGeometry(0.82, 0.74, 0.03, 128), materials.matcha, {
    position: [0, 0.68, 0],
  });

  for (let i = 0; i < 72; i += 1) {
    const angle = (i / 72) * Math.PI * 2;
    const radius = 0.14 + ((i * 23) % 41) / 41 * 0.52;
    addMesh(group, new SphereGeometry(0.01 + (i % 5) * 0.002, 8, 8), materials.ceramicInner, {
      position: [Math.cos(angle) * radius, 0.694, Math.sin(angle) * radius],
      scale: [1.2, 0.22, 1.2],
    });
  }

  return group;
}

function createSieve() {
  const group = new Group();
  group.name = 'procedural_powder_sieve';

  addMesh(group, new TorusGeometry(1.05, 0.04, 20, 164), materials.steel, {
    rotation: [Math.PI / 2, 0, 0],
  });
  addMesh(group, new RingGeometry(0.16, 1, 128), materials.darkSteel, {
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.012, 0],
  }).material.side = DoubleSide;

  for (let i = -11; i <= 11; i += 1) {
    const offset = i * 0.078;
    const length = Math.sqrt(Math.max(0, 0.96 * 0.96 - offset * offset)) * 2;
    const a = new Vector3(-length / 2, 0, offset);
    const b = new Vector3(length / 2, 0, offset);
    group.add(makeCylinderBetween(a, b, 0.005, materials.steel, 8));
    group.add(makeCylinderBetween(new Vector3(offset, 0, -length / 2), new Vector3(offset, 0, length / 2), 0.005, materials.steel, 8));
  }

  addMesh(group, new CylinderGeometry(0.05, 0.05, 1.15, 20), materials.bambooDark, {
    position: [1.52, 0, 0],
    rotation: [0, 0, Math.PI / 2],
  });
  addMesh(group, new TorusGeometry(0.075, 0.01, 10, 28), materials.bambooDark, {
    position: [2.1, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  });

  return group;
}

function createKettle() {
  const group = new Group();
  group.name = 'procedural_hot_water_kettle';

  const bodyProfile = [
    new Vector2(0, -0.56),
    new Vector2(0.28, -0.54),
    new Vector2(0.48, -0.48),
    new Vector2(0.62, -0.38),
    new Vector2(0.72, -0.24),
    new Vector2(0.78, -0.08),
    new Vector2(0.78, 0.08),
    new Vector2(0.72, 0.22),
    new Vector2(0.62, 0.32),
    new Vector2(0.5, 0.4),
    new Vector2(0.42, 0.44),
    new Vector2(0.38, 0.48),
    new Vector2(0.36, 0.55),
    new Vector2(0.36, 0.62),
    new Vector2(0.37, 0.67),
  ];

  addMesh(group, new LatheGeometry(bodyProfile, 72), materials.steel);

  addMesh(group, new TorusGeometry(0.37, 0.03, 14, 72), materials.steel, {
    position: [0, 0.67, 0],
    rotation: [Math.PI / 2, 0, 0],
  });
  addMesh(group, new CylinderGeometry(0.08, 0.14, 0.12, 36), materials.black, {
    position: [0, 0.82, 0],
  });
  addMesh(group, new SphereGeometry(0.09, 24, 16), materials.black, {
    position: [0, 0.9, 0],
    scale: [1, 0.6, 1],
  });

  const spoutCurve = new CatmullRomCurve3([
    new Vector3(0.54, 0.12, 0),
    new Vector3(0.82, 0.18, 0.01),
    new Vector3(1.08, 0.32, 0.01),
    new Vector3(1.28, 0.42, 0),
    new Vector3(1.42, 0.4, 0),
  ]);
  addMesh(group, new TubeGeometry(spoutCurve, 56, 0.055, 20, false), materials.steel);
  addMesh(group, new ConeGeometry(0.075, 0.14, 28), materials.steel, {
    position: [1.48, 0.39, 0],
    rotation: [0, 0, -Math.PI / 2],
  });

  const handleCurve = new CatmullRomCurve3([
    new Vector3(-0.44, 0.1, 0.5),
    new Vector3(-0.82, 0.35, 0.48),
    new Vector3(-0.88, 0.68, 0.2),
    new Vector3(-0.78, 0.8, -0.1),
    new Vector3(-0.44, 0.58, -0.42),
  ]);
  addMesh(group, new TubeGeometry(handleCurve, 56, 0.04, 16, false), materials.black);

  return group;
}

function taperedProng(length, rootRadius, tipRadius, material) {
  const geometry = new ConeGeometry(rootRadius, length, 10);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i += 1) {
    const y = positions.getY(i);
    const normalized = (y + length / 2) / length;
    const scale = 1 - normalized * (1 - tipRadius / rootRadius);
    positions.setX(i, positions.getX(i) * scale);
    positions.setZ(i, positions.getZ(i) * scale);
  }

  geometry.computeVertexNormals();
  return new Mesh(geometry, material);
}

function createChasen() {
  const group = new Group();
  group.name = 'procedural_bamboo_chasen';

  const handleProfile = [
    new Vector2(0.18, 0.25),
    new Vector2(0.2, 0.35),
    new Vector2(0.22, 0.5),
    new Vector2(0.22, 0.72),
    new Vector2(0.21, 0.9),
    new Vector2(0.2, 1.0),
    new Vector2(0.18, 1.1),
    new Vector2(0.16, 1.18),
  ];

  addMesh(group, new LatheGeometry(handleProfile, 40), materials.bamboo);

  addMesh(group, new TorusGeometry(0.2, 0.015, 10, 36), materials.bambooDark, {
    position: [0, 0.25, 0],
    rotation: [Math.PI / 2, 0, 0],
  });
  addMesh(group, new TorusGeometry(0.19, 0.01, 8, 36), materials.bambooDark, {
    position: [0, 0.32, 0],
    rotation: [Math.PI / 2, 0, 0],
  });

  const prongCount = 56;
  for (let i = 0; i < prongCount; i += 1) {
    const ring = i % 2 === 0 ? 0.18 : 0.11;
    const angle = (i / prongCount) * Math.PI * 2;
    const prong = taperedProng(0.75, 0.015, 0.004, materials.bamboo);
    prong.position.set(Math.cos(angle) * ring, -0.12, Math.sin(angle) * ring);
    prong.rotation.z = Math.cos(angle) * 0.2;
    prong.rotation.x = Math.sin(angle) * -0.2;
    prong.rotation.y = angle;
    prong.castShadow = true;
    prong.receiveShadow = true;
    group.add(prong);
  }

  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    addMesh(group, new CylinderGeometry(0.008, 0.008, 0.52, 8), materials.bambooDark, {
      position: [Math.cos(angle) * 0.06, -0.12, Math.sin(angle) * 0.06],
      rotation: [Math.sin(angle) * 0.12, 0, Math.cos(angle) * 0.12],
    });
  }

  return group;
}

async function exportGlb(group, fileName) {
  const exporter = new GLTFExporter();
  const data = await exporter.parseAsync(group, { binary: true });
  await fs.writeFile(path.join(outputDir, fileName), Buffer.from(data));
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const models = [
    ['tea-bowl.glb', createTeaBowl()],
    ['sieve.glb', createSieve()],
    ['kettle.glb', createKettle()],
    ['chasen.glb', createChasen()],
  ];

  for (const [fileName, group] of models) {
    await exportGlb(group, fileName);
    console.log(`Generated ${fileName}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
