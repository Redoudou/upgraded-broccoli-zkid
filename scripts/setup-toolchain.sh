#!/usr/bin/env bash
# Copyright 2026 Green Light contributors. Apache-2.0.
# Idempotent toolchain setup for a fresh clone (README "Toolchain", PLAN M0).
# Installs only what is missing: Rust stable via rustup, wasm-pack via cargo,
# cmake/clang/ninja via apt (Debian/Ubuntu) or brew (macOS). Node and Docker are
# checked, never installed. No sudo except for apt, and only when available.
# Safe to run twice. `--check` reports without installing anything.
set -euo pipefail

want_node=24
check_only=0
[ "${1:-}" = "--check" ] && check_only=1
export PATH="$HOME/.cargo/bin:$PATH"

have() { command -v "$1" >/dev/null 2>&1; }
note() { printf 'setup-toolchain: %s\n' "$*"; }
run()  { if [ "$check_only" -eq 1 ]; then note "would run: $*"; else "$@"; fi; }
verb=installing; [ "$check_only" -eq 1 ] && verb="would install"

os="$(uname -s)"

# --- Node: check only --------------------------------------------------------
node_status="missing"
if have node; then
  v="$(node --version)"; major="${v#v}"; major="${major%%.*}"
  if [ "$major" -ge "$want_node" ]; then node_status="ok $v"; else node_status="too old ($v)"; fi
fi
case "$node_status" in ok*) ;; *) note "Node $want_node not found: $node_status. Install with nvm, fnm, or your package manager." ;; esac

# --- Rust stable via rustup (user-local, no sudo) ----------------------------
if ! have rustup; then
  note "$verb rustup with the stable toolchain (user-local)"
  if [ "$check_only" -eq 0 ]; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
      | sh -s -- -y --profile minimal --default-toolchain stable --no-modify-path
  fi
fi
if have rustup; then
  toolchains="$(rustup toolchain list 2>/dev/null || true)"
  case "$toolchains" in *stable*) ;; *) run rustup toolchain install stable --profile minimal ;; esac
  rustup default >/dev/null 2>&1 || run rustup default stable
  targets="$(rustup target list --installed 2>/dev/null || true)"
  case "$targets" in *wasm32-unknown-unknown*) ;; *) run rustup target add wasm32-unknown-unknown ;; esac
fi

# --- wasm-pack via cargo (user-local) ----------------------------------------
if ! have wasm-pack && have cargo; then
  note "$verb wasm-pack"
  run cargo install wasm-pack --locked
fi

# --- cmake / clang / ninja ---------------------------------------------------
missing=""
for t in cmake clang ninja; do have "$t" || missing="$missing $t"; done
if [ -n "$missing" ]; then
  case "$os" in
    Linux)
      if have apt-get; then
        pkgs=""
        for t in $missing; do case "$t" in ninja) pkgs="$pkgs ninja-build" ;; *) pkgs="$pkgs $t" ;; esac; done
        if [ "$(id -u)" -eq 0 ]; then sudo=""
        elif have sudo && sudo -n true 2>/dev/null; then sudo="sudo"
        else sudo="none"; fi
        if [ "$sudo" = none ]; then
          note "cannot apt-get without sudo; run as root or: sudo apt-get install -y$pkgs"
        else
          note "$verb$pkgs via apt"
          # shellcheck disable=SC2086
          run $sudo apt-get update -qq
          # shellcheck disable=SC2086
          run $sudo apt-get install -y -qq $pkgs
        fi
      else
        note "missing:$missing. Install them with your distro's package manager (only apt is automated)."
      fi ;;
    Darwin)
      if ! have clang || ! xcode-select -p >/dev/null 2>&1; then
        note "clang comes from the Xcode Command Line Tools: run 'xcode-select --install'"
      fi
      brew_pkgs=""
      for t in $missing; do case "$t" in cmake|ninja) brew_pkgs="$brew_pkgs $t" ;; esac; done
      if [ -n "$brew_pkgs" ]; then
        if have brew; then
          note "$verb$brew_pkgs via brew"
          # shellcheck disable=SC2086
          run brew install $brew_pkgs
        else
          note "Homebrew not found; install it, then: brew install$brew_pkgs"
        fi
      fi ;;
    *) note "unsupported OS $os; install$missing by hand" ;;
  esac
fi

# --- Docker: check only ------------------------------------------------------
have docker || note "Docker not found. Needed only for deploy/ (M7); install Docker Desktop or docker.io."

# --- Report ------------------------------------------------------------------
ver() { "$1" --version 2>/dev/null | head -1 | sed 's/^[^0-9]*//' | cut -c1-30; }
row() { printf '%-10s %-32s %s\n' "$1" "$2" "$3"; }
printf '\n%-10s %-32s %s\n' TOOL STATUS "NEEDED FOR"
row node      "$node_status"                                           "verify service, desk, prover page, trust list"
row rustup    "$(have rustup    && echo "ok $(ver rustup)"    || echo missing)" "longfellow, Mopro, WASM (M1)"
row cargo     "$(have cargo     && echo "ok $(ver cargo)"     || echo missing)" "longfellow Rust workspace, wasm-pack"
row wasm-pack "$(have wasm-pack && echo "ok $(ver wasm-pack)" || echo missing)" "WASM prover build (M1)"
row cmake     "$(have cmake     && echo "ok $(ver cmake)"     || echo missing)" "longfellow C++ build"
row clang     "$(have clang     && echo "ok $(ver clang)"     || echo missing)" "longfellow C++ build (CXX=clang++)"
row ninja     "$(have ninja     && echo "ok $(ver ninja)"     || echo missing)" "optional cmake generator"
row docker    "$(have docker    && echo "ok $(ver docker)"    || echo "missing (message only)")" "deploy/ (M7)"
echo
note "longfellow's extra C++ libraries are listed in docs/components/longfellow-zk.md"
note "done"
