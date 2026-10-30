import { describe, expect, it } from 'vitest';
import { EDU_LADDER } from '../../src/config/edu';
import { makeRound } from '../../src/minigames/edu/games';
import { eduItemWeight, eduMastery, eduRung, eduWeigher } from '../../src/sim/edu';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function sprout(age: 3 | 4 | 5 | 6): World {
  const world = createWorld(1, 0);
  applyCommand(world, { kind: 'eduStart', age }, []);
  return world;
}

const say = (w: World) => EDU_LADDER.counting[eduRung(w, 'counting')]!.say;

/** One sitting of rounds with these stars each. */
function sitting(w: World, stars: number[], item?: (i: number) => string): void {
  const events: SimEvent[] = [];
  stars.forEach((s, i) =>
    applyCommand(
      w,
      { kind: 'eduResult', game: 'counting', stars: s, first: i === 0, item: item?.(i) },
      events,
    ),
  );
}

describe('R0682 (KIDS-14) skills ladder', () => {
  it('starts by age and climbs one rung after six perfect counting rounds', () => {
    const w = sprout(4);
    expect(say(w)).toBe('count to 5');
    sitting(w, [3, 3, 3, 3, 3, 3]);
    expect(say(w)).toBe('count to 10');
  });

  it('two shown answers in a sitting move down one rung, never two', () => {
    const w = sprout(5);
    expect(say(w)).toBe('count to 10');
    sitting(w, [1, 1, 1, 1]);
    expect(say(w)).toBe('count to 5');
    // A new sitting may move again.
    sitting(w, [1, 1]);
    expect(say(w)).toBe('count to 3');
    sitting(w, [1, 1]);
    expect(say(w)).toBe('count to 3');
  });

  it('a rung persists through save and load', () => {
    const w = sprout(4);
    sitting(w, [3, 3, 3]);
    const back = deserialize(serialize(w, 0)).world;
    expect(eduRung(back, 'counting')).toBe(2);
  });

  it('makes the rung’s rounds: count to 3, then sums to 10', () => {
    const rng = Rng.fromSeed(7);
    for (let i = 0; i < 50; i++) {
      const r = makeRound('counting', 4, rng, undefined, 'sprout', undefined, { rung: 0 });
      expect(r.cue?.kind).toBe('count');
      if (r.cue?.kind === 'count') expect(r.cue.n).toBeLessThanOrEqual(3);
    }
    let sums = 0;
    for (let i = 0; i < 200; i++) {
      const r = makeRound('counting', 6, rng, undefined, 'sprout', undefined, { rung: 5 });
      if (r.cue?.kind === 'sum') {
        sums++;
        expect(r.cue.a + r.cue.b).toBeLessThanOrEqual(10);
        expect(r.options[r.answer]).toEqual({ kind: 'number', n: r.cue.a + r.cue.b });
      }
    }
    expect(sums).toBeGreaterThan(100);
  });

  it('readers have no ladder', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 6, band: 'reader' }, []);
    sitting(w, [3, 3, 3, 3]);
    expect(w.edu?.skills).toBeUndefined();
  });
});

describe('R0683 (KIDS-15) per-item mastery', () => {
  it('after 20 letter rounds with G always missed, G weighs the most', () => {
    const w = sprout(5);
    const letters = 'ABCDEFGHIJ'.split('');
    for (let i = 0; i < 20; i++) {
      const l = letters[i % letters.length]!;
      applyCommand(
        w,
        { kind: 'eduResult', game: 'letters', stars: l === 'G' ? 1 : 3, item: `letter:${l}` },
        [],
      );
    }
    const weigh = eduWeigher(w);
    const ws = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .map((l) => [l, weigh(`letter:${l}`)] as const);
    const top = ws.reduce((a, b) => (b[1] > a[1] ? b : a));
    expect(top[0]).toBe('G');
    expect(eduMastery(w.edu?.items?.['letter:G'])).toBe('learning');
    expect(eduMastery(w.edu?.items?.['letter:Z'])).toBe('new');
    expect(eduMastery(w.edu?.items?.['letter:B'])).toBe('learning');
    expect(eduMastery({ seen: 4, firstTry: 4, lastMs: 0 })).toBe('known');
  });

  it('weighted picks favour the weak item and are seeded', () => {
    const weigh = (id: string) =>
      eduItemWeight(
        id === 'letter:G'
          ? { seen: 5, firstTry: 0, lastMs: 0 }
          : { seen: 5, firstTry: 5, lastMs: 0 },
        10 * 60_000,
      );
    const run = (seed: number) => {
      const rng = Rng.fromSeed(seed);
      const out: string[] = [];
      for (let i = 0; i < 300; i++)
        out.push(
          makeRound('letters', 5, rng, undefined, 'sprout', undefined, { rung: 2, weigh }).item!,
        );
      return out;
    };
    const a = run(3);
    expect(run(3)).toEqual(a);
    const g = a.filter((x) => x === 'letter:G').length;
    // Plain odds are 1 in 26 (about 12 of 300); weight 3 against 25 ones is about 32.
    expect(g).toBeGreaterThan(20);
  });

  it('every sprout round names its item', () => {
    const rng = Rng.fromSeed(11);
    for (const game of ['colours', 'letters', 'shapes', 'sounds', 'animals'] as const)
      for (let i = 0; i < 40; i++)
        expect(makeRound(game, 5, rng, undefined, 'sprout', undefined, { rung: 2 }).item).toMatch(
          /:/,
        );
  });
});
