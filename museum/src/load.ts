import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseExhibit } from "./parse.js";
import type { Exhibit } from "./types.js";

/** Read every top-level `*.md` in the exhibits dir (skips subfolders like artifacts/). */
export async function loadExhibits(dir: string): Promise<Exhibit[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const exhibits: Exhibit[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".md")) continue;
    const path = join(dir, entry.name);
    exhibits.push(parseExhibit(path, await readFile(path, "utf8")));
  }
  // Sort by accession number so the gallery reads in acquisition order.
  return exhibits.sort((a, b) => a.acquisition.localeCompare(b.acquisition));
}
