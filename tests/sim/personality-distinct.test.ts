import { describe, expect, it } from 'vitest';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { createWorld, stepWorld } from '../../src/sim/world';
import { QUIRK_IDS, type QuirkId } from '../../src/sim/quirks';
import type { Personality } from '../../src/sim/types';

// R0553 (SOUL-36): the four personalities must spend their day measurably differently.
// Each adult runs 2 × 20 sim minutes, the Keeper beside it half of each minute; the
// distance between two personalities is the total variation of their state shares, a
// personality quirk (sim/quirks.ts) counted apart from the plain state it runs in.
const PS: Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy'];

function shares(p: Personality): Record<string, number> {
  const c: Record<string, number> = {};
  let total = 0;
  for (const seed of [41, 42]) {
    const w = createWorld(seed, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [n];
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = p;
    for (let t = 0; t < 20 * 600; t++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      w.keeper.pos = t % 600 < 300 ? { x: n.pos.x + 1.5, z: n.pos.z } : { x: 0, z: -30 };
      stepWorld(w, 100);
      const q = n.behavior.itemId as QuirkId | null;
      const key = q && QUIRK_IDS.includes(q) ? `${n.behavior.state}:${q}` : n.behavior.state;
      c[key] = (c[key] ?? 0) + 1;
      total++;
    }
  }
  for (const k of Object.keys(c)) c[k]! /= total;
  return c;
}

function tv(a: Record<string, number>, b: Record<string, number>): number {
  let d = 0;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)]))
    d += Math.abs((a[k] ?? 0) - (b[k] ?? 0));
  return d / 2;
}

describe('R0553 personalities are distinct', () => {
  const s = Object.fromEntries(PS.map((p) => [p, shares(p)])) as Record<
    Personality,
    Record<string, number>
  >;

  it('the outgoing and the stay-put personalities differ by at least 0.25', () => {
    for (const a of ['cheerful', 'mischievous'] as const)
      for (const b of ['shy', 'lazy'] as const) expect(tv(s[a], s[b])).toBeGreaterThanOrEqual(0.25);
  });

  // Lane A r10: the quirks tell the close pairs apart (cheerful twirls, mischievous sneaks;
  // shy hides its face or watches, lazy dozes): about 0.34 and 0.57 on 2026-10-30.
  it('every pair differs by at least 0.25', () => {
    expect(tv(s.cheerful, s.mischievous)).toBeGreaterThanOrEqual(0.25);
    expect(tv(s.shy, s.lazy)).toBeGreaterThanOrEqual(0.25);
  });
});
