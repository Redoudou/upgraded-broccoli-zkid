# Simplicity is the rule

Over-engineering is the biggest risk to this program. These rules are hard-coded. `scripts/simplicity-check.sh` enforces the numeric ones in CI, and a change that breaks them fails the build until the number is raised in this file with a one-line reason.

## Budgets (enforced)

| Thing | Limit | Why |
|---|---|---|
| Verify service source | 300 lines | The spec says ~300 lines. Past that, something is being built that the venue does not need. |
| Verify service runtime dependencies | 2 | Node's standard library covers HTTP, crypto, and JSON. One for QR, one for the longfellow verifier binding. |
| Packages under `packages/` | 6 | verify-service, desk-screen, prover-page, trust-list, circuits, and one spare. |
| Databases | 1 file | One SQLite file or one append-only JSON log with two fields. |
| Deployment units | 1 compose file | One VM, one `docker compose up`, Caddy for TLS. |
| Languages in services we own | 1 (JavaScript) | No TypeScript build step, no transpiler. The prover's Rust and C++ come from upstream projects, not us. |
| Test frameworks | 0 | `node:test` only. Device benchmarks are a script that writes JSON. |

## Things we do not build

- No Kubernetes, no cloud-specific services, no service mesh, no message queue.
- No user accounts, no admin UI, no auth system, no analytics, no feature flags, no config service. Configuration is environment variables.
- No ORM, no migration framework, no cache layer.
- No frontend framework. The desk screen and prover page are static HTML with one script each.
- No custom cryptography. The circuit is longfellow plus the two additions in the spec. If the additions cannot land in-circuit, the fallback is a check in the clear, not a new circuit.
- No custom contracts. The trust-list root goes into ERC-7812 through a Safe multi-sig and an OpenZeppelin timelock, both off the shelf.
- No onchain verifier and no nullifier in the pilot. The spec defers both; so do we.
- No plugin systems, no abstraction used in one place, no "for later" code paths.
- No native app unless the M1 benchmark forces it.

## How the rule is applied

- A pull request that adds a dependency, a package, a service, a table, or a workflow states in one line why the work cannot be done without it.
- Every milestone gate asks one question before signing: what can be removed.
- When two designs meet the spec, the one with fewer moving parts wins, even if the other is more elegant.
- A "simple" thing that needs a paragraph to explain is not simple. Rewrite it or remove it.
