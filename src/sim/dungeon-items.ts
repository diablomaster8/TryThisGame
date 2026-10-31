/**
 * Lane B round 8's item commands in one place, so `world.ts` carries a single case block:
 * stash tabs (R0174), charms in and out of sockets (R0173) and the wheelbarrow's mix (R0177).
 */
import { socketCharm, unsocketCharms } from './dungeon-charms';
import { stashMove, stashPut } from './dungeon-stash';
import { enterSecret } from './dungeon-secret-levels';
import { mixWheelbarrow } from './dungeon-wheelbarrow';
import { withRng } from './world';
import type { Command, SimEvent, World } from './types';

type ItemsCommand = Extract<
  Command,
  {
    kind:
      | 'stashPut'
      | 'stashMove'
      | 'socketCharm'
      | 'unsocketCharms'
      | 'wheelbarrowMix'
      | 'enterHollowSecret';
  }
>;

export function itemsCommand(world: World, cmd: ItemsCommand, events: SimEvent[]): void {
  switch (cmd.kind) {
    case 'stashPut':
      stashPut(world, cmd.itemId);
      return;
    case 'stashMove':
      stashMove(world, cmd.itemId, cmd.tab);
      return;
    case 'socketCharm':
      socketCharm(world, cmd.itemId, cmd.charm, events);
      return;
    case 'unsocketCharms':
      unsocketCharms(world, cmd.itemId);
      return;
    case 'wheelbarrowMix':
      withRng(world, (rng) => mixWheelbarrow(world, cmd.slots, rng, events));
      return;
    // Lane B r9: through a secret level's portal (R0189, R0183).
    case 'enterHollowSecret':
      enterSecret(world, cmd.where, events);
      return;
  }
}
