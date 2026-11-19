import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Persistent Workforce is AI employees, not recruiting software (fenlon11/pmOS#2752).
// Each entry pulls the Persistent Workforce text out of one file; the `persistent-recruiter`
// identifier is kept on purpose and stripped before the check.
const root = path.join(import.meta.dirname, '..');
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

function block(src: string, start: string, end: string): string {
  const i = src.indexOf(start);
  assert.ok(i >= 0, `start marker not found: ${start}`);
  const j = src.indexOf(end, i + start.length);
  assert.ok(j >= 0, `end marker not found: ${end}`);
  return src.slice(i, j);
}

const descriptions: Record<string, string> = {
  'app/careers/page.tsx': block(read('app/careers/page.tsx'), "label: 'Persistent Workforce'", '}'),
  'lib/dashboard-data.ts': block(read('lib/dashboard-data.ts'), "label: 'Persistent Workforce'", '}'),
  'lib/products-data.ts': block(read('lib/products-data.ts'), "name: 'Persistent Workforce'", '],'),
  'app/api/projects/route.ts': block(read('app/api/projects/route.ts'), "'persistent-recruiter': {", '},'),
};

for (const [file, text] of Object.entries(descriptions)) {
  test(`${file}: Persistent Workforce is not described as recruiting or hiring software`, () => {
    const visible = text.replaceAll('persistent-recruiter', '');
    assert.doesNotMatch(visible, /recruit|hiring/i);
  });
}
