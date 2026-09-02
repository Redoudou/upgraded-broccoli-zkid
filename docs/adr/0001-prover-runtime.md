# ADR-0001 — Prover runtime: browser (WASM) or native (Mopro)

Status: open, decided by the M1 benchmark (target 2026-09-13)

## Context
Spec section 10 decision 1. Longfellow-zk is Ligero-based and lighter than SNARK ECDSA, but Safari WASM memory limits on an iPhone 13 are unconfirmed. Mopro provides native iOS and Android bindings.

## Decision rule
Two gates, both required for the browser path:
1. A wallet will deliver a response encrypted to a key generated and held in the page (Apple's guidance assumes a server key; Google requires `dc_api.jwt`). If either wallet refuses, the browser path fails regardless of timing.
2. Timing and memory, below.

Also decided here: which longfellow tree is pinned (C++ v0.9 reviewed line vs Rust `main`). The benchmarked tree is the piloted tree.

WASM p95 under 5 s on iPhone 13 (Safari) and Pixel 6 (Chrome) with zero memory kills in 20 runs each: browser primary, native fallback for older phones. Otherwise native primary, browser secondary.

## Result
_To be filled from `bench/REPORT.md`: longfellow commit, p50, p95, peak memory per device and runtime, decision._

## Consequences
Determines M3 scope (PWA vs Mopro app shell) and whether the no-install guest path survives.
