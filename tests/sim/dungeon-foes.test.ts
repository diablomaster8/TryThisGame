import { describe, expect, it } from 'vitest';
import { actStartDepth } from '../../src/config/dungeon-acts';
import { actFamilies, FOE_FAMILIES } from '../../src/config/dungeon-foes';
import { HOLLOW } from '../../src/config/tuning';
import { actFloor } from '../../src/sim/dungeon-acts';
import { SPECIES } from '../../src/sim/species';

// R0157: each act fields its own four foe families; Act V's Greylings are the earlier ones.

describe('foe families per act (R0157)', () => {
  it('gives acts I–IV four families each, every look a real species', () => {
    for (let act = 0; act < 4; act++) expect(actFamilies(act)).toHaveLength(4);
    for (const f of FOE_FAMILIES) expect(SPECIES.some((s) => s.id === f.look)).toBe(true);
    const v = actFamilies(4);
    expect(v).toHaveLength(16);
    expect(v.every((f) => f.grey && f.id.startsWith('grey-'))).toBe(true);
  });

  it("an act's packs are its own families (Act V's grey)", () => {
    for (let act = 0; act < 5; act++) {
      const ids = new Set(actFamilies(act).map((f) => f.id));
      const looks = new Set(actFamilies(act).map((f) => f.look));
      for (let seed = 1; seed <= 4; seed++) {
        const f = actFloor(seed * 131, act, actStartDepth(act), HOLLOW.genVersion);
        const packs = (f.packs ?? []).filter((p) => p.kind !== 'boss' && p.kind !== 'unique');
        for (const p of packs) {
          expect(ids.has(p.family)).toBe(true);
          expect(p.members.every((m) => looks.has(m.species))).toBe(true);
          expect(!!p.grey).toBe(act === 4);
        }
      }
    }
  });
});
