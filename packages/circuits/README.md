# circuits

Pin of Google longfellow-zk (or the Dyne.org fork) plus the two additions from spec section 3:

1. Device-bound key signed the verifier nonce.
2. Issuer cert hash is a member of the published trust-list root (Merkle membership, tree shape in `packages/trust-list/src/merkle.js`).

Not started. Needs Rust. Pin the commit in `LONGFELLOW_COMMIT` when M1 begins. In-circuit vs fallback is ADR-0006. Test vectors for B1–B8 go in `vectors/`.
