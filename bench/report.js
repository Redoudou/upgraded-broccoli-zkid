// Builds bench/REPORT.md from bench/results/*.json. Test C1-C6.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const p = (a, q) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
let md = '# M1 benchmark report\n\nlongfellow commit: ' + readFileSync('packages/circuits/LONGFELLOW_COMMIT', 'utf8').trim() + '\n\n| runtime-device | runs | failures | p50 ms | p95 ms | peak MB |\n|---|---|---|---|---|---|\n';
for (const f of readdirSync('bench/results').filter(f => f.endsWith('.json')).sort()) {
  const r = JSON.parse(readFileSync(`bench/results/${f}`, 'utf8'));
  const ok = r.filter(x => x.ok).map(x => x.ms);
  md += `| ${f.replace('.json', '')} | ${r.length} | ${r.length - ok.length} | ${p(ok, .5) ?? '-'} | ${p(ok, .95) ?? '-'} | ${Math.max(...r.map(x => x.peak_mb ?? 0))} |\n`;
}
writeFileSync('bench/REPORT.md', md);
console.log(md);
