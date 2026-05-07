# SpeakToText Launch Hardening

## Production Architecture

- Cloudflare Workers runs the Next.js app through OpenNext and serves `/api/checkout`.
- Cloudflare manages DNS for `speaktotext.org`.
- Cloudflare R2 serves release installers and heavy media from:
  - `downloads.speaktotext.org`
  - `media.speaktotext.org`
- Google Analytics 4 is loaded only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.

## Required Production Environment Variables

Use `.env.example` as the source list for Vercel project environment variables.

Important values:

- `NEXT_PUBLIC_SITE_URL=https://speaktotext.org`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...`
- `STRIPE_SECRET_KEY`
- `STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_YEARLY_PRICE_ID`
- `DOWNLOAD_LATEST_JSON_URL=https://downloads.speaktotext.org/latest.json`
- `NEXT_PUBLIC_FINAL_CTA_VIDEO_URL=https://media.speaktotext.org/final-cta/v1/final-cta-loop.webm`
- `NEXT_PUBLIC_FINAL_CTA_VIDEO_POSTER_URL=https://media.speaktotext.org/final-cta/v1/final-cta-poster.avif`

Keep `ENABLE_HSTS=false` until the production domain is verified over HTTPS.
Turn it on only after both apex and `www` are stable.

## Download Release Flow

1. Build the Windows installer.
2. Publish a GitHub Release with the installer and changelog.
3. Upload the installer to Cloudflare R2.
4. Generate SHA256 for the installer.
5. Update `latest.json` in R2 using the shape in `public/downloads/latest.example.json`.
6. Confirm `/download` redirects to the latest installer.

## Media Release Flow

For short decorative website loops, prefer owned, compressed progressive media
from R2 over third-party HLS:

```text
media.speaktotext.org/final-cta/v1/final-cta-loop.webm
media.speaktotext.org/final-cta/v1/final-cta-loop.mp4
media.speaktotext.org/final-cta/v1/final-cta-poster.avif
```

Use a new version folder when replacing the asset so Cloudflare can cache files
with long immutable headers without stale-video problems.

## DNS Checklist

1. Add `speaktotext.org` to Cloudflare.
2. Copy Cloudflare nameservers.
3. Set those nameservers in Namecheap.
4. Deploy the Worker with the custom-domain routes in `wrangler.jsonc`.
5. Confirm `speaktotext.org` and `www.speaktotext.org` route to the Worker.
6. Use Cloudflare-proxied custom domains for R2 asset subdomains.

## Search Console Checklist

1. Verify the domain property in Google Search Console after DNS is active.
2. Submit `https://speaktotext.org/sitemap.xml`.
3. Inspect `https://speaktotext.org/`.
4. Re-submit after the hero video and How It Works video are final.

## Deferred Video SEO

The only intentional SEO gaps left for later:

- Hero video metadata, poster, transcript, and `VideoObject`.
- How It Works YouTube URL, transcript, poster, and `VideoObject`.
