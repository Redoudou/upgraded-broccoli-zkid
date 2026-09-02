import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionTranscript } from '../src/transcript.js';
import { sessionTranscript as issuerTranscript } from '../../../scripts/gen-test-mdl.js';
import { sessionTranscript as pageTranscript } from '../../prover-page/src/mdoc.js';

test('A11 session transcript is deterministic CBOR and identical in service, issuer script, and prover page', () => {
  const nonce = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex');
  const tr = sessionTranscript(nonce.toString('base64url'));
  assert.equal(tr.toString('hex'), '83f6f682' + '74' + Buffer.from('GreenLightHandoverv1').toString('hex') + '50' + nonce.toString('hex'));
  assert.equal(Buffer.from(issuerTranscript(nonce)).toString('hex'), tr.toString('hex'));
  assert.equal(Buffer.from(pageTranscript(new Uint8Array(nonce))).toString('hex'), tr.toString('hex'));
  assert.throws(() => sessionTranscript('short'), /16 bytes/);
});
