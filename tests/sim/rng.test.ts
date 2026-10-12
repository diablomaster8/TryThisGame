import { describe, expect, it } from 'vitest';
import { Rng, hashSeed } from '../../src/sim/rng';

describe('Rng', () => {
  it('is deterministic for the same seed', () => {
    const a = Rng.fromSeed(42);
    const b = Rng.fromSeed(42);
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });

  it('differs between seeds', () => {
    const a = Rng.fromSeed('one');
    const b = Rng.fromSeed('two');
    expect(a.next()).not.toBe(b.next());
  });

  it('stays in [0, 1) and int() stays inclusive', () => {
    const r = Rng.fromSeed(7);
    for (let i = 0; i < 1000; i++) {
      const f = r.next();
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
      const n = r.int(3, 5);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(5);
    }
  });

  it('serialises through its state word', () => {
    const a = Rng.fromSeed(99);
    a.next();
    a.next();
    const b = new Rng(a.state);
    expect(b.next()).toBe(a.next());
  });

  it('weighted picks respect weights', () => {
    const r = Rng.fromSeed(1);
    let heavy = 0;
    for (let i = 0; i < 2000; i++) if (r.weighted({ heavy: 9, light: 1 }) === 'heavy') heavy++;
    expect(heavy).toBeGreaterThan(1650);
    expect(heavy).toBeLessThan(1950);
  });

  it('hashes strings and numbers to 32-bit states', () => {
    expect(hashSeed('grove')).toBe(hashSeed('grove'));
    expect(hashSeed(12)).toBe(hashSeed('12'));
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });
});
