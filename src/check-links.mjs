import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const exists = (urlPath) => {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return fs.existsSync(path.join(ROOT, 'index.html'));
  const rel = clean.replace(/^\//, '');
  const asFile = path.join(ROOT, rel);
  const asDir = path.join(ROOT, rel, 'index.html');
  return fs.existsSync(asFile) || fs.existsSync(asDir);
};

let problems = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const relFile = f.replace(ROOT + path.sep, '');
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
  const missing = [...new Set(refs)].filter((r) => !exists(r));
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '(sin title)';
  const canonical = (html.match(/rel="canonical" href="([^"]*)"/) || [])[1] || '(sin canonical)';
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
  const h1txt = h1 ? h1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '(sin h1)';
  console.log(`\n${relFile}`);
  console.log(`  title    : ${title}`);
  console.log(`  canonical: ${canonical}`);
  console.log(`  h1       : ${h1txt.slice(0, 70)}`);
  console.log(`  jsonld   : ${(html.match(/application\/ld\+json/g) || []).length} bloque(s)`);
  if (missing.length) {
    problems += missing.length;
    console.log(`  ❌ ENLACES ROTOS: ${missing.join(', ')}`);
  } else {
    console.log(`  ✓ ${new Set(refs).size} enlaces internos OK`);
  }
}
console.log(`\nTOTAL: ${files.length} páginas, ${problems} problemas.`);
