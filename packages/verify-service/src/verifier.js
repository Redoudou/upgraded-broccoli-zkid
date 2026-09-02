// Copyright 2026 Green Light contributors. Apache-2.0.
// Verifier boundary. Level 1 demo uses StubVerifier; M3/M4 replace it with the longfellow verifier.
// Public inputs are exactly: proof, nonce, root, verifier date. Test F5.

export class StubVerifier {
  constructor({ root }) { this.root = root; }
  // Level 1: accept a proof whose bytes are the UTF-8 string `stub:<nonce>:<root>`.
  verify({ proof, nonce, root, date }) {
    if (root !== this.root) return { ok: false, reason: 'root_mismatch' };
    const expected = Buffer.from(`stub:${nonce}:${root}`);
    if (!proof.equals(expected)) return { ok: false, reason: 'nonce_mismatch' };
    void date;
    return { ok: true };
  }
}

// M3/M4: export class LongfellowVerifier { verify({ proof, nonce, root, date }) { ... } }
