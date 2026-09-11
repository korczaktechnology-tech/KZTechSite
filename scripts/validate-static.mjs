import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const required = ['index.html', 'assets/css/base.css', 'assets/js/main.js', '.nojekyll'];
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
for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  if (!/^<!doctype html>/i.test(text.trim())) throw Error(`Missing doctype: ${file}`);
  for (const match of text.matchAll(local)) {
    const target = resolve(dirname(file), match[1]);
    try { await access(target); }
    catch { throw Error(`Broken local reference: ${file} -> ${match[1]}`); }
  }
}

console.log(`Static validation passed: ${htmlFiles.length} HTML files.`);
