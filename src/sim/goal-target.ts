/**
 * R0661 (CAMP-69): one "Go there" for every tracked goal. The beacon (`sim/beacon.ts`) knows a
 * few Grove suggestions and chapter 1; this adds the spine's other goals, which name people and
 * places ("Talk to Dusty", "the lanterns"), and the tracked quests, which live in an area. Each
 * resolves against the world as it stands (where Dusty is now, the nearest unlit lantern), so
 * the objective chip's "Go there" and the journal walk or hop the Keeper to the right spot.
 * Goals with no place (a choice made in a scene, an Expedition) have none, and show no button.
 */
import { REGIONS } from '../config/regions';
import { LANTERN_POSTS } from '../config/tuning';
import { chapterDef, FINAL_CHAPTER } from './campaign';
import { objectivePoi, poiPos } from './beacon';
import { questAreaKey } from './quest-offers';
import { sideStory } from './story-scenes';
import type { CampaignState, Vec2, World } from './types';

/** The valley friends chapter 11's goal asks you to visit (the driver's `threeFriends`). */
const FRIENDS = ['fern', 'marina', 'sparks', 'clover'] as const;

function nearest(from: Vec2, list: readonly Vec2[]): Vec2 | null {
  let best: Vec2 | null = null;
  let d = Infinity;
  for (const p of list) {
    const e = Math.hypot(p.x - from.x, p.z - from.z);
    if (e < d) {
      d = e;
      best = p;
    }
  }
  return best && { x: best.x, z: best.z };
}

function npcPos(world: World, trainer: string): Vec2 | null {
  const npc = world.npcs.find((n) => n.trainer === trainer && !n.guest);
  return npc ? { x: npc.pos.x, z: npc.pos.z } : null;
}

function nubbinPos(world: World, id: string | null | undefined): Vec2 | null {
  const n = id ? world.nubbins.find((x) => x.id === id) : undefined;
  return n ? { x: n.pos.x, z: n.pos.z } : null;
}

function unlitLantern(world: World, c: CampaignState): Vec2 | null {
  const posts = LANTERN_POSTS.filter((p) => !c.flags[`lantern:${p.id}`]);
  return nearest(world.keeper.pos, posts);
}

/** Where chapter goal `goal` is now, or null when it has no place. */
const SPINE: Readonly<Record<string, (w: World, c: CampaignState) => Vec2 | null>> = {
  firstHatch: (w) => objectivePoi(w, 'grove:hatch'),
  feedTwice: (w) => objectivePoi(w, 'grove:hungry'),
  sableTrust20: (w, c) => nubbinPos(w, c.sableId),
  sableTrust45: (w, c) => nubbinPos(w, c.sableId),
  lanternsAndMoss: (w, c) =>
    unlitLantern(w, c) ?? (c.flags.mossPetted ? null : nubbinPos(w, c.mossId)),
  lanternsAgain: (w, c) => unlitLantern(w, c),
  talkDusty: (w) => npcPos(w, 'dusty'),
  threeFriends: (w, c) =>
    nearest(
      w.keeper.pos,
      FRIENDS.filter((t) => !c.flags[`talked:${c.chapter}:${t}`])
        .map((t) => npcPos(w, t))
        .filter((p): p is Vec2 => p !== null),
    ),
};

/** The spine chapter goal's place, from the chip's key `story:hazel:<n>`. */
function spineTarget(world: World, n: number): Vec2 | null {
  const c = world.campaign;
  if (!c || c.storyline || c.chapter !== n || n > FINAL_CHAPTER || c.step !== 1) return null;
  const goal = chapterDef(n)?.goal;
  return goal ? (SPINE[goal]?.(world, c) ?? null) : null;
}

/** A tracked quest's place, from the chip's key `quest:<id>:<step>`: its Grove area. */
function questTarget(id: string): Vec2 | null {
  const quest = sideStory(id);
  const key = quest ? questAreaKey(quest) : null;
  if (!key) return null;
  const [region, poi] = key.split('/');
  if (region !== 'grove' || !poi || poi === '*') return null;
  return REGIONS.grove.pois.some((p) => p.id === poi) ? poiPos(poi) : null;
}

/**
 * Where the objective with chip key `key` is, in the Grove, or null. Covers the spine
 * (`story:hazel:<n>`), the tracked quests (`quest:<id>:<step>`) and the beacon's own keys.
 */
export function goalTarget(world: World, key: string | null): Vec2 | null {
  if (!key || world.location !== 'grove') return null;
  const parts = key.split(':');
  if (parts[0] === 'story' && parts[1] === 'hazel') {
    const n = Number(parts[2]);
    return spineTarget(world, n) ?? objectivePoi(world, key);
  }
  if (parts[0] === 'quest' && parts[1]) return questTarget(parts[1]);
  return objectivePoi(world, key);
}
