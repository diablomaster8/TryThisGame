import { describe, expect, it } from 'vitest';
import { EDU_DOMAIN, EDU_LADDER, EDU_READER_GAMES } from '../../src/config/edu';
import { EDU_ROUND_STANDARDS } from '../../src/config/edu-standards-r10';
import { EDU_HABITATS, EDU_READING } from '../../src/config/edu-reader-r13';
import { EDU_TEXT } from '../../src/config/strings';
import { EDU_TEXT_HE } from '../../src/config/strings-edu-he';
import { STANDARD_LABELS } from '../../src/config/strings-access-r10';
import { makeRound, roundKey } from '../../src/minigames/edu/games';
import { Rng } from '../../src/sim/rng';
import { createEdu, enabledGames, gamesForBand } from '../../src/sim/edu';
import { createWorld } from '../../src/sim/world';

describe('R0716 (KIDS-48) the reader band has six or more games', () => {
  it('offers at least 6 distinct games, 8 in all, and the grown-up list follows', () => {
    expect(new Set(EDU_READER_GAMES).size).toBeGreaterThanOrEqual(6);
    expect(EDU_READER_GAMES).toHaveLength(8);
    expect(gamesForBand('reader')).toEqual(EDU_READER_GAMES);
    // Sprouts never see the reader-only games.
    for (const g of ['times', 'timeMoney', 'numbers', 'reading', 'science'] as const)
      expect(gamesForBand('sprout')).not.toContain(g);
  });

  it('a fresh reader save has every reader game switched on', () => {
    const world = createWorld(7, 0);
    world.edu = createEdu(6, 'reader');
    expect(enabledGames(world).sort()).toEqual([...EDU_READER_GAMES].sort());
  });

  it('every reader game has a ladder, a domain, standards and plain words', () => {
    for (const id of EDU_READER_GAMES) {
      expect(EDU_LADDER[id].length, id).toBeGreaterThan(0);
      expect(EDU_DOMAIN[id], id).toBeTruthy();
      expect(EDU_ROUND_STANDARDS[id].length, id).toBeGreaterThan(0);
      for (const code of EDU_ROUND_STANDARDS[id]) expect(STANDARD_LABELS[code], code).toBeTruthy();
      expect(EDU_TEXT.gameNames[id], id).toBeTruthy();
      expect(EDU_TEXT.gameBlurbs[id], id).toBeTruthy();
      expect(EDU_TEXT.gameIcons[id], id).toBeTruthy();
      expect(EDU_TEXT_HE.gameNames[id], id).toBeTruthy();
    }
  });

  it('each reader game makes a valid round for seeds 1 to 50', () => {
    for (const game of EDU_READER_GAMES) {
      for (let seed = 1; seed <= 50; seed++) {
        const rng = Rng.fromSeed(seed);
        for (let i = 0; i < 4; i++) {
          const r = makeRound(game, 6, rng, undefined, 'reader');
          const ctx = `${game} seed ${seed}: ${r.prompt}`;
          expect(r.game, ctx).toBe(game);
          expect(r.prompt.length, ctx).toBeGreaterThan(0);
          expect(r.teach.length, ctx).toBeGreaterThan(0);
          expect(r.options.length, ctx).toBeGreaterThanOrEqual(2);
          expect(r.answer, ctx).toBeGreaterThanOrEqual(0);
          expect(r.answer, ctx).toBeLessThan(r.options.length);
          const keys = r.options.map((o) => JSON.stringify(o));
          expect(new Set(keys).size, ctx).toBe(keys.length);
        }
      }
    }
  });

  it('no target repeats within 10 rounds in any reader game', () => {
    for (const game of EDU_READER_GAMES) {
      for (let seed = 1; seed <= 50; seed++) {
        const rng = Rng.fromSeed(seed);
        const used = new Set<string>();
        const keys: string[] = [];
        for (let i = 0; i < 10; i++)
          keys.push(roundKey(makeRound(game, 6, rng, undefined, 'reader', used)));
        expect(new Set(keys).size, `${game} seed ${seed}`).toBe(10);
      }
    }
  });

  it('is deterministic for a seed', () => {
    for (const game of EDU_READER_GAMES) {
      const a = makeRound(game, 6, Rng.fromSeed(99), undefined, 'reader');
      const b = makeRound(game, 6, Rng.fromSeed(99), undefined, 'reader');
      expect(b).toEqual(a);
    }
  });
});

describe('R0716 the new reader games', () => {
  it('reading: 3 questions per passage, short original text, a picture, who/what/why', () => {
    for (const p of EDU_READING) {
      expect(p.icon).toBeTruthy();
      expect(p.text.split(/[.!?]\s/).length).toBeLessThanOrEqual(3);
      expect(p.qs.map((q) => q.q.split(' ')[0])).toEqual(['Who', 'What', 'Why']);
      for (const q of p.qs) {
        expect(new Set([q.right, ...q.wrong]).size).toBe(4);
        expect(q.right.length).toBeLessThanOrEqual(28);
      }
    }
    const r = makeRound('reading', 6, Rng.fromSeed(3), undefined, 'reader');
    expect(r.cue?.kind).toBe('picture');
    expect(r.options).toHaveLength(4);
  });

  it('times: tables 2 to 12 with one right answer', () => {
    const rng = Rng.fromSeed(8);
    const seen = new Set<number>();
    for (let i = 0; i < 300; i++) {
      const r = makeRound('times', 6, rng, undefined, 'reader');
      const m = /(\d+) × (\d+)/.exec(r.prompt);
      if (m) {
        seen.add(Number(m[2]));
        const o = r.options[r.answer]!;
        expect(o.kind === 'number' && o.n).toBe(Number(m[1]) * Number(m[2]));
      }
    }
    expect(Math.min(...seen)).toBe(2);
    expect(Math.max(...seen)).toBe(12);
  });

  it('clock and Shells make both kinds of round; science covers all four sorts', () => {
    const rng = Rng.fromSeed(11);
    const kinds = new Set<string>();
    for (let i = 0; i < 200; i++)
      kinds.add(makeRound('timeMoney', 6, rng, undefined, 'reader').cue?.kind ?? 'none');
    expect(kinds).toEqual(new Set(['clock', 'none']));
    const asks = new Set<string>();
    for (let i = 0; i < 400; i++) {
      const p = makeRound('science', 6, rng, undefined, 'reader').prompt;
      asks.add(
        /living/.test(p)
          ? 'living'
          : /float/.test(p)
            ? 'float'
            : /solid/.test(p)
              ? 'water'
              : 'habitat',
      );
    }
    expect(asks.size).toBe(4);
    expect(EDU_HABITATS.length).toBeGreaterThanOrEqual(4);
  });
});
