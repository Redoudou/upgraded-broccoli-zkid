# ADR-0007 — Which longfellow artefact ships in an Apache-2.0 prover page

Status: open, decided in M1 (target 2026-09-13)

## Context
Upstream google/longfellow-zk is Apache-2.0 but has no WASM build. The Dyne.org fork has the only WASI build and Node bindings, and relicensed to GPL-3.0-or-later on 2026-08-31 (last Apache-2.0 commit `3d1d196a69`, 2026-08-22). Green Light is Apache-2.0 (spec line 2).

## Options
1. Build upstream with our own WASI preset, ported from the fork's CMake preset (a build recipe, not their code).
2. Pin the fork at `3d1d196a69` and never move.
3. Ask Dyne for non-GPL terms (info@dyne.org).
4. Native only via Mopro, no browser build; kills the no-install guest path.

## Result
_To be filled from the M1 WASM spike and Dyne's reply._
