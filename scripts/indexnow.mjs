#!/usr/bin/env node
// IndexNow ping (fenlon11/pmOS#685, playbook P1 #13): tells Bing and the other IndexNow engines a
// URL was added, updated or deleted. The content pipeline runs it on publish:
//   node scripts/indexnow.mjs /news/<slug> [more paths or full URLs...]
// --dry-run prints the payload without sending. The key is public by design: it is the single
// public/<key>.txt file (served at the site root, it proves we own the host), read from there so
// it lives in one place.
import fs from 'node:fs';

const HOST = 'persistentmomentum.com';
const publicDir = new URL('../public/', import.meta.url);
const keyFiles = fs.readdirSync(publicDir).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (keyFiles.length !== 1) {
  console.error(`indexnow: expected one public/<key>.txt, found ${keyFiles.length}`);
  process.exit(2);
}
const KEY = fs.readFileSync(new URL(keyFiles[0], publicDir), 'utf8').trim();
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const urls = args.filter((a) => a !== '--dry-run').map((a) => new URL(a, `https://${HOST}`).toString());

if (urls.length === 0) {
  console.error('usage: node scripts/indexnow.mjs [--dry-run] <path-or-url>...');
  process.exit(2);
}
const offHost = urls.filter((u) => new URL(u).host !== HOST);
if (offHost.length > 0) {
  console.error(`indexnow: not on ${HOST}: ${offHost.join(', ')}`);
  process.exit(2);
}

const payload = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls };
if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});
// 200 = submitted, 202 = received (key validation pending). Anything else is a failure.
console.log(`indexnow: HTTP ${res.status} for ${urls.length} URL(s): ${urls.join(' ')}`);
const body = await res.text();
if (body) console.log(body);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
