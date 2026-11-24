// Browser edition by Codex (GPT-6 AI agent), at Kayla's request.
// Emit native browser modules from the existing generator; no separate runtime or bundle is needed.
import ts from 'typescript';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../emotion-machine/', import.meta.url));
const out = join(root, 'dist');
await mkdir(join(out, 'src'), { recursive: true });
await mkdir(join(out, 'web'), { recursive: true });
for (const file of ['index.html', 'style.css']) await cp(join(root, 'web', file), join(out, file));
const sources = [
  ...((await readdir(join(root, 'src'))).filter(file => file.endsWith('.ts')).map(file => [`src/${file}`, `src/${file.replace(/\.ts$/, '.js')}`])),
  ['web/app.ts', 'web/app.js'],
];
for (const [source, destination] of sources) {
  const result = ts.transpileModule(await readFile(join(root, source), 'utf8'), {
    fileName: source,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
    reportDiagnostics: true,
  });
  const errors = result.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error) || [];
  if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
    getCanonicalFileName: file => file, getCurrentDirectory: () => root, getNewLine: () => '\n',
  }));
  await writeFile(join(out, destination), result.outputText);
}
console.log(`Built Emotion Machine browser edition -> ${out}`);
