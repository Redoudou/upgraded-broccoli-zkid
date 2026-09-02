// Copyright 2026 Green Light contributors. Apache-2.0.
// Proof record store. Exactly two fields per row: timestamp, proof_hash. Tests A6, A7, F1.
import { createHash } from 'node:crypto';

export const PROOF_RECORD_FIELDS = Object.freeze(['timestamp', 'proof_hash']);

export function proofHash(proofBytes) {
  return createHash('sha256').update(proofBytes).digest('hex');
}

export class ProofStore {
  #rows = [];
  record(proofBytes, timestamp = Date.now()) {
    const row = Object.freeze({ timestamp, proof_hash: proofHash(proofBytes) });
    this.#rows.push(row);
    return row;
  }
  all() { return this.#rows.slice(); }
}
