#!/usr/bin/env node
// Weekly AI news merge executor (fenlon11/pmOS#2210). Step 4 of the pipeline: factcheck.mjs readies the
// week's content/ai-news-* PR and files one matt-only row "Merge PM AI-news PR #<n> … Recommended: merge".
// When Matt answers that row "merge", this script carries out his answer; it never decides on its own.
//
//   node scripts/news/merge-approved.mjs --pr <n> [--dry-run]
//
// 1. Reads the PR. It must be open, not a draft, a same-repo content/ai-news-* branch of content files
//    only, fact-checked on its current head (no commit after the marker), all checks SUCCESS, MERGEABLE.
// 2. Finds the newest "Merge PM AI-news PR #<n>" row via `pm.js decisions list` (read-only).
// 3. Merges only when that row is matt-only and answered with an option starting "merge". Anything else
//    logs why and exits 0 with no write; a "no" never closes, edits or comments on the PR.
// 4. Squash-merges pinned to the fact-checked head (--match-head-commit). One attempt per run.
// 5. Polls each merged article's public URL every 60 s for up to 15 min, then comments the read-back
//    on the PR. A URL not live by then is named in the comment and the script exits 1.
// --dry-run does steps 1-3 and prints what it would do.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contentHref } from '../../lib/content/paths.ts';
import { MARKER, isContentFile, namesPr, pmJsPath } from './factcheck.mjs';

const GH_REPO = 'fenlon11/persistent-momentum-website';
const BRANCH_PREFIX = 'content/ai-news-';
export const SITE = 'https://persistentmomentum.com';
export const QUESTION_PREFIX = 'Merge PM AI-news PR #';
export const VIEW_FIELDS = 'number,state,isDraft,headRefName,headRefOid,url,files,isCrossRepository,mergeable,statusCheckRollup,comments';
export const POLL_MS = 60_000;
export const POLL_ROUNDS = 15; // first check at merge time, then every 60 s: 15 min in all
const MARKER_RE = new RegExp(`<!-- ${MARKER} head=([0-9a-f]{7,40}) -->`);
// factcheck.mjs comments as the repo owner's gh login; a marker from anyone else is ignored, so a
// stranger's comment cannot vouch for a commit pushed after the fact-check.
export const MARKER_AUTHOR = GH_REPO.split('/')[0];

const id8 = (id) => String(id).slice(0, 8);

// Newest row whose question is this PR's merge question (`PR #4` never matches `PR #44`).
export function pickDecision(rows, pr) {
  return (
    rows
      .filter((r) => (r.question ?? '').startsWith(QUESTION_PREFIX) && namesPr(r.question, pr))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0] ?? null
  );
}

// Every reason not to merge; merge only when there are none. Pure: no I/O.
export function decideMerge({ pr, view, rows }) {
  const reasons = [];
  if (view.state !== 'OPEN') reasons.push(`PR #${pr} is ${view.state}, not OPEN`);
  if (view.isDraft) reasons.push(`PR #${pr} is a draft`);
  if (!String(view.headRefName ?? '').startsWith(BRANCH_PREFIX)) reasons.push(`head ${view.headRefName} is not a ${BRANCH_PREFIX}* branch`);
  if (view.isCrossRepository) reasons.push(`PR #${pr} comes from a fork`);
  const other = (view.files ?? []).map((f) => f.path).filter((p) => !isContentFile(p));
  if (!(view.files ?? []).length) reasons.push(`PR #${pr} changes no files`);
  if (other.length) reasons.push(`changes files outside content/**/*.mdx (${other.join(', ')})`);
  const markers = (view.comments ?? [])
    .filter((c) => c.author?.login === MARKER_AUTHOR)
    .map((c) => MARKER_RE.exec(c.body ?? ''))
    .filter(Boolean);
  const checked = markers.at(-1)?.[1];
  if (!checked) reasons.push('no fact-check marker comment');
  else if (checked !== view.headRefOid) reasons.push(`fact-checked head ${checked.slice(0, 7)} is not the PR head ${String(view.headRefOid).slice(0, 7)} (commit after the fact-check)`);
  const checks = view.statusCheckRollup ?? [];
  if (!checks.length) reasons.push('no status checks reported');
  for (const c of checks) {
    const result = c.conclusion || c.state || c.status;
    if (result !== 'SUCCESS') reasons.push(`check ${c.name || c.context || '?'} is ${result}`);
  }
  if (view.mergeable !== 'MERGEABLE') reasons.push(`mergeable is ${view.mergeable}`);

  const row = pickDecision(rows, pr);
  if (!row) reasons.push(`no "${QUESTION_PREFIX}${pr}" decision row`);
  else if (row.decision_class !== 'matt-only') reasons.push(`decision ${id8(row.id)} is class ${row.decision_class}, not matt-only`);
  else if (!row.answered) reasons.push(`waiting on ${id8(row.id)}`);
  else if (!/^merge\b/i.test(row.option ?? '')) reasons.push(`answered "${row.option}": not merging`);
  return { merge: !reasons.length, reasons, row };
}

