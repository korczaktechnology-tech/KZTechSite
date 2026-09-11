import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const required = ['index.html', 'assets/css/base.css', 'assets/js/main.js', '.nojekyll', 'package.json', 'apps/api/src/server.mjs'];
for (const file of required) await access(resolve(root, file));

const htmlFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.github'].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
await walk(root);

const local = /(?:href|src)=["'](?!https?:|mailto:|#|javascript:)([^"'#?]+)["']/g;
const forms = /<form\b[^>]*data-api=["']([^"']+)["']/g;
const ids = /\bid=["']([^"']+)["']/g;
const refs = /href=["']#([^"']+)["']/g;
for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  if (!/^<!doctype html>/i.test(text.trim())) throw Error(`Missing doctype: ${file}`);
  if (!/<html\b[^>]*lang=["'][^"']+["']/i.test(text)) throw Error(`Missing html lang: ${file}`);
  for (const match of text.matchAll(local)) {
    const targetRef = match[1];
    if (targetRef.startsWith('assets/images/') || targetRef.startsWith('../assets/images/') || targetRef.startsWith('../../assets/images/')) continue;
    const target = resolve(dirname(file), targetRef);
    try { await access(target); } catch { throw Error(`Broken local reference: ${file} -> ${targetRef}`); }
  }
  const declaredIds = new Set([...text.matchAll(ids)].map(match => match[1]));
  for (const match of text.matchAll(refs)) if (!declaredIds.has(match[1])) throw Error(`Broken anchor: ${file} -> #${match[1]}`);
  for (const match of text.matchAll(forms)) if (!match[1].startsWith('/api/')) throw Error(`Form API must use /api/: ${file} -> ${match[1]}`);
}

const css = await readFile(resolve(root, 'assets/css/base.css'), 'utf8');
if (!css.includes(':focus-visible')) throw Error('Accessibility focus styles missing.');
if (!css.includes('prefers-reduced-motion')) throw Error('Reduced-motion support missing.');
if (!css.includes('.media-slot')) throw Error('Visual asset slot styles missing.');
const js = await readFile(resolve(root, 'assets/js/main.js'), 'utf8');
if (!js.includes('form[data-api]')) throw Error('Frontend form handler missing.');
if (!js.includes('assets/images/')) throw Error('Technology image contract missing.');

console.log(`Static validation passed: ${htmlFiles.length} HTML files, local links, anchors, forms and deferred PNG assets.`);
