// Copyright 2026 Green Light contributors. Apache-2.0.
// Build a root from a directory of DER/PEM issuer certs. Synthetic VICAL until AAMVA access (ADR-0003).
// Usage: node src/cli.js <certs-dir> > root.txt
import { loadCertsDir } from './certs.js';
import { buildTree } from './merkle.js';

const dir = process.argv[2];
if (!dir) { console.error('usage: cli.js <certs-dir>'); process.exit(2); }
process.stdout.write(buildTree(loadCertsDir(dir).map(c => c.der)).root + '\n');
