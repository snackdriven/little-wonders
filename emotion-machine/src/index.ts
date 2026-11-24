/**
 * Public API for the Machine For Generating Extremely Specific Emotions.
 *
 *   import { generateEmotion } from './emotion-machine/src/index.js';
 *
 *   const e = generateEmotion({
 *     color: 'sun-bleached cyan',
 *     sound: 'a dial-up handshake',
 *     memory: 'staying up past everyone else',
 *     weather: 'overcast',
 *     object: 'a Game Boy',
 *   });
 *   console.log(e.phrase);
 *   // → "feeling like a forgotten multiplayer lobby at 2:13 AM in 2007"
 */

export { generateEmotion, generateBatch } from './machine.js';
export { assay, nearestFamily, seedFor } from './extract.js';
export { synthesize, formatClock } from './synthesize.js';
export { SCENES, QUALIFIERS_HIGH, QUALIFIERS_LOW, FAMILIES } from './lexicon.js';
export type {
  EmotionInputs,
  Emotion,
  EmotionFeatures,
  AffectVector,
  Channel,
  TimeBand,
  Readout,
  GenerateOptions,
} from './types.js';
