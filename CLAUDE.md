# Green Light

Green Light is a zero-knowledge proof of a US driver's license: the proof is made on the guest's phone from an ISO 18013-5 mDL and accepted by any venue, which learns only "over 21, license valid, issued by a real DMV". The pilot is a small Node verify service, a static desk screen and prover page, a trust-list pipeline, and a pinned longfellow-zk circuit, all Apache-2.0.

## Doc map

- `SPEC.md` — spec v3, the source of truth
- `docs/PLAN.md` — milestones M0 to M9, gates, risk register
- `docs/DOD.md` — definition of done, global and per milestone
- `docs/TEST-PLAN.md` — test groups A to G with ids (A1, B4, C1 ...) and pilot metrics
- `docs/SIMPLICITY.md` — hard budgets, enforced by `scripts/simplicity-check.sh`
- `docs/components/` — one sourced note per upstream component (longfellow-zk, mopro, ...)
- `docs/adr/` — decisions

## Setup

```bash
bash scripts/setup-toolchain.sh          # idempotent; add --check to only report
```
Installs what is missing: Rust stable via rustup, wasm-pack, cmake/clang/ninja (apt or brew). Checks Node 24 and Docker but does not install them. No sudo except for apt.

## Build and test

```bash
make setup      # npm install in each package
make fixtures   # test DMV cert + key + test mDL into fixtures/ (needs openssl)
make test       # node:test in every package
make check      # simplicity budgets + PII scan, same as CI
```
`make test` needs no npm dependencies; it runs straight after clone.

## Conventions

- Line 1 of every new source file: `// Copyright 2026 Green Light contributors. Apache-2.0.`
- No PII field in any log line, DB column, metric, or error message. `scripts/pii-scan.sh` fails CI on PII-shaped identifiers in code and config.
- Test names start with the TEST-PLAN id: `test('A3 expired session is rejected', ...)`.
- Never commit `fixtures/*.key` (gitignored; `make fixtures` regenerates it).
- Stay inside `docs/SIMPLICITY.md`: JavaScript only, `node:test` only, at most 6 packages, no frameworks. A new dependency, package, or workflow carries a one-line reason.
- Cloud sessions work on `claude/*` branches and open a PR to `main`.

## What can be done where

| Work | Cloud sandbox (Ubuntu x86_64, no phone, no macOS) | Otherwise needs |
|---|---|---|
| verify-service, desk-screen, prover-page, trust-list: code, tests, fixtures, docs | yes | — |
| longfellow-zk native C++ and Rust build, verifier integration (B tests) | yes | — |
| Prover WASM build | build yes; browser timings there are not the M1 numbers | — |
| `deploy/` compose (M7) | yes, Docker is preinstalled | — |
| Mopro iOS bindings, `.xcframework` | no | macOS + Xcode (GitHub `macos-*` runner) |
| Mopro Android bindings | only if the NDK is installed by the environment setup script | Android SDK + NDK |
| M1 benchmark C1–C6, wipe checks D1–D4 | no | physical iPhone 13 and Pixel 6 |
| Real state-issued mDL end to end | no | AAMVA trust-list access, registered relying party |
