import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { SITE_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How SpeakToText handles privacy, transcription data, analytics, payments, and contact information.',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      updated="May 6, 2026"
      intro="SpeakToText is designed as a private-by-default voice writing workflow. This page explains what the website and desktop app collect, why it is needed, and how to contact us."
      sections={[
        {
          title: 'What we collect',
          body: [
            'The website may collect basic analytics events, such as page views, CTA clicks, checkout starts, and video interactions. These events help us understand whether the site is clear and where visitors get stuck.',
            'If you start checkout, payment and subscription details are handled by Stripe. SpeakToText does not store full card numbers on our servers.'
          ]
        },
        {
          title: 'Voice and transcription data',
          body: [
            'SpeakToText is built around a push-to-talk workflow. The app listens only when you use the configured capture action.',
            'Transcripts and history are intended to remain under your control. If a future cloud feature changes this boundary, the product and this policy will be updated before that feature is released.'
          ]
        },
        {
          title: 'Analytics',
          body: [
            'We use Google Analytics 4 to measure website performance and conversion events. GA4 helps us improve the site, understand marketing channels, and see which product messages are useful.',
            'Analytics is not used to train AI models on your writing.'
          ]
        },
        {
          title: 'Contact',
          body: [
            `For privacy questions, contact ${SITE_EMAIL}. We will review reasonable requests about personal information associated with the website, checkout, or support communications.`
          ]
        }
      ]}
    />
  );
}
