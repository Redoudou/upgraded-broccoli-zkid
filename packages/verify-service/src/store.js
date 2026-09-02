// Copyright 2026 Green Light contributors. Apache-2.0.
// Proof record store. Exactly two fields per row: timestamp, proof_hash. Append-only JSON lines file
// (the one database SIMPLICITY.md allows) or memory when no path is given. Tests A6, A7, F1.
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const PROOF_RECORD_FIELDS = Object.freeze(['timestamp', 'proof_hash']);

export function proofHash(proofBytes) {
  return createHash('sha256').update(proofBytes).digest('hex');
}

export class ProofStore {
  #rows = [];
  #path;
  constructor(path = null) {
    this.#path = path;
    if (path && existsSync(path)) this.#rows = readFileSync(path, 'utf8').split('\n').filter(Boolean).map(l => Object.freeze(JSON.parse(l)));
    else if (path) mkdirSync(dirname(path), { recursive: true });
  }
  record(proofBytes, timestamp = Date.now()) {
    const row = Object.freeze({ timestamp, proof_hash: proofHash(proofBytes) });
    this.#rows.push(row);
    if (this.#path) appendFileSync(this.#path, JSON.stringify(row) + '\n');
    return row;
  }
  all() { return this.#rows.slice(); }
  count() { return this.#rows.length; }
}
