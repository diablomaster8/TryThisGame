import { describe, expect, it } from 'vitest';
import { SECRETS, WORLD_HINTS } from '../../src/config/tuning-r9d4';
import { WORLD_HINT_TEXT, SECRET_TEXT } from '../../src/config/strings-r9d4';
import { WORLD_TRACES } from '../../src/content/world-traces';
import { clampToWorld, inPond } from '../../src/sim/behavior';
import { blocked } from '../../src/sim/obstacles';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';
import { CLUE_TRACE, secretGlint, stepWorldHints } from '../../src/sim/world-hints';

function walkTo(world: World, x: number, z: number, events: SimEvent[]): void {
  world.keeper.pos = { x, z };
  stepWorldHints(world, events);
}

function fresh(seed: number): World {
  const w = createWorld(seed, 0);
  if (w.campaign) w.campaign.queue = [];
  return w;
}

const hints = (ev: SimEvent[]): string[] =>
  ev.flatMap((e) => (e.kind === 'worldHint' ? [e.id] : []));

describe('world hints (R0127)', () => {
  it('every spot is on open, reachable ground with a short line', () => {
    const world = fresh(1);
    for (const h of WORLD_HINTS.spots) {
      const p = { x: h.x, z: h.z };
      clampToWorld(p);
      expect(p, h.id).toEqual({ x: h.x, z: h.z });
      expect(inPond(p), h.id).toBe(false);
      expect(blocked(p, world, 0.4), h.id).toBe(false);
    }
    for (const t of Object.values(WORLD_HINT_TEXT)) expect(t.length).toBeLessThanOrEqual(100);
    for (const t of SECRET_TEXT.grove) expect(t.length).toBeLessThanOrEqual(100);
  });

  it('shows each hint once, spaced out, and never again after a save round trip', () => {
    let world = fresh(2);
    const ev: SimEvent[] = [];
    const shake = WORLD_HINTS.spots.find((s) => s.id === 'shake')!;
    const wade = WORLD_HINTS.spots.find((s) => s.id === 'wade')!;
    walkTo(world, shake.x, shake.z, ev);
    expect(hints(ev)).toEqual(['shake']);
    // Too soon for the next one: it waits for a later pass.
    walkTo(world, wade.x, wade.z, ev);
    expect(hints(ev)).toEqual(['shake']);
    world.timeMs += WORLD_HINTS.gapMs;
    walkTo(world, 0, 0, ev);
    walkTo(world, wade.x, wade.z, ev);
    expect(hints(ev)).toEqual(['shake', 'wade']);
    world = deserialize(serialize(world, 0)).world;
    world.timeMs += WORLD_HINTS.gapMs * 10;
    for (let i = 0; i < 3; i++) {
      walkTo(world, 0, 0, ev);
      walkTo(world, shake.x, shake.z, ev);
      walkTo(world, wade.x, wade.z, ev);
    }
    expect(hints(ev)).toEqual(['shake', 'wade']);
  });

  it('teaches a glide or a ride only when the Keeper has one', () => {
    const world = fresh(3);
    const ev: SimEvent[] = [];
    const glide = WORLD_HINTS.spots.find((s) => s.id === 'glide')!;
    const ride = WORLD_HINTS.spots.find((s) => s.id === 'ride')!;
    walkTo(world, glide.x, glide.z, ev);
    walkTo(world, ride.x, ride.z, ev);
    expect(hints(ev)).toEqual([]);
  });

  it('shows nothing away from the Grove', () => {
    const world = fresh(4);
    world.location = 'dungeon';
    const ev: SimEvent[] = [];
    for (const h of WORLD_HINTS.spots) walkTo(world, h.x, h.z, ev);
    expect(ev).toEqual([]);
  });
});

describe("the Grove's secret (R0111)", () => {
  const nook = SECRETS.spots.grove!;
  it('has its clue trace within 20 u', () => {
    const t = WORLD_TRACES.find((x) => x.id === CLUE_TRACE)!;
    expect(t.region).toBe('grove');
    expect(Math.hypot(t.at!.x - nook.x, t.at!.z - nook.z)).toBeLessThanOrEqual(20);
    const clue = WORLD_HINTS.spots.find((s) => s.id === 'clue')!;
    expect(clue).toMatchObject(t.at!);
    const p = { x: nook.x, z: nook.z };
    expect(blocked(p, fresh(9), 0.4)).toBe(false);
  });

  it('opens once with the Old Key, never without it', () => {
    const world = fresh(5);
    const ev: SimEvent[] = [];
    const shells = world.inventory.shells;
    walkTo(world, nook.x, nook.z, ev);
    expect(ev.some((e) => e.kind === 'secretFound')).toBe(false);
    expect(hints(ev)).toEqual(['nook']);
    expect(secretGlint(world)).toBeNull();
    (world.collected ??= {})['grove:key:1'] = 1;
    expect(secretGlint(world)).toEqual({ x: nook.x, z: nook.z });
    walkTo(world, 0, 0, ev);
    walkTo(world, nook.x, nook.z, ev);
    walkTo(world, 0, 0, ev);
    walkTo(world, nook.x, nook.z, ev);
    expect(ev.filter((e) => e.kind === 'secretFound')).toHaveLength(1);
    expect(world.inventory.decor.statue).toBe(1);
    expect(world.inventory.shells).toBe(shells + nook.reward.shells);
    expect(secretGlint(world)).toBeNull();
  });
});
