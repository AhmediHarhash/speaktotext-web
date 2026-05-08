import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const enableHsts = process.env.ENABLE_HSTS === 'true';

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isProduction ? [] : ["'unsafe-eval'"]),
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://js.stripe.com',
  'https://www.youtube.com',
  'https://www.youtube-nocookie.com',
  'https://s.ytimg.com',
  'https://static.cloudflareinsights.com'
];

const connectSrc = [
  "'self'",
  'https://www.google-analytics.com',
  'https://region1.google-analytics.com',
  'https://analytics.google.com',
  'https://checkout.stripe.com',
  'https://api.stripe.com',
  'https://cloudflareinsights.com',
  'https://media.speaktotext.org',
  'https://downloads.speaktotext.org',
  'https://*.r2.dev',
  ...(isProduction
    ? []
    : [
        'http://localhost:*',
        'http://127.0.0.1:*',
        'ws://localhost:*',
        'ws://127.0.0.1:*'
      ])
];

const cspDirectives = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://i.ytimg.com https://media.speaktotext.org https://downloads.speaktotext.org https://*.r2.dev",
  "font-src 'self' data:",
  `connect-src ${connectSrc.join(' ')}`,
  "media-src 'self' blob: https://media.speaktotext.org https://downloads.speaktotext.org https://*.r2.dev",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://js.stripe.com https://checkout.stripe.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  ...(isProduction ? ['upgrade-insecure-requests'] : [])
];

const csp = cspDirectives.join('; ');

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: csp
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups'
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.stripe.com"), fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")'
  },
  ...(enableHsts
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        }
      ]
    : [])
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      },
      {
        source: '/download',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store'
          }
        ]
      },
    ];
  }
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
