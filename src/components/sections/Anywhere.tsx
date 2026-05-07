'use client';

import { SectionHeading } from '../ui/SectionHeading';
import { BRANDS } from './anywhere-3d/brandsData';

const visibleBrands = BRANDS.slice(0, 96);

export function Anywhere() {
  return (
    <section
      id="anywhere"
      className="relative isolate scroll-mt-28 overflow-hidden py-12 md:scroll-mt-32 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(36,48,70,0.16),transparent_60%),linear-gradient(180deg,rgba(5,7,13,1)_0%,rgba(5,7,13,0.84)_11%,rgba(5,7,13,0.18)_30%,rgba(5,7,13,0.12)_68%,rgba(5,7,13,0.86)_92%,rgba(5,7,13,1)_100%),linear-gradient(90deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0)_20%,rgba(0,0,0,0)_80%,rgba(0,0,0,0.64)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.11] [background-image:radial-gradient(ellipse_at_50%_52%,rgba(165,180,210,0.18),transparent_58%)]"
        style={{
          maskImage:
            'linear-gradient(180deg, transparent 0%, #000 18%, #000 78%, transparent 100%)'
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-36 bg-gradient-to-b from-ink-950 via-ink-950/80 to-transparent md:h-44"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent md:h-52"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          title="Works where you write."
          accent="One voice workflow."
        />
      </div>

      <div className="relative z-10 left-1/2 mt-8 w-screen -translate-x-1/2 overflow-hidden bg-transparent pb-8 md:mt-12 md:pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-ink-950 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-ink-950 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[14vw] bg-gradient-to-r from-ink-950 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[14vw] bg-gradient-to-l from-ink-950 to-transparent"
        />

        <div className="mx-auto grid max-w-[1500px] grid-cols-3 gap-3 px-6 sm:grid-cols-5 md:grid-cols-8 md:gap-4 lg:grid-cols-12 lg:px-10">
          {visibleBrands.map((brand, index) => (
            <div
              key={brand.id}
              className="group relative flex h-20 items-center justify-center rounded-[18px] border border-white/[0.055] bg-white/[0.025] shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:z-10 hover:-translate-y-1 hover:border-gold-300/40 hover:bg-white/[0.055] hover:shadow-[0_22px_80px_rgba(210,161,54,0.18)] md:h-24"
              style={{
                transform:
                  index % 5 === 0
                    ? 'translateY(10px)'
                    : index % 7 === 0
                      ? 'translateY(-8px)'
                      : undefined
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-[18px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 42%, ${brand.accent}26, transparent 62%)`
                }}
              />
              <img
                src={brand.iconUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="relative h-8 w-8 object-contain opacity-80 saturate-[0.9] transition duration-300 group-hover:scale-110 group-hover:opacity-100 md:h-10 md:w-10"
              />
              <span className="sr-only">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
