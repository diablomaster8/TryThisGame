import type { KeeperAlignment } from '../sim/types';
import { TRAINERS, type TrainerLook } from '../sim/trainers';
import { EXTRA_LOOKS } from '../sim/npcs';
import { C } from './sprites/palette';
import { STORY_NPC_LOOKS, STORY_ONLY_LOOKS } from '../config/npc-looks';

/**
 * The one Keeper look rule, shared by both renderers: the chosen Keeper's outfit (the
 * trainer's palette and hat), with the trim tinted by the active side. Sun warms the hat
 * band and the shirt's shade to gold and orange; Moon turns them violet and plum. Skin,
 * hair, the shirt itself, trousers and boots stay the trainer's own, so the outfit still
 * reads as the chosen Keeper's.
 */
export function trainerLook(trainerId: string): TrainerLook {
  return (
    EXTRA_LOOKS[trainerId] ??
    STORY_NPC_LOOKS[trainerId]?.trainer ??
    STORY_ONLY_LOOKS[trainerId]?.trainer ??
    TRAINERS.find((t) => t.id === trainerId)?.look ??
    TRAINERS[0]!.look
  );
}

export function keeperOutfit(trainerId: string, side: KeeperAlignment): TrainerLook {
  const base = trainerLook(trainerId);
  return side === 'moon'
    ? { ...base, hatBand: C.violet, shirtShade: C.darkPlum }
    : { ...base, hatBand: C.orange, shirtShade: C.sunYellow };
}

/**
 * The 3D look key for a Keeper (see `render3d/looks.ts`): the Sun or Moon figure, dressed
 * in the trainer's outfit by `keeperOutfit`. The pixel view keys its sheet the same way.
 */
export function keeperLookKey(trainerId: string, side: KeeperAlignment): string {
  return `keeper-${side}~npc:${trainerId}`;
}
