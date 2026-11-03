// Merge executor tests (fenlon11/pmOS#2210): gh, pm.js, the network and the clock are stubbed, so these
// run offline and can never merge anything real.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contentHref } from '../../lib/content/paths.ts';
import { decisionTitle } from './factcheck.mjs';
import { POLL_ROUNDS, decideMerge, mergeApproved, pickDecision } from './merge-approved.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HEAD = '2cf5bd9e503b5b4d1f6c0faa0a63a0d1e7f1166c';
const WEEK = '2026-11-02';
const NEWS = 'content/news/2026-11-02-example-launch.mdx';
const GUIDE = 'content/guides/ai-pilot-roi-cost-control.mdx';

const view = (over = {}) => ({
  number: 44,
  state: 'OPEN',
  isDraft: false,
  headRefName: `content/ai-news-${WEEK}`,
  headRefOid: HEAD,
  url: 'https://github.com/fenlon11/persistent-momentum-website/pull/44',
  files: [{ path: NEWS, changeType: 'ADDED' }, { path: GUIDE, changeType: 'ADDED' }],
  isCrossRepository: false,
  mergeable: 'MERGEABLE',
  statusCheckRollup: [
    { __typename: 'StatusContext', context: 'Vercel', state: 'SUCCESS' },
    { __typename: 'CheckRun', name: 'Vercel Preview Comments', status: 'COMPLETED', conclusion: 'SUCCESS' },
  ],
  comments: [{ author: { login: 'vercel' }, body: '[vc]: preview' }, { author: { login: 'fenlon11' }, body: `<!-- pm-news-factcheck head=${HEAD} -->\n## Fact-check, week of ${WEEK}` }],
  ...over,
});
const row = (over = {}) => ({
  id: '438c9cf0-a3fa-40cf-9801-3ea1c60b9389',
  question: decisionTitle(44, WEEK, 2),
  decision_class: 'matt-only',
  answered: true,
  option: 'merge',
  created_at: '2026-11-03T12:01:35Z',
  ...over,
});

test('decideMerge merges an open, ready, fact-checked, green content PR on a matt-only "merge" answer', () => {
  const d = decideMerge({ pr: 44, view: view(), rows: [row()] });
  assert.deepEqual(d.reasons, []);
  assert.equal(d.merge, true);
  assert.equal(decideMerge({ pr: 44, view: view(), rows: [row({ option: 'Merge (recommended)' })] }).merge, true);
});

test('decideMerge refuses every other case, naming why', () => {
  const cases = [
    ['unanswered', view(), [row({ answered: false, option: null })], /waiting on 438c9cf0/],
    ['answered no', view(), [row({ option: 'no' })], /answered "no": not merging/],
    ['a non-merge word', view(), [row({ option: 'mergeless' })], /answered "mergeless"/],
    ['not matt-only', view(), [row({ decision_class: 'delegated' })], /class delegated, not matt-only/],
    ['no row', view(), [], /no "Merge PM AI-news PR #44" decision row/],
    ['row names PR #4, not #44', view(), [row({ question: decisionTitle(4, WEEK, 2) })], /no "Merge PM AI-news PR #44" decision row/],
    ['row names #44 but is not the merge question', view(), [row({ question: 'Something about PR #44' })], /no .* decision row/],
    ['head moved after the fact-check', view({ headRefOid: 'abcdef1234567890abcdef1234567890abcdef12' }), [row()], /commit after the fact-check/],
    ['no marker', view({ comments: [] }), [row()], /no fact-check marker/],
    ['a marker from someone else vouching for a moved head', view({ headRefOid: 'abcdef1234567890abcdef1234567890abcdef12', comments: [...view().comments, { author: { login: 'stranger' }, body: '<!-- pm-news-factcheck head=abcdef1234567890abcdef1234567890abcdef12 -->' }] }), [row()], /commit after the fact-check/],
    ['a non-content file', view({ files: [{ path: NEWS }, { path: 'package.json' }] }), [row()], /outside content.*package\.json/],
    ['a failed check', view({ statusCheckRollup: [{ context: 'Vercel', state: 'FAILURE' }] }), [row()], /check Vercel is FAILURE/],
    ['a pending check run', view({ statusCheckRollup: [{ name: 'ci', status: 'IN_PROGRESS', conclusion: '' }] }), [row()], /check ci is IN_PROGRESS/],
    ['no checks', view({ statusCheckRollup: [] }), [row()], /no status checks/],
    ['a draft', view({ isDraft: true }), [row()], /is a draft/],
    ['closed', view({ state: 'CLOSED' }), [row()], /is CLOSED, not OPEN/],
    ['merged already', view({ state: 'MERGED' }), [row()], /is MERGED, not OPEN/],
    ['not mergeable', view({ mergeable: 'CONFLICTING' }), [row()], /mergeable is CONFLICTING/],
    ['a fork', view({ isCrossRepository: true }), [row()], /from a fork/],
    ['wrong branch', view({ headRefName: 'fix/thing' }), [row()], /not a content\/ai-news-\* branch/],
  ];
  for (const [name, v, rows, want] of cases) {
    const d = decideMerge({ pr: 44, view: v, rows });
    assert.equal(d.merge, false, name);
    assert.ok(d.reasons.some((r) => want.test(r)), `${name}: ${d.reasons.join(' | ')}`);
  }
});

