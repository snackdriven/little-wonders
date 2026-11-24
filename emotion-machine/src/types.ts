/**
 * Type definitions for the Machine For Generating Extremely Specific Emotions.
 *
 * The machine is a five-stage assembly line. Raw sensory inputs go in one end;
 * a single, oddly-precise manufactured emotion comes out the other.
 */

/** The five raw inputs fed into the intake hopper. */
export interface EmotionInputs {
  /** A color name ("burnt orange") or hex ("#7a8fa6"). */
  color: string;
  /** A sound, however described ("dial-up handshake", "rain on a car roof"). */
  sound: string;
  /** A memory fragment — free text, the more half-remembered the better. */
  memory: string;
  /** Weather, however described ("overcast", "the kind of humid that hums"). */
  weather: string;
  /** A physical object ("a Game Boy", "a laminated lunch menu"). */
  object: string;
}

/** Which sensory register the manufactured emotion lives in. */
export type Channel =
  | 'digital'
  | 'physical'
  | 'social'
  | 'natural'
  | 'mechanical';

/** A coarse band of the day. Drives the manufactured timestamp. */
export type TimeBand =
  | 'dead-of-night'
  | 'pre-dawn'
  | 'morning'
  | 'dead-afternoon'
  | 'golden-hour'
  | 'dusk'
  | 'late-night';

/** A 2-D affect coordinate. Both axes run -1..1. */
export interface AffectVector {
  /** Pleasant (+1) ↔ unpleasant (-1). */
  valence: number;
  /** Keyed-up (+1) ↔ subdued (-1). */
  arousal: number;
}

/** Latent dimensions the ASSAY stage extracts from the raw inputs. */
export interface EmotionFeatures {
  /** Dominant sensory register, used to bias scene selection. */
  channel: Channel;
  /** 0 (pristine) .. 1 (fully forgotten / decayed). */
  decay: number;
  /** The manufactured year. */
  era: number;
  /** Coarse time-of-day band. */
  band: TimeBand;
  /** Manufactured clock time, 0..23 hours and 0..59 minutes. */
  hour: number;
  minute: number;
  /** Where the emotion sits in affect space. */
  affect: AffectVector;
  /** Nearest named emotion family (anemoia, saudade, …). */
  family: string;
}

/** The readout panel on the front of the machine. */
export interface Readout {
  valence: number;
  arousal: number;
  family: string;
  /** The machine's (entirely performative) confidence, 0..1. */
  confidence: number;
  /** 0..100. Higher = more industrially nostalgic. */
  nostalgiaIndex: number;
}

/** A single manufactured emotion, stamped and ready to ship. */
export interface Emotion {
  /** The headline phrase — the product. */
  phrase: string;
  /** Batch/serial number, e.g. "EMO-2007-0213-A7F3". */
  serial: string;
  /** Echo of the inputs that produced this unit. */
  inputs: EmotionInputs;
  /** Extracted latent features. */
  features: EmotionFeatures;
  /** Front-panel readout. */
  readout: Readout;
  /** Alternate phrasings off the same production run. */
  alternates: string[];
}

export interface GenerateOptions {
  /** Override the manufactured year. */
  era?: number;
  /** Override base seed (defaults to a hash of the inputs). */
  seed?: number;
}
