import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const root=process.cwd();
const files=['index.html','assets/css/base.css','assets/js/main.js','.nojekyll'];
for(const f of files)await access(resolve(root,f));
const htmlFiles=[];
async function walk(dir){const {readdir}=await import('node:fs/promises');for(const name of await readdir(dir,{withFileTypes:true})){if(name.name==='node_modules'||name.name==='.git')continue;const p=resolve(dir,name.name);if(name.isDirectory())await walk(p);else if(name.name.endsWith('.html'))htmlFiles.push(p)}}
await walk(root);
const local=/(?:href|src)=["'](?!https?:|mailto:|#|javascript:)([^"'#?]+)["']/g;
for(const file of htmlFiles){const text=await readFile(file,'utf8');if(!/^<!doctype html>/i.test(text.trim()))throw Error(`Missing doctype: ${file}`);for(const match of text.matchAll(local)){const target=resolve(dirname(file),match[1]);try{await access(target)}catch{throw Error(`Broken local reference: ${file} -> ${match[1]}`)}}}
console.log(`Static validation passed: ${htmlFiles.length} HTML files.`);
