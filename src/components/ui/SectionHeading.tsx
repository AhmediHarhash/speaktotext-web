import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';
import { Badge } from './Badge';

export function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = 'center',
  className
}: {
  eyebrow?: string;
  title: ReactNode;
  accent?: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <Badge>{eyebrow}</Badge>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="text-balance font-sans text-4xl font-medium leading-[1.05] tracking-tight text-silver-100 md:text-5xl lg:text-6xl">
          <span className="silver-text">{title}</span>
          {accent && (
            <>
              {' '}
              <span className="script-accent gold-text">{accent}</span>
            </>
          )}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'max-w-2xl text-base leading-relaxed text-silver-300 md:text-lg',
              align === 'center' ? 'text-center' : 'text-left'
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
