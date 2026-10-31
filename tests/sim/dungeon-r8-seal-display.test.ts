import { describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { WALL, type Floor } from '../../src/sim/dungeon';
import { actBossDepth, actFloor } from '../../src/sim/dungeon-acts';
import {
  lootHeld,
  plugUp,
  sealDisplay,
  sealPlugs,
  withSeals,
  type Seal,
} from '../../src/sim/dungeon-secrets';
import type { DungeonRun } from '../../src/sim/types';

/**
 * Lane B r8: the renderers draw one floor for every seal state (`sealDisplay`), with plugs
 * for what a seal shuts, so finding a secret or sealing the boss door never rebuilds a cave.
 * These check that the drawn floor plus standing plugs is exactly the sim's floor.
 */
function fakeRun(seals: string[] = []): DungeonRun {
  return { seals } as unknown as DungeonRun;
}

function sealedFloors(): Array<{ f: Floor; s: Seal }> {
  const out: Array<{ f: Floor; s: Seal }> = [];
  for (let seed = 1; seed <= 10; seed++)
    for (let act = 0; act < ACTS.length; act++)
      for (const depth of [actStartDepth(act), actStartDepth(act) + 1, actBossDepth(act)]) {
        const f = actFloor(seed * 7, act, depth, 4);
        for (const s of f.seals ?? []) out.push({ f, s });
      }
  return out;
}

/** The cells the renderer shows as rock: the drawn floor's rock plus every standing plug. */
function drawnRock(shown: Floor, run: DungeonRun): boolean[] {
  const rock = Array.from(shown.cells, (c) => c === WALL);
  for (const p of sealPlugs(shown))
    if (plugUp(run, p)) for (const c of p.cells) rock[c.y * shown.cols + c.x] = true;
  return rock;
}

describe('one drawn floor for every seal state (lane B r8)', () => {
  let made: Array<{ f: Floor; s: Seal }> | null = null;
  const floors = () => (made ??= sealedFloors());

  it('finds secrets, puzzles and boss doors to check', { timeout: 30_000 }, () => {
    const kinds = new Set(floors().map((x) => x.s.kind));
    expect(kinds.has('secret')).toBe(true);
    expect(kinds.has('boss')).toBe(true);
  });

  it('gives the same drawn floor before and after a seal flips', () => {
    for (const { f, s } of floors()) {
      const flipped = withSeals(fakeRun([s.id]), f);
      expect(sealDisplay(flipped)).toBe(sealDisplay(f));
    }
  });

  it('draws rock exactly where the sim has rock, shut or open', () => {
    for (const { f, s } of floors())
      for (const seals of [[], [s.id]]) {
        const run = fakeRun(seals);
        const sim = withSeals(run, f);
        const drawn = drawnRock(sealDisplay(f), run);
        let wrong = 0;
        sim.cells.forEach((c, i) => (wrong += (c === WALL) !== drawn[i] ? 1 : 0));
        expect(wrong).toBe(0);
      }
  }, 30_000);

  it("hides a shut seal's finds and shows them once it opens", () => {
    for (const { f, s } of floors()) {
      if (s.kind === 'boss') continue;
      const shown = sealDisplay(f);
      for (const l of [...(s.hidden ?? []), ...s.loot]) {
        expect(lootHeld(fakeRun(), shown, l.id)).toBe(true);
        expect(lootHeld(fakeRun([s.id]), shown, l.id)).toBe(false);
      }
      for (const l of f.loot) expect(lootHeld(fakeRun(), shown, l.id)).toBe(false);
    }
  });
});
