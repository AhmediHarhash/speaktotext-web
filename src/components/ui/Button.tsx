'use client';

import Link from 'next/link';
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEvent,
  PointerEvent,
  ReactNode
} from 'react';
import { cn } from '@/lib/cn';
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';

type Variant = 'primary' | 'ghost' | 'solid';
type Size = 'sm' | 'md' | 'lg';

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  analyticsEvent?: AnalyticsEventName;
  analyticsLabel?: string;
  className?: string;
  children: ReactNode;
};

const base =
  'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-all duration-200 whitespace-nowrap select-none will-change-transform';

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-base'
};

const variants: Record<Variant, string> = {
  primary: 'premium-gold-cta text-ink-950 font-semibold',
  // Glass ghost for secondary actions.
  ghost: cn(
    'liquid-glass text-silver-100',
    'hover:text-white hover:bg-white/5'
  ),
  // Solid silver for tertiary actions.
  solid: cn(
    'bg-white text-ink-950 font-semibold',
    'shadow-[0_4px_24px_rgba(255,255,255,0.12)]',
    'hover:bg-silver-100'
  )
};

export type ButtonProps = ButtonOwnProps & ComponentPropsWithoutRef<'button'>;
export type ButtonLinkProps = ButtonOwnProps & ComponentPropsWithoutRef<'a'> & { href: string };

function getPointerGlowStyle(style?: CSSProperties) {
  return {
    '--cta-x': '50%',
    '--cta-y': '50%',
    ...style
  } as CSSProperties;
}

function updatePointerGlow<T extends HTMLElement>(event: PointerEvent<T>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    '--cta-x',
    `${event.clientX - rect.left}px`
  );
  event.currentTarget.style.setProperty(
    '--cta-y',
    `${event.clientY - rect.top}px`
  );
}

function resetPointerGlow<T extends HTMLElement>(event: PointerEvent<T>) {
  event.currentTarget.style.setProperty('--cta-x', '50%');
  event.currentTarget.style.setProperty('--cta-y', '50%');
}

function trackButtonClick(
  eventName: AnalyticsEventName | undefined,
  label: string | undefined,
  href?: string
) {
  if (!eventName) return;

  trackEvent(eventName, {
    label,
    href
  });
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  analyticsEvent,
  analyticsLabel,
  className,
  children,
  onClick,
  onPointerMove,
  onPointerLeave,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      style={getPointerGlowStyle(style)}
      onPointerMove={(event) => {
        updatePointerGlow(event);
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        resetPointerGlow(event);
        onPointerLeave?.(event);
      }}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        trackButtonClick(analyticsEvent, analyticsLabel);
        onClick?.(event);
      }}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="relative z-10 shrink-0">{icon}</span>}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  analyticsEvent,
  analyticsLabel,
  className,
  children,
  href,
  onClick,
  onPointerMove,
  onPointerLeave,
  style,
  ...rest
}: ButtonLinkProps) {
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === 'right' && <span className="relative z-10 shrink-0">{icon}</span>}
    </>
  );

  if (href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={cn(base, sizes[size], variants[variant], className)}
        style={getPointerGlowStyle(style)}
        onPointerMove={(event) => {
          updatePointerGlow(event);
          onPointerMove?.(event);
        }}
        onPointerLeave={(event) => {
          resetPointerGlow(event);
          onPointerLeave?.(event);
        }}
        onClick={(event) => {
          trackButtonClick(analyticsEvent, analyticsLabel, href);
          onClick?.(event);
        }}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
      style={getPointerGlowStyle(style)}
      onPointerMove={(event) => {
        updatePointerGlow(event);
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        resetPointerGlow(event);
        onPointerLeave?.(event);
      }}
      onClick={(event) => {
        trackButtonClick(analyticsEvent, analyticsLabel, href);
        onClick?.(event);
      }}
      {...rest}
    >
      {content}
    </Link>
  );
}
