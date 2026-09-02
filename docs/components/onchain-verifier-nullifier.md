# ZKPassport / Aztec Solidity verifier patterns and Semaphore
_Researched 2026-09-01; independently re-verified 2026-09-02 (see [Verification](#verification)). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is (3-6 sentences)
ZKPassport is a passport/national-ID proof system whose circuits are written in Noir and proven with Aztec's Barretenberg UltraHonk backend "natively on mobile devices"; its onchain path is a single deterministic `ZKPassportVerifier`/`RootVerifier` contract (`0x1D000001000EFD9a6371f4d90bB8920D5431c0D8`) that dispatches by version and verification-key hash to `bb`-generated UltraHonk Solidity verifiers and checks a certificate-registry root against a timestamped onchain `RootRegistry` ([S17](#sources), [S19](#sources), [S14](#sources), [S15](#sources)). The generic Aztec pattern is `bb write_vk --oracle_hash keccak` then `bb write_solidity_verifier`, producing a contract with `verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool)` that relies on the ecAdd/ecMul/ecPairing/modexp precompiles ([S23](#sources)). Longfellow, Green Light's prover, is a different animal: a Ligero + sumcheck argument over GF(2^128) and Fp256 whose only assumption is SHA-256, with proofs of roughly 291-325 KB, so it is cheap to verify on a server (142-508 ms single-threaded) but has no EVM verifier anywhere ([S45](#sources), [S46](#sources), [S47](#sources)). Semaphore v4 (MIT, PSE) is a Groth16/circom group-membership protocol whose contract stores nullifiers `Poseidon(scope, secret)` and reverts on reuse, deployed at one address on 15 networks: 7 mainnets (Ethereum, Arbitrum, Polygon, Optimism, Base, Linea, Gnosis) and 8 testnets ([S29](#sources), [S34](#sources), [S33](#sources), [S40](#sources), [S60](#sources)). This note covers what to copy from ZKPassport, what a longfellow-to-EVM port would cost, and how a one-proof-per-person nullifier could attach.

## Where it lives (table: item | URL | licence | version/tag/commit seen today)
| Item | URL | Licence | Version/tag/commit seen today |
|---|---|---|---|
| ZKPassport circuits (Noir + generated Solidity verifiers) | https://github.com/zkpassport/circuits | Apache-2.0 (LICENSE, 11,340 B) [S1] | `main` @ `1a1836eb958b7d7bbb47fab060128757748dba6a`, 2026-08-06 "feat: add NONE nullifier type (#152)"; tags `noir-v1.0.0-beta.22`, `bb-v5.0.0`; package `circuits` 0.20.0, deps `@aztec/bb.js` 5.0.0, `@noir-lang/noir_js` ^1.0.0-beta.22 [S3][S4][S5] |
| ZKPassport monorepo (SDK, registry contracts, registry SDK/explorer) | https://github.com/zkpassport/zkpassport-packages | SDK `package.json` "license": "Apache-2.0"; no root LICENSE file [S12][S11] | `main` @ `a843c1e3c541be889e2b092efa5c04fbc80ac58f`; `@zkpassport/sdk` 0.16.2; `registry-contracts` 0.2.1 (private); no git tags [S12][S11] |
| ZKPassport verifier contracts (source) | https://github.com/zkpassport/zkpassport-packages/tree/main/packages/registry-contracts/src | SPDX Apache-2.0 in files [S14] | `RootVerifier.sol`, `SubVerifier.sol`, `IProofVerifier.sol`, `RootRegistry.sol`, `VerifierHelper.sol`, `ProtocolController.sol` [S14][S15][S16] |
| ZKPassport mainnet deployment | https://github.com/zkpassport/circuits/blob/main/src/solidity/deployments/addresses-1.json | — | root_verifier `0x1D000001000EFD9a6371f4d90bB8920D5431c0D8`; sub-verifier 0.20.0 `0x358324e0…b43C` (`deployed_at` 1784055743 = 2026-07-14, derived); ten `outer_count_4…13` UltraHonk verifiers; root_registry `0x1D0000020038d6E40E1d98e09fA1bb3A7DAA8B70` [S8] |
| ZKPassport docs (onchain guide, API, changelog, FAQ) | https://docs.zkpassport.id ; source https://github.com/zkpassport/zkpassport-docs | Apache-2.0 (root `LICENSE` in zkpassport-docs; corrected 2026-09-02, was "[unverified]") [S61] | changelog top entry "v0.15.x - Latest release" (SDK package already 0.16.2) [S18][S12] |
| Barretenberg Solidity verifier how-to | https://barretenberg.aztec.network/docs/how_to_guides/how-to-solidity-verifier/ | — | page header references v0.87.0 [S23] |
| Barretenberg Honk Solidity sources | https://github.com/AztecProtocol/aztec-packages/tree/master/barretenberg/sol/src/honk | not checked [unverified] | `BaseHonkVerifier.sol`, `BaseZKHonkVerifier.sol`, `Transcript.sol`, `ZKTranscript.sol`, `Relations.sol`, `CommitmentScheme.sol`, `Fr.sol`, `HonkTypes.sol` @ `89b3b1c1` (head of default branch `next` = `master`, 2026-09-01; last commit touching this directory `a69ffdf8`, 2026-06-30); latest release `v5.2.0` 2026-08-17 [S25][S24] |
| Semaphore (protocol, contracts, circuits, JS) | https://github.com/semaphore-protocol/semaphore | MIT (LICENSE; `// SPDX-License-Identifier: MIT` in Semaphore.sol) [S29][S33] | latest release `v4.14.3` 2026-07-08; `main` @ `4dbc39b8`; `v4.0.0` released 2024-07-25 [S30][S31] |
| Semaphore v4 deployed contracts | https://docs.semaphore.pse.dev/deployed-contracts | — | `Semaphore` `0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`, `SemaphoreVerifier` `0x4DeC9E3784EcC1eE002001BfE91deEf4A48931f8`, `PoseidonT3` `0xB43122Ecb241DD50062641f089876679fd06599a` on 15 networks: mainnets Ethereum, Arbitrum, Polygon, Optimism, Base, Linea, Gnosis; testnets Sepolia, Arbitrum Sepolia, Optimism Sepolia, Polygon Amoy, Base Sepolia, Linea Sepolia, Scroll Sepolia, Gnosis Chiado. No Scroll mainnet deployment (corrected 2026-09-02, was "18 networks incl. Scroll") [S40][S60] |
| Semaphore v4 audit (PSE internal) | https://semaphore.pse.dev/Semaphore_4.0.0_Audit.pdf | — | "By Mridul, Yufei Li, Kyle Charbonnet, March 2024"; scope `v4.0.0-beta.1` commit `8eb19e83…`, zk-kit `imt.sol-v2.0.0-beta.8` [S42] |
| longfellow-zk (for the porting question) | https://github.com/google/longfellow-zk | Apache-2.0 [S43] | `main` @ `5f348de0bedcc49fe3800a57f6bf2eecd0389391` 2026-08-12; latest tag `v0.9` (2026-03-31); `v0.8.6` "rate 7, 132 columns to achieve 109bits of security" [S43][S44] |

## How Green Light uses it (tie to SPEC.md sections and the milestone in docs/PLAN.md)
- SPEC §2 rows "Onchain verifier | Solidity verifier pattern | ZKPassport / Aztec | Live | Port longfellow verifier or verify offchain in pilot" and "Nullifier (later) | Semaphore | EF / PSE | Live | Only if one-proof-per-person is ever needed". SPEC §4: "Onchain verification: not in pilot. Publish the root onchain from day one; port the verifier contract once the pilot proves demand." SPEC §5 / PARTNERS.md: ask "Aztec / ZKPassport — Advice on the onchain port", owner eng A, reply-by 2026-10-09, blocks "post-pilot". PLAN M9 exit gate: "decision recorded on whether to port the verifier onchain".
- What to copy now (M5, weeks 3-6): ZKPassport's registry check is exactly SPEC §3 item 1 / §4 done onchain. `SubVerifier.verify` reads `publicInputs[CERTIFICATE_REGISTRY_ROOT_INDEX]` and requires `rootRegistry.isRootValid(RegistryID.CERTIFICATE, certificateRoot, timestamp)`, i.e. a root is validated at the proof's own timestamp, not "latest root", which tolerates VICAL refreshes without invalidating in-flight proofs ([S15](#sources)). Green Light's ERC-7812 publisher and the verify service's "root check" should adopt the same `(registryId, root, timestamp)` validity semantics.
- What to copy for the verify service: scope binding. ZKPassport hashes the relying-party domain and per-request scope into the proof (`sha256(domain) >> 8`, `sha256(scope) >> 8`) and exposes a unique identifier (`publicInputs[len-2]`, the "scoped nullifier") ([S15](#sources)); binding of `user_address`, `chain` and up to 500 bytes of `custom_data` is committed in-circuit and checked via `helper.getBoundData` ([S19](#sources), [S20](#sources)). Green Light's session nonce plays the same role via longfellow's session transcript; a per-venue "scope" would be the analogue if uniqueness is ever wanted.
- Decision evidence for M9: a direct port of a longfellow proof to an EVM verifier is not credible at today's gas schedule (numbers in the next section). If demand appears, the realistic routes are (a) keep verification off-chain (SPEC §4 pilot default; Google ships a Go reference verifier service, [S50](#sources)) and anchor only roots and hashes onchain, or (b) a recursive wrapper: verify the longfellow proof inside a Noir/UltraHonk or Groth16 circuit and post that SNARK, the pattern RISC Zero uses: its STARK proofs "can be wrapped in circom Groth16 SNARKs that are significantly smaller and faster to verify on-chain" ([S56](#sources); the earlier quote "notoriously difficult to verify on-chain due to their size" is not on that page as of 2026-09-02 and was replaced). Route (b) is a research project, not a pilot deliverable.
- Semaphore: the pilot (age check per visit) has no one-person-one-proof requirement, matching SPEC §2 "only if … ever needed". If a use case appears (one signup per licence, voting), Semaphore's contract gives the double-use registry, but the hard part is registration: longfellow's public statement `(PK_II, attr, Z, tr, time)` contains no deterministic per-licence value ([S45](#sources) Alg. 10), so membership cannot be bound to the licence without a third circuit addition (below).

## How to build or integrate (concrete commands or API calls, copied from the source with the source linked)
Generate a Solidity verifier for any Noir circuit ([S23](#sources)):
```bash
bb write_vk -b ./target/<noir_artifact_name>.json -o ./target --oracle_hash keccak
bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol
# generated: function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool)
# "Required EVM precompiles: ecMul, ecAdd, ecPairing, and modexp"
```
ZKPassport onchain flow ([S19](#sources), [S20](#sources), [S16](#sources)):
```typescript
npm install @zkpassport/sdk            // SDK package.json: "@aztec/bb.js": "5.0.0"
const zkPassport = new ZKPassport("your-domain.com")
const queryBuilder = await zkPassport.request({ name, logo, purpose, scope: "my-scope", mode: "compressed-evm" })
const { url, onResult } = queryBuilder.gte("age", 18).bind("user_address", addr).bind("chain", "ethereum").done()
const { address, functionName, abi } = zkPassport.getSolidityVerifierDetails()   // "same for all networks"
const evmProof = proofs.find((p) => p.name?.startsWith("outer_evm"))
const verifierParams = sdkInstance.getSolidityVerifierParameters({ proof: evmProof, scope: "my-scope", devMode: false })
```
```solidity
interface IProofVerifier { function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool); }
// RootVerifier: function verify(ProofVerificationParams calldata params) external view returns (bool valid, bytes32 uniqueIdentifier, VerifierHelper helper)
// consumer: (bool verified, bytes32 uniqueIdentifier, IZKPassportHelper helper) = zkPassportVerifier.verify(params);
//           helper.verifyScopes(params.proofVerificationData.publicInputs, "your-domain.com", "my-scope"); helper.isAgeAboveOrEqual(18, params.committedInputs);
```
`ProofVerificationParams` = `{ bytes32 version; { bytes32 vkeyHash; bytes proof; bytes32[] publicInputs }; bytes committedInputs; { uint256 validityPeriodInSeconds; string domain; string scope; bool devMode } }`; public inputs are `[certificate_registry_root, circuit_registry_root, current_date, service_scope, service_subscope, param_commitments…, nullifier_type, scoped_nullifier]` per the docs ([S19](#sources)); note that `SubVerifier.sol` on `main` (registry-contracts 0.2.1) now reads three trailing inputs, `[len-3] nullifier_type, [len-2] scoped_nullifier, [len-1] oprf_pk_hash`, so the docs lag the contract source by one field ([S15](#sources), checked 2026-09-02). Foundry project: `cd src/solidity && forge install && cp .env.example .env` (`ROOT_REGISTRY_ADDRESS=0xB6bF4a45D5Ed1363C45BD0e4cbaDCcd48F8D3FaB`), `forge build`, `forge test`, `./deploy.sh sepolia` ([S6](#sources)).

Semaphore v4 ([S35](#sources), [S37](#sources), [S36](#sources), [S32](#sources)):
```bash
npm i @semaphore-protocol/contracts        # or: soldeer install semaphore-protocol-contracts~4.6.0
```
```javascript
const { privateKey, publicKey, commitment } = new Identity()      // EdDSA keys; new Identity("secret-value") is deterministic
const proof = await generateProof(identity, group, message, scope) // "the scope, together with the user's private key, is used to generate the nullifier"
await verifyProof(proof)                                           // off-chain
```
```solidity
struct SemaphoreProof { uint256 merkleTreeDepth; uint256 merkleTreeRoot; uint256 nullifier; uint256 message; uint256 scope; uint256[8] points; }
function validateProof(uint256 groupId, SemaphoreProof calldata proof) external;   // saves nullifier; reverts Semaphore__YouAreUsingTheSameNullifierTwice()
function verifyProof(uint256 groupId, SemaphoreProof calldata proof) external view returns (bool);
```
Circuit facts: `nullifier <== Poseidon(2)([scope, secret])`, `identityCommitment = Poseidon(2)([Ax, Ay])` with `(Ax, Ay) = BabyPbk()(secret)`, secret constrained `< l` (Baby Jubjub subgroup order), tree depth 1-32 via LeanIMT ([S34](#sources), [S41](#sources)).

Off-chain longfellow verification (the pilot path) ([S50](#sources)): `docker build -t zk -f Dockerfile ../.. && docker run -it -p 8888:8888 zk`, or `go build && ./server -circuit_dir ../../../lib/circuits/mdoc/circuits`; `POST /zkverify` returns `{"Status":true,"Claims":{...}}`; issuer CAs from `-cacerts <file>` (default `certs.pem`), "a setup useful for US-based RPs with AAMVA VICAL".

Porting a Ligero-style longfellow proof to the EVM, sized against today's rules (arithmetic is ours; constants are sourced):
- Proof size: 291 KB for the paper's toy credential (Table 12, [S45](#sources)); Dyne measured "an average of 325 KB" per single-claim mdoc proof ([S46](#sources)). The paper is explicit that the design targets prover time: "our system does not require verifier succinctness" ([S45](#sources) §2.1).
- Calldata alone: EIP-2028 charges 16 gas per non-zero byte ([S54](#sources) `TxDataNonZeroGasEIP2028 = 16`); EIP-7623 (Final) adds a floor of `TOTAL_COST_FLOOR_PER_TOKEN = 10` with non-zero bytes counting 4 tokens, i.e. 40 gas/byte for calldata-heavy transactions ([S52](#sources)). A 300 KB proof is ~4.9 M gas at 16 gas/byte and ~12.3 M gas under the floor, against EIP-7825's per-transaction cap of 16,777,216 gas ([S53](#sources), [S54](#sources) `MaxTxGas = 1 << 24`) and a 60 M block limit ([S55](#sources)). Blobs would not help: the verifier must read the bytes.
- Execution: the draft verifier recomputes `verify_merkle()` over SHA-256 for `NREQ` opened columns (132 in circuit v7), plus `low_degree_check`, `dot_check`, `quadratic_check` and per-layer sumcheck over GF(2^128) and Fp256 ([S47](#sources), [S44](#sources)). SHA-256 is a cheap precompile (60 + 12 per word, [S54](#sources)), but there is no precompile for GF(2^128) or P-256 field arithmetic, so the Reed-Solomon and sumcheck work would be plain EVM opcodes. No published Solidity verifier for Ligero or Brakedown proofs was found today [unverified: absence].
- Comparison points: a `bb`-generated UltraHonk verifier measured 2,396,575 gas versus 347,665 for Groth16 on the same P-256 (passkey) ECDSA circuit ([S27](#sources), 2025-09-02); ZKPassport ships ten generated verifier contracts (`OuterCount4…13.sol`, ~314-324 KB of Solidity each) behind one router ([S7](#sources), [S8](#sources)); the EVM code-size limit is 24,576 bytes today, 65,536 after Amsterdam ([S54](#sources)). Semaphore's Groth16 check costs one pairing of 4 points, 45,000 + 4 × 34,000 = 181,000 gas by the Istanbul constants ([S54](#sources)).
- Verdict: off-chain verification (252 ms amd64, 508 ms Pixel 9, [S45](#sources) Table 13) with onchain anchoring is the only viable pilot design; an EVM port requires wrapping longfellow verification in a SNARK, whose circuit does not exist.

Attaching a one-proof-per-person nullifier (design sketch, nothing here is built):
1. Registration: a guest proves a valid mDL (longfellow) and, in the same circuit run, outputs `nullifier = H(scope, s)` where `s` is a secret derivable only from the licence (e.g. a hash of the MSO's `deviceKey` or document number). Longfellow's mdoc circuit has no such output; it is a third circuit addition beyond M4's two. ZKPassport does this in-circuit today (`nullifier_type`, `scoped_nullifier` public inputs) and offers a salted variant where "an independent network of servers" applies an OPRF so that not even "the government that issued the ID" can recompute the identifier ([S21](#sources), [S15](#sources)).
2. Membership: the verify service (or a contract) adds a Semaphore identity commitment to a group once per nullifier; later actions use plain Semaphore proofs with a venue scope; `validateProof` enforces one action per identity per scope ([S33](#sources), [S32](#sources)). Cost reference from the v4 release notes: LeanIMT insert 143,434-252,195 gas per leaf for 16-1024 leaves ([S31](#sources)).
3. Trade-off to record in the pilot report: the device-bound key changes when a licence is re-provisioned, so a device-key-derived `s` gives one-proof-per-device, not per-person; a document-number-derived `s` is stable but needs the OPRF-style salt to stay unlinkable from the DMV.

## Status and risks (maturity, reviews, maintenance, anything that threatens the plan)
- ZKPassport maturity: live on Ethereum mainnet, Sepolia and Base ("If you need a specific chain, please reach out"), sub-verifier 0.20.0 deployed 2026-07-14 (derived from `deployed_at`), helper 0.18.0 2026-05-06 (derived) ([S19](#sources), [S8](#sources)). Onchain verification requires `mode: "compressed-evm"`, and the API exposes a `cloudProverUrl` that "overrides the cloud prover for compressed proofs" ([S20](#sources)); whether the EVM outer proof is produced on the phone or in that cloud prover, and what the prover sees, is not stated [unverified]. Proof times: base proofs "10s to 50s", disclosure proofs "less than 1s to 10s" ([S17](#sources)).
- ZKPassport review status: SDK README, "ZKPassport has undergone multiple internal audits, but it has not yet had an external audit"; circuits SECURITY.md, "currently under internal and external review", vulnerability contact `security@aztec-labs.com` ([S13](#sources), [S10](#sources)). Changelog shows the proving system has been swapped repeatedly (Barretenberg 0.82.2 patch "which patches a vulnerability in UltraHonk" at v0.3.0; Barretenberg 2.0.3 at v0.10.0; new `ZKPassportRootVerifier` at v0.12.0 with "The interface changes slightly") and older proofs stop verifying after upgrades ([S18](#sources)). Pinning matters: circuits use `bb-v5.0.0` while aztec-packages is at v5.2.0 ([S4](#sources), [S24](#sources)).
- UltraHonk verifier: HashCloak (2026-03-31) notes "there was no writeup or documentation to follow beyond the code itself" ([S59](#sources)); zkVerify supports "only the zk flavor" and "only Keccak256" for the transcript ([S28](#sources)); the `barretenberg/sol` README covers the Plonk verifier and says "ONLY Ultra verifier as rolled versions were removed" ([S26](#sources)). Gas per ZKPassport onchain verification is not published anywhere fetched today [unverified].
- Semaphore: v4 since 2024-07-25, v4.14.3 on 2026-07-08, MIT, 15 deployments (7 mainnet, 8 testnet; corrected 2026-09-02, was 18) ([S31](#sources), [S30](#sources), [S40](#sources), [S60](#sources)). The March 2024 PSE audit of `v4.0.0-beta.1` lists 3 critical, 3 high, 2 medium, 3 low findings plus 8 gas and 6 informational items; each carries an "Implemented fix" line (20 PR references to 19 distinct PRs, corrected 2026-09-02 from 22; two gas items and one informational item kept as-is) ([S42](#sources)). It is an internal PSE audit, not an external one [unverified whether an external audit of v4 exists]. Groth16 means a trusted setup ("circuits compiled during trusted setup", depth 1-32) ([S39](#sources)).
- Longfellow: no EVM story in the repo, docs, IETF draft or slides ([S43](#sources), [S51](#sources), [S47](#sources), [S49](#sources)); IETF 125 slides claim "3 security reviews have been completed. (Trail of Bits, Ligero, ISRG) No issues raised wrt to the ZK scheme" ([S49](#sources)), while the project landing page still says it "is currently undergoing two independent security reviews by panels of academic and industry experts" ([S51](#sources), checked 2026-09-02); no review report has been published at either location [unverified: no report found]. The scheme is deliberately non-succinct for the verifier ([S45](#sources)).
- Plan impact: nothing here blocks M0-M9. The M9 "port onchain?" decision should be pre-answered as "no direct port; off-chain verify plus ERC-7812 anchoring; revisit only with a SNARK wrapper". Semaphore stays out of scope unless a uniqueness requirement is written into the pilot; adding it would add a third longfellow circuit change and a registration flow.

## Open questions for the partner call (bullets; these feed docs/PARTNERS.md)
- Aztec/ZKPassport: measured mainnet gas for `RootVerifier.verify` on an `outer_count_4` proof, proof byte length and public-input count? Is the deployed verifier the ZK flavor (`BaseZKHonkVerifier`) or non-ZK?
- Does `compressed-evm` mode run the recursive outer proof on the phone or in the cloud prover? What does the cloud prover receive (witness, MRZ data, only inner proofs)?
- Has anyone at Aztec estimated a Noir circuit that verifies a Ligero + sumcheck proof over GF(2^128) (longfellow)? Constraint count, prover time, and would Aztec co-fund or review such a library?
- External audit timeline for the circuits and `registry-contracts`; who is the auditor; is `security@aztec-labs.com` the right escalation path?
- `RootRegistry` governance: who can add certificate/circuit roots, is there a timelock or guardian pause beyond `RootVerifier.pause()`; would they review Green Light's multi-sig plus 24 h timelock policy for the VICAL root?
- Would ZKPassport expose the OPRF salted-nullifier network to third-party circuits, or document its server operators, for a DMV-unlinkable per-person identifier?
- Semaphore/PSE: recommended pattern for gating group membership on an external credential proof; any production deployment doing this; is a nullifier extension to longfellow's mdoc circuit something PSE zkID would co-design with Google?
- Semaphore: confirm no external audit of v4 beyond the March 2024 PSE audit, and the current status of the trusted-setup artifacts for depths 1-32.
- Google longfellow: any plan for a SNARK-friendly or EVM-friendly variant, or a nullifier output derived from a document-bound secret?

## Sources (numbered list of every URL you fetched, with the date)
1. [S1] https://github.com/zkpassport/circuits — 2026-09-01
2. [S2] https://github.com/zkpassport/circuits/blob/main/README.md — 2026-09-01
3. [S3] https://github.com/zkpassport/circuits/blob/main/package.json — 2026-09-01
4. [S4] https://api.github.com/repos/zkpassport/circuits/tags — 2026-09-01
5. [S5] https://github.com/zkpassport/circuits/commit/1a1836eb958b7d7bbb47fab060128757748dba6a — 2026-09-01
6. [S6] https://github.com/zkpassport/circuits/blob/main/src/solidity/README.md — 2026-09-01
7. [S7] https://github.com/zkpassport/circuits/tree/main/src/solidity/src/ultra-honk-verifiers — 2026-09-01
8. [S8] https://github.com/zkpassport/circuits/blob/main/src/solidity/deployments/addresses-1.json — 2026-09-01
9. [S9] https://github.com/zkpassport/circuits/blob/main/src/solidity/src/SampleContract.sol — 2026-09-01
10. [S10] https://github.com/zkpassport/circuits/blob/main/SECURITY.md — 2026-09-01
11. [S11] https://github.com/zkpassport/zkpassport-packages — 2026-09-01
12. [S12] https://github.com/zkpassport/zkpassport-packages/blob/main/packages/zkpassport-sdk/package.json — 2026-09-01
13. [S13] https://github.com/zkpassport/zkpassport-packages/blob/main/packages/zkpassport-sdk/README.md — 2026-09-01
14. [S14] https://github.com/zkpassport/zkpassport-packages/blob/main/packages/registry-contracts/src/RootVerifier.sol — 2026-09-01
15. [S15] https://github.com/zkpassport/zkpassport-packages/blob/main/packages/registry-contracts/src/SubVerifier.sol — 2026-09-01
16. [S16] https://github.com/zkpassport/zkpassport-packages/blob/main/packages/registry-contracts/src/IProofVerifier.sol — 2026-09-01
17. [S17] https://docs.zkpassport.id/faq — 2026-09-01
18. [S18] https://docs.zkpassport.id/changelog and https://github.com/zkpassport/zkpassport-docs/blob/main/docs/changelog.md — 2026-09-01
19. [S19] https://github.com/zkpassport/zkpassport-docs/blob/main/docs/getting-started/onchain.md (rendered at https://docs.zkpassport.id/getting-started/onchain) — 2026-09-01
20. [S20] https://github.com/zkpassport/zkpassport-docs/blob/main/docs/api.md — 2026-09-01
21. [S21] https://github.com/zkpassport/zkpassport-docs/blob/main/docs/examples/salted-identifiers.md — 2026-09-01
22. [S22] https://docs.zkpassport.id/intro — 2026-09-01
23. [S23] https://barretenberg.aztec.network/docs/how_to_guides/how-to-solidity-verifier/ — 2026-09-01
24. [S24] https://github.com/AztecProtocol/aztec-packages/releases — 2026-09-01
25. [S25] https://github.com/AztecProtocol/aztec-packages/tree/master/barretenberg/sol/src/honk — 2026-09-01
26. [S26] https://raw.githubusercontent.com/AztecProtocol/aztec-packages/master/barretenberg/sol/README.md — 2026-09-01
27. [S27] https://blog.base.dev/benchmarking-zkp-systems — 2026-09-01
28. [S28] https://docs.zkverify.io/architecture/verification_pallets/ultrahonk — 2026-09-01
29. [S29] https://github.com/semaphore-protocol/semaphore — 2026-09-01
30. [S30] https://github.com/semaphore-protocol/semaphore/releases/tag/v4.14.3 — 2026-09-01
31. [S31] https://github.com/semaphore-protocol/semaphore/releases/tag/v4.0.0 — 2026-09-01
32. [S32] https://github.com/semaphore-protocol/semaphore/blob/main/packages/contracts/contracts/interfaces/ISemaphore.sol — 2026-09-01
33. [S33] https://raw.githubusercontent.com/semaphore-protocol/semaphore/main/packages/contracts/contracts/Semaphore.sol — 2026-09-01
34. [S34] https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/src/semaphore.circom — 2026-09-01
35. [S35] https://github.com/semaphore-protocol/semaphore/blob/main/packages/contracts/contracts/README.md — 2026-09-01
36. [S36] https://docs.semaphore.pse.dev/guides/proofs — 2026-09-01
37. [S37] https://docs.semaphore.pse.dev/guides/identities — 2026-09-01
38. [S38] https://docs.semaphore.pse.dev/technical-reference/circuits — 2026-09-01
39. [S39] https://docs.semaphore.pse.dev/technical-reference/contracts — 2026-09-01
40. [S40] https://docs.semaphore.pse.dev/deployed-contracts — 2026-09-01
41. [S41] https://docs.semaphore.pse.dev/benchmarks — 2026-09-01
42. [S42] https://semaphore.pse.dev/Semaphore_4.0.0_Audit.pdf — 2026-09-01
43. [S43] https://github.com/google/longfellow-zk (page, latest commit, tags via API) — 2026-09-01
44. [S44] https://github.com/google/longfellow-zk/releases — 2026-09-01
45. [S45] https://eprint.iacr.org/2024/2010.pdf — 2026-09-01
46. [S46] https://news.dyne.org/longfellow-zero-knowledge-google-zk/ — 2026-09-01
47. [S47] https://www.ietf.org/archive/id/draft-google-cfrg-libzk-02.html — 2026-09-01
48. [S48] https://datatracker.ietf.org/doc/draft-google-cfrg-libzk/ — 2026-09-01
49. [S49] https://datatracker.ietf.org/meeting/125/materials/slides-125-cfrg-longfellow-zk-00 — 2026-09-01
50. [S50] https://raw.githubusercontent.com/google/longfellow-zk/main/reference/verifier-service/server/README.md — 2026-09-01
51. [S51] https://google.github.io/longfellow-zk/ — 2026-09-01
52. [S52] https://eips.ethereum.org/EIPS/eip-7623 — 2026-09-01
53. [S53] https://eips.ethereum.org/EIPS/eip-7825 — 2026-09-01
54. [S54] https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go — 2026-09-01
55. [S55] https://ethereum.org/latest/building-on-ethereum-in-2026/ — 2026-09-01
56. [S56] https://dev.risczero.com/api/blockchain-integration/risc-zero-on-eth — 2026-09-01
57. [S57] https://github.com/orgs/noir-lang/discussions/8560 — 2026-09-01
58. [S58] https://github.com/zkpassport/zkpassport-packages/blob/main/packages/registry-contracts/package.json — 2026-09-01
59. [S59] https://hashcloak.com/blog/understanding-the-ultrahonk-verifier — 2026-09-01
60. [S60] https://raw.githubusercontent.com/semaphore-protocol/semaphore/main/packages/utils/src/networks/deployed-contracts.json (15 entries) — 2026-09-02
61. [S61] https://raw.githubusercontent.com/zkpassport/zkpassport-docs/main/LICENSE — 2026-09-02

Fetched but returned 404 today: https://noir-lang.org/docs/how_to/how-to-solidity-verifier and the `/docs/dev/` variant (the how-to now lives at [S23]); https://docs.zkpassport.id/examples/onchain-verification (moved to `getting-started/onchain`, [S19]).

## Verification
_Independent re-check on 2026-09-02 against live sources (GitHub API and raw files, rendered docs pages, PDFs via pdftotext). 94 factual claims checked: every Sources URL was fetched (all resolve; the three URLs listed as 404 on 2026-09-01 still return 404); every commit hash, tag, version, date, address, gas constant, byte size, quote and table figure in the body was compared with the source._

Corrections made:
- Semaphore v4 deployment count: the deployed-contracts page and the `deployed-contracts.json` it is generated from list 15 networks (7 mainnets, 8 testnets), not 18, and there is no Scroll mainnet entry (only Scroll Sepolia). Fixed in the summary, the "Where it lives" table and "Status and risks" ([S40], new [S60]).
- ZKPassport docs licence: the `zkpassport-docs` repo has a root Apache-2.0 `LICENSE`; the table cell was "not stated [unverified]" (new [S61]).
- RISC Zero quote: "notoriously difficult to verify on-chain due to their size" does not appear on the cited page today; replaced with the page's current sentence about wrapping STARKs in circom Groth16 SNARKs ([S56]).
- Semaphore audit: the PDF carries 20 "Implemented fix" PR references (19 distinct PRs), not 22; three items are kept as-is (two gas, one informational). Counts of critical/high/medium/low (3/3/2/3) were confirmed ([S42]).
- Barretenberg honk directory: `89b3b1c1` is the head of the default branch `next` (identical to `master`) on 2026-09-01, not a commit to the honk directory; the last commit touching `barretenberg/sol/src/honk` is `a69ffdf8` (2026-06-30). Row now says so and lists the three additional files present ([S25]).
- ZKPassport public-input layout: the docs' list ends at `scoped_nullifier`, but `SubVerifier.sol` on `main` reads a third trailing input `oprf_pk_hash` at `[len-1]`; a note was added so nobody copies the docs layout into a contract ([S15], [S19]).
- Base benchmark: clarified that the 2,396,575 vs 347,665 gas comparison is on a P-256 passkey ECDSA circuit ([S27]).
- Longfellow review status: added that the project landing page still says two reviews are "currently undergoing" while the IETF 125 slides say three are complete; no report is published ([S49], [S51]).

Confirmed as stated (no change): circuits `main` @ `1a1836eb` 2026-08-06 "feat: add NONE nullifier type (#152)", tags `noir-v1.0.0-beta.22`/`bb-v5.0.0`, package 0.20.0, `@aztec/bb.js` 5.0.0, LICENSE 11,340 B; zkpassport-packages `main` @ `a843c1e3`, SDK 0.16.2, registry-contracts 0.2.1 private, no tags, no root LICENSE; all mainnet addresses and `deployed_at` timestamps in `addresses-1.json` (1784055743 = 2026-07-14, 1778063471 = 2026-05-06); ten `OuterCount4…13.sol` at 313,663–324,235 bytes; `ROOT_REGISTRY_ADDRESS=0xB6bF…3FaB`; SECURITY.md and SDK README quotes; changelog entries (v0.15.x top, 0.82.2 at v0.3.0, 2.0.3 at v0.10.0, RootVerifier at v0.12.0); FAQ proof times; api.md `cloudProverUrl` and 500-byte bind limit; salted-identifier quotes; bb how-to v0.87.0, commands, signature, precompile sentence; aztec-packages v5.2.0 2026-08-17; barretenberg/sol README quote; zkVerify quotes; HashCloak 2026-03-31 quote; Semaphore MIT, `main` @ `4dbc39b8`, v4.14.3 2026-07-08, v4.0.0 2024-07-25, LeanIMT 143,434/252,195 gas, contract addresses, `SemaphoreProof` struct, `validateProof`/`verifyProof`, circom nullifier/commitment/`< l`, depths 1–32, soldeer `~4.6.0`, identities/proofs quotes; longfellow Apache-2.0, `main` @ `5f348de0` 2026-08-12, v0.9 2026-03-31, v0.8.6 "rate 7, 132 columns" note, verifier-service README commands; eprint Table 12 (291 kb), Table 13 verifier times (252/508/142 ms), §2.1 "does not require verifier succinctness", Alg. 10 public statement, SHA-256-only assumption; Dyne "average of 325 KB"; draft-google-cfrg-libzk-02 (2026-07-22) function names and fields, no EVM mention; IETF 125 slides review sentence; go-ethereum constants (16, 1<<24, 60+12, 45,000+34,000, 24,576/65,536); EIP-7623 Final with floor 10 and 4 tokens per non-zero byte; EIP-7825 Final 16,777,216; ethereum.org 60 M; docs/PLAN.md M9 exit gate and docs/PARTNERS.md 2026-10-09 reply-by.

Still unverified:
- Licence of the `barretenberg/sol` Honk Solidity sources (not checked in-tree; aztec-packages is a mixed-licence monorepo).
- Gas cost of a ZKPassport `RootVerifier.verify` call on mainnet (not published on any fetched page).
- Whether `compressed-evm` outer proofs are produced on the phone or in the `cloudProverUrl` prover, and what that prover receives.
- Absence of any published Solidity verifier for Ligero/Brakedown-style proofs (absence claim; nothing found, not proven).
- Whether any external audit of Semaphore v4 exists beyond the March 2024 internal PSE audit.
- Existence of a published longfellow security-review report from Trail of Bits, Ligero or ISRG (slides assert completion; no report located).
