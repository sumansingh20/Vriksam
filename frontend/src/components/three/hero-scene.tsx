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
  /** Number of floating plants (default: 9) */
  plantCount?: number;
  /** Particle count (default: 400) */
  particleCount?: number;
  /** Overall scene speed multiplier */
  speed?: number;
  /** Enable cinematic camera movement */
  enableCameraMovement?: boolean;
  /** Quality preset */
  quality?: 'low' | 'medium' | 'high';
}

/* -------------------------------------------------------------------------- */
/*  Smooth cinematic camera rig                                                */
/* -------------------------------------------------------------------------- */

function CameraRig({ speed, enabled }: { speed: number; enabled: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const smoothPosition = useRef(new THREE.Vector3(8, 1.5, 8));

  useFrame(({ clock }) => {
    if (!enabled) return;

    const t = clock.getElapsedTime() * speed;
    const radius = 9;

    // Smooth figure-8 path for more interesting movement
    const targetX = Math.sin(t * 0.06) * radius;
    const targetZ = Math.cos(t * 0.06) * radius;
    const targetY = 1.8 + Math.sin(t * 0.04) * 0.8;

    // Smooth interpolation
    smoothPosition.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.01);

    camera.position.copy(smoothPosition.current);
    camera.lookAt(target);
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Atmospheric firefly lights                                                 */
/* -------------------------------------------------------------------------- */

function Fireflies({ count = 8 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const lights = useMemo(() => {
    const items: { offset: THREE.Vector3; phase: number; speed: number; color: string }[] = [];
    const colors = ['#86efac', '#4ade80', '#34d399', '#a7f3d0', '#6ee7b7'];

    for (let i = 0; i < count; i++) {
      items.push({
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          Math.random() * 4 - 1,
          (Math.random() - 0.5) * 10,
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        color: colors[i % colors.length] ?? '#86efac',
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

      // Complex path for more natural firefly movement
      const x = cfg.offset.x + Math.sin(t * cfg.speed + cfg.phase) * 2 + Math.sin(t * cfg.speed * 2.3) * 0.5;
      const y = cfg.offset.y + Math.sin(t * cfg.speed * 0.7 + cfg.phase * 1.3) * 1 + Math.cos(t * cfg.speed * 1.5) * 0.3;
      const z = cfg.offset.z + Math.cos(t * cfg.speed * 0.5 + cfg.phase) * 1.5;

      child.position.set(x, y, z);

      // Pulsing intensity
      const intensity = 0.1 + Math.sin(t * 3 + cfg.phase) * 0.05;
      (child as THREE.PointLight).intensity = intensity;
    });
  });

  return (
    <group ref={groupRef}>
      {lights.map((cfg, i) => (
        <pointLight
          key={i}
          color={cfg.color}
          intensity={0.15}
          distance={5}
          decay={2}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Atmospheric glow orbs for depth                                            */
/* -------------------------------------------------------------------------- */

function GlowOrb({
  position,
  color,
  size,
  pulseSpeed = 1,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  pulseSpeed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * pulseSpeed;

    // Multi-frequency breathing for organic feel
    const breathe = 1 +
      Math.sin(t * 0.5 + phase) * 0.1 +
      Math.sin(t * 0.9 + phase * 0.7) * 0.05 +
      Math.sin(t * 1.3 + phase * 1.2) * 0.025;

    ref.current.scale.setScalar(size * breathe);

    // Subtle position drift
    ref.current.position.y = position[1] + Math.sin(t * 0.25 + phase) * 0.2;
    ref.current.position.x = position[0] + Math.sin(t * 0.2 + phase * 1.5) * 0.1;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating sparkle particles                                                 */
/* -------------------------------------------------------------------------- */

function SparkleParticles({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      sz[i] = Math.random() * 0.02 + 0.01;
    }

    return [pos, sz];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    // Rotate slowly
    pointsRef.current.rotation.y = t * 0.02;

    // Pulse opacity
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.5 + Math.sin(t * 2) * 0.2;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#a7f3d0"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Plant arrangement generator - improved distribution                        */
/* -------------------------------------------------------------------------- */

interface PlantConfig {
  position: [number, number, number];
  variant: 'small' | 'medium' | 'large' | 'monstera' | 'fern';
  phase: number;
  speed: number;
  leafColor: string;
}

function generatePlants(count: number): PlantConfig[] {
  const plants: PlantConfig[] = [];
  const variants: ('small' | 'medium' | 'large' | 'monstera' | 'fern')[] = ['small', 'medium', 'large', 'monstera', 'fern'];
  const greens = [
    '#22c55e', // emerald-500
    '#16a34a', // green-600
    '#4ade80', // green-400
    '#10b981', // emerald-500
    '#059669', // emerald-600
    '#34d399', // emerald-400
    '#86efac', // green-300
  ];

  // Use golden angle for natural phyllotaxis distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const angle = i * goldenAngle + Math.random() * 0.3;
    const radius = 1.5 + Math.sqrt(i / count) * 3.5;
    const depthVariation = Math.random() * 0.4;

    plants.push({
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius - depthVariation * 4,
      ],
      variant: variants[i % variants.length] ?? 'medium',
      phase: i * 1.3 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 0.5,
      leafColor: greens[i % greens.length] ?? '#22c55e',
    });
  }
  return plants;
}

/* -------------------------------------------------------------------------- */
/*  Hero Scene Content                                                         */
/* -------------------------------------------------------------------------- */

export function HeroSceneContent({
  plantCount = 9,
  particleCount = 400,
  speed = 1,
  enableCameraMovement = true,
  quality = 'high',
}: HeroSceneContentProps) {
  const plants = useMemo(() => generatePlants(plantCount), [plantCount]);

  const qualitySettings = {
    low: { particleMultiplier: 0.5, glowOrbCount: 3, fireflyCount: 4 },
    medium: { particleMultiplier: 0.75, glowOrbCount: 5, fireflyCount: 6 },
    high: { particleMultiplier: 1, glowOrbCount: 7, fireflyCount: 8 },
  };

  const settings = qualitySettings[quality];

  return (
    <group>
      {/* Camera rig */}
      <CameraRig speed={speed} enabled={enableCameraMovement} />

      {/* Atmospheric fog - softer for dreamy effect */}
      <fog attach="fog" args={['#0d251a', 6, 28]} />

      {/* ===== PREMIUM CINEMATIC LIGHTING ===== */}

      {/* Ambient fill - soft base illumination */}
      <ambientLight intensity={0.2} color="#d1fae5" />

      {/* Key light - warm golden hour sun from above-right */}
      <directionalLight
        position={[10, 15, 8]}
        intensity={0.9}
        color="#fef3c7"
        castShadow
      />

      {/* Fill light - cool sky bounce from left */}
      <directionalLight
        position={[-8, 8, -5]}
        intensity={0.35}
        color="#bfdbfe"
      />

      {/* Rim/back light - emerald accent for glow effect */}
      <spotLight
        position={[0, -4, 10]}
        intensity={0.6}
        color="#34d399"
        angle={0.8}
        penumbra={0.7}
        distance={20}
        decay={2}
      />

      {/* Top accent - subtle overhead highlight */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.25}
        color="#fef9c3"
        distance={18}
        decay={2}
      />

      {/* Ground bounce light */}
      <pointLight
        position={[0, -5, 0]}
        intensity={0.1}
        color="#86efac"
        distance={12}
        decay={2}
      />

      {/* ===== PLANTS ===== */}
      {plants.map((plant, i) => (
        <FloatingPlant
          key={i}
          position={plant.position}
          variant={plant.variant}
          phase={plant.phase}
          speed={plant.speed * speed}
          leafColor={plant.leafColor}
          enableGlow={quality !== 'low'}
        />
      ))}

      {/* ===== PARTICLES ===== */}
      <ParticleField
        count={Math.floor(particleCount * settings.particleMultiplier)}
        spread={10}
        speed={speed * 0.4}
        size={0.025}
        enableLeaves
      />

      {/* Sparkle particles */}
      {quality !== 'low' && <SparkleParticles count={quality === 'high' ? 60 : 30} />}

      {/* ===== ATMOSPHERIC GLOW ORBS ===== */}
      <GlowOrb position={[-5, 3, -7]} color="#10b981" size={3.5} pulseSpeed={0.8} />
      <GlowOrb position={[6, -1, -9]} color="#059669" size={4} pulseSpeed={0.6} />
      <GlowOrb position={[0, 5, -10]} color="#34d399" size={4.5} pulseSpeed={0.7} />
      {quality !== 'low' && (
        <>
          <GlowOrb position={[-3, -2, -5]} color="#6ee7b7" size={2} pulseSpeed={1} />
          <GlowOrb position={[4, 4, -8]} color="#047857" size={2.5} pulseSpeed={0.9} />
        </>
      )}
      {quality === 'high' && (
        <>
          <GlowOrb position={[-6, 1, -6]} color="#a7f3d0" size={1.8} pulseSpeed={1.1} />
          <GlowOrb position={[2, -3, -4]} color="#10b981" size={2.2} pulseSpeed={0.85} />
        </>
      )}

      {/* ===== FIREFLIES ===== */}
      <Fireflies count={settings.fireflyCount} />

      {/* ===== GROUND PLANE ===== */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#0a1f14" transparent opacity={0.4} />
      </mesh>

      {/* Fog plane for depth */}
      <mesh position={[0, 0, -15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial color="#0d251a" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { HeroSceneContent as HeroScene };
export default HeroSceneContent;
