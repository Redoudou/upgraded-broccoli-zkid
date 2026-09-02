// Copyright 2026 Green Light contributors. Apache-2.0.
// Reproducible build: copy the page sources plus the committed prover artifacts into dist/ byte for byte,
// sorted, no timestamps, then write dist/SHA256SUMS. Test D7 compares two independent builds.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
const inputs = [
  ...readdirSync('src').sort().map(f => [`src/${f}`, f]),
  ['../circuits/longfellow.js', 'longfellow.js'],
  ['../circuits/artifacts/longfellow.wasm', 'longfellow.wasm'],
  ['../circuits/artifacts/circuit-1.zst', 'circuit-1.zst'],
];
rmSync('dist', { recursive: true, force: true }); mkdirSync('dist');
let sums = '';
for (const [from, to] of inputs) {
  const b = readFileSync(from); writeFileSync(`dist/${to}`, b);
  sums += `${createHash('sha256').update(b).digest('hex')}  ${to}\n`;
}
writeFileSync('dist/SHA256SUMS', sums);
process.stdout.write(sums);
