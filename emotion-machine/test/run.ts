/**
 * Assert-style test runner for the emotion machine.
 * Run: npx tsx emotion-machine/test/run.ts
 *
 * Kept assert-style (not vitest) so the vault's vitest scope — include:
 * ['tests/**'] — never picks it up. Mirrors scripts/*.test.ts in this repo.
 */

import { generateBatch, generateEmotion } from '../src/machine.js';
import { formatClock } from '../src/synthesize.js';
import type { EmotionInputs } from '../src/types.js';

let passed = 0;
let failed = 0;

function ok(cond: boolean, label: string): void {
  if (cond) {
    passed++;
  } else {
    failed++;
    process.stderr.write(`  ✗ ${label}\n`);
  }
}

const SAMPLE: EmotionInputs = {
  color: 'sun-bleached cyan',
  sound: 'a dial-up handshake',
  memory: 'staying up past everyone else',
  weather: 'overcast',
  object: 'a Game Boy',
};

// 1. Determinism: same inputs → identical product.
{
  const a = generateEmotion(SAMPLE);
  const b = generateEmotion(SAMPLE);
  ok(a.phrase === b.phrase, 'deterministic phrase');
  ok(a.serial === b.serial, 'deterministic serial');
  ok(JSON.stringify(a) === JSON.stringify(b), 'deterministic full unit');
}

// 2. Headline matches the brand format: "feeling like ... at H:MM AM/PM in YYYY".
{
  const e = generateEmotion(SAMPLE);
  const re = /^feeling like .+ at \d{1,2}:\d{2} (AM|PM) in \d{4}$/;
  ok(re.test(e.phrase), `phrase matches brand format (got: "${e.phrase}")`);
}

// 3. No "a apple" — article agreement after the leading article.
{
  // Probe many inputs; every count-noun phrase must use correct a/an.
  let bad = '';
  for (let i = 0; i < 300; i++) {
    const e = generateEmotion(SAMPLE, { seed: i });
    const m = e.phrase.match(/feeling like (a|an) (\S+)/);
    if (m) {
      const [, art, next] = m;
      const wantsAn = /^[aeiou]/i.test(next);
      if ((art === 'an') !== wantsAn) bad = `${art} ${next}`;
    }
  }
  ok(bad === '', `article agreement holds across 300 seeds (offender: "${bad}")`);
}

// 4. Structure: all required fields present and in range.
{
  const e = generateEmotion(SAMPLE);
  ok(typeof e.serial === 'string' && e.serial.startsWith('EMO-'), 'serial stamped');
  ok(e.features.era >= 1980 && e.features.era <= 2025, 'era in plausible range');
  ok(e.features.hour >= 0 && e.features.hour <= 23, 'hour in range');
  ok(e.features.minute >= 0 && e.features.minute <= 59, 'minute in range');
  ok(e.readout.valence >= -1 && e.readout.valence <= 1, 'valence in range');
  ok(e.readout.arousal >= -1 && e.readout.arousal <= 1, 'arousal in range');
  ok(e.readout.nostalgiaIndex >= 0 && e.readout.nostalgiaIndex <= 100, 'nostalgia index in range');
  ok(e.alternates.length === 3, 'three alternates');
  ok(typeof e.readout.family === 'string' && e.readout.family.length > 0, 'family named');
}

// 5. Era override is honored.
{
  const e = generateEmotion(SAMPLE, { era: 1999 });
  ok(e.features.era === 1999, 'era override honored in features');
  ok(e.phrase.endsWith('in 1999'), 'era override reaches the phrase');
}

// 6. Object vintage steers the era.
{
  const vhs = generateEmotion({ ...SAMPLE, object: 'a VHS tape' });
  ok(vhs.features.era <= 1999, `VHS object pulls era back to the 90s (got ${vhs.features.era})`);
}

// 7. Responsiveness: different inputs usually yield different phrases.
{
  const variants = [
    generateEmotion(SAMPLE),
    generateEmotion({ ...SAMPLE, object: 'a cassette tape' }),
    generateEmotion({ ...SAMPLE, weather: 'bright clear afternoon' }),
    generateEmotion({ ...SAMPLE, color: 'burnt orange' }),
  ];
  const distinct = new Set(variants.map((v) => v.phrase));
  ok(distinct.size >= 3, `varied inputs produce varied output (${distinct.size}/4 distinct)`);
}

// 8. Batch determinism + distinctness.
{
  const a = generateBatch(SAMPLE, 5);
  const b = generateBatch(SAMPLE, 5);
  ok(a.every((e, i) => e.phrase === b[i].phrase), 'batch is deterministic');
  ok(new Set(a.map((e) => e.serial)).size >= 4, 'batch units are mostly distinct');
}

// 9. Partial / empty input still ships a unit (machine improvises).
{
  const e = generateEmotion({});
  const re = /^feeling like .+ at \d{1,2}:\d{2} (AM|PM) in \d{4}$/;
  ok(re.test(e.phrase), 'empty input still manufactures a valid phrase');
}

// 10. Clock formatting edge cases.
{
  ok(formatClock(0, 0) === '12:00 AM', 'midnight formats as 12:00 AM');
  ok(formatClock(12, 5) === '12:05 PM', 'noon formats as 12:05 PM');
  ok(formatClock(14, 13) === '2:13 PM', 'afternoon formats correctly');
  ok(formatClock(2, 13) === '2:13 AM', 'matches the spec example time');
}

process.stdout.write(`\nemotion-machine: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
