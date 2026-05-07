'use client';

/**
 * Top-level R3F canvas for the logo wall section.
 * Faithful port of shoe-finder/src/components/grid/ShoeGrid.jsx:
 *   <Canvas>
 *     <Rig />
 *     <fog />
 *     <Suspense><GridCanvas /></Suspense>
 *   </Canvas>
 */

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Preload } from '@react-three/drei';
import * as THREE from 'three';

import {
  CONFIG,
  applyWallProfile,
  getWallProfile,
  type WallProfile
} from './anywhere-3d/config';
import { rigState, calculateGridDimensions } from './anywhere-3d/rigState';
import { Rig } from './anywhere-3d/Rig';
import { BrandGrid } from './anywhere-3d/BrandGrid';
import { BRAND_WALL } from './anywhere-3d/brandsData';
import { useBrandTextures } from './anywhere-3d/useBrandTexture';

export function AnywhereCanvas() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const [wallProfile, setWallProfile] = useState<WallProfile>('desktop');
  const [, forceRender] = useState(0);

  // Responsive wall profile: desktop stays cinematic, mobile gets a tighter logo field.
  useEffect(() => {
    const apply = () => {
      const profile = getWallProfile(window.innerWidth);
      applyWallProfile(profile);
      setWallProfile(profile);

      rigState.target.set(0, CONFIG.restY, 0);
      rigState.current.set(0, CONFIG.restY, 0);
      rigState.zoom = CONFIG.zoomOut;
      rigState.activeId = null;
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  // Track active selection + zoom from rigState so React re-renders when they change
  useEffect(() => {
    const id = setInterval(() => forceRender((n) => n + 1), 80);
    return () => clearInterval(id);
  }, []);

  const textures = useBrandTextures(BRAND_WALL);
  const dims = calculateGridDimensions(BRAND_WALL.length);

  return (
    <Canvas
      camera={{ position: [0, 0, CONFIG.zoomOut], fov: 45 }}
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.NoToneMapping,
        powerPreference: 'high-performance'
      }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr([1, 1.5])}
        onIncline={() => setDpr([1, 2])}
      />

      <Rig key={`rig-${wallProfile}`} gridW={dims.width} gridH={dims.height} />

      {/* Deep-ink fog so tiles far from center fade out naturally */}
      <fog attach="fog" args={[CONFIG.sceneBg, CONFIG.fogNear, CONFIG.fogFar]} />

      {textures.length === BRAND_WALL.length && (
        <Suspense fallback={null}>
          <BrandGrid
            key={`brand-grid-${wallProfile}`}
            brands={BRAND_WALL}
            textures={textures}
            gridVisible
            transitionStartTime={0}
            interactive
          />
          <Preload all />
        </Suspense>
      )}
    </Canvas>
  );
}
