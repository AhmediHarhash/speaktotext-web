'use client';

import dynamic from 'next/dynamic';

const HowItWorksClient = dynamic(
  () => import('./HowItWorks').then((mod) => mod.HowItWorks),
  {
    ssr: false,
    loading: () => (
      <section id="how" className="relative min-h-[100svh] bg-[#02040a]" />
    )
  }
);

export function HowItWorksLazy() {
  return <HowItWorksClient />;
}
