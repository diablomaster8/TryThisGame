/**
 * The battle core's data. A `BattleState` is plain JSON: it goes into the save as
 * `world.battle`, and seed plus the list of actions replays it exactly. The random generator
 * lives only as `rngState`. Nothing here holds player-facing text: foes carry a name slot that
 * `config/strings-battle.ts` turns into a name, and the log holds events, not sentences.
 */
import type { AlignmentBand, NubbinType, Personality } from '../types';

/** Which side: 0 is the Keeper's, 1 the rivals'. */
export type SideIx = 0 | 1;

export interface Combatant {
  /** Unique in the bout: the Nubbin's id for allies, `foe-<n>` for rivals. */
  id: string;
  side: SideIx;
  /** The Nubbin's id, or null for a rival. */
  nubbinId: string | null;
  /** An ally's own name (player data); null for a rival, which uses `foeName`. */
  name: string | null;
  /** A rival's name slot in `strings-battle.ts`. */
  foeName: number;
  /** Species id, for the views and for a recruit after a dojo win. */
  species: string;
  level: number;
  hp: number;
  maxHp: number;
  /** The timed dojo bout's strike power and dodge chance (from Bonk and Flutter). */
  power: number;
  dodge: number;
  /** Caught its breath this turn: Guard ×1.3 (the timed bout: a guarded strike). */
  guard: boolean;
  // Turn-mode stats (recs FIGHT-10 to FIGHT-17). A bout saved before them (v1) is a timed
  // dojo bout, which never reads them, or a turn bout, which is closed as a draw on load.
  type: NubbinType;
  /** A Normal combatant's second type, which also gets its STAB ("Adaptable"). */
  second: NubbinType | null;
  band: AlignmentBand;
  eternal: boolean;
  personality: Personality | null;
  bonk: number;
  splash: number;
  def: number;
  zip: number;
  flutter: number;
  puff: number;
  puffMax: number;
  /** Slotted move ids (at most four); Bonk, Huddle and catching a breath are always there. */
  moves: string[];
  /** Moves a level-3 lesson has polished. */
  boosted: string[];
  traits: Trait[];
  major: { id: StatusId; turns: number } | null;
  moods: Partial<Record<MoodStat, number>>;
  /** Once-per-bout things already spent: 'secondWind', 'slippery'. */
  used: string[];
  /** The last move it used, for Copycat. */
  last: string | null;
  /** Doodle Decoy turns left: the next foe attack at this side hits the doodle. */
  decoy: number;
  /** Started the bout tired (needs.energy low): Puff 1. */
  yawny: boolean;
  /** A wild foe's Calm, 0..100 (recs FIGHT-21); absent for anyone who can't be befriended. */
  calm?: number;
  /** A Shadow stray in the Hollow: it takes no HP, only Calm. */
  shadow?: boolean;
  /** Decided to come home with the Keeper: off the field, not tuckered. */
  friend?: boolean;
  /** Has already played with a thrown toy this bout (once per foe). */
  toyed?: boolean;
  /** Turns left playing with a toy instead of acting. */
  playing?: number;
  /** A Sun or Moon fruit: its moves count as that alignment for a few turns (FIGHT-20). */
  alignAs?: { align: 'sun' | 'moon'; turns: number };
}

/** How a side picks its moves (recs FIGHT-23). */
export type AiLevel = 'sprout' | 'keeper' | 'champion';

/**
 * A battle item (recs FIGHT-20), taken from `world.inventory`: plain fruit, a flavoured
 * fruit (`fruit:<flavour>`) or a toy. Nothing is spent until the bout ends.
 */
export type BattleItemId =
  | 'fruit'
  | 'fruit:swim'
  | 'fruit:fly'
  | 'fruit:run'
  | 'fruit:power'
  | 'fruit:stamina'
  | 'fruit:sun'
  | 'fruit:moon'
  | 'toy';

/** A Circuit Keeper's field rule (recs FIGHT-22). */
export type Gimmick = 'puddle' | 'night' | 'shuffle' | 'naps';

/** Gentle bouts (recs FIGHT-24): the Learning Grove's two bands, or the Settings switch. */
export type GentleBand = 'sprout' | 'reader' | 'all';

export type StatusId = 'drowsy' | 'dizzy' | 'soggy' | 'giggly' | 'peckish' | 'sticky';
export const STATUS_IDS: readonly StatusId[] = [
  'drowsy',
  'dizzy',
  'soggy',
  'giggly',
  'peckish',
  'sticky',
];
/** Mood stages: Bonk (Pumped/Sulky), Guard (Puffed up), Zip (Zoomy) and accuracy (Shy-eyed). */
export type MoodStat = 'bonk' | 'guard' | 'zip' | 'acc';
export const MOOD_STATS: readonly MoodStat[] = ['bonk', 'guard', 'zip', 'acc'];

