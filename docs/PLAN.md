# Green Light — build plan

Source: [SPEC.md](../SPEC.md) v3. Start date: Monday 2026-08-31 (week 0). Team: 2 engineers plus a part-time convener for partner asks. Pilot-ready target: end of week 8 (2026-10-25). Pilot close: end of week 16 (2026-12-20).

Every milestone has a gate. A gate is a short written check against the definition of done in [DOD.md](DOD.md) and the tests in [TEST-PLAN.md](TEST-PLAN.md). Nothing starts the next milestone's exit gate until the previous one is signed, but work on later milestones may begin early where noted.

## The one rule

Over-engineering is the biggest risk. [SIMPLICITY.md](SIMPLICITY.md) hard-codes what we do not build and the size budgets CI enforces. Every gate below asks what can be removed before it asks what is done.

## Where each piece can run

[CLOUD-EXECUTION.md](CLOUD-EXECUTION.md) says, per component, whether it executes in a cloud sandbox, in GitHub Actions, or only on a phone, and what infrastructure it needs. It also lists the seven plan changes the component research forced.

[OPEN-BEFORE-M1.md](OPEN-BEFORE-M1.md) lists the fifteen facts an engineer still lacks before M1 and M2, and where each comes from.

## Where we are (2026-09-02)

A working level 2 prototype exists (README "Test it in five minutes"): real longfellow-zk proof in the browser from a test mDL issued by a test DMV, verified by the service, hash-only storage, Docker image. Against the map below: M0 done; M1 browser feasibility answered (ADR-0001, ADR-0007), device numbers pending; M2 done with SSE instead of a websocket; M3 done except the real wallet hand-off, device wipe tests, and reproducible build on two machines; M4 nonce statement found already in-circuit, membership on the fallback (ADR-0006); M5 synthetic VICAL and root, permanently (ADR-0009); M6 flow ready, waits on the phones; M7 Docker image and compose exist and are exercised in CI, no TLS domain or venue yet. CI on GitHub Actions is green since 2026-09-02; the scaffold's workflow files had invalid YAML and had never run. Open facts are in [OPEN-BEFORE-M1.md](OPEN-BEFORE-M1.md); items 1, 2, 3, 4, 12, 13 (element list), 14 are closed by the prototype.

The dates in the milestone table below assume a two-engineer team and partner replies landing on schedule; neither holds. Read them as sequencing (what depends on what), not as commitments. The one exception is AAMVA: it was never really a date risk, it is a decision — not pursued, permanently (ADR-0009).

## Milestone map

| # | Milestone | Weeks | Dates | Owner | Blocks |
|---|---|---|---|---|---|
| M0 | Repo, governance, partner asks out | 0 | Aug 31 – Sep 4 | convener + eng A | everything |
| M1 | Benchmark and go/no-go | 0–2 | Aug 31 – Sep 13 | eng B | M3, M6 |
| M2 | Demo level 1 (flow) | 1–3 | Sep 7 – Sep 20 | eng A | M3, M7 |
| M3 | Prover page | 2–5 | Sep 14 – Oct 4 | eng B | M6 |
| M4 | Circuit additions | 2–6 | Sep 14 – Oct 11 | eng B + longfellow/Dyne | M6, M8 |
| M5 | Trust-list pipeline and root publisher | 3–6 | Sep 21 – Oct 11 | eng A + Rarimo | M4 membership check, M8 |
| M6 | Demo level 2 (real proof on device) | 5–6 | Oct 5 – Oct 11 | both | M8 |
| M7 | Reference deployment, venue integration, legal memo | 6–8 | Oct 12 – Oct 25 | eng A + law firm + venue | M8 |
| M8 | Pilot-ready gate and audit | 8 | Oct 19 – Oct 25 | both + auditor | M9 |
| M9 | Live pilot and public report | 8–16 | Oct 26 – Dec 20 | both + PSE zkID | — |

Critical path: M1 → M3 → M6 → M8 → M9. The circuit additions in M4 are the schedule risk because they depend on an external team; the fallback (below) keeps M6 and M8 off that path.

---

## M0 — Repo, governance, partner asks out (week 0)

**Goal.** Nothing technical is blocked on a conversation we have not started.

**Deliverables**
- Repository under Apache-2.0 with the layout in [README.md](../README.md), CI running on every push.
- Five ADRs recording section 10 of the spec ([docs/adr](adr/)).
- The eight partner asks from spec section 5 sent, each with a named owner and a reply-by date. Tracked in [PARTNERS.md](PARTNERS.md).
- Toolchain check: Rust, wasm-pack, Xcode, Android SDK and Docker installed on the two build machines. Today's machine has Node and Python only.
- Test DMV: a P-256 issuer key and self-signed IACA certificate, plus a test mDL fixture ([scripts/gen-test-dmv.sh](../scripts/gen-test-dmv.sh)).