test('pickDecision takes the newest merge row for the PR', () => {
  const old = row({ id: 'aaaaaaaa-1', created_at: '2026-10-27T12:00:00Z', option: 'no' });
  const fresh = row({ id: 'bbbbbbbb-2', created_at: '2026-11-03T12:00:00Z' });
  assert.equal(pickDecision([fresh, old], 44).id, 'bbbbbbbb-2');
  assert.equal(pickDecision([old, fresh], 44).id, 'bbbbbbbb-2');
});

test('contentHref is the site path: news drops the date, guides keep the name', () => {
  assert.equal(contentHref('content/news/2026-10-20-google-gemini-4-argon.mdx'), '/news/google-gemini-4-argon');
  assert.equal(contentHref(GUIDE), '/guides/ai-pilot-roi-cost-control');
  assert.equal(contentHref('content/authors/elle-evate.mdx'), null);
  assert.equal(contentHref('content/news/no-date.mdx'), null);
});

function stubs({ v = view(), rows = [row()], statuses = {} } = {}) {
  const calls = { gh: [], pmjs: [], fetch: [], sleeps: 0, logs: [] };
  return {
    calls,
    deps: {
      gh: (args) => {
        calls.gh.push(args);
        if (args[1] === 'view') return JSON.stringify(args.at(-1) === 'mergeCommit' ? { mergeCommit: { oid: 'feedface' } } : v);
        return '';
      },
      pmjs: (args) => {
        calls.pmjs.push(args);
        return JSON.stringify(rows);
      },
      pmJsExists: () => true,
      fetchUrl: async (url) => {
        calls.fetch.push(url);
        const s = statuses[url];
        return Array.isArray(s) ? (s.length > 1 ? s.shift() : s[0]) : (s ?? 200);
      },
      sleep: async () => {
        calls.sleeps += 1;
      },
      log: (s) => calls.logs.push(s),
    },
  };
}

const subcommands = (calls) => calls.gh.map((a) => `${a[0]} ${a[1]}`);

