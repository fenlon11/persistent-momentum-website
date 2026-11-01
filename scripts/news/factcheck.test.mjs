// Fact-check stage tests (fenlon11/pmOS#2017): Claude, the network, gh and pm.js are stubbed, so these
// run offline. The end-to-end cases drive a real git repo with a local bare origin.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { frontmatterSchema } from '../../lib/content/schema.ts';
import { BUSINESS_HEADING, buildArticle } from './draft.mjs';
import { MARKER, applyFixes, decisionTitle, factcheckPr, fileDecision, namesPr, reviewArticle, setReviewer } from './factcheck.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEEK = '2026-10-26';
const SOURCES = [
  { title: 'Launch post', url: 'https://openai.com/index/example', publisher: 'OpenAI' },
  { title: 'Pricing', url: 'https://openai.com/api/pricing/', publisher: 'OpenAI' },
];
const draft = (slug, line) => ({
  slug,
  title: `Example ${slug}`,
  description: 'An example article for the fact-check tests.',
  statusLabel: 'available',
  tags: ['example'],
  sources: SOURCES,
  body: `${line} If you pay by usage, your bill could drop.\n\n## What shipped\n\nThe model costs $2 per million tokens.\n\n${BUSINESS_HEADING}\n\nRe-run your three most common prompts.\n`,
});
const article = (slug, line = 'Example Labs released a model on Monday.') => buildArticle('news', draft(slug, line), WEEK);
const okFetches = SOURCES.map((s) => ({ url: s.url, ok: true, published: '2026-10-26' }));
const clean = { claims: [{ text: 'released on Monday', source: SOURCES[0].url }], fixes: [], unsupported: [] };

test('a fix applies only when its old text occurs exactly once', () => {
  const body = 'It costs $2. It costs $2. It ships Monday.';
  const r = applyFixes(body, [
    { old: 'ships Monday', new: 'ships Tuesday', reason: 'r', source: 's' },
    { old: 'costs $2', new: 'costs $3', reason: 'r', source: 's' },
    { old: 'not there', new: 'x', reason: 'r', source: 's' },
  ]);
  assert.equal(r.body, 'It costs $2. It costs $2. It ships Tuesday.');
  assert.deepEqual(r.applied.map((f) => f.old), ['ships Monday']);
  assert.deepEqual(r.skipped.map((f) => f.why), ['old text occurs 2 times in the body', 'old text not found in the body']);
  // `$` in the replacement is literal text, not a regex back-reference.
  assert.equal(applyFixes('a b', [{ old: 'b', new: '$& $1', reason: '', source: '' }]).body, 'a $& $1');
});

test('a surviving article gets reviewedBy: pm-editor and passes the real content schema', () => {
  const a = article('kept');
  const fix = { old: 'on Monday', new: 'on Tuesday', reason: 'the post is dated Tuesday', source: SOURCES[0].url };
  const r = reviewArticle({ path: a.path, raw: a.mdx, fetches: okFetches, result: { ...clean, fixes: [fix] } });
  assert.equal(r.kept, true, r.reasons.join('; '));
  const { data, content } = matter(r.mdx);
  assert.equal(data.reviewedBy, 'pm-editor');
  assert.equal(frontmatterSchema.safeParse(data).success, true);
  assert.match(content, /released a model on Tuesday\./);
  assert.deepEqual(r.applied, [fix]);
});

test('setReviewer adds the line after author, or replaces an existing one', () => {
  const head = '---\ntitle: x\nauthor: elle-evate\nstatus: published\n---\n';
  assert.equal(setReviewer(head), '---\ntitle: x\nauthor: elle-evate\nreviewedBy: pm-editor\nstatus: published\n---\n');
  assert.equal(setReviewer('---\nauthor: a\nreviewedBy: someone\n---\n'), '---\nauthor: a\nreviewedBy: pm-editor\n---\n');
});

test('an unsupported claim with no applicable fix drops the article', () => {
  const a = article('unsupported');
  const r = reviewArticle({ path: a.path, raw: a.mdx, fetches: okFetches, result: { ...clean, unsupported: [{ text: '$2 per million', reason: 'no price on either page' }] } });
  assert.equal(r.kept, false);
  assert.match(r.reasons[0], /unsupported claim with no applicable fix: "\$2 per million"/);
});

