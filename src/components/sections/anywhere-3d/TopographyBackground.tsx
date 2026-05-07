'use client';

/**
 * Isoline topography background ported from shoe-finder/src/components/TopologyBackground.jsx
 * and shoe-finder/src/shaders/topography.(vert|frag).
 *
 * shoe-finder uses glslify to `require('glsl-noise/simplex/2d')`. Next.js doesn't ship that
 * loader, so the simplex noise function is inlined directly in the fragment shader.
 */

import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Plane, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Simplex 2D noise, public domain, by Ian McEwan / Stefan Gustavson
// Reproduced inline so no external GLSL require() is needed.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform float uOpacity;
  uniform float uLineOpacity;
  uniform float uScale;
  uniform float uLineThickness;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 noiseUv = uv;
    noiseUv.x *= aspect;

    // Elliptical fade, soft radial mask
    vec2 centeredUv = uv - 0.5;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    float radius = 0.75;
    float mask = 1.0 - smoothstep(radius - 0.2, radius + 0.05, dist);

    // Noise
    float n = snoise(noiseUv * uScale + uTime * 0.05);

    // Isolines
    float lines = fract(n * 5.0);
    float pattern = smoothstep(0.5 - uLineThickness, 0.5, lines)
                  - smoothstep(0.5, 0.5 + uLineThickness, lines);

    // Grain
    float grain = (fract(sin(dot(vUv, vec2(12.9898, 78.233) * 2.0)) * 43758.5453) - 0.5) * 0.1;

    vec3 finalColor = uColor + grain;
    gl_FragColor = vec4(finalColor, pattern * uLineOpacity * mask * uOpacity);
  }
`;

const TopographyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#D4A548'),
    uResolution: new THREE.Vector2(1, 1),
    uOpacity: 1.0,
    uLineOpacity: 0.25,
    uScale: 3.2,
    uLineThickness: 0.035
  },
  vertexShader,
  fragmentShader
);

extend({ TopographyMaterial });

import type { Object3DNode } from '@react-three/fiber';
declare module '@react-three/fiber' {
  interface ThreeElements {
    topographyMaterial: Object3DNode<
      InstanceType<typeof TopographyMaterial>,
      typeof TopographyMaterial
    > & {
      uTime?: number;
      uColor?: THREE.Color;
      uResolution?: THREE.Vector2;
      uOpacity?: number;
      uLineOpacity?: number;
      uScale?: number;
      uLineThickness?: number;
      transparent?: boolean;
      depthWrite?: boolean;
    };
  }
}

export function TopographyBackground({
  isZoomedIn = false,
  color = '#D4A548',
  opacity = 0.22,
  speed = 0.04,
  scale = 3.2,
  lineThickness = 0.035
}: {
  isZoomedIn?: boolean;
  color?: string;
  opacity?: number;
  speed?: number;
  scale?: number;
  lineThickness?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  const planeWidth = 112;
  const planeHeight = 63;

  useFrame((_, delta) => {
    const m = materialRef.current;
    if (!m) return;
    m.uTime += delta * (speed / 0.05);
    m.uResolution.set(planeWidth, planeHeight);
    m.uColor.set(color);
    m.uLineOpacity = opacity;
    m.uScale = scale;
    m.uLineThickness = lineThickness;
    const targetOpacity = isZoomedIn ? 0.3 : 1.0;
    easing.damp(m, 'uOpacity', targetOpacity, 0.3, delta);
  });

  return (
    <Plane args={[planeWidth, planeHeight]} position={[0, 0, -17]} renderOrder={-1}>
      <topographyMaterial ref={materialRef} transparent depthWrite={false} />
    </Plane>
  );
}
