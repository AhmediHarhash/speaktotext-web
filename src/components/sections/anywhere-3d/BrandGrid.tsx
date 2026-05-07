'use client';

/**
 * Ported from shoe-finder/src/components/grid/GridCanvas.jsx.
 * Lays out items in a grid, pre-computes positions, and uses time-sliced mounting
 * to prevent GPU texture upload spikes on entry.
 */

import { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { CONFIG } from './config';
import { calculateGridDimensions, rigState } from './rigState';
import { BrandTile } from './BrandTile';
import type { BrandItem } from './brandsData';

type MappedItem = {
  brand: BrandItem;
  index: number;
  randomDelay: number;
  basePos: { x: number; y: number };
};

function deterministicDelay(index: number) {
  const wave = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return wave - Math.floor(wave);
}

export function BrandGrid({
  brands,
  textures,
  gridVisible,
  transitionStartTime,
  interactive
}: {
  brands: BrandItem[];
  textures: THREE.Texture[];
  gridVisible: boolean;
  transitionStartTime: number;
  interactive: boolean;
}) {
  const { mappedItems, gridDims } = useMemo(() => {
    const spacing = CONFIG.itemSize + CONFIG.gap;
    const dims = calculateGridDimensions(brands.length);
    const maxDelay = gridVisible ? CONFIG.enterStaggerDelay : CONFIG.exitStaggerDelay;

    const slots = brands
      .map((_, i) => {
        const col = i % CONFIG.gridCols;
        const row = Math.floor(i / CONFIG.gridCols);
        const targetPos = {
          x: col * spacing - dims.width / 2 + spacing / 2,
          y: -(row * spacing) + dims.height / 2 - spacing / 2
        };
        const distance = Math.hypot(targetPos.x, targetPos.y);
        const angle = Math.atan2(targetPos.y, targetPos.x);
        return { targetPos, distance, angle };
      })
      .sort((a, b) => a.distance - b.distance || a.angle - b.angle);

    const mapped: MappedItem[] = brands.map((brand, i) => {
      const { targetPos } = slots[i];
        return {
        brand,
        index: i,
        randomDelay: deterministicDelay(i) * maxDelay,
        basePos: targetPos
      };
    });

    return { mappedItems: mapped, gridDims: dims };
  }, [brands, gridVisible]);

  const activeBasePos =
    rigState.activeId === null
      ? null
      : mappedItems.find((item) => item.index === rigState.activeId)?.basePos ?? null;

  // --- Time-sliced mounting ---
  const [mountedCount, setMountedCount] = useState(
    gridVisible ? 0 : brands.length
  );
  useFrame(() => {
    if (mountedCount < mappedItems.length) {
      setMountedCount((prev) => Math.min(prev + 5, mappedItems.length));
    }
  });

  return (
    <>
      {mappedItems.map((item, i) => {
        if (i > mountedCount) return null;
        const texture = textures[i];
        if (!texture) return null;
        return (
          <BrandTile
            key={item.brand.id}
            brand={item.brand}
            index={item.index}
            basePos={item.basePos}
            gridVisible={gridVisible}
            transitionStartTime={transitionStartTime}
            interactive={interactive}
            gridHeight={gridDims.height}
            gridWidth={gridDims.width}
            texture={texture}
            randomDelay={item.randomDelay}
            activeBasePos={activeBasePos}
          />
        );
      })}
    </>
  );
}
