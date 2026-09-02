import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SessionStore, SESSION_TTL_MS } from '../src/session.js';

test('A1 create session: 128-bit base64url nonce, 60 s TTL', () => {
  let t = 1_000_000;
  const s = new SessionStore({ now: () => t });
  const { nonce, expires_at } = s.create();
  assert.equal(Buffer.from(nonce, 'base64url').length, 16);
  assert.match(nonce, /^[A-Za-z0-9_-]+$/);
  assert.equal(expires_at, t + SESSION_TTL_MS);
});

test('A2 nonce entropy: 10000 sessions, no collision', () => {
  const s = new SessionStore();
  const seen = new Set();
  for (let i = 0; i < 10_000; i++) seen.add(s.create().nonce);
  assert.equal(seen.size, 10_000);
});

test('A3 expired session rejected at 61 s', () => {
  let t = 0;
  const s = new SessionStore({ now: () => t });
  const { nonce } = s.create();
  t = 61_000;
  assert.deepEqual(s.consume(nonce), { ok: false, reason: 'session_expired' });
});

test('A3b session still valid at 60 s exactly', () => {
  let t = 0;
  const s = new SessionStore({ now: () => t });
  const { nonce } = s.create();
  t = 60_000;
  assert.equal(s.consume(nonce).ok, true);
});

test('A4 replay: second consume rejected', () => {
  const s = new SessionStore();
  const { nonce } = s.create();
  assert.equal(s.consume(nonce).ok, true);
  assert.deepEqual(s.consume(nonce), { ok: false, reason: 'session_used' });
});

test('A5 unknown nonce rejected', () => {
  const s = new SessionStore();
  assert.deepEqual(s.consume('nope'), { ok: false, reason: 'session_unknown' });
});
