# SpeakToText Marketing Site

Premium single-page launch site for the SpeakToText desktop app. Dark navy/black base, gold script accents, silver-sheen brand mark — pulled directly from the app's in-product palette.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** with custom design tokens
- **Framer Motion** for component-level motion
- **GSAP + ScrollTrigger** reserved for the pinned feature-story section
- **lucide-react** for icons
- `prefers-reduced-motion` respected throughout

## Run

```powershell
# from repo root
pnpm install
pnpm --filter @hekax/marketing-site dev
```

Open http://localhost:3100

## Structure

- `src/app/` — App Router pages, layout, global styles
- `src/components/sections/` — one file per landing section
- `src/components/ui/` — reusable primitives (Button, GlassCard, Reveal, etc.)
- `src/lib/` — helpers and content constants
- `public/brand/` — logo assets (drop `logo.png` here)

## Design doctrine

Every visual must answer a specific buyer question. No AI slop, no decorative filler.
See `docs/speaktotext-site-blueprint.md` for the full 8-section plan.

## Asset TODO (placeholder → real)

- `public/brand/logo.png` — silver voice+quill mark
- `public/demos/hero.mp4` — push-to-talk product recording
- `public/demos/{chatgpt,claude,gmail,linkedin,docs}.mp4` — use-case clips

Placeholders are in place until real recordings land.
