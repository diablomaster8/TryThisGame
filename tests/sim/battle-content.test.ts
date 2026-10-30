import { describe, expect, it } from 'vitest';
import { BATTLE_MOVE_TEXT } from '../../src/config/strings-battle-moves';
import { BATTLE_CONTENT } from '../../src/config/tuning-battle';
import { MOVES, ctBonusOf, moveProblems, type ContentMove } from '../../src/sim/battle/moves';
import {
  BELT_MOVES,
  GOOD_LOSER,
  PERSONALITY_MOVE,
  sourcesOf,
} from '../../src/sim/battle/moves-sources';
import { STATUS_DEFS } from '../../src/sim/battle/status';
import { STATUS_IDS } from '../../src/sim/battle/types';
import { hatch } from '../../src/sim/lifecycle';
import { createWorld } from '../../src/sim/world';

/**
 * Round 5 (recs FIGHT-70): the move list is written once for both modes. This is the lint a
 * new move must pass: a turn block and a grid block (or a one-mode mark), a name, a blurb and
 * an anim, and the shared mapping rules between the two modes.
 */
function problems(m: ContentMove): string[] {
  const out = moveProblems(m);
  if (!BATTLE_MOVE_TEXT[m.id]?.name) out.push('no name');
  if (!BATTLE_MOVE_TEXT[m.id]?.blurb) out.push('no blurb');
  return out;
}

describe('shared move content (recs FIGHT-70)', () => {
  it('every move passes: both blocks, a name, a blurb and an anim', () => {
    expect(MOVES.length).toBeGreaterThanOrEqual(60);
    for (const m of MOVES) expect(problems(m), m.id).toEqual([]);
  });

  it('fails a move with no grid block, and one with no strings', () => {
    const bonk = MOVES[0]!;
    const noGrid: Partial<ContentMove> = { ...bonk };
    delete noGrid.grid;
    expect(problems(noGrid as ContentMove)).toContain('no grid block');
    expect(problems({ ...(noGrid as ContentMove), turnOnly: true })).toEqual([]);
    expect(problems({ ...bonk, id: 'brand-new' })).toEqual(['no name', 'no blurb']);
    expect(problems({ ...bonk, anim: '' })).toContain('no anim');
  });

  it('turn allFoes goes with a grid ring, and priority +1 is +10 CT on the grid', () => {
    for (const m of MOVES) expect((m.target === 'allFoes') === (m.grid.aoe === 'ring1')).toBe(true);
    const fast = MOVES.find((m) => m.priority === 1)!;
    expect(ctBonusOf(fast)).toBe(10);
    expect(ctBonusOf(MOVES[0]!)).toBe(0);
    expect(problems({ ...MOVES[0]!, target: 'allFoes' })).toContain(
      'allFoes and a ring aoe must go together',
    );
  });

  it('every status lasts turns × 10 CT ticks on the grid', () => {
    for (const id of STATUS_IDS) {
      const d = STATUS_DEFS[id];
      expect(d.ctTicks).toEqual(d.turns.map((t) => t * BATTLE_CONTENT.ctPerTurn));
    }
  });

  it('the comedy moves are learned: by personality, by belt and by losing well', () => {
    const w = createWorld(2, 0);
    const n = w.nubbins[0]!;
    hatch(n, [], 0);
    expect(sourcesOf(n)).not.toContain('noogie');
    n.personality = 'mischievous';
    n.karate = { wins: 2, losses: 0, belt: 2 };
    n.battle = {
      known: [],
      slots: [null, null, null, null],
      wins: 0,
      losses: 3,
      befriended: 0,
      life: 0,
    };
    const k = sourcesOf(n);
    expect(k).toEqual(expect.arrayContaining([PERSONALITY_MOVE.mischievous!, GOOD_LOSER.move]));
    expect(k).toEqual(expect.arrayContaining(BELT_MOVES.slice(0, 2)));
    expect(k).not.toContain(BELT_MOVES[2]);
    for (const id of [...Object.values(PERSONALITY_MOVE), ...BELT_MOVES, GOOD_LOSER.move])
      expect(
        MOVES.some((m) => m.id === id),
        id,
      ).toBe(true);
  });
});
