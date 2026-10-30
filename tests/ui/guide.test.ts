import { describe, expect, it } from 'vitest';
import { guideTarget } from '../../src/ui/guide';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Command, SimEvent, World } from '../../src/sim/types';

/**
 * R0676 (KIDS-05): a script that only does what the hand points at. A tap on a world thing
 * walks there and opens its sheet; a tap on a sheet button sends what that button sends.
 */
function follow(world: World, seconds: number): { hatched: boolean; petted: boolean } {
  const events: SimEvent[] = [];
  const send = (c: Command) => applyCommand(world, c, events);
  let sheet: string | null = null;
  let petted = false;
  for (let step = 0; step < seconds * 10; step++) {
    const t = guideTarget(world, sheet);
    if (t && step % 3 === 0) {
      if (t.pos) {
        world.keeper.pos = { ...t.pos };
        sheet = t.id;
        send({ kind: 'select', id: t.id });
      } else if (t.kind === 'pickup') send({ kind: 'pickUp', nubbinId: t.id });
      else if (t.kind === 'putdown') send({ kind: 'putDown' });
      else if (t.kind === 'shake') send({ kind: 'shakeHeld' });
      else if (t.kind === 'pet') {
        send({ kind: 'pet', nubbinId: t.id });
        petted = true;
      }
    }
    events.push(...stepWorld(world, 100));
    if (petted) break;
  }
  return { hatched: world.nubbins.some((n) => n.stage === 'child'), petted };
}

describe('the Show me guide (R0676)', () => {
  it('points at an egg first in a fresh Learning Grove', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'eduStart', age: 4 }, []);
    const t = guideTarget(world, null);
    expect(t?.kind).toBe('egg');
    expect(world.nubbins.find((n) => n.id === t?.id)?.stage).toBe('egg');
    // With that egg's sheet open: Pick up, then Shake once it is held.
    expect(guideTarget(world, t!.id)?.kind).toBe('pickup');
  });

  it('hatches and pets a Nubbin within 90 s by following only the hand', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'eduStart', age: 4 }, []);
    const r = follow(world, 90);
    expect(r.hatched).toBe(true);
    expect(r.petted).toBe(true);
    // Let the pet land, then the hand has nothing more to show.
    for (let i = 0; i < 50; i++) stepWorld(world, 100);
    expect(guideTarget(world, null)).toBeNull();
  });

  it('points at a tree, then the Nubbin, for the feeding chapter', () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'eduStart', age: 4 }, []);
    applyCommand(world, { kind: 'campaignStart' }, []);
    const c = world.campaign!;
    c.chapter = 2;
    const n = world.nubbins[0]!;
    n.stage = 'child';
    world.items = world.items.filter((i) => i.kind !== 'fruit');
    world.inventory.fruit = 0;
    expect(guideTarget(world, null)?.kind).toBe('tree');
    world.inventory.fruit = 2;
    const t = guideTarget(world, null);
    expect(t?.kind).toBe('nubbin');
    expect(guideTarget(world, t!.id)?.kind).toBe('feed');
  });
});
