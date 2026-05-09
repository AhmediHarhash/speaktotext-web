'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionTransitions
 *
 * Applies a scrubbed enter/exit timeline to every section tagged with
 * `data-section-fx`. The effect:
 *
 *   1. When a section enters the viewport from below, it rises gently
 *      and scales up from 0.975 to 1 as its top crosses from the bottom
 *      of the viewport to 55% height.
 *   2. When the section leaves upward, it drifts and scales back slightly
 *      from the moment its bottom reaches 45% of the viewport until it
 *      exits at the top.
 *
 * Combined with Lenis smooth scroll, this delivers the "each section
 * turns" feel seen on sidewave.it and voxr.ai — without pinning every
 * section (which would triple the page height). Pinned sections
 * (HowItWorks zoom, FeatureStory card deck) keep their own scripts.
 *
 * Respects prefers-reduced-motion. Skips the first tagged section (Hero)
 * from an entrance scrub since it is visible on first paint and plays
 * its own headline animation on mount.
 */
export function SectionTransitions() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-section-fx]')
    );
    if (sections.length === 0) return;

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        if (section.hasAttribute('data-section-fx-pinned')) return;

        const target = section.querySelector<HTMLElement>('[data-section-fx-inner]');
        if (!target) return;

        // Keep section content fully readable. Backgrounds, canvases, and
        // pricing cards should never dim just because a scroll hand-off is
        // happening.
        gsap.set(target, { autoAlpha: 1, filter: 'none' });

        // Hero (first section) is visible on first paint and has its own
        // entrance animation — skip the scroll-linked entrance on it, but
        // still animate its exit so the hand-off into section 2 feels
        // connected.
        const isFirst = index === 0;

        if (!isFirst) {
          gsap.fromTo(
            target,
            { y: 42, scale: 0.975 },
            {
              y: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 55%',
                scrub: 0.6
              }
            }
          );
        }

        // Exit: drift/shrink once the section's bottom has passed the 45%
        // mark of the viewport, finish by the time it clears the top. Last
        // section (FinalCta) should not animate out.
        const isLast = index === sections.length - 1;
        if (!isLast) {
          gsap.to(target, {
            y: -30,
            scale: 0.985,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'bottom 55%',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }
      });
    });

    // Let ScrollTrigger recalc positions now that these triggers exist.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 80);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  return null;
}
