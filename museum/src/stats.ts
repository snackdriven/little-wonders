import type { Exhibit, ExhibitStatus, MuseumStats } from "./types.js";

/** Reduce one or two telling words out of a cause-of-death sentence. */
function causeKey(cause: string): string {
  return cause
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
    .slice(0, 1)
    .join(" ");
}

const STOPWORDS = new Set([
  "that", "this", "with", "into", "just", "more", "than", "then", "they",
  "them", "have", "been", "were", "would", "could", "never", "about", "their",
  "tried", "also", "everything", "thing", "things",
]);

/** Aggregate museum-wide stats for the lobby placard. */
export function computeStats(exhibits: Exhibit[]): MuseumStats {
  const byStatus: Record<ExhibitStatus, number> = {
    deceased: 0,
    dormant: 0,
    cryogenic: 0,
  };
  let totalLifespanDays = 0;
  let shortest: { title: string; days: number } | undefined;
  let longest: { title: string; days: number } | undefined;
  const causeCounts = new Map<string, number>();

  for (const e of exhibits) {
    byStatus[e.status] += 1;
    if (typeof e.lifespanDays === "number") {
      totalLifespanDays += e.lifespanDays;
      if (!shortest || e.lifespanDays < shortest.days) {
        shortest = { title: e.title, days: e.lifespanDays };
      }
      if (!longest || e.lifespanDays > longest.days) {
        longest = { title: e.title, days: e.lifespanDays };
      }
    }
    const key = causeKey(e.causeOfDeath);
    if (key) causeCounts.set(key, (causeCounts.get(key) ?? 0) + 1);
  }

  let topCause: string | undefined;
  let topCount = 0;
  for (const [key, count] of causeCounts) {
    if (count > topCount) {
      topCount = count;
      topCause = key;
    }
  }

  return {
    total: exhibits.length,
    byStatus,
    totalLifespanDays,
    shortestLived: shortest,
    longestLived: longest,
    topCause,
  };
}
