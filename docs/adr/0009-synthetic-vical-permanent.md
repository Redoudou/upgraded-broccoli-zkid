# ADR-0009 — AAMVA VICAL access is simulated, permanently

Status: decided (2026-09-02)

## Context
The spec and the original plan (M5, M8 item 4) treated AAMVA VICAL relying-party access as a pending ask: the trust-list pipeline runs on a synthetic VICAL "until AAMVA grants access", and the pilot-ready gate required that access be granted. The convener has decided not to pursue AAMVA relying-party registration. There is no owner for that ask and no date by which it would land.

## Decision
The trust-list pipeline runs on a synthetic VICAL (the test DMV cert in `fixtures/`) by design, not as a stand-in for a pending integration. This is permanent for as long as Green Light is a demo/MVP product built and operated by the convener alone.

Real AAMVA VICAL integration is out of scope for this team. It only happens if an external party takes it on: a state DMV publishing its own root, a wallet vendor (Apple/Google) exposing trust data, or AAMVA itself approaching Green Light rather than the reverse. Nobody on this project is assigned to request VICAL access, and no milestone or gate should depend on it arriving.

## Consequences
- `docs/PLAN.md` M5 and M8 item 4 are rewritten: synthetic VICAL is the permanent state, not a blocker to clear.
- `docs/PARTNERS.md` AAMVA DTS row is marked "not pursued" rather than "not sent" — this is a decision, not a delay.
- Every public-facing description of the trust-list step (README, demo handout, screens) must say the issuer list is a synthetic/test trust list, not "pending production access."
- If this changes — because a partner brings real VICAL access to us — it is a new ADR, not an edit to this one.
