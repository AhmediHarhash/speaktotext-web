import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { SITE_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'SpeakToText security posture for push-to-talk capture, local workflow boundaries, payments, and responsible disclosure.',
  alternates: { canonical: '/security' }
};

export default function SecurityPage() {
  return (
    <LegalPage
      eyebrow="Security"
      title="Security"
      updated="May 6, 2026"
      intro="SpeakToText is built for a simple promise: fast voice writing without unnecessary exposure. This page summarizes the security posture for the website and product."
      sections={[
        {
          title: 'Website security',
          body: [
            'The production website is intended to run on Cloudflare Workers behind HTTPS, with Cloudflare DNS and owned R2 media/download domains. Security headers, safe referrer policy, and a controlled content security policy are applied at the application layer.',
            'Checkout is handled server-side and redirects to Stripe. The browser never receives the Stripe secret key.'
          ]
        },
        {
          title: 'Product security',
          body: [
            'The app uses a deliberate capture workflow rather than always-on listening. This reduces accidental capture and makes the product easier to reason about.',
            'Transcript history is designed as a user-controlled recovery feature. Privacy boundaries should remain clear in the app and on the website.'
          ]
        },
        {
          title: 'Responsible disclosure',
          body: [
            `If you believe you found a security issue, email ${SITE_EMAIL} with a clear description, reproduction steps, and impact. Please avoid accessing or modifying data that is not yours.`
          ]
        }
      ]}
    />
  );
}
