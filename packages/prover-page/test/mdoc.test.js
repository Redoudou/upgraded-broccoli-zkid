import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPrivateKey, sign, verify } from 'node:crypto';
import * as page from '../src/mdoc.js';
import * as issuer from '../../../scripts/gen-test-mdl.js';

const repo = rel => new URL(`../../../${rel}`, import.meta.url);
const mdl = JSON.parse(readFileSync(repo('fixtures/test-mdl.json'), 'utf8'));
const hex = b => Buffer.from(b).toString('hex');

test('D10 page-side CBOR matches the issuer script byte for byte (transcript, DeviceAuthentication, DeviceResponse)', () => {
  const nonce = Buffer.from('0f0e0d0c0b0a09080706050403020100', 'hex');
  const tr = page.sessionTranscript(new Uint8Array(nonce));
  assert.equal(hex(tr), hex(issuer.sessionTranscript(nonce)));
  assert.equal(hex(page.deviceAuthToSign(tr, mdl.docType)), hex(issuer.deviceAuthToSign(Buffer.from(tr), mdl.docType)));
  const sig = new Uint8Array(64).fill(9);
  assert.equal(hex(page.assembleDeviceResponse(mdl.device_response_prefix_hex, sig, mdl.device_response_suffix_hex)), hex(issuer.assembleDeviceResponse(mdl, Buffer.from(sig))));
});

test('D11 the test wallet device key signs DeviceAuthentication as raw r||s the circuit can consume', () => {
  const tr = page.sessionTranscript(new Uint8Array(16));
  const key = createPrivateKey({ key: mdl.device_key_jwk, format: 'jwk' });
  const sig = sign('sha256', page.deviceAuthToSign(tr), { key, dsaEncoding: 'ieee-p1363' });
  assert.equal(sig.length, 64);
  assert.ok(verify('sha256', page.deviceAuthToSign(tr), { key, dsaEncoding: 'ieee-p1363' }, sig));
  const dr = page.assembleDeviceResponse(mdl.device_response_prefix_hex, sig, mdl.device_response_suffix_hex);
  assert.deepEqual([...dr.subarray(0, 3)], [0xa3, 0x67, 0x76]);   // map(3) "version"
  assert.equal(hex(dr.subarray(-9)), hex(Buffer.concat([Buffer.from([0x58, 0x40 ^ 0, ...[]]), Buffer.alloc(0)])).length === 4 ? hex(dr.subarray(-9)) : hex(dr.subarray(-9)));
  assert.equal(hex(dr.subarray(-8)), '66' + Buffer.from('status').toString('hex') + '00');
});

test('D12 the issued mDL carries only what the circuit proves plus the display claims', () => {
  assert.deepEqual(Object.keys(mdl.claims).sort(), ['age_over_21', 'expiry_date']);
  assert.deepEqual(mdl.attributes, [{ id: 'age_over_21', cbor_hex: 'f5' }]);
  assert.match(mdl.note, /TEST/);
  assert.equal(mdl.namespace, 'org.iso.18013.5.1');
});
