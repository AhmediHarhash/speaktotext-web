import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { SITE_EMAIL, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using the SpeakToText website, desktop app, subscriptions, and downloads.',
  alternates: { canonical: '/terms' }
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      updated="May 6, 2026"
      intro={`These terms apply to the ${SITE_NAME} website, downloads, trials, and paid plans. They are written plainly so customers understand what they are buying.`}
      sections={[
        {
          title: 'Use of the product',
          body: [
            'SpeakToText is a productivity tool for turning speech into cleaner writing. You are responsible for reviewing output before sending, publishing, or relying on it in important contexts.',
            'You may not use the product to violate laws, infringe rights, distribute harmful content, or interfere with the service.'
          ]
        },
        {
          title: 'Subscriptions and billing',
          body: [
            'Premium access is sold as a subscription through Stripe Checkout. Monthly and annual plans provide the same Premium access; annual billing is discounted.',
            'You can cancel future renewals through the billing flow or by contacting support. Past charges may be handled according to Stripe records, applicable law, and the refund policy active at the time of purchase.'
          ]
        },
        {
          title: 'Downloads and updates',
          body: [
            'The website download route may redirect to the latest public installer. Always download from the official speaktotext.org domain or our listed release channels.',
            'We may update the app, pricing, trial terms, or feature availability as the product evolves.'
          ]
        },
        {
          title: 'Contact',
          body: [
            `For billing, product, or terms questions, contact ${SITE_EMAIL}.`
          ]
        }
      ]}
    />
  );
}