test('the merge is squash, pinned to the fact-checked head, then read back and commented once', async () => {
  const live = 'https://persistentmomentum.com/news/example-launch';
  const { deps, calls } = stubs({ statuses: { [live]: [404, 404, 200] } });
  const r = await mergeApproved({ pr: 44, deps });
  assert.equal(r.merged, true);
  assert.equal(r.ok, true);
  assert.deepEqual(calls.pmjs, [['decisions', 'list', '--since', '14d', '--match', 'PR #44', '--json']]);
  const merges = calls.gh.filter((a) => a[1] === 'merge');
  assert.equal(merges.length, 1);
  assert.deepEqual(merges[0], ['pr', 'merge', '44', '--repo', 'fenlon11/persistent-momentum-website', '--squash', '--match-head-commit', HEAD]);
  assert.equal(calls.sleeps, 2);
  const comments = calls.gh.filter((a) => a[1] === 'comment');
  assert.equal(comments.length, 1);
  const body = comments[0][comments[0].indexOf('--body') + 1];
  assert.match(body, /decision 438c9cf0/);
  assert.match(body, /as feedface/);
  assert.match(body, /- https:\/\/persistentmomentum\.com\/news\/example-launch: HTTP 200/);
  assert.match(body, /- https:\/\/persistentmomentum\.com\/guides\/ai-pilot-roi-cost-control: HTTP 200/);
  assert.ok(!subcommands(calls).some((s) => s === 'pr close' || s === 'pr edit'));
});

test('a URL still not live after 15 min is named in the comment and the run reports failure', async () => {
  const dead = 'https://persistentmomentum.com/guides/ai-pilot-roi-cost-control';
  const { deps, calls } = stubs({ statuses: { [dead]: [404] } });
  const r = await mergeApproved({ pr: 44, deps });
  assert.equal(r.merged, true);
  assert.equal(r.ok, false);
  assert.equal(calls.sleeps, POLL_ROUNDS);
  assert.equal(calls.fetch.filter((u) => u === dead).length, POLL_ROUNDS + 1);
  const body = calls.gh.find((a) => a[1] === 'comment').at(-1);
  assert.match(body, /ai-pilot-roi-cost-control: not live after 15 min \(last: 404\)/);
  assert.equal(calls.gh.filter((a) => a[1] === 'merge').length, 1, 'one merge attempt per run');
});

test('no merge answer means zero writes: only the PR read and the decisions read', async () => {
  for (const rows of [[row({ answered: false, option: null })], [row({ option: 'no' })], [row({ decision_class: 'default-24h' })], []]) {
    const { deps, calls } = stubs({ rows });
    const r = await mergeApproved({ pr: 44, deps });
    assert.equal(r.merged, false);
    assert.deepEqual(subcommands(calls), ['pr view']);
    assert.equal(calls.fetch.length, 0);
    assert.match(calls.logs.at(-1), /^PR #44: not merging: /);
  }
});

test('--dry-run on an approved PR prints what it would do and writes nothing', async () => {
  const { deps, calls } = stubs();
  const r = await mergeApproved({ pr: 44, dryRun: true, deps });
  assert.equal(r.wouldMerge, true);
  assert.deepEqual(subcommands(calls), ['pr view']);
  assert.match(calls.logs.at(-1), /dry run: would squash-merge PR #44 at 2cf5bd9e.* on decision 438c9cf0 \("merge"\); nothing written/);
});

test('a missing pm.js stops before any GitHub call', async () => {
  const { deps, calls } = stubs();
  deps.pmJsExists = () => false;
  await assert.rejects(mergeApproved({ pr: 44, deps }), /pm\.js not found/);
  assert.equal(calls.gh.length, 0);
});

test('the only gh write subcommands in the news scripts are one merge and the comments', () => {
  const src = fs.readFileSync(path.join(HERE, 'merge-approved.mjs'), 'utf8');
  assert.equal(src.match(/'pr', 'merge'/g).length, 1);
  assert.doesNotMatch(src, /'close'|'edit'|pr close|pr edit|--auto/);
});

test('run.sh: an open, ready PR with the fact-check marker gets a merge check', () => {
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-news-gh-'));
  fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/sh\nif [ "$2" = list ]; then printf '%s' "$GH_LIST"; else printf '%s' "$GH_MARKERS"; fi\n`);
  fs.chmodSync(path.join(bin, 'gh'), 0o755);
  const r = spawnSync('bash', [path.join(HERE, 'run.sh')], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, PM_NEWS_DECIDE_ONLY: '1', GH_LIST: `content/ai-news-${WEEK} 44 OPEN false`, GH_MARKERS: '1' },
  });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim().split('\n').at(-1), 'decision: merge-check #44');
});
