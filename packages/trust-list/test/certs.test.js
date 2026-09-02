import { test } from 'node:test';
import assert from 'node:assert/strict';
import { X509Certificate } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { loadCertsDir, pemToDer } from '../src/certs.js';
import { buildTree } from '../src/merkle.js';

const repo = rel => new URL(`../../../${rel}`, import.meta.url);

test('E1b synthetic VICAL: fixtures/certs loads as DER IACA certs and hashes to fixtures/root.txt', () => {
  const certs = loadCertsDir(repo('fixtures/certs').pathname);
  assert.ok(certs.length >= 1);
  for (const c of certs) {
    const x = new X509Certificate(c.der);
    assert.ok(x.ca, `${c.name} must be a CA (IACA)`);
    assert.match(x.subject, /TEST/);
  }
  assert.equal(buildTree(certs.map(c => c.der)).root, readFileSync(repo('fixtures/root.txt'), 'utf8').trim());
});

test('E1c PEM and DER inputs give the same leaf', () => {
  const pem = readFileSync(repo('fixtures/certs/test-dmv-iaca.pem'), 'utf8');
  assert.equal(pemToDer(pem).toString('hex'), new X509Certificate(pem).raw.toString('hex'));
});
