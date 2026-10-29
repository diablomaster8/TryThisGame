import { describe, expect, it } from 'vitest';
import { BARKS } from '../../src/content/barks';
import { barkPool } from '../../src/sim/barks';
import { ensureTrainers } from '../../src/sim/scene-cast';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld } from './campaign-driver';

// R0295 (FUN-06): tapping a Keeper outside a scene gets a line of their own.

describe('Keeper barks', () => {
  it('tapping Fern ten times in chapter 2 gives six or more lines, never twice running', () => {
    const { world } = campaignWorld('marina');
    c(world).chapter = 2;
    ensureTrainers(world);
    const fern = world.npcs.find((n) => n.trainer === 'fern');
    expect(fern).toBeDefined();
    const said: string[] = [];
    for (let i = 0; i < 10; i++) {
      world.keeper.pos = { ...fern!.pos };
      const ev: SimEvent[] = [];
      applyCommand(world, { kind: 'talk', npcId: fern!.id }, ev);
      const t = ev.find((e) => e.kind === 'talked');
      expect(t && t.kind === 'talked' && t.bark).toBeTruthy();
      if (t?.kind === 'talked' && t.bark) said.push(t.bark);
    }
    expect(new Set(said).size).toBeGreaterThanOrEqual(6);
    for (let i = 1; i < said.length; i++) expect(said[i]).not.toBe(said[i - 1]);
  });

  it('every Keeper has at least twelve everyday lines, and quiet ones for the Long Night', () => {
    const { world } = campaignWorld('fern');
    for (const t of Object.keys(BARKS)) {
      expect(barkPool(world, t, 3).length, t).toBeGreaterThanOrEqual(12);
      const quiet = barkPool(world, t, 10);
      expect(quiet.length, t).toBeGreaterThanOrEqual(3);
      // No everyday jokes in the Long Night.
      for (const l of barkPool(world, t, 3)) expect(quiet).not.toContain(l);
    }
  });

  it('keeps lines phone-short', () => {
    for (const sets of Object.values(BARKS))
      for (const s of sets) for (const l of s.lines) expect(l.length).toBeLessThanOrEqual(100);
  });
});
