// Reproducible build: copy src/ to dist/ byte-for-byte, no timestamps, sorted. Test D7. Real bundling lands in M3.
import { mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true }); mkdirSync('dist');
for (const f of readdirSync('src').sort()) copyFileSync(`src/${f}`, `dist/${f}`);
