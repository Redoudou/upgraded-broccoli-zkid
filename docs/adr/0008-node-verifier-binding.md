# ADR-0008 — How the verify service calls the longfellow verifier

Status: accepted 2026-09-02

## Context
OPEN-BEFORE-M1 item 14. Node must run `run_mdoc_verifier` within the two-dependency budget. Options were Google's Go reference verifier as a child process, a Node addon over the C API, or a WASI build.

## Decision
The same `longfellow.wasm` the prover page uses, instantiated in Node with `WebAssembly.instantiate` and the shared loader `packages/circuits/longfellow.js`. Zero native dependencies, one artifact to audit, byte-identical verifier logic to the prover's, and it runs inside the Alpine Node Docker image with nothing else installed.

## Consequences
Verification blocks the event loop for about 4 s on a slow machine (1 to 2 s on a laptop). Acceptable for a single-use desk session. If throughput matters (test B9, p95 under 500 ms), the wrapper crate already builds a native `lf` binary; spawning it or a worker thread pool is the upgrade path, still without a new dependency.
