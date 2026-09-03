# Green Light

Zero-knowledge proof of a US driver's license, generated on the guest's phone, accepted by any venue. A venue learns "over 21, license valid, issued by a real DMV" and nothing else. Apache-2.0.

**Status (2026-09-02): working prototype, demo level 2.** A real longfellow-zk proof is generated in the phone's browser from a test mDL issued by a test DMV, verified by the venue service, and the venue database holds a timestamp and a proof hash. What is still simulated is the wallet: a state-issued mDL from Apple or Google Wallet needs a registered relying party, so the page ships a test wallet holding a test credential. CI runs the tests, the artifact hash check, the reproducible page build, and the Docker image on every push.

**See it without installing anything:** [interactive walkthrough](https://claude.ai/code/artifact/c9ee1a2c-687a-4364-84d0-a1cd5aee2610) — a fictional, simulated front end of the desk screen and the guest's phone, built from this prototype's real copy and timing. Useful for partner and venue conversations; not a substitute for `make demo`.

## Test it in five minutes

Needs Node 24 (22 works) and openssl. No Rust, no Docker, no phone required; a phone on the same Wi-Fi makes it real.

```bash
git clone <this repo> && cd upgraded-broccoli-zkid
make demo
```

1. Open the printed **desk URL** (`http://<your LAN IP>:8080/`) on the laptop. That is the venue's desk screen: a QR that renews every 60 seconds.
2. **Phone:** scan the QR with the camera. The prover page opens, shows what the venue will and will not learn, and offers a simulated wallet sheet.
   **No phone:** click the link under the QR to open the prover page in another tab.
3. Tap **Share with the venue**, then **Continue**. The page signs the session with the credential's device key, runs Google's longfellow-zk prover in WebAssembly on the phone (2 to 10 s depending on the phone), uploads the 336 KB proof, and wipes the credential.
4. The desk goes **green** within a second of the proof arriving. `data/proofs.jsonl` gains one line: `{"timestamp":…,"proof_hash":"…"}`.

Try the failure paths: wait past 60 s before tapping Continue (red, session expired); reload the phone page and share again on the same QR (red, session used).

Level 1, the same flow with the proof stubbed, is `make demo1`. Docker: `cd deploy && docker compose up --build`, then open port 80; set `SITE_ADDRESS=your.domain` for TLS.

## What is real and what is not

| Piece | Prototype | Note |
|---|---|---|
| Session nonce, QR, 60 s single-use, push to desk, hash-only storage | real | Server-Sent Events carry the result; see `docs/TEST-PLAN.md` A8 |
| Zero-knowledge proof | real | Google longfellow-zk, Rust port, commit in `packages/circuits/LONGFELLOW_COMMIT`, current circuit version 8, one attribute |
| Proof made on the guest's device | real | WebAssembly in a Web Worker; the credential never leaves the page |
| Statement proven | real | `age_over_21 = true` in an MSO whose issuer signature verifies under the issuer key, whose validity window contains the verifier's date, and whose device key signed this session's transcript |
| Issuer is a DMV on the trust list | real, in the clear | The page sends the document-signer certificate with the proof; the service checks it chains to an IACA in the Merkle root. The venue learns which issuer. In-circuit membership is M4 (ADR-0006) |
| Credential | test | Issued by the test DMV in `fixtures/`; a real mDL needs AAMVA trust-list access and a relying-party registration |
| Wallet hand-off | simulated | The Digital Credentials API request shape exists (`packages/prover-page/src/request.js`); the OS wallet sheet is a page element |
| `expiry_date` | not proven | The circuit checks the MSO validity window; disclosing `expiry_date` itself would leak a value, so it is not requested |

## MVP now, production later

What you can see today: real proof, real verify logic, real hash-only storage, one command to run it. Three things stand between this and production, none of them engineering:

1. **Trust list.** The venue trusts a real DMV, not a test one. Needs AAMVA VICAL access or a DMV publishing its own root — not something this team is pursuing (ADR-0009). The demo's trust list is synthetic, permanently, not "not yet real."
2. **Wallet.** The credential comes from Apple or Google Wallet, not a test wallet baked into the page. Needs a registered relying party with each vendor.
3. **Legal sign-off.** A law firm confirms a ZK proof satisfies the age-verification statute in whatever state runs the pilot. Not started.

Everything else — the proof, the verifier, the circuit, the deployment — already works.

## Documents

- [SPEC.md](SPEC.md) — spec v3, the source of truth
- [docs/PLAN.md](docs/PLAN.md) — milestones M0 to M9, dates, gates, risk register
- [docs/DOD.md](docs/DOD.md) — definition of done, global and per milestone
- [docs/TEST-PLAN.md](docs/TEST-PLAN.md) — test groups A to G and pilot metrics
- [docs/CLOUD-EXECUTION.md](docs/CLOUD-EXECUTION.md) — what runs in a cloud sandbox, in Actions, or only on a phone
- [docs/SIMPLICITY.md](docs/SIMPLICITY.md) — the one rule and the budgets CI enforces
- [docs/components/](docs/components/README.md) — verified notes on every component we assemble
- [docs/SPEC-NOTES.md](docs/SPEC-NOTES.md) — where spec v3 disagrees with the evidence
- [docs/PARTNERS.md](docs/PARTNERS.md) — the eight partner asks
- [docs/adr](docs/adr) — decisions

## Layout

```
packages/verify-service   session nonce, proof intake, longfellow verifier (wasm), trust-root check, SSE push, hash-only store  (us)
packages/desk-screen      static QR + green/red page                                                                            (us)
packages/prover-page      static page: test wallet sheet, longfellow prover in a worker, proof upload, wipe                     (us)
packages/trust-list       certs dir (synthetic VICAL) -> Merkle root + inclusion proofs; HTTPS/ERC-7812 publisher is M5        (us)
packages/circuits         longfellow-zk pin, C-ABI wasm wrapper crate, committed artifacts (longfellow.wasm, circuit-1.zst)      (wrapper is us)
deploy/                   Dockerfile + compose + Caddy
fixtures/                 test DMV IACA + DS certs, signed test mDL with its device key, trust root (all test, regenerable)
bench/                    Node/wasm bench leg; device legs need the phones
scripts/                  fixture generation (openssl + Node), simplicity and PII checks, toolchain setup
```

## How one check works

```mermaid
sequenceDiagram
  participant Desk as Desk screen
  participant Verify as Verify service
  participant Page as Prover page (phone)
  participant Wallet as Test wallet (in page)
  Verify->>Desk: 1 session {nonce, now}, QR
  Page->>Verify: 2 GET /session/nonce -> now
  Page->>Wallet: 3 share age_over_21
  Wallet->>Page: 4 IssuerSigned + device key
  Page->>Page: 5 sign SessionTranscript(nonce), assemble DeviceResponse
  Page->>Page: 6 longfellow prove (wasm, 2-10 s), wipe
  Page->>Verify: 7 proof + document-signer cert
  Verify->>Verify: 8 cert chains to IACA in Merkle root; longfellow verify(proof, pk, transcript(nonce), age_over_21, now)
  Verify->>Desk: 9 green / red (SSE)
  Verify->>Verify: 10 append {timestamp, proof_hash}
```

## Numbers from this build

Measured on the cloud sandbox (4 vCPU, slow) and headless Chromium 141; a laptop is roughly 2 to 4 times faster. Device numbers (C1 to C6) still need the iPhone 13 and Pixel 6.

| Step | Time |
|---|---|
| Prove, native Rust (1 attribute) | 4.7 s |
| Prove, wasm in Node | 8.5 s |
| Prove, wasm in headless Chromium | 7.9 s |
| Verify, wasm in Node (the verify service) | 3.8 to 4.3 s |
| Circuit generation, native (done once, committed) | 37 s |
| Proof size | 336 KB |
| longfellow.wasm / circuit-1.zst | 2.6 MB / 300 KB |

## Rebuilding the prover

`packages/circuits/artifacts` is committed so the demo needs Node only. To rebuild from the pinned longfellow-zk commit: `bash scripts/setup-toolchain.sh && make wasm` (Rust stable, wasm32 target, about three minutes). The weekly `longfellow-wasm` workflow does the same on a GitHub runner and reports whether the wasm is byte-identical.

## Building from the cloud

Everything in this repository runs in a Claude Code cloud session: `make setup`, `make fixtures`, `make test`, `make check`, `make wasm`, a headless-Chromium run of the whole flow, and the Docker image (start `dockerd` in the background first; inside the sandbox, npm in the image build needs the proxy's CA, which is a sandbox quirk, not a Dockerfile change). Anything that touches a real wallet, a phone's timing or memory, or a browser heap on a phone needs the two physical devices.
