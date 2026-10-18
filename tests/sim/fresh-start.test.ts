import { describe, expect, it } from 'vitest';
import { modeOfWorld } from '../../src/platform/storage';
import { freshWorldLike } from '../../src/sim/fresh-start';
import type { Command, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { storylineWorld } from './storyline-driver';

/**
 * Reset save starts the slot's own mode again (review C, item 3): before, Settings and
 * the debug panel both called createWorld(), so every slot came back as a Free Grove.
 */

function started(cmds: Command[]): World {
  const world = createWorld(5, 0);
  const events: SimEvent[] = [];
  for (const cmd of cmds) applyCommand(world, cmd, events);
  // Played a while, so the reset has something to throw away.
  world.inventory.shells = 999;
  return world;
}

const NOW = 1_800_000_000_000;

describe('Reset save keeps the slot’s mode', () => {
  it('a Free Grove stays a Free Grove', () => {
    const fresh = freshWorldLike(started([]), NOW);
    expect(modeOfWorld(fresh)).toBe('free');
    expect(fresh.inventory.shells).not.toBe(999);
  });

  it('Hazel’s Grove starts again at chapter 1 with the same Keeper', () => {
    const old = started([{ kind: 'setTrainer', id: 'luna' }, { kind: 'campaignStart' }]);
    expect(modeOfWorld(old)).toBe('campaign');
    const fresh = freshWorldLike(old, NOW);
    expect(modeOfWorld(fresh)).toBe('campaign');
    expect(fresh.campaign!.storyline).toBeNull();
    expect(fresh.campaign!.chapter).toBe(1);
    expect(fresh.trainer).toBe('luna');
    expect(fresh.inventory.shells).not.toBe(999);
  });

  it('each separate campaign starts itself again', () => {
    for (const [id, mode] of [
      ['hundred', 'hundred'],
      ['logged', 'logged'],
      ['beetle', 'beetle'],
      ['dawn', 'dawndusk'],
      ['dusk', 'dawndusk'],
    ] as const) {
      const { world: old } = storylineWorld(id, id === 'dusk' ? 'luna' : 'fern');
      const fresh = freshWorldLike(old, NOW);
      expect(modeOfWorld(fresh)).toBe(mode);
      expect(fresh.campaign!.storyline).toBe(id);
      expect(fresh.trainer).toBe(old.trainer);
    }
  });

  it('Dawn & Dusk keeps the "other half done" flag', () => {
    const old = createWorld(9, 0);
    const events: SimEvent[] = [];
    applyCommand(old, { kind: 'setTrainer', id: 'fern' }, events);
    applyCommand(
      old,
      { kind: 'storylineStart', id: 'dawn', flags: { 'dd-other-done': true } },
      events,
    );
    expect(freshWorldLike(old, NOW).campaign!.flags['dd-other-done']).toBe(true);
    const plain = storylineWorld('dawn').world;
    expect(freshWorldLike(plain, NOW).campaign!.flags['dd-other-done']).toBeUndefined();
  });

  it('a Learning Grove keeps its age and band, in both bands', () => {
    for (const [age, band] of [
      [4, 'sprout'],
      [6, 'reader'],
    ] as const) {
      const old = started([{ kind: 'eduStart', age, band }]);
      old.edu!.stickers = 12;
      const fresh = freshWorldLike(old, NOW);
      expect(modeOfWorld(fresh)).toBe('edu');
      expect(fresh.edu!.age).toBe(age);
      expect(fresh.edu!.band).toBe(band);
      expect(fresh.edu!.stickers).toBe(0);
    }
  });
});
