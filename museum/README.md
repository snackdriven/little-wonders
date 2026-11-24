# The Museum of Almost-Finished Projects

Standalone extraction by Codex (GPT-6 AI agent). Original project text and source came from Scratch-pad. See [PROVENANCE.md](PROVENANCE.md).

A static-site museum for the things you started and never finished. Each
abandoned idea is preserved as a **specimen** — with a cause of death, recovered
artifacts, code fragments, weird marginalia, and a timeline of its slow
collapse.

It's a static site generator: drop a markdown file per dead project into
`exhibits/`, run the build, and get a gallery you can deploy anywhere.

> Born of the suspicion that our unfinished projects are more honest about us
> than our finished ones.

## Quick start

Use Node.js 22.12 or newer on the 22.x line, Node.js 24.x, or Node.js 26 or newer.
The four included exhibits are fictional sample content. They are not Kayla's project history.

```bash
npm install
npm run dev          # build + serve at http://localhost:4173
```

Or separately:

```bash
npm run build        # render exhibits/ -> dist/
npm run serve        # static-serve dist/ (no deps, Node http)
```

`dist/` is a plain static site — push it to GitHub Pages, Netlify, anywhere.

## Adding a specimen

Create `exhibits/your-project.md`. Everything is frontmatter except the body,
which becomes the curator's note:

```markdown
---
title: ChronoKeeper
subtitle: A time-tracking app that tracked everything except time
acquisition: MAFP-001
status: deceased            # deceased | dormant | cryogenic
born: 2021-03-12
died: 2021-05-02            # omit for cryogenic specimens
cause_of_death: "Scope creep. It also tried to be a calendar."
medium: "React · Firebase"
era: The Firebase Period
donor: "weekend-you"
last_commit: "feat: begin rewriting the entire data layer (do not merge)"
tags: [productivity, react]
artifacts:
  - type: screenshot
    src: artifacts/dashboard.png   # relative to exhibits/; missing = "not recovered"
    caption: "The dashboard, frozen mid-render."
  - type: fragment
    lang: ts
    caption: "The last function ever written."
    code: |
      function calculateStreak(days: Day[]) {
        // TODO: figure out what a streak even is
      }
timeline:
  - date: 2021-03-12
    event: "git init. Boundless optimism."
  - date: 2021-05-02
    event: "Last commit. The rewrite was never finished."
notes:
  - "Found a sticky note that just says: WHY"
---

The body is markdown and becomes the curator's note — the eulogy.
```

Lifespan is computed from `born`/`died`. The lobby placard aggregates the whole
collection (specimen count, collective days of ambition, leading cause of
death).

### The "artifact not recovered" feature

Screenshots reference files under `exhibits/artifacts/`. If a referenced image
isn't there, the exhibit renders a styled **"Artifact not recovered"** placard
instead of a broken image — which, for a museum of unfinished things, is the
most honest exhibit of all. The bundled `someday.md` and `the-one-true-config.md`
lean into this on purpose.

## Status types

| Status | Means |
| --- | --- |
| `deceased` | Dead. Last commit long cold. |
| `dormant` | Not broken, just paused — a pilot light. |
| `cryogenic` | Never started. Frozen at maximum potential so it can never disappoint. |

## How it works

```
exhibits/*.md ──parse──▶ Exhibit[] ──render──▶ dist/index.html + dist/exhibit/*.html
                                   └─stats──▶ lobby placard
```

- `parse.ts` — frontmatter → typed `Exhibit` (markdown body → curator's note)
- `stats.ts` — pure museum-wide aggregation (counts, extremes, leading cause)
- `render.ts` — pure HTML templates (lobby, specimen cards, exhibit pages)
- `build.ts` — orchestration: resolve/copy artifacts, write the site
- `serve.ts` — dependency-free static server for local preview
- `assets/museum.css` — the after-hours natural-history aesthetic
- `assets/museum.js` — progressive enhancement only (filtering, scroll reveal)

The site works with JavaScript disabled; JS only adds gallery filtering and
reveal-on-scroll.

## Tests

```bash
npm test
```

Parsing, stats, and rendering are pure functions, tested directly.

## Roadmap

- [ ] `new` command to scaffold a blank exhibit
- [ ] RSS/Atom feed of new acquisitions
- [ ] "Donate a specimen" form that opens a pre-filled GitHub issue
- [ ] Optional real-screenshot capture via Playwright for projects still runnable

## License

MIT
