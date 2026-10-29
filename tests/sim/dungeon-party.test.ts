import { describe, expect, it } from 'vitest';
import { DUNGEON } from '../../src/config/tuning';
import { partyChoices, recommendedParty } from '../../src/sim/dungeon-party';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import type { World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// Lane B round 4: the cave-mouth party picker (R0168).

function world4(): World {
  const world = createWorld(5, 0);
  const rng = Rng.fromSeed(9);
  while (world.nubbins.length < 4)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

describe('the party picker (R0168)', () => {
  it('the picked party is the one that enters, and it is remembered', () => {
    const world = world4();
    const ids = world.nubbins.map((n) => n.id);
    const pick = [ids[3]!, ids[2]!];
    applyCommand(world, { kind: 'setHollowParty', ids: pick }, []);
    applyCommand(world, { kind: 'enterTown', act: 0 }, []);
    expect(world.dungeon!.party).toEqual(pick);
    applyCommand(world, { kind: 'leaveDungeon' }, []);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.hollow.lastParty).toEqual(pick);
  });

  it('keeps to the party size and to hatched Nubbins it knows', () => {
    const world = world4();
    const ids = world.nubbins.map((n) => n.id);
    applyCommand(world, { kind: 'setHollowParty', ids: [...ids, 'nobody'] }, []);
    expect(world.hollow.lastParty).toHaveLength(DUNGEON.partySize);
    expect(world.hollow.lastParty).not.toContain('nobody');
  });

  it('marks tired Nubbins and leaves them out of the recommendation', () => {
    const world = world4();
    const tired = world.nubbins[0]!;
    tired.needs.energy = 0.1;
    expect(partyChoices(world).find((c) => c.id === tired.id)!.tired).toBe(true);
    expect(recommendedParty(world)).not.toContain(tired.id);
    expect(recommendedParty(world)).toHaveLength(DUNGEON.partySize);
  });
});
