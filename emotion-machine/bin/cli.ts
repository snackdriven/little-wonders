#!/usr/bin/env -S npx tsx
/**
 * CLI for the Machine For Generating Extremely Specific Emotions.
 *
 *   npm start -- \
 *     --color "sun-bleached cyan" \
 *     --sound "a dial-up handshake" \
 *     --memory "staying up past everyone else" \
 *     --weather overcast \
 *     --object "a Game Boy"
 *
 *   npm start -- --demo
 *   npm start -- --demo --json
 *   npm start -- --color red ... --batch 5
 */

import { generateBatch, generateEmotion } from '../src/machine.js';
import type { Emotion, EmotionInputs } from '../src/types.js';

interface Flags {
  inputs: Partial<EmotionInputs>;
  json: boolean;
  batch: number;
  era?: number;
  seed?: number;
  demo: boolean;
  help: boolean;
}

function parseArgs(argv: string[]): Flags {
  const flags: Flags = { inputs: {}, json: false, batch: 1, demo: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const take = () => argv[++i];
    switch (arg) {
      case '--color': flags.inputs.color = take(); break;
      case '--sound': flags.inputs.sound = take(); break;
      case '--memory': flags.inputs.memory = take(); break;
      case '--weather': flags.inputs.weather = take(); break;
      case '--object': flags.inputs.object = take(); break;
      case '--era': flags.era = parseInt(take(), 10); break;
      case '--seed': flags.seed = parseInt(take(), 10); break;
      case '--batch': flags.batch = Math.max(1, parseInt(take(), 10) || 1); break;
      case '--json': flags.json = true; break;
      case '--demo': flags.demo = true; break;
      case '-h':
      case '--help': flags.help = true; break;
      default:
        if (arg.startsWith('--')) {
          process.stderr.write(`Unknown flag: ${arg}\n`);
          flags.help = true;
        }
    }
  }
  return flags;
}

const DEMO: EmotionInputs = {
  color: 'sun-bleached cyan',
  sound: 'a dial-up handshake that never quite connects',
  memory: 'staying up after everyone else fell asleep',
  weather: 'overcast, the kind that never decides to rain',
  object: 'a Game Boy with one dead pixel',
};

const USAGE = `Machine For Generating Extremely Specific Emotions

Feed it five sensory inputs; it manufactures one extremely specific emotion.

Usage:
  cli.ts --color <c> --sound <s> --memory <m> --weather <w> --object <o> [options]
  cli.ts --demo

Inputs (any may be omitted; the machine improvises):
  --color    <text|hex>   e.g. "burnt orange", "#7a8fa6"
  --sound    <text>       e.g. "a dial-up handshake"
  --memory   <text>       a memory fragment, the more worn the better
  --weather  <text>       e.g. "overcast", "humid and still"
  --object   <text>       e.g. "a Game Boy", "a laminated menu"

Options:
  --batch <n>    Manufacture n distinct emotions from the same inputs
  --era <year>   Force the manufactured year
  --seed <int>   Force the seed (overrides input-derived seed)
  --json         Emit full JSON (phrase + features + readout)
  --demo         Run the built-in example
  -h, --help     This message
`;

function renderHuman(e: Emotion): string {
  const f = e.features;
  const r = e.readout;
  const lines = [
    '',
    `  ▸ ${e.phrase}`,
    '',
    `    serial          ${e.serial}`,
    `    family          ${r.family}`,
    `    channel         ${f.channel}`,
    `    affect          valence ${r.valence >= 0 ? '+' : ''}${r.valence}  ·  arousal ${r.arousal >= 0 ? '+' : ''}${r.arousal}`,
    `    decay           ${(f.decay * 100).toFixed(0)}%`,
    `    nostalgia index ${r.nostalgiaIndex}/100`,
    `    confidence      ${(r.confidence * 100).toFixed(0)}%`,
    '',
    '    also available in:',
    ...e.alternates.map((a) => `      · ${a}`),
    '',
  ];
  return lines.join('\n');
}

function main(): void {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.help) {
    process.stdout.write(USAGE);
    return;
  }

  const inputs = flags.demo ? DEMO : flags.inputs;
  const opts = { era: flags.era, seed: flags.seed };

  const results =
    flags.batch > 1 ? generateBatch(inputs, flags.batch, opts) : [generateEmotion(inputs, opts)];

  if (flags.json) {
    process.stdout.write(JSON.stringify(flags.batch > 1 ? results : results[0], null, 2) + '\n');
    return;
  }

  for (const e of results) process.stdout.write(renderHuman(e));
}

main();
