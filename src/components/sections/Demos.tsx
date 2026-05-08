'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { DEMO_TABS } from '@/lib/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import {
  ChatGPTIcon,
  ClaudeIcon,
  GmailIcon,
  LinkedInIcon,
  WordIcon
} from '../ui/BrandIcons';
import { cn } from '@/lib/cn';

const TAB_ICONS = {
  chatgpt: ChatGPTIcon,
  claude: ClaudeIcon,
  gmail: GmailIcon,
  linkedin: LinkedInIcon,
  docs: WordIcon
} as const;

type DemoId = (typeof DEMO_TABS)[number]['id'];

function splitWords(text: string) {
  return text.split(' ').filter(Boolean);
}

const DEMO_OUTPUT_EFFECTS: Record<
  DemoId,
  { sweep: string[]; flip: string[]; spin: string[]; frame: string[] }
> = {
  chatgpt: {
    sweep: ['SpeakToText', 'polished', 'organic'],
    flip: ['launch'],
    spin: ['simple'],
    frame: ['Context:']
  },
  claude: {
    sweep: ['premium', 'polished', 'smooth'],
    flip: ['GSAP'],
    spin: ['demo'],
    frame: ['Goal:']
  },
  gmail: {
    sweep: ['Thursday', 'notes', 'team'],
    flip: ['mobile'],
    spin: ['pricing'],
    frame: ['Subject:']
  },
  linkedin: {
    sweep: ['Typing', 'voice', 'usable'],
    flip: ['drafts'],
    spin: ['spoken'],
    frame: ['Clean']
  },
  docs: {
    sweep: ['Focus', 'before-and-after', 'restrained'],
    flip: ['GSAP'],
    spin: ['SEO'],
    frame: ['Key']
  }
};

