'use client';

import { memo, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';

type HlsVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  loadWhenVisible?: boolean;
  rootMargin?: string;
  analyticsLabel?: string;
};

/**
 * Memoized HLS (.m3u8) background video.
 *
 * Prefers hls.js where supported (Chrome, Firefox, Edge) and falls back
 * to native `.m3u8` playback on Safari/iOS. Always autoplay + muted +
 * loop + playsInline for ambient-background use.
 *
 * If autoplay is blocked by the browser, a `canplay` handler will call
 * play() explicitly. All errors are logged so hover issues are diagnosable.
 */
function HlsVideoInner({
  src,
  className,
  poster,
  loadWhenVisible = true,
  rootMargin = '360px 0px',
  analyticsLabel = 'hls_background'
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackedPlayRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let observer: IntersectionObserver | null = null;
    let isAttached = false;

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch((err) => {
          // Autoplay can be blocked until user interacts. That is fine.
          console.warn('[HlsVideo] autoplay blocked:', err?.message ?? err);
        });
      }
    };

    const trackPlay = () => {
      if (trackedPlayRef.current) return;
      trackedPlayRef.current = true;
      trackEvent('video_play', {
        label: analyticsLabel
      });
    };

    const attachVideo = () => {
      if (isAttached) return;
      isAttached = true;

      video.addEventListener('canplay', tryPlay);
      video.addEventListener('play', trackPlay);

      if (!src.includes('.m3u8')) {
        video.src = src;
        return;
      }

      // 1. Prefer hls.js for every non-Safari browser.
      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 18,
          maxMaxBufferLength: 36,
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 18
        });
        hls.on(Hls.Events.MANIFEST_PARSED, () => tryPlay());
        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error('[HlsVideo] hls.js error:', data.type, data.details);
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return;
      }

      // 2. Native HLS (Safari / iOS).
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return;
      }

      // 3. No HLS support. Leave the poster visible.
      console.warn('[HlsVideo] neither hls.js nor native HLS supported');
    };

    if (loadWhenVisible && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          attachVideo();
          observer?.disconnect();
        },
        { rootMargin }
      );
      observer.observe(video);
    } else {
      attachVideo();
    }

    return () => {
      observer?.disconnect();
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('play', trackPlay);
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [analyticsLabel, loadWhenVisible, rootMargin, src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      poster={poster}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}

export const HlsVideo = memo(HlsVideoInner);
