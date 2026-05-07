'use client';

import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  ThumbsUp,
  ArrowBigUp,
  ArrowBigDown,
  Hash,
  Star,
  Paperclip,
  Archive,
  Reply,
  CornerUpLeft,
  ChevronUp,
  BadgeCheck
} from 'lucide-react';
import { TESTIMONIALS, type Testimonial } from '@/lib/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import {
  XIcon,
  LinkedInIcon,
  RedditIcon,
  DiscordIcon,
  SlackIcon,
  YouTubeIcon,
  MediumIcon,
  GmailIcon
} from '../ui/BrandIcons';
import { cn } from '@/lib/cn';

/**
 * Native-feeling testimonial cards, each rendered in the exact visual language
 * of the platform it came from (X, LinkedIn, Reddit, Discord, Slack, YouTube,
 * Product Hunt, App Store, Gmail, Medium). Varied star ratings where the
 * platform supports them. Laid out as a masonry cascade for a natural feed
 * rhythm instead of a rigid grid.
 */

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative scroll-mt-28 py-28 md:scroll-mt-32 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="What people are saying"
          title="Real feedback,"
          accent="from real places."
          subtitle="Every card below is styled to match the platform where it was written. Different places, different voices, same verdict."
        />

        <Reveal delay={0.15}>
          <div className="mt-16 [column-fill:_balance] columns-1 gap-5 md:columns-2 lg:columns-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={`${t.platform}-${i}`}
                className="mb-5 break-inside-avoid"
              >
                <PlatformCard t={t} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlatformCard({ t }: { t: Testimonial }) {
  switch (t.platform) {
    case 'x':
      return <XCard t={t} />;
    case 'linkedin':
      return <LinkedInCard t={t} />;
    case 'reddit':
      return <RedditCard t={t} />;
    case 'discord':
      return <DiscordCard t={t} />;
    case 'slack':
      return <SlackCard t={t} />;
    case 'youtube':
      return <YouTubeCard t={t} />;
    case 'producthunt':
      return <ProductHuntCard t={t} />;
    case 'appstore':
      return <AppStoreCard t={t} />;
    case 'gmail':
      return <GmailCard t={t} />;
    case 'medium':
      return <MediumCard t={t} />;
  }
}

// -- shared primitives -------------------------------------------------

function Avatar({
  label,
  className,
  gradient = 'from-gold-300 to-gold-500'
}: {
  label: string;
  className?: string;
  gradient?: string;
}) {
  return (
    <span
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-ink-950 shadow-md',
        gradient,
        className
      )}
    >
      {label}
    </span>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < count ? 'fill-gold-300 text-gold-300' : 'text-silver-400/30'
          )}
        />
      ))}
    </div>
  );
}

