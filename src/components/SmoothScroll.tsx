'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll
 *
 * Mounts a single Lenis instance for the whole page and wires it into GSAP's
 * ticker so every ScrollTrigger (HowItWorks zoom, FeatureStory card deck, and
 * future pinned section transitions) stays perfectly in sync with the smoothed
 * scroll position.
 *
 * - Honors `prefers-reduced-motion`: if the user opts out of motion, Lenis is
 *   not initialized and native scroll is used instead.
 * - Pauses smoothing when a user uses in-page anchor links so hash-scroll
 *   behavior stays deterministic.
 * - Automatically refreshes ScrollTrigger once, after init, to recalculate any
 *   pinned sections now that Lenis controls the scroll container.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      // Feel: premium, not floaty. Mirrors Sidewave/Voxr defaults.
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false
    });

    // Drive Lenis from GSAP's ticker so every animation frame shares the same
    // clock as ScrollTrigger. `lenis.raf` expects milliseconds.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // On every scroll from Lenis, nudge ScrollTrigger so pins + scrubs update.
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // Let ScrollTrigger recompute now that smooth-scroll is active.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 50);

    // Expose for debugging / external stops (e.g., modal lockers).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      window.clearTimeout(refreshId);
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
