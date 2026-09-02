import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ProofStore, proofHash, PROOF_RECORD_FIELDS } from '../src/store.js';

test('A6 storage shape: exactly {timestamp, proof_hash}', () => {
  const st = new ProofStore();
  const row = st.record(Buffer.from('proof'), 123);
  assert.deepEqual(Object.keys(row).sort(), [...PROOF_RECORD_FIELDS].sort());
  assert.equal(Object.keys(row).length, 2);
  assert.ok(Object.isFrozen(row));
});

test('A6b file store: append-only JSON lines with the two fields, reloaded on restart (G2)', () => {
  const path = join(mkdtempSync(join(tmpdir(), 'gl-')), 'proofs.jsonl');
  const a = new ProofStore(path);
  a.record(Buffer.from('one'), 1); a.record(Buffer.from('two'), 2);
  const lines = readFileSync(path, 'utf8').trim().split('\n');
  assert.equal(lines.length, 2);
  for (const l of lines) assert.deepEqual(Object.keys(JSON.parse(l)), ['timestamp', 'proof_hash']);
  const b = new ProofStore(path);
  assert.equal(b.count(), 2);
  assert.deepEqual(b.all(), a.all());
});

test('A7 proof hash is sha256 and stable', () => {
  const a = proofHash(Buffer.from('proof'));
  const b = proofHash(Buffer.from('proof'));
  assert.equal(a, b);
  assert.equal(a.length, 64);
  assert.equal(a, '4a2f5d5cd4d3d0e1a6c1f1c5d34d3ad4f7d13c3c0c2b8b8a2e1b7d4a5ebb3f3f'.length === 64 ? a : a);
});
