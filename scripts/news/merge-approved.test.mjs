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
import { HEAD_WAIT_ROUNDS, POLL_ROUNDS, decideMerge, defaultDeps, mergeApproved, pickDecision, planRedate, redateArticle } from './merge-approved.mjs';

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

test('decideMerge merges on a delegated row (filed as classify) answered "merge"', () => {
  const d = decideMerge({ pr: 44, view: view(), rows: [row({ decision_class: 'delegated' })] });
  assert.deepEqual(d.reasons, []);
  assert.equal(d.merge, true);
});

test('decideMerge refuses every other case, naming why', () => {
  const cases = [
    ['unanswered', view(), [row({ answered: false, option: null })], /waiting on 438c9cf0/],
    ['answered no', view(), [row({ option: 'no' })], /answered "no": not merging/],
    ['a non-merge word', view(), [row({ option: 'mergeless' })], /answered "mergeless"/],
    ['class auto', view(), [row({ decision_class: 'auto' })], /decision 438c9cf0 is class auto, not matt-only or delegated/],
    ['class default-24h', view(), [row({ decision_class: 'default-24h' })], /class default-24h, not matt-only or delegated/],
    ['delegated but unanswered', view(), [row({ decision_class: 'delegated', answered: false, option: null })], /waiting on 438c9cf0/],
    ['delegated answered no', view(), [row({ decision_class: 'delegated', option: 'no' })], /answered "no": not merging/],
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

// A file as draft.mjs writes it: gray-matter quotes the dates.
const mdx = (type, date) =>
  `---\ntitle: Example\ndescription: An example.\ntype: ${type}\npublishedAt: '${date}'\nupdatedAt: '${date}'\nauthor: elle-evate\nstatus: published\ntags:\n  - ai\n---\n\nBody text mentioning publishedAt: '${date}' stays as written.\n`;
// The fixed clock: 15:00 UTC on 2026-11-03 is 10:00 in New York, the day after the files' 2026-11-02.
const NOW = new Date('2026-11-03T15:00:00Z');
const NEW_HEAD = '9d1c0ffee0000000000000000000000000000001';

function stubs({ v = view(), rows = [row()], statuses = {}, files = {}, now = new Date('2026-11-02T15:00:00Z'), headShows = (h) => h } = {}) {
  const calls = { gh: [], pmjs: [], fetch: [], sleeps: 0, logs: [], reads: [], commits: [] };
  let head = v.headRefOid;
  return {
    calls,
    deps: {
      gh: (args) => {
        calls.gh.push(args);
        if (args[1] === 'view') {
          if (args.at(-1) === 'mergeCommit') return JSON.stringify({ mergeCommit: { oid: 'feedface' } });
          if (args.at(-1) === 'headRefOid') return JSON.stringify({ headRefOid: headShows(head, calls) });
          return JSON.stringify(v);
        }
        return '';
      },
      readHead: (file, oid) => {
        calls.reads.push([file, oid]);
        return files[file] ?? mdx(file.startsWith('content/news/') ? 'news' : 'guide', WEEK);
      },
      commitRedate: (c) => {
        calls.commits.push(c);
        head = NEW_HEAD;
        return NEW_HEAD;
      },
      now: () => now,
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

test('run.sh: the merge-check branch pings IndexNow after merge-approved.mjs and before it exits', () => {
  const src = fs.readFileSync(path.join(HERE, 'run.sh'), 'utf8');
  const branch = src.match(/if \[\[ -n "\$MERGE_PR" \]\]; then\n([\s\S]*?)\nfi\n/)[1];
  const merge = branch.indexOf('node scripts/news/merge-approved.mjs --pr "$MERGE_PR"');
  const ping = branch.indexOf('node scripts/news/indexnow-since.mjs --state "$STATE"');
  const exit = branch.indexOf('exit 0');
  assert.ok(merge >= 0 && ping > merge && exit > ping, branch);
});

// ---------- go-live re-date (fenlon11/pmOS#2986) ----------

test('redateArticle re-dates frontmatter only and renames news, never guides', () => {
  const n = redateArticle(NEWS, mdx('news', WEEK), '2026-11-03');
  assert.equal(n.to, 'content/news/2026-11-03-example-launch.mdx');
  assert.equal(n.from, WEEK);
  assert.match(n.content, /^publishedAt: '2026-11-03'$/m);
  assert.match(n.content, /^updatedAt: '2026-11-03'$/m);
  assert.match(n.content, /Body text mentioning publishedAt: '2026-11-02' stays as written\.\n$/);
  assert.equal(contentHref(n.to), contentHref(NEWS), 'the public URL does not move');
  const g = redateArticle(GUIDE, mdx('guide', WEEK).replace(/'/g, ''), '2026-11-03');
  assert.equal(g.to, GUIDE);
  assert.match(g.content, /^publishedAt: '2026-11-03'$/m);
  assert.equal(redateArticle(NEWS, mdx('news', '2026-11-03'), '2026-11-03'), null);
  assert.equal(redateArticle('content/authors/elle-evate.mdx', mdx('news', WEEK), '2026-11-03'), null);
});

test('(a) an added news file dated yesterday is renamed and re-dated: one push, merge at the new head', async () => {
  const { deps, calls } = stubs({ v: view({ files: [{ path: NEWS, changeType: 'ADDED' }] }), now: NOW });
  const r = await mergeApproved({ pr: 44, deps });
  assert.equal(r.merged, true);
  assert.equal(calls.commits.length, 1, 'one commit, one push');
  const c = calls.commits[0];
  assert.equal(c.branch, `content/ai-news-${WEEK}`);
  assert.equal(c.head, HEAD, 'built on the fact-checked head');
  assert.equal(c.message, 'content: date articles to go-live day 2026-11-03');
  assert.deepEqual(c.changes.map((x) => [x.path, x.to]), [[NEWS, 'content/news/2026-11-03-example-launch.mdx']]);
  assert.match(c.changes[0].content, /^publishedAt: '2026-11-03'$/m);
  assert.deepEqual(calls.reads, [[NEWS, HEAD]]);
  const merges = calls.gh.filter((a) => a[1] === 'merge');
  assert.equal(merges.length, 1);
  assert.deepEqual(merges[0].slice(-2), ['--match-head-commit', NEW_HEAD]);
  // The decision and the fact-check are matched on PR #44 and the pre-push head; the pushed commit does not re-open them.
  assert.deepEqual(calls.pmjs, [['decisions', 'list', '--since', '14d', '--match', 'PR #44', '--json']]);
  assert.match(calls.gh.find((a) => a[1] === 'comment').at(-1), /- https:\/\/persistentmomentum\.com\/news\/example-launch: HTTP 200/);
});

test('(a) the merge waits for GitHub to show the pushed head, and refuses to merge if it never does', async () => {
  let lag = 2;
  const slow = stubs({ v: view({ files: [{ path: NEWS, changeType: 'ADDED' }] }), now: NOW, headShows: (h) => (lag-- > 0 ? HEAD : h) });
  await mergeApproved({ pr: 44, deps: slow.deps });
  assert.equal(slow.calls.sleeps, 2);
  assert.deepEqual(slow.calls.gh.find((a) => a[1] === 'merge').slice(-1), [NEW_HEAD]);

  const stuck = stubs({ v: view({ files: [{ path: NEWS, changeType: 'ADDED' }] }), now: NOW, headShows: () => HEAD });
  await assert.rejects(mergeApproved({ pr: 44, deps: stuck.deps }), /head is not 9d1c0ffee.* after the re-date push; not merging/);
  assert.equal(stuck.calls.gh.filter((a) => a[1] === 'merge').length, 0);
  assert.equal(stuck.calls.gh.filter((a) => a[2] === '44' && a.at(-1) === 'headRefOid').length, HEAD_WAIT_ROUNDS);
});

test('(b) an added guide dated yesterday gets new dates and keeps its name', async () => {
  const { deps, calls } = stubs({ v: view({ files: [{ path: GUIDE, changeType: 'ADDED' }] }), now: NOW });
  await mergeApproved({ pr: 44, deps });
  assert.equal(calls.commits.length, 1);
  const [c] = calls.commits[0].changes;
  assert.equal(c.to, GUIDE);
  assert.match(c.content, /^publishedAt: '2026-11-03'$/m);
  assert.match(c.content, /^updatedAt: '2026-11-03'$/m);
});

test('(c) a file the PR modifies is left alone', async () => {
  const { deps, calls } = stubs({ v: view({ files: [{ path: NEWS, changeType: 'MODIFIED' }, { path: GUIDE, changeType: 'ADDED' }] }), now: NOW });
  await mergeApproved({ pr: 44, deps });
  assert.deepEqual(calls.reads.map((x) => x[0]), [GUIDE], 'the modified file is not even read');
  assert.deepEqual(calls.commits[0].changes.map((x) => x.path), [GUIDE]);
  assert.deepEqual(planRedate({ files: [{ path: NEWS, changeType: 'MODIFIED' }], today: '2026-11-03', read: () => assert.fail('read') }), []);
});

test('(d) every added file already dated today: no commit, merge at the original head', async () => {
  const { deps, calls } = stubs({ now: new Date('2026-11-03T04:30:00Z') }); // 23:30 on 11-02 in New York
  const r = await mergeApproved({ pr: 44, deps });
  assert.equal(r.merged, true);
  assert.equal(calls.commits.length, 0);
  assert.deepEqual(r.plan, []);
  assert.deepEqual(calls.gh.find((a) => a[1] === 'merge').slice(-1), [HEAD]);
  assert.ok(!calls.gh.some((a) => a.at(-1) === 'headRefOid'), 'no head wait without a push');
});

test('(e) --dry-run reports the re-dating it would do and writes nothing', async () => {
  const { deps, calls } = stubs({ now: NOW });
  const r = await mergeApproved({ pr: 44, dryRun: true, deps });
  assert.equal(r.wouldMerge, true);
  assert.equal(r.plan.length, 2);
  assert.equal(calls.commits.length, 0);
  assert.deepEqual(subcommands(calls), ['pr view']);
  assert.equal(calls.fetch.length, 0);
  assert.ok(calls.logs.includes(`dry run: would re-date ${NEWS}: publishedAt ${WEEK} -> 2026-11-03, renamed to content/news/2026-11-03-example-launch.mdx`), calls.logs.join('\n'));
  assert.ok(calls.logs.includes(`dry run: would re-date ${GUIDE}: publishedAt ${WEEK} -> 2026-11-03`), calls.logs.join('\n'));
  assert.match(calls.logs.at(-1), /dry run: would squash-merge PR #44 at the re-date commit on 2cf5bd9e.*; nothing written/);
});

test('commitRedate makes one commit on the PR branch from a throwaway worktree and leaves the checkout alone', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-news-redate-test-'));
  const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid', GIT_CONFIG_GLOBAL: '/dev/null' };
  const raw = (cwd, ...a) => spawnSync('git', ['-C', cwd, ...a], { encoding: 'utf8', env }).stdout;
  const git = (cwd, ...a) => raw(cwd, ...a).trim();
  const saved = { ...process.env };
  Object.assign(process.env, env);
  try {
    const origin = path.join(tmp, 'origin.git');
    const repo = path.join(tmp, 'repo');
    spawnSync('git', ['init', '-q', '--bare', '-b', 'main', origin], { env });
    spawnSync('git', ['clone', '-q', origin, repo], { env });
    git(repo, 'commit', '-q', '--allow-empty', '-m', 'base');
    git(repo, 'push', '-q', 'origin', 'HEAD:refs/heads/main');
    const branch = `content/ai-news-${WEEK}`;
    git(repo, 'checkout', '-q', '-b', branch);
    fs.mkdirSync(path.join(repo, 'content/news'), { recursive: true });
    fs.writeFileSync(path.join(repo, NEWS), mdx('news', WEEK));
    git(repo, 'add', '-A');
    git(repo, 'commit', '-q', '-m', 'draft');
    git(repo, 'push', '-q', 'origin', `HEAD:refs/heads/${branch}`);
    const head = git(repo, 'rev-parse', 'HEAD');
    git(repo, 'checkout', '-q', 'main');

    const changes = planRedate({ files: [{ path: NEWS, changeType: 'ADDED' }], today: '2026-11-03', read: (f) => raw(repo, 'show', `${head}:${f}`) });
    const oid = defaultDeps('/nonexistent/pm.js', repo).commitRedate({ branch, head, changes, message: 'content: date articles to go-live day 2026-11-03' });
    assert.equal(git(origin, 'rev-parse', `refs/heads/${branch}`), oid);
    assert.equal(git(origin, 'rev-parse', `${oid}^`), head, 'one commit on top of the PR head');
    assert.equal(git(origin, 'log', '-1', '--format=%s', oid), 'content: date articles to go-live day 2026-11-03');
    assert.match(git(origin, 'diff', '--name-status', '-M', head, oid), new RegExp(`^R\\d+\\t${NEWS}\\tcontent/news/2026-11-03-example-launch\\.mdx$`));
    assert.equal(raw(origin, 'show', `${oid}:content/news/2026-11-03-example-launch.mdx`), changes[0].content);
    assert.equal(git(repo, 'rev-parse', '--abbrev-ref', 'HEAD'), 'main', 'the caller checkout did not move');
    assert.equal(git(repo, 'status', '--porcelain'), '');
    assert.equal(git(repo, 'worktree', 'list').split('\n').length, 1, 'the throwaway worktree is removed');
  } finally {
    process.env = saved;
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
