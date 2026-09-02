// Copyright 2026 Green Light contributors. Apache-2.0.
// Session store: 128-bit nonce, 60 s TTL, single use. Spec section 4. Tests A1-A5.
// Each session pins `now`, the verifier date the proof must be made for (public input, test A9).
import { randomBytes } from 'node:crypto';

export const SESSION_TTL_MS = 60_000;
export const isoSeconds = ms => new Date(ms).toISOString().slice(0, 19) + 'Z';

export class SessionStore {
  #sessions = new Map();
  #now;
  constructor({ now = () => Date.now() } = {}) { this.#now = now; }

  create() {
    const nonce = randomBytes(16).toString('base64url');
    const created_at = this.#now();
    const s = { nonce, created_at, expires_at: created_at + SESSION_TTL_MS, now: isoSeconds(created_at), used: false };
    this.#sessions.set(nonce, s);
    return { nonce, expires_at: s.expires_at, now: s.now };
  }

  // Returns { ok: true, session } or { ok: false, reason }.
  consume(nonce) {
    const s = this.#sessions.get(nonce);
    if (!s) return { ok: false, reason: 'session_unknown' };
    if (this.#now() > s.expires_at) return { ok: false, reason: 'session_expired' };
    if (s.used) return { ok: false, reason: 'session_used' };
    s.used = true;
    return { ok: true, session: s };
  }

  get(nonce) {
    const s = this.#sessions.get(nonce);
    return s && this.#now() <= s.expires_at ? s : null;
  }

  sweep() {
    const t = this.#now();
    for (const [k, s] of this.#sessions) if (t > s.expires_at + SESSION_TTL_MS) this.#sessions.delete(k);
  }
}
