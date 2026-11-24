/**
 * The raw material the factory draws from.
 *
 * This is the soul of the machine: the bank of liminal, half-remembered scenes
 * that get assembled into emotions. Everything here is data — extend the banks
 * and the machine immediately knows how to manufacture new feelings.
 */

import type { AffectVector, Channel } from './types.js';

/** A scene is the noun-phrase core of an emotion ("multiplayer lobby"). */
export interface Scene {
  /** Noun phrase, no leading article. */
  np: string;
  /**
   * 'count' → takes "a/an {qualifier} {np}".
   * 'the'   → takes "the {qualifier} {np}" (inherently definite).
   */
  det: 'count' | 'the';
  channel: Channel;
  affect: AffectVector;
}

/**
 * The scene bank. Tag each with its sensory channel and where it sits in
 * affect space so the ASSAY stage can pick a scene that matches the inputs.
 */
export const SCENES: readonly Scene[] = [
  { np: 'multiplayer lobby', det: 'count', channel: 'digital', affect: { valence: -0.2, arousal: -0.3 } },
  { np: 'hotel pool in the off-season', det: 'count', channel: 'physical', affect: { valence: -0.1, arousal: -0.5 } },
  { np: 'loading screen of a game you no longer own', det: 'the', channel: 'digital', affect: { valence: -0.3, arousal: -0.4 } },
  { np: 'Blockbuster twenty minutes before close', det: 'count', channel: 'social', affect: { valence: 0.0, arousal: -0.2 } },
  { np: 'school hallway during summer break', det: 'count', channel: 'physical', affect: { valence: -0.1, arousal: -0.6 } },
  { np: 'car ride home after everyone else got dropped off', det: 'count', channel: 'social', affect: { valence: -0.2, arousal: -0.4 } },
  { np: 'dial-up handshake that never quite connects', det: 'count', channel: 'mechanical', affect: { valence: -0.4, arousal: 0.1 } },
  { np: 'group chat where everyone slowly stopped replying', det: 'count', channel: 'social', affect: { valence: -0.5, arousal: -0.3 } },
  { np: 'mall food court at 11am on a weekday', det: 'count', channel: 'social', affect: { valence: -0.1, arousal: -0.5 } },
  { np: 'save file from a console you cannot find the charger for', det: 'the', channel: 'digital', affect: { valence: -0.3, arousal: -0.3 } },
  { np: 'backseat of a minivan on the last hour of a long drive', det: 'the', channel: 'physical', affect: { valence: 0.0, arousal: -0.6 } },
  { np: 'answering machine still holding a voice that is gone', det: 'the', channel: 'mechanical', affect: { valence: -0.6, arousal: -0.2 } },
  { np: 'forum thread where the last post was eleven years ago', det: 'the', channel: 'digital', affect: { valence: -0.4, arousal: -0.4 } },
  { np: 'snow day with nowhere you needed to be', det: 'count', channel: 'natural', affect: { valence: 0.4, arousal: -0.4 } },
  { np: 'arcade an hour before it closed forever', det: 'count', channel: 'social', affect: { valence: -0.2, arousal: 0.0 } },
  { np: 'desktop wallpaper of a place you have never been', det: 'the', channel: 'digital', affect: { valence: 0.1, arousal: -0.4 } },
  { np: 'landline ringing in an empty house', det: 'count', channel: 'mechanical', affect: { valence: -0.5, arousal: 0.2 } },
  { np: 'county fair the morning after it ended', det: 'count', channel: 'physical', affect: { valence: -0.2, arousal: -0.5 } },
  { np: 'screensaver bouncing in a dark office', det: 'count', channel: 'digital', affect: { valence: -0.1, arousal: -0.6 } },
  { np: 'last day of a summer job nobody will remember', det: 'the', channel: 'social', affect: { valence: -0.2, arousal: -0.3 } },
  { np: 'tape that has been recorded over one too many times', det: 'count', channel: 'mechanical', affect: { valence: -0.4, arousal: -0.3 } },
  { np: 'parking lot that used to be a field', det: 'count', channel: 'physical', affect: { valence: -0.3, arousal: -0.5 } },
  { np: 'birthday party where two people showed up', det: 'count', channel: 'social', affect: { valence: -0.6, arousal: -0.2 } },
  { np: 'server that is still up but nobody logs into anymore', det: 'count', channel: 'digital', affect: { valence: -0.4, arousal: -0.4 } },
  { np: 'attic box of cables for devices that no longer exist', det: 'count', channel: 'mechanical', affect: { valence: -0.2, arousal: -0.4 } },
  { np: 'road trip playlist burned onto a disc that skips', det: 'count', channel: 'mechanical', affect: { valence: 0.1, arousal: -0.2 } },
  { np: 'waiting room with a fish tank and a muted TV', det: 'count', channel: 'physical', affect: { valence: -0.1, arousal: -0.5 } },
  { np: 'text you typed out and never sent', det: 'count', channel: 'social', affect: { valence: -0.4, arousal: -0.1 } },
  { np: 'video store membership card still in your wallet', det: 'count', channel: 'physical', affect: { valence: -0.1, arousal: -0.4 } },
  { np: 'low-poly horizon you used to walk toward', det: 'count', channel: 'digital', affect: { valence: 0.0, arousal: -0.4 } },
  { np: 'ICQ window blinking with no one on the other end', det: 'count', channel: 'digital', affect: { valence: -0.5, arousal: -0.1 } },
  { np: 'public pool closing announcement over a tinny speaker', det: 'count', channel: 'physical', affect: { valence: -0.2, arousal: -0.3 } },
];

/**
 * Decay qualifiers, split by how forgotten the scene is. The ASSAY stage
 * computes a decay score (0..1) and picks from the matching half.
 */
export const QUALIFIERS_HIGH: readonly string[] = [
  'forgotten',
  'abandoned',
  'decommissioned',
  'water-damaged',
  'deprecated',
  'end-of-life',
  'discontinued',
  'unmaintained',
  'dust-covered',
  'archived',
  'autosaved-over',
  'long-since-orphaned',
];

export const QUALIFIERS_LOW: readonly string[] = [
  'half-remembered',
  'sun-bleached',
  'buffering',
  'overexposed',
  'low-resolution',
  'time-stamped',
  'last-known-good',
  'off-brand',
  'defragmented',
  'faintly-warm',
];

/** Named emotion families with their affect-space centroids. */
export interface EmotionFamily {
  name: string;
  centroid: AffectVector;
}

export const FAMILIES: readonly EmotionFamily[] = [
  { name: 'anemoia (nostalgia for a time you never knew)', centroid: { valence: -0.1, arousal: -0.4 } },
  { name: 'saudade', centroid: { valence: -0.4, arousal: -0.3 } },
  { name: 'liminal dread', centroid: { valence: -0.5, arousal: 0.3 } },
  { name: 'soft melancholy', centroid: { valence: -0.3, arousal: -0.5 } },
  { name: 'bittersweet warmth', centroid: { valence: 0.4, arousal: -0.2 } },
  { name: 'hollow comfort', centroid: { valence: 0.1, arousal: -0.6 } },
  { name: 'low-grade yearning', centroid: { valence: -0.2, arousal: -0.1 } },
  { name: 'end-of-summer grief', centroid: { valence: -0.2, arousal: -0.4 } },
  { name: 'digital homesickness', centroid: { valence: -0.3, arousal: -0.2 } },
  { name: 'the quiet euphoria of an empty place', centroid: { valence: 0.3, arousal: -0.4 } },
];
