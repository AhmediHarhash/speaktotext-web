'use client';

import dynamic from 'next/dynamic';

const HowItWorksClient = dynamic(
  () => import('./HowItWorks').then((mod) => mod.HowItWorks),
  {
    ssr: false,
    loading: () => (
      <section
        id="how"
        className="relative h-[280svh] min-h-[1500px] bg-[#02040a] md:h-[320svh] md:min-h-[1850px]"
      />
    )
  }
);

export function HowItWorksLazy() {
  return <HowItWorksClient />;
}
