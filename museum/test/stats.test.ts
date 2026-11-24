import { describe, it, expect } from "vitest";
import { computeStats } from "../src/stats.js";
import type { Exhibit } from "../src/types.js";

function e(over: Partial<Exhibit>): Exhibit {
  return {
    slug: "x",
    title: "X",
    acquisition: "MAFP-000",
    status: "deceased",
    causeOfDeath: "Unknown.",
    tags: [],
    artifacts: [],
    timeline: [],
    notes: [],
    curatorNote: "",
    ...over,
  };
}

describe("computeStats", () => {
  const exhibits = [
    e({ title: "A", status: "deceased", lifespanDays: 51, causeOfDeath: "Scope creep took over." }),
    e({ title: "B", status: "deceased", lifespanDays: 75, causeOfDeath: "Scope creep again, somehow." }),
    e({ title: "C", status: "dormant", lifespanDays: 2, causeOfDeath: "Ran out of weekend." }),
    e({ title: "D", status: "cryogenic", causeOfDeath: "Not dead, just frozen forever." }),
  ];
  const s = computeStats(exhibits);

  it("counts by status", () => {
    expect(s.total).toBe(4);
    expect(s.byStatus).toEqual({ deceased: 2, dormant: 1, cryogenic: 1 });
  });

  it("sums lifespans and finds the extremes", () => {
    expect(s.totalLifespanDays).toBe(128);
    expect(s.shortestLived).toEqual({ title: "C", days: 2 });
    expect(s.longestLived).toEqual({ title: "B", days: 75 });
  });

  it("surfaces the most common cause keyword", () => {
    expect(s.topCause).toBe("scope");
  });
});
