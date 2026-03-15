'use client';

import React, { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';

/* -------------------------------------------------------------------------- */
/*  Loading fallback (shown while 3D assets stream in)                        */
/* -------------------------------------------------------------------------- */

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
        <p className="text-sm text-green-700">Loading 3D scene&hellip;</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Default lighting rig                                                      */
/* -------------------------------------------------------------------------- */

function DefaultLighting() {
  return (
    <>
      {/* Soft green ambient fill */}
      <ambientLight intensity={0.35} color="#a7f3d0" />

      {/* Warm key light from above-right */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.8}
        color="#fefce8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cool fill from the left */}
      <directionalLight position={[-4, 3, -2]} intensity={0.25} color="#bae6fd" />

      {/* Subtle green rim from below */}
      <pointLight position={[0, -4, 0]} intensity={0.2} color="#4ade80" />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Post-processing effects                                                   */
/* -------------------------------------------------------------------------- */

function PostEffects({
  bloomIntensity = 0.35,
  bloomThreshold = 0.8,
  bloomSmoothing = 0.4,
}: {
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomSmoothing?: number;
}) {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={bloomSmoothing}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.15} darkness={0.25} />
    </EffectComposer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

interface SceneProps {
  children: ReactNode;
  /** CSS class for the outer wrapper */
  className?: string;
  /** Show orbit controls (default: true) */
  orbit?: boolean;
  /** Camera field of view (default: 50) */
  fov?: number;
  /** Camera position (default: [0,0,8]) */
  cameraPosition?: [number, number, number];
  /** Enable post-processing bloom (default: true) */
  bloom?: boolean;
  /** Bloom intensity override */
  bloomIntensity?: number;
  /** Show environment map (default: false) */
  environment?: boolean;
  /** Background colour (default: transparent) */
  background?: string;
  /** Fog colour & near/far (default: none) */
  fog?: { color: string; near: number; far: number };
  /** Flat shading / toneMapping (default: true) */
  flat?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export function Scene({
  children,
  className = '',
  orbit = true,
  fov = 50,
  cameraPosition = [0, 0, 8],
  bloom = true,
  bloomIntensity,
  environment = false,
  background,
  fog,
  flat = false,
}: SceneProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: cameraPosition, fov, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          flat={flat}
          gl={{
            antialias: true,
            alpha: !background,
            powerPreference: 'high-performance',
          }}
          style={{
            background: background ?? 'transparent',
          }}
        >
          {/* Performance helpers */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Optional fog */}
          {fog && <fog attach="fog" args={[fog.color, fog.near, fog.far]} />}

          {/* Lighting */}
          <DefaultLighting />

          {/* Optional HDRI environment */}
          {environment && <Environment preset="forest" />}

          {/* Controls */}
          {orbit && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              autoRotate
              autoRotateSpeed={0.3}
            />
          )}

          {/* Post-processing */}
          {bloom && <PostEffects bloomIntensity={bloomIntensity} />}

          {/* Scene content */}
          {children}

          {/* Preload all assets */}
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default Scene;
