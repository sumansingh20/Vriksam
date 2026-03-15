'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface PlantHealthSphereProps {
  /** Health score 0-100 */
  healthScore: number;
  /** Sphere radius (default: 1.5) */
  radius?: number;
  /** Position in 3D space */
  position?: [number, number, number];
  /** Show numeric label in centre (default: true) */
  showLabel?: boolean;
  /** Pulsing speed multiplier (default: 1) */
  pulseSpeed?: number;
}

/* -------------------------------------------------------------------------- */
/*  Colour interpolation helpers                                              */
/* -------------------------------------------------------------------------- */

const COLOR_CRITICAL = new THREE.Color('#ef4444'); // red
const COLOR_WARNING  = new THREE.Color('#eab308'); // yellow
const COLOR_HEALTHY  = new THREE.Color('#22c55e'); // green

function healthToColor(score: number): THREE.Color {
  const clamped = Math.max(0, Math.min(100, score));

  if (clamped <= 40) {
    // Red -> Yellow  (0..40)
    const t = clamped / 40;
    return new THREE.Color().lerpColors(COLOR_CRITICAL, COLOR_WARNING, t);
  }
  // Yellow -> Green (40..100)
  const t = (clamped - 40) / 60;
  return new THREE.Color().lerpColors(COLOR_WARNING, COLOR_HEALTHY, t);
}

function healthToLabel(score: number): string {
  if (score >= 70) return 'Healthy';
  if (score >= 40) return 'Attention';
  return 'Critical';
}

/* -------------------------------------------------------------------------- */
/*  Glow ring (flat torus around sphere)                                      */
/* -------------------------------------------------------------------------- */

interface GlowRingProps {
  color: THREE.Color;
  radius: number;
  pulseSpeed: number;
}

function GlowRing({ color, radius, pulseSpeed }: GlowRingProps) {
  const ringRef = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => new THREE.TorusGeometry(radius * 1.15, 0.02, 8, 64), [radius]);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      }),
    [color],
  );

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime() * pulseSpeed;
    const material = ringRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1;
    ringRef.current.rotation.z = t * 0.15;
  });

  return <mesh ref={ringRef} geometry={geo} material={mat} />;
}

/* -------------------------------------------------------------------------- */
/*  Outer glow sphere                                                         */
/* -------------------------------------------------------------------------- */

interface OuterGlowProps {
  color: THREE.Color;
  radius: number;
  pulseSpeed: number;
}

function OuterGlow({ color, radius, pulseSpeed }: OuterGlowProps) {
  const ref = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => new THREE.SphereGeometry(radius * 1.08, 24, 24), [radius]);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      }),
    [color],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * pulseSpeed;
    const scale = 1 + Math.sin(t * 1.5) * 0.04;
    ref.current.scale.setScalar(scale);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.08 + Math.sin(t * 1.5) * 0.06;
  });

  return <mesh ref={ref} geometry={geo} material={mat} />;
}

/* -------------------------------------------------------------------------- */
/*  Plant Health Sphere                                                       */
/* -------------------------------------------------------------------------- */

export function PlantHealthSphere({
  healthScore,
  radius = 1.5,
  position = [0, 0, 0],
  showLabel = true,
  pulseSpeed = 1,
}: PlantHealthSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => healthToColor(healthScore), [healthScore]);
  const emissive = useMemo(() => color.clone().multiplyScalar(0.4), [color]);
  const cssColor = useMemo(() => `#${color.getHexString()}`, [color]);
  const label = useMemo(() => healthToLabel(healthScore), [healthScore]);

  /* ---- Sphere geometry & material ---- */
  const geo = useMemo(() => new THREE.SphereGeometry(radius, 48, 48), [radius]);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.15,
        transparent: true,
        opacity: 0.88,
      }),
    [color, emissive],
  );

  /* ---- Animate: gentle pulse ---- */
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * pulseSpeed;
    const pulse = 1 + Math.sin(t * 1.5) * 0.025;
    meshRef.current.scale.setScalar(pulse);

    // Slow rotation
    meshRef.current.rotation.y = t * 0.1;

    // Update emissive intensity with pulse
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.35 + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh ref={meshRef} geometry={geo} material={mat} />

      {/* Outer glow */}
      <OuterGlow color={color} radius={radius} pulseSpeed={pulseSpeed} />

      {/* Ring */}
      <GlowRing color={color} radius={radius} pulseSpeed={pulseSpeed} />

      {/* Point light matching health colour */}
      <pointLight color={cssColor} intensity={0.5} distance={5} decay={2} />

      {/* HTML overlay label */}
      {showLabel && (
        <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center select-none">
            <span
              className="text-5xl font-bold tabular-nums drop-shadow-lg"
              style={{ color: cssColor }}
            >
              {Math.round(healthScore)}
            </span>
            <span
              className="mt-1 text-xs font-medium uppercase tracking-widest opacity-80"
              style={{ color: cssColor }}
            >
              {label}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

export default PlantHealthSphere;
