# The Museum of Almost-Finished Projects — handoff

Status and context for anyone picking this up.

## Status

- **Working.** Static-site generator complete for v0.1.
- **Tests:** 15 passing (`npm test`), typecheck clean (`npm run typecheck`).
- **Verified:** full build produces 4 exhibit pages + index; the dev server
  returns 200 for index/css/svg/exhibit and 404s unknown paths; screenshot
  links resolve and missing screenshots render the "Artifact not recovered"
  placard.
- **NOT verified:** the visual rendering. The scaffolding environment had no
  browser, so the CSS aesthetic (the whole point) was not eyeballed. **First
  task on pickup: `npm run dev` and look at it in a browser.**

## Architecture

```
exhibits/*.md            one markdown file per dead project (frontmatter + body)
exhibits/artifacts/*     screenshots referenced by exhibits (svg/png/jpg)
src/
  types.ts     Exhibit, Artifact, TimelineEntry, MuseumStats, ExhibitStatus
  parse.ts     frontmatter -> Exhibit (body markdown -> curator's note HTML)
  stats.ts     pure museum-wide aggregation (counts, extremes, leading cause)
  render.ts    pure HTML: renderIndex (lobby + cards) + renderExhibit
  load.ts      read exhibits/*.md (skips subfolders)
  build.ts     orchestration: resolve/copy artifacts, write dist/
  serve.ts     dependency-free static preview server (node:http)
  assets/museum.css   the after-hours natural-history aesthetic
  assets/museum.js    progressive enhancement only (filter + scroll reveal)
```

Data flow: `load → parse (per file) → {stats, render} → build writes dist/`.

## Key decisions

- **Content is data, not code.** Every exhibit is a markdown file; curating the
  museum never touches `src/`. Anyone can add a specimen with a PR of one file.
- **Pure parse/stats/render, IO in build/serve.** That's why 15 tests run with
  no filesystem or browser.
- **"Artifact not recovered" is a feature.** A referenced screenshot that isn't
  on disk renders a themed placard instead of a broken image. For a museum of
  unfinished things this is thematically load-bearing, not an error state.
  `someday.md` and `the-one-true-config.md` rely on it deliberately.
- **Three statuses carry meaning:** `deceased` (dead), `dormant` (a pilot
  light), `cryogenic` (never started, frozen at max potential). Cryogenic
  specimens legitimately have no `died` date and no lifespan.
- **Output is plain static HTML.** `dist/` deploys to GitHub Pages / Netlify /
  anywhere. Fonts + nothing-else come from a CDN; the site works offline with
  serif/mono fallbacks.
- **JS is enhancement only.** Filtering and scroll-reveal degrade to a fully
  functional museum with JS disabled.

## Known gaps / not done

- No visual QA yet (see Status). The CSS is untested in a real browser.
- No `new` scaffolder — you hand-write the frontmatter (template in README).
- Tag filtering is OR across selected tags; no AND. Fine at this scale.
- Artifact filenames are flattened as `<slug>__<basename>` to avoid collisions;
  two artifacts with the same basename in the same exhibit would still clash.

## Next steps (priority order)

1. **Eyeball it in a browser** and tune the CSS (blocking for "done").
2. **Replace the 4 seed exhibits with real abandoned projects** — that's what
   makes it land emotionally and what makes it a portfolio piece.
3. **Deploy to GitHub Pages** (it's already a static `dist/`).
4. **`new` command** to scaffold a blank exhibit.
5. **Playwright screenshot capture** for projects still runnable.
6. **"Donate a specimen"** link that opens a pre-filled GitHub issue.

## Gotchas

- ESM project; `.js` extensions on relative imports are intentional (NodeNext).
- Exhibit frontmatter with colons in values **must be quoted** (`cause_of_death:
  "Scope creep."`). gray-matter parses YAML; unquoted colons break it.
- Code fragments use YAML block scalars (`code: |`); keep indentation consistent.
- `build.ts` resolves paths relative to the package root via `import.meta.url`,
  so it runs the same from any cwd.
