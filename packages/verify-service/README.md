# verify-service

Spec section 4. Session nonce (60 s, single use) → QR → proof intake → verifier → green/red → store `{timestamp, proof_hash}` only.

Level 1 ships `StubVerifier`. M3/M4 add `LongfellowVerifier` behind the same interface: inputs are exactly proof, nonce, root, date.

Tests: A1–A7 and stubbed B1, B4, B5, B8 in `test/`. Websocket push (A8) and verifier date input (A9) land in M2.
