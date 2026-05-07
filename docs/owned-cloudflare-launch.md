# Owned Cloudflare Launch Runbook

This site is Cloudflare-first:

- Next.js runs on Cloudflare Workers through OpenNext.
- Small static assets ship with the Worker static asset bundle.
- Heavy media and installers live on Cloudflare R2 behind owned custom domains.
- Third-party runtime media is not allowed unless it is intentionally owned or approved.

## Current Owned Runtime Domains

- App: `https://speaktotext.org`
- Media: `https://media.speaktotext.org`
- Downloads: `https://downloads.speaktotext.org`
- Support email: `support@hekax.com`

## Commands

```powershell
npm run asset:audit
npm run build
npm run typecheck
npm run preview
```

When Wrangler auth is valid:

```powershell
npm run r2:bootstrap
npm run r2:upload -- -Version 0.0.0
npm run deploy
```

## R2 Object Layout

```text
speaktotext-media/
  final-cta/v1/final-cta-loop.webm
  final-cta/v1/final-cta-loop.mp4
  final-cta/v1/final-cta-poster.avif
  hero/v1/hero-video.mp4
  hero/v1/hero-poster.avif
  how-it-works/v1/how-it-works-video.mp4
  how-it-works/v1/how-it-works-poster.avif

speaktotext-downloads/
  releases/<version>/SpeakToText-Setup.exe
  latest.json
```

Use version folders for immutable media. Update environment variables when a new version folder should go live.

## Missing Launch Assets

These are intentionally not blocked in code, but they must be uploaded before final public launch:

- Final CTA owned loop and poster.
- Hero video and poster.
- How It Works video or YouTube URL.
- Windows installer and `latest.json`.

## Cloudflare Notes

Wrangler is currently the deployment path. The R2 custom domains still need to be connected in the Cloudflare dashboard because bucket custom-domain attachment is safest there:

1. R2 > `speaktotext-media` > Settings > Public access > custom domain `media.speaktotext.org`.
2. R2 > `speaktotext-downloads` > Settings > Public access > custom domain `downloads.speaktotext.org`.
3. Deploy Worker with `wrangler.jsonc` custom-domain routes for `speaktotext.org` and `www.speaktotext.org`.

Keep `ENABLE_HSTS=false` until both apex and `www` are verified over HTTPS.
