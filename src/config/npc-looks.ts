import type { SceneStage, StageCast } from './story';

/**
 * H12: one silhouette prop per named Keeper, so the cast reads apart at a distance (the
 * Scarlet/Violet rule). Both renderers read this table: the pixel Keeper sheet draws the
 * accessory on its 32 px grid (render/sprites/keeper.ts), the 3D Keeper rig gets prims
 * (render3d/npc-accessories.ts). Corvin's grey coat differs in shape (a long flare), not
 * only in grey. Colours are hex, for the 3D prims; the pixel drawer maps them to palette
 * indices in keeper.ts.
 */
export type NpcAccessory = 'coat' | 'bucket' | 'satchel' | 'shawl';

export interface NpcLook {
  accessory: NpcAccessory;
  /** Body scale; below 1 for Hazel in chapter 11 (smaller, and older). */
  scale?: number;
  /** Main and trim colour of the accessory (3D). */
  main: string;
  trim: string;
}

export const NPC_LOOKS: Readonly<Record<string, NpcLook>> = {
  corvin: { accessory: 'coat', main: '#6a707a', trim: '#454a54' },
  marina: { accessory: 'bucket', main: '#9a6a3c', trim: '#5a3c22' },
  fern: { accessory: 'satchel', main: '#b98a52', trim: '#6e4a2a' },
  hazel: { accessory: 'shawl', scale: 0.88, main: '#9a6aa6', trim: '#d9b8dc' },
};

/** A trainer's accessory look, or undefined. */
export const npcLookOf = (trainer: string): NpcLook | undefined => NPC_LOOKS[trainer];

/** The stage's cast entries who carry a lantern. */
export function lanternCarriers(stage: SceneStage | null | undefined): StageCast[] {
  return (stage?.cast ?? []).filter((c) => c.carry === 'lantern');
}

/** Whether the stage seats the Nubbin `nubbinId` (M6): only Moss, on a `pose: 'sit'` entry. */
export function nubbinSits(
  stage: SceneStage | null | undefined,
  mossId: string | null | undefined,
  nubbinId: string,
): boolean {
  if (!mossId || nubbinId !== mossId) return false;
  return (stage?.cast ?? []).some((c) => c.who === 'moss' && c.pose === 'sit');
}
