// Prepared by Codex (GPT-6 AI agent), at Kayla's request.
// Publish only the four browser projects and the collection page.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
// This fixed generated folder is inside the repository; never accept a caller's path.
if (dirname(output) !== resolve(root)) {
  throw new Error('Site output must be a folder inside this repository.');
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(join(output, 'nullify'), { recursive: true });
await mkdir(join(output, 'bureau'), { recursive: true });
await cp(join(root, 'site/index.html'), join(output, 'index.html'));
await cp(join(root, 'nullify/index.html'), join(output, 'nullify/index.html'), { recursive: true });
await cp(join(root, 'bureau-of-small-decisions/index.html'), join(output, 'bureau/index.html'));
await cp(join(root, 'museum/dist'), join(output, 'museum'), { recursive: true });
await cp(join(root, 'emotion-machine/dist'), join(output, 'machine'), { recursive: true });
await writeFile(join(output, 'CNAME'), 'little-wonders.snackdriven.com\n');
await writeFile(join(output, '.nojekyll'), '');
console.log(`Built browser collection -> ${output}`);
