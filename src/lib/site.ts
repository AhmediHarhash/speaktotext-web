export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://speaktotext.org';

export const SITE_NAME = 'SpeakToText';
export const SITE_DOMAIN = 'speaktotext.org';
export const SITE_EMAIL = 'support@hekax.com';

export const DOWNLOADS_BASE_URL =
  process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL?.replace(/\/$/, '') ??
  'https://downloads.speaktotext.org';

export const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '') ??
  'https://media.speaktotext.org';

export const GITHUB_RELEASES_URL =
  process.env.NEXT_PUBLIC_GITHUB_RELEASES_URL ??
  'https://github.com/hekax/speaktotext/releases/latest';

export const DEFAULT_META_TITLE =
  'SpeakToText | Stop wasting time typing.';

export const DEFAULT_META_DESCRIPTION =
  'SpeakToText is a Windows voice-to-text app that turns spoken thoughts into clean, polished writing anywhere your cursor is active.';

export const SOCIAL_IMAGE = '/social/opengraph.png';
