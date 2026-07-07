'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Sparkles } from '@react-three/drei';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  CanvasTexture,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  MathUtils,
  RepeatWrapping,
  Shape,
  SRGBColorSpace,
  Vector3
} from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function buildTeeShape() {
  const shape = new Shape();
  shape.moveTo(-0.62, 1.12);
  shape.bezierCurveTo(-0.86, 1.02, -1.04, 0.93, -1.2, 0.8);
  shape.lineTo(-1.02, 0.24);
  shape.lineTo(-0.62, 0.42);
  shape.lineTo(-0.59, -1.18);
  shape.lineTo(0.59, -1.18);
  shape.lineTo(0.62, 0.42);
  shape.lineTo(1.02, 0.24);
  shape.lineTo(1.2, 0.8);
  shape.bezierCurveTo(1.04, 0.93, 0.86, 1.02, 0.62, 1.12);
  shape.bezierCurveTo(0.48, 0.93, 0.34, 0.79, 0.19, 0.69);
  shape.quadraticCurveTo(0, 0.58, -0.19, 0.69);
  shape.bezierCurveTo(-0.34, 0.79, -0.48, 0.93, -0.62, 1.12);
  return shape;
}

function createTeeGeometry() {
  const geometry = new ExtrudeGeometry(buildTeeShape(), {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 2,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    curveSegments: 40
  });

  geometry.center();

  const position = geometry.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);

    const shoulderRelax = Math.max(0, 1 - Math.abs(x) * 1.2) * Math.max(0, y + 0.35) * 0.02;
    const chestWave = Math.sin((y + 1.2) * 4.4) * 0.018 * (1 - Math.min(Math.abs(x), 1));
    const verticalDrape = Math.cos(x * 4.2) * 0.028 * Math.max(0, 0.9 - y * y * 0.5);
    const hemCurl = y < -0.92 ? 0.03 * Math.cos(x * 6.4) : 0;
    const sleevePush = Math.max(0, Math.abs(x) - 0.42) * 0.05;

    position.setZ(index, z + shoulderRelax + chestWave + verticalDrape + hemCurl + sleevePush);
    position.setX(index, x + Math.sin(y * 2.1) * sleevePush * 0.35);
    position.setY(index, y - Math.max(0, -y - 0.4) * 0.012);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function buildFabricMaps(tone: 'light' | 'dark') {
  const size = 1024;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorContext = colorCanvas.getContext('2d')!;

  const base = tone === 'light' ? '#f2efe7' : '#121212';
  const weave = tone === 'light' ? 'rgba(196,190,178,0.22)' : 'rgba(255,255,255,0.08)';
  const shadow = tone === 'light' ? 'rgba(170,162,147,0.10)' : 'rgba(255,255,255,0.03)';

  colorContext.fillStyle = base;
  colorContext.fillRect(0, 0, size, size);

  for (let x = 0; x < size; x += 8) {
    colorContext.fillStyle = x % 16 === 0 ? weave : shadow;
    colorContext.fillRect(x, 0, 2, size);
  }

  for (let y = 0; y < size; y += 8) {
    colorContext.fillStyle = y % 16 === 0 ? weave : shadow;
    colorContext.fillRect(0, y, size, 2);
  }

  for (let i = 0; i < 4200; i += 1) {
    const alpha = Math.random() * (tone === 'light' ? 0.12 : 0.08);
    colorContext.fillStyle = tone === 'light' ? `rgba(120,115,104,${alpha})` : `rgba(255,255,255,${alpha})`;
    colorContext.fillRect(Math.random() * size, Math.random() * size, 1.5, 1.5);
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpContext = bumpCanvas.getContext('2d')!;
  bumpContext.fillStyle = '#808080';
  bumpContext.fillRect(0, 0, size, size);

  for (let x = 0; x < size; x += 10) {
    bumpContext.fillStyle = 'rgba(150,150,150,0.45)';
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
  roughnessContext.fillStyle = tone === 'light' ? '#d0d0d0' : '#b8b8b8';
  roughnessContext.fillRect(0, 0, size, size);

  for (let i = 0; i < 5000; i += 1) {
    const shade = 155 + Math.floor(Math.random() * 50);
    roughnessContext.fillStyle = `rgba(${shade},${shade},${shade},0.24)`;
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

function Tee({
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
  const baseRotation = rotation || [0, 0, 0];
  const groupRef = useRef<Group>(null);
  const geometry = useMemo(() => createTeeGeometry(), []);
  const edgeGeometry = useMemo(() => new EdgesGeometry(geometry, 22), [geometry]);
  const { colorMap, bumpMap, roughnessMap } = useMemo(() => buildFabricMaps(tone), [tone]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0024;
    groupRef.current.rotation.x = baseRotation[0] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.035;
    groupRef.current.rotation.z = baseRotation[2] + Math.cos(state.clock.elapsedTime * 1.1 + position[1]) * 0.02;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.15 + position[0]) * 0.08;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.14} floatIntensity={0.48}>
      <group ref={groupRef} position={position} rotation={baseRotation} scale={scale}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            map={colorMap}
            bumpMap={bumpMap}
            roughnessMap={roughnessMap}
            bumpScale={tone === 'light' ? 0.018 : 0.013}
            color={tone === 'light' ? '#f4f1e9' : '#131313'}
            roughness={0.92}
            metalness={0.02}
            clearcoat={0.08}
            clearcoatRoughness={0.95}
            sheen={1}
            sheenColor={tone === 'light' ? '#fffdf7' : '#6c6c6c'}
            sheenRoughness={0.96}
          />
        </mesh>

        <lineSegments geometry={edgeGeometry} position={[0, 0, 0.002]}>
          <lineBasicMaterial color={tone === 'light' ? '#d3cec3' : '#2f2f2f'} transparent opacity={0.52} />
        </lineSegments>

        <mesh position={[0, 0.58, 0.12]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.24, 0.08]} />
          <meshStandardMaterial color={tone === 'light' ? '#dfdbd2' : '#1c1c1c'} roughness={1} />
        </mesh>
      </group>
    </Float>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new Vector3(0, 0, 0));
  const heroGroup = useRef<Group>(null);
  const collectionGroup = useRef<Group>(null);
  const storyGroup = useRef<Group>(null);
  const world = useRef<Group>(null);

  useLayoutEffect(() => {
    if (!world.current || !heroGroup.current || !collectionGroup.current || !storyGroup.current) return;

    const ctx = gsap.context(() => {
      gsap.set(camera.position, { x: 0, y: 0.28, z: 7.6 });

      gsap.to(camera.position, {
        x: 0.55,
        y: 0.08,
        z: 5.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroGroup.current!.rotation, {
        x: 0.08,
        y: Math.PI * 0.82,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      gsap.to(collectionGroup.current!.position, {
        x: -0.35,
        y: -0.45,
        z: 1.8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(collectionGroup.current!.rotation, {
        x: -0.24,
        y: -Math.PI * 0.34,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(storyGroup.current!.position, {
        x: 0.7,
        y: -0.78,
        z: -1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#story',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(world.current!.rotation, {
        y: Math.PI * 0.24,
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
    target.current.x = MathUtils.lerp(target.current.x, Math.sin(state.clock.elapsedTime * 0.26) * 0.14, 0.04);
    target.current.y = MathUtils.lerp(target.current.y, Math.cos(state.clock.elapsedTime * 0.22) * 0.08, 0.04);
  });

  return (
    <group ref={world}>
      <group ref={heroGroup}>
        <Tee tone="light" position={[-1.1, 0.45, 0.2]} rotation={[0.5, 0.42, -0.08]} scale={1.38} />
        <Tee tone="dark" position={[1.42, -0.08, -0.78]} rotation={[0.34, -0.76, 0.1]} scale={1.22} />
      </group>

      <group ref={collectionGroup} position={[0.24, 0.44, -0.45]}>
        <Tee tone="light" position={[-2.25, -1.2, -1.8]} rotation={[0.18, 1.08, -0.16]} scale={0.74} />
        <Tee tone="dark" position={[2.15, 1.08, -2.16]} rotation={[-0.18, -0.58, 0.14]} scale={0.8} />
      </group>

      <group ref={storyGroup} position={[-0.45, 0.24, 0]}>
        <mesh position={[0, -2.42, -2.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 24, 1, 1]} />
          <meshStandardMaterial color="#080808" roughness={1} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.28, 7.6], fov: 36 }} shadows dpr={[1, 1.8]}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 7, 18]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 7, 4]} intensity={2.8} color="#fffef9" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <directionalLight position={[-4, 2.5, -2]} intensity={0.5} color="#77808e" />
        <spotLight position={[0, 8, 2]} intensity={14} angle={0.32} penumbra={0.8} distance={22} color="#ffffff" castShadow />
        <ContactShadows position={[0, -2.35, 0]} opacity={0.45} blur={2.8} scale={18} far={4.5} />
        <Sparkles count={70} scale={14} size={2.3} speed={0.18} color="#ffffff" opacity={0.26} />
        <Environment preset="warehouse" />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.44))]" />
    </div>
  );
}
