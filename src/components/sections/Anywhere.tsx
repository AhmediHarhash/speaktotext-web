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
  const [canvasActive, setCanvasActive] = useState(false);

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
        const isVisible = Boolean(entry?.isIntersecting);
        setCanvasActive(isVisible);
        if (!isVisible || timers.warmup) return;
        timers.warmup = window.setTimeout(revealCanvas, 1200);
      },
      {
        root: null,
        rootMargin: '320px 0px 320px 0px',
        threshold: 0.01
      }
    );

    observer.observe(section);
    timers.fallback = window.setTimeout(revealCanvas, 9000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timers.warmup);
      window.clearTimeout(timers.fallback);
    };
  }, [mountCanvas]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !mountCanvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCanvasActive(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        rootMargin: '360px 0px 360px 0px',
        threshold: 0.01
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [mountCanvas]);

  return (
    <section
      ref={sectionRef}
      id="anywhere"
      data-section-fx
      className="anywhere-section relative isolate flex min-h-[100svh] scroll-mt-28 flex-col justify-center overflow-hidden py-12 md:scroll-mt-32 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_43%,rgba(232,194,106,0.08),transparent_56%),radial-gradient(ellipse_at_50%_58%,rgba(132,152,190,0.16),transparent_66%),linear-gradient(180deg,rgba(5,7,13,1)_0%,rgba(5,7,13,0.7)_12%,rgba(5,7,13,0.08)_35%,rgba(5,7,13,0.05)_65%,rgba(5,7,13,0.72)_92%,rgba(5,7,13,1)_100%),linear-gradient(90deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0)_23%,rgba(0,0,0,0)_77%,rgba(0,0,0,0.42)_100%)]"
      />
      <div
        aria-hidden
        className="anywhere-atmosphere pointer-events-none absolute inset-0 z-0"
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

      <div data-section-fx-inner className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          title="Works where you write."
          accent="One voice workflow."
        />
      </div>

      <div className="relative z-10 left-1/2 -mt-2 h-[60svh] min-h-[520px] max-h-[670px] w-screen -translate-x-1/2 overflow-hidden bg-transparent md:-mt-8 md:h-[69svh] md:min-h-[670px] md:max-h-[800px]">
        {mountCanvas ? (
          <AnywhereCanvas active={canvasActive} />
        ) : (
          <div className="flex h-full w-full items-center justify-center" />
        )}
      </div>
    </section>
  );
}
