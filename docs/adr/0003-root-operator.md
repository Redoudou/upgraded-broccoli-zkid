# ADR-0003 — Trust-list root operator

Status: accepted 2026-09-01

## Context
No public, verifiable root of DMV issuer certificates exists. VICAL is distributed to registered relying parties only. Spec section 10 decision 3 and section 8 trust hole: a root publisher could insert a fake DMV.

## Decision
The EEA operates the root. Publication to ERC-7812 goes through a multi-sig whose signers are the EEA, PSE, and one state DMV. Updates carry a 24 h timelock and a signed public changelog. The policy document (who signs, how issuers are added or removed, emergency removal) is published with the first real root.

## Consequences
M5 builds the publisher and the timelock; TEST E2, E3, E5 enforce it. Until AAMVA access arrives the pipeline runs on a synthetic VICAL.