export type TraitId = 'slippery' | 'featherlight' | 'headStart' | 'heavyHugger' | 'secondWind';
/** A grade trait: `full` for an S grade, half-strength for an A. */
export interface Trait {
  id: TraitId;
  full: boolean;
}

export type MoveKind = 'bonk' | 'splash' | 'status' | 'support';
export type MoveTarget = 'foe' | 'self' | 'ally' | 'allFoes' | 'allAllies';
export type MoveAlign = 'sun' | 'moon' | 'none';
/** Where a move comes from, for the stats sheet and the exhaustiveness test. */
export type MoveSource =
  'basic' | 'species' | 'critter' | 'lesson' | 'form' | 'chaos' | 'final' | 'fallback';

/** One move, data only; its name and blurb live in `config/strings-battle-moves.ts`. */
export interface MoveDef {
  id: string;
  type: NubbinType;
  align: MoveAlign;
  kind: MoveKind;
  power: number;
  /** 0..1; status moves ignore Flutter. */
  acc: number;
  puff: number;
  /** -1..+2. */
  priority: number;
  status?: { id: StatusId; chance: number };
  /** A mood change, on the user's side ('self', 'allies') or the target's ('target', 'foes'). */
  mood?: {
    stat: MoodStat;
    delta: number;
    who: 'self' | 'allies' | 'target' | 'foes';
    chance: number;
  };
  /** Heals each target by this share of its max HP. */
  heal?: number;
  /** Featherlight (Fly S) floats over these. */
  ground?: boolean;
  /** A move with its own rule. */
  special?: 'copycat' | 'decoy' | 'snack';
  target: MoveTarget;
  /** For the tactics mode later (FIGHT-50+); unused in turn mode. */
  grid: {
    range: [number, number];
    aoe: 'single' | 'line2' | 'cross1' | 'ring1';
    heightReach: number;
    ct?: number;
  };
  anim: string;
  source: MoveSource;
}

/** A Nubbin's moves, kept on the Nubbin (recs FIGHT-17). Optional in the save; filled on use. */
export interface NubbinBattle {
  known: string[];
  slots: [string | null, string | null, string | null, string | null];
  wins: number;
  losses: number;
  befriended: number;
  /** The rebirth count the slots were last set for: a rebirth resets them to the best four. */
  life: number;
}

/** Where a bout comes from; it picks the rules, the rivals and the prize table. */
export type BattleContext =
  | { kind: 'karate'; tier: number; nubbinId: string }
  | { kind: 'party'; tier: number; ids: string[] }
  /** The turn-based dojo singles (recs FIGHT-28): one Nubbin, or a party of up to three. */
  | { kind: 'dojo'; tier: number; ids: string[] }
  /** A story's own bout (FIGHT-29): Logged In's 3v3 against the digital foes. */
  | { kind: 'story'; storyline: 'logged'; tier: number; ids: string[] }
  /** A Grove Circuit match against one of the ten Keepers (FIGHT-22). */
  | { kind: 'circuit'; trainer: string; champion?: boolean; tier: number; ids: string[] }
  /**
   * A bout another system starts (the Hollow, a story beat): it names its source and a key the
   * caller can match on the `battleEnd` event, and lists its foes by species and level.
   */
  | {
      kind: 'encounter';
      tier: number;
      ids: string[];
      source: string;
      key: string;
      /**
       * `wild` foes can be befriended (Calm, FIGHT-21); `shadow` strays take Calm only, never
       * HP. Both optional, so older callers are unchanged.
       */
      foes: { species: string; level: number; wild?: boolean; shadow?: boolean }[];
      /** One active per side with the rest benched (FIGHT-19); off by default for encounters. */
      singles?: boolean;
    };

export type BattleMode = 'turn' | 'karate';

/** What a combatant (or the Keeper, for the timed bout) does. */
export type BattleAction =
  /** Bonk, the 0-Puff move everyone has. */
  | { k: 'strike'; target?: string; swing?: boolean }
  /** Catch your breath: +4 Puff and Guard ×1.3 this turn. */
  | { k: 'guard' }
  /** Huddle: heal the side a little. */
  | { k: 'rally' }
  /** Any move the combatant has, by id. */
  | { k: 'move'; move: string; target?: string }
  /** Singles: bring a benched Nubbin in (priority +3), or pick the next after a tuck-in. */
  | { k: 'swap'; to: string }
  /** Use a battle item on an ally (fruit) or a foe (a toy, or a snack offered to a wild one). */
  | { k: 'item'; item: BattleItemId; target?: string }
  /** Timed bout: a tap at bout time `atMs`. */
  | { k: 'tap'; atMs: number }
  /** Timed bout: let the clock run to `toMs` (the rival keeps striking). */
  | { k: 'advance'; toMs: number };

