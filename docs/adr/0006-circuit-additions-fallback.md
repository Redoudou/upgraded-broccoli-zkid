# ADR-0006 — Circuit additions: in-circuit or fallback

Status: open, decided by end of M4 (target 2026-10-11)

## Context
The spec adds two statements to longfellow: device-bound key signed the verifier nonce, and issuer cert hash is a member of the trust-list root. Both depend on an external team accepting or reviewing changes.

## Options
1. In-circuit, upstream or on our fork with a written review. Preferred.
2. Fallback: nonce checked in the clear from the wallet's device signature over the session transcript (ISO 18013-7), membership checked in the clear against the published root. Weaker privacy: the verifier learns which issuer signed. Must be labelled in the pilot report.

## Result
_To be filled._
