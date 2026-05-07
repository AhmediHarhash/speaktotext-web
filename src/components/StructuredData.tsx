import { FAQS, PRICING } from '@/lib/content';
import {
  DEFAULT_META_DESCRIPTION,
  GITHUB_RELEASES_URL,
  SITE_EMAIL,
  SITE_NAME,
  SITE_URL
} from '@/lib/site';

const organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  email: SITE_EMAIL,
  sameAs: [GITHUB_RELEASES_URL].filter(Boolean)
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_META_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-US'
};

const software = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#software`,
  name: SITE_NAME,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Windows',
  url: SITE_URL,
  downloadUrl: `${SITE_URL}/download`,
  description: DEFAULT_META_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  offers: [
    {
      '@type': 'Offer',
      name: 'SpeakToText Premium monthly',
      price: PRICING.monthly.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#pricing`
    },
    {
      '@type': 'Offer',
      name: 'SpeakToText Premium annual',
      price: PRICING.yearly.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#pricing`
    }
  ]
};

const product = {
  '@type': 'Product',
  '@id': `${SITE_URL}/#product`,
  name: SITE_NAME,
  brand: { '@id': `${SITE_URL}/#organization` },
  description: DEFAULT_META_DESCRIPTION,
  category: 'Voice-to-text software',
  url: SITE_URL,
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: PRICING.monthly.price,
    highPrice: PRICING.yearly.price,
    priceCurrency: 'USD',
    offerCount: 2,
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/#pricing`
  }
};

const faqPage = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq-schema`,
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a
    }
  }))
};

const graph = {
  '@context': 'https://schema.org',
  '@graph': [organization, website, software, product, faqPage]
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c')
      }}
    />
  );
}
