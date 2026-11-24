# little-wonders

*An ode to frivolity and a commitment of whimsy.*

<sub>README reworked by Codex (GPT-6 AI agent), with Kayla's words and direction. Original project authorship is recorded in each folder.</sub>

Small experiments made for the pleasure of following an odd idea somewhere. A little satire, a little nostalgia, a very official stamp on a very minor concern.

There is room here for things whose whole purpose is to make someone grin.

## The collection

### [Nullify](nullify/)

A productivity app with an exceptionally light memory. Create categories, labels, systems and workflows. Watch your clarity score climb. Refresh the page and enjoy a completely fresh start.

It saves absolutely nothing. Deliberately.

### [The Museum of Almost-Finished Projects](museum/)

Give an unfinished idea a gallery wall, a curator's note and a small plaque explaining what happened. Markdown project notes become exhibits, complete with recovered artifacts and timelines.

The four included exhibits are fictional specimens. Bring your own abandoned ambitions when you are ready.

### [Machine For Generating Extremely Specific Emotions](emotion-machine/)

Describe a color, a sound, a memory, the weather and an object. The machine manufactures a feeling with an unreasonable degree of specificity.

Same inputs, same strange little feeling. Its scores and readouts are part of the fiction.

### [The Bureau of Small Decisions](bureau-of-small-decisions/)

Bring two options. Receive the full attention of five fictional departments.

Form 27-B travels through queues, detours and requests for further cooperation. The Bureau usually returns your dilemma intact. Occasionally, almost in spite of itself, it makes a decision.

## Take one home

The Node projects share one install. Select Node.js 24.21.0 with your version manager (`nvm use 24.21.0` with nvm-windows). From the repository root, run:

```sh
npm ci
```

Then pick a project:

| Project | How to start |
| --- | --- |
| Nullify | Open `nullify/index.html` in a browser. |
| The Bureau of Small Decisions | Open `bureau-of-small-decisions/index.html` in a browser. |
| Museum | Run `npm run museum`. |
| Emotion Machine | Run `npm run demo`, or `npm run emotion -- --demo --json`. |

Use Node.js **24.21.0** for both Node projects. The exact version is pinned in `.node-version`, `.nvmrc` and `package.json`; npm checks it during installation. CI uses the same version. Each folder's README has the full instructions.

Run `npm run check` to typecheck both Node projects, run their tests and build the museum. Shared development tools and the lockfile live at the repository root.

The two HTML toys need no build step. The Bureau requests Google Fonts and uses local font fallbacks if they are unavailable.

## Changes and releases

See the [changelog](CHANGELOG.md) for notable changes and the [release guide](RELEASE.md) for SemVer, commit messages and release steps.

## Source

Nullify, Museum and Emotion Machine were extracted from recorded branches of `snackdriven/scratch-pad`. The source repository was left unchanged. The Bureau of Small Decisions came from an HTML file supplied by Kayla. See each folder's `PROVENANCE.md` for its source and import changes.
