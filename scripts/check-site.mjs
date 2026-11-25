// Prepared by Codex (GPT-6 AI agent), at Kayla's request.
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(output);
new Script(await readFile(join(output, 'nullify/getting-started.js'), 'utf8'), { filename: 'nullify/getting-started.js' });
assert(!files.some(path => /(?:package(?:-lock)?\.json|PROVENANCE\.md|\.ts)$/.test(path)), 'Only browser output may be published');
for (const [project, route] of [['nullify', 'nullify'], ['bureau-of-small-decisions', 'bureau']]) {
  assert.deepEqual(await readFile(join(output, route, 'index.html')), await readFile(join(root, project, 'index.html')), `${project} HTML must remain unchanged`);
}
for (const route of ['nullify', 'bureau', 'museum', 'machine']) await stat(join(output, route, 'index.html'));
let links = 0;
for (const file of files.filter(path => path.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) continue;
    const target = resolve(dirname(file), decodeURIComponent(href.split(/[?#]/)[0]));
    assert(target.startsWith(output), `Link must stay inside site: ${href}`);
    const info = await stat(target).catch(() => null);
    assert(info, `Missing local link or asset in ${file}: ${href}`);
    if (info.isDirectory()) await stat(join(target, 'index.html'));
    links++;
  }
}
console.log(`Site checked: ${files.length} files, ${links} local links/assets, unchanged HTML toys.`);
