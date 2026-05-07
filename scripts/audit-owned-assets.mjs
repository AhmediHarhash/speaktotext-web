import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const scanTargets = [
  'src',
  'public',
  '.env.example',
  'next.config.mjs',
  'wrangler.jsonc'
];

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsonc',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.webmanifest'
]);

const ownedHostPatterns = [
  /(^|\.)speaktotext\.org$/i,
  /(^|\.)r2\.dev$/i
];

const approvedServiceHosts = new Set([
  'analytics.google.com',
  'api.stripe.com',
  'checkout.stripe.com',
  'i.ytimg.com',
  'js.stripe.com',
  'region1.google-analytics.com',
  's.ytimg.com',
  'schema.org',
  'creativecommons.org',
  'github.com',
  'purl.org',
  'sodipodi.sourceforge.net',
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'www.inkscape.org',
  'www.w3.org',
  'www.youtube-nocookie.com',
  'www.youtube.com',
  'youtu.be'
]);

const ignoredUrlPrefixes = [
  'http://json-schema.org/',
  'http://localhost:*',
  'http://127.0.0.1:*',
  'ws://localhost:*',
  'ws://127.0.0.1:*'
];

function walk(target) {
  const absolute = path.join(root, target);
  if (!existsSync(absolute)) return [];

  const current = statSync(absolute);
  if (current.isFile()) return [absolute];

  const files = [];
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.open-next') continue;
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) files.push(...walk(path.relative(root, child)));
    if (entry.isFile()) files.push(child);
  }
  return files;
}

function normalizeUrl(raw) {
  return raw.replace(/[),.;]+$/g, '');
}

function classify(url) {
  if (ignoredUrlPrefixes.some((prefix) => url.startsWith(prefix))) return 'ignored';

  let host = '';
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return 'review';
  }

  if (ownedHostPatterns.some((pattern) => pattern.test(host))) return 'owned';
  if (approvedServiceHosts.has(host)) return 'approved-service';
  return 'review';
}

const results = [];
const urlPattern = /https?:\/\/[^\s"'<>}\]]+/gi;

for (const target of scanTargets) {
  for (const file of walk(target)) {
    const ext = path.extname(file).toLowerCase();
    if (!textExtensions.has(ext)) continue;

    let text = '';
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    const matches = text.match(urlPattern) ?? [];
    for (const rawUrl of matches) {
      const url = normalizeUrl(rawUrl);
      const classification = classify(url);
      if (classification === 'ignored') continue;
      results.push({
        classification,
        file: path.relative(root, file).replaceAll(path.sep, '/'),
        url
      });
    }
  }
}

const grouped = results.reduce((acc, item) => {
  acc[item.classification] ??= [];
  acc[item.classification].push(item);
  return acc;
}, {});

for (const [classification, items] of Object.entries(grouped)) {
  console.log(`\n${classification.toUpperCase()} (${items.length})`);
  for (const item of items) {
    console.log(`- ${item.file}: ${item.url}`);
  }
}

const review = grouped.review ?? [];
if (review.length > 0) {
  console.error(`\nAsset audit failed: ${review.length} URL(s) need ownership review.`);
  process.exit(1);
}

console.log('\nAsset audit passed: no unapproved runtime URLs found.');
