/**
 * R0421 (LOOK-51): the garden idle acts. Seeded by id and the clock (both modes agree), gaps
 * between the personality gags, five or more different acts in five minutes for a content
 * adult, the wave only near the Keeper, no spin under reduced motion and no tears on a trip.
 */
import { describe, expect, it } from 'vitest';
import { IDLE_ACTS } from '../../src/config/tuning-look-r10e';
import { gagAt } from '../../src/render/gag-play';
import {
  actDoodleAlpha,
  actDoodles,
  idleActAt,
  noteActDoodle,
  pickAct,
  type IdleActId,
} from '../../src/render/idle-acts';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { Nubbin, Personality } from '../../src/sim/types';

function adult(id: string, personality: Personality | null): Nubbin {
  const n = createEgg(id, { x: 0, z: 0 }, Rng.fromSeed(5));
  n.stage = 'adult';
  n.personality = personality;
  return n;
}

const NEAR = { x: 1, z: 1 };
const FAR = { x: 40, z: 40 };

function actsOver(n: Nubbin, ms: number, keeper = NEAR, reduce = false) {
  const seen = new Set<IdleActId>();
  const frames: Array<NonNullable<ReturnType<typeof idleActAt>>> = [];
  for (let t = 0; t < ms; t += 100) {
    const a = idleActAt(n, 1_000_000 + t, true, keeper, reduce);
    if (a) {
      seen.add(a.id);
      frames.push({ ...a, perf: { ...a.perf } });
    }
  }
  return { seen, frames };
}

describe('LOOK-51: garden idle acts', () => {
  it('shows five or more different acts in five minutes, for every personality', () => {
    for (const p of ['cheerful', 'shy', 'mischievous', 'lazy', null] as const)
      for (const id of ['a1', 'b2', 'c3']) {
        const { seen } = actsOver(adult(`${id}-${p}`, p), 5 * 60_000);
        expect(seen.size, `${id} ${p}: ${[...seen].join(',')}`).toBeGreaterThanOrEqual(5);
      }
  });

  it('never plays over a personality gag, and is the same every time (seeded)', () => {
    const n = adult('gagged', 'cheerful');
    for (let t = 0; t < 10 * 60_000; t += 200) {
      const now = 2_000_000 + t;
      if (gagAt(n, now, true)) expect(idleActAt(n, now, true, NEAR, false)).toBeNull();
      expect(idleActAt(n, now, true, NEAR, false)?.id).toBe(
        idleActAt(n, now, true, NEAR, false)?.id,
      );
    }
  });

  it('plays nothing when not content, or for an egg', () => {
    const n = adult('sulk', 'shy');
    for (let t = 0; t < 120_000; t += 500)
      expect(idleActAt(n, 1_000_000 + t, false, NEAR, false)).toBeNull();
    n.stage = 'egg';
    for (let t = 0; t < 120_000; t += 500)
      expect(idleActAt(n, 1_000_000 + t, true, NEAR, false)).toBeNull();
  });

  it('waves only with the Keeper within range', () => {
    for (const id of ['w1', 'w2', 'w3', 'w4']) {
      const { seen } = actsOver(adult(id, 'cheerful'), 20 * 60_000, FAR);
      expect(seen.has('wave')).toBe(false);
    }
    expect(pickAct({ ...IDLE_ACTS.weights.none, wave: 0 }, 0.999)).not.toBe('wave');
  });

  it('drops the spin and hops under reduced motion, and a trip never cries', () => {
    for (const id of ['r1', 'r2', 'r3']) {
      const { frames } = actsOver(adult(id, 'mischievous'), 20 * 60_000, NEAR, true);
      for (const f of frames) {
        expect(f.perf.turn).toBe(0);
        expect(f.perf.dy).toBe(0);
      }
      const all = actsOver(adult(id, 'mischievous'), 20 * 60_000).frames;
      for (const f of all.filter((x) => x.id === 'trip')) {
        expect(f.pose3d).not.toBe('cry');
        expect(f.clip).not.toBe('cry');
      }
      const dance = all.filter((x) => x.id === 'dance');
      if (dance.length) expect(Math.max(...dance.map((x) => x.perf.turn))).toBeGreaterThan(4);
    }
  });

  it('gives the drawing a crayon and the trumpet notes', () => {
    const all = ['d1', 'd2', 'd3', 'd4'].flatMap(
      (id) => actsOver(adult(id, 'shy'), 20 * 60_000).frames,
    );
    const draw = all.find((x) => x.id === 'draw');
    const horn = all.find((x) => x.id === 'trumpet');
    expect(draw?.perf.prop).toBe('crayon');
    expect(horn?.perf.prop).toBe('trumpet');
    expect(horn?.perf.notes).toBe(true);
  });

  it('lays one scribble per drawing that fades out after 30 s', () => {
    const n = adult('artist', 'shy');
    const frames = actsOver(n, 30 * 60_000).frames.filter((x) => x.id === 'draw');
    expect(frames.length).toBeGreaterThan(0);
    const before = actDoodles().length;
    noteActDoodle(n, frames[0]!, 5000, 12);
    noteActDoodle(n, frames[0]!, 5100, 12);
    expect(actDoodles().length).toBe(Math.min(before + 1, IDLE_ACTS.doodleMax));
    const d = actDoodles()[actDoodles().length - 1]!;
    expect(actDoodleAlpha(d, 5000 + IDLE_ACTS.playMs + 1000)).toBe(1);
    expect(actDoodleAlpha(d, 5000 + IDLE_ACTS.doodleMs - 1000)).toBeLessThan(1);
    expect(actDoodleAlpha(d, 5000 + IDLE_ACTS.doodleMs)).toBe(0);
  });
});