**Exit gate.** CI green on an empty test suite, fixtures generated and checked into `fixtures/`, all eight asks sent.

---

## M1 — Benchmark and go/no-go (weeks 0–2)

**Goal.** Answer spec decision 1: browser prover or native prover.

**Deliverables**
- longfellow-zk built from `main` at a recorded commit, in two runtimes: WASM (Safari on iPhone 13 and Chrome on Pixel 6) and Mopro native (iOS and Android).
- Bench harness in `bench/` that proves the test mDL 20 times per runtime per device and records wall time, peak memory, and failures.
- Benchmark report `bench/REPORT.md` with p50 and p95 per device and runtime.
- Go/no-go memo appended to ADR-0001.

**Decision rule**
- WASM p95 under 5 s on both devices and no Safari memory kill in 20 runs: browser path is primary, native is the fallback for older phones.
- WASM fails on either device: native primary, browser secondary, and M3 scope changes to the Mopro app shell.

**Exit gate.** Report published, ADR-0001 amended with the decision and the numbers.

---

## M2 — Demo level 1, the flow (weeks 1–3)

**Goal.** Everything except the proof is real. A desk screen shows a QR, a phone opens the page, a wallet-style sheet appears, the desk goes green, and the database holds only a hash and a timestamp.

**Deliverables**
- `packages/verify-service`: session creation with a 60 s nonce, QR payload, proof intake endpoint, verifier hook (stubbed here), websocket push of green/red, storage of `{timestamp, proof_hash}` only.
- `packages/desk-screen`: static page showing QR, session state, and result.
- `packages/prover-page` stub: opens from QR, shows a simulated wallet sheet, posts a stub proof.
- Demo label "Level 1 — flow, proof stubbed" visible on both screens.

**Exit gate.** End-to-end run on a laptop and a phone on the same network, DoD for M2 met, unit and integration tests in TEST-PLAN groups A and B green.

---

## M3 — Prover page (weeks 2–5)

**Goal.** The real guest path. Starts once M1 has picked the runtime.

**Deliverables**
- Digital Credentials API request for `age_over_21` and `expiry_date`, with the per-platform profile pinned (Chrome/Android now, Safari iOS 26).
- longfellow prover wired through Mopro (native) or WASM (browser) per the M1 decision.
- Proof upload to the verify service, then mdoc wipe: buffers zeroed, no copy in IndexedDB, localStorage, service-worker cache, or logs.
- Trust root fetched once from the HTTPS publisher and cached in the page (figure 1, dashed arrow; figure 2, step 5). The page never fetches per check.
- Static site, no third-party scripts, strict CSP, no analytics.
- Reproducible build: two independent builds produce the same hash, hash published in the release notes.
- Native fallback shell via Mopro if M1 chose native or if the older-iPhone fallback is kept.

**Exit gate.** Real proof from the test mDL on both devices, wipe verified by the memory test in TEST-PLAN group D, reproducible build check green in CI.

---

## M4 — Circuit additions (weeks 2–6)

**Goal.** Add the two statements longfellow does not prove today: the device-bound key signed the verifier nonce, and the issuer cert hash is a member of the published trust-list root.

**Deliverables**
- Fork or branch of longfellow with the two additions, or an upstream PR if the longfellow team takes them.
- Verifier side updated in `packages/verify-service` to supply nonce and root as public inputs and check them.
- Test vectors: valid proof, wrong nonce, replayed nonce, cert not in root, stale root.
- Written review from Google longfellow or Dyne.org on the additions.

