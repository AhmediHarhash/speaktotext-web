'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight, Play, Check } from 'lucide-react';
import { BRAND, TRUST_POINTS } from '@/lib/content';
import { cn } from '@/lib/cn';
import { ButtonLink } from '../ui/Button';
import { HeroDemoPanel } from '../HeroDemoPanel';
import { CinematicHero, hasCinematicHeroAsset } from './CinematicHero';

type HeadlineWord = {
  readonly text: string;
  readonly accent?: boolean;
};

const HEADLINE_LINES: readonly (readonly HeadlineWord[])[] = [
  [
    { text: 'Speak' },
    { text: 'once.' }
  ],
  [
    { text: 'Get' },
    { text: 'the' },
    { text: 'right' }
  ],
  [
    { text: 'output' },
    { text: 'everywhere.', accent: true }
  ]
] as const;

const DESKTOP_CHAR_OFFSETS = [
  { x: -22, y: 26, rotation: -10 },
  { x: 18, y: -22, rotation: 8 },
  { x: -13, y: 18, rotation: -7 },
  { x: 14, y: 24, rotation: 7 },
  { x: -18, y: -14, rotation: -8 },
  { x: 12, y: 16, rotation: 5 }
] as const;

const MOBILE_CHAR_OFFSETS = [
  { x: -8, y: 12, rotation: -4 },
  { x: 7, y: -10, rotation: 3 },
  { x: -5, y: 9, rotation: -3 },
  { x: 5, y: 11, rotation: 3 }
] as const;

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() ?? '';
const HERO_VIDEO_POSTER =
  process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL?.trim() ?? '';

