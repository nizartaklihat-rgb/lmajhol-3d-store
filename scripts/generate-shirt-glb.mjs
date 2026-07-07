import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

class NodeFileReader {
  constructor() {
    this.result = null;
    this.onloadend = null;
  }

  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    if (typeof this.onloadend === 'function') this.onloadend();
  }

  async readAsDataURL(blob) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const type = blob.type || 'application/octet-stream';
    this.result = `data:${type};base64,${buffer.toString('base64')}`;
    if (typeof this.onloadend === 'function') this.onloadend();
  }
}

globalThis.FileReader = NodeFileReader;

function buildTeeShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.66, 1.12);
  shape.bezierCurveTo(-0.92, 1.02, -1.12, 0.91, -1.28, 0.78);
  shape.lineTo(-1.08, 0.18);
  shape.lineTo(-0.64, 0.38);
  shape.lineTo(-0.6, -1.22);
  shape.lineTo(0.6, -1.22);
  shape.lineTo(0.64, 0.38);
  shape.lineTo(1.08, 0.18);
  shape.lineTo(1.28, 0.78);
  shape.bezierCurveTo(1.12, 0.91, 0.92, 1.02, 0.66, 1.12);
  shape.bezierCurveTo(0.52, 0.92, 0.36, 0.78, 0.18, 0.68);
  shape.quadraticCurveTo(0, 0.56, -0.18, 0.68);
  shape.bezierCurveTo(-0.36, 0.78, -0.52, 0.92, -0.66, 1.12);
  return shape;
}

function createBodyGeometry() {
  const geometry = new THREE.ExtrudeGeometry(buildTeeShape(), {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.032,
    bevelThickness: 0.028,
    curveSegments: 44
  });

  geometry.center();

  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);

    const shoulderDrop = Math.max(0, y - 0.15) * 0.04 * (1 - Math.min(Math.abs(x) / 1.1, 1));
    const chestFold = Math.sin((y + 1.4) * 4.2) * 0.02 * (1 - Math.min(Math.abs(x), 1));
    const sideFold = Math.cos(x * 5.4) * 0.03 * Math.max(0, 1 - Math.abs(y) * 0.5);
    const hemWave = y < -0.9 ? Math.cos(x * 7.6) * 0.038 : 0;
    const sleevePuff = Math.max(0, Math.abs(x) - 0.46) * 0.075 * Math.max(0.15, 1 - Math.abs(y - 0.25));
    const frontBackBreathe = Math.sin(x * 3.2 + y * 2.1) * 0.01;

    position.setZ(i, z + shoulderDrop + chestFold + sideFold + hemWave + sleevePuff + frontBackBreathe);
    position.setX(i, x + Math.sin(y * 2.4) * sleevePuff * 0.42);
    position.setY(i, y - Math.max(0, -y - 0.3) * 0.015 + Math.sin(x * 4.0) * 0.004);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createCollarGeometry() {
  const collar = new THREE.TorusGeometry(0.245, 0.048, 20, 60);
  collar.rotateX(Math.PI / 2);
  collar.scale(1.18, 0.65, 0.68);
  collar.translate(0, 0.56, 0.105);

  const position = collar.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    position.setZ(i, z + Math.cos(x * 8) * 0.006 + Math.sin(y * 10) * 0.004);
  }
  position.needsUpdate = true;
  collar.computeVertexNormals();
  return collar;
}

function createLabelGeometry() {
  const label = new THREE.BoxGeometry(0.18, 0.06, 0.008, 1, 1, 1);
  label.translate(0, 0.67, 0.105);
  return label;
}

const scene = new THREE.Scene();

const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#dddddd', roughness: 0.9, metalness: 0.02, name: 'body-material' });
const collarMaterial = new THREE.MeshStandardMaterial({ color: '#cfcfcf', roughness: 0.95, metalness: 0.01, name: 'collar-material' });
const labelMaterial = new THREE.MeshStandardMaterial({ color: '#f7f7f7', roughness: 0.98, metalness: 0, name: 'label-material' });

const bodyMesh = new THREE.Mesh(createBodyGeometry(), bodyMaterial);
bodyMesh.name = 'teeBody';
const collarMesh = new THREE.Mesh(createCollarGeometry(), collarMaterial);
collarMesh.name = 'teeCollar';
const labelMesh = new THREE.Mesh(createLabelGeometry(), labelMaterial);
labelMesh.name = 'teeLabel';

scene.add(bodyMesh, collarMesh, labelMesh);

const exporter = new GLTFExporter();
const outPath = new URL('../public/models/oversized-tee.glb', import.meta.url);

await new Promise((resolve, reject) => {
  exporter.parse(
    scene,
    async (result) => {
      try {
        const fs = await import('node:fs/promises');
        const buffer = Buffer.from(result);
        await fs.writeFile(outPath, buffer);
        console.log(`Wrote ${outPath.pathname}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    },
    (error) => reject(error),
    { binary: true }
  );
});
