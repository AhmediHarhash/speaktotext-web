import type { Metadata } from 'next';
import { ArrowUpRight, Check } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Checkout complete | SpeakToText',
  description: 'Your SpeakToText Premium checkout is complete.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutSuccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,rgba(232,194,106,0.16),transparent_58%)]"
      />
      <section className="relative z-10 mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-sheen text-ink-950 shadow-gold">
          <Check className="h-5 w-5" strokeWidth={3.5} />
        </span>
        <h1 className="mt-7 text-balance font-sans text-4xl font-medium leading-tight text-silver-100 md:text-6xl">
          Your Premium access is ready.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-silver-300 md:text-lg">
          Keep this checkout email for your account. You can finish setup inside
          the SpeakToText desktop app.
        </p>
        <div className="mt-9 flex justify-center">
          <ButtonLink
            href="/"
            variant="primary"
            size="lg"
            icon={<ArrowUpRight className="h-4 w-4" />}
          >
            Back to SpeakToText
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
