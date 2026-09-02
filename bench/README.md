# Benchmark harness

Purpose: decide ADR-0001. Tests C1–C6 need the physical iPhone 13 and Pixel 6; the Node/wasm leg here runs anywhere and gives the floor.

## Node / wasm leg (runs today)

```bash
make bench            # 5 runs; or: node bench/wasm-node.js 20 && node bench/report.js
```
Each run is a cold start (instantiate the wasm, sign a fresh session transcript with the test credential's device key, prove, verify) and writes `bench/results/wasm-node.json` as `[{run, ms, peak_mb, ok}]`. `report.js` renders `bench/REPORT.md` with p50, p95, failures. Never hand-edit the report.

## Device legs (C1–C6)

Requirements: the two phones, this repository served on the same network (`make demo`), Safari Web Inspector or Chrome DevTools for memory.

1. Open the prover page from the desk QR on the phone, share, note the on-screen proving time. Repeat 20 times including the first cold load. Record wall time, peak memory (Safari Timelines memory instrument; Chrome performance monitor), and any crash or memory kill.
2. Write `bench/results/<runtime>-<device>.json` as `[{run, ms, peak_mb, ok}]`.
3. `node bench/report.js`.

Decision rule is in ADR-0001.
