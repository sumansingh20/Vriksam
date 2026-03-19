'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type PlantVariant = 'small' | 'medium' | 'large';

interface FloatingPlantProps {
  /** Position in 3D space */
  position?: [number, number, number];
  /** Plant scale variant */
  variant?: PlantVariant;
  /** Custom uniform scale */
  scale?: number;
  /** Base floating speed multiplier (default: 1) */
  speed?: number;
  /** Phase offset so multiple plants don't sync (radians) */
  phase?: number;
  /** Colour tint for the leaves (default: natural greens) */
  leafColor?: string;
  /** Stem colour override */
  stemColor?: string;
}

/* -------------------------------------------------------------------------- */
/*  Variant presets                                                           */
/* -------------------------------------------------------------------------- */

const VARIANT_CONFIG: Record<
  PlantVariant,
  { stemHeight: number; stemRadius: number; leafCount: number; leafScale: number; baseScale: number }
> = {
  small:  { stemHeight: 0.6,  stemRadius: 0.04, leafCount: 3, leafScale: 0.28, baseScale: 0.7 },
  medium: { stemHeight: 1.0,  stemRadius: 0.06, leafCount: 5, leafScale: 0.4,  baseScale: 1.0 },
  large:  { stemHeight: 1.5,  stemRadius: 0.08, leafCount: 7, leafScale: 0.55, baseScale: 1.3 },
};

/* -------------------------------------------------------------------------- */
/*  Leaf geometry helper (curved plane)                                       */
/* -------------------------------------------------------------------------- */

function useLeafGeometry(width: number, height: number, curve: number) {
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, 8, 8);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curve along x-axis to give a natural leaf bowl shape
      const zOffset = curve * Math.pow(x / (width / 2), 2);
      // Slight droop at the tip
      const droop = 0.08 * Math.pow(y / (height / 2), 2);
      pos.setZ(i, zOffset - droop);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, height, curve]);
}

/* -------------------------------------------------------------------------- */
/*  Single Leaf                                                               */
/* -------------------------------------------------------------------------- */

interface LeafProps {
  rotation: [number, number, number];
  position: [number, number, number];
  scale: number;
  color: string;
}

function Leaf({ rotation, position, scale, color }: LeafProps) {
  const geo = useLeafGeometry(1, 1.6, 0.25);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide,
        roughness: 0.45,
        metalness: 0.08,
        emissive: new THREE.Color(color).multiplyScalar(0.12),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.94,
        envMapIntensity: 0.6,
      }),
    [color],
  );

  return (
    <mesh
      geometry={geo}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating Plant                                                            */
/* -------------------------------------------------------------------------- */

export function FloatingPlant({
  position = [0, 0, 0],
  variant = 'medium',
  scale: customScale,
  speed = 1,
  phase = 0,
  leafColor = '#22c55e',
  stemColor = '#15803d',
}: FloatingPlantProps) {
  const groupRef = useRef<THREE.Group>(null);

  const config = VARIANT_CONFIG[variant];
  const finalScale = customScale ?? config.baseScale;

  /* ---- Stem geometry & material (memoised) ---- */
  const stemGeo = useMemo(
    () => new THREE.CylinderGeometry(config.stemRadius * 0.6, config.stemRadius, config.stemHeight, 8),
    [config],
  );
  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: stemColor,
        roughness: 0.7,
        metalness: 0.0,
        emissive: new THREE.Color(stemColor).multiplyScalar(0.1),
        emissiveIntensity: 0.3,
      }),
    [stemColor],
  );

  /* ---- Leaf arrangement (memoised) ---- */
  const leaves = useMemo(() => {
    const items: { rotation: [number, number, number]; position: [number, number, number]; scale: number; color: string }[] = [];
    const greens = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#15803d'];

    for (let i = 0; i < config.leafCount; i++) {
      const angle = (i / config.leafCount) * Math.PI * 2;
      const heightFraction = 0.6 + (i / config.leafCount) * 0.4;
      const y = config.stemHeight * heightFraction - config.stemHeight / 2;
      const spread = 0.15 + (1 - heightFraction) * 0.1;

      items.push({
        rotation: [
          -0.3 - Math.random() * 0.4,          // tilt outward
          angle,                                 // radial placement
          (Math.random() - 0.5) * 0.2,          // tiny random twist
        ],
        position: [
          Math.cos(angle) * spread,
          y,
          Math.sin(angle) * spread,
        ],
        scale: config.leafScale * (0.8 + Math.random() * 0.4),
        color: leafColor === '#22c55e' ? (greens[i % greens.length] ?? '#22c55e') : leafColor,
      });
    }
    return items;
  }, [config, leafColor]);

  /* ---- Animation: organic multi-frequency float + natural sway ---- */
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * speed;

    // Multi-frequency bobbing (more natural, less mechanical)
    const primaryBob = Math.sin(t * 0.8 + phase) * 0.12;
    const secondaryBob = Math.sin(t * 1.6 + phase * 1.3) * 0.04;
    const tertiaryBob = Math.sin(t * 2.4 + phase * 0.7) * 0.015;
    groupRef.current.position.y = position[1] + primaryBob + secondaryBob + tertiaryBob;

    // Wind-sway effect with slight drift
    groupRef.current.rotation.y = Math.sin(t * 0.25 + phase) * 0.12 + t * 0.03;
    groupRef.current.rotation.z = Math.sin(t * 0.35 + phase * 1.2) * 0.04;
    groupRef.current.rotation.x = Math.cos(t * 0.28 + phase * 0.9) * 0.025;

    // Subtle breathing scale effect
    const breathe = 1 + Math.sin(t * 0.5 + phase * 0.5) * 0.015;
    groupRef.current.scale.setScalar(finalScale * breathe);
  });

  return (
    <group ref={groupRef} position={position} scale={finalScale}>
      {/* Stem */}
      <mesh geometry={stemGeo} material={stemMat} />

      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}

      {/* Tiny glow at the centre */}
      <pointLight
        position={[0, config.stemHeight * 0.3, 0]}
        color="#4ade80"
        intensity={0.15}
        distance={2}
        decay={2}
      />
    </group>
  );
}

export default FloatingPlant;