export function readbackBody({ pr, row, mergeCommit, results }) {
  const bad = results.filter((r) => r.status !== 200);
  return [
    '<!-- pm-news-merge-readback -->',
    `## Merged on Matt's answer to decision ${id8(row.id)}`,
    '',
    `Decision ${row.id} answered "${row.option}". Squash-merged PR #${pr} as ${mergeCommit} (\`scripts/news/merge-approved.mjs\`, fenlon11/pmOS#2210).`,
    '',
    'Read-back from the live site:',
    ...results.map((r) => `- ${r.url}: ${r.status === 200 ? 'HTTP 200' : `not live after 15 min (last: ${r.status})`}`),
    ...(bad.length ? ['', `${bad.length} article URL(s) not live; check the Vercel production deploy of ${mergeCommit}.`] : []),
  ].join('\n');
}

// ---------- orchestration ----------

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).trim();

export function defaultDeps(pmJs = pmJsPath()) {
  return {
    gh: (args) => run('gh', args),
    pmjs: (args) => run('node', [pmJs, ...args]),
    pmJsExists: () => fs.existsSync(pmJs),
    fetchUrl: async (url) => {
      try {
        return (await fetch(url, { cache: 'no-store' })).status;
      } catch (e) {
        return `error: ${e.message}`;
      }
    },
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    log: console.log,
  };
}

export async function mergeApproved({ pr, dryRun = false, deps = defaultDeps() }) {
  const { gh, pmjs, fetchUrl, sleep, log } = deps;
  if (!deps.pmJsExists()) throw new Error(`pm.js not found at ${pmJsPath()} (set PMOS_REPO); stopping before any GitHub write`);
  const view = JSON.parse(gh(['pr', 'view', String(pr), '--repo', GH_REPO, '--json', VIEW_FIELDS]));
  const rows = JSON.parse(pmjs(['decisions', 'list', '--since', '14d', '--match', `PR #${pr}`, '--json']));
  const d = decideMerge({ pr, view, rows });
  if (!d.merge) {
    log(`PR #${pr}: not merging: ${d.reasons.join('; ')}`);
    return { merged: false, reasons: d.reasons };
  }
  if (dryRun) {
    log(`dry run: would squash-merge PR #${pr} at ${view.headRefOid} on decision ${id8(d.row.id)} ("${d.row.option}"); nothing written`);
    return { merged: false, wouldMerge: true, row: d.row };
  }

  gh(['pr', 'merge', String(pr), '--repo', GH_REPO, '--squash', '--match-head-commit', view.headRefOid]);
  const mergeCommit = JSON.parse(gh(['pr', 'view', String(pr), '--repo', GH_REPO, '--json', 'mergeCommit'])).mergeCommit?.oid ?? '(unknown)';
  log(`PR #${pr}: merged as ${mergeCommit} on decision ${id8(d.row.id)}`);

  const urls = view.files
    .filter((f) => f.changeType !== 'DELETED')
    .map((f) => contentHref(f.path))
    .filter(Boolean)
    .map((p) => `${SITE}${p}`);
  const status = new Map(urls.map((u) => [u, null]));
  for (let round = 0; round <= POLL_ROUNDS; round++) {
    if (round) await sleep(POLL_MS);
    for (const u of urls) if (status.get(u) !== 200) status.set(u, await fetchUrl(u));
    if (urls.every((u) => status.get(u) === 200)) break;
  }
  const results = urls.map((url) => ({ url, status: status.get(url) }));
  for (const r of results) log(`${r.url}: ${r.status}`);
  gh(['pr', 'comment', String(pr), '--repo', GH_REPO, '--body', readbackBody({ pr, row: d.row, mergeCommit, results })]);
  const bad = results.filter((r) => r.status !== 200);
  return { merged: true, mergeCommit, results, ok: !bad.length };
}

function parseArgs(argv) {
  const args = { pr: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--pr') args.pr = argv[++i];
    else throw new Error(`unknown argument ${argv[i]}`);
  }
  if (!/^\d+$/.test(args.pr ?? '')) throw new Error('usage: merge-approved.mjs --pr <n> [--dry-run]');
  return { ...args, pr: Number(args.pr) };
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mergeApproved(parseArgs(process.argv.slice(2)))
    .then((r) => {
      if (r.merged && !r.ok) {
        console.error(`FAIL: merged as ${r.mergeCommit} but ${r.results.filter((x) => x.status !== 200).map((x) => x.url).join(', ')} not live after 15 min`);
        process.exit(1);
      }
    })
    .catch((e) => {
      console.error(`FAIL: ${e.message}`);
      process.exit(1);
    });
}
