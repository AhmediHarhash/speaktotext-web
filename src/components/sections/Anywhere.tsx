'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';

// React Three Fiber is client-only; Three.js touches window/document at import.
const AnywhereCanvas = dynamic(
  () => import('./AnywhereCanvas').then((m) => m.AnywhereCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-xs uppercase tracking-[0.22em] text-silver-400">
          Loading 3D scene...
        </span>
      </div>
    )
  }
);

export function Anywhere() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || mountCanvas) return;

    const timers: { warmup?: number; fallback?: number } = {};

    const revealCanvas = () => {
      window.clearTimeout(timers.warmup);
      window.clearTimeout(timers.fallback);
      setMountCanvas(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || timers.warmup) return;
        timers.warmup = window.setTimeout(revealCanvas, 1200);
      },
      {
        root: null,
        rootMargin: '0px 0px 120px 0px',
        threshold: 0.01
      }
    );

    observer.observe(section);
    timers.fallback = window.setTimeout(revealCanvas, 6500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timers.warmup);
      window.clearTimeout(timers.fallback);
    };
  }, [mountCanvas]);

  return (
    <section
      ref={sectionRef}
      id="anywhere"
      data-section-fx
      className="relative isolate flex min-h-[100svh] scroll-mt-28 flex-col justify-center overflow-hidden py-12 md:scroll-mt-32 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(36,48,70,0.16),transparent_60%),linear-gradient(180deg,rgba(5,7,13,1)_0%,rgba(5,7,13,0.84)_11%,rgba(5,7,13,0.18)_30%,rgba(5,7,13,0.12)_68%,rgba(5,7,13,0.86)_92%,rgba(5,7,13,1)_100%),linear-gradient(90deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0)_20%,rgba(0,0,0,0)_80%,rgba(0,0,0,0.64)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.11] [background-image:radial-gradient(ellipse_at_50%_52%,rgba(165,180,210,0.18),transparent_58%)]"
        style={{
          maskImage:
            'linear-gradient(180deg, transparent 0%, #000 18%, #000 78%, transparent 100%)'
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-36 bg-gradient-to-b from-ink-950 via-ink-950/80 to-transparent md:h-44"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent md:h-52"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          title="Works where you write."
          accent="One voice workflow."
        />
      </div>

      <div className="relative z-10 left-1/2 -mt-2 h-[60svh] min-h-[520px] max-h-[670px] w-screen -translate-x-1/2 overflow-hidden bg-transparent md:-mt-8 md:h-[69svh] md:min-h-[670px] md:max-h-[800px]">
        {mountCanvas ? (
          <AnywhereCanvas />
        ) : (
          <div className="flex h-full w-full items-center justify-center" />
        )}
      </div>
    </section>
  );
}