test('a fix whose old text is ambiguous or missing drops the article, never guesses', () => {
  const a = article('ambiguous', 'It costs money. It costs money.');
  const r = reviewArticle({ path: a.path, raw: a.mdx, fetches: okFetches, result: { ...clean, fixes: [{ old: 'It costs money.', new: 'It is free.', reason: 'r', source: SOURCES[0].url }] } });
  assert.equal(r.kept, false);
  assert.match(r.reasons[0], /occurs 2 times/);
});

test('a source that failed to fetch drops the article without asking the model', () => {
  const a = article('fetchfail');
  const fetches = [okFetches[0], { url: SOURCES[1].url, ok: false, status: 'HTTP 403' }];
  const r = reviewArticle({ path: a.path, raw: a.mdx, fetches, result: null });
  assert.equal(r.kept, false);
  assert.deepEqual(r.reasons, [`source failed to fetch (HTTP 403): ${SOURCES[1].url}`]);
});

test('the decision row is filed once per PR: a pending row naming PR #<n> files nothing', () => {
  const calls = [];
  const pmjs = (pending) => (args) => {
    calls.push(args);
    return args[1] === 'pending' ? JSON.stringify(pending) : 'filed decision abcd1234';
  };
  const kept = [{ title: 'A' }, { title: 'B' }];
  const r1 = fileDecision({ pr: 7, url: 'u', week: WEEK, kept, pmjs: pmjs([{ id: 'x1', question: decisionTitle(7, WEEK, 2) }]) });
  assert.deepEqual(r1, { filed: false, existing: 'x1' });
  assert.equal(calls.filter((c) => c[1] === 'add').length, 0);

  const r2 = fileDecision({ pr: 7, url: 'u', week: WEEK, kept, pmjs: pmjs([{ id: 'x2', question: 'Merge PM AI-news PR #70 (week of …)' }]) });
  assert.equal(r2.filed, true);
  const add = calls.find((c) => c[1] === 'add');
  assert.deepEqual(add.slice(0, 6), ['decisions', 'add', '--class', 'matt-only', '--title', 'Merge PM AI-news PR #7 (week of 2026-10-26, fact-checked: 2 articles). Recommended: merge']);
  const ctx = fs.readFileSync(add[add.indexOf('--context-file') + 1], 'utf8').trim().split('\n');
  assert.equal(ctx.length, 4);
  assert.deepEqual(ctx.map((l) => l.split(':')[0]), ['What', 'Why now', 'Risk', 'If no']);
  assert.equal(namesPr('… PR #7.', 7), true);
  assert.equal(namesPr('… PR #71', 7), false);
});

