import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const routes = ['', '/privacy', '/terms', '/security'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.5
  }));
}
