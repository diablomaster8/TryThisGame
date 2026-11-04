import { describe, expect, it } from 'vitest';
import { dungeonTapTarget, nearestPack } from '../../src/input/dungeon-tap';
import { HoldWalk } from '../../src/input/hold-walk';
import { DUNGEON_TAP } from '../../src/config/tuning-dungeon-tap';
import { hapticFor } from '../../src/platform/haptics';
import { cellCentre, runFloor } from '../../src/sim/dungeon';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';

// Lane B round 11 (R0192, DUNG-49): phone taps snap to packs, shrines, stones and loot.

function deepWorld(seed = 8): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  applyCommand(w, { kind: 'enterDungeon', daily: false }, events);
  w.dungeon!.graceUntilMs = 0;
  return w;
}

describe('dungeon tap targets', () => {
  it('taps near each of 10 packs snap to that pack, with no misses', () => {
    let hits = 0;
    let seen = 0;
    for (let seed = 1; seen < 10 && seed < 60; seed++) {
      const w = deepWorld(seed);
      const f = runFloor(w);
      for (const p of w.dungeon?.packs ?? []) {
        if (seen >= 10) break;
        seen++;
        // A thumb 1.0 u off the pack still finds it, unless a nearer thing is there.
        const t = dungeonTapTarget(w, { x: p.pos.x + 0.7, z: p.pos.z + 0.7 });
        if (t?.kind === 'pack' && t.id === p.id) hits++;
        expect(f).not.toBeNull();
      }
    }
    expect(seen).toBe(10);
    expect(hits).toBe(10);
  });

  it('ignores taps beyond the radius and beaten packs', () => {
    const w = deepWorld();
    const p = w.dungeon!.packs![0]!;
    const far = { x: p.pos.x + DUNGEON_TAP.radius + 0.5, z: p.pos.z };
    expect(dungeonTapTarget(w, far)?.id).not.toBe(p.id);
    p.state = 'beaten';
    expect(dungeonTapTarget(w, p.pos)?.id).not.toBe(p.id);
  });

  it('snaps to loot and prefers a pack over loot at the same spot', () => {
    const w = deepWorld();
    const f = runFloor(w)!;
    const loot = f.loot[0]!;
    const at = cellCentre(f, loot.cell);
    const t = dungeonTapTarget(w, at);
    expect(t?.pos).toEqual(at.x === t?.pos.x ? at : t?.pos);
    const pk = w.dungeon!.packs![0]!;
    pk.pos = { x: at.x + 0.3, z: at.z };
    expect(dungeonTapTarget(w, at)?.kind).toBe('pack');
  });

  it('a tap on a pack walks the Keeper to it and the encounter starts on contact', () => {
    const w = deepWorld();
    const f = runFloor(w)!;
    const p = w.dungeon!.packs![0]!;
    const home = cellCentre(f, f.packs!.find((x) => x.id === p.id)!.cell);
    p.pos = { ...home };
    w.keeper.pos = { x: home.x + 2, z: home.z };
    const t = dungeonTapTarget(w, { x: home.x + 0.5, z: home.z })!;
    expect(t.kind).toBe('pack');
    applyCommand(w, { kind: 'moveKeeperTo', pos: t.pos }, []);
    const seen: SimEvent[] = [];
    for (let i = 0; i < 100 && !w.dungeon!.encounter; i++) seen.push(...stepWorld(w, 100));
    expect(w.dungeon!.encounter?.packId).toBe(p.id);
    expect(seen.some((e) => e.kind === 'encounterStarted')).toBe(true);
  });

  it('is null above ground', () => {
    const w = createWorld(3, 0);
    expect(dungeonTapTarget(w, { x: 0, z: 0 })).toBeNull();
  });

  it('nearestPack picks the closest in range and none during a fight', () => {
    const w = deepWorld();
    const p = w.dungeon!.packs![0]!;
    w.keeper.pos = { x: p.pos.x + 1, z: p.pos.z };
    expect(nearestPack(w, 3)).not.toBeNull();
    w.dungeon!.encounter = { packId: p.id };
    expect(nearestPack(w, 3)).toBeNull();
  });
});

describe('held finger and haptics', () => {
  it('re-plans no faster than every 250 ms underground', () => {
    const h = new HoldWalk();
    h.start({ x: 0, z: 0 }, 0);
    expect(h.follow({ x: 0.01, z: 0 }, 100, DUNGEON_TAP.replanMs)).toBeNull();
    expect(h.follow({ x: 0.01, z: 0 }, 260, DUNGEON_TAP.replanMs)).not.toBeNull();
  });

  it('an encounter start has a haptic', () => {
    expect(hapticFor({ kind: 'encounterStarted', packId: 'x' })).toBe('encounter');
  });
});
