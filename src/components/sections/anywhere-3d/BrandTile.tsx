'use client';

/**
 * Ported from shoe-finder/src/components/grid/ShoeTile.jsx.
 * Same tile, but the image texture is a CanvasTexture drawn from the brand glyph
 * (see useBrandTexture.tsx) instead of a product photo.
 */

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { CONFIG } from './config';
import { rigState } from './rigState';
import type { BrandItem } from './brandsData';
import { HoloCardMaterial } from './HoloCardMaterial';

// Registers the material with R3F (side-effect import).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _touch = HoloCardMaterial;

type TileProps = {
  brand: BrandItem;
  index: number;
  basePos: { x: number; y: number };
  gridVisible: boolean;
  transitionStartTime: number;
  interactive: boolean;
  gridHeight: number;
  gridWidth: number;
  texture: THREE.Texture;
  randomDelay: number;
  activeBasePos: { x: number; y: number } | null;
};

export function BrandTile({
  brand,
  index,
  basePos,
  gridVisible,
  transitionStartTime,
  interactive,
  gridHeight,
  gridWidth,
  texture,
  randomDelay,
  activeBasePos
}: TileProps) {
  const ref = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  // animation refs
  const focusZ = useRef(0);
  const rotationX = useRef(0);
  const rotationY = useRef(0);
  const curveZ = useRef(0);
  const transitionZ = useRef(0);
  const transitionY = useRef(0);
  const pushX = useRef(0);
  const pushY = useRef(0);
  const isSleep = useRef(false);

  const imageDims = useMemo(() => {
    const maxSize = CONFIG.itemSize * 0.9;
    const image = texture.image as
      | { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number }
      | undefined;
    const width = image?.naturalWidth ?? image?.width ?? 0;
    const height = image?.naturalHeight ?? image?.height ?? 0;
    const aspect = height > 0 ? width / height : 1;

    return aspect > 1
      ? { width: maxSize, height: maxSize / aspect }
      : { width: maxSize * aspect, height: maxSize };
  }, [texture]);

  const backplateDims = useMemo(() => {
    const padX = Math.max(CONFIG.itemSize * 0.18, 0.22);
    const padY = Math.max(CONFIG.itemSize * 0.16, 0.18);
    return {
      width: Math.max(imageDims.width + padX, CONFIG.itemSize * 0.76),
      height: Math.max(imageDims.height + padY, CONFIG.itemSize * 0.52)
    };
  }, [imageDims]);

  const fillGeometry = useMemo(
    () =>
      brand.surface === 'porcelain'
        ? createRoundedRectGeometry(
            backplateDims.width,
            backplateDims.height,
            Math.min(backplateDims.width, backplateDims.height) * 0.18
          )
        : null,
    [backplateDims, brand.surface]
  );

  const rimGeometry = useMemo(
    () =>
      brand.surface === 'porcelain'
        ? createRoundedRectGeometry(
            backplateDims.width * 1.055,
            backplateDims.height * 1.09,
            Math.min(backplateDims.width, backplateDims.height) * 0.2
          )
        : null,
    [backplateDims, brand.surface]
  );

  const shadowGeometry = useMemo(
    () =>
      brand.surface === 'porcelain'
        ? createRoundedRectGeometry(
            backplateDims.width * 1.12,
            backplateDims.height * 1.18,
            Math.min(backplateDims.width, backplateDims.height) * 0.22
          )
        : null,
    [backplateDims, brand.surface]
  );

  useLayoutEffect(() => {
    const normalizedY = gridHeight > 0 ? basePos.y / (gridHeight / 2) : 0;
    if (gridVisible) {
      transitionZ.current = CONFIG.enterStartZ;
      transitionY.current = normalizedY * CONFIG.enterSpreadY;
      if (imageRef.current) imageRef.current.uOpacity = CONFIG.enterStartOpacity;
      isSleep.current = false;
    } else {
      transitionZ.current = 0;
      transitionY.current = 0;
      if (imageRef.current) imageRef.current.uOpacity = 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    if (!ref.current || isSleep.current) return;

    // --- Stagger ---
    const now = state.clock.elapsedTime * 1000;
    const timeSinceTrigger = now - transitionStartTime;
    const canTransition = timeSinceTrigger > randomDelay;

    // --- Targets ---
    let targetTransitionOpacity = 1.0;
    let targetTransitionZ = 0;
    const normalizedY = gridHeight > 0 ? basePos.y / (gridHeight / 2) : 0;
    let targetTransitionY = 0;

    if (gridVisible) {
      if (canTransition) {
        targetTransitionOpacity = 1.0;
        targetTransitionZ = 0;
        targetTransitionY = 0;
      } else {
        targetTransitionOpacity = CONFIG.enterStartOpacity;
        targetTransitionZ = CONFIG.enterStartZ;
        targetTransitionY = normalizedY * CONFIG.enterSpreadY;
      }
    } else {
      if (canTransition) {
        targetTransitionOpacity = 0.0;
        targetTransitionZ = CONFIG.exitEndZ;
        targetTransitionY = normalizedY * CONFIG.exitSpreadY;
      } else {
        targetTransitionOpacity = 1.0;
        targetTransitionZ = 0;
        targetTransitionY = 0;
      }
    }

    // --- Local push field ---
    let targetPushX = 0;
    let targetPushY = 0;
    const isActive = rigState.activeId === index;

    if (activeBasePos && rigState.activeId !== null && !isActive) {
      const dx = basePos.x - activeBasePos.x;
      const dy = basePos.y - activeBasePos.y;
      const dist = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
      const radius = CONFIG.pushRadius;

      if (dist < radius) {
        const normalHalf = (CONFIG.itemSize * 0.9) / 2;
        const activeHalf = normalHalf * CONFIG.focusScale;
        const packedGap = CONFIG.gap * 0.35;
        const collisionPush = Math.max(
          0,
          activeHalf + normalHalf + packedGap - dist
        );
        const wavePush =
          Math.pow(1 - dist / radius, 2) * CONFIG.pushStrength;
        const strength = collisionPush + wavePush;
        targetPushX = (dx / dist) * strength;
        targetPushY = (dy / dist) * strength;
      }
    }

    easing.damp(pushX, 'current', targetPushX, CONFIG.pushDamp, delta);
    easing.damp(pushY, 'current', targetPushY, CONFIG.pushDamp, delta);

    // --- Base position (with rig) ---
    const x = basePos.x + pushX.current + rigState.current.x;
    const y = basePos.y + pushY.current + rigState.current.y;

    // --- Culling ---
    const currentCull = CONFIG.cullDistance * (rigState.zoom / 8);
    const isPositionVisible = Math.abs(x) < currentCull && Math.abs(y) < currentCull;

    if (!gridVisible && targetTransitionOpacity < 0.01) {
      ref.current.visible = false;
      isSleep.current = true;
      return;
    }
    if (!isPositionVisible && !(!gridVisible && canTransition)) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;

    // --- Curvature & zoom ---
    const isZoomedIn = rigState.zoom <= CONFIG.zoomIn + 0.5;
    const maxZoom = CONFIG.zoomOut || 50;
    const zoomRatio = isZoomedIn
      ? 0
      : THREE.MathUtils.clamp(
          (rigState.zoom - CONFIG.zoomIn) / (maxZoom - CONFIG.zoomIn),
          0,
          1
        );
    const smoothRatio = easing.cubic.inOut(zoomRatio);
    const distSq = x * x + y * y;
    const dist = Math.sqrt(distSq);
    const radialCurveZ = -distSq * CONFIG.curvatureStrength * smoothRatio;
    const edgeX =
      gridWidth > 0
        ? THREE.MathUtils.clamp(Math.abs(basePos.x) / (gridWidth / 2), 0, 1)
        : 0;
    const edgeY =
      gridHeight > 0
        ? THREE.MathUtils.clamp(Math.abs(basePos.y) / (gridHeight / 2), 0, 1)
        : 0;
    const edgeCurve =
      Math.pow(edgeX, CONFIG.edgeCurvePower) +
      Math.pow(edgeY, CONFIG.edgeCurvePower);
    const targetCurveZ =
      radialCurveZ - edgeCurve * CONFIG.edgeCurveStrength * smoothRatio;

    let rotX = 0;
    let rotY = 0;
    if (targetTransitionOpacity > 0.1) {
      const rotationIntensity = Math.min(dist * 0.4, 2.0) * smoothRatio;
      rotX =
        y * CONFIG.curvatureStrength * CONFIG.rotationStrength * rotationIntensity;
      rotY =
        -x * CONFIG.curvatureStrength * CONFIG.rotationStrength * rotationIntensity;
    }

    // --- Interaction ---
    const isFocusMode = rigState.activeId !== null;
    const isHovered = hovered && interactive;

    let interactionScale = 1.0;
    let interactionOpacity = 1.0;
    let targetFocusZ = 0;

    if (isFocusMode) {
      interactionScale = isActive ? CONFIG.focusScale : 1.0;
      interactionOpacity = 1.0;
      targetFocusZ = isActive ? 2.25 : 0;
    } else {
      interactionScale = isHovered && !rigState.isDragging ? 1.48 : 1.0;
      targetFocusZ = isHovered && !rigState.isDragging ? 1.1 : 0;
    }

    const finalOpacity = interactionOpacity * targetTransitionOpacity;

    // --- Apply ---
    easing.damp(ref.current.scale, 'x', interactionScale, 0.15, delta);
    easing.damp(ref.current.scale, 'y', interactionScale, 0.15, delta);
    easing.damp(focusZ, 'current', targetFocusZ, 0.2, delta);
    easing.damp(curveZ, 'current', targetCurveZ, 0.2, delta);
    easing.damp(
      transitionZ,
      'current',
      targetTransitionZ,
      CONFIG.transitionZDamp,
      delta
    );
    easing.damp(
      transitionY,
      'current',
      targetTransitionY,
      CONFIG.transitionYDamp,
      delta
    );

    ref.current.position.set(
      x,
      y + transitionY.current,
      curveZ.current + focusZ.current + transitionZ.current
    );

    easing.damp(rotationX, 'current', rotX, 0.2, delta);
    easing.damp(rotationY, 'current', rotY, 0.2, delta);
    ref.current.rotation.set(rotationX.current, rotationY.current, 0);

    if (imageRef.current) {
      imageRef.current.uTime = state.clock.elapsedTime;
      const activeDamp = isActive ? 0.6 : 0.15;
      easing.damp(imageRef.current, 'uActive', isActive ? 1 : 0, activeDamp, delta);
      const opacityDamp = gridVisible
        ? CONFIG.enterOpacityDamp
        : CONFIG.exitOpacityDamp;
      easing.damp(imageRef.current, 'uOpacity', finalOpacity, opacityDamp, delta);
    }
  });

  const handleClick = (e: THREE.Event & { stopPropagation: () => void }) => {
    if (!interactive) return;
    if (rigState.isDragging) {
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    if (rigState.activeId !== index) {
      rigState.activeId = index;
    }
  };

  return (
    <group ref={ref}>
      {/* Invisible hit area slightly larger than the image */}
      <mesh
        onPointerOver={() => {
          setHovered(true);
          if (interactive && !rigState.isDragging) {
            rigState.activeId = index;
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          if (rigState.activeId === index) {
            rigState.activeId = null;
          }
        }}
        onClick={handleClick}
      >
        <planeGeometry args={[imageDims.width * 1.08, imageDims.height * 1.08]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {brand.surface === 'porcelain' && fillGeometry && rimGeometry && shadowGeometry && (
        <group position={[0, 0, -0.035]}>
          <mesh geometry={shadowGeometry} position={[0.06, -0.08, -0.018]} renderOrder={-3}>
            <meshBasicMaterial
              color="#000000"
              depthWrite={false}
              transparent
              opacity={0.24}
            />
          </mesh>
          <mesh geometry={rimGeometry} position={[0, 0, -0.012]} renderOrder={-2}>
            <meshBasicMaterial
              color="#D9B76A"
              depthWrite={false}
              transparent
              opacity={0.22}
            />
          </mesh>
          <mesh geometry={fillGeometry} position={[0, 0, -0.006]} renderOrder={-1}>
            <meshBasicMaterial
              color="#E6D9BE"
              depthWrite={false}
              transparent
              opacity={0.76}
            />
          </mesh>
        </group>
      )}

      {/* Visible textured plane with holo card shader */}
      <mesh>
        <planeGeometry args={[imageDims.width, imageDims.height, 16, 16]} />
        <holoCardMaterial
          ref={imageRef}
          transparent
          uTexture={texture}
          key={brand.id}
        />
      </mesh>
    </group>
  );
}

function createRoundedRectGeometry(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return new THREE.ShapeGeometry(shape, 10);
}
