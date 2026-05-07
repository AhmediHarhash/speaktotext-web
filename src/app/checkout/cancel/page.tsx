import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Checkout canceled | SpeakToText',
  description: 'Return to SpeakToText pricing.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutCancelPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,rgba(232,194,106,0.12),transparent_58%)]"
      />
      <section className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200">
          Checkout canceled
        </p>
        <h1 className="mt-5 text-balance font-sans text-4xl font-medium leading-tight text-silver-100 md:text-6xl">
          No charge was made.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-silver-300 md:text-lg">
          You can return to pricing whenever you are ready.
        </p>
        <div className="mt-9 flex justify-center">
          <ButtonLink
            href="/#pricing"
            variant="primary"
            size="lg"
            icon={<ArrowUpRight className="h-4 w-4" />}
          >
            Back to pricing
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
