import type { MetadataRoute } from 'next';
import { DEFAULT_META_DESCRIPTION, SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_META_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#05070D',
    theme_color: '#05070D',
    icons: [
      {
        src: '/brand/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  };
}
