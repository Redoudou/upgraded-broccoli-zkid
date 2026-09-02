# ERC-7812 ZK identity registry by Rarimo
_Researched 2026-09-01; every source re-fetched and checked 2026-09-02 (see Verification). Every claim carries a source link. Unverified statements are marked [unverified]._

## What it is
ERC-7812 "ZK Identity Registry" is a Standards-Track ERC, created 2024-11-08 by Artem Chystiakov, Oleksandr Kurbatov and Yaroslav Panasenko (Rarimo), Michael Elliot (ZKPassport) and Vitalik Buterin, that defines "an on-chain registry system for storing and proving abstract statements" so that users "store commitments to their private data to later prove its validity and authenticity via zero knowledge" [[1]](#sources) [[37]](#sources). Its status is **Review**, set by commit `7b828729` "Update ERC-7812: Move to Review" on 2025-06-25 (PR #1100); no later change to the file exists [[3]](#sources) [[4]](#sources). Two contracts make up the system: a singleton `EvidenceRegistry` that accepts `addStatement` / `updateStatement` / `removeStatement` and records a timestamp for every historical root, and an `EvidenceDB` that is a Sparse Merkle Tree of height 80 hashed with Poseidon, writable only by the registry [[2]](#sources) [[13]](#sources) [[14]](#sources). Every key is namespaced as `hash(msg.sender, key)`, which is the whole access-control model: "no entity but issuer can alter their content", and the contract has no owner, allow-list or upgrade path [[2]](#sources) [[13]](#sources). The reference implementation is `rarimo/evidence-registry` (CC0-1.0), deterministically deployed on Ethereum mainnet and Sepolia at `0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812` on 2025-05-14 [[7]](#sources) [[23]](#sources) [[25]](#sources). As of today the mainnet singleton has exactly one transaction (its initializer) and one event (`Initialized`), i.e. nobody has written a statement to it yet [[26]](#sources).

## Where it lives
| Item | URL | Licence | Version / tag / commit seen today |
|---|---|---|---|
| ERC-7812 text | https://eips.ethereum.org/EIPS/eip-7812 | CC0 ("Copyright and related rights waived via CC0") [[1]](#sources) | Status Review; created 2024-11-08; no `requires` field [[1]](#sources) [[2]](#sources) |
| ERC source and assets | https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7812.md ; assets folder `assets/erc-7812/{circuits,contracts,images}` | CC0 | last commit to the file `7b828729`, 2025-06-25 "Move to Review" [[3]](#sources) [[5]](#sources) |
| Discussion thread | https://ethereum-magicians.org/t/erc-7812-zk-identity-registry/21624 | — | 25 posts (the first page of the thread shows 20); opened 2024-11-08 by Arvolear; last post 2025-06-26 by Arvolear announcing the move to Review [[6]](#sources) |
| Reference implementation | https://github.com/rarimo/evidence-registry | CC0-1.0 (LICENSE file and every `SPDX-License-Identifier`) [[8]](#sources) [[11]](#sources) [[13]](#sources) | HEAD `fc0731b0d1175c8cb3eff4450ce10a2568500e12` 2025-05-14 "Merge pull request #4 from rarimo/dev" (author Arvolear); `pushed_at` 2025-05-14; 12 stars, 6 forks, 1 open issue, not archived; two contributors (Arvolear 22 commits, KyrylR 22 commits) [[8]](#sources) [[9]](#sources) [[50]](#sources) |
| npm package | https://www.npmjs.com/package/@rarimo/evidence-registry | CC0-1.0 | 0.3.0 published 2025-05-14; earlier versions 0.1.0 and 0.1.1 (2025-02-17), 0.2.0 and 0.2.1 (2025-02-20) [[22]](#sources) |
| Mainnet `EvidenceRegistry` | https://etherscan.io/address/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812 | CC0-1.0 per the `SPDX-License-Identifier` in the verified source; Etherscan's own licence field is blank ("-NA-") | Etherscan "Exact Match" verified, solc 0.8.26, optimizer 1000 runs; created by the deterministic deployment proxy `0x4e59b44847b379578588920cA78FbF26c0B4956C` in tx `0x40e392536b33d4a7d229f7ae6263eaa3297a8e65e10070a9a2281822762932ba`; initialised in tx `0xb994c75130c81c40e6b7897471dc571878fd7d9601fbcbe5707f331e19d8e86c`, block 22481313, 2025-05-14 12:09:11 UTC; 1 transaction total; libraries `PoseidonUnit2L` flagged "unverified library" by Etherscan [[23]](#sources) [[26]](#sources) |
| Mainnet `EvidenceDB` | https://etherscan.io/address/0xb93fb4a2B4c441937b0d4feA4337999943bacf67 | CC0-1.0 | verified `EvidenceDB`; creation tx `0x3fbcd4455466d6a3929a35fe0c0d7195e2a96aa1b0adc520ae5d46ca7940bac3`, 2025-05-14; 1 transaction [[24]](#sources) [[27]](#sources) |
| Sepolia `EvidenceRegistry` | https://sepolia.etherscan.io/address/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812 | CC0-1.0 | verified "Exact Match"; init tx `0x70a4bbf3c7efed045d766e7ce920b9dbd9648617be33f842a87cf016d4aa69f6` 2025-05-14 11:52:48 UTC; 1 transaction [[25]](#sources) [[28]](#sources) |
| Rarimo docs, ZK Registry | https://docs.rarimo.com/zk-registry/ ; https://docs.rarimo.com/zk-registry/network-info/ | — | overview page "Last updated" 2025-05-01, network page "Last updated" 2025-11-10; network page lists only the Rarimo ZK Rollup (chain id 7368, RPC https://l2.rarimo.com, explorer https://scan.rarimo.com/) plus the L1 rollup contracts, no ERC-7812 addresses [[31]](#sources) [[33]](#sources) |
| Rarimo audits page | https://docs.rarimo.com/resources/audits/ | — | page "Last updated" 2025-04-08; four Halborn reports (voting contracts 2024-03-12, passport circuits and identity provider 2024-03-16, iOS/Android apps 2024-03-26); none covers the registry [[35]](#sources) |
| OpenZeppelin `TimelockController` | https://docs.openzeppelin.com/contracts/5.x/api/governance#TimelockController ; source https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/TimelockController.sol | MIT [[41]](#sources) | latest release v5.7.0, 2026-07-29 [[42]](#sources); the reference repo pins 5.1.0 [[12]](#sources) |
| Safe smart account | https://github.com/safe-global/safe-smart-account | LGPL-3.0 (GitHub licence metadata) [[51]](#sources) | latest release v1.5.0, 2025-07-03 [[45]](#sources) |
| Zodiac Delay Modifier (Safe-native alternative, not recommended, see risks) | https://github.com/gnosisguild/zodiac-modifier-delay | LGPL-3.0+ [[46]](#sources) | G0 Group audit Sept 2021; latest GitHub release v1.1.0 (2023-11-07); Delay Modifier v1.1.0 named in the ENS forum security notice of 2026-06-04 [[46]](#sources) [[48]](#sources) [[52]](#sources) |

## How Green Light uses it
- **SPEC §1 and §2, row "Trust-list anchor".** The box "DMV trust list → AAMVA VICAL root → ERC-7812 onchain" is this component; the row says "Live on mainnet — Publish VICAL Merkle root; multi-sig". Both halves check out, with one qualification: the contract is live and verified on mainnet, but has never been written to, so Green Light would be the first tenant of the singleton [[23]](#sources) [[26]](#sources).
- **SPEC §4 trust-list pipeline, §6 item 4, §8 trust hole, §10 decision 3, ADR-0003.** "Publish root over HTTPS and to ERC-7812; refresh on each VICAL update", fronted by "multi-sig, public changelog, and a 24-hour timelock on root updates" with EEA, PSE and one DMV as signers. In ERC-7812 terms Green Light owns exactly one statement: `key` = a fixed label, `value` = the current VICAL Merkle root, written under the namespace of whichever address calls the registry. With the Safe → TimelockController wiring below, that address is the **timelock**, so the verify service pins `getIsolatedKey(<timelock>, key)` and reads `EvidenceDB.getValue(...)` (offchain in the pilot; SPEC §4 "onchain verification: not in pilot") [[2]](#sources) [[15]](#sources).
- **PLAN M5 (weeks 3–6, Sep 21 – Oct 11), owner eng A + Rarimo.** Deliverable "ERC-7812 publisher: writes the root to the registry from a multi-sig with a 24 h timelock"; exit gate "root published to HTTPS and a testnet ERC-7812 slot … timelock test in TEST-PLAN group E green". The Sepolia deployment at the same address serves the gate; the tests below already exercise E2 (single signer cannot publish), E3 (24 h timelock) and DOD line 62. PARTNERS.md gives the Rarimo ask a reply-by of 2026-09-18, owner eng A.
- **SIMPLICITY.md "No custom contracts."** Confirmed feasible: registry (deployed), Safe (deployed product) and OpenZeppelin TimelockController (library) are all off the shelf; Green Light deploys one `TimelockController` instance and nothing else.
- **Field constraint that reaches M4/M5.** The ERC says the registry "MUST NOT accept keys or values beyond the underlying elliptic curve prime field size (21888242871839275222246405745257275088548364400416034343698204186575808495617 for BN128)", and the contract reverts with `NumberNotInPrimeField` [[2]](#sources) [[13]](#sources) [[15]](#sources). A SHA-256 Merkle root is a 256-bit number and is out of range roughly half the time, so `packages/trust-list` must either build the VICAL tree with Poseidon (field-sized root, ZK-friendly for the M4 membership check) or reduce/truncate the SHA-256 root before publishing. Decide in M5 week 1; it is the one place ERC-7812 constrains the circuit work.

## How to build or integrate
**Reference implementation, verbatim from the README** [[10]](#sources):
```sh
npm install
npm run test-all          # = npx hardhat zkit make && npx hardhat zkit verifiers && npx hardhat test
npx hardhat compile && npx hardhat run ./scripts/deploy.ts --network <network>   # deploys via the CREATE2 factory
```
The README warns: "Do not modify the code, lint solidity files, or update compiler/hardhat settings", because the bytecode must stay identical for the deterministic address [[7]](#sources) [[10]](#sources). `deploy.ts` uses factory `0x4e59b44847b379578588920ca78fbf26c0b4956c`, salt `0x04834e07…caed0` for the registry and `0x7812…7812` for Poseidon, and `maxHeight` 80 [[18]](#sources). Toolchain: Hardhat, `@solarity/hardhat-zkit`, `@solarity/solidity-lib` 2.7.10, `circomlib` 2.0.5, OpenZeppelin 5.1.0; circuits `EvidenceRegistrySMT.circom` (`pragma circom 2.1.9`, public input `root`, private `address, key, value, siblings[levels], auxKey, auxValue, auxIsEmpty, isExclusion`) and `SparseMerkleTree.circom`, plus a generated `EvidenceRegistrySMTGroth16Verifier.sol` [[12]](#sources) [[17]](#sources) [[20]](#sources). Rarimo publishes no registry-specific SDK: its docs navigation lists ZK Registry Rollup, ZK Passport and ZKML Bionetta (infrastructure), Unforgettable Recovery, ZK Liveness, ZK Likeness and ZK Graph (solutions), and Rarimo App and Freedom Tool (apps), and the only registry-related repos in the GitHub org are `evidence-registry` and a workshop (`zk-bluetick-workshop`) [[30]](#sources) [[38]](#sources).

**Interface Green Light calls** (verbatim, `contracts/interfaces/IEvidenceRegistry.sol`) [[15]](#sources):
```solidity
event RootUpdated(bytes32 indexed prev, bytes32 indexed curr);
error NumberNotInPrimeField(bytes32 key); error KeyAlreadyExists(bytes32 key); error KeyDoesNotExist(bytes32 key);
function addStatement(bytes32 key, bytes32 value) external;
function removeStatement(bytes32 key) external;
function updateStatement(bytes32 key, bytes32 newValue) external;
function getRootTimestamp(bytes32 root) external view returns (uint256); // latest root MUST return block.timestamp, unknown root 0
function getIsolatedKey(address source, bytes32 key) external view returns (bytes32); // = PoseidonUnit2L.poseidon([bytes32(uint256(uint160(source))), key])
```
Read side on `EvidenceDB` (`0xb93f…cf67`): `getRoot()`, `getValue(bytes32 key)`, `getProof(bytes32 key)` returning `{root, siblings[], existence, key, value, auxExistence, auxKey, auxValue}`; only the registry may call `add/remove/update` (`onlyEvidenceRegistry`) [[2]](#sources) [[14]](#sources).

**Getting a "slot".** There is no onboarding: the ERC's rationale says users "only need to trust a single, permissionaless [sic], immutable smart contract" and Rarimo's docs call the registry "permissionless" [[2]](#sources) [[31]](#sources) [[32]](#sources). The first `addStatement(key, value)` from an address creates that address's slot; nothing else is required from Rarimo. The partner ask is therefore for review and co-design, not for access.

**Safe + TimelockController wiring (SPEC §8, ADR-0003).** Per OpenZeppelin, the timelock "ensures that whichever maintenance operation is ordered by the proposers is subject to a delay"; the recommended configuration is to grant proposer/executor "to a secure governance contract such as a DAO or a multisig", and to renounce the admin so it is "self administered" [[39]](#sources) [[40]](#sources). Constructor and calls, verbatim from the source [[41]](#sources):
```solidity
constructor(uint256 minDelay, address[] memory proposers, address[] memory executors, address admin)
function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay) public virtual onlyRole(PROPOSER_ROLE)
function execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt) public payable virtual onlyRoleOrOpenRole(EXECUTOR_ROLE)
function cancel(bytes32 id) public virtual onlyRole(CANCELLER_ROLE)
```
Green Light instance: `minDelay = 86400`, `proposers = [Safe]` (proposer + canceller), `executors = [address(0)]` (anyone may execute once ready, per the docs), `admin = address(0)` [[39]](#sources). The Safe (EEA + PSE + DMV signers, threshold set in the root policy) submits `schedule(registry, 0, abi.encodeCall(updateStatement, (key, newRoot)), 0x0, salt, 86400)` as a Safe "Contract interaction" transaction, exactly as in OpenZeppelin's Safe-plus-timelock tutorial; 24 h later any account calls `execute` with the same arguments [[43]](#sources). The Safe can `cancel(hashOperation(...))` during the window, which is the emergency-removal path DOD line 63 asks for.

**Gas of a root update.** No on-chain data point exists (the singleton is empty on both networks) and the ERC only says the registry keeps "the minimal viable (gas-wise) history of roots" [[2]](#sources) [[26]](#sources) [[28]](#sources). The author's only public figure is in the thread (Arvolear, 2025-06-01): cost "heavily depends on the size of the registry, as the operational complexity grows logarithmically", with an SMT-insertion gas table posted as an image and "another ~50k on top of that" for the `EvidenceRegistry` wrapper [[6]](#sources). Numbers below were **measured locally** (2026-09-01, re-run 2026-09-02, see Verification) with Hardhat on the fetched source (`fc0731b0`, solc 0.8.26, depth 80) and are not from a live chain; the thread's data point "Poseidon hash implementation in circomlibjs for 2 and 3 uint256 elements take 54K and 70K gas respectively" (Andriian, 2024-12-13) explains why cost scales with tree depth; the library documents `add`/`update`/`remove` as "O(log(n)), where n is the max depth of the tree" [[6]](#sources) [[16]](#sources) [[21]](#sources).
| Operation (measured 2026-09-01, local Hardhat; 2026-09-02 re-run in parentheses where it differs by more than 1%) | Gas |
|---|---|
| `addStatement`, empty tree (Green Light's first publication if still first) | 245,875 |
| `updateStatement`, tree of 1 leaf (a root refresh while we are the only tenant) | 160,118 |
| `addStatement`, leaves 2–64 (depends on the keys chosen) | avg 639,178, max 1,057,223 (re-run: avg 651,669, max 1,137,902) |
| `updateStatement`, tree of 64 leaves | avg 500,267, max 616,533 (re-run: avg 506,193, max 664,057) |
| `updateStatement`, tree of 1,025 leaves | 622,575 [unverified: not reproduced in the 2026-09-02 re-run] |
| `removeStatement`, tree of 64 leaves | 424,844 |
| Via `TimelockController`: `schedule` / `execute(addStatement, empty tree)` / `execute(updateStatement, 1 leaf)` / `cancel` | 57,758 (re-run 55,198) / 263,210 (re-run measured on a 64-leaf tree instead: 759,078) / 177,453 [unverified: not reproduced] / 25,924 |
| `TimelockController` deployment (one-off) | 1,759,775 |
Timelock overhead is about 17 k gas per write; the Safe's own `execTransaction` overhead was not measured [unverified]. Selector check: the single mainnet and Sepolia transactions carry method id `0xeac876fb`, which is `keccak("__EvidenceRegistry_init(address)")[:4]` computed locally with `cast sig` (4byte.directory returned no usable result) [[26]](#sources) [[28]](#sources) [[49]](#sources).

**Test wiring for TEST-PLAN E2/E3** (what was run locally, to be moved into `packages/trust-list`): deploy `TimelockController(86400, [safe], [0x0], 0x0)`; `schedule` from a non-proposer reverts (E2); `execute` reverts at +86,390 s and succeeds at +86,400 s (E3); `db.getValue(reg.getIsolatedKey(timelock, key)) == newRoot`; `reg.getRootTimestamp(db.getRoot()) == block.timestamp` (the same assertion the repo's own test makes); a scheduled-then-cancelled update never executes [[19]](#sources) [[21]](#sources) [[41]](#sources).

## Status and risks
- **Standard not final.** Review since 2025-06-25 with no activity in the ERC file since, none in the thread since the author's Review announcement on 2025-06-26, and none in the repo since 2025-05-14 (last push); an interface fix already forced one redeployment, from `0x781268D4…7812` (2025-02-18) to the current address (2025-05-14) because `getIsolatedKey()` "was not public" [[3]](#sources) [[6]](#sources) [[8]](#sources). Pin the address in config and in the root policy; do not derive it.
- **"Live on mainnet" means deployed, not used.** One transaction, one `Initialized` event, no `RootUpdated`, on both mainnet and Sepolia [[26]](#sources) [[28]](#sources). Rarimo's production registries run on its own rollup (chain 7368) and the ZK Passport contract page lists `StateKeeper`, `RegistrationSMT`, `CertificatesSMT`, `Registration2` with no reference to the ERC-7812 singleton; the Q1 2025 newsletter says "Rarimo launched the ZK registry as a roll-up" [[33]](#sources) [[34]](#sources) [[37]](#sources). The singleton does **not** exist on the Rarimo L2: `eth_getCode` for `0x7812…7812` against https://l2.rarimo.com (chain id `0x1cc8` = 7368) returns `0x`; the explorer's address page is a JavaScript shell and its API returns 404, so the RPC check is the evidence [[29]](#sources).
- **No audit of the registry.** Rarimo's audits page lists four Halborn reports, none for `evidence-registry`; the repo mentions tests only; Etherscan shows the linked `PoseidonUnit2L` library as unverified bytecode [[23]](#sources) [[35]](#sources). The contract is immutable (no owner, no proxy: Blockscout `proxy_type: null`), so a bug cannot be patched in place [[13]](#sources) [[26]](#sources). Green Light's audit (M8) should include the registry read path and the Poseidon library.
- **Cost depends on other tenants.** Because the SMT is shared, a root refresh rises from ~160 k gas (empty tree) to ~620 k gas at ~1,000 leaves in the local measurement; a busy singleton makes every VICAL refresh cost more. Mitigation: refresh only on VICAL change (TEST E7), and keep the HTTPS root as the primary distribution channel.
- **Permissionless cuts both ways.** Anyone can publish a statement under their own address; the only thing that makes Green Light's root "the" root is that verifiers pin the timelock address. The root policy document (DOD line 63) must name that address and the Safe signers.
- **Maintenance concentration.** The reference repo has two contributors (Arvolear and KyrylR, 22 commits each); the five most recent commits are all by Arvolear, and the org search shows no other registry tooling beyond a workshop repo [[9]](#sources) [[38]](#sources) [[50]](#sources). CC0 licensing means Green Light can fork without permission, which caps the dependency risk.
- **Timelock choice.** OpenZeppelin's `TimelockController` is the pattern SIMPLICITY.md names and is maintained (v5.7.0, 2026-07-29) [[42]](#sources). The Safe-native alternative, Zodiac Delay Modifier, defaults to a 24 h cooldown but its v1.1.0 (the latest release, 2023-11-07) was named in a June 2026 security notice (the ENS post gives no technical detail and reports no loss); Safe's own docs warn "A malicious module can take over a Safe" [[44]](#sources) [[47]](#sources) [[48]](#sources). Stay with the timelock-as-external-contract pattern.
- **Schedule.** Nothing here blocks M5: the Sepolia slot is free, the code compiles and the timelock tests pass locally in under a minute. The only M5 design decision is the root encoding (Poseidon vs reduced SHA-256), which must be settled with the M4 circuit owner.

## Open questions for the partner call
- Is the mainnet singleton at `0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812` the deployment Rarimo wants integrators to use, or is the Rarimo rollup (chain 7368) the intended home? Nothing is deployed at that address on the rollup today; if a registry lives there under another address, which one, and is there an L2→L1 root relay we could reuse (the docs mention syncing the root to Ethereum)?
- Any planned interface change before Last Call/Final, and any intention to redeploy again? Would Rarimo commit to keeping `0x7812…7812` stable and to announcing changes on the Magicians thread?
- Has `evidence-registry` (contracts, Poseidon libraries, `EvidenceRegistrySMT.circom`) been audited? Can the `PoseidonUnit2L`/`3L` library bytecode be source-verified on Etherscan?
- Recommended encoding for a 256-bit issuer-certificate Merkle root as a field element; do they have a registrar template or circuit for "value under isolated key equals X against root R" that Green Light could reuse for the post-pilot onchain verifier?
- Do they expect the mainnet tree to fill (cost to us grows with depth)? Any real gas figures from their own registrars?
- Is root history retained indefinitely, and what grace window do they recommend for stale roots (TEST B6)?
- Would Rarimo review the root policy document and the Safe/timelock configuration, and name a technical contact (public channels found: Telegram https://t.me/+pWugh5xgDiE3Y2Jk, GitHub https://github.com/rarimo) [[36]](#sources)?

## Sources
All fetched 2026-09-01 (local time; the session crossed into 2026-09-02 UTC for later fetches) and re-fetched 2026-09-02 for verification.
1. https://eips.ethereum.org/EIPS/eip-7812
2. https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-7812.md
3. https://api.github.com/repos/ethereum/ERCs/commits?path=ERCS/erc-7812.md&per_page=5
4. https://api.github.com/search/issues?q=repo:ethereum/ERCs+7812+is:pr&sort=updated&order=desc&per_page=10
5. https://api.github.com/repos/ethereum/ERCs/contents/assets/erc-7812
6. https://ethereum-magicians.org/t/erc-7812-zk-identity-registry/21624
7. https://github.com/rarimo/evidence-registry
8. https://api.github.com/repos/rarimo/evidence-registry
9. https://api.github.com/repos/rarimo/evidence-registry/commits?per_page=3
10. https://raw.githubusercontent.com/rarimo/evidence-registry/main/README.md
11. https://raw.githubusercontent.com/rarimo/evidence-registry/main/LICENSE
12. https://raw.githubusercontent.com/rarimo/evidence-registry/main/package.json
13. https://raw.githubusercontent.com/rarimo/evidence-registry/main/contracts/EvidenceRegistry.sol
14. https://raw.githubusercontent.com/rarimo/evidence-registry/main/contracts/EvidenceDB.sol
15. https://raw.githubusercontent.com/rarimo/evidence-registry/main/contracts/interfaces/IEvidenceRegistry.sol
16. https://raw.githubusercontent.com/rarimo/evidence-registry/main/contracts/libraries/SparseMerkleTree.sol
17. https://raw.githubusercontent.com/rarimo/evidence-registry/main/circuits/EvidenceRegistrySMT.circom
18. https://raw.githubusercontent.com/rarimo/evidence-registry/main/scripts/deploy.ts
19. https://raw.githubusercontent.com/rarimo/evidence-registry/main/test/EvidenceRegistry.test.ts
20. https://api.github.com/repos/rarimo/evidence-registry/contents/contracts and https://api.github.com/repos/rarimo/evidence-registry/contents/circuits
21. https://codeload.github.com/rarimo/evidence-registry/tar.gz/refs/heads/main (source tarball built and measured locally with Hardhat; gas tables above)
22. https://registry.npmjs.org/@rarimo/evidence-registry
23. https://etherscan.io/address/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812
24. https://etherscan.io/address/0xb93fb4a2B4c441937b0d4feA4337999943bacf67
25. https://sepolia.etherscan.io/address/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812
26. https://eth.blockscout.com/api/v2/addresses/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812 (and `/transactions`, `/logs`, `/internal-transactions`)
27. https://eth.blockscout.com/api/v2/addresses/0xb93fb4a2B4c441937b0d4feA4337999943bacf67
28. https://eth-sepolia.blockscout.com/api/v2/addresses/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812/transactions
29. https://scan.rarimo.com/address/0x781246D2256dc0C1d8357c9dDc1eEe926a9c7812 (page is a JavaScript shell; API `/api/v2/addresses/...` returns 404) and JSON-RPC `eth_getCode` / `eth_chainId` against https://l2.rarimo.com (result `0x`, chain id 7368)
30. https://docs.rarimo.com/
31. https://docs.rarimo.com/zk-registry/
32. https://raw.githubusercontent.com/rarimo/docs/main/docs/zk-registry/overview.mdx
33. https://docs.rarimo.com/zk-registry/network-info/
34. https://docs.rarimo.com/zk-passport/contracts/
35. https://docs.rarimo.com/resources/audits/
36. https://rarimo.com/
37. https://rarimo.com/learning-hub/rarimo-newsletter-q1-60
38. https://api.github.com/search/repositories?q=org:rarimo+registry&sort=updated&per_page=15
39. https://docs.openzeppelin.com/contracts/5.x/api/governance#TimelockController
40. https://docs.openzeppelin.com/contracts/5.x/access-control
41. https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/governance/TimelockController.sol
42. https://api.github.com/repos/OpenZeppelin/openzeppelin-contracts/releases/latest
43. https://forum.openzeppelin.com/t/tutorial-on-using-a-gnosis-safe-multisig-with-a-timelock-to-upgrade-contracts-and-use-functions-in-a-proxy-contract/7272
44. https://docs.safe.global/advanced/smart-account-modules
45. https://github.com/safe-global/safe-smart-account/releases/latest
46. https://github.com/gnosisguild/zodiac-modifier-delay
47. https://github.com/gnosisguild/zodiac-modifier-delay/blob/main/docs/setup_guide.md
48. https://discuss.ens.domains/t/security-update-zodiac-roles-modifier-v2-and-delay-modifier-v1-1-0/22161
49. https://www.4byte.directory/api/v1/signatures/?hex_signature=0xeac876fb (returned only API documentation; selector computed locally with `cast sig`)
50. https://api.github.com/repos/rarimo/evidence-registry/contributors
51. https://api.github.com/repos/safe-global/safe-smart-account
52. https://api.github.com/repos/gnosisguild/zodiac-modifier-delay/releases

## Verification
Checked 2026-09-02 by re-fetching every URL in the Sources section (curl for JSON/raw endpoints and JSON-RPC, WebFetch for HTML pages, `gh api` where the anonymous GitHub API was rate-limited) and by re-running the local Hardhat gas and timelock script on a fresh download of the `main` tarball (`fc0731b0`). 96 claims checked (URLs resolving and saying what is cited; every version, date, count, hash, address, quote and status in the tables and prose above).

Corrections made:
- Magicians thread: 25 posts, not 20 (the first page shows 20); last post is 2025-06-26 (Arvolear, Review announcement), not 2025-05-14. Same fix applied to the "Standard not final" risk.
- Safe smart account latest release v1.5.0 was published 2025-07-03, not 2024-07-03; licence filled in as LGPL-3.0 from GitHub metadata (was [unverified]).
- Rarimo docs pages are dated, not "undated": ZK Registry overview last updated 2025-05-01, network page 2025-11-10, audits page 2025-04-08. Audit dates listed per report (03-12, 03-16, 03-16, 03-26).
- Rarimo L2: the singleton is confirmed absent at `0x7812…7812` on chain 7368 (`eth_getCode` returns `0x`); previously [unverified]. Open question and source 29 updated.
- Reference repo has two contributors (Arvolear and KyrylR, 22 commits each), not a single author; the "maintenance concentration" risk now says so.
- npm: versions 0.1.1 and 0.2.1 also exist; added.
- Rarimo docs product list corrected to the actual navigation (adds Unforgettable Recovery, ZK Liveness, ZK Likeness; names the workshop repo).
- Etherscan licence field for the mainnet registry is blank; CC0-1.0 comes from the SPDX header of the verified source. Noted in the table.
- Gas section: added the author's public estimate from the thread (2025-06-01, logarithmic growth plus ~50k wrapper overhead); recorded the 2026-09-02 re-run figures next to the originals (all within about 8%, differences driven by key choice) and clarified that the `execute(addStatement)` row was measured on an empty tree.
- Zodiac Delay Modifier: added the latest release (v1.1.0, 2023-11-07) and the fact that the ENS notice carries no technical detail.

Confirmed without change (selection): ERC status Review, created 2024-11-08, authors, no `requires`, commit `7b828729` on 2025-06-25 via PR #1100, assets folder; all quoted ERC sentences including "permissionaless"; repo stars/forks/issue/pushed_at and HEAD commit; README, package.json pins (OZ 5.1.0, solidity-lib 2.7.10, circomlib 2.0.5), deploy.ts factory/salts/height 80, circuit pragma and signals, interface text; mainnet and Sepolia creation/init tx hashes, block 22481313 and timestamps, 1 transaction and 1 `Initialized` log each, Blockscout `proxy_type: null`, Etherscan Exact Match / solc 0.8.26 / 1000 runs / unverified `PoseidonUnit2L`; method id `0xeac876fb` = `cast sig "__EvidenceRegistry_init(address)"`; OZ v5.7.0 (2026-07-29), TimelockController signatures and doc quotes, forum tutorial (2021-04-23); Safe docs warning; Zodiac LGPL-3.0+, G0 audit Sept 2021, default 24 h cooldown; ENS notice dated 2026-06-04; Rarimo network page (chain 7368, RPC, explorer), ZK Passport contract names, Q1 2025 newsletter quote, Telegram and GitHub links; PLAN M5 dates and owner, PARTNERS reply-by 2026-09-18, DOD lines 62–63, TEST-PLAN E2/E3/E7/B6, SIMPLICITY "No custom contracts". Local re-run reproduced E2 (non-proposer `schedule` reverts), E3 (`execute` reverts at +86,390 s, succeeds at +86,400 s), the isolated-key read-back, `getRootTimestamp == block.timestamp`, and cancel-then-never-execute.

Left unverified:
- `updateStatement` at 1,025 leaves (622,575 gas) and `execute(updateStatement, 1 leaf)` (177,453 gas): not reproduced in the re-run.
- The Safe `execTransaction` overhead on top of the timelock (never measured).
- Whether a registry under a different address exists on the Rarimo rollup (only the canonical address was checked).

