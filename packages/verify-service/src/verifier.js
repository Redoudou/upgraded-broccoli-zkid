// Copyright 2026 Green Light contributors. Apache-2.0.
// Verifier boundary. Inputs: proof, nonce, root, date, and (ADR-0006 fallback) the issuer's document
// signer certificate. Output: { ok } or { ok: false, reason } with a reason code and nothing else.
// LongfellowVerifier runs Google longfellow-zk's mdoc verifier from packages/circuits (wasm) and checks
// the issuer chain against the Merkle trust root in the clear. StubVerifier is level 1.
import { X509Certificate } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { buildTree, inclusionProof, verifyInclusion } from '../../trust-list/src/merkle.js';
import { loadLongfellow } from '../../circuits/longfellow.js';
import { sessionTranscript } from './transcript.js';

export const ATTRIBUTES = Object.freeze([{ namespace: 'org.iso.18013.5.1', id: 'age_over_21', cbor: Uint8Array.of(0xf5) }]);

export class StubVerifier {
  constructor({ root }) { this.root = root; }
  // Level 1: accept a proof whose bytes are the UTF-8 string `stub:<nonce>:<root>`.
  verify({ proof, nonce, root }) {
    if (root !== this.root) return { ok: false, reason: 'root_mismatch' };
    if (!proof.equals(Buffer.from(`stub:${nonce}:${root}`))) return { ok: false, reason: 'nonce_mismatch' };
    return { ok: true };
  }
}

export class LongfellowVerifier {
  #lf; #circuit; #tree; #iacas;
  constructor({ root, iacaDers, lf, circuit }) {
    this.root = root; this.#lf = lf; this.#circuit = circuit;
    this.#tree = buildTree(iacaDers);
    if (this.#tree.root !== root) throw new Error('trust list does not hash to the configured root');
    this.#iacas = iacaDers.map(der => ({ der, cert: new X509Certificate(der) }));
  }

  static async create({ root, iacaDers, artifactsDir = new URL('../../circuits/artifacts/', import.meta.url) }) {
    const lf = await loadLongfellow(readFileSync(new URL('longfellow.wasm', artifactsDir)));
    const circuit = readFileSync(new URL('circuit-1.zst', artifactsDir));
    return new LongfellowVerifier({ root, iacaDers, lf, circuit });
  }

  // Which trusted IACA issued this document-signer cert, if any. Learns the issuer: ADR-0006 fallback.
  #issuerOf(dsCert, date) {
    if (dsCert.ca) return null;   // a document signer is an end-entity certificate, never the IACA itself
    const iaca = this.#iacas.find(i => dsCert.checkIssued(i.cert) && dsCert.verify(i.cert.publicKey));
    if (!iaca) return null;
    if (!verifyInclusion(this.root, iaca.der, inclusionProof(this.#tree, iaca.der))) return null;
    const t = Date.parse(date);
    if (t < Date.parse(dsCert.validFrom) || t > Date.parse(dsCert.validTo)) return null;
    return iaca;
  }

  verify({ proof, nonce, root, date, issuerCert }) {
    if (root !== this.root) return { ok: false, reason: 'root_mismatch' };
    let ds;
    try { ds = new X509Certificate(issuerCert); } catch { return { ok: false, reason: 'issuer_cert_invalid' }; }
    if (!this.#issuerOf(ds, date)) return { ok: false, reason: 'issuer_not_trusted' };
    const { x, y } = ds.publicKey.export({ format: 'jwk' });
    if (!x || !y) return { ok: false, reason: 'issuer_cert_invalid' };
    const hex = b => '0x' + Buffer.from(b, 'base64url').toString('hex');
    let rc;
    try {
      rc = this.#lf.verify({ circuit: this.#circuit, pkx: hex(x), pky: hex(y), transcript: sessionTranscript(nonce), attrs: ATTRIBUTES, now: date, proof });
    } catch { return { ok: false, reason: 'proof_invalid' }; }
    return rc === 0 ? { ok: true } : { ok: false, reason: 'proof_invalid' };
  }
}
