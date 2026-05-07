'use client';

import { cn } from '@/lib/cn';

/**
 * Pure-CSS animated waveform bars. Used across hero, how-it-works,
 * and the product panel. Pauses for prefers-reduced-motion.
 */
export function Waveform({
  active = true,
  bars = 28,
  className
}: {
  active?: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center gap-[3px]',
        className
      )}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => {
        const speed = 0.8 + ((i * 37) % 10) / 10; // deterministic pseudo-random
        const delay = ((i * 53) % 100) / 100;
        return (
          <span
            key={i}
            className={cn(
              'block w-[2px] rounded-full',
              active ? 'bg-gradient-to-t from-gold-500 via-gold-300 to-gold-100' : 'bg-silver-400/30'
            )}
            style={{
              height: '100%',
              transformOrigin: 'center',
              animation: active
                ? `waveBar ${speed}s ease-in-out ${delay}s infinite`
                : 'none'
            }}
          />
        );
      })}
    </div>
  );
}
