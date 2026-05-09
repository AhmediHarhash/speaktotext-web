import { ArrowUpRight } from 'lucide-react';
import { BRAND } from '@/lib/content';
import { MEDIA_BASE_URL, SITE_EMAIL } from '@/lib/site';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/Button';
import { Wordmark } from '../ui/Logo';
import { HlsVideo } from '../ui/HlsVideo';

/**
 * Final CTA follows the Synapse hero spec the user referenced:
 *   - Section is ~100vh relative
 *   - Background owned video: height 80vh, absolute, bottom-[35vh],
 *     100% opacity, no dark overlay, "floats" behind the text
 *   - Text content sits centered, z-10 on top of the video
 *   - NO container / NO glass box around the text
 *   - Our palette (gold + silver) applied to CTAs only
 */

const FINAL_CTA_VIDEO =
  process.env.NEXT_PUBLIC_FINAL_CTA_VIDEO_URL ??
  `${MEDIA_BASE_URL}/final-cta/v2/final-cta-loop.mp4`;

const FINAL_CTA_POSTER =
  process.env.NEXT_PUBLIC_FINAL_CTA_VIDEO_POSTER_URL ??
  `${MEDIA_BASE_URL}/final-cta/v2/final-cta-poster.avif`;

export function FinalCta() {
  return (
    <section data-section-fx className="relative isolate -mt-28 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-transparent pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[34rem] bg-gradient-to-b from-transparent via-black/85 to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-72 z-0 bg-black"
      />
      {/* ===== TOP: OWNED FLOWING MOTION ===== */}
          {/* Video block sits at the top as its own layout element. Text flows below. */}
      <div className="relative z-0 -mt-10 h-[48vh] w-full overflow-hidden md:h-[54vh]">
        <HlsVideo
          src={FINAL_CTA_VIDEO}
          poster={FINAL_CTA_POSTER}
          className="h-full w-full object-cover"
          rootMargin="1800px 0px"
          analyticsLabel="final_cta_background_motion"
        />
          {/* Soft bottom fade so the waves dissolve into the text block below with no hard edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"
        />
        {/* Soft top fade into the page above */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent"
        />
      </div>

        {/* ===== TEXT BLOCK UNDER the moving object ===== */}
      <div data-section-fx-inner className="relative z-10 -mt-20 flex w-full items-start justify-center px-6 pb-24 md:-mt-28 md:pb-32">
        <div className="w-full max-w-3xl text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-balance text-5xl font-medium leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl">
              Stop typing.{' '}
              <span className="script-accent gold-text">Start speaking.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {BRAND.subTagline} Hold a key. Speak. Release. Done.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/download"
                size="lg"
                variant="primary"
                icon={<ArrowUpRight className="h-4 w-4" />}
                analyticsEvent="download_click"
                analyticsLabel="final_cta_download"
              >
                Download for Windows
              </ButtonLink>
              <ButtonLink
                href="#how"
                size="lg"
                variant="ghost"
                analyticsEvent="cta_click"
                analyticsLabel="final_cta_see_how_it_works"
              >
                See how it works
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-5 text-xs text-white/60">
            macOS and mobile: <span className="text-white/80">coming soon</span>
            </p>
          </Reveal>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        <footer className="relative grid grid-cols-1 gap-10 pb-14 pt-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />
          <div className="flex flex-col gap-4">
            <Wordmark
              className="gap-3.5"
              markClassName="h-[51px] w-[51px]"
              textClassName="text-[25px]"
            />
            <p className="max-w-xs text-sm leading-relaxed text-silver-300">
              Windows-native voice writing. Push-to-talk. Private by default.
            </p>
            <p className="text-xs text-silver-400">
              © {new Date().getFullYear()} HEKAX. All rights reserved.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              ['How it works', '#how'],
              ['Demos', '#demos'],
              ['Pricing', '#pricing'],
              ['FAQ', '#faq']
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ['About', '#'],
              ['Changelog', '#'],
              ['Roadmap', '#'],
              ['Contact', `mailto:${SITE_EMAIL}`]
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
              ['Data handling', '/privacy'],
              ['Security', '/security']
            ]}
          />
        </footer>
      </div>
    </section>
  );
}

function FooterCol({
  title,
  links
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h5 className="text-xs font-semibold uppercase tracking-[0.22em] text-silver-200">
        {title}
      </h5>
      <ul className="flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm text-silver-400 transition hover:text-silver-100"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
