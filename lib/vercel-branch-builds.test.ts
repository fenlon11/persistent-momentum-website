import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Agent branches get no Vercel build (fenlon11/pmOS#2756); main must keep deploying.
const config = JSON.parse(readFileSync(path.join(import.meta.dirname, '..', 'vercel.json'), 'utf8'));
const map: Record<string, boolean> = config.git?.deploymentEnabled ?? {};

test('framework key kept', () => {
  assert.equal(config.framework, 'nextjs');
});

for (const prefix of ['loop/**', 'analyze/**', 'market/**', 'plan/**']) {
  test(`${prefix} builds disabled`, () => {
    assert.equal(map[prefix], false);
  });
}

test('no pattern matches main', () => {
  for (const key of Object.keys(map)) {
    const re = new RegExp('^' + key.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '.*').replace(/(?<!\.)\*/g, '[^/]*').replace(/\?/g, '.') + '$');
    assert.ok(!re.test('main'), `pattern ${key} matches main`);
  }
});
