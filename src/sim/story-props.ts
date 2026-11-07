import { STORY_PROPS } from '../config/tuning';
import type { CampaignState, World } from './types';

/**
 * The things the side stories point at in the Grove: the old trowel on the cottage step,
 * Hazel's lantern by the door, the flat stone on the hill, the door in the Old Wall and
 * the rest. Each is data in tuning (`STORY_PROPS`: where it stands, how it is drawn, and
 * which step checks a tap on it meets) and a name in strings. This module says which
 * are standing right now, from the campaign's state; both renderers draw that list and
 * send a `storyProp` command when one is tapped, which the runner reads.
 */

export type StoryPropKind =
  | 'trowel'
  | 'register'
  | 'handLantern'
  | 'flatStone'
  | 'gardenDoor'
  | 'oldBench'
  | 'chair'
  | 'shed'
  | 'barn'
  | 'shelf';

export interface StoryPropDef {
  id: string;
  kind: StoryPropKind;
  x: number;
  z: number;
  /** Check tokens a tap on this prop meets (`commandMeets` in side-rule-kit.ts). */
  meets: readonly string[];
}

const step = (c: CampaignState, id: string): number => c.side[id]?.step ?? -1;
// Read here rather than from story-rewards.ts, which would close an import cycle at load.
const hasKeepsake = (world: World, id: string): boolean => world.inventory.keepsakes.includes(id);

/** Whether `id` stands in the Grove right now. Props not listed stand always. */
function standing(world: World, c: CampaignState, id: string): boolean {
  switch (id) {
    case 'old-trowel':
      // Dusty's trowel, from Fossil's walk, until it is given to Hazel (S10's first wish).
      return hasKeepsake(world, 's5-dusty-trowel') && step(c, 's10') < 1;
    case 'hatch-register':
      // Hazel's register comes out when Ember needs Ash's first sound.
      return step(c, 's6') >= 1 || Boolean(c.flags.s6Done);
    case 'hazels-lantern':
      // Hazel's lantern hangs by the door until Nova borrows it for the ridge.
      return hasKeepsake(world, 's10-lantern') && step(c, 's24') < 3;
    case 'walled-garden-door':
      return c.side.s26 !== undefined;
    case 'hush-bench':
      return step(c, 's26') >= 3 || Boolean(c.flags.hushGarden);
    case 'corvins-chair':
      return hasKeepsake(world, 's9-chair');
    case 'sunrise-shelf':
      return c.chapter > 12;
    default:
      return true;
  }
}

/** The props standing in the Grove now (none outside the campaign or away from home). */
export function visibleStoryProps(world: World): StoryPropDef[] {
  const c = world.campaign;
  if (!c || c.chapter === 0 || world.location !== 'grove') return [];
  return STORY_PROPS.filter((p) => standing(world, c, p.id));
}

/** A tap on prop `id` meets a step whose check carries one of the prop's tokens. */
export function storyPropMeets(id: string, checkTokens: string[]): boolean {
  const def = STORY_PROPS.find((p) => p.id === id);
  return def !== undefined && def.meets.some((m) => checkTokens.includes(m));
}

/**
 * The props standing now as bits in `STORY_PROPS` order, for the collider table's cache key
 * (MOVE-16): it is asked for every walker on every step, so it must not allocate.
 */
export function storyPropMask(world: World): number {
  const c = world.campaign;
  if (!c || c.chapter === 0 || world.location !== 'grove') return 0;
  let mask = 0;
  for (let i = 0; i < STORY_PROPS.length; i++)
    if (standing(world, c, STORY_PROPS[i]!.id)) mask |= 1 << i;
  return mask;
}
