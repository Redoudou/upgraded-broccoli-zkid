import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRequest, REQUESTED_ELEMENTS } from '../src/request.js';

test('D6 request asks for exactly age_over_21 and expiry_date, nothing retained', () => {
  const req = buildRequest('abc');
  const els = req.digital.requests[0].data.elements;
  assert.deepEqual(els.map(e => e.name).sort(), ['age_over_21', 'expiry_date']);
  assert.ok(els.every(e => e.intentToRetain === false));
  assert.equal(REQUESTED_ELEMENTS.length, 2);
  assert.equal(req.digital.requests[0].data.nonce, 'abc');
});
