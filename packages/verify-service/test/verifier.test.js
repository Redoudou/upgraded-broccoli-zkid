// B tests: the real longfellow-zk verifier (wasm) against the test mDL issued by the test DMV.
// One proof is generated in setup (~10 s in wasm on a laptop); the negative cases reuse it.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPrivateKey, generateKeyPairSync, randomBytes, sign, X509Certificate } from 'node:crypto';
import { LongfellowVerifier, StubVerifier, ATTRIBUTES } from '../src/verifier.js';
import { sessionTranscript } from '../src/transcript.js';
import { deviceAuthToSign, assembleDeviceResponse } from '../../../scripts/gen-test-mdl.js';
import { loadCertsDir } from '../../trust-list/src/certs.js';
import { loadLongfellow } from '../../circuits/longfellow.js';

const repo = rel => new URL(`../../../${rel}`, import.meta.url);
const root = readFileSync(repo('fixtures/root.txt'), 'utf8').trim();
const mdl = JSON.parse(readFileSync(repo('fixtures/test-mdl.json'), 'utf8'));
const iacaDers = loadCertsDir(repo('fixtures/certs').pathname).map(c => c.der);
const issuerCert = Buffer.from(mdl.issuer.ds_cert_der_b64, 'base64');
const date = new Date().toISOString().slice(0, 19) + 'Z';
let v, lf, circuit, nonce, proof;

before(async () => {
  lf = await loadLongfellow(readFileSync(repo('packages/circuits/artifacts/longfellow.wasm')));
  circuit = readFileSync(repo('packages/circuits/artifacts/circuit-1.zst'));
  v = new LongfellowVerifier({ root, iacaDers, lf, circuit });
  nonce = randomBytes(16).toString('base64url');
  const tr = sessionTranscript(nonce);
  const sig = sign('sha256', deviceAuthToSign(tr), { key: createPrivateKey({ key: mdl.device_key_jwk, format: 'jwk' }), dsaEncoding: 'ieee-p1363' });
  const attrs = mdl.attributes.map(a => ({ namespace: mdl.namespace, id: a.id, cbor: Buffer.from(a.cbor_hex, 'hex') }));
  proof = Buffer.from(lf.prove({ circuit, mdoc: assembleDeviceResponse(mdl, sig), pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript: tr, attrs, now: date }));
});

test('B1 valid proof from the test mDL is green', () => {
  assert.deepEqual(v.verify({ proof, nonce, root, date, issuerCert }), { ok: true });
});
test('B1b proof is ~340 KB and two proofs of one credential differ (F4 unlinkability)', () => {
  assert.ok(proof.length > 300_000 && proof.length < 400_000, `proof ${proof.length} bytes`);
  const tr = sessionTranscript(nonce);
  const sig = sign('sha256', deviceAuthToSign(tr), { key: createPrivateKey({ key: mdl.device_key_jwk, format: 'jwk' }), dsaEncoding: 'ieee-p1363' });
  const again = lf.prove({ circuit, mdoc: assembleDeviceResponse(mdl, sig), pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript: tr, attrs: ATTRIBUTES, now: date });
  assert.notEqual(Buffer.from(again).toString('hex'), proof.toString('hex'));
});
test('B2 tampered proof bytes are red with proof_invalid', () => {
  const bad = Buffer.from(proof); bad[12345] ^= 0x01;
  assert.deepEqual(v.verify({ proof: bad, nonce, root, date, issuerCert }), { ok: false, reason: 'proof_invalid' });
});
test('B3 verifier asks for age_over_21 = true; a statement of false does not verify', () => {
  const tr = sessionTranscript(nonce);
  const rc = lf.verify({ circuit, pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript: tr, attrs: [{ ...ATTRIBUTES[0], cbor: Uint8Array.of(0xf4) }], now: date, proof });
  assert.notEqual(rc, 0);
});
test('B4 wrong nonce (another session transcript) is red', () => {
  assert.deepEqual(v.verify({ proof, nonce: randomBytes(16).toString('base64url'), root, date, issuerCert }), { ok: false, reason: 'proof_invalid' });
});
test('B5 issuer cert not chained to a trust-list IACA is red with issuer_not_trusted', () => {
  // A self-signed cert with a fresh key: valid X.509, not issued by any listed IACA.
  const other = new X509Certificate(readFileSync(repo('fixtures/certs/test-dmv-iaca.pem')));   // the IACA itself is not a DS cert issued by an IACA
  assert.deepEqual(v.verify({ proof, nonce, root, date, issuerCert: other.raw }), { ok: false, reason: 'issuer_not_trusted' });
  const bogus = generateKeyPairSync('ec', { namedCurve: 'P-256' }).publicKey.export({ type: 'spki', format: 'der' });
  assert.deepEqual(v.verify({ proof, nonce, root, date, issuerCert: bogus }), { ok: false, reason: 'issuer_cert_invalid' });
});
test('B6 root mismatch is red before any cryptography runs', () => {
  assert.deepEqual(v.verify({ proof, nonce, root: 'ff'.repeat(32), date, issuerCert }), { ok: false, reason: 'root_mismatch' });
  assert.throws(() => new LongfellowVerifier({ root: 'ff'.repeat(32), iacaDers, lf, circuit }), /does not hash/);
});
test('B7 verifier date outside the MSO validity window is red', () => {
  assert.deepEqual(v.verify({ proof, nonce, root, date: '2020-01-01T00:00:00Z', issuerCert }), { ok: false, reason: 'issuer_not_trusted' });   // DS cert not yet valid either
  const tr = sessionTranscript(nonce);
  const rc = lf.verify({ circuit, pkx: mdl.issuer.pkx, pky: mdl.issuer.pky, transcript: tr, attrs: ATTRIBUTES, now: '2040-01-01T00:00:00Z', proof });
  assert.notEqual(rc, 0);
});
test('B8 truncated, empty, and garbage proofs are red without throwing', () => {
  for (const p of [proof.subarray(0, 1000), Buffer.alloc(0), randomBytes(5000), Buffer.alloc(proof.length, 7)]) {
    assert.deepEqual(v.verify({ proof: p, nonce, root, date, issuerCert }), { ok: false, reason: 'proof_invalid' });
  }
});
test('B9 verification time is recorded', () => {
  const t = performance.now(); v.verify({ proof, nonce, root, date, issuerCert });
  console.log(`  verify took ${Math.round(performance.now() - t)} ms (wasm, this machine)`);
});
test('F5 verifier reads only proof, nonce, root, date, issuer cert', () => {
  const seen = new Set();
  const spy = new Proxy({ proof, nonce, root, date, issuerCert, extra: 'ignored' }, { get(t, k) { seen.add(k); return t[k]; } });
  assert.equal(v.verify(spy).ok, true);
  assert.deepEqual([...seen].sort(), ['date', 'issuerCert', 'nonce', 'proof', 'root']);
});
test('B1 (stub, level 1) valid stub proof is green, wrong nonce and root are red', () => {
  const s = new StubVerifier({ root });
  assert.equal(s.verify({ proof: Buffer.from(`stub:n1:${root}`), nonce: 'n1', root }).ok, true);
  assert.equal(s.verify({ proof: Buffer.from(`stub:n2:${root}`), nonce: 'n1', root }).reason, 'nonce_mismatch');
  assert.equal(s.verify({ proof: Buffer.from('x'), nonce: 'n1', root: 'other' }).reason, 'root_mismatch');
});
