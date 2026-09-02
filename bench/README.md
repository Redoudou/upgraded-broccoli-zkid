# M1 benchmark harness

Purpose: decide ADR-0001. Tests C1–C6.

Requirements: Rust stable, wasm-pack, Xcode, Android SDK, longfellow-zk at the pinned commit, Mopro, an iPhone 13 (iOS 26, Safari) and a Pixel 6 (Android 16, Chrome). Physical devices only.

Procedure per runtime and device:
1. Prove over one of longfellow's embedded test mdocs (its test corpus, indices 0 to 25). `fixtures/test-mdl.json` is not a DeviceResponse and cannot be proven over; the signed CBOR fixture arrives in M2.
2. Run the prover 20 times including the cold start. Record wall time, peak memory, and any crash or memory kill. Memory: Safari Web Inspector Timelines memory instrument (iPhone, `performance.memory` is Chrome-only), Chrome DevTools performance monitor (Pixel), Xcode Instruments Allocations (Mopro iOS), Android Studio Profiler (Mopro Android).
3. Write `bench/results/<runtime>-<device>.json` as `[{run, ms, peak_mb, ok}]`.
4. `node bench/report.js` produces `bench/REPORT.md` with p50, p95, failures. Never hand-edit the report.

Decision rule is in ADR-0001.
