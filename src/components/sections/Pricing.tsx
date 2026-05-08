'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { PRICING } from '@/lib/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';

type BillingCycle = 'monthly' | 'yearly';

const PLAN_LINE =
  'Unlimited voice-to-text with polished writing, history, and privacy built in.';

export function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>('yearly');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const plan = cycle === 'yearly' ? PRICING.yearly : PRICING.monthly;
  const helper =
    cycle === 'yearly'
      ? '$5/mo when billed annually. Save 50%.'
      : '$7/mo founder monthly. Save 30%.';

  async function startCheckout() {
    setIsCheckingOut(true);
    setCheckoutError(null);
    trackEvent('checkout_start', {
      plan: cycle,
      price: plan.price
    });

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: cycle })
      });

      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? 'Checkout could not start.');
      }

      window.location.href = payload.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Checkout could not start.'
      );
      setIsCheckingOut(false);
    }
  }

  return (
    <section
      id="pricing"
      data-section-fx
      className="pricing-section relative isolate flex min-h-[100svh] scroll-mt-28 flex-col justify-center overflow-hidden py-24 md:scroll-mt-32 md:py-36"
    >
      <div aria-hidden className="pricing-section-glow" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeading
          title="One Premium plan."
          accent="Use your voice without limits."
        />

        <Reveal delay={0.1}>
          <div className="mt-11 flex justify-center md:mt-12">
            <div className="liquid-glass relative inline-flex items-center rounded-full p-1.5">
              {(['monthly', 'yearly'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  aria-pressed={cycle === c}
                  className={cn(
                    'relative z-10 flex min-h-11 items-center gap-2 rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors',
                    cycle === c
                      ? 'text-ink-950'
                      : 'text-silver-200 hover:text-white'
                  )}
                >
                  {cycle === c && (
                    <motion.span
                      layoutId="billing-toggle-bg"
                      className="absolute inset-0 rounded-full bg-gold-sheen shadow-gold"
                      transition={{
                        type: 'spring',
                        stiffness: 360,
                        damping: 32
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {c === 'yearly' ? 'Annual' : 'Monthly'}
                  </span>
                  {c === 'yearly' && (
                    <span
                      className={cn(
                        'relative z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                        cycle === 'yearly'
                          ? 'bg-ink-950/20 text-ink-950'
                          : 'bg-gold-400/10 text-gold-200'
                      )}
                    >
                      Save 50%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <AnimatePresence mode="wait">
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.36, ease: [0.25, 0.1, 0.25, 1] }}
              className="pricing-offer relative mx-auto mt-12 max-w-4xl text-center md:mt-14"
            >
              <p className="mx-auto max-w-2xl text-balance text-base leading-8 text-silver-300 md:text-lg">
                {PLAN_LINE}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-end">
                <span className="pricing-price gold-text inline-flex items-baseline font-serif text-7xl italic leading-none md:text-8xl">
                  <span className="mr-1 text-[0.5em] leading-none">$</span>
                  <span>{plan.price}</span>
                </span>
                <div className="flex flex-col items-center pb-1 sm:items-start">
                  <span className="text-xs uppercase tracking-[0.2em] text-silver-500 line-through decoration-gold-300/55 decoration-2">
                    ${plan.originalPrice}
                  </span>
                  <span className="text-sm font-medium text-silver-300">
                    {plan.cadence}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm font-medium text-gold-100/90">
                {helper}
              </p>

              <ul className="mx-auto mt-9 grid w-full max-w-sm gap-4 text-center">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center justify-center gap-3 text-[15px] leading-relaxed text-silver-100 md:text-base"
                  >
                    <span className="pricing-check flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-sheen text-ink-950">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-11 flex flex-col items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={isCheckingOut}
                  onClick={startCheckout}
                  icon={
                    isCheckingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )
                  }
                  className="w-auto min-w-[15rem] px-8"
                >
                  {isCheckingOut ? 'Opening checkout...' : plan.cta}
                </Button>
                <p className="text-center text-xs font-medium text-silver-400">
                  Cancel anytime.
                </p>
                {checkoutError ? (
                  <p className="max-w-md text-center text-xs leading-5 text-gold-200">
                    {checkoutError}
                  </p>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
