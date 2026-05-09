'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Play } from 'lucide-react';
import { BRAND } from '@/lib/content';
import { ButtonLink } from '../ui/Button';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DESKTOP_VIDEO =
  process.env.NEXT_PUBLIC_HERO_CINEMATIC_VIDEO_URL?.trim() ??
  '/hero-cinematic/hero-master-desktop.mp4';
const DESKTOP_POSTER =
  process.env.NEXT_PUBLIC_HERO_CINEMATIC_POSTER_URL?.trim() ??
  '/hero-cinematic/hero-master-poster.jpg';
const MOBILE_VIDEO =
  process.env.NEXT_PUBLIC_HERO_CINEMATIC_MOBILE_VIDEO_URL?.trim() ?? '';
const MOBILE_POSTER =
  process.env.NEXT_PUBLIC_HERO_CINEMATIC_MOBILE_POSTER_URL?.trim() ?? '';
const APP_IMAGE = process.env.NEXT_PUBLIC_HERO_APP_IMAGE_URL?.trim() ?? '';

const SCROLL_VH = 640;

export const hasCinematicHeroAsset =
  DESKTOP_VIDEO.length > 0 || DESKTOP_POSTER.length > 0;

const CINEMATIC_BEATS = [
  {
    id: 'speed',
    index: '01',
    label: 'Speed',
    line1: 'How many thoughts disappear',
    line2: 'while you fix the sentence?',
    align: 'left'
  },
  {
    id: 'accuracy',
    index: '02',
    label: 'Accuracy',
    line1: 'A weak prompt',
    line2: 'costs the whole answer.',
    align: 'right'
  },
  {
    id: 'polish',
    index: '03',
    label: 'Polish',
    line1: 'Messy speech in.',
    line2: 'Business-ready writing out.',
    align: 'left'
  },
  {
    id: 'everywhere',
    index: '04',
    label: 'Everywhere',
    line1: 'Email. Prompts. Summaries.',
    line2: 'Replies. Business drafts.',
    align: 'right'
  }
] as const;

function useResponsiveHeroMedia() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return useMemo(() => {
    const video = isMobile && MOBILE_VIDEO ? MOBILE_VIDEO : DESKTOP_VIDEO;
    const poster = isMobile && MOBILE_POSTER ? MOBILE_POSTER : DESKTOP_POSTER;
    return { video, poster };
  }, [isMobile]);
}

