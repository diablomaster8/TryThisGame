import { describe, expect, it } from 'vitest';
import { eduEggShelf, eduEggStock } from '../../src/sim/edu-eggs';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

describe('R0692 (KIDS-24) Learning Grove egg shelf', () => {
  it('shows three different colours a day, the same all day, new the next', () => {
    const a = eduEggStock('2026-10-30', 5);
    expect(new Set(a).size).toBe(3);
    expect(eduEggStock('2026-10-30', 5)).toEqual(a);
    const days = ['2026-10-31', '2026-11-01', '2026-11-02'].map((d) => eduEggStock(d, 5).join());
    expect(days.some((d) => d !== a.join())).toBe(true);
  });

  it('buying an egg hatches exactly that colour, once a day per place', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const w = createWorld(seed, Date.UTC(2026, 9, 30, 12));
      applyCommand(w, { kind: 'eduStart', age: 4 }, []);
      w.inventory.shells = 10_000;
      const { colours } = eduEggShelf(w);
      const events: SimEvent[] = [];
      const before = w.nubbins.length;
      applyCommand(w, { kind: 'buy', item: 'egg', pick: 1 }, events);
      const egg = w.nubbins[w.nubbins.length - 1]!;
      expect(w.nubbins.length).toBe(before + 1);
      expect(egg.eggColor).toBe(colours[1]);
      expect(egg.species).toBe('chao');
      expect(egg.shiny ?? false).toBe(false);
      expect(egg.tone ?? null).toBeNull();
      // The same egg cannot be bought twice today.
      applyCommand(w, { kind: 'buy', item: 'egg', pick: 1 }, events);
      expect(w.nubbins.length).toBe(before + 1);
      expect(eduEggShelf(w).bought).toEqual([1]);
    }
  });
});
