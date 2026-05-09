'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQS } from '@/lib/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { cn } from '@/lib/cn';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" data-section-fx className="relative flex min-h-[100svh] scroll-mt-28 flex-col justify-center py-28 md:scroll-mt-32 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-72 bg-gradient-to-b from-transparent to-black"
      />
      <div data-section-fx-inner className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions"
          accent="before you start?"
          subtitle="Short, honest answers. If yours isn't here, just ask."
        />

        <div className="mt-14 flex flex-col gap-2">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.q} delay={i * 0.04} y={12}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    'liquid-glass group w-full rounded-2xl px-6 py-5 text-left transition-all',
                    isOpen && 'bg-white/[0.04]'
                  )}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-sm font-medium text-silver-100 md:text-base">
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-silver-200 transition-transform',
                        isOpen && 'rotate-45 border-gold-300/50 text-gold-300'
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-sm leading-relaxed text-silver-300 md:text-base">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
