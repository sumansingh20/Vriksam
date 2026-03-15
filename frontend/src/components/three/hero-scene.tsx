'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FloatingPlant } from './floating-plant';
import { ParticleField } from './particle-field';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface HeroSceneContentProps {
  /** Number of floating plants (default: 7) */
  plantCount?: number;
  /** Particle count (default: 350, kept low for perf) */
  particleCount?: number;
  /** Overall scene speed multiplier */
  speed?: number;
}

/* -------------------------------------------------------------------------- */
/*  Slow-orbiting camera rig                                                  */
/* -------------------------------------------------------------------------- */

function CameraRig({ speed }: { speed: number }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const radius = 8;
    const x = Math.sin(t * 0.08) * radius;
    const z = Math.cos(t * 0.08) * radius;
    const y = 1.5 + Math.sin(t * 0.05) * 0.5;

    camera.position.set(x, y, z);
    camera.lookAt(target);
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Ambient firefly lights                                                    */
/* -------------------------------------------------------------------------- */

function Fireflies({ count = 5 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const lights = useMemo(() => {
    const items: { offset: THREE.Vector3; phase: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          Math.random() * 3 - 0.5,
          (Math.random() - 0.5) * 8,
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
      });
    }
    return items;
  }, [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const cfg = lights[i];
      if (!cfg) return;
      child.position.set(
        cfg.offset.x + Math.sin(t * cfg.speed + cfg.phase) * 1.5,
        cfg.offset.y + Math.sin(t * cfg.speed * 0.7 + cfg.phase * 1.3) * 0.8,
        cfg.offset.z + Math.cos(t * cfg.speed * 0.5 + cfg.phase) * 1.2,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {lights.map((_, i) => (
        <pointLight
          key={i}
          color="#86efac"
          intensity={0.12}
          distance={4}
          decay={2}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Glowing background orbs for depth                                         */
/* -------------------------------------------------------------------------- */

function GlowOrb({
  position,
  color,
  size,
}: {
  position: [number, number, number];
  color: string;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(size + Math.sin(t * 0.8) * size * 0.1);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Plant arrangement generator                                               */
/* -------------------------------------------------------------------------- */

interface PlantConfig {
  position: [number, number, number];
  variant: 'small' | 'medium' | 'large';
  phase: number;
  speed: number;
  leafColor: string;
}

function generatePlants(count: number): PlantConfig[] {
  const plants: PlantConfig[] = [];
  const variants: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  const greens = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#10b981'];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 1.5 + Math.random() * 3;
    const depthLayer = Math.random();

    plants.push({
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius - depthLayer * 3,
      ],
      variant: variants[i % 3] ?? 'medium',
      phase: i * 1.1,
      speed: 0.6 + Math.random() * 0.6,
      leafColor: greens[i % greens.length] ?? '#22c55e',
    });
  }
  return plants;
}

/* -------------------------------------------------------------------------- */
/*  Hero Scene Content (renders inside a <Scene> Canvas)                      */
/* -------------------------------------------------------------------------- */

export function HeroSceneContent({
  plantCount = 7,
  particleCount = 350,
  speed = 1,
}: HeroSceneContentProps) {
  const plants = useMemo(() => generatePlants(plantCount), [plantCount]);

  return (
    <group>
      {/* Camera rig for slow orbit */}
      <CameraRig speed={speed} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a2a1a', 4, 18]} />

      {/* Ambient fill lighting */}
      <ambientLight intensity={0.25} color="#a7f3d0" />
      <directionalLight position={[3, 6, 2]} intensity={0.5} color="#fef9c3" />
      <directionalLight position={[-2, 3, -4]} intensity={0.2} color="#bae6fd" />

      {/* Floating plants at various depths */}
      {plants.map((plant, i) => (
        <FloatingPlant
          key={i}
          position={plant.position}
          variant={plant.variant}
          phase={plant.phase}
          speed={plant.speed * speed}
          leafColor={plant.leafColor}
        />
      ))}

      {/* Particle field */}
      <ParticleField
        count={particleCount}
        spread={7}
        speed={speed * 0.6}
        size={0.035}
        enableLeaves
      />

      {/* Background glow orbs for atmosphere */}
      <GlowOrb position={[-3, 2, -4]} color="#10b981" size={2.0} />
      <GlowOrb position={[4, -1, -5]} color="#059669" size={2.5} />
      <GlowOrb position={[0, 3, -6]} color="#34d399" size={3.0} />

      {/* Firefly accent lights */}
      <Fireflies count={5} />

      {/* Soft ground-level glow plane */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#0a2a1a" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Standalone export (wraps in Scene for drop-in use)                        */
/* -------------------------------------------------------------------------- */

// Lazy-import the Scene wrapper to avoid circular dependency in barrel exports
// Consumers can also render <HeroSceneContent /> directly inside their own <Scene>.
export { HeroSceneContent as HeroScene };

export default HeroSceneContent;
