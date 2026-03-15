'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ParticleFieldProps {
  /** Total number of particles */
  count?: number;
  /** Bounding box half-extent for particle spread */
  spread?: number;
  /** Base particle size */
  size?: number;
  /** Colour palette for particles */
  colors?: string[];
  /** Overall drift speed multiplier */
  speed?: number;
  /** Enable leaf-shaped particles for a subset (default: true) */
  enableLeaves?: boolean;
  /** Opacity range [min, max] */
  opacityRange?: [number, number];
}

/* -------------------------------------------------------------------------- */
/*  Custom shader material for depth-fade + varying opacity                   */
/* -------------------------------------------------------------------------- */

const VERTEX_SHADER = /* glsl */ `
  attribute float aOpacity;
  attribute float aScale;
  varying float vOpacity;
  varying float vDepth;

  void main() {
    vOpacity = aOpacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_PointSize = aScale * (150.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uMaxDepth;
  varying float vOpacity;
  varying float vDepth;

  void main() {
    // Circular soft particle
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d);

    // Depth-based fade
    float depthFade = 1.0 - smoothstep(0.0, uMaxDepth, vDepth);

    gl_FragColor = vec4(uColor, alpha * vOpacity * depthFade);
  }
`;

/* -------------------------------------------------------------------------- */
/*  Leaf-shaped particles (instancedMesh for a subset)                        */
/* -------------------------------------------------------------------------- */

interface LeafParticlesProps {
  count: number;
  spread: number;
  speed: number;
}

function LeafParticles({ count, spread, speed }: LeafParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const leafGeo = useMemo(() => {
    const shape = new THREE.Shape();
    // Simple leaf outline
    shape.moveTo(0, -0.5);
    shape.quadraticCurveTo(0.3, -0.15, 0.15, 0.3);
    shape.quadraticCurveTo(0, 0.55, 0, 0.5);
    shape.quadraticCurveTo(0, 0.55, -0.15, 0.3);
    shape.quadraticCurveTo(-0.3, -0.15, 0, -0.5);
    const geo = new THREE.ShapeGeometry(shape, 4);
    geo.scale(0.08, 0.08, 0.08);
    return geo;
  }, []);

  const leafMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4ade80',
        emissive: '#22c55e',
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.6,
        metalness: 0.0,
      }),
    [],
  );

  // Initial transforms
  const offsets = useMemo(() => {
    const data: { x: number; y: number; z: number; rx: number; ry: number; speedY: number; speedR: number }[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * spread * 2,
        y: (Math.random() - 0.5) * spread * 2,
        z: (Math.random() - 0.5) * spread * 2,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        speedY: 0.15 + Math.random() * 0.3,
        speedR: 0.3 + Math.random() * 0.5,
      });
    }
    return data;
  }, [count, spread]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;

    for (let i = 0; i < count; i++) {
      const o = offsets[i];
      if (!o) continue;
      dummy.position.set(
        o.x + Math.sin(t * 0.2 + o.rx) * 0.3,
        o.y + Math.sin(t * o.speedY + o.ry) * 0.4,
        o.z + Math.cos(t * 0.15 + o.rx) * 0.2,
      );
      dummy.rotation.set(
        o.rx + t * o.speedR * 0.3,
        o.ry + t * o.speedR * 0.2,
        Math.sin(t * 0.4 + o.rx) * 0.5,
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[leafGeo, leafMat, count]} frustumCulled={false} />
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Point-based particles                                                */
/* -------------------------------------------------------------------------- */

export function ParticleField({
  count = 500,
  spread = 6,
  size = 0.04,
  colors = ['#4ade80', '#22c55e', '#86efac', '#a7f3d0'],
  speed = 1,
  enableLeaves = true,
  opacityRange = [0.25, 0.85],
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  /* ---- Particle attribute buffers (memoised) ---- */
  const { positions, opacities, scales, basePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const opa = new Float32Array(count);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread * 2;
      const y = (Math.random() - 0.5) * spread * 2;
      const z = (Math.random() - 0.5) * spread * 2;

      const i3 = i * 3;
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      basePos[i3] = x;
      basePos[i3 + 1] = y;
      basePos[i3 + 2] = z;

      opa[i] = opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]);
      scl[i] = size * (0.4 + Math.random() * 1.2);
    }
    return { positions: pos, opacities: opa, scales: scl, basePositions: basePos };
  }, [count, spread, size, opacityRange]);

  /* ---- Pick a single base colour for the shader ---- */
  const baseColor = useMemo(() => new THREE.Color(colors[0] ?? '#4ade80'), [colors]);

  /* ---- Shader material ---- */
  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uColor: { value: baseColor },
          uMaxDepth: { value: spread * 2.5 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [baseColor, spread],
  );

  /* ---- Animate positions each frame ---- */
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!posAttr) return;

    const t = clock.getElapsedTime() * speed;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const bx = basePositions[i3] ?? 0;
      const by = basePositions[i3 + 1] ?? 0;
      const bz = basePositions[i3 + 2] ?? 0;

      // Organic drifting motion using overlapping sine waves
      posAttr.setXYZ(
        i,
        bx + Math.sin(t * 0.3 + by * 0.5) * 0.2 + Math.cos(t * 0.15 + bz) * 0.1,
        by + Math.sin(t * 0.25 + bx * 0.4) * 0.25 + Math.cos(t * 0.4 + bz * 0.3) * 0.08,
        bz + Math.cos(t * 0.2 + bx * 0.3) * 0.15,
      );
    }
    posAttr.needsUpdate = true;
  });

  /* ---- Geometry with custom attributes ---- */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, opacities, scales]);

  const leafCount = enableLeaves ? Math.max(10, Math.floor(count * 0.06)) : 0;

  return (
    <group>
      {/* Point-based particles */}
      <points ref={pointsRef} geometry={geometry} material={shaderMat} frustumCulled={false} />

      {/* Instanced leaf-shaped particles */}
      {leafCount > 0 && <LeafParticles count={leafCount} spread={spread} speed={speed} />}
    </group>
  );
}

export default ParticleField;
