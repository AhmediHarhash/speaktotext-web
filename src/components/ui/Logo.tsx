import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * Real silver profile + soundwaves + quill brand mark.
 * Source PNG lives at /public/brand/logo.png.
 * next/image handles optimization + lazy-loading.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-8 w-8 shrink-0 items-center justify-center',
        className
      )}
    >
      <Image
        src="/brand/logo.png"
        alt="SpeakToText"
        width={64}
        height={64}
        priority
        className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(201,210,224,0.25)]"
      />
    </span>
  );
}

export function Wordmark({
  className,
  markClassName,
  textClassName
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark className={cn('h-9 w-9', markClassName)} />
      <span
        className={cn(
          'text-[18px] font-semibold tracking-tight text-silver-100',
          textClassName
        )}
      >
        Speak<span className="script-accent gold-text">ToText</span>
      </span>
    </div>
  );
}
