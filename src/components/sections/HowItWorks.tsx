'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trackEvent } from '@/lib/analytics';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRONT_POSTER = '/how-it-works/zoom/how-works-front-source.png';
const VIDEO_PLATE = '/how-it-works/zoom/mountain-video-plate.png';
const YOUTUBE_VIDEO = process.env.NEXT_PUBLIC_HOW_IT_WORKS_YOUTUBE_URL ?? '';
const OWNED_VIDEO = process.env.NEXT_PUBLIC_HOW_IT_WORKS_VIDEO_URL ?? '';
const OWNED_VIDEO_POSTER =
  process.env.NEXT_PUBLIC_HOW_IT_WORKS_VIDEO_POSTER_URL ?? VIDEO_PLATE;
const FRONT_IMAGE = {
  width: 1672,
  height: 941,
  portalX: 817,
  portalY: 464,
  portalRadius: 76
};

function getYouTubeEmbedUrl(input: string) {
  const value = input.trim();
  if (!value) return '';

  let videoId = value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host.endsWith('youtube.com')) {
      videoId = url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).pop() ?? '';
    }
  } catch {
    videoId = value;
  }

  const safeId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return safeId ? `https://www.youtube-nocookie.com/embed/${safeId}?rel=0&modestbranding=1&playsinline=1` : '';
}

const YOUTUBE_EMBED_URL = getYouTubeEmbedUrl(YOUTUBE_VIDEO);

