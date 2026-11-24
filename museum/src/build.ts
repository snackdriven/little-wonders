import { cp, mkdir, copyFile, rm, writeFile, stat } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadExhibits } from "./load.js";
import { computeStats } from "./stats.js";
import { renderIndex, renderExhibit } from "./render.js";
import type { Exhibit } from "./types.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const EXHIBITS_DIR = join(root, "exhibits");
const ASSETS_DIR = join(here, "assets");
const OUT_DIR = join(root, "dist");

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve each screenshot artifact: copy recovered images into the output and
 * rewrite their `src` to the exhibit-page-relative URL; flag the rest as lost.
 */
async function resolveArtifacts(exhibit: Exhibit): Promise<void> {
  for (const a of exhibit.artifacts) {
    if (a.type !== "screenshot" || !a.src) continue;
    const onDisk = join(EXHIBITS_DIR, a.src);
    if (await exists(onDisk)) {
      const outName = `${exhibit.slug}__${basename(a.src)}`;
      await copyFile(onDisk, join(OUT_DIR, "artifacts", outName));
      a.src = `../artifacts/${outName}`;
    } else {
      a.missing = true;
    }
  }
}

async function build(): Promise<void> {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(join(OUT_DIR, "exhibit"), { recursive: true });
  await mkdir(join(OUT_DIR, "artifacts"), { recursive: true });

  const exhibits = await loadExhibits(EXHIBITS_DIR);
  for (const e of exhibits) await resolveArtifacts(e);

  const stats = computeStats(exhibits);

  await writeFile(join(OUT_DIR, "index.html"), renderIndex(exhibits, stats), "utf8");
  for (const e of exhibits) {
    await writeFile(
      join(OUT_DIR, "exhibit", `${e.slug}.html`),
      renderExhibit(e),
      "utf8",
    );
  }

  await cp(ASSETS_DIR, join(OUT_DIR, "assets"), { recursive: true });

  console.log(
    `built ${exhibits.length} exhibit(s) -> ${OUT_DIR}\n` +
      `  deceased: ${stats.byStatus.deceased} · dormant: ${stats.byStatus.dormant} · frozen: ${stats.byStatus.cryogenic}`,
  );
}

build().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exitCode = 1;
});
