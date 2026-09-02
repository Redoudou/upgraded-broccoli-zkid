import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRequest, REQUESTED_ELEMENTS } from '../src/request.js';
import { ATTRIBUTES } from '../../verify-service/src/verifier.js';

test('D6 request asks for exactly age_over_21, nothing retained, and matches what the verifier checks', () => {
  const req = buildRequest('abc');
  const els = req.digital.requests[0].data.elements;
  assert.deepEqual(els.map(e => e.name), ['age_over_21']);
  assert.ok(els.every(e => e.intentToRetain === false));
  assert.equal(REQUESTED_ELEMENTS.length, 1);
  assert.deepEqual(ATTRIBUTES.map(a => a.id), [...REQUESTED_ELEMENTS]);
  assert.equal(req.digital.requests[0].data.nonce, 'abc');
});
