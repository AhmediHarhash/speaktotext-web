'use client';

import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DEMO_TABS } from '@/lib/content';
import {
  ChatGPTIcon,
  ClaudeIcon,
  GmailIcon,
  LinkedInIcon,
  WordIcon
} from '../ui/BrandIcons';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type DemoItem = (typeof DEMO_TABS)[number];
type DemoId = DemoItem['id'];

const TAB_ICONS = {
  chatgpt: ChatGPTIcon,
  claude: ClaudeIcon,
  gmail: GmailIcon,
  linkedin: LinkedInIcon,
  docs: WordIcon
} as const;

const DEMO_META: Record<
  DemoId,
  { number: string; accent: string; mode: string }
> = {
  chatgpt: {
    number: '01',
    accent: '#f2c76d',
    mode: 'Prompt'
  },
  claude: {
    number: '02',
    accent: '#d7b77a',
    mode: 'Brief'
  },
  gmail: {
    number: '03',
    accent: '#e6c98e',
    mode: 'Reply'
  },
  linkedin: {
    number: '04',
    accent: '#c9d2e0',
    mode: 'Post'
  },
  docs: {
    number: '05',
    accent: '#ffe6a3',
    mode: 'Notes'
  }
};

function splitWords(text: string) {
  return text.split(' ').filter(Boolean);
}

function DemoWords({
  text,
  kind,
  prefix
}: {
  text: string;
  kind: 'rough' | 'polished' | 'ghost';
  prefix: string;
}) {
  return (
    <>
      {splitWords(text).map((word, index) => (
        <span
          key={`${prefix}-${word}-${index}`}
          data-demo-rough-word={kind === 'rough' ? 'true' : undefined}
          data-demo-polished-word={kind === 'polished' ? 'true' : undefined}
          data-demo-ghost-word={kind === 'ghost' ? 'true' : undefined}
        >
          {word}
        </span>
      ))}
    </>
  );
}

