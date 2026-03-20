'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type PlantVariant = 'small' | 'medium' | 'large' | 'monstera' | 'fern';

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
  /** Enable glow effect */
  enableGlow?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Variant presets - enhanced for more variety                                */
/* -------------------------------------------------------------------------- */

const VARIANT_CONFIG: Record<
  PlantVariant,
  { stemHeight: number; stemRadius: number; leafCount: number; leafScale: number; baseScale: number; leafShape: 'oval' | 'monstera' | 'fern' }
> = {
  small: { stemHeight: 0.5, stemRadius: 0.03, leafCount: 4, leafScale: 0.25, baseScale: 0.6, leafShape: 'oval' },
  medium: { stemHeight: 0.9, stemRadius: 0.05, leafCount: 6, leafScale: 0.38, baseScale: 1.0, leafShape: 'oval' },
  large: { stemHeight: 1.4, stemRadius: 0.07, leafCount: 8, leafScale: 0.52, baseScale: 1.3, leafShape: 'oval' },
  monstera: { stemHeight: 1.2, stemRadius: 0.06, leafCount: 5, leafScale: 0.6, baseScale: 1.2, leafShape: 'monstera' },
  fern: { stemHeight: 0.7, stemRadius: 0.04, leafCount: 12, leafScale: 0.35, baseScale: 0.9, leafShape: 'fern' },
};

/* -------------------------------------------------------------------------- */
/*  Premium leaf shaders for realistic look                                    */
/* -------------------------------------------------------------------------- */

const leafVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const leafFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Subsurface scattering simulation
    float sss = pow(max(0.0, dot(vNormal, vec3(0.0, 1.0, 0.5))), 2.0) * 0.3;

    // Vein pattern
    float vein = smoothstep(0.48, 0.52, abs(vUv.x - 0.5));
    vein *= sin(vUv.y * 15.0) * 0.5 + 0.5;

    // Color variation
    vec3 baseColor = uColor;
    vec3 tipColor = uColor * 0.8;
    vec3 color = mix(baseColor, tipColor, vUv.y);

    // Add subtle variation
    color += sss * vec3(0.2, 0.4, 0.1);
    color = mix(color, color * 0.85, vein * 0.3);

    // Fresnel rim lighting
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    color += fresnel * vec3(0.1, 0.2, 0.1);

    gl_FragColor = vec4(color, 0.95);
  }
