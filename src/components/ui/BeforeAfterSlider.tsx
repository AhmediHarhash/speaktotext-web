'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Drag-to-reveal slider.
 * Left half shows the `before` image (rough speech rendered in-app).
 * Right half is clipped to reveal the `after` image (polished output in-app).
 * Both images must share identical framing for a clean reveal.
 *
 * Fallbacks gracefully to a stacked view while images 404 so dev is never blocked.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Rough',
  afterLabel = 'Polished',
  aspect = '16/10',
  className
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspect?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(60); // 0 = all rough, 100 = all polished
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, ratio)));
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
      className={cn(
        'liquid-glass relative w-full select-none overflow-hidden rounded-[28px]',
        className
      )}
      style={{ aspectRatio: aspect }}
    >
      {/* After (polished), base layer */}
      <img
        src={after}
        alt={afterLabel}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg,#0F1726,#172236)';
        }}
      />

      {/* Before (rough), clipped from right as pos moves right */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          draggable={false}
          style={{
            width: containerWidth ? `${containerWidth}px` : '100%'
          }}
          className="h-full max-w-none object-cover"
          onError={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg,#0A0F1C,#0F1726)';
          }}
        />
      </div>

      {/* Divider handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 flex w-px items-center justify-center bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        style={{ left: `${pos}%` }}
      >
        <div className="pointer-events-auto flex h-12 w-12 cursor-ew-resize items-center justify-center rounded-full border border-white/40 bg-gold-sheen text-ink-950 shadow-gold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="h-5 w-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6 5 12l4 6M15 6l4 6-4 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-silver-200" />
        {beforeLabel}
      </div>
      <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(212,165,72,0.9)]" />
        {afterLabel}
      </div>
    </div>
  );
}
