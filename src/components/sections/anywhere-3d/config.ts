/**
 * Based on shoe-finder/src/components/grid/gridConfig.js, then tuned for the
 * SpeakToText logo wall: tight logo field, curved proof surface, no dimming.
 */

export const DEFAULT_CONFIG = {
  gridCols: 12,
  itemSize: 2.44,
  gap: 0.15,

  // Physics
  dragSpeed: 2.2,
  dampFactor: 0.2,
  tiltFactor: 0.08,
  clickThreshold: 5,
  dragResistance: 0.25,

  // Camera / Zoom
  zoomIn: 12,
  zoomOut: 39,
  restY: 4.15,
  zoomDamp: 0.25,

  // Visuals
  focusScale: 2.05,
  dimScale: 1,
  dimOpacity: 1,
  pushRadius: 7.4,
  pushStrength: 1.2,
  pushDamp: 0.12,

  // 3D Curvature Effect
  curvatureStrength: 0.052,
  edgeCurveStrength: 1.35,
  edgeCurvePower: 2.2,
  rotationStrength: 0.12,

  // Culling
  cullDistance: 28,

  // Fog: dark palette for our site
  fogNear: 58,
  fogFar: 170,

  // Animation
  enterStartOpacity: 0.0,
  enterStartZ: -50,
  exitEndZ: 20,
  transitionZDamp: 0.25,
  enterOpacityDamp: 0.85,
  exitOpacityDamp: 0.15,
  enterStaggerDelay: 400,
  exitStaggerDelay: 300,
  cleanupTimeout: 700,
  exitSpreadY: 0.5,
  enterSpreadY: 1,
  transitionYDamp: 0.08,
  filterOpacityDamp: 0.06,
  filterScaleTarget: 0.5,

  // Topography background
  bgColor: '#D4A548',
  bgOpacity: 0.34,
  bgSpeed: 0.038,
  bgScale: 3.2,
  bgLineThickness: 0.026,

  // Scene colors (dark theme)
  sceneBg: '#05070D'
};

export const CONFIG: typeof DEFAULT_CONFIG = { ...DEFAULT_CONFIG };

export type WallProfile = 'desktop' | 'mobile';

const WALL_PROFILES: Record<WallProfile, Partial<typeof DEFAULT_CONFIG>> = {
  desktop: {},
  mobile: {
    gridCols: 9,
    itemSize: 2.1,
    gap: 0.12,
    zoomOut: 46,
    restY: 4,
    focusScale: 1.76,
    pushRadius: 5.7,
    pushStrength: 0.88,
    cullDistance: 24,
    curvatureStrength: 0.052,
    edgeCurveStrength: 1.15,
    fogNear: 54,
    fogFar: 155,
    bgOpacity: 0.3
  }
};

export function getWallProfile(width: number): WallProfile {
  return width < 768 ? 'mobile' : 'desktop';
}

export function applyWallProfile(profile: WallProfile) {
  Object.assign(CONFIG, DEFAULT_CONFIG, WALL_PROFILES[profile]);
}
