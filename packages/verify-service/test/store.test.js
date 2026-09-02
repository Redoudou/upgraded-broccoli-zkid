import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ProofStore, proofHash, PROOF_RECORD_FIELDS } from '../src/store.js';

test('A6 storage shape: exactly {timestamp, proof_hash}', () => {
  const st = new ProofStore();
  const row = st.record(Buffer.from('proof'), 123);
  assert.deepEqual(Object.keys(row).sort(), [...PROOF_RECORD_FIELDS].sort());
  assert.equal(Object.keys(row).length, 2);
  assert.ok(Object.isFrozen(row));
});

test('A7 proof hash is sha256 and stable', () => {
  const a = proofHash(Buffer.from('proof'));
  const b = proofHash(Buffer.from('proof'));
  assert.equal(a, b);
  assert.equal(a.length, 64);
});
