// Copyright 2026 Green Light contributors. Apache-2.0.
// Deterministic Merkle tree over issuer cert hashes. Spec section 4 trust-list pipeline. Tests E1, E4.
// Leaves: sha256(DER cert). Sorted, deduplicated, so the root is input-order independent.
// Internal nodes: sha256(0x01 || left || right); leaves are prefixed 0x00 to prevent second-preimage tricks.
// Odd levels duplicate the last node.
import { createHash } from 'node:crypto';

const h = (...parts) => { const c = createHash('sha256'); for (const p of parts) c.update(p); return c.digest(); };

export function leafHash(certDer) { return h(Buffer.from([0]), createHash('sha256').update(certDer).digest()); }

export function buildTree(certDers) {
  const leaves = [...new Map(certDers.map(d => [leafHash(d).toString('hex'), leafHash(d)])).values()]
    .sort(Buffer.compare);
  if (leaves.length === 0) throw new Error('empty trust list; refusing to build a root');
  const levels = [leaves];
  while (levels.at(-1).length > 1) {
    const cur = levels.at(-1), next = [];
    for (let i = 0; i < cur.length; i += 2) next.push(h(Buffer.from([1]), cur[i], cur[i + 1] ?? cur[i]));
    levels.push(next);
  }
  return { root: levels.at(-1)[0].toString('hex'), levels };
}

export function inclusionProof(tree, certDer) {
  const leaf = leafHash(certDer);
  let idx = tree.levels[0].findIndex(l => l.equals(leaf));
  if (idx < 0) return null;
  const path = [];
  for (let lv = 0; lv < tree.levels.length - 1; lv++) {
    const cur = tree.levels[lv];
    const sib = idx % 2 === 0 ? (cur[idx + 1] ?? cur[idx]) : cur[idx - 1];
    path.push({ hash: sib.toString('hex'), left: idx % 2 === 1 });
    idx = Math.floor(idx / 2);
  }
  return path;
}

export function verifyInclusion(root, certDer, path) {
  let cur = leafHash(certDer);
  for (const { hash, left } of path) {
    const sib = Buffer.from(hash, 'hex');
    cur = left ? h(Buffer.from([1]), sib, cur) : h(Buffer.from([1]), cur, sib);
  }
  return cur.toString('hex') === root;
}
