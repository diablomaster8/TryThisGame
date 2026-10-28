import { describe, expect, it } from 'vitest';
import { EDU, EDU_AGES, EDU_GAMES, EDU_RECOMMENDED } from '../../src/config/edu';
import { countSyllables, makeRound, starsFor } from '../../src/minigames/edu/games';
import { eduBreakActive, eduBreakDue, enabledGames, recommendedGames } from '../../src/sim/edu';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('Learning Grove (educational mode)', () => {
  it('starts with the recommended games for the age and lets a grown-up change them', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 3 }, events);
    expect(world.edu?.age).toBe(3);
    expect([...enabledGames(world)].sort()).toEqual([...EDU_RECOMMENDED[3]].sort());
    // Personalise: add one, remove one.
    applyCommand(world, { kind: 'eduSetGame', game: 'letters', on: true }, events);
    applyCommand(world, { kind: 'eduSetGame', game: 'colours', on: false }, events);
    expect(enabledGames(world)).toContain('letters');
    expect(enabledGames(world)).not.toContain('colours');
    // A new age with reset goes back to its recommendations; without reset keeps the picks.
    applyCommand(world, { kind: 'eduSetAge', age: 5, resetGames: false }, events);
    expect(world.edu?.age).toBe(5);
    expect(enabledGames(world)).not.toContain('colours');
    applyCommand(world, { kind: 'eduSetAge', age: 5, resetGames: true }, events);
    expect(world.edu?.games).toEqual(recommendedGames(5));
    expect(events.some((e) => e.kind === 'eduStarted')).toBe(true);
  });

  it('pays Shells per star, counts stickers and clamps the session length', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 4 }, events);
    const shells = world.inventory.shells;
    for (let i = 0; i < 3; i++) {
      applyCommand(world, { kind: 'eduResult', game: 'counting', stars: 3 }, events);
    }
    expect(world.inventory.shells).toBe(shells + 9 * EDU.shellsPerStar);
    expect(world.edu?.progress.counting).toEqual({ plays: 3, stars: 9 });
    expect(world.edu?.stickers).toBe(Math.floor(9 / EDU.starsPerSticker));
    expect(events.filter((e) => e.kind === 'eduResult' && e.sticker)).toHaveLength(1);
    applyCommand(world, { kind: 'eduSetSession', minutes: 500 }, events);
    expect(world.edu?.sessionMinutes).toBe(EDU.sessionRange[1]);
    applyCommand(world, { kind: 'eduSetSession', minutes: 1 }, events);
    expect(world.edu?.sessionMinutes).toBe(EDU.sessionRange[0]);
  });

  it('asks for a break after the session length and survives a save round trip', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 6 }, events);
    applyCommand(world, { kind: 'eduSetSession', minutes: 10 }, events);
    applyCommand(world, { kind: 'eduSetName', name: 'Ada' }, events);
    for (let i = 0; i < 10 * 60 * 10; i++) stepWorld(world, 100);
    expect(eduBreakDue(world)).toBe(true);
    applyCommand(world, { kind: 'eduResetSession' }, events);
    expect(eduBreakDue(world)).toBe(false);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.edu?.age).toBe(6);
    expect(back.edu?.childName).toBe('Ada');
    expect(back.edu?.games).toEqual(world.edu?.games);
    // Older saves without the field default to no educational mode.
    const plain = createWorld(1, 0) as unknown as { edu?: unknown };
    delete plain.edu;
    expect(deserialize(serialize(plain as never, 0)).world.edu).toBeNull();
  });

  it('generates a valid round for every game at every age, with the answer among the options', () => {
    const rng = Rng.fromSeed('edu');
    for (const age of EDU_AGES) {
      for (const game of EDU_GAMES) {
        for (let i = 0; i < 40; i++) {
          const r = makeRound(game, age, rng, i % 2 ? 'Ada' : undefined);
          expect(r.game).toBe(game);
          expect(r.options.length).toBeGreaterThanOrEqual(2);
          expect(r.options.length).toBeLessThanOrEqual(age <= 3 ? 3 : 4);
          expect(r.answer).toBeGreaterThanOrEqual(0);
          expect(r.answer).toBeLessThan(r.options.length);
          expect(r.prompt.length).toBeGreaterThan(0);
          expect(r.teach.length).toBeGreaterThan(0);
          // Options are distinct, except the "which is not" sort, where the rest match on purpose.
          const keys = r.options.map((o) => JSON.stringify(o));
          if (!r.prompt.startsWith('Which one is not'))
            expect(new Set(keys).size).toBe(keys.length);
        }
      }
    }
  });

  it('keeps age-3 content within readiness limits: counts to 3, five colours, three shapes', () => {
    const rng = Rng.fromSeed(7);
    for (let i = 0; i < 60; i++) {
      const c = makeRound('counting', 3, rng);
      for (const o of c.options) if (o.kind === 'number') expect(o.n).toBeLessThanOrEqual(3);
      const s = makeRound('shapes', 3, rng);
      for (const o of s.options) {
        if (o.kind === 'shape') expect(['circle', 'square', 'triangle']).toContain(o.shape);
      }
      const col = makeRound('colours', 3, rng);
      expect(col.options.every((o) => o.kind === 'colour')).toBe(true);
    }
  });

  it('scores stars by tries and counts syllables sensibly', () => {
    expect(starsFor(1)).toBe(3);
    expect(starsFor(2)).toBe(2);
    expect(starsFor(3)).toBe(1);
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('apple')).toBe(2);
    expect(countSyllables('umbrella')).toBe(3);
  });
});

describe('the break is enforced (KIDS-07)', () => {
  it('starts a timed break, keeps it across a save round trip, and a grown-up can end it', () => {
    const world = createWorld(1, 5_000);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 6 }, events);
    applyCommand(world, { kind: 'eduStartBreak' }, events);
    const until = world.edu!.breakUntilMs;
    expect(until).toBe(5_000 + EDU.breakMinutes * 60_000);
    expect(eduBreakActive(world, 6_000)).toBe(true);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.edu?.breakUntilMs).toBe(until);
    expect(eduBreakActive(back, until - 1)).toBe(true);
    expect(eduBreakActive(back, until)).toBe(false);
    applyCommand(world, { kind: 'eduEndBreak' }, events);
    expect(eduBreakActive(world, 6_000)).toBe(false);
  });

  it('does not count catch-up, hidden or fast-clock steps as play', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'eduStart', age: 6 }, []);
    for (let i = 0; i < 2 * 60 * 60 * 10; i++) stepWorld(world, 100, undefined, true);
    expect(world.edu?.playedMs).toBe(0);
    for (let i = 0; i < 100; i++) stepWorld(world, 100, 1_000, false, false);
    expect(world.edu?.playedMs).toBe(0);
    for (let i = 0; i < 10; i++) stepWorld(world, 100, 1_000);
    expect(world.edu?.playedMs).toBe(1000);
    expect(world.edu?.todayMs).toBe(1000);
  });

  it('migrates a version-5 save with edu state', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'eduStart', age: 6 }, []);
    const old = JSON.parse(serialize(world, 0)) as { version: number; world: { edu: object } };
    old.version = 5;
    for (const k of ['breakUntilMs', 'todayMs', 'todayKey'])
      delete (old.world.edu as Record<string, unknown>)[k];
    const migrated = deserialize(JSON.stringify(old)).world;
    expect(migrated.edu?.breakUntilMs).toBe(0);
    expect(migrated.edu?.todayKey).toBe('');
  });
});
