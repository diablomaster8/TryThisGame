import { describe, expect, it } from 'vitest';
import type { AiLevel, BattleContext } from '../../src/sim/battle/types';
import '../../src/sim/battle/tactics/ai';
import { createTactics } from '../../src/sim/battle/tactics/engine';
import { mapFromRows } from '../../src/sim/battle/tactics/map';
import { unitFromLevels } from '../../src/sim/battle/tactics/units';
import type { NubbinType } from '../../src/sim/types';

const ctx: BattleContext = { kind: 'dojo', tier: 1, ids: [] };

const field16 = mapFromRows(
  [
    '................',
    '....##..........',
    '................',
    '......,,,.......',
    '.....,,~,,......',
    '......,,,....T..',
    '................',
    '..*.........*...',
    '................',
    '..."""..........',
    '...."".....mm...',
    '................',
    '.......====.....',
    '..L.............',
    '................',
    '................',
  ],
  [
    '0000000000000000',
    '0000330000000000',
    '0000110000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000001110000',
    '0000000001210000',
    '0000000001110000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
);

const TYPES: NubbinType[] = ['power', 'swim', 'run', 'fly', 'normal', 'power'];

function team(side: 0 | 1, n: number, level = 20) {
  const xs = side === 0 ? [0, 1] : [15, 14];
  return Array.from({ length: n }, (_, i) =>
    unitFromLevels({
      id: `${side ? 'f' : 'a'}${i}`,
      side,
      species: 'chao',
      level,
      type: TYPES[i % TYPES.length]!,
      at: { x: xs[i % 2]!, y: 2 + Math.floor(i / 2) * 3 },
    }),
  );
}

describe('tactical AI (R0252)', () => {
  it('decides in under 8 ms on a 16×16 map with 12 units', () => {
    let turns = 0;
    let ms = 0;
    for (let seed = 1; seed <= 3; seed++) {
      const t0 = performance.now();
      const s = createTactics({
        seed,
        map: field16,
        allies: team(0, 6),
        foes: team(1, 6),
        context: ctx,
        ai: ['keeper', 'champion'],
      });
      ms += performance.now() - t0;
      turns += s.turns;
      expect(s.result).not.toBeNull();
    }
    expect(ms / turns).toBeLessThan(8);
  }, 60_000);

  it('Champion beats Sprout at least 80% of the time', () => {
    let champ = 0;
    const bouts = 20;
    for (let seed = 1; seed <= bouts; seed++) {
      const champSide = (seed % 2) as 0 | 1;
      const ai: [AiLevel, AiLevel] =
        champSide === 0 ? ['champion', 'sprout'] : ['sprout', 'champion'];
      const s = createTactics({
        seed: seed * 31,
        map: field16,
        allies: team(0, 3),
        foes: team(1, 3),
        context: ctx,
        ai,
      });
      if (s.result?.winner === champSide) champ++;
    }
    expect(champ / bouts).toBeGreaterThanOrEqual(0.8);
  }, 60_000);

  it('replays exactly from the seed', () => {
    const run = () =>
      createTactics({
        seed: 99,
        map: field16,
        allies: team(0, 3),
        foes: team(1, 3),
        context: ctx,
        ai: ['keeper', 'keeper'],
      });
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });
});
