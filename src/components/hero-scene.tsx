'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  Sparkles,
  useGLTF
} from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3
} from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function buildFabricMaps(tone: 'light' | 'dark') {
  const size = 1024;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorContext = colorCanvas.getContext('2d')!;

  const base = tone === 'light' ? '#f1ede5' : '#111111';
  const weaveMain = tone === 'light' ? 'rgba(203,197,185,0.26)' : 'rgba(255,255,255,0.09)';
  const weaveSoft = tone === 'light' ? 'rgba(167,160,148,0.11)' : 'rgba(255,255,255,0.04)';

  colorContext.fillStyle = base;
  colorContext.fillRect(0, 0, size, size);

  for (let x = 0; x < size; x += 8) {
    colorContext.fillStyle = x % 16 === 0 ? weaveMain : weaveSoft;
    colorContext.fillRect(x, 0, 2, size);
  }

  for (let y = 0; y < size; y += 8) {
    colorContext.fillStyle = y % 16 === 0 ? weaveMain : weaveSoft;
    colorContext.fillRect(0, y, size, 2);
  }

  for (let i = 0; i < 3800; i += 1) {
    const alpha = Math.random() * (tone === 'light' ? 0.08 : 0.06);
    colorContext.fillStyle = tone === 'light' ? `rgba(115,109,98,${alpha})` : `rgba(255,255,255,${alpha})`;
    colorContext.fillRect(Math.random() * size, Math.random() * size, 1.5, 1.5);
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpContext = bumpCanvas.getContext('2d')!;
  bumpContext.fillStyle = '#7f7f7f';
  bumpContext.fillRect(0, 0, size, size);

  for (let x = 0; x < size; x += 10) {
    bumpContext.fillStyle = 'rgba(154,154,154,0.44)';
    bumpContext.fillRect(x, 0, 2, size);
  }

  for (let y = 0; y < size; y += 10) {
    bumpContext.fillStyle = 'rgba(105,105,105,0.35)';
    bumpContext.fillRect(0, y, size, 2);
  }

  const roughnessCanvas = document.createElement('canvas');
  roughnessCanvas.width = size;
  roughnessCanvas.height = size;
  const roughnessContext = roughnessCanvas.getContext('2d')!;
  roughnessContext.fillStyle = tone === 'light' ? '#c8c8c8' : '#b6b6b6';
  roughnessContext.fillRect(0, 0, size, size);

  for (let i = 0; i < 4400; i += 1) {
    const shade = 150 + Math.floor(Math.random() * 44);
    roughnessContext.fillStyle = `rgba(${shade},${shade},${shade},0.22)`;
    roughnessContext.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }

  const colorMap = new CanvasTexture(colorCanvas);
  colorMap.wrapS = RepeatWrapping;
  colorMap.wrapT = RepeatWrapping;
  colorMap.repeat.set(4, 4);
  colorMap.colorSpace = SRGBColorSpace;

  const bumpMap = new CanvasTexture(bumpCanvas);
  bumpMap.wrapS = RepeatWrapping;
  bumpMap.wrapT = RepeatWrapping;
  bumpMap.repeat.set(5, 5);

  const roughnessMap = new CanvasTexture(roughnessCanvas);
  roughnessMap.wrapS = RepeatWrapping;
  roughnessMap.wrapT = RepeatWrapping;
  roughnessMap.repeat.set(5, 5);

  return { colorMap, bumpMap, roughnessMap };
}

function TeeModel({
  tone,
  position,
  rotation,
  scale = 1
}: {
  tone: 'light' | 'dark';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF('/models/oversized-tee.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<Group>(null);
  const baseRotation = rotation || [0, 0, 0];
  const { colorMap, bumpMap, roughnessMap } = useMemo(() => buildFabricMaps(tone), [tone]);

  const materials = useMemo(() => {
    const bodyMaterial = new MeshPhysicalMaterial({
      map: colorMap,
      bumpMap,
      roughnessMap,
      bumpScale: tone === 'light' ? 0.018 : 0.014,
      color: tone === 'light' ? '#f4f0e8' : '#101010',
      roughness: 0.93,
      metalness: 0.02,
      sheen: 1,
      sheenColor: tone === 'light' ? '#fffdf6' : '#707070',
      sheenRoughness: 0.94,
      clearcoat: 0.06,
      clearcoatRoughness: 0.95,
      envMapIntensity: 0.95
    });

    const collarMaterial = new MeshPhysicalMaterial({
      color: tone === 'light' ? '#dad4c8' : '#1e1e1e',
      roughness: 0.98,
      metalness: 0.01,
      sheen: 0.5,
      sheenColor: tone === 'light' ? '#f1ece1' : '#5c5c5c',
      sheenRoughness: 1
    });

    const labelMaterial = new MeshPhysicalMaterial({
      color: tone === 'light' ? '#f7f3eb' : '#2f2f2f',
      roughness: 1,
      metalness: 0
    });

    return { bodyMaterial, collarMaterial, labelMaterial };
  }, [bumpMap, colorMap, roughnessMap, tone]);

  useLayoutEffect(() => {
    clone.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh.name === 'teeBody') mesh.material = materials.bodyMaterial;
      if (mesh.name === 'teeCollar') mesh.material = materials.collarMaterial;
      if (mesh.name === 'teeLabel') mesh.material = materials.labelMaterial;
    });
  }, [clone, materials]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0019;
    groupRef.current.rotation.x = baseRotation[0] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.03;
    groupRef.current.rotation.z = baseRotation[2] + Math.cos(state.clock.elapsedTime * 1.05 + position[1]) * 0.015;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.14 + position[0]) * 0.075;
  });

  return (
    <Float speed={0.95} rotationIntensity={0.12} floatIntensity={0.42}>
      <group ref={groupRef} position={position} rotation={baseRotation} scale={scale}>
        <primitive object={clone} />
      </group>
    </Float>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new Vector3(0, 0, 0));
  const heroGroup = useRef<Group>(null);
  const detailGroup = useRef<Group>(null);
  const world = useRef<Group>(null);

  useLayoutEffect(() => {
    if (!world.current || !heroGroup.current || !detailGroup.current) return;

    const ctx = gsap.context(() => {
      gsap.set(camera.position, { x: 0, y: 0.15, z: 8.5 });

      gsap.to(camera.position, {
        x: 0,
        y: -0.1,
        z: 5.65,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroGroup.current!.rotation, {
        x: 0.06,
        y: Math.PI * 0.42,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      gsap.to(heroGroup.current!.position, {
        y: 0.2,
        z: -0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      gsap.to(detailGroup.current!.position, {
        x: 0.1,
        y: -0.48,
        z: 1.55,
        ease: 'none',
        scrollTrigger: {
          trigger: '#story',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(detailGroup.current!.rotation, {
        x: -0.2,
        y: -Math.PI * 0.18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#story',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(world.current!.rotation, {
        y: Math.PI * 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#order',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, [camera]);

  useFrame((state) => {
    camera.lookAt(target.current);
    target.current.x = MathUtils.lerp(target.current.x, Math.sin(state.clock.elapsedTime * 0.22) * 0.08, 0.04);
    target.current.y = MathUtils.lerp(target.current.y, Math.cos(state.clock.elapsedTime * 0.18) * 0.05, 0.04);
  });

  return (
    <group ref={world}>
      <group ref={heroGroup}>
        <TeeModel tone="light" position={[-1.08, 0.54, 0.32]} rotation={[0.34, 0.38, -0.08]} scale={1.52} />
        <TeeModel tone="dark" position={[1.1, 0.16, -0.85]} rotation={[0.26, -0.72, 0.08]} scale={1.46} />
      </group>

      <group ref={detailGroup} position={[0.06, 0.22, -0.8]}>
        <TeeModel tone="light" position={[-2.25, -1.1, -1.7]} rotation={[0.18, 1, -0.16]} scale={0.82} />
        <TeeModel tone="dark" position={[2.22, 1.06, -2.1]} rotation={[-0.14, -0.55, 0.16]} scale={0.86} />
      </group>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.15, 8.5], fov: 34 }} shadows dpr={[1, 1.8]}>
        <color attach="background" args={['#040404']} />
        <fog attach="fog" args={['#040404', 7, 20]} />
        <ambientLight intensity={0.42} />
        <directionalLight
          position={[4.5, 7.4, 4.2]}
          intensity={2.9}
          color="#fffaf0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 2.5, -2]} intensity={0.42} color="#7b8491" />
        <spotLight position={[0, 7.5, 3]} intensity={12} angle={0.26} penumbra={0.8} distance={22} color="#ffffff" castShadow />

        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3.5} color="#ffffff" scale={[8, 5, 1]} position={[0, 4, 6]} />
          <Lightformer form="rect" intensity={1.5} color="#ffffff" scale={[10, 8, 1]} position={[-6, 1, 1]} rotation={[0, Math.PI / 2, 0]} />
          <Lightformer form="rect" intensity={1.2} color="#7d8798" scale={[8, 8, 1]} position={[6, 0, -1]} rotation={[0, -Math.PI / 2, 0]} />
          <Lightformer form="ring" intensity={1.6} color="#ffffff" scale={3} position={[0, 3, -6]} />
        </Environment>

        <ContactShadows position={[0, -2.48, 0]} opacity={0.42} blur={2.6} scale={20} far={5} />
        <Sparkles count={58} scale={13} size={2.3} speed={0.16} color="#ffffff" opacity={0.18} />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5))]" />
    </div>
  );
}

useGLTF.preload('/models/oversized-tee.glb');
