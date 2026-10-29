/**
 * R0294 (FUN-05): the comic micro-interaction kit's rules. Every quest check verb in the
 * content maps either to a real command the game already has (talk, sit, race...) or to one
 * of eight small, never-failable micro-games, so "Do it" is no longer a bare button. This
 * module is pure: the mapping and each game's seeded setup. The games themselves live in
 * `minigames/micro/`. All eight kinds play since round 6; `MICRO_BUILT` stays as the switch
 * a future kind would sit behind.
 */
import { Rng } from './rng';

export type MicroKind =
  'balance' | 'hunt' | 'escort' | 'catch' | 'climb' | 'puzzle' | 'survive' | 'explore';

/** The micro-games playable in this build. */
export const MICRO_BUILT: ReadonlySet<MicroKind> = new Set<MicroKind>([
  'balance',
  'hunt',
  'catch',
  'escort',
  'climb',
  'puzzle',
  'survive',
  'explore',
]);

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

/**
 * A `minigame:` check names a game the Grove never built (88 of them in the content, R0292).
 * Its second token says what kind of thing it was meant to be; anything unmatched is a
 * beat-and-timing game, which the climb's rhythm tap stands in for.
 */
const MINIGAME_KINDS: ReadonlyArray<[RegExp, MicroKind]> = [
  [/sneak|chase|follow|lead|escort|korin/, 'escort'],
  [/mercy|survive|cover|storm|trap|doom|haggle|straight-face/, 'survive'],
  [/find|stargaze|rock-pool|dig|moth|search|spot|count/, 'hunt'],
  [/collect|catch|clean|relay|gather|\beat\b/, 'catch'],
  [/shuffle|puzzle|tiles|build|trial|tea|brew/, 'puzzle'],
  [/hand-over|carry|unstick|cushion|balance/, 'balance'],
  [/walk|crossing|explore|giant/, 'explore'],
];

/** The micro-game for a check, or null when a real command answers it (or it is unknown). */
export function microFor(check: string): MicroKind | null {
  const verb = checkVerb(check);
  if (verb === 'minigame') {
    const rest = check.trim().toLowerCase().slice('minigame:'.length);
    return MINIGAME_KINDS.find(([re]) => re.test(rest))?.[1] ?? 'climb';
  }
  return VERB_TO_KIND.get(verb) ?? null;
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

export interface EscortSetup {
  /** Where along the path (0..1) the dawdler stops to look at something. */
  stops: number[];
}

export interface ClimbSetup {
  /** Taps to the top, and the beat in ms the taps follow. */
  steps: number;
  beatMs: number;
}

export interface PuzzleSetup {
  /** Pieces to place; `order` is the shuffled order the tray shows them in. */
  pieces: number;
  order: number[];
}

export interface SurviveSetup {
  /** Swings per round (0 left, 1 right, 2 high), three rounds. */
  swings: number[][];
}

export interface ExploreSetup {
  /** A 5×5 field: the start and the marked spot, as [col, row]. */
  start: [number, number];
  goal: [number, number];
}

function shuffled(rng: Rng, n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

/** Escort: three stops along the path, spread so no two bunch up. */
export function escortSetup(seed: number): EscortSetup {
  const rng = new Rng(seed * 22695477 + 1);
  return { stops: [0.15 + rng.next() * 0.15, 0.4 + rng.next() * 0.15, 0.65 + rng.next() * 0.2] };
}

/** Climb: six to eight taps on a steady beat. */
export function climbSetup(seed: number): ClimbSetup {
  const rng = new Rng(seed * 1103515245 + 12345);
  return { steps: rng.int(6, 8), beatMs: 900 + rng.int(0, 3) * 100 };
}

/** Puzzle: three to five pieces, never shown already in order. */
export function puzzleSetup(seed: number): PuzzleSetup {
  const rng = new Rng(seed * 134775813 + 5);
  const pieces = rng.int(3, 5);
  let order = shuffled(rng, pieces);
  if (order.every((v, i) => v === i)) order = [...order.slice(1), order[0]!];
  return { pieces, order };
}

/** Survive: three rounds of three swings. */
export function surviveSetup(seed: number): SurviveSetup {
  const rng = new Rng(seed * 214013 + 2531011);
  return { swings: [0, 1, 2].map(() => [rng.int(0, 2), rng.int(0, 2), rng.int(0, 2)]) };
}

/** Explore: start in the bottom row, the spot at least four steps away. */
export function exploreSetup(seed: number): ExploreSetup {
  const rng = new Rng(seed * 16807 + 9);
  const start: [number, number] = [rng.int(0, 4), 4];
  let goal: [number, number] = [rng.int(0, 4), rng.int(0, 1)];
  if (Math.abs(goal[0] - start[0]) + Math.abs(goal[1] - start[1]) < 4) goal = [4 - start[0], 0];
  return { start, goal };
}

/**
 * Whether Do it skips the micro-game (the accessibility switch). Unset: on in the Little
 * Sprouts band, off everywhere else.
 */
export function microSkipped(world: {
  settings: { microSkip?: boolean };
  edu: { band: string } | null;
}): boolean {
  return world.settings.microSkip ?? world.edu?.band === 'sprout';
}
