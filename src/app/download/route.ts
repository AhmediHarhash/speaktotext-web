import { NextResponse } from 'next/server';
import { GITHUB_RELEASES_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

type GitHubReleaseAsset = {
  name?: string;
  browser_download_url?: string;
  state?: string;
};

type GitHubRelease = {
  html_url?: string;
  assets?: GitHubReleaseAsset[];
};

type LatestDownload = {
  url?: string;
  downloadUrl?: string;
  version?: string;
  sha256?: string;
  size?: number;
  releasedAt?: string;
};

const DEFAULT_ASSET_PATTERN =
  /\.(exe|msi|msix|msixbundle|appinstaller|zip)$/i;

const WINDOWS_SETUP_PRIORITY = [
  /setup.*\.exe$/i,
  /installer.*\.exe$/i,
  /\.exe$/i,
  /\.msixbundle$/i,
  /\.msix$/i,
  /\.appinstaller$/i,
  /\.msi$/i,
  /\.zip$/i
] as const;

function isSafeDownloadUrl(value: string | undefined) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getGitHubRepo() {
  const configuredRepo =
    process.env.GITHUB_RELEASE_REPO ??
    process.env.NEXT_PUBLIC_GITHUB_RELEASE_REPO;

  if (configuredRepo && /^[\w.-]+\/[\w.-]+$/.test(configuredRepo)) {
    return configuredRepo;
  }

  if (!isSafeDownloadUrl(GITHUB_RELEASES_URL)) {
    return null;
  }

  const match = GITHUB_RELEASES_URL.match(
    /^https:\/\/github\.com\/([^/]+\/[^/]+)\/releases(?:\/latest)?\/?$/i
  );

  return match?.[1] ?? null;
}

function getAssetPattern() {
  const configuredPattern = process.env.GITHUB_RELEASE_ASSET_PATTERN;

  if (!configuredPattern) {
    return DEFAULT_ASSET_PATTERN;
  }

  try {
    return new RegExp(configuredPattern, 'i');
  } catch {
    return DEFAULT_ASSET_PATTERN;
  }
}

function chooseReleaseAsset(assets: GitHubReleaseAsset[] | undefined) {
  if (!assets?.length) {
    return null;
  }

  const pattern = getAssetPattern();
  const candidates = assets.filter((asset) => {
    const name = asset.name ?? '';
    return (
      asset.state === 'uploaded' &&
      isSafeDownloadUrl(asset.browser_download_url) &&
      pattern.test(name) &&
      !/\.(blockmap|sha256|sha512|sig|asc|yml|yaml|json|txt)$/i.test(name)
    );
  });

  const sortedCandidates = candidates.toSorted((assetA, assetB) => {
    const nameA = assetA.name ?? '';
    const nameB = assetB.name ?? '';
    const priorityA = WINDOWS_SETUP_PRIORITY.findIndex((test) =>
      test.test(nameA)
    );
    const priorityB = WINDOWS_SETUP_PRIORITY.findIndex((test) =>
      test.test(nameB)
    );

    return (
      (priorityA === -1 ? WINDOWS_SETUP_PRIORITY.length : priorityA) -
      (priorityB === -1 ? WINDOWS_SETUP_PRIORITY.length : priorityB)
    );
  });

  return sortedCandidates[0]?.browser_download_url ?? null;
}

async function resolveGitHubLatestReleaseUrl() {
  const repo = getGitHubRepo();

  if (!repo) {
    return null;
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'speaktotext-download-route',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_RELEASE_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
    {
      headers,
      cache: 'no-store',
      next: { revalidate: 0 }
    }
  );

  if (!response.ok) {
    return null;
  }

  const release = (await response.json()) as GitHubRelease;
  const assetUrl = chooseReleaseAsset(release.assets);

  if (assetUrl) {
    return assetUrl;
  }

  return isSafeDownloadUrl(release.html_url) ? release.html_url : null;
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

  const githubLatestUrl = await resolveGitHubLatestReleaseUrl();
  if (githubLatestUrl) {
    return githubLatestUrl;
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
