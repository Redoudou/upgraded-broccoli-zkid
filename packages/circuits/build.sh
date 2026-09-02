#!/usr/bin/env bash
# Copyright 2026 Green Light contributors. Apache-2.0.
# Builds artifacts/longfellow.wasm (prover + verifier, C ABI) and artifacts/circuit-1.zst (the
# current-version 1-attribute mdoc circuit) from the pinned longfellow-zk commit. Needs Rust stable
# with the wasm32-unknown-unknown target (scripts/setup-toolchain.sh). ~3 minutes on a laptop.
# The artifacts are committed so `make demo` needs Node only; rerun this after changing the pin.
set -euo pipefail
cd "$(dirname "$0")"
export PATH="$HOME/.cargo/bin:$PATH"
rustup target list --installed | grep -q wasm32-unknown-unknown || rustup target add wasm32-unknown-unknown
( cd longfellow-wasm
  RUSTFLAGS='--cfg getrandom_backend="custom"' cargo build --release --target wasm32-unknown-unknown --lib
  cargo build --release --bin lf )
cp longfellow-wasm/target/wasm32-unknown-unknown/release/longfellow_wasm.wasm artifacts/longfellow.wasm
[ -s artifacts/circuit-1.zst ] || longfellow-wasm/target/release/lf circuit 1 artifacts/circuit-1.zst
( cd artifacts && sha256sum longfellow.wasm circuit-1.zst | tee SHA256SUMS )   # bare names: CI checks from inside artifacts/
