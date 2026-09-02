# Test plan

Groups A to G. Each test has an id used in [PLAN.md](PLAN.md) and [DOD.md](DOD.md). Automated tests live next to their package; device and manual tests are scripted in `bench/` and this file.

Runtimes: unit and integration on CI (Linux, Node 24, Rust stable). Device tests on iPhone 13 (Safari, iOS 26) and Pixel 6 (Chrome, Android 16), both physical, both kept in the office. Simulators are not accepted for any timing or memory result.

## A — Verify service (unit)

| Id | Test | Expect |
|---|---|---|
| A1 | Create session | 128-bit nonce, base64url, `expires_at = now + 60 s` |
| A2 | Nonce entropy | 10 000 sessions, no collision, all distinct |
| A3 | Expired session | proof submitted at 61 s is rejected with `session_expired` |
| A4 | Replay | second proof on the same session is rejected with `session_used` |
| A5 | Unknown session | proof for a nonce never issued is rejected |
| A6 | Storage shape | after an accepted proof the row is exactly `{timestamp, proof_hash}` |
| A7 | Proof hash | `proof_hash = sha256(proof_bytes)`, stable across runs |
| A8 | Result push | the desk receives `green` within 1 s of acceptance, `red` on any rejection with a reason code and no proof contents. Carried over Server-Sent Events, not a websocket: same latency, no handshake code, no dependency (verified end to end in headless Chromium 2026-09-02) |
| A9 | Verifier date | the verifier supplies today's date as the public input; a proof for an expired credential is red |
| A10 | Root pin | service refuses to start if the configured root is missing or unsigned |
| A11 | Transcript parity | `SessionTranscript(nonce)` is byte-identical in the verify service, the issuer script, and the prover page |

## B — Proof verification (integration, longfellow verifier)

| Id | Test | Expect |
|---|---|---|
| B1 | Valid proof from test mDL | green |
| B2 | Tampered MSO signature | red, `issuer_sig_invalid` |
| B3 | `age_over_21` false in the test mDL | red, `age_check_failed` |
| B4 | Wrong nonce in proof | red, `nonce_mismatch` (in-circuit) or `device_sig_invalid` (fallback) |
| B5 | Issuer cert not in root | red, `issuer_not_trusted` |
| B6 | Stale root (previous epoch) | red until grace window policy says otherwise; policy is a test input |
| B7 | Expiry equal to verifier date | red (strictly greater required) |
| B8 | Proof bytes truncated or bit-flipped | red, no crash, no stack trace to the client |
| B9 | Verifier throughput | 100 proofs verified sequentially, p95 under 500 ms on the CI runner. Today: ~4 s per proof in wasm on a slow sandbox; native `lf` is the upgrade path (ADR-0008) |

Status 2026-09-02: B1 to B8 and F5 run against the real longfellow verifier with a proof generated from the test mDL in test setup (`packages/verify-service/test/verifier.test.js`). B3 and B7 are asserted at the wasm boundary (a false attribute value or an out-of-window date does not verify); the service-level reason code for both is `proof_invalid`. B5 covers a CA certificate presented as a document signer and a bogus certificate.

## C — Prover benchmark (device)

| Id | Test | Expect |
|---|---|---|
| C1 | Safari WASM iPhone 13, 20 runs | p95 under 5 s, zero memory kills; else browser path is not primary |
| C2 | Chrome WASM Pixel 6, 20 runs | p95 under 5 s |
| C3 | Mopro native iOS, 20 runs | recorded for comparison |
| C4 | Mopro native Android, 20 runs | recorded for comparison |
| C5 | Cold start | first proof after page load included in C1/C2, not excluded |
| C6 | Circuit additions overhead | C1 and C2 re-run after M4; delta reported |

Method: the harness in `bench/` loads the test mDL from a fixture, runs the prover N times, records `performance.now()` deltas and `performance.memory` or native equivalents, and writes JSON. Report is generated from the JSON, never hand-typed.

## D — Prover page privacy and integrity

