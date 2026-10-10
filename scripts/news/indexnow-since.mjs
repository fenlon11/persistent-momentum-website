#!/usr/bin/env node
// Ping IndexNow for articles merged to main since the last run (fenlon11/pmOS#686). The weekly
// pipeline runs this first, so last week's reviewed-and-merged drafts reach Bing and the other
// IndexNow engines. State is the last main commit pinged, kept outside the repo.
//
//   node scripts/news/indexnow-since.mjs --state <dir> [--dry-run]
//
// First run records the current main and pings nothing (everything already live predates it).
// Only `status: published` files under content/news and content/guides count.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const git = (...args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8' }).trim();

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const stateDir = argv[argv.indexOf('--state') + 1];
if (!argv.includes('--state') || !stateDir) {
  console.error('usage: node scripts/news/indexnow-since.mjs --state <dir> [--dry-run]');
  process.exit(2);
}
fs.mkdirSync(stateDir, { recursive: true });
const stateFile = path.join(stateDir, 'indexnow-last-main');

git('fetch', '-q', 'origin', 'main');
const head = git('rev-parse', 'origin/main');
const last = fs.existsSync(stateFile) ? fs.readFileSync(stateFile, 'utf8').trim() : '';
if (!last) {
  if (!dryRun) fs.writeFileSync(stateFile, `${head}\n`);
  console.log(`indexnow-since: first run, baseline origin/main ${head.slice(0, 8)}; nothing pinged`);
  process.exit(0);
}

const changed = git('diff', '--name-only', '--diff-filter=AM', `${last}..${head}`, '--', 'content/news', 'content/guides')
  .split('\n')
  .filter((f) => f.endsWith('.mdx'));
const urls = [];
for (const file of changed) {
  const { data } = matter(git('show', `${head}:${file}`));
  if (data.status !== 'published') continue;
  const name = path.basename(file, '.mdx');
  urls.push(file.startsWith('content/news/') ? `/news/${name.replace(/^\d{4}-\d{2}-\d{2}-/, '')}` : `/guides/${name}`);
}
if (!urls.length) {
  console.log(`indexnow-since: no published content merged ${last.slice(0, 8)}..${head.slice(0, 8)}`);
} else {
  const r = spawnSync('node', [path.join(ROOT, 'scripts/indexnow.mjs'), ...(dryRun ? ['--dry-run'] : []), ...urls], { encoding: 'utf8' });
  process.stdout.write(r.stdout);
  process.stderr.write(r.stderr);
  if (r.status !== 0) process.exit(r.status ?? 1); // state not advanced: next run retries these
}
if (!dryRun) fs.writeFileSync(stateFile, `${head}\n`);
