import { describe, expect, it } from 'vitest';
import {
  CREATOR_COLOURS,
  CREATOR_LOOKS,
  creatorCatalogue,
  pickProblem,
} from '../../src/sim/creator';
import { SPECIES } from '../../src/sim/species';

const cat = creatorCatalogue();
const has = (f: (p: (typeof cat)[number]['pick']) => boolean): boolean =>
  cat.some((e) => f(e.pick));

describe('creator catalogue', () => {
  it('has unique ids and every entry passes pickProblem', () => {
    expect(new Set(cat.map((e) => e.id)).size).toBe(cat.length);
    for (const e of cat) expect(pickProblem(e.pick), e.id).toBeNull();
  });

  it('covers every species id', () => {
    const seen = new Set(cat.map((e) => e.pick.species));
    for (const s of SPECIES) expect(seen.has(s.id), s.id).toBe(true);
  });

  it('covers every Chao form, look and colour', () => {
    const bands = ['sun', 'moon', 'neutral'] as const;
    const types = ['normal', 'swim', 'fly', 'run', 'power'] as const;
    for (const band of bands) {
      expect(has((p) => p.stage === 'eternal' && p.band === band)).toBe(true);
      for (const type of types) {
        expect(has((p) => p.stage === 'first' && p.band === band && p.type === type)).toBe(true);
        for (const second of types)
          for (const stage of ['second', 'radiant'])
            expect(
              has(
                (p) =>
                  p.stage === stage && p.band === band && p.type === type && p.second === second,
              ),
            ).toBe(true);
      }
    }
    for (const look of CREATOR_LOOKS) expect(has((p) => p.look === look)).toBe(true);
    for (const c of CREATOR_COLOURS)
      expect(has((p) => p.stage === 'child' && p.eggColor === c)).toBe(true);
    expect(has((p) => p.shiny === true)).toBe(true);
    expect(has((p) => !!p.tone)).toBe(true);
    expect(cat.filter((e) => e.pick.stage === 'second')).toHaveLength(75);
    expect(cat.filter((e) => e.pick.stage === 'radiant' && e.family === 'chao')).toHaveLength(75);
  });
});