`;

/* -------------------------------------------------------------------------- */
/*  Leaf geometry generators                                                   */
/* -------------------------------------------------------------------------- */

function useLeafGeometry(width: number, height: number, curve: number, type: 'oval' | 'monstera' | 'fern') {
  return useMemo(() => {
    const segments = type === 'fern' ? 6 : 12;
    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    const pos = geo.attributes.position;
    if (!pos) return geo;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const normalizedX = x / (width / 2);
      const normalizedY = y / (height / 2);

      // Natural curve along x-axis
      let zOffset = curve * Math.pow(normalizedX, 2);

      // Type-specific modifications
      if (type === 'monstera') {
        // Add fenestrations (holes characteristic of monstera)
        const fenestration = Math.sin(normalizedY * 4) * 0.1 * (1 - Math.abs(normalizedX));
        zOffset += fenestration;
        // Wavy edge
        const wave = Math.sin(normalizedY * 8) * 0.05 * Math.abs(normalizedX);
        zOffset += wave;
      } else if (type === 'fern') {
        // Feathery appearance
        const feather = Math.sin(normalizedY * 12) * 0.08 * Math.abs(normalizedX);
        zOffset += feather;
      }

      // Droop at the tip
      const droop = 0.1 * Math.pow(normalizedY, 2);
      zOffset -= droop;

      // Natural curl at edges
      const curl = Math.pow(Math.abs(normalizedX), 3) * 0.15;
      zOffset += curl;

      pos.setZ(i, zOffset);
    }

    geo.computeVertexNormals();
    return geo;
  }, [width, height, curve, type]);
}

/* -------------------------------------------------------------------------- */
/*  Single Leaf with premium materials                                         */
/* -------------------------------------------------------------------------- */

interface LeafProps {
  rotation: [number, number, number];
  position: [number, number, number];
  scale: number;
  color: string;
  type: 'oval' | 'monstera' | 'fern';
  glowIntensity?: number;
}

function Leaf({ rotation, position, scale, color, type, glowIntensity = 0.5 }: LeafProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const width = type === 'fern' ? 0.6 : 1;
  const height = type === 'fern' ? 1.2 : 1.6;
  const geo = useLeafGeometry(width, height, 0.25, type);

  // Premium material with subsurface scattering simulation
  const material = useMemo(() => {
    const colorObj = new THREE.Color(color);
    return new THREE.MeshStandardMaterial({
      color: colorObj,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.05,
      emissive: colorObj.clone().multiplyScalar(0.15),
      emissiveIntensity: glowIntensity,
      transparent: true,
      opacity: 0.96,
      envMapIntensity: 0.8,
    });
  }, [color, glowIntensity]);

  // Subtle wind animation for individual leaves
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Micro-movements for realism
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 2 + position[0]) * 0.02;
    meshRef.current.rotation.x = rotation[0] + Math.cos(t * 1.5 + position[1]) * 0.015;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geo}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating Plant - Premium version                                           */
/* -------------------------------------------------------------------------- */

export function FloatingPlant({
  position = [0, 0, 0],
  variant = 'medium',
  scale: customScale,
  speed = 1,
  phase = 0,
  leafColor = '#22c55e',
  stemColor = '#15803d',
  enableGlow = true,
}: FloatingPlantProps) {
  const groupRef = useRef<THREE.Group>(null);
  const config = VARIANT_CONFIG[variant];
  const finalScale = customScale ?? config.baseScale;

  /* ---- Stem geometry & material (memoised) ---- */
  const stemGeo = useMemo(
    () => new THREE.CylinderGeometry(config.stemRadius * 0.5, config.stemRadius, config.stemHeight, 12),
    [config],
  );

  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: stemColor,
        roughness: 0.6,
        metalness: 0.05,
        emissive: new THREE.Color(stemColor).multiplyScalar(0.1),
        emissiveIntensity: 0.4,
      }),
    [stemColor],
  );

  /* ---- Leaf arrangement (memoised) with natural clustering ---- */
  const leaves = useMemo(() => {
    const items: { rotation: [number, number, number]; position: [number, number, number]; scale: number; color: string }[] = [];
    const greens = [
      '#22c55e', // emerald-500
      '#16a34a', // green-600
      '#4ade80', // green-400
      '#86efac', // green-300
      '#15803d', // green-700
      '#059669', // emerald-600
      '#10b981', // emerald-500
      '#34d399', // emerald-400
    ];

    for (let i = 0; i < config.leafCount; i++) {
      // Golden angle for natural phyllotaxis
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const angle = i * goldenAngle;
      const heightFraction = 0.5 + (i / config.leafCount) * 0.5;
      const y = config.stemHeight * heightFraction - config.stemHeight / 2;
      const spread = 0.12 + (1 - heightFraction) * 0.15;

      // Natural variation in tilt and rotation
      const tiltVariation = Math.random() * 0.3;
      const twistVariation = (Math.random() - 0.5) * 0.3;

      items.push({
        rotation: [
          -0.4 - tiltVariation,
          angle,
          twistVariation,
        ],
        position: [
          Math.cos(angle) * spread,
          y,
          Math.sin(angle) * spread,
        ],
        scale: config.leafScale * (0.7 + Math.random() * 0.5),
        color: leafColor === '#22c55e' ? (greens[i % greens.length] ?? '#22c55e') : leafColor,
      });
    }
    return items;
  }, [config, leafColor]);

  /* ---- Animation: organic multi-frequency float + natural sway ---- */
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * speed;

    // Multi-frequency organic bobbing
    const primaryBob = Math.sin(t * 0.7 + phase) * 0.15;
    const secondaryBob = Math.sin(t * 1.4 + phase * 1.2) * 0.05;
    const tertiaryBob = Math.sin(t * 2.1 + phase * 0.8) * 0.02;
    const microBob = Math.sin(t * 4 + phase * 2) * 0.005;
    groupRef.current.position.y = position[1] + primaryBob + secondaryBob + tertiaryBob + microBob;

    // Natural wind sway with drift
    groupRef.current.rotation.y = Math.sin(t * 0.2 + phase) * 0.15 + t * 0.02;
    groupRef.current.rotation.z = Math.sin(t * 0.3 + phase * 1.1) * 0.05;
    groupRef.current.rotation.x = Math.cos(t * 0.25 + phase * 0.9) * 0.03;

    // Subtle breathing scale effect
    const breathe = 1 + Math.sin(t * 0.4 + phase * 0.5) * 0.02;
    groupRef.current.scale.setScalar(finalScale * breathe);
  });

  return (
    <group ref={groupRef} position={position} scale={finalScale}>
      {/* Stem */}
      <mesh geometry={stemGeo} material={stemMat} />

      {/* Leaves with premium materials */}
      {leaves.map((leaf, i) => (
        <Leaf
          key={i}
          {...leaf}
          type={config.leafShape}
          glowIntensity={enableGlow ? 0.5 : 0.2}
        />
      ))}

      {/* Central glow light */}
      {enableGlow && (
        <pointLight
          position={[0, config.stemHeight * 0.4, 0]}
          color="#4ade80"
          intensity={0.25}
          distance={3}
          decay={2}
        />
      )}

      {/* Subtle rim light for depth */}
      <pointLight
        position={[0, config.stemHeight, 0.5]}
        color="#86efac"
        intensity={0.1}
        distance={2}
        decay={2}
      />
    </group>
  );
}

export default FloatingPlant;
