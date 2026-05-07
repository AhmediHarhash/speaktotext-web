/**
 * Holographic card shader ported from shoe-finder/src/shaders/holocard.(vert|frag)
 * and shoe-finder/src/components/HoloCardMaterial.js.
 *
 * GLSL is inlined as template literals so Next.js doesn't need a webpack loader.
 */

import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uActive;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // "Breathing" only when active
    float breath = sin(uTime * 2.0) * 0.015 * uActive;
    float scale = 1.0 + breath;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos * scale, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uActive;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    vec3 baseColor = texColor.rgb;

    if (uActive < 0.01) {
      gl_FragColor = vec4(baseColor, texColor.a * uOpacity);
      return;
    }

    // Light band sweep driven by uActive transition (0 -> 1)
    float diagonal = (vUv.x * 0.8) + vUv.y;
    float sheenPos = uActive * 2.5;
    float sheenWidth = 0.55;

    float dist = abs(diagonal - sheenPos);
    float intensity = 1.0 - smoothstep(0.0, sheenWidth, dist);
    intensity = pow(intensity, 3.0);

    // Fade the sheen as uActive completes the sweep
    float sheenFade = 1.0 - smoothstep(0.7, 1.0, uActive);

    // Warm gold sheen (matches site palette)
    vec3 sheenColor = vec3(1.0, 0.84, 0.42) * intensity * 0.9 * sheenFade;
    vec3 finalColor = baseColor + sheenColor * texColor.a;

    gl_FragColor = vec4(finalColor, texColor.a * uOpacity);
  }
`;

export const HoloCardMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uOpacity: 1,
    uActive: 0
  },
  vertexShader,
  fragmentShader
);

extend({ HoloCardMaterial });

// Augment R3F's JSX intrinsics so <holoCardMaterial /> is typed
import type { Object3DNode } from '@react-three/fiber';
declare module '@react-three/fiber' {
  interface ThreeElements {
    holoCardMaterial: Object3DNode<
      InstanceType<typeof HoloCardMaterial>,
      typeof HoloCardMaterial
    > & {
      uTime?: number;
      uTexture?: THREE.Texture;
      uOpacity?: number;
      uActive?: number;
      transparent?: boolean;
    };
  }
}
