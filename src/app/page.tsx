import { Navbar } from '@/components/Navbar';
import { HashScrollRestorer } from '@/components/HashScrollRestorer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { SectionTransitions } from '@/components/SectionTransitions';
import { Hero } from '@/components/sections/Hero';
import { Demos } from '@/components/sections/Demos';
import { Anywhere } from '@/components/sections/Anywhere';
import { FeatureStory } from '@/components/sections/FeatureStory';
import { Pricing } from '@/components/sections/Pricing';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { HowItWorksLazy } from '@/components/sections/HowItWorksLazy';
import { StructuredData } from '@/components/StructuredData';

export default function Page() {
  return (
    <main className="relative">
      <StructuredData />
      <SmoothScroll />
      <SectionTransitions />
      <Navbar />
      <HashScrollRestorer />
      <Hero />
      <Anywhere />
      <Demos />
      <HowItWorksLazy />
      <FeatureStory />
      <Pricing />
      <Faq />
      <FinalCta />
    </main>
  );
}
