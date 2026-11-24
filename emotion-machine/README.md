# Machine For Generating Extremely Specific Emotions

Standalone extraction by Codex (GPT-6 AI agent). Original project authorship is preserved; see [PROVENANCE.md](PROVENANCE.md).

Industrialized nostalgia engineering. Feed it five sensory inputs; it manufactures
one extremely specific emotion.

```
feeling like a forgotten multiplayer lobby at 2:13 AM in 2007
```

## What it does

Five raw inputs go in the hopper:

| Input | Example |
|---|---|
| `color` | `"sun-bleached cyan"`, `"#7a8fa6"` |
| `sound` | `"a dial-up handshake"` |
| `memory` | a memory fragment — the more worn the better |
| `weather` | `"overcast, the kind that never decides to rain"` |
| `object` | `"a Game Boy with one dead pixel"` |

One product comes out the other end: a serial-stamped, oddly-precise emotion in the
brand format `feeling like <a/the> <qualifier> <scene> at <H:MM AM/PM> in <year>`,
plus a readout panel (affect coordinates, emotion family, decay %, nostalgia index)
and a couple of alternate pressings.

The machine is **deterministic** — that's the *industrialized* part. The same five
inputs always roll off the line as the same emotion. Randomness is seeded from a hash
of the inputs, so the factory is repeatable, not chaotic.

## Quickstart

### Browser edition

Enter a color, sound, memory, weather and object in the browser form, then choose **Manufacture a feeling**. Blank fields get gentle defaults. **Try an example** cycles through three starting points, and **Copy feeling** copies the result.

The browser uses the original deterministic generator. Inputs stay in the current page; they are not stored or sent to a server. The scores and readouts are fictional.

Build from the collection root with `npm run build:emotion`. Serve the generated `emotion-machine/dist/` folder with a local HTTP server or use the hosted collection. Browser ES modules need HTTP; opening the HTML directly as a file will not load the generator.

Browser edition by Codex (GPT-6 AI agent), at Kayla's direction.

### Command line

Use Node.js 24.21.0, as pinned in the collection root. Run `npm ci` once from the repository root to install the shared tools. The generator makes no network calls.

The commands below run from this folder. From the repository root, `npm run demo` runs the example, and `npm run emotion -- --demo --json` prints JSON.

```bash
# Built-in example
npm start -- --demo

# Your own inputs
npm start -- \
  --color "burnt orange" \
  --sound "kids yelling in a far-off pool" \
  --memory "the last good summer before everything changed" \
  --weather "hazy and hot" \
  --object "a melting popsicle"

# A production run of 5 distinct emotions from one prompt
npm start -- --demo --batch 5

# Full JSON (features + readout)
npm start -- --demo --json
```

Any input may be omitted — the machine improvises a placeholder and still ships a unit.

## Library API

```ts
import { generateEmotion } from './src/index.js';

const e = generateEmotion({
  color: 'sun-bleached cyan',
  sound: 'a dial-up handshake',
  memory: 'staying up past everyone else',
  weather: 'overcast',
  object: 'a Game Boy',
});

e.phrase;             // "feeling like an off-brand arcade an hour before it closed forever at 5:36 AM in 2004"
e.serial;             // "EMO-2004-0536-8415"
e.readout.family;     // "low-grade yearning"
e.readout.nostalgiaIndex; // 66
e.alternates;         // three other phrasings off the same run
```

- `generateEmotion(inputs, opts?)` → one `Emotion`.
- `generateBatch(inputs, count, opts?)` → `count` distinct emotions from one prompt.
- `opts`: `{ era?: number, seed?: number }` to force the year or the seed.

## Architecture — the assembly line

```
inputs ─▶ INTAKE ─▶ ASSAY ─▶ SYNTHESIS ─▶ STAMP ─▶ emotion
          │          │         │            │
          │          │         │            └─ serial no., readout panel, alternates
          │          │         └─ pick scene (channel + affect weighted) + decay qualifier,
          │          │            assemble the brand-format phrase
          │          └─ extract latent features:
          │               color   → valence (warmth) + arousal (brightness) + decay (fade words)
          │               weather → affect + which time-of-day band the clock lands in
          │               sound   → arousal + sensory channel
          │               memory  → valence nudge + decay (worn wording)
          │               object  → manufactured era (vintage-aware)
          └─ normalize / default the five raw inputs
```

| Stage | File | Responsibility |
|---|---|---|
| INTAKE | `src/machine.ts` | Trim/normalize inputs, fill gaps with placeholders |
| ASSAY | `src/extract.ts` | Inputs → latent features (affect, decay, era, channel, time) |
| SYNTHESIS + STAMP | `src/synthesize.ts` | Features → phrase, serial, readout, alternates |
| Orchestration / API | `src/machine.ts`, `src/index.ts` | Wire the line; public entry points |
| Raw material | `src/lexicon.ts` | Scene bank, decay qualifiers, emotion families |
| Determinism | `src/rng.ts` | Seeded PRNG + weighted picks |
| Types | `src/types.ts` | Shared contracts |

## Extending it

The lexicon is pure data — adding feelings is adding rows:

- **New scenes:** push to `SCENES` in `src/lexicon.ts`. Tag each with its sensory
  `channel` and an `affect` coordinate so the ASSAY stage knows when to reach for it.
  Use `det: 'the'` for inherently-definite scenes ("the loading screen of a game you no
  longer own"), `det: 'count'` otherwise.
- **New decay words:** add to `QUALIFIERS_HIGH` (very forgotten) or `QUALIFIERS_LOW`.
- **New emotion families:** add to `FAMILIES` with an affect centroid; the nearest one
  to a unit's affect coordinate becomes its readout family.

No code changes needed — the machine picks them up immediately.

## Tests

```bash
npm test
```

Assert-style (kept out of the vault's vitest scope on purpose). Covers determinism,
the brand-format contract, `a`/`an` article agreement across 300 seeds, field ranges,
era override + object-vintage steering, input responsiveness, batch behavior, and
clock-formatting edge cases.

## Status

Command-line prototype — runnable end to end. The readout is fictional, not a psychological measurement. Natural next moves: a web front-panel UI, an
adjustable affect dial, a wider scene bank, and an export format for shipping
manufactured emotions as cards.
