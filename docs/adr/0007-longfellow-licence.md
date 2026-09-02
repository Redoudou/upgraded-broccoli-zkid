# ADR-0007 — Which longfellow artefact ships in an Apache-2.0 prover page

Status: decided 2026-09-02

## Context
Upstream google/longfellow-zk is Apache-2.0 but had no WASM build. The Dyne.org fork has the only WASI build and Node bindings, and relicensed to GPL-3.0-or-later on 2026-08-31 (last Apache-2.0 commit `3d1d196a69`, 2026-08-22). Green Light is Apache-2.0 (spec line 2).

## Options
1. Build upstream with our own WASI preset, ported from the fork's CMake preset (a build recipe, not their code).
2. Pin the fork at `3d1d196a69` and never move.
3. Ask Dyne for non-GPL terms (info@dyne.org).
4. Native only via Mopro, no browser build; kills the no-install guest path.

## Decision
None of the four. Upstream's **Rust port compiles to `wasm32-unknown-unknown` as is**, so the prover page ships upstream Apache-2.0 code plus a 120-line Apache-2.0 wrapper crate of ours (`packages/circuits/longfellow-wasm`): C ABI, no wasm-bindgen, entropy supplied by the host through one import, zstd built with its wasm shim. No Dyne code is used. The same module runs the verifier in Node.

## Consequences
The licence question is closed for the browser path. The Dyne fork remains a useful reference for a C++ WASI build if the reviewed C++ line ever has to ship in a browser.
