# ADR-0002 — Build against longfellow main, pilot on a reviewed tag

Status: accepted 2026-09-01

## Context
Longfellow-zk is TRL 4 with two security reviews in progress. Spec section 10 decision 2.

## Decision
Development and demos build against `main` at pinned commits. The pilot (M9) builds only against a 1.x tag that the published review reports cover. If no such tag exists by the M8 gate, the pilot slips.

## Consequences
The convener asks Google longfellow and Dyne.org for review status in M0 and tracks it in PARTNERS.md. M8 gate item 1.