function HeroHeadline() {
  return (
    <span aria-hidden="true" className="block">
      {HEADLINE_LINES.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.map(({ text, accent = false }, wordIndex) => (
            <span key={text} className="inline-block whitespace-nowrap">
              <span
                className={[
                  'hero-word relative inline-block',
                  accent ? 'hero-typing-word gold-text' : 'silver-text'
                ].join(' ')}
              >
                {Array.from(text).map((character, characterIndex) => (
                  <span
                    key={`${text}-${characterIndex}`}
                    className={[
                      'hero-char inline-block [will-change:transform,opacity,filter]',
                      accent ? 'hero-typing-char gold-text' : 'silver-text',
                      accent && character.toLowerCase() === 'i'
                        ? 'hero-typing-i'
                        : ''
                    ].join(' ')}
                  >
                    {character}
                  </span>
                ))}
              </span>
              {wordIndex < line.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="inline-block w-[0.34em] md:w-[0.38em]"
                />
              ) : null}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return hasCinematicHeroAsset ? <CinematicHero /> : <ClassicHero />;
}

function ClassicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const trustRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasHeroVideo = HERO_VIDEO_URL.length > 0;

  useIsoLayoutEffect(() => {
    if (!sectionRef.current || !headlineRef.current || !subcopyRef.current) {
      return;
    }

    gsap.registerPlugin(SplitText);

    let subcopySplit: SplitText | null = null;
    let observer: IntersectionObserver | null = null;
    let settleTimer: number | null = null;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const charOffsets = isMobile ? MOBILE_CHAR_OFFSETS : DESKTOP_CHAR_OFFSETS;

      const chars = gsap.utils.toArray<HTMLElement>('.hero-char');
      const typingChars = gsap.utils.toArray<HTMLElement>('.hero-typing-char');
      const typingWord = sectionRef.current?.querySelector<HTMLElement>(
        '.hero-typing-word'
      );
      const trustItems = gsap.utils.toArray<HTMLElement>('.hero-trust-item');

      if (prefersReducedMotion) {
        gsap.set(
          [
            ...chars,
            ...trustItems,
            ctaRef.current,
            noteRef.current,
            panelRef.current
          ].filter(Boolean),
          { autoAlpha: 1, clearProps: 'all' }
        );
        return;
      }

      let subcopyLines: HTMLElement[] = [];

      if (isMobile) {
        gsap.set(subcopyRef.current, {
          autoAlpha: 0,
          y: 12,
          filter: 'blur(6px)'
        });
      } else {
        subcopySplit = SplitText.create(subcopyRef.current, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'hero-subcopy-line',
          aria: 'auto'
        });

        subcopyLines = subcopySplit.lines as HTMLElement[];

        gsap.set(subcopyLines, {
          autoAlpha: 0,
          yPercent: 70,
          filter: 'blur(10px)'
        });
      }

      gsap.set(chars, {
        autoAlpha: 0,
        filter: 'blur(10px)',
        transformOrigin: '50% 65%'
      });
      gsap.set([ctaRef.current, noteRef.current], { autoAlpha: 1, y: 0 });
      gsap.set(trustItems, { autoAlpha: 1, y: 0 });
      gsap.set(panelRef.current, { autoAlpha: 1, y: 0, scale: 1 });

      if (typingWord) {
        gsap.set(typingWord, {
          textShadow: '0 0 0 rgba(243,201,106,0)'
        });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' }
      });

      tl.fromTo(
        chars,
        {
          x: (index) => charOffsets[index % charOffsets.length].x,
          y: (index) => charOffsets[index % charOffsets.length].y,
          rotation: (index) => charOffsets[index % charOffsets.length].rotation,
          autoAlpha: 0,
          filter: 'blur(10px)'
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: isMobile ? 0.92 : 1.18,
          stagger: {
            each: isMobile ? 0.018 : 0.026,
            from: 'start'
          },
          clearProps: 'x,y,rotation,filter,visibility'
        }
      )
        .to(
          typingChars,
          {
            y: -3,
            duration: 0.22,
            stagger: 0.035,
            ease: 'power2.out'
          },
          '-=0.12'
        )
        .to(
          typingChars,
          {
            y: 0,
            duration: 0.44,
            stagger: 0.035,
            ease: 'elastic.out(1, 0.55)',
            clearProps: 'y'
          },
          '<0.12'
        );

      if (typingWord) {
        tl.to(
          typingWord,
          {
            textShadow:
              '0 0 18px rgba(243,201,106,0.42), 0 0 42px rgba(212,165,72,0.24)',
            duration: 0.48,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          },
          '-=0.26'
        );
      }

      if (isMobile) {
        tl.to(
          subcopyRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.76,
            clearProps: 'transform,filter,opacity,visibility'
          },
          '-=0.08'
        );
      } else {
        tl.to(
          subcopyLines,
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 0.84,
            stagger: 0.1,
            clearProps: 'filter,visibility'
          },
          '-=0.08'
        );
      }

      tl
        .to(
          panelRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility'
          },
          '-=0.58'
        )
        .to(
          ctaRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            clearProps: 'transform,opacity,visibility'
          },
          '-=0.36'
        )
        .to(
          noteRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            clearProps: 'transform,opacity,visibility'
          },
          '-=0.34'
        )
        .to(
          trustItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            stagger: 0.055,
            clearProps: 'transform,opacity,visibility'
          },
          '-=0.22'
        );

      const playHero = () => {
        if (tl.progress() === 0) {
          tl.play(0);
        }
      };

      const settleHero = () => {
        gsap.set(chars, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotation: 0,
          filter: 'blur(0px)',
          clearProps: 'transform,filter,opacity,visibility'
        });

        if (isMobile) {
          gsap.set(subcopyRef.current, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            clearProps: 'transform,filter,opacity,visibility'
          });
        } else {
          gsap.set(subcopyLines, {
            autoAlpha: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            clearProps: 'transform,filter,opacity,visibility'
          });
        }
      };

      settleTimer = window.setTimeout(settleHero, 2600);

      if ('IntersectionObserver' in window && sectionRef.current) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              playHero();
              observer?.disconnect();
              observer = null;
            }
          },
          {
            root: null,
            threshold: 0.32,
            rootMargin: '0px 0px -10% 0px'
          }
        );

        observer.observe(sectionRef.current);
        playHero();
        return;
      }

      playHero();
    }, sectionRef);

    return () => {
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
      observer?.disconnect();
      ctx.revert();
      subcopySplit?.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      data-section-fx
      className="hero-shell relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink-950 pt-32 md:pt-40"
    >
      {hasHeroVideo ? (
        <HeroVideoBackdrop src={HERO_VIDEO_URL} poster={HERO_VIDEO_POSTER} />
      ) : null}

      <div
        data-section-fx-inner
        className={cn(
          'relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 overflow-visible px-6 pb-24 md:pb-32 lg:gap-10 lg:px-10',
          hasHeroVideo
            ? 'lg:grid-cols-[minmax(0,0.82fr)_minmax(0,0.18fr)]'
            : 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
        )}
      >
        {/* LEFT: copy */}
        <div className="hero-mobile-bound flex min-w-0 flex-col justify-center">
          <h1
            ref={headlineRef}
            aria-label={BRAND.heroHeadline}
            className="hero-headline hero-mobile-bound text-balance text-5xl font-semibold leading-[1.02] tracking-[0] text-silver-100 sm:text-6xl lg:text-[76px]"
          >
            <HeroHeadline />
          </h1>

          <p
            ref={subcopyRef}
            className="hero-copy-paragraph mt-6 w-full text-pretty text-[15px] leading-[1.75] text-silver-300/90 md:text-[17px] md:leading-[1.72]"
          >
            {BRAND.heroSubcopy}
          </p>

          <div
            ref={ctaRef}
            className="hero-mobile-bound mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <ButtonLink
              href="/download"
              size="lg"
              variant="primary"
              icon={<ArrowUpRight className="h-4 w-4" />}
              analyticsEvent="download_click"
              analyticsLabel="hero_primary_download"
              className="w-full sm:w-auto"
            >
              Download for Windows
            </ButtonLink>
            <ButtonLink
              href="#how"
              size="lg"
              variant="ghost"
              icon={<Play className="h-3.5 w-3.5 fill-current" />}
              iconPosition="left"
              analyticsEvent="cta_click"
              analyticsLabel="hero_see_how_it_works"
              className="w-full sm:w-auto"
            >
              See how it works
            </ButtonLink>
          </div>

          <p ref={noteRef} className="hero-platform-note mt-3 text-xs text-silver-400">
            macOS and mobile: <span className="text-silver-200">coming soon</span>
          </p>

          <ul
            ref={trustRef}
            className="mt-8 flex flex-wrap items-center gap-2.5"
          >
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="hero-trust-item inline-flex items-center gap-2 px-2 py-1 text-sm font-medium text-silver-100"
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-sheen text-ink-950"
                  style={{
                    boxShadow:
                      '0 0 12px rgba(232,194,106,0.85), 0 0 24px rgba(212,165,72,0.55), inset 0 1px 1px rgba(255,255,255,0.6)'
                  }}
                >
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: product demo panel */}
        <div
          ref={panelRef}
          className={cn(
            'hero-mobile-bound hero-panel-stage relative min-w-0 overflow-visible',
            hasHeroVideo && 'hidden lg:block'
          )}
        >
          {hasHeroVideo ? null : <HeroDemoPanel />}
        </div>
      </div>
    </section>
  );
}

function HeroVideoBackdrop({
  src,
  poster
}: {
  src: string;
  poster?: string;
}) {
  return (
    <div aria-hidden className="hero-video-backdrop pointer-events-none absolute inset-0 z-0">
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_58%_at_70%_40%,rgba(232,194,106,0.1),transparent_58%),linear-gradient(90deg,rgba(5,7,13,0.96)_0%,rgba(5,7,13,0.76)_38%,rgba(5,7,13,0.28)_70%,rgba(5,7,13,0.84)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink-950/95 to-transparent" />
    </div>
  );
}
