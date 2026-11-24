/**
 * ASSAY stage — turn raw sensory inputs into latent emotional features.
 *
 * Each input nudges the manufactured emotion along an axis:
 *   color   → valence (warmth) + arousal (brightness) + decay (fade words)
 *   weather → valence/arousal + which time-of-day band the clock lands in
 *   sound   → arousal + sensory channel
 *   memory  → small valence nudge + decay (how worn the wording is)
 *   object  → the manufactured era
 */

import { FAMILIES } from './lexicon.js';
import { hashString, Rng } from './rng.js';
import type {
  AffectVector,
  Channel,
  EmotionFeatures,
  EmotionInputs,
  GenerateOptions,
  TimeBand,
} from './types.js';

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Coarse warmth (-1 cool .. +1 warm) and brightness (0 dark .. 1 bright) of a color. */
function classifyColor(raw: string): { warmth: number; brightness: number; faded: boolean } {
  const c = raw.toLowerCase().trim();
  const faded = /fade|bleach|pale|wash|dull|muted|grey|gray|sepia|dusty|ashen/.test(c);

  // Hex path.
  const hex = c.match(/^#?([0-9a-f]{6})$/);
  if (hex) {
    const n = parseInt(hex[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const warmth = clamp((r - b) / 255, -1, 1);
    return { warmth, brightness, faded };
  }

  // Named path: warm vs cool families.
  const warm = /red|orange|amber|gold|yellow|pink|peach|coral|crimson|rust|burnt|terracotta|magenta/.test(c);
  const cool = /blue|teal|cyan|navy|indigo|slate|steel|gray|grey|silver|mint|aqua|periwinkle/.test(c);
  const dark = /black|charcoal|midnight|navy|maroon|forest|deep|dark/.test(c);
  const light = /white|cream|ivory|pastel|light|pale|bright|neon|fluorescent/.test(c);

  let warmth = 0;
  if (warm) warmth += 0.5;
  if (cool) warmth -= 0.5;
  let brightness = 0.5;
  if (dark) brightness -= 0.3;
  if (light) brightness += 0.3;
  if (/neon|fluorescent/.test(c)) brightness += 0.2;
  return { warmth: clamp(warmth, -1, 1), brightness: clamp(brightness, 0, 1), faded };
}

/** Weather → affect nudge + a preferred time band. */
function classifyWeather(raw: string): { affect: AffectVector; nightLean: number } {
  const w = raw.toLowerCase();
  let valence = 0;
  let arousal = 0;
  let nightLean = 0; // -1 (daytime) .. +1 (night)

  if (/rain|drizzle|wet|damp|mist|fog|overcast|grey|gray|cloud/.test(w)) {
    valence -= 0.2;
    arousal -= 0.2;
    nightLean += 0.4;
  }
  if (/storm|thunder|lightning|wind|gale/.test(w)) {
    valence -= 0.3;
    arousal += 0.4;
    nightLean += 0.3;
  }
  if (/snow|sleet|frost|ice|cold|freezing/.test(w)) {
    valence += 0.1;
    arousal -= 0.3;
    nightLean += 0.1;
  }
  if (/sun|clear|bright|blue sky|warm|heat|hot/.test(w)) {
    valence += 0.2;
    arousal += 0.1;
    nightLean -= 0.6;
  }
  if (/humid|muggy|sticky|sultry|hazy/.test(w)) {
    arousal -= 0.2;
    nightLean -= 0.2;
  }
  if (/night|dark|dusk|twilight|evening/.test(w)) {
    nightLean += 0.7;
  }
  return { affect: { valence, arousal }, nightLean: clamp(nightLean, -1, 1) };
}

/** Sound → arousal nudge + sensory channel vote. */
function classifySound(raw: string): { arousal: number; channel: Channel | null } {
  const s = raw.toLowerCase();
  let arousal = 0;
  let channel: Channel | null = null;

  if (/beep|dial|modem|notification|ping|static|glitch|midi|chiptune|8-bit|loading|render/.test(s)) {
    channel = 'digital';
    arousal += 0.1;
  } else if (/engine|motor|fan|hum|whir|click|clack|mechanical|tape|reel|whirr/.test(s)) {
    channel = 'mechanical';
    arousal += 0.05;
  } else if (/voice|laugh|talk|chatter|crowd|conversation|footsteps|kids|children/.test(s)) {
    channel = 'social';
  } else if (/rain|wind|waves|birds|thunder|leaves|water|ocean|crickets/.test(s)) {
    channel = 'natural';
    arousal -= 0.1;
  }

  if (/loud|blaring|roar|crash|bang|shout|scream/.test(s)) arousal += 0.4;
  if (/quiet|silence|faint|distant|muffled|soft|low|hush/.test(s)) arousal -= 0.3;
  return { arousal, channel };
}

/** Memory fragment → small valence nudge + decay contribution. */
function classifyMemory(raw: string): { valence: number; decay: number } {
  const m = raw.toLowerCase();
  let valence = 0;
  let decay = 0;

  if (/can.?t remember|don.?t remember|used to|no longer|gone|lost|faded|blurry|vague|somewhere|once/.test(m)) {
    decay += 0.25;
  }
  if (/happy|warm|laugh|safe|love|home|sweet|good|sunshine|together/.test(m)) valence += 0.2;
  if (/sad|cried|alone|empty|left|miss|never|cold|afraid|last time/.test(m)) valence -= 0.2;

  // Terser fragments read as more eroded.
  const words = m.split(/\s+/).filter(Boolean).length;
  if (words > 0 && words <= 5) decay += 0.15;
  return { valence, decay: clamp(decay, 0, 1) };
}

/** Object → manufactured era (a year range biased by the object's vintage). */
function eraFromObject(raw: string, rng: Rng): number {
  const o = raw.toLowerCase();
  let lo = 1997;
  let hi = 2012;
  if (/tape|cassette|vhs|crt|walkman|vinyl|polaroid|camcorder/.test(o)) {
    lo = 1985;
    hi = 1999;
  } else if (/floppy|dial-up|aol|pager|tamagotchi|discman/.test(o)) {
    lo = 1995;
    hi = 2001;
  } else if (/ipod|myspace|msn|razr|sidekick|nintendo ds|psp/.test(o)) {
    lo = 2002;
    hi = 2008;
  } else if (/ps2|gamecube|game boy|gba|game ?cube/.test(o)) {
    lo = 2000;
    hi = 2006;
  } else if (/iphone|android|wii|youtube|facebook/.test(o)) {
    lo = 2007;
    hi = 2013;
  }
  return rng.int(lo, hi);
}

/** Vote on the dominant sensory channel from sound + object. */
function decideChannel(soundChannel: Channel | null, object: string): Channel {
  if (soundChannel) return soundChannel;
  const o = object.toLowerCase();
  if (/phone|computer|screen|console|game|disk|disc|monitor|keyboard|cd|dvd/.test(o)) return 'digital';
  if (/engine|motor|machine|fan|clock|radio|tape|gear|tool/.test(o)) return 'mechanical';
  if (/photo|letter|card|toy|note|ticket|jacket|chair|cup|book/.test(o)) return 'physical';
  return 'physical';
}

/** Map a night-lean (-1..1) and the seed to a concrete time band + clock time. */
function manufactureTime(nightLean: number, rng: Rng): { band: TimeBand; hour: number; minute: number } {
  // Bias toward liminal hours; nightLean shifts the distribution.
  const bands: { band: TimeBand; weight: number; hours: number[] }[] = [
    { band: 'dead-of-night', weight: 1 + nightLean * 2, hours: [0, 1, 2, 3] },
    { band: 'pre-dawn', weight: 1 + nightLean, hours: [4, 5] },
    { band: 'late-night', weight: 1 + nightLean * 1.5, hours: [22, 23] },
    { band: 'morning', weight: 1 - nightLean, hours: [9, 10, 11] },
    { band: 'dead-afternoon', weight: 1.5 - nightLean, hours: [13, 14, 15] },
    { band: 'golden-hour', weight: 1 - nightLean * 0.5, hours: [17, 18] },
    { band: 'dusk', weight: 1, hours: [19, 20] },
  ];
  const chosen = rng.weightedPick(bands.map((b) => ({ value: b, weight: b.weight })));
  const hour = rng.pick(chosen.hours);
  const minute = rng.int(0, 59);
  return { band: chosen.band, hour, minute };
}

/** Nearest named emotion family for an affect coordinate. */
export function nearestFamily(affect: AffectVector): string {
  let best = FAMILIES[0];
  let bestDist = Infinity;
  for (const f of FAMILIES) {
    const dv = f.centroid.valence - affect.valence;
    const da = f.centroid.arousal - affect.arousal;
    const dist = dv * dv + da * da;
    if (dist < bestDist) {
      bestDist = dist;
      best = f;
    }
  }
  return best.name;
}

/** Build the per-run seed from the inputs (or honor an override). */
export function seedFor(inputs: EmotionInputs, opts: GenerateOptions = {}): number {
  if (typeof opts.seed === 'number') return opts.seed >>> 0;
  const blob = [inputs.color, inputs.sound, inputs.memory, inputs.weather, inputs.object].join('␟');
  return hashString(blob);
}

/** Run the full ASSAY: inputs → latent features. */
export function assay(inputs: EmotionInputs, opts: GenerateOptions = {}): EmotionFeatures {
  const rng = new Rng(seedFor(inputs, opts));

  const color = classifyColor(inputs.color);
  const weather = classifyWeather(inputs.weather);
  const sound = classifySound(inputs.sound);
  const memory = classifyMemory(inputs.memory);

  // Affect: average the nudges, with color warmth/brightness as the base.
  const valence = clamp(
    (color.warmth * 0.4 + weather.affect.valence + memory.valence) / 2 + rng.float() * 0.1 - 0.05,
    -1,
    1,
  );
  const arousal = clamp(
    ((color.brightness - 0.5) * 0.8 + weather.affect.arousal + sound.arousal) / 2 + rng.float() * 0.1 - 0.05,
    -1,
    1,
  );
  const affect: AffectVector = { valence, arousal };

  // Decay: faded colors + worn memory wording + a little manufactured wear.
  const decay = clamp(
    0.35 + (color.faded ? 0.25 : 0) + memory.decay + rng.float() * 0.2 - 0.1,
    0,
    1,
  );

  const era = typeof opts.era === 'number' ? opts.era : eraFromObject(inputs.object, rng);
  const channel = decideChannel(sound.channel, inputs.object);
  const { band, hour, minute } = manufactureTime(weather.nightLean, rng);
  const family = nearestFamily(affect);

  return { channel, decay, era, band, hour, minute, affect, family };
}