test('no code path can merge: the module never names a merge subcommand', () => {
  const src = fs.readFileSync(path.join(HERE, 'factcheck.mjs'), 'utf8');
  assert.doesNotMatch(src, /['"`]merge['"`]/);
  assert.doesNotMatch(src, /pr\s+merge|--auto/);
});

// ---------- end to end against a real git repo ----------

const sh = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function fixtureRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-news-fc-test-'));
  const origin = path.join(dir, 'origin.git');
  const repo = path.join(dir, 'repo');
  execFileSync('git', ['init', '-q', '--bare', '-b', 'main', origin]);
  execFileSync('git', ['init', '-q', '-b', 'main', repo]);
  for (const [k, v] of [['user.name', 'test'], ['user.email', 'test@example.com'], ['core.hooksPath', '/dev/null'], ['commit.gpgsign', 'false']]) sh(repo, 'config', k, v);
  sh(repo, 'remote', 'add', 'origin', origin);
  fs.writeFileSync(path.join(repo, 'README.md'), 'site\n');
  sh(repo, 'add', '.');
  sh(repo, 'commit', '-q', '-m', 'init');
  sh(repo, 'push', '-q', 'origin', 'main');
  const branch = `content/ai-news-${WEEK}`;
  sh(repo, 'checkout', '-q', '-b', branch);
  const kept = article('keepme');
  const dropped = article('dropme');
  for (const a of [kept, dropped]) {
    fs.mkdirSync(path.dirname(path.join(repo, a.path)), { recursive: true });
    fs.writeFileSync(path.join(repo, a.path), a.mdx);
  }
  sh(repo, 'add', '.');
  sh(repo, 'commit', '-q', '-m', 'drafts');
  sh(repo, 'push', '-q', 'origin', branch, 'HEAD:refs/pull/7/head');
  const head = sh(repo, 'rev-parse', 'HEAD');
  sh(repo, 'checkout', '-q', 'main');
  return { repo, origin, branch, head, kept, dropped };
}

function stubs(fx, { pending = [] } = {}) {
  const calls = { gh: [], pmjs: [], build: 0, ask: 0, comment: null };
  return {
    calls,
    deps: {
      gh: (args) => {
        calls.gh.push(args);
        if (args[0] === 'pr' && args[1] === 'view') {
          return JSON.stringify({
            number: 7, state: 'OPEN', isDraft: true, headRefName: fx.branch, headRefOid: fx.head, url: 'https://github.com/x/y/pull/7',
            files: [{ path: fx.kept.path }, { path: fx.dropped.path }],
          });
        }
        if (args[1] === 'comment') calls.comment = fs.readFileSync(args[args.indexOf('--body-file') + 1], 'utf8');
        return '';
      },
      git: (cwd, ...args) => sh(cwd, ...args),
      fetchPage: async (url) => ({ url, title: 'page', published: '2026-10-26', text: 'Example Labs released a model on Tuesday.', links: [] }),
      askClaude: (prompt) => {
        calls.ask += 1;
        if (prompt.includes('Example dropme')) return { ...clean, unsupported: [{ text: '$2 per million', reason: 'not on the page' }] };
        return { ...clean, fixes: [{ old: 'on Monday', new: 'on Tuesday', reason: 'dated Tuesday', source: SOURCES[0].url }] };
      },
      build: () => { calls.build += 1; },
      pmjs: (args) => {
        calls.pmjs.push(args);
        return args[1] === 'pending' ? JSON.stringify(pending) : 'filed decision abcd1234';
      },
      pmJsExists: () => true,
    },
  };
}

test('end to end: the survivor is fixed and reviewed, the drop leaves the branch, one comment, ready, one decision, no merge', async () => {
  const fx = fixtureRepo();
  const { deps, calls } = stubs(fx);
  const r = await factcheckPr({ pr: 7, repo: fx.repo, deps, log: () => {}, today: '2026-10-27' });
  const pushed = sh(fx.origin, 'rev-parse', fx.branch);
  assert.equal(r.head, pushed);
  assert.notEqual(pushed, fx.head);
  const { data, content } = matter(sh(fx.origin, 'show', `${fx.branch}:${fx.kept.path}`));
  assert.equal(data.reviewedBy, 'pm-editor');
  assert.match(content, /on Tuesday\./);
  assert.notEqual(spawnSync('git', ['-C', fx.origin, 'cat-file', '-e', `${fx.branch}:${fx.dropped.path}`]).status, 0, 'dropped article is absent from the branch');
  assert.equal(calls.build, 1);

  assert.ok(calls.comment.startsWith(`<!-- ${MARKER} head=${pushed} -->\n## Fact-check, week of ${WEEK}`));
  assert.match(calls.comment, /Example dropme \(1 claims checked\) — DROPPED/);
  assert.match(calls.comment, /unsupported claim with no applicable fix: "\$2 per million"/);
  assert.match(calls.comment, /"on Monday" → "on Tuesday"\. dated Tuesday/);
  assert.equal(calls.gh.filter((a) => a[1] === 'comment').length, 1);
  assert.equal(calls.gh.filter((a) => a[1] === 'ready').length, 1);
  assert.ok(!calls.gh.flat().includes('merge'), 'gh never saw merge');
  assert.equal(calls.pmjs.filter((a) => a[1] === 'add').length, 1);

  // A second run with the row now pending files nothing more.
  const again = stubs(fx, { pending: [{ id: 'abcd1234', question: decisionTitle(7, WEEK, 1) }] });
  again.deps.gh = (args) => (args[1] === 'view' ? JSON.stringify({ number: 7, state: 'OPEN', isDraft: false, headRefName: fx.branch, headRefOid: pushed, url: 'u', files: [{ path: fx.kept.path }] }) : '');
  await factcheckPr({ pr: 7, repo: fx.repo, deps: again.deps, log: () => {}, today: '2026-10-28' });
  assert.equal(again.calls.pmjs.filter((a) => a[1] === 'add').length, 0);
});

test('--dry-run prints the comment and decision and writes nothing', async () => {
  const fx = fixtureRepo();
  const { deps, calls } = stubs(fx);
  const out = [];
  await factcheckPr({ pr: 7, dryRun: true, repo: fx.repo, deps, log: (s) => out.push(s), today: '2026-10-27' });
  assert.equal(sh(fx.origin, 'rev-parse', fx.branch), fx.head, 'nothing pushed');
  assert.deepEqual(calls.gh.map((a) => a[1]), ['view']);
  assert.equal(calls.pmjs.length, 0);
  assert.equal(calls.build, 0);
  const text = out.join('\n');
  assert.match(text, new RegExp(`<!-- ${MARKER} head=${fx.head} -->`));
  assert.match(text, /would-be decision: Merge PM AI-news PR #7 \(week of 2026-10-26, fact-checked: 1 articles\)/);
  assert.match(text, /D content\/news\/2026-10-26-dropme\.mdx/);
  assert.match(text, /dry run: no push, no comment, no gh pr ready, no decision row/);
  assert.equal(sh(fx.repo, 'worktree', 'list').split('\n').length, 1, 'throwaway worktree removed');
});

test('a fork PR, or one that changes anything but content/**/*.mdx, is refused before any checkout', async () => {
  const fx = fixtureRepo();
  for (const [extra, want] of [[{ isCrossRepository: true }, /comes from a fork/], [{ files: [{ path: fx.kept.path }, { path: 'package.json' }] }, /outside content.*package\.json/]]) {
    const { deps, calls } = stubs(fx);
    const view = deps.gh;
    deps.gh = (args) => (args[1] === 'view' ? JSON.stringify({ ...JSON.parse(view(args)), ...extra }) : view(args));
    await assert.rejects(factcheckPr({ pr: 7, repo: fx.repo, deps, log: () => {} }), want);
    assert.deepEqual(calls.gh.map((a) => a[1]), ['view']);
    assert.equal(calls.ask + calls.build, 0);
  }
  assert.equal(sh(fx.repo, 'worktree', 'list').split('\n').length, 1);
});

test('a missing pm.js stops the run before any GitHub write', async () => {
  const fx = fixtureRepo();
  const { deps, calls } = stubs(fx);
  deps.pmJsExists = () => false;
  await assert.rejects(factcheckPr({ pr: 7, repo: fx.repo, deps, log: () => {} }), /pm\.js not found .* stopping before any GitHub write/);
  assert.equal(calls.gh.length, 0);
});

// ---------- run.sh decide-only path ----------

function decide({ list, markers }) {
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-news-gh-'));
  const gh = path.join(bin, 'gh');
  fs.writeFileSync(gh, `#!/bin/sh\nif [ "$2" = list ]; then printf '%s' "$GH_LIST"; else printf '%s' "$GH_MARKERS"; fi\n`);
  fs.chmodSync(gh, 0o755);
  const r = spawnSync('bash', [path.join(HERE, 'run.sh')], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, PM_NEWS_DECIDE_ONLY: '1', GH_LIST: list, GH_MARKERS: markers },
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim().split('\n').at(-1);
}

test('run.sh: an open draft PR without the marker is fact-checked; no second PR is drafted', () => {
  assert.equal(decide({ list: `content/ai-news-${WEEK} 7 OPEN true`, markers: '0' }), 'decision: factcheck #7');
});

test('run.sh: a PR that already carries the marker comment is skipped', () => {
  assert.equal(decide({ list: `content/ai-news-${WEEK} 7 OPEN true`, markers: '1' }), 'decision: skip');
  assert.equal(decide({ list: `content/ai-news-${WEEK} 7 OPEN false`, markers: '0' }), 'decision: skip');
  assert.equal(decide({ list: `content/ai-news-${WEEK} 7 MERGED false`, markers: '0' }), 'decision: skip');
});

test('run.sh: a week with no PR yet drafts', () => {
  assert.equal(decide({ list: '', markers: '0' }), 'decision: draft');
});
