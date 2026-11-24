/**
 * SYNTHESIS + STAMP stages — assemble latent features into a finished emotion.
 */

import {
  QUALIFIERS_HIGH,
  QUALIFIERS_LOW,
  SCENES,
  type Scene,
} from './lexicon.js';
import { Rng } from './rng.js';
import type { Emotion, EmotionFeatures, EmotionInputs, Readout } from './types.js';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/** "a" / "an" from the word that immediately follows the article. */
function article(nextWord: string): string {
  return VOWELS.has(nextWord[0]?.toLowerCase()) ? 'an' : 'a';
}

/** Format a 24h time as "2:13 AM". */
export function formatClock(hour: number, minute: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  let h = hour % 12;
  if (h === 0) h = 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${period}`;
}

/** Pick a scene, biased toward the run's channel and affect coordinate. */
function pickScene(features: EmotionFeatures, rng: Rng): Scene {
  const weighted = SCENES.map((scene) => {
    let weight = 1;
    if (scene.channel === features.channel) weight += 2;
    const dv = scene.affect.valence - features.affect.valence;
    const da = scene.affect.arousal - features.affect.arousal;
    const dist = Math.sqrt(dv * dv + da * da); // 0..~2.8
    weight += Math.max(0, 1.5 - dist); // closer in affect space → heavier
    return { value: scene, weight };
  });
  return rng.weightedPick(weighted);
}

/** Pick a decay qualifier from the half that matches the decay score. */
function pickQualifier(features: EmotionFeatures, rng: Rng): string {
  const bank = features.decay >= 0.55 ? QUALIFIERS_HIGH : QUALIFIERS_LOW;
  return rng.pick(bank);
}

/** Build the bare scene phrase, e.g. "a forgotten multiplayer lobby". */
function scenePhrase(scene: Scene, qualifier: string): string {
  if (scene.det === 'the') return `the ${qualifier} ${scene.np}`;
  return `${article(qualifier)} ${qualifier} ${scene.np}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Hex tail for the serial number, derived from the seed-driven rng. */
function serialTail(rng: Rng): string {
  return rng.int(0, 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

/** SYNTHESIS + STAMP: features → finished, serial-stamped emotion. */
export function synthesize(inputs: EmotionInputs, features: EmotionFeatures, rng: Rng): Emotion {
  const scene = pickScene(features, rng);
  const qualifier = pickQualifier(features, rng);
  const sp = scenePhrase(scene, qualifier);
  const clock = formatClock(features.hour, features.minute);

  // Headline — the brand format, exactly like the spec example.
  const phrase = `feeling like ${sp} at ${clock} in ${features.era}`;

  // A couple of alternate pressings off the same run.
  const decade = Math.floor(features.era / 10) * 10;
  const alternates = [
    `${clock}, ${features.era}. ${cap(sp)}.`,
    `the exact feeling of ${sp}, ${features.era}`,
    `${cap(sp)} — ${clock}, the ${decade}s, ${inputs.weather.toLowerCase()}`,
  ];

  // Decay carries half the weight; proximity to the nostalgic peak (~2005) and
  // a lower valence (wistful beats cheerful) carry the rest.
  const eraPeak = 1 - clamp(Math.abs(features.era - 2005) / 20, 0, 1);
  const nostalgiaIndex = Math.round(
    clamp(features.decay * 50 + eraPeak * 30 + (1 - (features.affect.valence + 1) / 2) * 20, 0, 100),
  );

  const readout: Readout = {
    valence: round2(features.affect.valence),
    arousal: round2(features.affect.arousal),
    family: features.family,
    confidence: round2(0.8 + rng.float() * 0.19),
    nostalgiaIndex,
  };

  const serial = `EMO-${features.era}-${features.hour.toString().padStart(2, '0')}${features.minute
    .toString()
    .padStart(2, '0')}-${serialTail(rng)}`;

  return { phrase, serial, inputs, features, readout, alternates };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
