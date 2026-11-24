/**
 * Deterministic seeded randomness.
 *
 * The whole point of an *industrialized* emotion is that it's reproducible:
 * the same five inputs must always roll off the line as the same emotion.
 * So every "random" choice is driven by a seed derived from the inputs.
 */

/** FNV-1a 32-bit string hash. Stable across runs and platforms. */
export function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, well-distributed PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Weighted<T> {
  value: T;
  weight: number;
}

/** Seeded chooser with the small set of operations the machine needs. */
export class Rng {
  private next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed >>> 0);
  }

  /** Float in [0, 1). */
  float(): number {
    return this.next();
  }

  /** Integer in [minInclusive, maxInclusive]. */
  int(minInclusive: number, maxInclusive: number): number {
    return minInclusive + Math.floor(this.next() * (maxInclusive - minInclusive + 1));
  }

  /** True with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  /** Uniform pick from an array. */
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /** Weighted pick. Weights need not sum to 1; non-positive weights are skipped. */
  weightedPick<T>(items: readonly Weighted<T>[]): T {
    const total = items.reduce((sum, it) => sum + Math.max(0, it.weight), 0);
    if (total <= 0) return items[Math.floor(this.next() * items.length)].value;
    let roll = this.next() * total;
    for (const it of items) {
      roll -= Math.max(0, it.weight);
      if (roll <= 0) return it.value;
    }
    return items[items.length - 1].value;
  }
}
