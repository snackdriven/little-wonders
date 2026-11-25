/** How dead is it, really. */
export type ExhibitStatus = "deceased" | "dormant" | "cryogenic";

export const STATUS_LABEL: Record<ExhibitStatus, string> = {
  deceased: "Deceased",
  dormant: "Dormant",
  cryogenic: "Cryogenically frozen",
};

/** A preserved relic of the project: a screenshot, a code fragment, an object. */
export interface Artifact {
  type: "screenshot" | "fragment" | "relic";
  caption?: string;
  /** screenshot: path relative to the exhibits dir (set to output URL at build time). */
  src?: string;
  /** fragment: source language + code. */
  lang?: string;
  code?: string;
  /** Set at build time when a referenced screenshot file can't be found. */
  missing?: boolean;
}

/** One beat in the project's slow collapse. */
export interface TimelineEntry {
  date: string;
  event: string;
}

/** A single museum exhibit: one project that never made it. */
export interface Exhibit {
  /** A real repository record; avoid treating archive metadata as a death date. */
  recordType?: "archive";
  /** Derived from the filename. */
  slug: string;
  title: string;
  subtitle?: string;
  /** Accession number, e.g. "MAFP-001". */
  acquisition: string;
  status: ExhibitStatus;
  born?: string;
  died?: string;
  /** Days between born and died, when both are known. */
  lifespanDays?: number;
  causeOfDeath: string;
  /** The tech it was built from, like a specimen's material. */
  medium?: string;
  /** The geological era of its making, e.g. "The Firebase Period". */
  era?: string;
  /** Who donated the remains. */
  donor?: string;
  /** The last commit message before silence. */
  lastCommit?: string;
  tags: string[];
  artifacts: Artifact[];
  timeline: TimelineEntry[];
  /** Marginalia recovered from the dig site. */
  notes: string[];
  /** Rendered HTML of the markdown body — the curator's eulogy. */
  curatorNote: string;
}

export interface MuseumStats {
  total: number;
  byStatus: Record<ExhibitStatus, number>;
  totalLifespanDays: number;
  shortestLived?: { title: string; days: number };
  longestLived?: { title: string; days: number };
  topCause?: string;
}
