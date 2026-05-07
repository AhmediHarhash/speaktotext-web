'use client';

/**
 * Loads local transparent logo assets as textures, mirroring the shoe-finder
 * approach where the product PNG itself is the object.
 */

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import type { BrandItem } from './brandsData';

const SIZE = 768;
const textureLoader = new THREE.TextureLoader();

/** Loads one local logo object and returns a GPU texture. */
export async function makeBrandTexture(brand: BrandItem): Promise<THREE.Texture> {
  const texture = await textureLoader.loadAsync(brand.iconUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  return texture;
}

/** React hook: one texture per brand, disposed on unmount. */
export function useBrandTextures(brands: BrandItem[]): THREE.Texture[] {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  useEffect(() => {
    let cancelled = false;
    const loaded: THREE.Texture[] = [];

    Promise.all(
      brands.map(async (brand) => {
        const texture = await makeBrandTexture(brand).catch(() =>
          makeFallbackTexture(brand)
        );
        if (texture) loaded.push(texture);
        return texture;
      })
    ).then((list) => {
      if (cancelled) {
        list.forEach((texture) => texture?.dispose());
        return;
      }
      setTextures(list.filter((t): t is THREE.Texture => Boolean(t)));
    });

    return () => {
      cancelled = true;
      loaded.forEach((texture) => texture.dispose());
    };
  }, [brands]);

  return textures;
}

function makeFallbackTexture(brand: BrandItem): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = hexToRgba(brand.accent, 0.18);
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE * 0.4, SIZE * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = brand.accent;
  ctx.font = `800 ${Math.round(SIZE * 0.184)}px Inter, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    brand.name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join(''),
    SIZE / 2,
    SIZE * 0.4
  );

  ctx.font = `600 ${Math.round(SIZE * 0.066)}px Inter, Arial, sans-serif`;
  ctx.fillStyle = 'rgba(232,237,245,0.86)';
  ctx.fillText(truncateName(brand.name), SIZE / 2, SIZE * 0.86, SIZE * 0.84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;
  return texture;
}

function truncateName(name: string) {
  return name.length > 17 ? `${name.slice(0, 15)}...` : name;
}

function hexToRgba(hex: string, a: number) {
  const fallback = hex.replace('#', '').length === 6 ? hex : '#E8EDF5';
  const h = fallback.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
