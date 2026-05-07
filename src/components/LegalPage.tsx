import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Wordmark } from './ui/Logo';

type LegalSection = {
  title: string;
  body: string[];
};

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-ink-950 text-silver-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(232,194,106,0.14),transparent_46%),linear-gradient(180deg,rgba(5,7,13,0)_0%,rgba(5,7,13,0.9)_100%)]"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-10 lg:px-10">
        <nav className="flex items-center justify-between gap-6">
          <Link href="/" aria-label="Back to SpeakToText home">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-silver-200 transition hover:border-gold-300/30 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </nav>

        <header className="pb-12 pt-20 md:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-balance text-5xl font-semibold leading-[0.98] tracking-[0] text-silver-100 md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-silver-300 md:text-lg">
            {intro}
          </p>
          <p className="mt-4 text-sm text-silver-400">Last updated: {updated}</p>
        </header>

        <div className="space-y-10 border-t border-white/10 py-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-silver-100">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-8 text-silver-300">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
