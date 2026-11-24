import { basename, extname } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Artifact, Exhibit, ExhibitStatus, TimelineEntry } from "./types.js";

const VALID_STATUS: ExhibitStatus[] = ["deceased", "dormant", "cryogenic"];

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function asStringArray(v: unknown): string[] {
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  return [];
}

function toDate(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return asString(v);
}

/** Whole days between two YYYY-MM-DD dates, or undefined if either is missing/invalid. */
export function daysBetween(born?: string, died?: string): number | undefined {
  if (!born || !died) return undefined;
  const a = Date.parse(born);
  const b = Date.parse(died);
  if (Number.isNaN(a) || Number.isNaN(b)) return undefined;
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

function parseArtifacts(raw: unknown): Artifact[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): Artifact[] => {
    if (typeof item !== "object" || item === null) return [];
    const o = item as Record<string, unknown>;
    const type = asString(o.type);
    if (type !== "screenshot" && type !== "fragment" && type !== "relic") return [];
    return [
      {
        type,
        caption: asString(o.caption),
        src: asString(o.src),
        lang: asString(o.lang),
        code: typeof o.code === "string" ? o.code : undefined,
      },
    ];
  });
}

function parseTimeline(raw: unknown): TimelineEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): TimelineEntry[] => {
    if (typeof item !== "object" || item === null) return [];
    const o = item as Record<string, unknown>;
    const date = toDate(o.date) ?? "";
    const event = asString(o.event);
    if (!event) return [];
    return [{ date, event }];
  });
}

/** Parse one exhibit markdown file into a structured Exhibit. */
export function parseExhibit(path: string, content: string): Exhibit {
  const slug = basename(path, extname(path));
  const { data: fm, content: body } = matter(content);

  const statusRaw = asString(fm.status)?.toLowerCase();
  const status: ExhibitStatus =
    statusRaw && (VALID_STATUS as string[]).includes(statusRaw)
      ? (statusRaw as ExhibitStatus)
      : "deceased";

  const born = toDate(fm.born);
  const died = toDate(fm.died);
  const lifespanDays =
    typeof fm.lifespan_days === "number" ? fm.lifespan_days : daysBetween(born, died);

  return {
    slug,
    title: asString(fm.title) ?? slug,
    subtitle: asString(fm.subtitle),
    acquisition: asString(fm.acquisition) ?? slug.toUpperCase(),
    status,
    born,
    died,
    lifespanDays,
    causeOfDeath: asString(fm.cause_of_death) ?? "Unknown. The records are incomplete.",
    medium: asString(fm.medium),
    era: asString(fm.era),
    donor: asString(fm.donor),
    lastCommit: asString(fm.last_commit),
    tags: asStringArray(fm.tags),
    artifacts: parseArtifacts(fm.artifacts),
    timeline: parseTimeline(fm.timeline),
    notes: asStringArray(fm.notes),
    curatorNote: body.trim() ? (marked.parse(body, { async: false }) as string) : "",
  };
}