function PlatformBadge({
  Icon,
  label,
  className
}: {
  Icon: (p: { className?: string }) => JSX.Element;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// -- X / Twitter -------------------------------------------------------

function XCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 text-white shadow-xl">
      <div className="flex items-start gap-3">
        <Avatar label={t.avatar} gradient="from-[#1d9bf0] to-[#0b6bb5]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[15px] font-semibold leading-tight">
            <span className="truncate">{t.name}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-[#1d9bf0]" />
          </div>
          <div className="text-sm text-white/50">
                  {t.handle}, {t.timestamp}
          </div>
        </div>
        <XIcon className="h-4 w-4 shrink-0 text-white/80" />
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-white/95">{t.quote}</p>
      <div className="mt-4 flex items-center gap-6 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" /> {t.meta?.replies as number}
        </span>
        <span className="flex items-center gap-1.5">
          <Repeat2 className="h-4 w-4" /> {t.meta?.reposts as number}
        </span>
        <span className="flex items-center gap-1.5">
          <Heart className="h-4 w-4" />
          {(t.meta?.likes as number).toLocaleString()}
        </span>
        <span className="ml-auto">
          <Share className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

// -- LinkedIn ----------------------------------------------------------

function LinkedInCard({ t }: { t: Testimonial }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#0a66c2]/20 bg-white text-ink-950 shadow-xl">
      <div className="flex items-start gap-3 px-5 pt-5">
        <Avatar label={t.avatar} gradient="from-[#0a66c2] to-[#004182]" />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-tight">{t.name}</div>
          <div className="text-xs text-black/60">{t.role}</div>
          <div className="mt-1 text-[11px] text-black/50">
                  {t.timestamp}, <span className="text-black/40">🌐</span>
          </div>
        </div>
        <LinkedInIcon className="h-5 w-5 shrink-0 text-[#0a66c2]" />
      </div>
      <p className="px-5 pt-3 text-[14px] leading-relaxed text-ink-950/90">{t.quote}</p>
      <div className="mt-4 flex items-center justify-between border-t border-black/10 px-5 py-2.5 text-[11px] text-black/60">
        <span className="flex items-center gap-1.5">
          <span className="flex items-center">
            <span className="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0a66c2] text-[8px] text-white">
              👍
            </span>
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#df704d] text-[8px] text-white">
              ❤
            </span>
          </span>
          {(t.meta?.reactions as number).toLocaleString()}
        </span>
        <span>{(t.meta?.comments as number).toLocaleString()} comments</span>
      </div>
    </article>
  );
}

// -- Reddit ------------------------------------------------------------

function RedditCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-[#ff4500]/30 bg-[#1a1a1b] text-white shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5 text-xs">
        <RedditIcon className="h-4 w-4 text-[#ff4500]" />
        <span className="font-semibold text-white">
          {t.meta?.subreddit as string}
        </span>
                        <span className="text-white/40">/</span>
        <span className="text-white/50">Posted by {t.handle}</span>
        <span className="ml-auto text-white/40">{t.timestamp}</span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[14px] leading-relaxed text-white/90">{t.quote}</p>
      </div>
      <div className="flex items-center gap-5 border-t border-white/5 px-4 py-2 text-[11px] text-white/60">
        <span className="flex items-center gap-1">
          <ArrowBigUp className="h-4 w-4 text-[#ff4500]" />
          <span className="font-semibold text-white">
            {((t.meta?.upvotes as number) / 1000).toFixed(1)}k
          </span>
          <ArrowBigDown className="h-4 w-4" />
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5" />
          {t.meta?.comments as number} comments
        </span>
        <span className="flex items-center gap-1.5">
          <Share className="h-3.5 w-3.5" /> Share
        </span>
      </div>
    </article>
  );
}

// -- Discord -----------------------------------------------------------

function DiscordCard({ t }: { t: Testimonial }) {
  return (
    <article className="flex overflow-hidden rounded-xl border border-white/5 bg-[#313338] text-white shadow-xl">
      <div className="flex w-1 shrink-0 bg-[#5865f2]" />
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 text-xs">
          <DiscordIcon className="h-4 w-4 text-[#5865f2]" />
          <span className="font-semibold text-white">
            {t.meta?.server as string}
          </span>
                        <span className="text-white/40">/</span>
          <span className="text-white/60">
            <Hash className="-mt-0.5 inline h-3 w-3" />
            {(t.meta?.channel as string).replace('#', '')}
          </span>
        </div>
        <div className="mt-3 flex items-start gap-3">
          <Avatar label={t.avatar} gradient="from-[#5865f2] to-[#3b44bd]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-[#f2c94c]">
                {t.name}
              </span>
              <span className="text-[10px] text-white/40">{t.timestamp}</span>
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-white/90">
              {t.quote}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

// -- Slack -------------------------------------------------------------

function SlackCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-xl border border-black/10 bg-white text-ink-950 shadow-xl">
      <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2 text-xs text-black/70">
        <SlackIcon className="h-4 w-4 text-[#e01e5a]" />
        <span className="font-semibold">{t.meta?.channel as string}</span>
      </div>
      <div className="flex items-start gap-3 p-4">
        <Avatar label={t.avatar} gradient="from-[#e01e5a] to-[#9d0c3b]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold">{t.name}</span>
            <span className="text-[10px] text-black/50">{t.timestamp}</span>
          </div>
          <p className="mt-1 text-[14px] leading-relaxed">{t.quote}</p>
          <div className="mt-3 inline-flex rounded-full border border-black/10 px-2.5 py-1 text-xs">
            {t.meta?.reactions as string}
          </div>
        </div>
      </div>
    </article>
  );
}

// -- YouTube comment ---------------------------------------------------

function YouTubeCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5 text-white shadow-xl">
      <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
        <YouTubeIcon className="h-4 w-4 text-[#ff0033]" />
        Comment on {'"'}
        {t.meta?.video as string}
        {'"'}
      </div>
      <div className="flex items-start gap-3">
        <Avatar label={t.avatar} gradient="from-[#ff0033] to-[#99001f]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-white">{t.handle}</span>
            <span className="text-[11px] text-white/50">{t.timestamp}</span>
          </div>
          <p className="mt-1.5 text-[14px] leading-relaxed text-white/90">
            {t.quote}
          </p>
          <div className="mt-3 flex items-center gap-5 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="h-3.5 w-3.5" /> {t.meta?.likes as number}
            </span>
            <span>
              <Reply className="inline h-3.5 w-3.5" /> Reply
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

// -- Product Hunt ------------------------------------------------------

function ProductHuntCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-[#da552f]/30 bg-[#1b1b1f] p-5 text-white shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <PlatformBadge
          Icon={(p) => <ChevronUp {...p} />}
          label="Product Hunt"
          className="bg-[#da552f] text-white"
        />
        <span className="text-xs text-white/60">{t.timestamp}</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-[#da552f]/40 bg-[#da552f]/10 px-2 py-2">
          <ChevronUp className="h-4 w-4 text-[#da552f]" />
          <span className="mt-0.5 text-xs font-bold text-white">
            {((t.meta?.upvotes as number) / 1000).toFixed(1)}k
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Avatar label={t.avatar} gradient="from-[#da552f] to-[#8a3318]" className="h-8 w-8" />
            <div className="min-w-0">
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-[11px] text-white/60">{t.role}</div>
            </div>
            {t.stars && (
              <div className="ml-auto">
                <Stars count={t.stars} />
              </div>
            )}
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-white/90">{t.quote}</p>
        </div>
      </div>
    </article>
  );
}

// -- App Store review -------------------------------------------------

function AppStoreCard({ t }: { t: Testimonial }) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/5 bg-gradient-to-br from-[#1a1a1d] to-[#0e0e10] p-5 text-white shadow-xl">
      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
        <span className="font-semibold text-white/90">Microsoft Store review</span>
        <span>{t.timestamp}</span>
      </div>
      {t.stars && <Stars count={t.stars} />}
      <h5 className="mt-3 text-[15px] font-semibold text-white">
        {t.meta?.title as string}
      </h5>
      <p className="mt-2 text-[14px] leading-relaxed text-white/85">{t.quote}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
        <Avatar label={t.avatar} gradient="from-[#4a90e2] to-[#1f5a9a]" className="h-7 w-7 text-xs" />
        <span>{t.name}</span>
      </div>
    </article>
  );
}

