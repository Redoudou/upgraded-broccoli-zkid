import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StubVerifier } from '../src/verifier.js';

const root = 'deadbeef';
const v = new StubVerifier({ root });

test('B1 (stub) valid proof is green', () => {
  assert.equal(v.verify({ proof: Buffer.from(`stub:n1:${root}`), nonce: 'n1', root, date: '2026-09-01' }).ok, true);
});
test('B4 (stub) wrong nonce is red', () => {
  assert.equal(v.verify({ proof: Buffer.from(`stub:n2:${root}`), nonce: 'n1', root, date: '2026-09-01' }).reason, 'nonce_mismatch');
});
test('B5/B6 (stub) wrong root is red', () => {
  assert.equal(v.verify({ proof: Buffer.from('stub:n1:other'), nonce: 'n1', root: 'other', date: '2026-09-01' }).reason, 'root_mismatch');
});
test('B8 (stub) garbage proof does not throw', () => {
  assert.equal(v.verify({ proof: Buffer.from([0, 255, 3]), nonce: 'n1', root, date: '2026-09-01' }).ok, false);
});
