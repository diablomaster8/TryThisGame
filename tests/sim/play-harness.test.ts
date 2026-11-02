import { describe, expect, it } from 'vitest';
import { EGG } from '../../src/config/tuning';
import { Player } from '../harness/play';
import { deserialize, serialize, validateWorld, worldFingerprint } from '../../src/sim/save';

/**
 * TECH-11: the standing smoke run on the headless harness. These are the regressions the
 * play reviews keep finding by hand: the first loop stalling, a reload that is not exact,
 * and a long session that throws.
 */

/** FNV-1a, so a mismatch prints a short number instead of the whole world. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

describe('headless play harness', () => {
  it('first loop: hatch, pet and feed a Nubbin inside 60 s of play (shaking speeds the egg)', () => {
    const p = new Player();
    const egg = p.world.nubbins[0]!;
    p.do({ kind: 'grab', nubbinId: egg.id });
    // A held egg shaken on its cooldown hatches well inside the minute.
    const shakes = Math.ceil(EGG.hatchMs / EGG.shakeBonusMs);
    for (let i = 0; i < shakes + 2 && egg.stage === 'egg'; i++) {
      p.play(EGG.shakeCooldownMs + 100);
      p.do({ kind: 'shakeHeld' });
    }
    p.do({ kind: 'putDown' });
    expect(p.until(() => egg.stage === 'child', 5_000)).toBe(true);
    p.do({ kind: 'pet', nubbinId: egg.id });
    expect(p.until(() => p.saw('petted'), 20_000)).toBe(true);
    p.do({ kind: 'debugGive', what: 'fruit', amount: 1 });
    p.do({ kind: 'feed', nubbinId: egg.id });
    expect(p.until(() => p.saw('ate'), 20_000)).toBe(true);
    expect(p.playedMs).toBeLessThan(60_000);
  });

  it('a reload restores the world exactly, and play continues identically from it', () => {
    const a = new Player();
    a.play(EGG.hatchMs + 5_000);
    const json = serialize(a.world, 1_000);
    const loaded = validateWorld(deserialize(json).world);
    // A visitor walking about is sent home on load (save.ts), so compare without visitors.
    const bare = (w: typeof a.world) => hash(worldFingerprint({ ...w, npcs: [] } as typeof a.world));
    expect(bare(loaded)).toBe(bare(a.world));
    // Loading is a fixed point: a second save and load changes nothing.
    const again = validateWorld(deserialize(serialize(loaded, 1_000)).world);
    expect(hash(worldFingerprint(again))).toBe(hash(worldFingerprint(loaded)));
    // And two copies of the same save play out identically.
    const x = new Player(loaded);
    const y = new Player(again);
    x.play(30_000);
    y.play(30_000);
    expect(hash(worldFingerprint(y.world))).toBe(hash(worldFingerprint(x.world)));
  });

  it('a long scripted session at speed throws nothing and keeps the save valid', () => {
    const p = new Player();
    p.play(EGG.hatchMs + 5_000);
    for (let i = 0; i < 20; i++) {
      p.do({ kind: 'select', id: p.world.nubbins[0]?.id ?? null });
      p.do({ kind: 'debugGive', what: 'fruit', amount: 2 });
      p.do({ kind: 'feed', nubbinId: p.world.nubbins[0]!.id });
      p.play(60_000);
    }
    expect(() => deserialize(serialize(p.world, 1))).not.toThrow();
  });
});