// -- Gmail email -------------------------------------------------------

function GmailCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white text-ink-950 shadow-xl">
      <div className="flex items-center gap-2 border-b border-black/5 px-5 py-3 text-xs text-black/60">
        <GmailIcon className="h-4 w-4 text-[#ea4335]" />
        <span className="font-semibold text-black/80">Inbox</span>
        <span className="ml-auto flex items-center gap-3">
          <Archive className="h-3.5 w-3.5" />
          <Paperclip className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <Avatar label={t.avatar} gradient="from-[#ea4335] to-[#a32218]" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-[14px] font-semibold text-ink-950">
                {t.name}
              </span>
              <span className="shrink-0 text-[11px] text-black/50">
                {t.timestamp}
              </span>
            </div>
            <div className="text-[13px] text-black/60">
                    {t.role}, <span className="text-black/40">to me</span>
            </div>
            <div className="mt-1 text-[13px] font-semibold text-ink-950/90">
              {t.meta?.subject as string}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-950/90">
              {t.quote}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1 text-xs text-black/70">
              <CornerUpLeft className="h-3 w-3" /> Reply
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// -- Medium ------------------------------------------------------------

function MediumCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-white/8 bg-gradient-to-br from-[#16181a] to-[#0a0b0c] p-6 text-white shadow-xl">
      <div className="mb-3 flex items-center justify-between text-[11px] text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <MediumIcon className="h-4 w-4 text-white" />
                    Medium, {t.timestamp}
        </span>
        {t.stars && <Stars count={t.stars} />}
      </div>
      <blockquote className="border-l-2 border-gold-300 pl-4 text-[17px] font-serif italic leading-snug text-white/95">
        {t.quote}
      </blockquote>
      <div className="mt-5 flex items-center gap-3">
        <Avatar label={t.avatar} gradient="from-silver-100 to-silver-300" className="text-black" />
        <div className="min-w-0">
          <div className="text-sm font-semibold">{t.name}</div>
          <div className="text-[11px] text-white/55">{t.role}</div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-white/60">
          <span>👏 {(t.meta?.claps as number).toLocaleString()}</span>
          <span>💬 {t.meta?.responses as number}</span>
        </div>
      </div>
    </article>
  );
}
