import { describe, it, expect } from "vitest";
import { renderIndex, renderExhibit, escapeHtml } from "../src/render.js";
import { computeStats } from "../src/stats.js";
import type { Exhibit } from "../src/types.js";

function exhibit(over: Partial<Exhibit> = {}): Exhibit {
  return {
    slug: "chrono-keeper",
    title: "ChronoKeeper",
    subtitle: "A time-tracking app",
    acquisition: "MAFP-001",
    status: "deceased",
    born: "2021-03-12",
    died: "2021-05-02",
    lifespanDays: 51,
    causeOfDeath: "Scope creep.",
    medium: "React",
    era: "The Firebase Period",
    donor: "weekend-you",
    lastCommit: "feat: wip",
    tags: ["react", "productivity"],
    artifacts: [],
    timeline: [{ date: "2021-03-12", event: "git init" }],
    notes: ["WHY"],
    curatorNote: "<p>eulogy</p>",
    ...over,
  };
}

describe("escapeHtml", () => {
  it("escapes the dangerous five", () => {
    expect(escapeHtml(`<a href="x" o='y'>&`)).toBe("&lt;a href=&quot;x&quot; o=&#39;y&#39;&gt;&amp;");
  });
});

describe("renderIndex", () => {
  const exhibits = [exhibit(), exhibit({ slug: "someday", title: "Someday", status: "cryogenic", lifespanDays: undefined, died: undefined, tags: ["someday"] })];
  const html = renderIndex(exhibits, computeStats(exhibits));

  it("is a full document with both specimens and a working status filter", () => {
    expect(html.startsWith("<!doctype html")).toBe(true);
    expect(html).toContain('href="exhibit/chrono-keeper.html"');
    expect(html).toContain('href="exhibit/someday.html"');
    expect(html).toContain('data-filter-status="cryogenic"');
    expect(html).toContain('data-tags="react productivity"');
  });

  it("shows the lobby stats placard", () => {
    expect(html).toContain("specimens preserved");
    expect(html).toContain("51"); // collective lifespan
  });

  it("does not turn unknown archive lifespans into zero days or a cause of death", () => {
    const records = [exhibit({ recordType: "archive", status: "dormant", born: undefined, died: undefined, lifespanDays: undefined })];
    const archiveHtml = renderIndex(records, computeStats(records));
    expect(archiveHtml).toContain("Archive note");
    expect(archiveHtml).not.toContain("days of collective ambition");
    expect(archiveHtml).not.toContain("Cause of death");
    expect(archiveHtml).not.toContain('data-filter-status="deceased"');
  });
});

describe("renderExhibit", () => {
  it("distinguishes an archive record from a fictional death timeline", () => {
    const html = renderExhibit(exhibit({ recordType: "archive", status: "dormant", born: undefined, died: undefined, lifespanDays: undefined }));
    expect(html).toContain("From the repository record");
    expect(html).toContain("Archive note");
    expect(html).not.toContain("Cause of death");
    expect(html).not.toContain("Timeline of collapse");
    expect(html).not.toContain("<dt>Died</dt>");
  });
  it("renders the plaque, epitaph, timeline, and notes", () => {
    const html = renderExhibit(exhibit());
    expect(html).toContain("ChronoKeeper");
    expect(html).toContain("Cause of death");
    expect(html).toContain("Scope creep.");
    expect(html).toContain("Timeline of collapse");
    expect(html).toContain("git init");
    expect(html).toContain("class=\"note\"");
    expect(html).toContain("../assets/museum.css");
  });

  it("renders a 'not recovered' placeholder for a missing screenshot", () => {
    const html = renderExhibit(
      exhibit({ artifacts: [{ type: "screenshot", src: "artifacts/gone.png", missing: true, caption: "lost" }] }),
    );
    expect(html).toContain("Artifact not recovered");
    expect(html).not.toContain('<img');
  });

  it("renders a code fragment with escaped contents", () => {
    const html = renderExhibit(
      exhibit({ artifacts: [{ type: "fragment", lang: "ts", code: "if (a < b) {}" }] }),
    );
    expect(html).toContain("lang-ts");
    expect(html).toContain("if (a &lt; b)");
  });
});
