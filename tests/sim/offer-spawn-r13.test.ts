/** Lane C round 13c (R0608): the hooded giver comes from a spot the default camera can see. */
import { describe, expect, it } from 'vitest';
import { C12C } from '../../src/config/tuning-more/story-quest-markers';
import { REGIONS } from '../../src/config/regions';
import { heightAt } from '../../src/sim/height';
import { offerSpawnAngle } from '../../src/sim/scene-cast';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld, playScenes, tick } from './campaign-driver';

describe('the offer giver spawn side (R0608)', () => {
  it('never starts uphill of the Keeper or inside something solid, at any area', () => {
    const { world, events } = campaignWorld();
    world.settings.questFlow = 'open';
    applyCommand(world, { kind: 'debugChapter', chapter: 5 }, events);
    playScenes(world, events);
    const reach = C12C.approach.spawnAt;
    for (const p of REGIONS.grove.pois) {
      world.keeper.pos = { x: p.x, z: p.z };
      const a = offerSpawnAngle(world, reach, C12C.approach.viewAngle);
      const x = world.keeper.pos.x + Math.sin(a) * reach;
      const z = world.keeper.pos.z + Math.cos(a) * reach;
      const rise = heightAt(world.location, x, z) - heightAt(world.location, p.x, p.z);
      // Where every compass point is blocked the preferred side is used; otherwise it is clear.
      const open = Array.from({ length: 8 }, (_, i) => {
        const b = C12C.approach.viewAngle + (i * Math.PI) / 4;
        return (
          heightAt(world.location, p.x + Math.sin(b) * reach, p.z + Math.cos(b) * reach) -
            heightAt(world.location, p.x, p.z) <=
          0.6
        );
      }).some(Boolean);
      if (open) expect(rise, p.id).toBeLessThanOrEqual(0.6);
    }
  });

  it('at the falls the hooded giver comes in on the camera side and walks up', () => {
    const { world, events } = campaignWorld();
    world.settings.questFlow = 'open';
    applyCommand(world, { kind: 'debugChapter', chapter: 4 }, events);
    playScenes(world, events);
    world.keeper.pos = { x: 0, z: -40 };
    tick(world, events, 400);
    playScenes(world, events);
    world.keeper.pos = { x: 11.8, z: -8.7 };
    world.keeper.moveTarget = null;
    tick(world, events, 2);
    const book = world.questBook!;
    expect(book.offer?.quest).toBe('q01');
    const npc = world.npcs.find((n) => n.id === 'offer-tall-hood')!;
    expect(npc).toBeDefined();
    // Not on the far (north-west) side of the Keeper, where the default camera is blind.
    const toward = Math.cos(
      Math.atan2(npc.pos.x - 11.8, npc.pos.z + 8.7) - C12C.approach.viewAngle,
    );
    expect(toward).toBeGreaterThan(-0.5);
  });
});