export function CinematicHero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { video, poster } = useResponsiveHeroMedia();

  const syncInitialVideoFrame = () => {
    const videoEl = videoRef.current;
    if (!videoEl || !Number.isFinite(videoEl.duration)) return;

    videoEl.pause();

    if (videoEl.currentTime < 0.001 || videoEl.currentTime > 0.08) {
      videoEl.currentTime = 0.001;
    }
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const scrollArea = root.querySelector<HTMLElement>(
        '[data-cinematic-scroll]'
      );
      const world = root.querySelector<HTMLElement>('[data-cinematic-world]');
      const beatEls = gsap.utils.toArray<HTMLElement>(
        '[data-cinematic-beat]',
        root
      );
      const final = root.querySelector<HTMLElement>('[data-cinematic-final]');
      const app = root.querySelector<HTMLElement>('[data-cinematic-app]');
      const videoEl = videoRef.current;

      if (!scrollArea || !world || !final) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([world, final, app, ...beatEls].filter(Boolean), {
          clearProps: 'all',
          autoAlpha: 1
        });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (videoEl) {
          videoEl.pause();
        }

        gsap.set(world, {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          transformOrigin: '50% 50%'
        });
        gsap.set(beatEls, {
          autoAlpha: 0,
          y: 42,
          rotateX: -12,
          filter: 'blur(12px)',
          transformPerspective: 900
        });
        gsap.set(final, {
          autoAlpha: 0,
          y: 34,
          filter: 'blur(14px)'
        });
        gsap.set(app, {
          autoAlpha: APP_IMAGE ? 0 : 1,
          y: 46,
          rotateY: -16,
          scale: 0.92,
          filter: 'blur(12px)'
        });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'cinematic-hero-world',
            trigger: scrollArea,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.85,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!videoEl || !Number.isFinite(videoEl.duration)) return;
              const usableDuration = Math.max(0, videoEl.duration - 0.05);
              const nextTime = usableDuration * self.progress + 0.001;
              if (Math.abs(videoEl.currentTime - nextTime) > 0.045) {
                videoEl.currentTime = nextTime;
              }
            }
          }
        });

        tl.to(world, { scale: 1.08, xPercent: -1.2, duration: 0.22 }, 0)
          .to(world, { scale: 1.03, xPercent: 2.2, yPercent: -1.2, duration: 0.18 }, 0.22)
          .to(world, { scale: 1.11, xPercent: -2.4, rotate: -0.35, duration: 0.18 }, 0.4)
          .to(world, { scale: 1, xPercent: 0, yPercent: 0, rotate: 0, duration: 0.32 }, 0.68);

        beatEls.forEach((beat, index) => {
          const start = 0.07 + index * 0.17;
          tl.to(
            beat,
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              duration: 0.045
            },
            start
          ).to(
            beat,
            {
              autoAlpha: 0,
              y: -34,
              rotateX: 9,
              filter: 'blur(10px)',
              duration: 0.055
            },
            start + 0.105
          );
        });

        tl.to(
          app,
          {
            autoAlpha: APP_IMAGE ? 1 : 0,
            y: 0,
            rotateY: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.12
          },
          0.72
        ).to(
          final,
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.1
          },
          0.78
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [video] }
  );

  return (
    <section
      id="top"
      ref={rootRef}
      data-section-fx
      data-section-fx-pinned
      className="cinematic-hero relative isolate bg-ink-950"
    >
      <div
        data-cinematic-scroll
        className="relative"
        style={{ height: `${SCROLL_VH}svh` }}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div
            data-cinematic-world
            className="cinematic-hero-world absolute inset-0"
            aria-hidden="true"
          >
            {video ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={video}
                poster={poster || undefined}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={syncInitialVideoFrame}
                onLoadedData={syncInitialVideoFrame}
              />
            ) : (
              <img
                className="h-full w-full object-cover"
                src={poster}
                alt=""
                draggable={false}
                decoding="async"
              />
            )}
          </div>

          <div className="cinematic-hero-grade pointer-events-none absolute inset-0" />

          <div className="pointer-events-none absolute inset-0 z-10">
            {CINEMATIC_BEATS.map((beat) => (
              <section
                key={beat.id}
                data-cinematic-beat
                className={[
                  'cinematic-copy absolute max-w-[min(44rem,88vw)]',
                  beat.align === 'right'
                    ? 'right-5 top-[32svh] text-right md:right-[8vw]'
                    : 'left-5 top-[30svh] text-left md:left-[7vw]'
                ].join(' ')}
              >
                <p className="cinematic-kicker">
                  {beat.index} / {beat.label}
                </p>
                <h2>
                  <span>{beat.line1}</span>
                  <span>{beat.line2}</span>
                </h2>
              </section>
            ))}
          </div>

          {APP_IMAGE ? (
            <div
              data-cinematic-app
              className="cinematic-app-object pointer-events-none absolute bottom-[16svh] right-[7vw] z-20 hidden w-[min(34rem,38vw)] md:block"
              aria-hidden="true"
            >
              <img
                src={APP_IMAGE}
                alt=""
                className="h-auto w-full rounded-[1.4rem]"
                draggable={false}
                decoding="async"
              />
            </div>
          ) : null}

          <div
            data-cinematic-final
            data-section-fx-inner
            className="cinematic-final relative z-30 flex h-full items-end px-5 pb-[12svh] md:px-[7vw]"
          >
            <div className="max-w-[min(54rem,92vw)]">
              <p className="cinematic-kicker">SpeakToText</p>
              <h1>
                <span>Speak once.</span>
                <span>Get the right output everywhere.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-silver-200/82 md:text-lg">
                {BRAND.heroSubcopy}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/download"
                  size="lg"
                  variant="primary"
                  icon={<ArrowUpRight className="h-4 w-4" />}
                  analyticsEvent="download_click"
                  analyticsLabel="cinematic_hero_download"
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
                  analyticsLabel="cinematic_hero_see_how"
                >
                  See how it works
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
