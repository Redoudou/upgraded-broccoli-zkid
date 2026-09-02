import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, inclusionProof, verifyInclusion } from '../src/merkle.js';

const certs = ['dmv-ca', 'dmv-ny', 'dmv-tx', 'dmv-az', 'dmv-co'].map(s => Buffer.from(s));

test('E1 determinism: order-independent, stable root', () => {
  const a = buildTree(certs).root;
  const b = buildTree([...certs].reverse()).root;
  const c = buildTree([...certs, certs[0]]).root; // duplicate ignored
  assert.equal(a, b); assert.equal(a, c);
});

test('E4 inclusion proofs verify for every cert; random cert fails', () => {
  const t = buildTree(certs);
  for (const c of certs) assert.equal(verifyInclusion(t.root, c, inclusionProof(t, c)), true);
  assert.equal(inclusionProof(t, Buffer.from('fake-dmv')), null);
  assert.equal(verifyInclusion(t.root, Buffer.from('fake-dmv'), inclusionProof(t, certs[0])), false);
});

test('E6 empty list fails closed', () => {
  assert.throws(() => buildTree([]), /empty/);
});

test('E7 changed input changes root', () => {
  assert.notEqual(buildTree(certs).root, buildTree([...certs, Buffer.from('dmv-wa')]).root);
});
