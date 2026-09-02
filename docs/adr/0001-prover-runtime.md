# ADR-0001 — Prover runtime: browser (WASM) or native (Mopro)

Status: browser path proven feasible 2026-09-02; final go/no-go awaits device numbers (target 2026-09-13)

## Context
Spec section 10 decision 1. Longfellow-zk is Ligero-based and lighter than SNARK ECDSA, but Safari WASM memory limits on an iPhone 13 are unconfirmed. Mopro provides native iOS and Android bindings.

## Decision rule
Two gates, both required for the browser path:
1. A wallet will deliver a response encrypted to a key generated and held in the page (Apple's guidance assumes a server key; Google requires `dc_api.jwt`). If either wallet refuses, the browser path fails regardless of timing.
2. Timing and memory, below.

Also decided here: which longfellow tree is pinned (C++ v0.9 reviewed line vs Rust `main`). The benchmarked tree is the piloted tree.

WASM p95 under 5 s on iPhone 13 (Safari) and Pixel 6 (Chrome) with zero memory kills in 20 runs each: browser primary, native fallback for older phones. Otherwise native primary, browser secondary.

## Result so far (2026-09-02, cloud sandbox, no phones)
- Tree pinned: Rust port, `google/longfellow-zk` @ `5f348de0bedcc49fe3800a57f6bf2eecd0389391` (main, 2026-08-12), circuit version 8. Reason: it compiles to `wasm32-unknown-unknown` unmodified (zstd's wasm shim, sha2 soft fallback, getrandom custom backend), circuits are 300 KB compressed instead of ~100 MB, and Google names it the production target. The C++ v0.9 line has no WASM build outside the GPL fork. Consequence for ADR-0002: the pinned tree is unreviewed; the pilot needs a reviewed tag on this line.
- WASM prover works in Chromium 141 headless and in Node with a 2.6 MB module and no wasm-bindgen: prove 7.9 s in Chromium and 8.5 s in Node on a slow 4 vCPU sandbox, versus 4.7 s native on the same machine. Verify 3.8 to 4.3 s in Node wasm, 1.9 s native. Peak RSS in Node 180 MB including the runtime. SIMD128 gave no gain.
- Missing for the decision: C1 to C6 on the iPhone 13 and Pixel 6, and gate 1 (wallet-side encryption to a page-held key), which needs the relying-party registrations.

## Consequences
Determines M3 scope (PWA vs Mopro app shell) and whether the no-install guest path survives. The prover page in `packages/prover-page` is the browser candidate; the same wrapper crate can be built natively for Mopro if the phones say no.
