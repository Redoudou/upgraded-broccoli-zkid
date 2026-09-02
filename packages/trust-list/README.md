# trust-list

VICAL → Merkle root of issuer cert hashes → publish over HTTPS and to ERC-7812 (M5).

Done here: deterministic tree, inclusion proofs, CLI over a certs directory (synthetic VICAL).
Not done: VICAL fetch/parse, HTTPS publisher with detached signature, ERC-7812 multi-sig publisher with 24 h timelock, changelog. Tests E2, E3, E5 need a testnet and land in M5.
