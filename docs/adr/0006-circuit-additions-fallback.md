# ADR-0006 — Circuit additions: in-circuit or fallback

Status: fallback in use for the prototype (2026-09-02); in-circuit decision by end of M4 (target 2026-10-11)

## Context
The spec adds two statements to longfellow: device-bound key signed the verifier nonce, and issuer cert hash is a member of the trust-list root. Both depend on an external team accepting or reviewing changes.

## Options
1. In-circuit, upstream or on our fork with a written review. Preferred.
2. Fallback: nonce checked in the clear from the wallet's device signature over the session transcript (ISO 18013-7), membership checked in the clear against the published root. Weaker privacy: the verifier learns which issuer signed. Must be labelled in the pilot report.

## Result so far
- **Nonce statement: already in-circuit, no addition needed.** longfellow's mdoc circuit verifies the device signature over `DeviceAuthentication(SessionTranscript, docType, deviceNameSpaces)` and seeds Fiat-Shamir with the transcript. Green Light's transcript is `[null, null, ["GreenLightHandoverv1", nonce]]`; the verify service reconstructs it from the nonce it issued. A proof for another session does not verify (test B4).
- **Trust-list membership: fallback (option 2) for the prototype.** The page sends the document-signer certificate with the proof; the verify service checks that it is an end-entity certificate issued and signed by an IACA whose leaf is in the pinned Merkle root and valid on the verifier date, then hands that certificate's public key to the longfellow verifier as the public issuer key. The venue therefore learns the issuing DMV. This is what longfellow's own reference verifier does today (issuer key is a public input; `assert_signatures_with_issuer_list` exists but is unwired).
- Open for M4: wire the in-circuit issuer list or a Merkle gadget upstream, or on our fork with a review. Until then every screen and the pilot report carry the label "issuer visible to the venue".
