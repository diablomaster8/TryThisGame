import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { ROUTINES } from '../../src/content/routines';
import { ensureTrainers } from '../../src/sim/scene-cast';
import { currentStation } from '../../src/sim/npc-routines';
import type { SimEvent } from '../../src/sim/types';
import { stepWorld } from '../../src/sim/world';
import { c, campaignWorld } from './campaign-driver';

// R0296 (FUN-07): each Keeper's routine, and a 5-minute soak at ×1.

describe('Keeper routines', () => {
  it('every Keeper has stations with lines, and a station for day and night', () => {
    for (const [who, list] of Object.entries(ROUTINES)) {
      expect(list.length, who).toBeGreaterThanOrEqual(3);
      for (const s of list) {
        expect(s.lines.length, `${who}:${s.id}`).toBeGreaterThanOrEqual(2);
        for (const l of s.lines) expect(l.length).toBeLessThanOrEqual(100);
      }
      expect(currentStation(who, 0), who).not.toBeNull();
      expect(currentStation(who, 110_000), who).not.toBeNull();
    }
  });

  it('in a 5-minute soak every Keeper present visits at least two stations', () => {
    const { world } = campaignWorld('fern');
    c(world).chapter = 8;
    ensureTrainers(world);
    expect(world.npcs.length).toBeGreaterThan(3);
    world.keeper.pos = { x: 30, z: -30 };
    const visits = new Map<string, Set<string>>();
    const steps = (300 * 1000) / SIM.stepMs;
    for (let i = 0; i < steps; i++) {
      c(world).queue = [];
      for (const n of world.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      const ev: SimEvent[] = stepWorld(world, SIM.stepMs);
      for (const e of ev)
        if (e.kind === 'npcBark' && e.station) {
          const set = visits.get(e.npcId) ?? new Set();
          set.add(e.station);
          visits.set(e.npcId, set);
        }
    }
    for (const npc of world.npcs) {
      if (!ROUTINES[npc.trainer]) continue;
      expect(visits.get(npc.id)?.size ?? 0, npc.trainer).toBeGreaterThanOrEqual(2);
    }
  }, 30_000);
});

describe('Keeper chatter', () => {
  it('a 10-minute soak has five or more exchanges, and no pair repeats a line', async () => {
    const { CHATTER } = await import('../../src/content/chatter');
    const { world } = campaignWorld('fern');
    c(world).chapter = 7;
    ensureTrainers(world);
    world.keeper.pos = { x: 30, z: -30 };
    const said: Array<{ npc: string; text: string }> = [];
    const steps = (600 * 1000) / SIM.stepMs;
    for (let i = 0; i < steps; i++) {
      c(world).queue = [];
      for (const n of world.nubbins) {
        n.needs.hunger = 1;
        n.needs.energy = 1;
      }
      for (const e of stepWorld(world, SIM.stepMs))
        if (e.kind === 'npcBark' && !e.station) said.push({ npc: e.npcId, text: e.text });
    }
    // Each exchange is two lines.
    expect(said.length / 2).toBeGreaterThanOrEqual(5);
    const texts = said.map((s) => s.text);
    expect(new Set(texts).size).toBe(texts.length);
    for (const [key, list] of Object.entries(CHATTER)) {
      expect(key.split('|').sort().join('|')).toBe(key);
      expect(list.length, key).toBeGreaterThanOrEqual(4);
    }
  }, 60_000);
});
