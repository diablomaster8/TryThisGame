/** Lane C r12 (R0651, R0608): the giver walks up before the card; the quest markers. */
import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { C12C } from '../../src/config/tuning-camp12c';
import { questMarkers } from '../../src/render/quest-markers';
import { offerGiver } from '../../src/sim/offer-approach';
import { sideStory } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld, playScenes, tick } from './campaign-driver';

function openAt(n: number): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  world.settings.questFlow = 'open';
  applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  playScenes(world, events);
  world.keeper.pos = { x: 0, z: -40 };
  tick(world, events, 400);
  playScenes(world, events);
  return { world, events };
}

describe('arrival beat (R0651)', () => {
  it('the giver walks to the Keeper, the card waits, then clears', () => {
    const { world, events } = openAt(5);
    // Find an area whose first offer has a person for a giver (a hooded Nubbin has no body).
    let found = false;
    for (const p of REGIONS.grove.pois) {
      world.keeper.pos = { x: 0, z: -40 };
      tick(world, events, 2);
      world.keeper.pos = { x: p.x, z: p.z };
      world.keeper.moveTarget = null;
      tick(world, events, 1);
      if (world.questBook!.approach) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
    const book = world.questBook!;
    const id = book.approach!.quest;
    expect(book.offer?.quest).toBe(id);
    expect(offerGiver(sideStory(id)!)).not.toBeNull();
    const npc = world.npcs.find((n) => n.id === book.approach!.giver)!;
    const start = Math.hypot(npc.pos.x - world.keeper.pos.x, npc.pos.z - world.keeper.pos.z);
    expect(start).toBeGreaterThan(C12C.approach.arriveWithin);
    // The marker is over the giver while they walk.
    expect(questMarkers(world).some((m) => m.kind === 'offer' && m.quest === id)).toBe(true);
    tick(world, events, 12);
    expect(book.approach).toBeUndefined();
    const end = Math.hypot(npc.pos.x - world.keeper.pos.x, npc.pos.z - world.keeper.pos.z);
    expect(end).toBeLessThan(start);
  });

  it('never walks while the Keeper carries a Nubbin', () => {
    const { world, events } = openAt(5);
    world.keeper.carrying = world.nubbins[0]?.id ?? 'x';
    for (const p of REGIONS.grove.pois) {
      world.keeper.pos = { x: 0, z: -40 };
      tick(world, events, 2);
      world.keeper.pos = { x: p.x, z: p.z };
      world.keeper.moveTarget = null;
      tick(world, events, 1);
    }
    expect(world.questBook!.stats?.offered ?? 0).toBeGreaterThan(0);
    expect(world.questBook!.approach).toBeUndefined();
  });
});

describe('quest markers (R0608)', () => {
  it('puts the ! on the board when the giver has no body, at most two markers, read-only', () => {
    const { world, events } = openAt(3);
    const p = REGIONS.grove.pois.find((q) => q.id === 'falls')!;
    world.keeper.pos = { x: p.x, z: p.z };
    world.keeper.moveTarget = null;
    tick(world, events, 1);
    const before = JSON.stringify(world.questBook);
    const list = questMarkers(world);
    expect(list.length).toBeLessThanOrEqual(C12C.markers.max);
    expect(list.some((m) => m.kind === 'offer' && m.lift === C12C.markers.overBoard)).toBe(true);
    expect(JSON.stringify(world.questBook)).toBe(before);
  });
});
