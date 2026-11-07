import { describe, expect, it } from 'vitest';
import { buddyReaction, countOf, fingerRows } from '../../src/ui/edu-buddy';
import { makeRound, type EduRound } from '../../src/minigames/edu/games';
import { EDU_GAMES } from '../../src/config/edu';
import { EDU_HAT_IDS } from '../../src/config/cosmetics-edu';
import { cosmetic } from '../../src/config/cosmetics';
import { Rng } from '../../src/sim/rng';

/** R0741 (KIDS-73): the buddy points at the right picture and counts on its fingers. */
describe('the learning buddy copies the answer (R0741)', () => {
  const rounds = (game: (typeof EDU_GAMES)[number], n = 40): EduRound[] => {
    const rng = Rng.fromSeed(11);
    return Array.from({ length: n }, () => makeRound(game, 5, rng));
  };

  it('counts on a counting round and says how many', () => {
    for (const r of rounds('counting')) {
      const n = countOf(r);
      expect(n, r.prompt).not.toBeNull();
      expect(buddyReaction(r)).toBe('count');
    }
  });

  it('points on colour rounds and on letter rounds', () => {
    for (const game of ['colours', 'letters'] as const)
      for (const r of rounds(game)) expect(buddyReaction(r), `${game} ${r.prompt}`).toBe('point');
  });

  it('every game gets some reaction and a count is always one to ten fingers', () => {
    for (const game of EDU_GAMES)
      for (const r of rounds(game, 20)) {
        expect(['point', 'count', 'cheer']).toContain(buddyReaction(r));
        if (buddyReaction(r) === 'count')
          expect(fingerRows(countOf(r)!).reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
      }
  });

  it('shows fingers a hand at a time, never past two hands', () => {
    expect(fingerRows(0)).toEqual([]);
    expect(fingerRows(3)).toEqual([3]);
    expect(fingerRows(5)).toEqual([5]);
    expect(fingerRows(7)).toEqual([5, 2]);
    expect(fingerRows(25)).toEqual([5, 5]);
  });

  it('the three domain keepsakes are hats drawn in both renderers from data', () => {
    expect(EDU_HAT_IDS).toEqual(['edu-abacus', 'edu-paintbrush', 'edu-book']);
    for (const id of EDU_HAT_IDS) {
      const c = cosmetic(id)!;
      expect(c.slot).toBe('hat');
      expect(c.bespoke).toBeUndefined();
      expect(c.px?.length).toBeGreaterThan(3);
      expect(c.mesh?.length).toBeGreaterThan(2);
      expect(c.label).not.toBe(id);
    }
  });
});
