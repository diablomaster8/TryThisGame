import type { HollowLevel } from './tuning-dungeon';

/**
 * The Hollow's five acts (R0145, DUNG-05), D2-shaped: each act's dungeon is a few levels
 * deep with its boss on the last one, and beating the boss opens the next act. Names and
 * blurbs are in `ACT_TEXT` (strings-dungeon.ts). The endless Hollow stays beside them as
 * the Deep Hollow. Towns, outdoor zones and side dungeons (DUNG-07, DUNG-12) come later
 * and hang off this table.
 *
 * Tilesets: only the Rootways has its own pieces so far; the others fall back to it in
 * `piecesFor` until theirs are drawn.
 */
export type ActId = 'rootways' | 'cloister' | 'sandglass' | 'frostbell' | 'gloom';

export interface ActDef {
  id: ActId;
  tileset: string;
  /** One entry per level of the act dungeon, top first; the last holds the boss. */
  levels: readonly HollowLevel[];
  boss: string;
}

export const ACTS: readonly ActDef[] = [
  {
    id: 'rootways',
    tileset: 'rootways',
    levels: ['small', 'standard', 'standard'],
    boss: 'grumblecap',
  },
  {
    id: 'cloister',
    tileset: 'cloister',
    levels: ['small', 'standard', 'big'],
    boss: 'topiary-knight',
  },
  {
    id: 'sandglass',
    tileset: 'sandglass',
    levels: ['small', 'standard', 'standard', 'big'],
    boss: 'fluffhotep',
  },
  {
    id: 'frostbell',
    tileset: 'frostbell',
    levels: ['standard', 'standard', 'big', 'big'],
    boss: 'yeti-spaghetti',
  },
  { id: 'gloom', tileset: 'gloom', levels: ['standard', 'big', 'big'], boss: 'hushkeeper' },
];

/** The depth an act's first level counts as (light, loot and foes scale with it). */
export function actStartDepth(act: number): number {
  let d = 1;
  for (let i = 0; i < act; i++) d += ACTS[i]!.levels.length;
  return d;
}
