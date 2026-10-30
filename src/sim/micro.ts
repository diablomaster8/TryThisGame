/**
 * R0294 (FUN-05): the comic micro-interaction kit's rules. Every quest check verb in the
 * content maps either to a real command the game already has (talk, sit, race...) or to one
 * of eight small, never-failable micro-games, so "Do it" is no longer a bare button. This
 * module is pure: the mapping and each game's seeded setup. The games themselves live in
 * `minigames/micro/`. Kinds marked built in `MICRO_BUILT` play now; the others still show
 * the plain button until their pass.
 */
import { Rng } from './rng';

export type MicroKind =
  'balance' | 'hunt' | 'escort' | 'catch' | 'climb' | 'puzzle' | 'survive' | 'explore';

/** The micro-games playable in this build. */
export const MICRO_BUILT: ReadonlySet<MicroKind> = new Set<MicroKind>(['balance', 'hunt', 'catch']);

/** Verbs a micro-game stands in for. */
const MICRO_VERBS: Record<MicroKind, readonly string[]> = {
  balance: ['carry', 'deliver', 'fetch', 'present', 'serve', 'bring', 'hold', 'float'],
  hunt: [
    'find',
    'inspect',
    'search',
    'track',
    'lost-shoe',
    'listen',
    'count',
    'tally',
    'spot',
    'investigate',
  ],
  escort: ['escort', 'follow', 'chase', 'lead', 'distract', 'sneak', 'guard'],
  catch: ['collect', 'gather', 'catch', 'rescue', 'release', 'clear'],
  climb: ['climb', 'reach', 'push', 'tie', 'twine', 'repair'],
  puzzle: [
    'puzzle',
    'build',
    'craft',
    'paint',
    'write',
    'develop',
    'resolve',
    'assign',
    'candle',
    'open',
    'break',
  ],
  survive: ['karate', 'freeze', 'night', 'party'],
  explore: ['explore', 'enter', 'pass', 'ride', 'stand', 'meet', 'show', 'host'],
};

/**
 * Verbs the game already answers with a real command or system (a scene, a walk, the race
 * or Expedition screen, a shop, the Grove's own care): these never need a micro-game.
 */
export const REAL_VERBS: ReadonlySet<string> = new Set([
  'watch',
  'talk',
  'walk',
  'visit',
  'sit',
  'wait',
  'expedition',
  'minigame',
  'give',
  'choose',
  'place',
  'race',
  'lang',
  'feed',
  'swim',
  'photo',
  'prosperity',
  'class',
  'pet',
  'ask',
  'train',
  'summon',
  'time',
  'wear',
  'shop',
  'pay',
  'tap',
  'use',
  'search-grove',
  'chapter',
  'shake',
  'wake',
  'trust',
  'play',
  'recruits',
  'hatch',
  'partners',
  'merged',
  'act',
]);

const VERB_TO_KIND = new Map<string, MicroKind>();
for (const [kind, verbs] of Object.entries(MICRO_VERBS) as Array<[MicroKind, readonly string[]]>)
  for (const v of verbs) VERB_TO_KIND.set(v, kind);

/** The check's verb: its first token, lower-cased ("carry:pie:bench" → "carry"). */
export function checkVerb(check: string): string {
  return (check.trim().split(/[:\s(;,+&]/)[0] ?? '').toLowerCase();
}

/** Every verb in a check (checks can join several with ";", ",", "+", "&" or "and"). */
export function checkVerbs(check: string): string[] {
  return check
    .split(/\s*[;,+&]\s*|\s+and\s+/)
    .map((t) => checkVerb(t))
    .filter((v) => v.length > 0);
}

/** The micro-game for a check, or null when a real command answers it (or it is unknown). */
export function microFor(check: string): MicroKind | null {
  return VERB_TO_KIND.get(checkVerb(check)) ?? null;
}

/** Whether every verb of this check is answered: by a micro-game or by a real command. */
export function checkCovered(check: string): boolean {
  return checkVerbs(check).every((v) => VERB_TO_KIND.has(v) || REAL_VERBS.has(v));
}

// ---------------------------------------------------------------- game setups (seeded)

export interface HuntSetup {
  /** Six things on the board; `hot` are the three that count. */
  things: string[];
  hot: number[];
}

export interface CatchSetup {
  /** Which of three lanes each falling thing drops in, in order. */
  lanes: number[];
}

export interface BalanceSetup {
  /** Items in the stack, and how hard it wobbles (radians a second, at most). */
  stack: number;
  wobble: number;
}

/** Hunt: six spots, three of which hide the thing; the rest are decoys that do something silly. */
export function huntSetup(seed: number): HuntSetup {
  const rng = new Rng(seed * 2654435761 + 7);
  const order = [0, 1, 2, 3, 4, 5];
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const things = ['bush', 'barrel', 'crate', 'pot', 'hay', 'log'];
  return { things, hot: order.slice(0, 3).sort((a, b) => a - b) };
}

/** Catch: eight falling things across three lanes; catching five ends it. */
export function catchSetup(seed: number): CatchSetup {
  const rng = new Rng(seed * 40503 + 11);
  return { lanes: Array.from({ length: 8 }, () => rng.int(0, 2)) };
}

/** Balance: three to five things, wobbling a little harder each step of a quest. */
export function balanceSetup(seed: number): BalanceSetup {
  const rng = new Rng(seed * 69069 + 3);
  const stack = rng.int(3, 5);
  return { stack, wobble: 0.5 + stack * 0.12 };
}
