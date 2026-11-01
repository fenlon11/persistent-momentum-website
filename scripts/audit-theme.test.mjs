import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findViolations } from './audit-theme.mjs';
import { renderBlock, readTokens } from './tokens.mjs';

test('raw hex in a component is a violation; issue references are not', () => {
  const src = [
    "// fenlon11/pmOS#685 and owner/repo#123",
    "const a = '#1E5BFF';",
    "className='bg-[#fff]/10'",
    "style={{ color: '#b42318' }}",
  ].join('\n');
  assert.deepEqual(findViolations('components/X.tsx', src), [
    'components/X.tsx:2  #1E5BFF',
    'components/X.tsx:3  #fff',
    'components/X.tsx:4  #b42318',
  ]);
});

test('hex inside the globals.css token block is allowed, outside it is not', () => {
  const css = ['/* tokens:start */', ':root { --a: #020A2E; }', '/* tokens:end */', 'body { color: #000; }'].join('\n');
  assert.deepEqual(findViolations('app/globals.css', css), ['app/globals.css:4  #000']);
  // The same markers mean nothing in any other file.
  assert.equal(findViolations('app/other.css', css).length, 2);
});

test('the generated block carries every palette hex and only light roles by reference', () => {
  const { brand, site } = readTokens();
  const block = renderBlock(brand, site);
  for (const { hex } of Object.values(brand.color.palette)) assert.ok(block.includes(`: ${hex};`), hex);
  assert.match(block, /--color-primary: var\(--pm-electric-blue\);/);
  assert.match(block, /--color-border: rgb\(2 10 46 \/ 0\.12\);/);
  assert.match(block, /--font-body: var\(--font-inter\), Inter,/);
});

test('HTML entities and url()/href fragments are not colours', () => {
  const src = [
    'It&#8217;s here',
    '<rect fill="url(#fade)" />',
    "<path fill=\"url('#fade')\" />",
    '<a href="#feed">Feed</a>',
    '<a href={`#feed`}>Feed</a>',
  ].join('\n');
  assert.deepEqual(findViolations('components/X.tsx', src), []);
});

test('generated type and space tokens are rem equal to the px scale at a 16px root', () => {
  const { brand, site } = readTokens();
  const block = renderBlock(brand, site);
  for (const [step, t] of Object.entries(brand.typeScale)) {
    assert.ok(block.includes(`--pm-text-${step}: ${t.size / 16}rem;`), step);
  }
  for (const [k, v] of Object.entries(brand.space)) {
    assert.ok(block.includes(`--pm-space-${k}: ${v === 0 ? '0' : `${v / 16}rem`};`), k);
  }
  assert.doesNotMatch(block, /--pm-(text|space)-[\w-]+: [\d.]+px;/);
});

// Runs the real audit from a copy of the site at a path with a space in it.
test('the audit runs from a path with a space: clean passes, planted hex in .tsx or .mdx fails', () => {
  const src = fileURLToPath(new URL('..', import.meta.url));
  const base = mkdtempSync(join(tmpdir(), 'pmw space-'));
  try {
    const dest = join(base, 'site copy');
    for (const d of ['scripts', 'tokens', 'app', 'components', 'lib', 'content']) {
      cpSync(join(src, d), join(dest, d), { recursive: true });
    }
    const audit = () => spawnSync(process.execPath, [join(dest, 'scripts/audit-theme.mjs')], { encoding: 'utf8' });

    const clean = audit();
    assert.equal(clean.status, 0, clean.stderr);
    assert.match(clean.stdout, /\[audit:theme\] clean/);

    mkdirSync(join(dest, 'components/planted'), { recursive: true });
    writeFileSync(join(dest, 'components/planted/X.tsx'), "export const c = '#123456';\n");
    const tsx = audit();
    assert.equal(tsx.status, 1);
    assert.match(tsx.stderr, /components\/planted\/X\.tsx:1 {2}#123456/);
    rmSync(join(dest, 'components/planted'), { recursive: true });

    writeFileSync(join(dest, 'content/planted.mdx'), 'Colour: #123456\n');
    const mdx = audit();
    assert.equal(mdx.status, 1);
    assert.match(mdx.stderr, /content\/planted\.mdx:1 {2}#123456/);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
