import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outDir = path.join(process.cwd(), 'exports', 'final-cta', 'v1');
mkdirSync(outDir, { recursive: true });

const width = 1920;
const height = 720;

const lines = Array.from({ length: 18 }, (_, index) => {
  const y = 260 + Math.sin(index * 0.7) * 66 + index * 5;
  const opacity = 0.14 + (index % 5) * 0.035;
  const strokeWidth = 1.1 + (index % 4) * 0.45;
  const offset = index * 72;

  return `
    <path
      d="M ${-120 + offset} ${y}
         C ${260 + offset} ${y - 190}, ${520 + offset} ${y + 160}, ${920 + offset} ${y - 18}
         S ${1430 + offset} ${y - 150}, ${2060 + offset} ${y + 42}"
      fill="none"
      stroke="url(#goldLine)"
      stroke-width="${strokeWidth}"
      stroke-linecap="round"
      opacity="${opacity}"
      filter="url(#softGlow)"
    />
  `;
}).join('\n');

const pulses = Array.from({ length: 7 }, (_, index) => {
  const x = 210 + index * 245;
  const y = 365 + Math.sin(index * 1.4) * 92;

  return `
    <circle cx="${x}" cy="${y}" r="${28 + index * 2}" fill="url(#pulse)" opacity="${0.08 + index * 0.01}" />
    <circle cx="${x}" cy="${y}" r="${2.5 + (index % 3)}" fill="#fff4c7" opacity="${0.58}" filter="url(#softGlow)" />
  `;
}).join('\n');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="centerFog" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#4b3514" stop-opacity="0.36"/>
      <stop offset="42%" stop-color="#101826" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#020407" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sideGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f5c76f" stop-opacity="0.34"/>
      <stop offset="45%" stop-color="#a86a19" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#020407" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fff2c1" stop-opacity="0"/>
      <stop offset="18%" stop-color="#ffe29a"/>
      <stop offset="48%" stop-color="#ba7a1b"/>
      <stop offset="74%" stop-color="#fff0b8"/>
      <stop offset="100%" stop-color="#f1b94b" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff4c7" stop-opacity="0.75"/>
      <stop offset="30%" stop-color="#efb849" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#efb849" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feColorMatrix in="blur" type="matrix"
        values="1 0 0 0 0.08  0 0.74 0 0 0.04  0 0 0.26 0 0.02  0 0 0 1 0"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="8"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.045"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#020407"/>
  <rect width="100%" height="100%" fill="url(#centerFog)"/>
  <ellipse cx="230" cy="390" rx="480" ry="245" fill="url(#sideGlow)" opacity="0.55"/>
  <ellipse cx="1670" cy="330" rx="520" ry="260" fill="url(#sideGlow)" opacity="0.42"/>
  <g opacity="0.9">${lines}</g>
  <g>${pulses}</g>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.65"/>
  <rect y="0" width="100%" height="160" fill="url(#topFade)" opacity="0"/>
  <rect width="100%" height="100%" fill="none"/>
</svg>`;

const posterPng = path.join(outDir, 'final-cta-poster.png');
const posterAvif = path.join(outDir, 'final-cta-poster.avif');
const loopWebm = path.join(outDir, 'final-cta-loop.webm');
const loopMp4 = path.join(outDir, 'final-cta-loop.mp4');

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(posterPng);
await sharp(Buffer.from(svg)).avif({ quality: 52, effort: 8 }).toFile(posterAvif);

const zoom = "zoompan=z='1+0.018*sin(on/36)':x='iw/2-(iw/zoom/2)+18*sin(on/44)':y='ih/2-(ih/zoom/2)+10*cos(on/52)':d=240:s=1920x720:fps=30,format=yuv420p";

execFileSync('ffmpeg', [
  '-y',
  '-loop',
  '1',
  '-i',
  posterPng,
  '-vf',
  zoom,
  '-t',
  '8',
  '-an',
  '-c:v',
  'libvpx-vp9',
  '-b:v',
  '0',
  '-crf',
  '36',
  '-pix_fmt',
  'yuv420p',
  loopWebm
], { stdio: 'inherit' });

execFileSync('ffmpeg', [
  '-y',
  '-loop',
  '1',
  '-i',
  posterPng,
  '-vf',
  zoom,
  '-t',
  '8',
  '-an',
  '-c:v',
  'libx264',
  '-crf',
  '28',
  '-preset',
  'slow',
  '-pix_fmt',
  'yuv420p',
  loopMp4
], { stdio: 'inherit' });

console.log(`Generated ${path.relative(process.cwd(), posterAvif)}`);
console.log(`Generated ${path.relative(process.cwd(), loopWebm)}`);
console.log(`Generated ${path.relative(process.cwd(), loopMp4)}`);
