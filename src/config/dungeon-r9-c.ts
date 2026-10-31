/**
 * Lane B round 9, helper c ("party, quests, camp"): every tunable number for the party's
 * personalities underground (R0167), the Hollow's requests (R0165), today's act chain and its
 * share codes (R0185), the act quests (R0166) and the camp friends for hire (R0181). Player
 * text lives in `strings-hollow-r9-c.ts`.
 */
import type { HollowLevel } from './tuning-dungeon';

export const HOLLOW_R9C = {
  /** R0167: how each personality follows and idles underground (never stats). */
  moods: {
    /** Follow distance as a share of `DUNGEON.followDistance`. */
    follow: { cheerful: 1, shy: 0.6, mischievous: 1.25, lazy: 1.6 } as Record<string, number>,
    /** Cheerful: a happy hop on every find, this long. */
    hopMs: 900,
    /** Shy: tucks in this far behind the Keeper while a pack within `hideReach` u gives chase. */
    hideBehind: 0.8,
    hideReach: 9,
    /** Mischievous: goes for a stray carrying Shells within this many u; once per level. */
    borrowReach: 7,
    borrowTouch: 0.9,
    /** Lazy: dozes once the Keeper has stood still this long, once per level; a nap of
     * `napRestMs` is a small picnic for the whole party. */
    napAfterMs: 4000,
    napRestMs: 5000,
    napEnergy: 0.2,
    napHappy: 5,
  },
  /** R0165: the Hollow's one-time requests on the board. */
  requests: {
    boss: { target: 1, shells: 60 },
    secret: { target: 1, shells: 30 },
    set: { target: 1, shells: 50 },
  },
  /** R0185: today's shared act chain: five levels, the boss on the last. */
  daily: {
    shape: ['small', 'standard', 'standard', 'big', 'big'] as readonly HollowLevel[],
  },
  /** R0166: how close the Keeper must come to a lost one to find it, in cells. */
  quests: { rescueCells: 1.6 },
  /** R0181: a friend for hire. */
  friends: {
    /** Shells to hire a friend for one trip. */
    cost: 15,
    /** Friends on each camp's hire board. */
    perBoard: 3,
    speed: 3.2,
    follow: 1.8,
    /** Counts as this many party members in the stub fight weight, and adds Brave to each. */
    power: 1,
    brave: 2,
    /** Aura sizes. */
    sight: 2,
    fetch: 2,
    braveAura: 2,
    /** Heal: once per level, when someone is below this energy, everyone gets this much. */
    healBelow: 0.5,
    heal: 0.3,
  },
} as const;

export type FriendAura = 'sight' | 'fetch' | 'brave' | 'heal';

/** R0181: each Keeper-friend's aura when they come along. */
export const FRIEND_AURA: Record<string, FriendAura> = {
  fern: 'heal',
  marina: 'fetch',
  sparks: 'brave',
  clover: 'fetch',
  pixel: 'sight',
  ember: 'brave',
  byte: 'brave',
  dusty: 'fetch',
  nova: 'sight',
  luna: 'heal',
};

export type ActQuestKind = 'clear' | 'find' | 'rescue' | 'unique';

/**
 * R0166: two quests per act, D2-shaped. `level` is the act level (1-based) the goal is on;
 * `unique` the named foe for a `unique` quest. Rewards are paid once.
 */
export interface ActQuestDef {
  id: string;
  act: number;
  kind: ActQuestKind;
  level: number;
  unique?: string;
  shells: number;
  acorns: number;
}

export const ACT_QUESTS: readonly ActQuestDef[] = [
  { id: 'sneezes', act: 0, kind: 'clear', level: 1, shells: 25, acorns: 1 },
  { id: 'teaspoon', act: 0, kind: 'find', level: 2, shells: 25, acorns: 0 },
  { id: 'bells', act: 1, kind: 'unique', level: 2, unique: 'count-compost', shells: 30, acorns: 1 },
  { id: 'shears', act: 1, kind: 'find', level: 3, shells: 30, acorns: 0 },
  { id: 'sandglass', act: 2, kind: 'find', level: 2, shells: 35, acorns: 0 },
  { id: 'napping-king', act: 2, kind: 'clear', level: 3, shells: 35, acorns: 1 },
  { id: 'penguins', act: 3, kind: 'rescue', level: 2, shells: 40, acorns: 1 },
  { id: 'recipe', act: 3, kind: 'find', level: 3, shells: 40, acorns: 0 },
  { id: 'hearths', act: 4, kind: 'clear', level: 2, shells: 45, acorns: 1 },
  {
    id: 'third-hush',
    act: 4,
    kind: 'unique',
    level: 2,
    unique: 'hush-three',
    shells: 45,
    acorns: 1,
  },
];
