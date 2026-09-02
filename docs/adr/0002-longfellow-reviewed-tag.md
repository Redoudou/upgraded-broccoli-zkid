# ADR-0002 — Build against longfellow main, pilot on a reviewed tag

Status: accepted 2026-09-01

## Context
Longfellow-zk is TRL 4 with two security reviews in progress. Spec section 10 decision 2.

## Decision
Development and demos build against a pinned commit. The pilot (M9) builds only against a tag Google names as the reviewed baseline. As of 2026-09-02 no 1.x tag exists; the reviewed line is C++ v0.9 (Trail of Bits reviewed commit `981a349fad`, ISRG fix in v0.8.4, Ligero protocol analysis), with five Trail of Bits items still open. The Rust port on `main` is unreviewed and is not a pilot candidate until reviewed. If no reviewed tag covers the pinned tree by the M8 gate, the pilot slips.

## Consequences
The convener asks Google longfellow and Dyne.org for review status in M0 and tracks it in PARTNERS.md. M8 gate item 1.
