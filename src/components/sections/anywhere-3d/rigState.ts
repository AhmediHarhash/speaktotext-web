/** Ported 1:1 from shoe-finder/src/components/grid/gridState.js */

import * as THREE from 'three';
import { CONFIG } from './config';

export const rigState = {
  target: new THREE.Vector3(0, CONFIG.restY, 0),
  current: new THREE.Vector3(0, CONFIG.restY, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  zoom: CONFIG.zoomOut,
  isDragging: false,
  activeId: null as number | null
};

export function calculateGridDimensions(count: number) {
  const rows = Math.ceil(count / CONFIG.gridCols);
  const spacing = CONFIG.itemSize + CONFIG.gap;
  return {
    width: CONFIG.gridCols * spacing,
    height: rows * spacing
  };
}
