import { STATUS_LABEL } from "./types.js";
import type { Artifact, Exhibit, MuseumStats, TimelineEntry } from "./types.js";

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );
}

function page(title: string, body: string, cssHref: string, jsHref?: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital@0;1&family=JetBrains+Mono:wght@400;600&family=Caveat&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${cssHref}" />
</head>
<body>
${body}
${jsHref ? `<script src="${jsHref}" defer></script>` : ""}
</body>
</html>
`;
}

function lifespan(e: Exhibit): string {
  if (typeof e.lifespanDays !== "number") return "lifespan unknown";
  if (e.lifespanDays === 0) return "lived less than a day";
  if (e.lifespanDays === 1) return "lived 1 day";
  return `lived ${e.lifespanDays} days`;
}

function statusStamp(status: Exhibit["status"]): string {
  return `<span class="stamp stamp--${status}">${escapeHtml(STATUS_LABEL[status])}</span>`;
}

// --- index / lobby -----------------------------------------------------------

function lobbyStats(stats: MuseumStats): string {
  const rows: string[] = [
    `<div class="stat"><span class="stat__num">${stats.total}</span><span class="stat__label">specimens preserved</span></div>`,
  ];
  if (stats.shortestLived) rows.push(`<div class="stat"><span class="stat__num">${stats.totalLifespanDays.toLocaleString()}</span><span class="stat__label">recorded days of collective ambition</span></div>`);
  if (stats.shortestLived) {
    rows.push(
      `<div class="stat"><span class="stat__num">${stats.shortestLived.days}d</span><span class="stat__label">shortest life · ${escapeHtml(stats.shortestLived.title)}</span></div>`,
    );
  }
  if (stats.topCause && stats.byStatus.deceased > 0) {
    rows.push(
      `<div class="stat"><span class="stat__num">“${escapeHtml(stats.topCause)}”</span><span class="stat__label">leading cause of death</span></div>`,
    );
  }
  return `<div class="stats">${rows.join("")}</div>`;
}

function specimenCard(e: Exhibit): string {
  const tags = e.tags.map((t) => escapeHtml(t)).join(" ");
  return `<a class="case" href="exhibit/${escapeHtml(e.slug)}.html" data-status="${e.status}" data-tags="${tags}">
  <div class="case__glass"></div>
  <div class="case__plate">
    <span class="acq">${escapeHtml(e.acquisition)}</span>
    ${statusStamp(e.status)}
  </div>
  <h2 class="case__title">${escapeHtml(e.title)}</h2>
  ${e.subtitle ? `<p class="case__subtitle">${escapeHtml(e.subtitle)}</p>` : ""}
  <p class="case__meta">${e.medium ? escapeHtml(e.medium) : ""}${e.recordType === "archive" ? "" : " · " + lifespan(e)}</p>
  <p class="case__cause"><span class="case__cause-label">${e.recordType === "archive" ? "Archive note" : "Cause of death"}</span>${escapeHtml(e.causeOfDeath)}</p>
</a>`;
}

export function renderIndex(
  exhibits: Exhibit[],
  stats: MuseumStats,
  opts: { cssHref?: string; jsHref?: string } = {},
): string {
  const cssHref = opts.cssHref ?? "assets/museum.css";
  const jsHref = opts.jsHref ?? "assets/museum.js";
  const allTags = [...new Set(exhibits.flatMap((e) => e.tags))].sort();
  const personalCollection = exhibits.some(e => e.recordType === "archive");

  const body = `<header class="lobby">
  <p class="lobby__kicker">Accession in progress</p>
  <h1 class="lobby__title">The Museum of<br/>Almost-Finished Projects</h1>
  <p class="lobby__blurb">${personalCollection ? `Earlier experiments from Kayla's archive, with their ambitions intact.
  Please admire the ideas without assigning them a tragic ending.` : `A permanent collection of the things we started and did not finish.
  Each specimen is preserved exactly as it was abandoned — mid-thought, mid-refactor,
  mid-rename. Please do not attempt to revive the exhibits.`}</p>
  ${personalCollection ? `<p class="lobby__blurb">Curated by Codex (GPT-6 AI agent), from Kayla's project records. Descriptions follow the original READMEs; the museum commentary is new. Dormant means the repository is archived, not that the project failed.</p>` : ""}
  ${lobbyStats(stats)}
</header>

<nav class="filters" aria-label="Filter exhibits">
  <button class="filter is-active" data-filter-status="all">All</button>
  ${(["deceased", "dormant", "cryogenic"] as const).filter(status => exhibits.some(e => e.status === status)).map(status => `<button class="filter" data-filter-status="${status}">${status === "cryogenic" ? "Frozen" : STATUS_LABEL[status]}</button>`).join("\n")}
  ${allTags.length ? `<span class="filters__sep"></span>` : ""}
  ${allTags
    .map((t) => `<button class="filter filter--tag" data-filter-tag="${escapeHtml(t)}">#${escapeHtml(t)}</button>`)
    .join("")}
</nav>

<main class="gallery">
${exhibits.map(specimenCard).join("\n")}
</main>

<footer class="colophon">
  <p>Donations accepted. Drop a markdown file in <code>exhibits/</code> and rebuild.</p>
</footer>`;

  return page("The Museum of Almost-Finished Projects", body, cssHref, jsHref);
}

// --- exhibit page ------------------------------------------------------------

function renderArtifact(a: Artifact): string {
  if (a.type === "fragment" && a.code) {
    return `<figure class="relic relic--fragment">
  <pre class="fragment"><code class="lang-${escapeHtml(a.lang ?? "text")}">${escapeHtml(a.code.replace(/\n+$/, ""))}</code></pre>
  ${a.caption ? `<figcaption>${escapeHtml(a.caption)}</figcaption>` : ""}
</figure>`;
  }
  if (a.type === "screenshot") {
    const inner = a.missing
      ? `<div class="relic__lost"><span>Artifact not recovered</span><small>The image was lost to time (and a since-deleted branch).</small></div>`
      : `<img loading="lazy" src="${escapeHtml(a.src ?? "")}" alt="${escapeHtml(a.caption ?? "recovered screenshot")}" />`;
    return `<figure class="relic relic--screenshot">
  <div class="relic__frame">${inner}</div>
  ${a.caption ? `<figcaption>${escapeHtml(a.caption)}</figcaption>` : ""}
</figure>`;
  }
  // generic relic
  return `<figure class="relic relic--object">
  <div class="relic__frame"><div class="relic__lost"><span>${escapeHtml(a.caption ?? "Unlabeled relic")}</span></div></div>
</figure>`;
}

function renderTimeline(entries: TimelineEntry[], archiveRecord = false): string {
  if (entries.length === 0) return "";
  const items = entries
    .map((t, i) => {
      const last = i === entries.length - 1;
      return `<li class="strata${last ? " strata--final" : ""}" style="--i:${i}">
  <span class="strata__date">${escapeHtml(t.date)}</span>
  <span class="strata__event">${escapeHtml(t.event)}</span>
</li>`;
    })
    .join("\n");
  return `<section class="exhibit__section">
  <h3 class="section-head">${archiveRecord ? "From the repository record" : "Timeline of collapse"}</h3>
  <ol class="timeline">${items}</ol>
</section>`;
}

function renderNotes(notes: string[]): string {
  if (notes.length === 0) return "";
  const cards = notes
    .map(
      (n, i) =>
        `<li class="note" style="--rot:${(i % 2 === 0 ? 1 : -1) * (1 + (i % 3))}deg">${escapeHtml(n)}</li>`,
    )
    .join("\n");
  return `<section class="exhibit__section">
  <h3 class="section-head">Recovered marginalia</h3>
  <ul class="notes">${cards}</ul>
</section>`;
}

function dl(label: string, value?: string): string {
  if (!value) return "";
  return `<div class="spec"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

export function renderExhibit(
  e: Exhibit,
  opts: { cssHref?: string; jsHref?: string } = {},
): string {
  const cssHref = opts.cssHref ?? "../assets/museum.css";
  const jsHref = opts.jsHref;

  const screenshots = e.artifacts.filter((a) => a.type !== "fragment");
  const fragments = e.artifacts.filter((a) => a.type === "fragment");

  const body = `<a class="back" href="../index.html">← Return to the collection</a>

<article class="exhibit">
  <header class="exhibit__plaque">
    <div class="exhibit__plate">
      <span class="acq">${escapeHtml(e.acquisition)}</span>
      ${statusStamp(e.status)}
    </div>
    <h1 class="exhibit__title">${escapeHtml(e.title)}</h1>
    ${e.subtitle ? `<p class="exhibit__subtitle">${escapeHtml(e.subtitle)}</p>` : ""}
    <p class="epitaph"><span class="epitaph__label">${e.recordType === "archive" ? "Archive note" : "Cause of death"}</span>${escapeHtml(e.causeOfDeath)}</p>
  </header>

  <dl class="specsheet">
    ${dl("Medium", e.medium)}
    ${dl("Curated by", e.recordType === "archive" ? "Codex (GPT-6 AI agent), from Kayla's project records" : undefined)}
    ${dl("Era", e.era)}
    ${dl("Born", e.born)}
    ${dl("Died", e.died)}
    ${dl("Lifespan", typeof e.lifespanDays === "number" ? `${e.lifespanDays} days` : undefined)}
    ${dl("Donated by", e.donor)}
    ${dl("Final transmission", e.lastCommit)}
  </dl>

  ${e.curatorNote ? `<section class="exhibit__section curator"><h3 class="section-head">Curator's note</h3>${e.curatorNote}</section>` : ""}

  ${screenshots.length ? `<section class="exhibit__section"><h3 class="section-head">Recovered artifacts</h3><div class="relics">${screenshots.map(renderArtifact).join("\n")}</div></section>` : ""}

  ${fragments.length ? `<section class="exhibit__section"><h3 class="section-head">Fragments</h3>${fragments.map(renderArtifact).join("\n")}</section>` : ""}

  ${renderTimeline(e.timeline, e.recordType === "archive")}

  ${renderNotes(e.notes)}

  ${e.tags.length ? `<footer class="exhibit__tags">${e.tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join("")}</footer>` : ""}
</article>`;

  return page(`${e.title} · The Museum of Almost-Finished Projects`, body, cssHref, jsHref);
}