export type BattleEvent =
  | {
      k: 'hit';
      by: string;
      to: string;
      dmg: number;
      strong: boolean;
      guarded: boolean;
      /** Turn mode: the move, its type multiplier and a "Big one!". */
      move?: string;
      eff?: number;
      crit?: boolean;
    }
  | { k: 'miss'; by: string; to: string; float?: boolean }
  | { k: 'guard'; by: string; puff?: number }
  | { k: 'rally'; by: string; heal: number }
  | { k: 'use'; by: string; move: string }
  | { k: 'status'; to: string; id: StatusId; on: boolean }
  /** A status or mood that did not take: already has one, immune, Slippery or resisted. */
  | { k: 'shrug'; to: string; id: StatusId | MoodStat }
  | { k: 'mood'; to: string; stat: MoodStat; delta: number }
  /** Drowsy dozes or Giggly laughs instead of acting. */
  | { k: 'skip'; who: string; why: StatusId }
  /** Dizzy spun and bonked itself. */
  | { k: 'boing'; who: string; dmg: number }
  | { k: 'peckish'; who: string; dmg: number }
  | { k: 'trait'; who: string; id: TraitId }
  | { k: 'decoy'; by: string; to: string }
  | { k: 'yawny'; who: string }
  | { k: 'turnStart'; n: number }
  | { k: 'turnEnd'; n: number }
  /** HP reached 0: an ally naps under a leaf blanket, a rival yawns and toddles home. */
  | { k: 'tuckered'; who: string; side: SideIx }
  | { k: 'round'; n: number }
  | { k: 'swap'; side: SideIx; from: string; to: string }
  | { k: 'item'; by: string; item: BattleItemId; to: string }
  /** A wild foe's Calm moved. */
  | { k: 'calm'; to: string; calm: number; delta: number }
  /** A wild foe decided to come home with the Keeper. */
  | { k: 'befriend'; who: string }
  /** Played with a toy instead of acting. */
  | { k: 'play'; who: string }
  /** Gentle bouts: at 1 HP the Keeper gives a cuddle and a free fruit. */
  | { k: 'cuddle'; who: string; heal: number }
  /** The Power swing on a Bonk: the timing bar's sweet spot hits ×1.2. */
  | { k: 'swing'; by: string; sweet: boolean }
  /** A Shadow stray can't be hurt, only calmed. */
  | { k: 'unhurt'; to: string }
  | { k: 'end'; winner: SideIx | null; reason: BattleEndReason };

/** `hug` ends a gentle bout; `friends` when every foe was befriended. */
export type BattleEndReason = 'tuckered' | 'forfeit' | 'time' | 'hug' | 'friends';

export interface BattleResult {
  /** null for a draw (the round or time limit). */
  winner: SideIx | null;
  reason: BattleEndReason;
}

/** The timed bout's clock: the bar and the rival's next strike. */
export interface KarateClock {
  timeMs: number;
  barSpeed: number;
  rivalEveryMs: number;
  rivalNextMs: number;
  /** The last strike, for the view's lunge and "POW". */
  lastHit: { who: SideIx; strong: boolean; dodged: boolean; atMs: number } | null;
}

export interface BattleState {
  /** 2 since moves (recs FIGHT-10 to FIGHT-18); a v1 turn bout is closed as a draw on load. */
  v: 1 | 2;
  mode: BattleMode;
  seed: number;
  rngState: number;
  sides: [Combatant[], Combatant[]];
  /** Round number, from 1. */
  turn: number;
  /** Index into side 0 of the ally choosing next (turn mode). */
  active: number;
  /** `replace`: singles, our active one is tuckered and a benched one must come in. */
  phase: 'choose' | 'replace' | 'done';
  /** Singles (recs FIGHT-19): the index of each side's active combatant; absent = all fight. */
  lead?: [number, number];
  /** How the rivals choose; absent = by tier (Sprout at tier 1, else Keeper). */
  ai?: AiLevel;
  /** Gentle bouts (kid mode, FIGHT-24). */
  gentle?: GentleBand;
  /** Items the Keeper may use (a snapshot of the inventory at the start) and those used. */
  bag?: Partial<Record<BattleItemId, number>>;
  spent?: Partial<Record<BattleItemId, number>>;
  /** A Champion rival's own snacks (FIGHT-23); never from the Keeper's inventory. */
  foeBag?: Partial<Record<BattleItemId, number>>;
  foeSpent?: Partial<Record<BattleItemId, number>>;
  /** A Circuit Keeper's field rule. */
  gimmick?: Gimmick;
  /** Turn mode: what each ally chose this turn, by combatant id (resolved after the last). */
  choices?: Record<string, BattleAction>;
  log: BattleEvent[];
  result: BattleResult | null;
  context: BattleContext;
  /** Timed bout only. */
  karate?: KarateClock;
  /** Set once the sim has paid the prize, so a result is never paid twice. */
  settled?: boolean;
}