**Fallback if the external team cannot land the changes by week 6.** Ship the pilot with the nonce checked outside the circuit (the wallet's device signature over the session transcript, verified in the clear by the verify service, which already receives it via ISO 18013-7) and trust-list membership checked outside the circuit against the published root. Both are weaker on privacy than the in-circuit version and must be labelled as such in the pilot report. Record the choice in ADR-0006.

**Exit gate.** Test vectors pass, review received, ADR-0006 written.

---

## M5 — Trust-list pipeline and root publisher (weeks 3–6)

**Goal.** A verifiable root of DMV issuer certificates exists in public for the first time.

**Deliverables**
- `packages/trust-list`: fetch AAMVA VICAL, parse issuer certs, build a Merkle tree of cert hashes, emit root plus inclusion proofs.
- HTTPS publication of root, tree, and a signed changelog.
- ERC-7812 publisher: writes the root to the registry from a multi-sig with a 24 h timelock. Signers: EEA, PSE, one DMV, per ADR-0003.
- Published root policy document.
- Pipeline runs on a synthetic VICAL containing the test DMV cert. This is permanent, not a placeholder for a pending AAMVA ask (ADR-0009): the convener is not pursuing AAMVA relying-party access, and no gate below depends on it arriving.

**Exit gate.** Root published to HTTPS and a testnet ERC-7812 slot from the synthetic VICAL, changelog entry present, timelock test in TEST-PLAN group E green.

---

## M6 — Demo level 2, real proof on device (weeks 5–6)

**Goal.** The sales tool and the PSE benchmark artifact. Same flow as level 1, proof is real, on a real iPhone and Pixel, still a test credential.

**Deliverables**
- Level 1 demo with the M3 prover and the M4 circuit (or its fallback) plugged in.
- On-screen timing of proof generation.
- Label "Level 2 — real proof, test credential" visible.
- Short recorded video and a one-page handout for venue conversations.

**Exit gate.** 20 consecutive green runs on each device with no failures, timing within the M1 numbers.

---

## M7 — Reference deployment, venue integration, legal memo (weeks 6–8)

**Deliverables**
- `deploy/`: Docker one-liner bringing up verify service, desk screen, and prover page behind TLS.
- Venue integration: desk screen on the two retail sites' hardware, staff runbook, plastic-card fallback documented.
- Legal memo from the law firm on whether a ZK age proof satisfies the age-verification obligation in the pilot state.
- Pilot metrics dashboard fed by the verify service (hash counts, failure rate, timing).

**Exit gate.** Fresh machine to running stack in one command in under ten minutes, memo received, venue sign-off on the runbook.

---

## M8 — Pilot-ready gate and audit (week 8)

This is the only milestone that is purely a gate. It is pass or fail on the following, all of which must be true.

1. longfellow security review reports have landed and the pilot builds against a reviewed 1.x tag, not `main` (spec decision 2).
2. Audit of the assembled stack complete: prover page, verify service, trust-list pipeline, deployment. Findings rated high or critical closed.
3. Legal memo received and does not block age-gated retail.
4. Named DMV contact confirmed.
5. Venue chain signed for two sites, hotel site confirmed as the hard case.
6. Privacy audit test (TEST-PLAN group F) shows zero PII in the venue database after a full demo run.
7. All M1 to M7 exit gates signed.

Real AAMVA VICAL access is not a gate item (ADR-0009): the trust-list root stays synthetic unless an external partner brings real access to us. A pilot on a synthetic root is a pilot with a labelled, permanent caveat, not a blocked pilot.

If any item fails, the pilot start slips and the plan is re-baselined. There is no partial pilot.

---

## M9 — Live pilot and public report (weeks 8–16)

**Deliverables**
- 8 weeks live at two retail sites and one hotel site, target 500 proofs.
- Weekly metrics against the spec section 9 table.
- Incident log with a 24 h response commitment.
- Public report co-published with PSE zkID, including the benchmark data, the failure analysis, the legal position, and the regulator letter.
- US mDL ZK profile contribution submitted through PSE zkID's ETSI and ISO channels (ADR-0005).

**Exit gate.** Report published, metrics table filled, decision recorded on whether to port the verifier onchain.

---

## Risk register

| Risk | From spec | Owner | Mitigation | Test |
|---|---|---|---|---|
| longfellow reviews slip past week 8 | 8, technical | convener | Ask for status in M0; if reviews are late, M8 fails and the pilot slips | M8 item 1 |
| Safari WASM memory kill on iPhone 13 | 8, technical | eng B | M1 decides early; native fallback | TEST C1 |
| Circuit additions not accepted upstream | 6, 2 | eng B | Fallback in M4 with labelled privacy trade-off | TEST B4, B5 |
| Real VICAL access never arrives | 7, 4 | convener | Not pursued by design (ADR-0009); synthetic VICAL is permanent, labelled in every demo and the pilot report | — |
| Revoked, unexpired license passes | 8, technical | — | Out of scope for pilot; stated in report and runbook | documented, not tested |
| Root publisher inserts a fake DMV | 8, trust | eng A | Multi-sig, 24 h timelock, public changelog | TEST E2, E3 |
| Plaintext mdoc lingers on the page | 8, trust | eng B | Wipe, CSP, static site, reproducible build | TEST D1–D4 |
| Regulator rejects ZK proof | 8, legal | law firm | Memo before pilot, letter as pilot deliverable | M8 item 3 |
| Guest opt-in below 30% | 9 | venue | Staff script, plastic fallback, signage | M9 weekly metric |
