'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface GreenCityProps {
  /** Number of buildings to generate */
  buildingCount?: number;
  /** City footprint half-size */
  citySize?: number;
  /** Enable slow auto-rotation (default: true) */
  autoRotate?: boolean;
  /** Rotation speed in rad/s (default: 0.08) */
  rotateSpeed?: number;
}

/* -------------------------------------------------------------------------- */
/*  Seeded random helpers                                                     */
/* -------------------------------------------------------------------------- */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* -------------------------------------------------------------------------- */
/*  Building data generator                                                   */
/* -------------------------------------------------------------------------- */

interface BuildingData {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  roofGreen: boolean;
}

function generateBuildings(count: number, citySize: number): BuildingData[] {
  const rng = seededRandom(42);
  const buildings: BuildingData[] = [];
  const gridStep = (citySize * 2) / Math.ceil(Math.sqrt(count));

  for (let i = 0; i < count; i++) {
    const col = i % Math.ceil(Math.sqrt(count));
    const row = Math.floor(i / Math.ceil(Math.sqrt(count)));

    const baseX = -citySize + col * gridStep + gridStep * 0.5;
    const baseZ = -citySize + row * gridStep + gridStep * 0.5;

    // Jitter
    const x = baseX + (rng() - 0.5) * gridStep * 0.4;
    const z = baseZ + (rng() - 0.5) * gridStep * 0.4;

    const width = 0.3 + rng() * 0.5;
    const depth = 0.3 + rng() * 0.5;
    const height = 0.5 + rng() * 2.8;
    const roofGreen = rng() > 0.25; // 75% have green roofs

    buildings.push({ x, z, width, depth, height, roofGreen });
  }
  return buildings;
}

/* -------------------------------------------------------------------------- */
/*  Tree component (simple low-poly)                                          */
/* -------------------------------------------------------------------------- */

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

function Tree({ position, scale = 1 }: TreeProps) {
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.05, 0.3, 6), []);
  const canopyGeo = useMemo(() => new THREE.SphereGeometry(0.15, 6, 5), []);

  const trunkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#92400e', roughness: 0.9 }),
    [],
  );
  const canopyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#22c55e',
        roughness: 0.7,
        emissive: '#16a34a',
        emissiveIntensity: 0.15,
      }),
    [],
  );

  return (
    <group position={position} scale={scale}>
      <mesh geometry={trunkGeo} material={trunkMat} position={[0, 0.15, 0]} />
      <mesh geometry={canopyGeo} material={canopyMat} position={[0, 0.38, 0]} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Building component                                                        */
/* -------------------------------------------------------------------------- */

interface BuildingMeshProps {
  data: BuildingData;
}

const BUILDING_COLORS = ['#64748b', '#94a3b8', '#475569', '#78716c', '#a8a29e'];

function BuildingMesh({ data }: BuildingMeshProps) {
  const bodyGeo = useMemo(
    () => new THREE.BoxGeometry(data.width, data.height, data.depth),
    [data.width, data.height, data.depth],
  );

  const colorIndex = Math.abs(Math.round(data.x * 7 + data.z * 13)) % BUILDING_COLORS.length;

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: BUILDING_COLORS[colorIndex],
        roughness: 0.6,
        metalness: 0.1,
      }),
    [colorIndex],
  );

  const roofGeo = useMemo(
    () => new THREE.BoxGeometry(data.width * 0.95, 0.08, data.depth * 0.95),
    [data.width, data.depth],
  );

  const roofMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: data.roofGreen ? '#22c55e' : '#9ca3af',
        roughness: 0.5,
        emissive: data.roofGreen ? '#16a34a' : '#000000',
        emissiveIntensity: data.roofGreen ? 0.2 : 0,
      }),
    [data.roofGreen],
  );

  return (
    <group position={[data.x, data.height / 2, data.z]}>
      <mesh geometry={bodyGeo} material={bodyMat} castShadow receiveShadow />
      <mesh geometry={roofGeo} material={roofMat} position={[0, data.height / 2 + 0.04, 0]} />

      {/* Small tree on green roofs */}
      {data.roofGreen && data.height > 1.2 && (
        <Tree
          position={[
            (Math.sin(data.x * 10) * data.width) / 4,
            data.height / 2 + 0.08,
            (Math.cos(data.z * 10) * data.depth) / 4,
          ]}
          scale={0.6}
        />
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ground plane with grid                                                    */
/* -------------------------------------------------------------------------- */

interface GroundProps {
  size: number;
}

function Ground({ size }: GroundProps) {
  const gridGeo = useMemo(() => new THREE.PlaneGeometry(size * 2.4, size * 2.4), [size]);
  const gridMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d1fae5',
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );

  return (
    <>
      {/* Ground */}
      <mesh
        geometry={gridGeo}
        material={gridMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      />

      {/* Grid lines */}
      <gridHelper
        args={[size * 2.4, Math.floor(size * 4), '#86efac', '#bbf7d0']}
        position={[0, 0.01, 0]}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trees scattered around the city                                           */
/* -------------------------------------------------------------------------- */

function ScatteredTrees({ citySize }: { citySize: number }) {
  const trees = useMemo(() => {
    const rng = seededRandom(99);
    const items: { pos: [number, number, number]; s: number }[] = [];
    const treeCount = 20;

    for (let i = 0; i < treeCount; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = citySize * 0.5 + rng() * citySize * 0.7;
      items.push({
        pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        s: 0.6 + rng() * 0.8,
      });
    }
    return items;
  }, [citySize]);

  return (
    <>
      {trees.map((tree, i) => (
        <Tree key={i} position={tree.pos} scale={tree.s} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Green City                                                                */
/* -------------------------------------------------------------------------- */

export function GreenCity({
  buildingCount = 36,
  citySize = 3,
  autoRotate = true,
  rotateSpeed = 0.08,
}: GreenCityProps) {
  const groupRef = useRef<THREE.Group>(null);

  const buildings = useMemo(
    () => generateBuildings(buildingCount, citySize),
    [buildingCount, citySize],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * rotateSpeed;
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <Ground size={citySize} />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <BuildingMesh key={i} data={b} />
      ))}

      {/* Scattered trees */}
      <ScatteredTrees citySize={citySize} />

      {/* City lighting */}
      <pointLight position={[0, 5, 0]} color="#fef9c3" intensity={0.3} distance={15} />
    </group>
  );
}

export default GreenCity;
