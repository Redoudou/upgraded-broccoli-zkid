# Green Light

Zero-knowledge proof of a US driver's license, generated on the guest's phone, accepted by any venue. A venue learns "over 21, license valid, issued by a real DMV" and nothing else. Apache-2.0.

- [SPEC.md](SPEC.md) — spec v3, the source of truth
- [docs/PLAN.md](docs/PLAN.md) — milestones M0 to M9, dates, gates, risk register
- [docs/DOD.md](docs/DOD.md) — definition of done, global and per milestone
- [docs/TEST-PLAN.md](docs/TEST-PLAN.md) — test groups A to G and pilot metrics
- [docs/PARTNERS.md](docs/PARTNERS.md) — the eight partner asks
- [docs/adr](docs/adr) — decisions

## Layout

```
packages/verify-service   session nonce, proof intake, longfellow verifier hook, websocket, hash-only storage  (us)
packages/desk-screen      static QR + green/red page                                                            (us)
packages/prover-page      PWA: DC API request, longfellow via Mopro/WASM, proof upload, wipe                    (us, glue)
packages/trust-list       VICAL -> Merkle root, HTTPS publisher, ERC-7812 publisher                             (us)
packages/circuits         longfellow-zk pin + the two circuit additions                                         (fork/PR)
deploy/                   Docker one-liner
fixtures/                 test DMV cert, key, test mDL (generated, never a real credential)
bench/                    M1 device benchmark harness and report
scripts/                  fixture generation, reproducible-build check
```

## Figure 1 — system architecture

```mermaid
flowchart LR
  subgraph phone[Guest's phone]
    W[Wallet<br/>Apple / Google / Samsung / state<br/>ISO 18013-5 mDL signed by DMV]
    P[Prover page PWA<br/>1 receive mdoc via DC API<br/>2 longfellow-zk via Mopro or WASM<br/>3 send proof only<br/>4 wipe mdoc]
    W -- DC API hand-off --> P
  end
  subgraph venue[Venue]
    D[Desk screen<br/>QR with one-time session nonce<br/>green or red]
    V[Verify service<br/>1 session nonce 60 s<br/>2 longfellow verifier<br/>3 nonce + root check<br/>4 store timestamp + proof hash only]
    D <-- session / result --> V
  end
  subgraph public[Public infrastructure]
    A[AAMVA trust list<br/>VICAL: roster of DMV signing certs]
    R[Trust-list root<br/>Merkle root of issuer certs<br/>HTTPS + ERC-7812<br/>multi-sig, timelocked]
    A -- pipeline --> R
  end
  P -- proof only --> V
  R -- root --> V
  R -. root, cached in the prover page .-> P
```

Solid arrows carry data during a check. Dashed: fetched once, cached.

## Figure 2 — one check, end to end

```mermaid
sequenceDiagram
  participant Desk as Desk screen
  participant Verify as Verify service
  participant Page as Prover page
  participant Wallet
  participant Root as Trust root
  Verify->>Desk: 1 session nonce, QR
  Page->>Page: 2 guest scans QR, page opens
  Page->>Wallet: 3 request age_over_21, expiry
  Wallet->>Page: 4 biometric, signed mdoc
  Root->>Page: 5 cached root
  Page->>Page: 6 prove (1 to 5 s), wipe mdoc
  Page->>Verify: 7 proof + nonce
  Root->>Verify: 8 root check
  Verify->>Desk: 9 green / red
  Verify->>Verify: 10 store {time, proof hash}
```

The wallet never talks to the venue. The venue never sees the mdoc. The root is public.

## Figure 3 — what we assemble

See the bill of materials in [SPEC.md section 2](SPEC.md). Nine rows, two are ours (verify service + desk, deployment + audit). The circuit is reuse plus extend; the standards row is co-author; everything else is reuse.

## Toolchain

| Tool | Needed for | Present on this machine |
|---|---|---|
| Node 24 | verify service, desk screen, prover page, trust list | yes |
| Python 3.11 | fixture scripts | yes |
| Rust stable + wasm-pack | longfellow build, Mopro, WASM (M1) | no |
| Xcode + Android SDK | Mopro native (M1) | no |
| Docker | reference deployment (M7) | no |
| openssl | test DMV cert | yes (macOS) |

## Quick start

```bash
make setup      # npm install in each package
make fixtures   # test DMV cert + key + test mDL into fixtures/
make test       # unit tests, all packages
make demo1      # level 1 demo: verify service + desk screen, stubbed proof
```

## Demo levels

Every screen shows which level is running.

- Level 1 — flow. Session, QR, verify service, hash-only storage are real. Proof is stubbed, credential is a test mDL.
- Level 2 — proof. longfellow-zk on a real iPhone and Pixel. Credential is still a test mDL.

A real state-issued mDL needs AAMVA trust-list access and a registered relying party. Neither is in hand yet.
