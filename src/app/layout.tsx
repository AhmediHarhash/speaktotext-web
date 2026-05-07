import type { Metadata, Viewport } from 'next';
import {
  Cormorant_Garamond,
  Inter,
  Instrument_Serif
} from 'next/font/google';
import { Analytics } from '@/components/Analytics';
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_TITLE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE
} from '@/lib/site';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap'
});

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_META_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: DEFAULT_META_DESCRIPTION,
  keywords: [
    'voice to text',
    'dictation',
    'speech to text',
    'AI writing',
    'Windows dictation',
    'voice writing',
    'push to talk'
  ],
  authors: [{ name: 'HEKAX' }],
  creator: 'HEKAX',
  publisher: 'HEKAX',
  category: 'Productivity software',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} voice-to-text app`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    images: [SOCIAL_IMAGE]
  },
  icons: {
    icon: '/brand/logo.png',
    shortcut: '/brand/logo.png',
    apple: '/brand/logo.png'
  },
  manifest: '/manifest.webmanifest'
};

export const viewport: Viewport = {
  themeColor: '#05070D',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${display.variable}`}
    >
      <body className="min-h-screen overflow-x-clip antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
