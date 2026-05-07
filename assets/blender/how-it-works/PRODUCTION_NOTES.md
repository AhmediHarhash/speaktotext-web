# SpeakToText How It Works Production Asset

## Current Direction

The active section is a cinematic 3D mechanism:

1. Alt key presses down.
2. Gold signal travels into the voice capture stage.
3. Rough spoken thoughts appear.
4. Signal travels into the polished writing stage.
5. Claude Code-inspired output surface writes the cleaned version.

## Source Assets

- Source scene: `assets/blender/how-it-works/speaktotext-how-it-works-production.blend`
- Web GLB: `public/models/how-it-works/speaktotext-how-it-works-production.glb`
- Generator script: `C:/Users/hekax/.codex/skills/blender-brand-motion/scripts/create_how_it_works_cinematic_scene.py`

## Integration Notes

- Desktop should use the full cinematic camera/stage.
- Mobile should not shrink the full desktop view. Use close-up beats:
  - `Camera_Mobile_Key_Close`
  - `Camera_Mobile_Voice_Close`
  - `Camera_Mobile_Output_Close`
- GLB export preserves geometry, materials, key animation, moving pulse objects, and cameras.
- Blender curve `bevel_factor` draw animation does not export cleanly to GLB. For the website, recreate the active neon draw as a real R3F tube/path animation or render a transparent video sequence from Blender.
- Keep important SEO copy as DOM text outside the GLB.

## Current Production Polish

- Real volumetric atmosphere was added in Blender so the dark section reveals light around the moving signal.
- Timed emissive glints were added along the signal path as export-friendly geometry.
- Focused spotlights now stage the key, voice chamber, and polished output.
- The desktop proof frame to inspect latest lighting is:
  `.codex-visual-checks/how-production-v5/how-production-v5-frame-214.png`