export function Demos() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const track = root.querySelector<HTMLElement>('[data-demo-track]');
      const progress = root.querySelector<HTMLElement>('[data-demo-progress]');
      const progressText = root.querySelector<HTMLElement>(
        '[data-demo-progress-text]'
      );
      const panels = gsap.utils.toArray<HTMLElement>('[data-demo-panel]', root);

      if (!track || panels.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(track, { clearProps: 'all' });
        gsap.set(panels, { autoAlpha: 1, clearProps: 'all' });
        if (progress) gsap.set(progress, { scaleX: 1 });
        if (progressText) progressText.textContent = `${panels.length}/${panels.length}`;
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(track, { x: 0 });
        gsap.set(panels, {
          autoAlpha: 0.4,
          scale: 0.92,
          filter: 'blur(5px)'
        });
        gsap.set(panels[0]!, {
          autoAlpha: 1,
          scale: 1,
          filter: 'blur(0px)'
        });
        if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: '0% 50%' });

        const getDistance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        const horizontal = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'demos-horizontal-gallery',
            trigger: root,
            start: 'top top',
            end: () => `+=${getDistance() + window.innerHeight * 0.82}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const activeIndex = Math.min(
                panels.length - 1,
                Math.max(0, Math.round(self.progress * (panels.length - 1)))
              );

              panels.forEach((panel, index) => {
                panel.toggleAttribute('data-active', index === activeIndex);
              });

              if (progress) {
                gsap.set(progress, { scaleX: self.progress });
              }
              if (progressText) {
                progressText.textContent = `${activeIndex + 1}/${panels.length}`;
              }
            }
          }
        });

        panels.forEach((panel) => {
          const chrome = gsap.utils.toArray<HTMLElement>(
            '[data-demo-chrome]',
            panel
          );
          const ghostWords = gsap.utils.toArray<HTMLElement>(
            '[data-demo-ghost-word]',
            panel
          );
          const proofCards = gsap.utils.toArray<HTMLElement>(
            '[data-demo-proof]',
            panel
          );
          const energyPath = panel.querySelector<HTMLElement>(
            '[data-demo-energy]'
          );
          const roughWords = gsap.utils.toArray<HTMLElement>(
            '[data-demo-rough-word]',
            panel
          );
          const polishedLines = gsap.utils.toArray<HTMLElement>(
            '[data-demo-polished-line]',
            panel
          );
          const polishedWords = gsap.utils.toArray<HTMLElement>(
            '[data-demo-polished-word]',
            panel
          );

          gsap.to(panel, {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              containerAnimation: horizontal,
              trigger: panel,
              start: 'left 80%',
              end: 'center center',
              scrub: 0.6
            }
          });

          gsap.to(panel, {
            autoAlpha: 0.42,
            scale: 0.94,
            filter: 'blur(4px)',
            ease: 'none',
            scrollTrigger: {
              containerAnimation: horizontal,
              trigger: panel,
              start: 'center center',
              end: 'right 18%',
              scrub: 0.6
            }
          });

          gsap.fromTo(
            ghostWords,
            { autoAlpha: 0.035, y: 34, filter: 'blur(14px)' },
            {
              autoAlpha: 0.42,
              y: 0,
              filter: 'blur(0px)',
              ease: 'none',
              stagger: 0.007,
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: 'left 82%',
                end: 'left 38%',
                scrub: 0.65
              }
            }
          );

          gsap.to(ghostWords, {
            autoAlpha: 0.13,
            y: -18,
            filter: 'blur(5px)',
            ease: 'none',
            stagger: 0.003,
            scrollTrigger: {
              containerAnimation: horizontal,
              trigger: panel,
              start: 'left 36%',
              end: 'right 16%',
              scrub: 0.7
            }
          });

          gsap.fromTo(
            proofCards,
            { y: 36, rotateX: -8, autoAlpha: 0, filter: 'blur(10px)' },
            {
              y: 0,
              rotateX: 0,
              autoAlpha: 1,
              filter: 'blur(0px)',
              ease: 'none',
              stagger: 0.08,
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: 'left 70%',
                end: 'left 30%',
                scrub: 0.55
              }
            }
          );

          if (energyPath) {
            gsap.fromTo(
              energyPath,
              { scaleX: 0, autoAlpha: 0.18 },
              {
                scaleX: 1,
                autoAlpha: 1,
                ease: 'none',
                scrollTrigger: {
                  containerAnimation: horizontal,
                  trigger: panel,
                  start: 'left 56%',
                  end: 'left 16%',
                  scrub: 0.7
                }
              }
            );
          }

          gsap.fromTo(
            chrome,
            { autoAlpha: 0, y: 16, filter: 'blur(8px)' },
            {
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'none',
              stagger: 0.04,
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: 'left 72%',
                end: 'left 42%',
                scrub: 0.55
              }
            }
          );

          gsap.fromTo(
            roughWords,
            { autoAlpha: 0.18, y: 18, rotateX: -38, filter: 'blur(8px)' },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              ease: 'none',
              stagger: 0.012,
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: 'left 68%',
                end: 'left 32%',
                scrub: 0.5
              }
            }
          );

          gsap.fromTo(
            polishedLines,
            { autoAlpha: 0, x: 34, filter: 'blur(10px)' },
            {
              autoAlpha: 1,
              x: 0,
              filter: 'blur(0px)',
              ease: 'none',
              stagger: 0.08,
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: 'left 42%',
                end: 'left 8%',
                scrub: 0.55
              }
            }
          );

          gsap.fromTo(
            polishedWords,
            { autoAlpha: 0.2, yPercent: 48 },
            {
              autoAlpha: 1,
              yPercent: 0,
              ease: 'none',
              stagger: 0.009,
              scrollTrigger: {
                containerAnimation: horizontal,
                trigger: panel,
                start: 'left 34%',
                end: 'left 0%',
                scrub: 0.55
              }
            }
          );
        });

        return () => {
          horizontal.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="demos"
      data-section-fx
      data-section-fx-pinned
      className="demo-scroll-section relative isolate min-h-[100svh] scroll-mt-28 overflow-hidden md:scroll-mt-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="demo-scroll-kicker pointer-events-none absolute left-6 right-6 top-24 z-30 mx-auto flex max-w-7xl items-center justify-between gap-4 lg:left-10 lg:right-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gold-200/75">
            Story proof
          </p>
          <h2 className="mt-2 max-w-3xl text-balance text-3xl font-semibold leading-[1.02] tracking-[0] text-silver-100 md:text-5xl lg:text-6xl">
            Raw thought crosses the cursor.{' '}
            <span className="script-accent gold-text">Finished writing lands.</span>
          </h2>
        </div>
        <div className="hidden min-w-28 text-right font-mono text-xs text-silver-300 md:block">
          <span data-demo-progress-text>1/{DEMO_TABS.length}</span>
          <div className="mt-3 h-px w-full overflow-hidden bg-white/12">
            <span
              data-demo-progress
              className="block h-full w-full origin-left scale-x-0 bg-gold-300"
            />
          </div>
        </div>
      </div>

      <div
        data-demo-track
        className="demo-scroll-track flex min-h-[100svh] w-max will-change-transform motion-reduce:w-full motion-reduce:flex-col motion-reduce:gap-8 motion-reduce:py-36"
      >
        {DEMO_TABS.map((demo) => (
          <DemoPanel key={demo.id} demo={demo} />
        ))}
      </div>
    </section>
  );
}

function DemoPanel({ demo }: { demo: DemoItem }) {
  const Icon = TAB_ICONS[demo.id];
  const meta = DEMO_META[demo.id];
  const style = { '--demo-accent': meta.accent } as CSSProperties;

  return (
    <article
      data-demo-panel
      className="demo-scroll-panel flex min-h-[100svh] w-screen shrink-0 items-center px-6 pb-16 pt-56 motion-reduce:min-h-0 motion-reduce:w-full md:px-10 md:pb-20 md:pt-52"
      style={style}
    >
      <div className="demo-story-watermark" aria-hidden="true">
        <span className="demo-story-number">{meta.number}</span>
        <p className="demo-story-ghost">
          <DemoWords
            text={demo.beforeText}
            kind="ghost"
            prefix={`${demo.id}-ghost`}
          />
        </p>
      </div>

      <div className="demo-scroll-panel-inner mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.52fr_1.48fr] lg:gap-12">
        <div className="demo-scroll-narrative flex flex-col justify-between gap-8">
          <div data-demo-chrome>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-silver-200">
              <Icon className="h-4 w-4" />
              {demo.label}
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-gold-200/70">
              {meta.number} / {meta.mode}
            </p>
            <h3 className="mt-4 max-w-xl text-balance text-4xl font-semibold leading-[0.96] tracking-[0] text-silver-100 md:text-5xl">
              {demo.title}
            </h3>
            <p className="mt-5 max-w-md text-pretty text-base leading-8 text-silver-300">
              {demo.caption}
            </p>
          </div>
        </div>

        <div className="demo-scroll-comparison demo-proof-stage min-w-0">
          <div data-demo-energy className="demo-voice-energy" aria-hidden="true" />
          <section data-demo-proof className="demo-scroll-card demo-scroll-card-rough">
            <div data-demo-chrome className="demo-scroll-card-label">
              <span>Before</span>
              <span>spoken thought</span>
            </div>
            <p className="demo-scroll-rough-text">
              <DemoWords
                text={demo.beforeText}
                kind="rough"
                prefix={`${demo.id}-rough`}
              />
            </p>
          </section>

          <section data-demo-proof className="demo-scroll-card demo-scroll-card-polished">
            <div data-demo-chrome className="demo-scroll-card-label">
              <span>After</span>
              <span>{demo.resultLabel}</span>
            </div>
            <div className="demo-scroll-output">
              <h4 data-demo-polished-line>
                <DemoWords
                  text={demo.afterTitle}
                  kind="polished"
                  prefix={`${demo.id}-title`}
                />
              </h4>
              {demo.afterBlocks.map((block, index) => (
                <p key={block} data-demo-polished-line>
                  <DemoWords
                    text={block}
                    kind="polished"
                    prefix={`${demo.id}-block-${index}`}
                  />
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
