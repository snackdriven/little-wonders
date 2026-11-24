import { describe, it, expect } from "vitest";
import { parseExhibit, daysBetween } from "../src/parse.js";

describe("daysBetween", () => {
  it("counts whole days, clamps negatives, handles missing/invalid", () => {
    expect(daysBetween("2021-03-12", "2021-05-02")).toBe(51);
    expect(daysBetween("2021-05-02", "2021-03-12")).toBe(0);
    expect(daysBetween(undefined, "2021-05-02")).toBeUndefined();
    expect(daysBetween("nope", "2021-05-02")).toBeUndefined();
  });
});

const sample = `---
title: ChronoKeeper
subtitle: A time-tracking app
acquisition: MAFP-001
status: deceased
born: 2021-03-12
died: 2021-05-02
cause_of_death: "Scope creep."
medium: "React"
tags: [productivity, react]
last_commit: "feat: wip"
artifacts:
  - type: fragment
    lang: ts
    caption: "last function"
    code: |
      function x() {}
  - type: screenshot
    src: artifacts/shot.png
    caption: "the dashboard"
timeline:
  - date: 2021-03-12
    event: "git init"
  - date: 2021-05-02
    event: "last commit"
notes:
  - "WHY"
---

The body, which becomes the curator's note.
`;

describe("parseExhibit", () => {
  const e = parseExhibit("/exhibits/chrono-keeper.md", sample);

  it("derives slug and maps snake_case frontmatter", () => {
    expect(e.slug).toBe("chrono-keeper");
    expect(e.acquisition).toBe("MAFP-001");
    expect(e.causeOfDeath).toBe("Scope creep.");
    expect(e.lastCommit).toBe("feat: wip");
  });

  it("computes lifespan from born/died", () => {
    expect(e.lifespanDays).toBe(51);
  });

  it("parses artifacts, timeline, notes, and renders the body to HTML", () => {
    expect(e.artifacts).toHaveLength(2);
    expect(e.artifacts[0]).toMatchObject({ type: "fragment", lang: "ts" });
    expect(e.artifacts[1]).toMatchObject({ type: "screenshot", src: "artifacts/shot.png" });
    expect(e.timeline).toHaveLength(2);
    expect(e.notes).toEqual(["WHY"]);
    expect(e.curatorNote).toContain("<p>");
    expect(e.curatorNote).toContain("curator");
  });

  it("defaults status to deceased and cause when absent", () => {
    const bare = parseExhibit("/x/ghost.md", "---\ntitle: Ghost\n---\nbody");
    expect(bare.status).toBe("deceased");
    expect(bare.causeOfDeath).toMatch(/incomplete/i);
    expect(bare.lifespanDays).toBeUndefined();
  });

  it("keeps a cryogenic specimen with a birth but no death", () => {
    const frozen = parseExhibit(
      "/x/someday.md",
      "---\ntitle: Someday\nstatus: cryogenic\nborn: 2019-06-04\n---\n",
    );
    expect(frozen.status).toBe("cryogenic");
    expect(frozen.died).toBeUndefined();
    expect(frozen.lifespanDays).toBeUndefined();
  });
});
