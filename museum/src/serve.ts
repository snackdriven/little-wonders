import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(here, "..", "dist");
const PORT = Number(process.env.PORT ?? 4173);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json",
};

const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]!);
    let rel = normalize(url).replace(/^(\.\.[/\\])+/, "");
    if (rel === "/" || rel === "") rel = "/index.html";
    let filePath = join(OUT_DIR, rel);

    const info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) filePath = join(filePath, "index.html");

    const data = await readFile(filePath);
    res.writeHead(200, { "content-type": MIME[extname(filePath)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404 — this exhibit, too, was never finished.</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`The museum is open at http://localhost:${PORT}`);
});
