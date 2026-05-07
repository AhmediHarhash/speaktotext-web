'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Waveform } from './ui/Waveform';

/**
 * Simulated push-to-talk demo panel.
 *
 * Loops through 4 phases:
 *   idle -> holding (waveform) -> releasing -> output appears
 *
 * When a real screen recording of the product lands at /demos/hero.mp4,
 * swap this component for a <video> with poster + muted loop.
 * The simulation below is intentionally designed to look honest:
 * it shows the actual cursor position, a real text field, and real
 * rendered output, no AI-generated scene and no invented UI.
 */

type Phase = 'idle' | 'listening' | 'writing' | 'done';

const DEMO_RAW = 'write me a clear premium subtitle for my voice to text app';
const DEMO_OUT =
  'Turn your voice into polished, on-brand text wherever your cursor blinks.';

const PHASE_DURATIONS: Record<Phase, number> = {
  idle: 1600,
  listening: 2600,
  writing: 2800,
  done: 2400
};

export function HeroDemoPanel() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const order: Phase[] = ['idle', 'listening', 'writing', 'done'];
      const next = order[(order.indexOf(phase) + 1) % order.length];
      if (next === 'idle' || next === 'writing') {
        setTyped('');
      }
      setPhase(next);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(timer);
  }, [phase]);

  // Typewriter for the "writing" phase
  useEffect(() => {
    if (phase !== 'writing') return;

    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(DEMO_OUT.slice(0, i));
      if (i >= DEMO_OUT.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [phase]);

  const holding = phase === 'listening';
  const showOutput = phase === 'writing' || phase === 'done';

  return (
    <div className="hero-demo-window relative w-full rounded-[28px] p-3 md:p-4">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-2 pb-3 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="ml-3 text-[10px] uppercase tracking-[0.25em] text-silver-400">
          ChatGPT
        </span>
      </div>

      {/* Fake app body */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-ink-950/80 p-5">
        {/* Conversation placeholder bubbles */}
        <div className="space-y-3 opacity-40">
          <div className="ml-auto h-3 w-1/2 rounded-full bg-white/5" />
          <div className="h-3 w-3/4 rounded-full bg-white/5" />
          <div className="h-3 w-2/5 rounded-full bg-white/5" />
        </div>

        {/* Text input */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="min-h-[88px] text-left text-sm leading-relaxed text-silver-100">
            {showOutput ? (
              <span>
                {typed}
                <motion.span
                  className="ml-[1px] inline-block h-4 w-[2px] translate-y-[2px] bg-gold-300"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </span>
            ) : (
              <span className="text-silver-400/60">
                Message ChatGPT...
                <motion.span
                  className="ml-[1px] inline-block h-4 w-[2px] translate-y-[2px] bg-silver-300"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
            )}
          </div>
        </div>

        {/* Push-to-talk status overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-silver-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                holding ? 'bg-gold-300 shadow-[0_0_12px_rgba(212,165,72,0.8)]' : 'bg-silver-400/40'
              }`}
            />
            {phase === 'idle' && 'Ready: hold Alt to speak'}
            {phase === 'listening' && 'Listening...'}
            {phase === 'writing' && 'Writing polished text'}
            {phase === 'done' && 'Done: saved to history'}
          </div>
          <div className="font-mono text-[10px] text-silver-400">Alt</div>
        </div>
      </div>

      {/* Waveform strip */}
      <div className="mt-3 h-10 overflow-hidden rounded-xl border border-white/5 bg-ink-950/60 px-4">
        <Waveform active={holding} bars={48} />
      </div>

      {/* Raw speech caption */}
      <div className="mt-3 flex items-center gap-3 px-2 pb-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-silver-400">
          You said
        </span>
        <span className="truncate text-xs text-silver-200">
          {holding ? `"${DEMO_RAW}"` : phase === 'idle' ? 'Ready' : `"${DEMO_RAW}"`}
        </span>
      </div>
    </div>
  );
}
