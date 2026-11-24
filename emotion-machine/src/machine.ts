/**
 * The Machine For Generating Extremely Specific Emotions.
 *
 * The five-stage assembly line, wired end to end:
 *
 *   inputs ─▶ INTAKE ─▶ ASSAY ─▶ SYNTHESIS ─▶ STAMP ─▶ emotion
 *
 * INTAKE normalizes the raw inputs, ASSAY (extract.ts) derives latent features,
 * SYNTHESIS + STAMP (synthesize.ts) assemble and serial-number the product.
 */

import { assay, seedFor } from './extract.js';
import { Rng } from './rng.js';
import { synthesize } from './synthesize.js';
import type { Emotion, EmotionInputs, GenerateOptions } from './types.js';

/** INTAKE — trim and normalize, with gentle defaults so partial input still ships. */
function intake(inputs: Partial<EmotionInputs>): EmotionInputs {
  const norm = (v: string | undefined, fallback: string) => (v ?? '').trim() || fallback;
  return {
    color: norm(inputs.color, 'an undescribed color'),
    sound: norm(inputs.sound, 'a sound you cannot place'),
    memory: norm(inputs.memory, 'a memory with the edges worn off'),
    weather: norm(inputs.weather, 'weather that refuses to commit'),
    object: norm(inputs.object, 'an object whose purpose is unclear'),
  };
}

/**
 * Manufacture one extremely specific emotion from five sensory inputs.
 * Deterministic: identical inputs always produce the identical emotion.
 */
export function generateEmotion(
  rawInputs: Partial<EmotionInputs>,
  opts: GenerateOptions = {},
): Emotion {
  const inputs = intake(rawInputs);
  const features = assay(inputs, opts);

  // Advance a fresh stream past the assay draws so synthesis decisions are
  // stable but distinct from feature extraction. The +1 offset keeps the
  // synthesis stream from mirroring the assay stream's first draw.
  const rng = new Rng(seedFor(inputs, opts) + 1);
  return synthesize(inputs, features, rng);
}

/**
 * Manufacture a production run of distinct emotions from the same inputs by
 * salting the seed. Useful for browsing the design space of one prompt.
 */
export function generateBatch(
  rawInputs: Partial<EmotionInputs>,
  count: number,
  opts: GenerateOptions = {},
): Emotion[] {
  const base = seedFor(intake(rawInputs), opts);
  const out: Emotion[] = [];
  for (let i = 0; i < count; i++) {
    out.push(generateEmotion(rawInputs, { ...opts, seed: base + i * 0x9e3779b1 }));
  }
  return out;
}
