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
import { Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function TeeModel({
  tone,
  position,
  rotation,
  scale = 1,
  drift = 0
}: {
  tone: 'light' | 'dark';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  drift?: number;
}) {
  const { scene } = useGLTF('/models/lmajhol-tee-reference.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<Group>(null);
  const baseRotation = rotation || [0, 0, 0];

  useLayoutEffect(() => {
    clone.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const baseMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (!(baseMaterial instanceof MeshStandardMaterial)) return;

      const material = baseMaterial.clone();
      material.envMapIntensity = tone === 'light' ? 1.3 : 1.15;
      material.roughness = tone === 'light' ? 0.84 : 0.88;
      material.metalness = 0.02;
      material.needsUpdate = true;

      if (tone === 'light') {
        material.color.set('#f7f3ec');
      } else {
        material.color.set('#262626');
      }

      mesh.material = material;
    });
  }, [clone, tone]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime + drift;
    groupRef.current.rotation.y = baseRotation[1] + Math.sin(t * 0.42) * 0.18;
    groupRef.current.rotation.x = baseRotation[0] + Math.cos(t * 0.55) * 0.035;
    groupRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.7) * 0.02;
    groupRef.current.position.y = position[1] + Math.sin(t * 0.95) * 0.11;
    groupRef.current.position.x = position[0] + Math.cos(t * 0.4) * 0.045;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.35}>
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
      gsap.set(camera.position, { x: 0, y: 0.2, z: 9.2 });
      gsap.set(heroGroup.current!.position, { x: 0, y: 0, z: 0 });

      gsap.to(camera.position, {
        x: 0,
        y: -0.18,
        z: 6.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroGroup.current!.position, {
        y: 0.26,
        z: -0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroGroup.current!.rotation, {
        y: Math.PI * 0.22,
        x: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      gsap.to(detailGroup.current!.position, {
        x: 0.12,
        y: -0.52,
        z: 1.7,
        ease: 'none',
        scrollTrigger: {
          trigger: '#story',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(detailGroup.current!.rotation, {
        x: -0.18,
        y: -Math.PI * 0.14,
        ease: 'none',
        scrollTrigger: {
          trigger: '#story',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(world.current!.rotation, {
        y: Math.PI * 0.08,
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
    target.current.x = MathUtils.lerp(target.current.x, Math.sin(state.clock.elapsedTime * 0.18) * 0.05, 0.04);
    target.current.y = MathUtils.lerp(target.current.y, Math.cos(state.clock.elapsedTime * 0.2) * 0.03, 0.04);
  });

  return (
    <group ref={world}>
      <group ref={heroGroup}>
        <TeeModel tone="light" position={[-1.35, 0.34, 0.35]} rotation={[0.2, 0.3, -0.05]} scale={1.55} drift={0.1} />
        <TeeModel tone="dark" position={[1.4, 0.04, -0.88]} rotation={[0.14, -0.54, 0.04]} scale={1.52} drift={1.6} />
      </group>

      <group ref={detailGroup} position={[0, 0.15, -0.5]}>
        <TeeModel tone="light" position={[-2.45, -1.28, -1.95]} rotation={[0.06, 0.96, -0.1]} scale={0.8} drift={0.8} />
        <TeeModel tone="dark" position={[2.38, 1.0, -2.15]} rotation={[-0.08, -0.62, 0.1]} scale={0.84} drift={2.1} />
      </group>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.2, 9.2], fov: 32 }} shadows dpr={[1, 1.8]}>
        <color attach="background" args={['#040404']} />
        <fog attach="fog" args={['#040404', 8, 22]} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5.5, 8.4, 6]}
          intensity={3.2}
          color="#fff7ef"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-4.5, 3.8, 5]} intensity={7.5} angle={0.38} penumbra={1} distance={24} color="#dfe8ff" />
        <spotLight position={[4.8, 3.2, 4.5]} intensity={8.2} angle={0.34} penumbra={1} distance={24} color="#fff3e6" castShadow />
        <spotLight position={[0, 6.8, -3]} intensity={6.5} angle={0.42} penumbra={1} distance={20} color="#ffffff" />

        <Environment resolution={256}>
          <Lightformer form="rect" intensity={4.6} color="#ffffff" scale={[10, 6, 1]} position={[0, 4, 8]} />
          <Lightformer form="rect" intensity={2.2} color="#dce6ff" scale={[10, 10, 1]} position={[-7, 1, 1]} rotation={[0, Math.PI / 2, 0]} />
          <Lightformer form="rect" intensity={1.8} color="#fff0e4" scale={[10, 10, 1]} position={[7, 0, -1]} rotation={[0, -Math.PI / 2, 0]} />
          <Lightformer form="ring" intensity={1.8} color="#ffffff" scale={3.4} position={[0, 3.2, -7]} />
        </Environment>

        <ContactShadows position={[0, -2.55, 0]} opacity={0.48} blur={2.8} scale={22} far={5.8} />
        <Sparkles count={42} scale={14} size={1.9} speed={0.14} color="#ffffff" opacity={0.13} />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.54))]" />
    </div>
  );
}

useGLTF.preload('/models/lmajhol-tee-reference.glb');
