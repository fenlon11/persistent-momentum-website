#!/usr/bin/env node
// Theme guard (fenlon11/pmOS#942, mirrors PW's audit:theme): no raw hex colour in site code outside
// the generated token block in app/globals.css, and that block must match tokens/*.json.
// Runs first in `npm run build`, so a regression fails the deploy, not a code review.
//
// Hex lives only in tokens/design-tokens.json (brand) and tokens/site-tokens.json (site-only).
// Code that cannot read CSS variables (recharts, next/og) imports lib/theme.ts.

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { END, START, blockIsCurrent } from './tokens.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIRS = ['app', 'components', 'lib', 'content'];
const EXT = /\.(tsx|ts|jsx|js|mjs|css|mdx)$/;

// A # right after a letter, digit or slash is an issue reference (`pmOS#685`, `owner/repo#12`); after
// `&` it is an HTML entity (`&#8217;`); inside `url(...)` or `href="..."` it is a fragment (`url(#fade)`).
export const HEX = /(?<![\w/&])(?<!url\(\s*['"]?)(?<!href=\{?\s*['"`])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name) && !name.includes('.test.')) out.push(p);
  }
  return out;
}

// Lines outside the token block in app/globals.css, everything elsewhere.
export function findViolations(rel, text) {
  const lines = text.split('\n');
  let inBlock = false;
  const found = [];
  lines.forEach((line, i) => {
    if (rel === 'app/globals.css' && line.includes(START)) inBlock = true;
    if (!inBlock) {
      const m = line.match(HEX);
      if (m) found.push(`${rel}:${i + 1}  ${m.join(' ')}`);
    }
    if (line.includes(END)) inBlock = false;
  });
  return found;
}

if (fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const violations = DIRS.flatMap((d) => walk(join(ROOT, d))).flatMap((file) =>
    findViolations(relative(ROOT, file), readFileSync(file, 'utf8')),
  );
  let failed = false;
  if (violations.length) {
    console.error(`[audit:theme] ${violations.length} raw hex colour(s) outside the token block:\n`);
    for (const v of violations) console.error('  ' + v);
    console.error('\nUse a token: a CSS variable from app/globals.css, or lib/theme.ts where CSS variables cannot reach.');
    failed = true;
  }
  if (!blockIsCurrent()) {
    console.error('[audit:theme] app/globals.css token block is out of date with tokens/*.json. Run `npm run tokens`.');
    failed = true;
  }
  if (failed) process.exit(1);
  console.log('[audit:theme] clean: no raw hex outside the token block; token block matches tokens/*.json');
}
