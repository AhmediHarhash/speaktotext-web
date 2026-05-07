'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURE_STORY } from '@/lib/content';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type CardItem = {
  title: string;
  description: string;
  surfaceFrom: string;
  surfaceVia: string;
  surfaceTo: string;
  rotateFrom: number;
  rotateTo: number;
};

const CARD_ITEMS: CardItem[] = [
  {
    title: FEATURE_STORY[0].title,
    description: FEATURE_STORY[0].body,
    surfaceFrom: '#182131',
    surfaceVia: '#0c121d',
    surfaceTo: '#05070d',
    rotateFrom: 11,
    rotateTo: -3
  },
  {
    title: FEATURE_STORY[1].title,
    description: FEATURE_STORY[1].body,
    surfaceFrom: '#191a2a',
    surfaceVia: '#0f1220',
    surfaceTo: '#05070d',
    rotateFrom: -9,
    rotateTo: 4
  },
  {
    title: FEATURE_STORY[2].title,
    description: FEATURE_STORY[2].body,
    surfaceFrom: '#1b1726',
    surfaceVia: '#100f1b',
    surfaceTo: '#05070d',
    rotateFrom: 8,
    rotateTo: -5
  },
  {
    title: FEATURE_STORY[3].title,
    description: FEATURE_STORY[3].body,
    surfaceFrom: '#111f1c',
    surfaceVia: '#0b1415',
    surfaceTo: '#05070d',
    rotateFrom: -12,
    rotateTo: 3
  },
  {
    title: FEATURE_STORY[4].title,
    description: FEATURE_STORY[4].body,
    surfaceFrom: '#211821',
    surfaceVia: '#100f18',
    surfaceTo: '#05070d',
    rotateFrom: 10,
    rotateTo: -4
  }
];

const SCROLL_VH = 400;
const STAGGER = 0.55;

export function FeatureStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const spacer = root.querySelector<HTMLElement>('[data-scroll-spacer]');
      const deck = root.querySelector<HTMLElement>('[data-card-deck]');
      const intro = root.querySelector<HTMLElement>('[data-feature-intro]');
      if (!spacer || !deck) return;

      const cards = gsap.utils.toArray<HTMLElement>('.card', deck);
      if (!cards.length) return;

      if (intro) {
        gsap.set(intro, { autoAlpha: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2
        }
      });

      cards.forEach((card, i) => {
        const item = CARD_ITEMS[i]!;
        gsap.set(card, {
          yPercent: 150 + i * 50,
          rotate: item.rotateFrom,
          opacity: 1,
          scale: 1.25
        });
        tl.to(
          card,
          {
            yPercent: -50,
            rotate: item.rotateTo,
            scale: 0.9,
            duration: 1,
            ease: 'none'
          },
          i * STAGGER
        );
      });

      if (intro) {
        tl.to(
          intro,
          {
            autoAlpha: 0,
            duration: 0.45,
            ease: 'none'
          },
          '+=0.08'
        );
      }

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <section id="features" className="relative scroll-mt-0">
      <div className="relative w-full bg-[#12100e]" ref={rootRef}>
        <div
          data-scroll-spacer
          className="relative w-full"
          style={{ height: `${SCROLL_VH}vh` }}
        >
          <div className="sticky top-0 h-dvh overflow-hidden">
            <div data-feature-intro className="absolute inset-0 z-0">
              <div className="h-dvh w-full">
                <Intro />
              </div>
            </div>

            <section
              data-card-deck
              className="pointer-events-none absolute inset-0 z-10"
            >
              {CARD_ITEMS.map((item, index) => (
                <Card
                  key={item.title}
                  number={index + 1}
                  title={item.title}
                  surfaceFrom={item.surfaceFrom}
                  surfaceVia={item.surfaceVia}
                  surfaceTo={item.surfaceTo}
                  className="card pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
                >
                  {item.description}
                </Card>
              ))}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#05070d]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_82%_60%_at_50%_-12%,rgba(232,194,106,0.16),transparent_58%),radial-gradient(ellipse_58%_52%_at_75%_20%,rgba(61,209,231,0.055),transparent_62%),linear-gradient(180deg,rgba(5,7,13,0),rgba(5,7,13,0.9))]"
        aria-hidden
      />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-16 sm:px-10">
        <div className="flex max-w-3xl -translate-y-[min(6vh,3rem)] flex-col items-center text-center">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/75">
            Feature story
          </p>
          <h2
            className="bg-clip-text text-[clamp(2.5rem,10vw,5.5rem)] font-extrabold leading-[0.95] text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(115deg, #f8fafc 0%, #d7dde8 35%, #e8c26a 72%, #8a6220 100%)'
            }}
          >
            Why it feels different
          </h2>
          <p className="mt-6 max-w-xl text-pretty font-sans text-base leading-relaxed text-silver-300 sm:text-lg">
            Five focused product moments for how SpeakToText turns voice into
            usable writing.
          </p>
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  children,
  number,
  surfaceFrom = '#182131',
  surfaceVia = '#0c121d',
  surfaceTo = '#05070d',
  className
}: {
  title: string;
  children: ReactNode;
  number: string | number;
  surfaceFrom?: string;
  surfaceVia?: string;
  surfaceTo?: string;
  className?: string;
}) {
  const num =
    typeof number === 'number' ? String(number).padStart(2, '0') : number;

  const background = surfaceVia
    ? `
      radial-gradient(ellipse 120% 95% at 14% -8%, rgba(255, 240, 192, 0.12) 0%, transparent 52%),
      radial-gradient(ellipse 85% 75% at 86% 10%, rgba(61, 209, 231, 0.07) 0%, transparent 54%),
      linear-gradient(118deg, rgba(255, 255, 255, 0.1), transparent 34%),
      linear-gradient(176deg, ${surfaceFrom} 0%, ${surfaceVia} 46%, ${surfaceTo} 100%)
    `
        .replace(/\s+/g, ' ')
        .trim()
    : `linear-gradient(176deg, ${surfaceFrom} 0%, ${surfaceTo} 100%)`;

  return (
    <article
      className={[
        'flex min-h-[28rem] w-full min-w-0 max-w-[min(42rem,calc(100vw-3rem))] flex-col justify-between gap-12 overflow-hidden rounded-2xl border border-white/10 p-10 shadow-[0_36px_110px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.13),0_0_0_1px_rgba(232,194,106,0.06)] md:min-h-[36rem] md:gap-14 md:p-12 lg:min-h-[38rem] lg:p-14',
        className ?? ''
      ].join(' ')}
      style={{ background }}
    >
      <div className="max-w-[min(100%,32rem)]">
        <h2
          className="bg-clip-text font-mono text-[clamp(2.05rem,5vw,3.45rem)] font-black uppercase leading-[0.9] text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #fff7e0 0%, #f4d98a 32%, #e8c26a 58%, #ff9d42 100%)',
            textShadow:
              '0 0 18px rgba(232,194,106,0.34), 0 0 34px rgba(255,157,66,0.2), 0 2px 18px rgba(0,0,0,0.78)'
          }}
        >
          {title}
        </h2>
        <div className="mt-7 max-w-[29rem] font-sans text-[clamp(1.05rem,2.15vw,1.32rem)] font-medium leading-snug text-silver-200/90">
          {children}
        </div>
      </div>

      <div className="flex items-end justify-end">
        <span className="shrink-0 font-sans text-[clamp(3.25rem,13vw,6rem)] font-extrabold leading-none text-gold-200/15 tabular-nums">
          {num}
        </span>
      </div>
    </article>
  );
}
