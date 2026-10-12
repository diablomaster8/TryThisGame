// Seeded random numbers. Mulberry32: one 32-bit state word, so it serialises as a
// single number. Nothing in sim/ may call Math.random.

export class Rng {
  constructor(public state: number) {
    this.state = state >>> 0;
  }

  static fromSeed(seed: number | string): Rng {
    return new Rng(hashSeed(seed));
  }

  /** Uniform float in [0, 1). */
  next(): number {
    let t = (this.state = (this.state + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  float(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  /** Integer in [min, max], inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    const item = items[Math.floor(this.next() * items.length)];
    if (item === undefined) throw new Error('pick from empty list');
    return item;
  }

  /** Weighted pick; weights need not sum to 1. */
  weighted<T extends string>(weights: Record<T, number>): T {
    const keys = Object.keys(weights) as T[];
    let total = 0;
    for (const k of keys) total += weights[k];
    let roll = this.next() * total;
    for (const k of keys) {
      roll -= weights[k];
      if (roll < 0) return k;
    }
    const last = keys[keys.length - 1];
    if (last === undefined) throw new Error('weighted pick with no keys');
    return last;
  }

  /** A fresh generator derived from this one, for per-entity streams. */
  fork(): Rng {
    return new Rng(Math.floor(this.next() * 4294967296));
  }
}

/** FNV-1a over the seed's string form, so any seed maps to a 32-bit state. */
export function hashSeed(seed: number | string): number {
  const text = String(seed);
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
