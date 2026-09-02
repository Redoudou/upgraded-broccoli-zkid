# verify-service

Spec section 4. `POST /session` → 60 s single-use nonce and the verifier date `now` → QR → `POST /proof` → longfellow verify + trust-root check → green/red pushed to the desk over Server-Sent Events → append `{timestamp, proof_hash}`.

## Routes

| Route | Purpose |
|---|---|
| `POST /session` | `{nonce, expires_at, now, url, demo_level, label}`. `url` is the prover page with `?n=<nonce>`; derived from the Host header, or `PUBLIC_URL` |
| `GET /session/:nonce` | `{now, expires_at, demo_level, label}` for the prover page; 404 once expired |
| `GET /qr/:nonce.svg` | QR of the prover URL (the one npm dependency, `qrcode`) |
| `GET /events/:nonce` | SSE: `{"result":"waiting"}` then `{"result":"green"}` or `{"result":"red","reason":…}`; test A8 |
| `POST /proof` | `{nonce, proof_b64, issuer_cert_b64}` → `{result}`; 400 with a reason code on any rejection |
| `GET /root` | the pinned trust root (hex) |
| `GET /health` | `{ok, demo_level, root, proofs}` |
| `/`, `/desk.*`, `/prove`, `/prove/*` | desk screen, prover page, prover artifacts, `fixtures/test-mdl.json` as `/prove/test-mdl.json` |

Reason codes: `session_unknown`, `session_expired`, `session_used`, `root_mismatch`, `issuer_cert_invalid`, `issuer_not_trusted`, `proof_invalid`, and `nonce_mismatch` (level 1 stub). No proof bytes, no certificate, no credential field ever appears in a response, log line, or the store.

## Configuration (environment)

`PORT` (8080), `DEMO_LEVEL` (`2` real proof, `1` stub), `TRUST_ROOT` (default `fixtures/root.txt`), `CERTS_DIR` (default `fixtures/certs`, the synthetic VICAL that must hash to the root), `DATA_FILE` (default `data/proofs.jsonl`), `PUBLIC_URL` (base URL for QR links behind a proxy).

## Verifier

`LongfellowVerifier` loads `packages/circuits/artifacts/longfellow.wasm` and `circuit-1.zst` once. Inputs are exactly proof, nonce, root, date, and the issuer's document-signer certificate (ADR-0006 fallback: the service learns which issuer signed). It checks, in order: root pin; the DS certificate is an end-entity cert issued and signed by an IACA whose leaf is in the Merkle root, and valid on the verifier date; then `run_mdoc_verifier(circuit, pkx, pky, SessionTranscript(nonce), [age_over_21 = true], now, docType, proof)`. `StubVerifier` (level 1) accepts the bytes `stub:<nonce>:<root>`.

Verification runs synchronously in wasm, about 4 s on a slow machine and 1 to 2 s on a laptop. Sessions are single use, so this is fine for a desk; a native verifier (`packages/circuits/longfellow-wasm` builds the `lf` binary) is the upgrade path if throughput matters (B9).

## Tests

`npm test`: A1 to A7 and A11 (sessions, store, transcript parity), B1 to B9 and F5 against the real verifier with a proof generated in setup, plus the level 1 stub. About 40 s because one proof is generated in wasm.
