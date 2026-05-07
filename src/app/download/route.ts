import { NextResponse } from 'next/server';
import { GITHUB_RELEASES_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

type LatestDownload = {
  url?: string;
  downloadUrl?: string;
  version?: string;
  sha256?: string;
  size?: number;
  releasedAt?: string;
};

function isSafeDownloadUrl(value: string | undefined) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function resolveLatestDownloadUrl() {
  const directUrl = process.env.DOWNLOAD_DIRECT_URL;
  if (isSafeDownloadUrl(directUrl)) {
    return directUrl;
  }

  const latestJsonUrl = process.env.DOWNLOAD_LATEST_JSON_URL;
  if (isSafeDownloadUrl(latestJsonUrl)) {
    const response = await fetch(latestJsonUrl!, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (response.ok) {
      const payload = (await response.json()) as LatestDownload;
      const candidate = payload.downloadUrl ?? payload.url;
      if (isSafeDownloadUrl(candidate)) {
        return candidate;
      }
    }
  }

  if (isSafeDownloadUrl(GITHUB_RELEASES_URL)) {
    return GITHUB_RELEASES_URL;
  }

  return null;
}

export async function GET(request: Request) {
  const url = await resolveLatestDownloadUrl();

  if (url) {
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  return NextResponse.redirect(new URL('/#pricing', request.url), {
    status: 302,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
