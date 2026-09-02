# Definition of done

Two layers. The global definition applies to every change. The milestone definitions are the exit criteria named in [PLAN.md](PLAN.md).

## Global — every merged change

- Within the budgets in [SIMPLICITY.md](SIMPLICITY.md); `scripts/simplicity-check.sh` passes. A new dependency, package, service, table, or workflow carries a one-line reason it cannot be avoided.

- Code is under Apache-2.0 with the header present on new files.
- CI green: lint, unit tests, integration tests, reproducible-build check where the package is the prover page.
- No new dependency without a one-line justification in the PR and a licence compatible with Apache-2.0.
- No PII field in any log line, database column, metric, or error message. Reviewer checks this explicitly.
- No third-party script or network call from the prover page. CSP test enforces it.
- Public interfaces documented in the package README.
- A test exists for each new behaviour, and a negative test for each new check (wrong nonce, wrong root, expired session, and so on).
- Reviewed by the other engineer. Security-relevant changes (verifier logic, wipe, trust-list publisher, circuit) also get a written note from the reviewer stating what they checked.

## M0 — Repo, governance, partner asks

- Repo builds and tests from a fresh clone with the documented toolchain.
- ADR-0001 to ADR-0005 present, each with context, decision, and consequences.
- `fixtures/` contains the test DMV cert, key, and a test mDL, regenerable by one script.
- PARTNERS.md lists the eight asks with owner, date sent, reply-by date.

## M1 — Benchmark

- longfellow commit hash recorded in `bench/REPORT.md`.
- 20 runs per runtime per device, no cherry-picking; failed runs counted, not dropped.
- p50, p95, peak memory reported per device and runtime.
- Decision written into ADR-0001 with the numbers that justify it.
- Bench harness re-runnable by someone who was not there.

## M2 — Demo level 1

- Session nonce is 128 bits from a CSPRNG, expires at 60 s, single use.
- Desk screen goes green within 1 s of the verify service accepting a proof, red on any failure, and back to waiting when the session expires.
- Database schema has exactly two columns for proof records: `timestamp` and `proof_hash`. Migration test asserts this.
- Demo level label visible on both desk and phone.
- Runs on a laptop and a phone on the same network with one command.

## M3 — Prover page

- DC API request asks for exactly `age_over_21` and `expiry_date` and nothing else. Test asserts the request object.
- Proof generated on both benchmark devices from the test mDL.
- After proof upload, the mdoc is unreachable: heap snapshot, IndexedDB, localStorage, Cache Storage, and console contain no mdoc bytes or fields. Test D1–D4.
- CSP: `default-src 'self'`, no `unsafe-inline`, no `unsafe-eval` except the WASM allowance if required, no `connect-src` beyond the verify service and trust-root origins.
- Two independent builds on different machines produce identical output hashes; the hash is in the release notes.
- Page works with JavaScript only from its own origin; loading it with the verify service down shows an honest error, not a spinner.

## M4 — Circuit additions

- Circuit accepts a valid proof from the test mDL with the correct nonce and a cert in the root.
- Circuit rejects: wrong nonce, replayed nonce, cert absent from root, root mismatch, tampered MSO signature, `age_over_21` false, expiry before the verifier date.
- Proving time increase over baseline longfellow measured and reported; if p95 crosses 5 s the M1 decision is revisited.
- Written review from the longfellow or Dyne team on the additions, or ADR-0006 recording the fallback and its privacy trade-off.

## M5 — Trust-list pipeline

- Given a VICAL file, the pipeline produces a deterministic root; same input, same root, on two machines.
- Inclusion proof verifies for every cert in the input; a cert not in the input fails.
- Root, tree, and changelog served over HTTPS with a detached signature.
- ERC-7812 write goes through the multi-sig; a single signer cannot publish. Timelock of 24 h enforced and tested on a testnet.
- Root policy document published: who signs, how a DMV is added or removed, how an emergency removal works.

## M6 — Demo level 2

- 20 consecutive green runs per device, zero failures.
- On-screen proof time matches the bench harness within 20%.
- Label "Level 2 — real proof, test credential" visible.
- Video and one-page handout exist.

## M7 — Reference deployment, venue, legal

- One command from a clean machine to a running stack with TLS in under ten minutes, documented and timed.
- Staff runbook covers: normal flow, red result, session expiry, phone without mDL, plastic-card fallback, and who to call.
- Legal memo received in writing.
- Metrics dashboard shows proof count, failure rate, p95 proving time, and nothing per-guest.

## M8 — Pilot-ready

All eight gate items in PLAN.md M8 are true, each with a link to the evidence. No exceptions and no partial pilot.

## M9 — Pilot

- Every spec section 9 metric has a measured value in the report.
- Every failure in the 8 weeks is in the incident log with a cause.
- Report co-published with PSE zkID.
- Standards contribution submitted.