function normalizeEffectWord(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

function getOutputEffect(word: string, demoId: DemoId) {
  const normalized = normalizeEffectWord(word);
  const effects = DEMO_OUTPUT_EFFECTS[demoId];
  const sweep = effects.sweep.some(
    (term) => normalizeEffectWord(term) === normalized
  );
  const flipIndex = effects.flip.findIndex(
    (term) => normalizeEffectWord(term) === normalized
  );
  const spin = effects.spin.some(
    (term) => normalizeEffectWord(term) === normalized
  );
  const frame = effects.frame.some(
    (term) => normalizeEffectWord(term) === normalized
  );

  return {
    sweep,
    flip: flipIndex >= 0,
    spin,
    frame,
    direction: Math.max(flipIndex, 0) % 3
  };
}

function renderOutputWords(text: string, keyPrefix: string, demoId: DemoId) {
  return splitWords(text).map((word, index) => {
    const effect = getOutputEffect(word, demoId);

    if (!effect.sweep && !effect.flip && !effect.spin && !effect.frame) {
      return (
        <span key={`${keyPrefix}-${word}-${index}`} data-demo-output-word>
          {word}
        </span>
      );
    }

    return (
      <span
        key={`${keyPrefix}-${word}-${index}`}
        aria-label={word}
        data-demo-output-word
        data-demo-performance-word
        data-demo-sweep-word={effect.sweep ? 'true' : undefined}
        data-demo-flip-word={effect.flip ? 'true' : undefined}
        data-demo-spin-word={effect.spin ? 'true' : undefined}
        data-demo-frame-word={effect.frame ? 'true' : undefined}
        data-demo-flip-direction={effect.direction}
      >
        {effect.sweep || effect.spin
          ? Array.from(word).map((letter, letterIndex) => (
              <span
                key={`${keyPrefix}-${word}-${index}-${letterIndex}`}
                aria-hidden="true"
                data-demo-sweep-letter={effect.sweep ? 'true' : undefined}
                data-demo-spin-letter={
                  effect.spin &&
                  (letterIndex === 0 ||
                    letterIndex === Math.max(0, Math.floor(word.length / 2)))
                    ? 'true'
                    : undefined
                }
              >
                {letter}
              </span>
            ))
          : word}
      </span>
    );
  });
}

export function Demos() {
  const [active, setActive] = useState<DemoId>(DEMO_TABS[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const current = DEMO_TABS.find((tab) => tab.id === active)!;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const stage = section.querySelector<HTMLElement>('[data-demo-stage]');
      const words = gsap.utils.toArray<HTMLElement>('[data-demo-word]', section);
      const output = gsap.utils.toArray<HTMLElement>(
        '[data-demo-output-line]',
        section
      );
      const outputWords = gsap.utils.toArray<HTMLElement>(
        '[data-demo-output-word]',
        section
      );
      const performanceWords = gsap.utils.toArray<HTMLElement>(
        '[data-demo-performance-word]',
        section
      );
      const flipWords = gsap.utils.toArray<HTMLElement>(
        '[data-demo-flip-word]',
        section
      );
      const frameWords = gsap.utils.toArray<HTMLElement>(
        '[data-demo-frame-word]',
        section
      );
      const sweepLetters = gsap.utils.toArray<HTMLElement>(
        '[data-demo-sweep-letter]',
        section
      );
      const spinLetters = gsap.utils.toArray<HTMLElement>(
        '[data-demo-spin-letter]',
        section
      );
      const context = gsap.utils.toArray<HTMLElement>(
        '[data-demo-context]',
        section
      );

      if (prefersReducedMotion) {
        gsap.set(
          [
            ...words,
            ...output,
            ...outputWords,
            ...performanceWords,
            ...flipWords,
            ...frameWords,
            ...sweepLetters,
            ...spinLetters,
            ...context,
            stage
          ],
          {
            clearProps: 'all'
          }
        );
        return;
      }

      gsap.set(stage, { autoAlpha: 1 });
      gsap.set(words, {
        autoAlpha: 0,
        y: 20,
        rotateX: -62,
        filter: 'blur(8px)',
        transformOrigin: '50% 100%'
      });
      gsap.set(output, {
        autoAlpha: 0,
        y: 18,
        clipPath: 'inset(0 100% 0 0)',
        filter: 'blur(7px)'
      });
      gsap.set(outputWords, {
        autoAlpha: 0,
        yPercent: 62,
        rotateX: -74,
        filter: 'blur(8px)',
        transformOrigin: '50% 100%'
      });
      gsap.set(performanceWords, {
        transformOrigin: '50% 58%',
        transformStyle: 'preserve-3d'
      });
      gsap.set(sweepLetters, {
        color: 'inherit',
        textShadow: 'none',
        transformOrigin: '50% 60%'
      });
      gsap.set(spinLetters, {
        color: 'inherit',
        textShadow: 'none',
        transformOrigin: '50% 58%',
        transformStyle: 'preserve-3d'
      });
      gsap.set(frameWords, {
        '--demo-frame-scale': 0,
        '--demo-frame-opacity': 0
      });
      gsap.set(context, {
        autoAlpha: 0,
        y: 14,
        filter: 'blur(6px)'
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' }
      });

      tl.to(context, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.55,
        stagger: 0.12
      })
        .to(
          words,
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: { each: 0.024, from: 'start' }
          },
          '-=0.08'
        )
        .to(
          output,
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0 0% 0 0)',
            filter: 'blur(0px)',
            duration: 0.75,
            stagger: 0.18
          },
          '-=0.02'
        )
        .to(
          outputWords,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: { each: 0.018, from: 'start' }
          },
          '-=0.6'
        )
        .addLabel('afterPerformance', '+=0.38')
        .to(
          flipWords,
          {
            yPercent: -8,
            rotationX: (index) => (index % 2 === 0 ? 360 : -360),
            rotationY: (index, target) =>
              Number(target.dataset.demoFlipDirection || 0) === 1 ? -18 : 16,
            rotationZ: (index) => (index % 2 === 0 ? -1.4 : 1.1),
            scale: 1.025,
            filter: 'drop-shadow(0 0 20px rgba(232, 194, 106, 0.24))',
            duration: 1.05,
            ease: 'power2.inOut',
            stagger: { each: 0.22, from: 'start' }
          },
          'afterPerformance+=0.18'
        )
        .to(
          frameWords,
          {
            '--demo-frame-scale': 1,
            '--demo-frame-opacity': 1,
            color: '#fff3c7',
            duration: 0.62,
            ease: 'power3.out',
            stagger: { each: 0.24, from: 'start' }
          },
          'afterPerformance+=0.32'
        )
        .to(
          sweepLetters,
          {
            color: '#f3cf79',
            yPercent: (index) => (index % 2 === 0 ? -7 : -3),
            rotationX: (index) => (index % 2 === 0 ? -16 : 12),
            textShadow: '0 0 20px rgba(232, 194, 106, 0.58)',
            duration: 0.24,
            repeat: 1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: { each: 0.045, from: 'start' }
          },
          'afterPerformance+=0.5'
        )
        .to(
          spinLetters,
          {
            color: '#fff3c7',
            yPercent: 0,
            rotationY: (index) => (index % 2 === 0 ? 360 : -360),
            rotationX: (index) => (index % 2 === 0 ? 0 : 360),
            scale: 1.08,
            textShadow: '0 0 20px rgba(255, 244, 211, 0.46)',
            duration: 0.95,
            ease: 'power2.inOut',
            stagger: { each: 0.14, from: 'center' }
          },
          'afterPerformance+=1.08'
        )
        .to(
          frameWords,
          {
            '--demo-frame-scale': 0,
            '--demo-frame-opacity': 0,
            color: 'inherit',
            duration: 0.62,
            ease: 'power3.inOut',
            stagger: { each: 0.1, from: 'end' }
          },
          'afterPerformance+=2.35'
        )
        .to(
          flipWords,
          {
            yPercent: 0,
            scale: 1,
            filter: 'drop-shadow(0 0 0 rgba(0, 0, 0, 0))',
            duration: 0.82,
            ease: 'power3.out',
            stagger: { each: 0.06, from: 'end' }
          },
          'afterPerformance+=2.1'
        )
        .to(
          spinLetters,
          {
            color: 'inherit',
            scale: 1,
            textShadow: '0 0 0 rgba(0, 0, 0, 0)',
            duration: 0.46,
            ease: 'power3.out',
            stagger: { each: 0.06, from: 'end' }
          },
          'afterPerformance+=2.18'
        )
        .set(
          [...flipWords, ...frameWords, ...sweepLetters, ...spinLetters],
          {
            clearProps:
              'color,textShadow,transform,filter,--demo-frame-scale,--demo-frame-opacity'
          },
          '+=0.05'
        );

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            tl.restart();
          }
        },
        { threshold: 0.42 }
      );

      if (stage) {
        observer.observe(stage);
      } else {
        tl.restart();
      }

      return () => {
        observer.disconnect();
        tl.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [active, current.id]);

  return (
    <section
      ref={sectionRef}
      id="demos"
      data-section-fx
      className="real-demos-section relative flex min-h-[100svh] scroll-mt-28 flex-col justify-center overflow-hidden py-24 md:scroll-mt-32 md:py-32 lg:py-36"
    >
      <div aria-hidden="true" className="real-demos-ambient" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          className="demo-section-heading"
          title="Say it your way."
          accent="Send it polished."
          subtitle="Pick an app and see the same thought become clear writing without changing what you meant."
        />

        <Reveal delay={0.1}>
          <div className="mt-14 flex justify-center md:mt-16 lg:mt-18">
            <div
              role="tablist"
              aria-label="Choose a writing app demo"
              className="demo-app-tabs flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full p-1.5"
            >
              {DEMO_TABS.map((tab) => {
                const Icon = TAB_ICONS[tab.id];
                const selected = active === tab.id;

                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setActive(tab.id)}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300',
                      selected
                        ? 'text-ink-950 shadow-[0_0_28px_rgba(232,194,106,0.26)]'
                        : 'text-silver-300 hover:text-silver-100'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute inset-0 rounded-full transition duration-300',
                        selected
                          ? 'bg-gold-sheen'
                          : 'bg-white/[0.03] opacity-0 group-hover:opacity-100'
                      )}
                    />
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div
          key={current.id}
          data-demo-stage
          className="demo-kinetic-stage mt-10 md:mt-12"
        >
          <div className="demo-kinetic-grid">
            <article className="demo-kinetic-before">
              <div data-demo-context className="demo-kinetic-label">
                Before
              </div>
              <p className="demo-word-field">
                {splitWords(current.beforeText).map((word, index) => (
                  <span key={`${word}-${index}`} data-demo-word>
                    {word}
                  </span>
                ))}
              </p>
            </article>

            <article className="demo-kinetic-after">
              <div data-demo-context className="demo-kinetic-label">
                After
              </div>
              <div className="demo-output-text">
                <h4 data-demo-output-line>
                  {renderOutputWords(current.afterTitle, 'title', current.id)}
                </h4>
                {current.afterBlocks.map((block, blockIndex) => (
                  <p key={block} data-demo-output-line>
                    {renderOutputWords(
                      block,
                      `block-${blockIndex}`,
                      current.id
                    )}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