| Id | Test | Expect |
|---|---|---|
| D1 | Heap after wipe | Chrome DevTools heap snapshot after proof upload contains no mdoc field values (search for the test mDL's known strings and CBOR bytes) |
| D2 | Storage after wipe | IndexedDB, localStorage, sessionStorage, Cache Storage all empty of mdoc bytes |
| D3 | Console and network | no mdoc bytes in console output or in any request other than the proof POST |
| D4 | Service worker | no cached response containing the mdoc |
| D5 | CSP | page loads with the strict CSP; injecting an inline script or a cross-origin fetch is blocked (Playwright) |
| D6 | DC API request shape | the `navigator.credentials.get()` request object requests exactly `age_over_21` and `expiry_date` |
| D7 | Reproducible build | CI builds twice on separate runners; hashes equal; a deliberate one-byte change breaks equality |
| D8 | Offline verify service | page shows an error state, does not retry indefinitely, does not keep the mdoc while waiting |
| D9 | Third-party requests | Playwright network log shows requests to the page origin, the verify service, and the trust-root publisher only; the root is fetched at most once per page load |
| D10 | CBOR parity | page-side `SessionTranscript`, `DeviceAuthentication` Sig_structure, and DeviceResponse assembly are byte-identical to the issuer script |
| D11 | Device signature | the test wallet's device key signs as raw r\|\|s (64 bytes) the circuit consumes |
| D12 | Issued fixture | the test mDL carries only the display claims and the one proven attribute |

## E — Trust-list pipeline and root publisher

| Id | Test | Expect |
|---|---|---|
| E1 | Determinism | same VICAL input on two machines gives the same root |
| E1b | Synthetic VICAL | `fixtures/certs` loads as CA (IACA) certificates and hashes to `fixtures/root.txt`; PEM and DER give the same leaf |
| E2 | Single signer cannot publish | ERC-7812 write from one key reverts on testnet |
| E3 | Timelock | root update queued, not effective before 24 h, effective after; tested with testnet time travel |
| E4 | Inclusion proofs | every cert in the input verifies; a random cert does not |
| E5 | Changelog | every root change has a signed changelog entry with the diff of issuer certs |
| E6 | Malformed VICAL | pipeline fails closed and does not publish |
| E7 | Refresh | a changed VICAL produces a new root and a changelog entry; an unchanged one produces nothing |

## F — Privacy audit (end to end)

Run before M8 and again at the end of M9.

| Id | Test | Expect |
|---|---|---|
| F1 | Full demo run then dump the database | zero PII: no name, DOB, address, license number, photo, issuer identity beyond what the root implies |
| F2 | Log scan | grep of all service logs for the test mDL's field values finds nothing |
| F3 | Metrics scan | dashboard and metrics store contain counts and timings only |
| F4 | Linkability | two proofs from the same test mDL produce different proof hashes and the database cannot link them |
| F5 | Verifier-learns-nothing | the verify service's inputs are the proof, nonce, root, date; test asserts no other request field is read |

## G — Deployment and operations

| Id | Test | Expect |
|---|---|---|
| G1 | One-liner | clean VM to running stack with TLS in under ten minutes, timed in CI on a nightly job |
| G2 | Restart | service restart does not lose the configured root or drop in-flight sessions ungracefully |
| G3 | Clock skew | verifier clock 5 minutes fast or slow; expiry check still strict, session TTL still 60 s wall-clock |
| G4 | Load | 50 concurrent sessions, all resolve, no cross-talk between sessions |
| G5 | Runbook drill | a staff member with the runbook and no engineer handles: red result, expired session, phone without mDL |

## Pilot metrics (M9, weekly)

| Metric | Target | Source |
|---|---|---|
| Proof p95, iPhone 13 / Pixel 6 | under 5 s | bench harness on the pilot build, plus on-page timing sent as a number only |
| Verification failure on valid license | under 2% | verify service red count with reason codes, cross-checked with staff log |
| Guest opt-in when offered | over 30% | staff tally sheet, no guest identifiers |
| PII in venue database after audit | 0 | F1 to F3 at pilot end |
| Staff time vs plastic card | equal or less | stopwatch sample, 30 transactions each way |

## What is not tested and why

- Revocation of an individual license: no ZK-ready status list exists. Stated in the report.
- Real state-issued mDL from Apple or Google Wallet before M8: needs AAMVA access and a registered relying party. Test mDL is used until then and the report says so.
- Onchain verification: not in the pilot.
