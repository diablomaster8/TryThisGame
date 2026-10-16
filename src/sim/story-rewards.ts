import type { Quest, Reward } from '../content/types';
import { HAT_IDS } from './shop';
import type { CampaignState, SimEvent, World } from './types';

/**
 * What a finished side story or fun quest leaves behind. Rewards the game has a slot for
 * go there: a hat the wardrobe knows lands in the inventory, a flag is set. Everything else
 * (items such as the old trowel, cosmetics with no slot yet, memories, titles and feature
 * unlocks) is kept by id in `inventory.keepsakes`, which the journal lists under Memories
 * and which later systems read as their unlock. Each reward is granted once.
 */

const HATS: readonly string[] = HAT_IDS;

export function hasKeepsake(world: World, id: string): boolean {
  return world.inventory.keepsakes.includes(id);
}

function keep(world: World, quest: Quest, reward: Reward, events: SimEvent[]): void {
  if (hasKeepsake(world, reward.id)) return;
  world.inventory.keepsakes.push(reward.id);
  events.push({ kind: 'keepsake', id: reward.id, quest: quest.id });
}

/** Grant every reward of `quest` that has not been granted yet. */
export function grantRewards(
  world: World,
  c: CampaignState,
  quest: Quest,
  events: SimEvent[],
): void {
  for (const reward of quest.rewards) {
    switch (reward.kind) {
      case 'flag':
        c.flags[reward.id] = true;
        keep(world, quest, reward, events);
        break;
      case 'cosmetic':
        if (HATS.includes(reward.id) && !world.inventory.hats.includes(reward.id))
          world.inventory.hats.push(reward.id);
        keep(world, quest, reward, events);
        break;
      default:
        keep(world, quest, reward, events);
        break;
    }
  }
}

/** Titles the stories gave, for the Keeper's profile beside the achievement titles. */
export function storyTitles(
  world: World,
  rewardOf: (id: string) => { reward: Reward } | undefined,
): string[] {
  return world.inventory.keepsakes
    .map((id) => rewardOf(id)?.reward)
    .filter((r): r is Reward => r !== undefined && r.kind === 'title')
    .map((r) => r.label);
}
