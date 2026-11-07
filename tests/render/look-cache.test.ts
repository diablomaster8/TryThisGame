import { afterEach, describe, expect, it, vi } from 'vitest';
import { EGG, SIM } from '../../src/config/tuning';
import type { Nubbin, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { nubbinLook } from '../../src/render3d/creature-pool';
import { LookCache } from '../../src/render3d/look-cache';

/**
 * hot/perf-leaks round 5: the 3D actors keep each Nubbin's look between changes of the world.
 * The game invalidates the cache before every step or command (the scene's `snapshot`), and
 * the cache itself notices a new world, a moved clock and a new rainbow step. These drive the
 * world through look-changing events the way a frame does and check the kept key against a
 * fresh `nubbinLook` every time.
 */
function hatched(): { w: World; n: Nubbin } {
  const w = createWorld(7, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 2; i++) stepWorld(w, SIM.stepMs);
  return { w, n: w.nubbins[0]! };
}

/** One frame of the game's order: snapshot (invalidate), then the change, then the draw. */
function frame(cache: LookCache, w: World, change?: () => void): void {
  if (change) {
    cache.invalidate();
    change();
  }
  cache.frame(w);
}

function same(cache: LookCache, w: World): void {
  for (const n of w.nubbins)
    if (n.stage !== 'egg' && n.stage !== 'cocoon')
      expect(cache.look(n).key).toBe(nubbinLook(n).key);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('LookCache (round 5)', () => {
  it('keeps the look between changes and matches a fresh one after every change', () => {
    const { w, n } = hatched();
    const cache = new LookCache();
    frame(cache, w);
    same(cache, w);
    const changes: Array<() => void> = [
      () => applyCommand(w, { kind: 'wearHat', nubbinId: n.id, hat: 'look-sonic' }, []),
      () => applyCommand(w, { kind: 'wearGlasses', nubbinId: n.id, on: true }, []),
      () => (n.alignment = 0.7),
      () => (n.alignment = -0.4),
      () => (n.shiny = !n.shiny),
      () => (n.tone = 'gold'),
      () => (n.eggColor = 'sky'),
      () => applyCommand(w, { kind: 'debugSeason', season: 'winter' }, []),
      () => applyCommand(w, { kind: 'debugForceEvolve', nubbinId: n.id }, []),
      () => (n.wingDye = 'rose'),
      () => (n.crownDye = 'violet'),
      () => applyCommand(w, { kind: 'wearHat', nubbinId: n.id, hat: null }, []),
      () => stepWorld(w, SIM.stepMs),
    ];
    for (const change of changes) {
      frame(cache, w, change);
      same(cache, w);
    }
  });

  it('works a look out once while nothing changes', () => {
    const { w } = hatched();
    const cache = new LookCache();
    frame(cache, w);
    same(cache, w);
    const before = cache.computed;
    for (let i = 0; i < 60; i++) {
      frame(cache, w);
      for (const n of w.nubbins) cache.look(n);
    }
    expect(cache.computed).toBe(before);
  });

  it('notices a sim step without being told, a new world and the rainbow moving on', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    const { w, n } = hatched();
    const cache = new LookCache();
    frame(cache, w);
    cache.look(n);
    // A step advances the clock: worked out again (catch-up steps the world without a snapshot).
    let c = cache.computed;
    stepWorld(w, SIM.stepMs);
    frame(cache, w);
    cache.look(n);
    expect(cache.computed).toBe(c + 1);
    // An adult with a rainbow wing tip: its key carries the ring step, which moves with time.
    applyCommand(w, { kind: 'debugForceEvolve', nubbinId: n.id }, []);
    n.wingDye = 'rainbow';
    frame(cache, w, () => {});
    same(cache, w);
    for (let ms = 0; ms < 3000; ms += 137) {
      vi.setSystemTime(1_000_000 + ms);
      frame(cache, w);
      same(cache, w);
    }
    // A replaced world (an import or a reset) is a new world.
    c = cache.computed;
    const w2 = structuredClone(w);
    frame(cache, w2);
    same(cache, w2);
    expect(cache.computed).toBeGreaterThan(c);
  });
});
