# Source and extraction

Prepared by Codex (GPT-6 AI agent), November 24, 2026.

This project was extracted from the private `snackdriven/scratch-pad` repository.

- Source commit: `e8da8f508a289f01ccb0c0bfca905de0e13ce744`
- Source path: `portfolio/museum/`
- Source tree: `458a9a1d89c46bcb42d1dcead02ec3940527471b`
- Source link: https://github.com/snackdriven/scratch-pad/tree/e8da8f508a289f01ccb0c0bfca905de0e13ce744/portfolio/museum

All 24 source files matched their original Git blob hashes after extraction. The source repository and its history were not changed. This is a snapshot extraction; it does not copy the full Scratch-pad history.

The original code, sample exhibits, artwork, README wording and historical handoff remain with their original authors. The four bundled exhibits are fictional samples, not Kayla's biography.

## Extraction changes

- Added this provenance file and a source manifest.
- Added an extraction note, the supported Node versions and the sample-content warning to the README.
- Updated the Vitest development dependency from 2.x to 5.1.1 or newer within 5.x. The old dependency tree had six reported vulnerabilities. Updated the supported Node versions to match the test tool.
- Added a package lock file for repeatable installs.

No project behavior was changed. Nothing was deployed. `HANDOFF.md` is the historical source handoff, not a claim about the current extraction checks.

## Verification

Local checks passed on November 24, 2026:

- All 15 existing tests passed under Vitest 5.1.1.
- The TypeScript check passed.
- The static-site build produced an index and four exhibit pages.
- `npm audit` reported zero known vulnerabilities in the installed dependency tree.

Dependency installation used `--ignore-scripts`. Visual rendering and deployment were not checked.
