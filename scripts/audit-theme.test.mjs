import { test } from 'node:test';
import assert from 'node:assert/strict';
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