export function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const videoTrackedRef = useRef(false);
  const hasYouTubeEmbed = YOUTUBE_EMBED_URL.trim().length > 0;
  const hasOwnedVideo = OWNED_VIDEO.trim().length > 0;
  const hasVideoEmbed = hasYouTubeEmbed || hasOwnedVideo;

  const trackHowVideo = (label: string) => {
    if (videoTrackedRef.current) return;
    videoTrackedRef.current = true;
    trackEvent('video_play', { label });
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const scrollArea = root.querySelector<HTMLElement>('[data-how-scroll]');
      const front = root.querySelector<HTMLElement>('[data-how-front]');
      const player = root.querySelector<HTMLElement>('[data-how-player]');
      const videoFrame = root.querySelector<HTMLIFrameElement>('[data-how-video-frame]');
      const ownedVideo = root.querySelector<HTMLVideoElement>('[data-how-owned-video]');
      const exitFade = root.querySelector<HTMLElement>('[data-how-exit]');

      if (!scrollArea || !front || !exitFade) return;

      const getPortalMetrics = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scale = Math.min(viewportWidth / FRONT_IMAGE.width, viewportHeight / FRONT_IMAGE.height);
        const renderedWidth = FRONT_IMAGE.width * scale;
        const renderedHeight = FRONT_IMAGE.height * scale;
        const offsetX = (viewportWidth - renderedWidth) / 2;
        const offsetY = (viewportHeight - renderedHeight) / 2;
        const x = offsetX + FRONT_IMAGE.portalX * scale;
        const y = offsetY + FRONT_IMAGE.portalY * scale;
        const baseRadius = FRONT_IMAGE.portalRadius * scale;
        const radius =
          viewportWidth < 768 ? Math.max(34, Math.min(baseRadius * 0.46, viewportWidth * 0.12)) : baseRadius;
        const fullRadius =
          Math.max(
            Math.hypot(x, y),
            Math.hypot(viewportWidth - x, y),
            Math.hypot(x, viewportHeight - y),
            Math.hypot(viewportWidth - x, viewportHeight - y)
          ) + 16;

        return { x, y, radius, fullRadius };
      };

      const setPortalStart = () => {
        const { x, y, radius } = getPortalMetrics();
        front.style.setProperty('--how-hole-x', `${x}px`);
        front.style.setProperty('--how-hole-y', `${y}px`);
        front.style.setProperty('--how-hole-r', `${radius}px`);
        front.style.transformOrigin = `${x}px ${y}px`;
      };

      const setPortalFull = () => {
        const { x, y, fullRadius } = getPortalMetrics();
        front.style.setProperty('--how-hole-x', `${x}px`);
        front.style.setProperty('--how-hole-y', `${y}px`);
        front.style.setProperty('--how-hole-r', `${fullRadius}px`);
        front.style.transformOrigin = `${x}px ${y}px`;
      };

      setPortalStart();
      gsap.set(front, { willChange: 'opacity, -webkit-mask-image, mask-image' });
      if (player) {
        gsap.set(player, { autoAlpha: 0, pointerEvents: 'none' });
        player.setAttribute('aria-hidden', 'true');
      }
      gsap.set(exitFade, { autoAlpha: 0 });

      const enablePlayer = () => {
        if (!player) return;
        const src = videoFrame?.dataset.src;
        if (videoFrame && src && !videoFrame.src) {
          videoFrame.src = src;
        }
        const ownedSrc = ownedVideo?.dataset.src;
        if (ownedVideo && ownedSrc && !ownedVideo.src) {
          ownedVideo.src = ownedSrc;
        }
        gsap.set(player, { autoAlpha: 1, pointerEvents: 'auto' });
        player.setAttribute('aria-hidden', 'false');
      };

      const disablePlayer = () => {
        if (!player) return;
        gsap.set(player, { autoAlpha: 0, pointerEvents: 'none' });
        player.setAttribute('aria-hidden', 'true');
      };

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        setPortalFull();
        enablePlayer();
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: scrollArea,
            start: 'top top',
            end: () => `+=${Math.max(1, scrollArea.offsetHeight - window.innerHeight)}`,
            scrub: 1.15,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress >= 0.68) {
                enablePlayer();
              } else {
                disablePlayer();
              }
            },
            onRefreshInit: () => {
              setPortalStart();
              gsap.set(front, { clearProps: 'scale' });
              disablePlayer();
              gsap.set(exitFade, { autoAlpha: 0 });
            }
          }
        });

        timeline
          .fromTo(
            front,
            {
              '--how-hole-x': () => `${getPortalMetrics().x}px`,
              '--how-hole-y': () => `${getPortalMetrics().y}px`,
              '--how-hole-r': () => `${getPortalMetrics().radius}px`,
              scale: 1
            },
            {
              '--how-hole-x': () => `${getPortalMetrics().x}px`,
              '--how-hole-y': () => `${getPortalMetrics().y}px`,
              '--how-hole-r': () => `${getPortalMetrics().fullRadius}px`,
              scale: 1,
              duration: 0.74
            },
            0
          )
          .to({}, { duration: 0.36 }, 0.78)
          .to(exitFade, { autoAlpha: 0.72, duration: 0.16 }, 1.12);
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      id="how"
      ref={rootRef}
      className="how-zoom-section relative scroll-mt-0"
    >
      <h2 className="sr-only">How it works</h2>
      <div data-how-scroll className="relative h-[280svh] min-h-[1500px] md:h-[320svh] md:min-h-[1850px]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0 bg-[#02040a]" />

          <div className="how-zoom-stage absolute inset-0">
            <img
              src={VIDEO_PLATE}
              alt=""
              className="how-portal-back absolute inset-0 h-full w-full object-contain"
              draggable={false}
              loading="lazy"
              decoding="async"
            />

            {hasVideoEmbed ? (
              <div
                data-how-player
                className="how-video-player absolute"
                aria-hidden="true"
                onPointerDown={() => trackHowVideo('how_it_works_video_interaction')}
              >
                {hasOwnedVideo ? (
                  <video
                    data-how-owned-video
                    data-src={OWNED_VIDEO}
                    title="SpeakToText how it works video"
                    className="absolute inset-0 h-full w-full object-contain"
                    controls
                    playsInline
                    preload="none"
                    poster={OWNED_VIDEO_POSTER}
                    onPlay={() => trackHowVideo('how_it_works_owned_video_play')}
                  />
                ) : null}
                {hasYouTubeEmbed ? (
                <iframe
                  data-how-video-frame
                  data-src={YOUTUBE_EMBED_URL}
                  title="SpeakToText how it works video"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                ) : null}
              </div>
            ) : null}

            <img
              src={FRONT_POSTER}
              alt=""
              data-how-front
              className="how-portal-front absolute inset-0 h-full w-full object-contain"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div data-how-exit className="pointer-events-none absolute inset-0 z-[6] bg-[#02040a]" />
        </div>
      </div>
    </section>
  );
}
