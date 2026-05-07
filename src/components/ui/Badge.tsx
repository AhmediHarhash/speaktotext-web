import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Badge({
  children,
  className,
  dot = true
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-silver-100',
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-gold-300 animate-pulse-slow" />
          <span className="relative rounded-full bg-gold-300 h-1.5 w-1.5" />
        </span>
      )}
      {children}
    </span>
  );
}
