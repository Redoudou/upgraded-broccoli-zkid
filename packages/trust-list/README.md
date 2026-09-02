# trust-list

Issuer certs → Merkle root of cert hashes → (M5) publish over HTTPS and to ERC-7812.

Done: deterministic tree with inclusion proofs (`src/merkle.js`), synthetic VICAL loader over a directory of PEM/DER IACA certs (`src/certs.js`), CLI (`node src/cli.js fixtures/certs > fixtures/root.txt`). The verify service imports both to check that a document-signer certificate chains to an IACA in the pinned root.

Not done: AAMVA VICAL fetch and parse, HTTPS publisher with detached signature, ERC-7812 multi-sig publisher with 24 h timelock, changelog. Tests E2, E3, E5 need a testnet and land in M5.
