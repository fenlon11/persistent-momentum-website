import { test } from 'node:test';
import assert from 'node:assert/strict';
import { liveFormGuid } from './live-forms.ts';

const GUID = '00000000-0000-0000-0000-000000000000';

test('no VERCEL_ENV: GUID withheld', () => {
  assert.equal(liveFormGuid(GUID, {}), undefined);
});

test('VERCEL_ENV=preview: GUID withheld', () => {
  assert.equal(liveFormGuid(GUID, { VERCEL_ENV: 'preview' }), undefined);
});

test('VERCEL_ENV=production: GUID passed through', () => {
  assert.equal(liveFormGuid(GUID, { VERCEL_ENV: 'production' }), GUID);
});

test('PM_ALLOW_LIVE_FORMS=1: GUID passed through', () => {
  assert.equal(liveFormGuid(GUID, { PM_ALLOW_LIVE_FORMS: '1' }), GUID);
});

test('PM_ALLOW_LIVE_FORMS other than 1: GUID withheld', () => {
  assert.equal(liveFormGuid(GUID, { PM_ALLOW_LIVE_FORMS: 'true' }), undefined);
});
