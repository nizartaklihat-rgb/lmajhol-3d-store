'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Group, MathUtils, Shape, Vector3 } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function buildTeeShape() {
  const shape = new Shape();
  shape.moveTo(-0.55, 1.1);
  shape.lineTo(-1.15, 0.82);
  shape.lineTo(-0.94, 0.28);
  shape.lineTo(-0.58, 0.44);
  shape.lineTo(-0.58, -1.15);
  shape.lineTo(0.58, -1.15);
  shape.lineTo(0.58, 0.44);
  shape.lineTo(0.94, 0.28);
  shape.lineTo(1.15, 0.82);
  shape.lineTo(0.55, 1.1);
  shape.lineTo(0.22, 0.72);
  shape.quadraticCurveTo(0, 0.54, -0.22, 0.72);
  shape.lineTo(-0.55, 1.1);
  return shape;
}

function Tee({
  color,
  position,
  rotation,
  scale = 1,
  metalness = 0.25
}: {
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  metalness?: number;
}) {
  const shape = useMemo(() => buildTeeShape(), []);
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003;
    ref.current.position.y += Math.sin(state.clock.elapsedTime * 1.4 + position[0]) * 0.0009;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.9}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[shape, { depth: 0.18, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 }]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={metalness} />
        </mesh>
        <mesh position={[0, 0, 0.12]} scale={[0.84, 0.84, 1]}>
          <extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: false }]} />
          <MeshTransmissionMaterial thickness={0.2} roughness={0.1} transmission={0.2} chromaticAberration={0.02} backside={false} color={color === '#f8f7f1' ? '#ffffff' : '#0f0f0f'} />
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
      gsap.set(camera.position, { x: 0, y: 0.4, z: 7.8 });

      gsap.to(camera.position, {
        x: 0.5,
        y: 0.2,
        z: 5.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#experience',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroGroup.current!.rotation, {
        x: 0.1,
        y: Math.PI * 0.8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'center center',
          scrub: true
        }
      });

      gsap.to(collectionGroup.current!.position, {
        x: -0.3,
        y: -0.4,
        z: 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(collectionGroup.current!.rotation, {
        x: -0.25,
        y: -Math.PI * 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(storyGroup.current!.position, {
        x: 0.6,
        y: -0.8,
        z: -1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '#story',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      });

      gsap.to(world.current!.rotation, {
        y: Math.PI * 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '#order',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, [camera]);

  useFrame((state) => {
    camera.lookAt(target.current);
    target.current.x = MathUtils.lerp(target.current.x, Math.sin(state.clock.elapsedTime * 0.2) * 0.15, 0.04);
    target.current.y = MathUtils.lerp(target.current.y, Math.cos(state.clock.elapsedTime * 0.24) * 0.08, 0.04);
  });

  return (
    <group ref={world}>
      <group ref={heroGroup}>
        <Tee color="#f8f7f1" position={[-1.2, 0.4, 0]} rotation={[0.45, 0.45, -0.08]} scale={1.35} />
        <Tee color="#111111" position={[1.45, -0.15, -0.8]} rotation={[0.3, -0.8, 0.1]} scale={1.18} metalness={0.38} />
      </group>

      <group ref={collectionGroup} position={[0.3, 0.5, -0.4]}>
        <Tee color="#ffffff" position={[-2.3, -1.2, -1.8]} rotation={[0.2, 1.1, -0.2]} scale={0.72} />
        <Tee color="#0b0b0b" position={[2.2, 1.15, -2.2]} rotation={[-0.2, -0.6, 0.16]} scale={0.78} />
      </group>

      <group ref={storyGroup} position={[-0.4, 0.2, 0]}>
        <mesh position={[0, -2.4, -2.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[22, 22, 1, 1]} />
          <meshStandardMaterial color="#080808" roughness={0.95} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.4, 7.8], fov: 38 }} shadows dpr={[1, 1.8]}>
        <color attach="background" args={['#060606']} />
        <fog attach="fog" args={['#060606', 7, 16]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" castShadow />
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#6f6f6f" />
        <spotLight position={[0, 8, 1]} intensity={10} angle={0.34} penumbra={0.8} distance={20} color="#ffffff" />
        <Sparkles count={90} scale={16} size={2} speed={0.25} color="#ffffff" opacity={0.4} />
        <Environment preset="city" />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.4))]" />
    </div>
  );
}
