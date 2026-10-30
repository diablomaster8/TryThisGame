/**
 * The battle core's data. A `BattleState` is plain JSON: it goes into the save as
 * `world.battle`, and seed plus the list of actions replays it exactly. The random generator
 * lives only as `rngState`. Nothing here holds player-facing text: foes carry a name slot that
 * `config/strings-battle.ts` turns into a name, and the log holds events, not sentences.
 */
import type { AlignmentBand, NubbinType, Personality } from '../types';
import type { BoutSpoils } from './rewards';

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
  /** Slapstick (FUN-74): laughing at a rival's fumble, it loses its next action. */
  laughing?: true;
  /** Fusion burst (FIGHT-95): this half stepped into the fused combatant with this id. */
  fusedInto?: string;
  /** The fused combatant itself: its two halves, their HP when they fused, and turns left. */
  fusion?: { of: [string, string]; hp: [number, number]; left: number };
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
  special?: 'copycat' | 'decoy' | 'snack' | 'fusion';
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
export type BattleContext = BattleContextKind & BattleFormat;

/**
 * Round 5 options on any turn bout (ignored by the timed dojo bout): `doubles` puts two a side
 * on the field (recs FIGHT-60), `mode: 'atb'` runs it as the ATB "Command" bout (FIGHT-40).
 */
export interface BattleFormat {
  doubles?: boolean;
  mode?: 'atb';
  /**
   * The pre-bout sheet's difficulty override (recs FIGHT-86): `gentle` is kid mode, `spicy` is
   * Champion AI with rewards ×1.25. Absent = the Keeper's usual choice (Gentle bouts on or off).
   */
  difficulty?: BoutDifficulty;
  /**
   * A skipped story bout (recs FIGHT-71): resolved at once by `autoResolve`, never shown, and
   * allowed only for story bouts while Settings → Bouts says "Skip story bouts".
   */
  auto?: true;
}

export type BoutDifficulty = 'gentle' | 'normal' | 'spicy';

/** Debug panel battle tools (recs FIGHT-80): an action, so a replay repeats them too. */
export type BattleDebugOp =
  | { op: 'hp'; who: string; hp: number }
  | { op: 'status'; who: string; id: StatusId | null }
  | { op: 'win' }
  | { op: 'lose' };

export type BattleContextKind =
  | { kind: 'karate'; tier: number; nubbinId: string }
  | { kind: 'party'; tier: number; ids: string[] }
  /** The turn-based dojo singles (recs FIGHT-28): one Nubbin, or a party of up to three. */
  | {
      kind: 'dojo';
      tier: number;
      ids: string[];
      /** The Dojo Ladder (recs FIGHT-99): the belt being climbed, 1 (white) to 5 (black). */
      ladder?: number;
    }
  /** A story's own bout (FIGHT-29): Logged In's 3v3 against the digital foes. */
  | { kind: 'story'; storyline: 'logged'; tier: number; ids: string[] }
  /**
   * A bout inside a story world (FIGHT-98): fought by copies in a cloned Grove (`world-bout.ts`),
   * its result kept only in that world's side save. Never started through `battleStart`.
   */
  | {
      kind: 'world';
      world: 'atlas' | 'arcade' | 'multiverse' | 'neopia';
      /** The page, cartridge or line whose progress keeps the result. */
      line: string;
      key: string;
      tier: number;
      ids: string[];
      /** The page's own foes; absent = the world's tone pack. */
      foes?: { species: string; level: number }[];
      /** A reward id for the line's rewards on a win. */
      reward?: string;
      /**
       * A survive bout (FUN-51): standing after this many turns wins; a loss is a draw for the
       * story. `boss` names the lone foe; `barks` are a guide's lines, one at each turn's start.
       */
      survive?: number;
      boss?: string;
      barks?: string[];
    }
  /**
   * Pass-and-play (FIGHT-96): a second Keeper on the same device plays `foeIds` (the slot's
   * own Nubbins) or `guests` (share codes, read-only copies). No prizes but a sticker.
   */
  | { kind: 'friendly'; tier: number; ids: string[]; foeIds?: string[]; guests?: string[] }
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
  | { k: 'strike'; target?: string; swing?: boolean; timing?: Timing }
  /** Catch your breath: +4 Puff and Guard ×1.3 this turn. */
  | { k: 'guard' }
  /** Huddle: heal the side a little. */
  | { k: 'rally' }
  /** Any move the combatant has, by id. */
  | { k: 'move'; move: string; target?: string; timing?: Timing }
  /** Singles: bring a benched Nubbin in (priority +3), or pick the next after a tuck-in. */
  | { k: 'swap'; to: string }
  /** Use a battle item on an ally (fruit) or a foe (a toy, or a snack offered to a wild one). */
  | { k: 'item'; item: BattleItemId; target?: string }
  /** Timed bout: a tap at bout time `atMs`. */
  | { k: 'tap'; atMs: number }
  /** Timed bout: let the clock run to `toMs` (the rival keeps striking). */
  | { k: 'advance'; toMs: number }
  /** ATB: the Keeper calls out an order (to one ally by id, else the first on the field). */
  | { k: 'order'; cmd: AtbCommand; who?: string }
  /** ATB: stop or restart the clock (the hidden tab, or the Item sheet being open). */
  | { k: 'pause'; why: AtbPause; on: boolean }
  /** Doubles (FIGHT-95): two partners with a strong bond fuse for three turns, once a bout. */
  | { k: 'fuse' }
  /** The debug panel's battle tools (recs FIGHT-80); never sent by the battle screen. */
  | { k: 'debug'; set: BattleDebugOp };

/**
 * The optional timing ring on a Bonk-kind move (recs FIGHT-87): `sweet` hits ×1.2, `plain` is
 * a missed or skipped tap (×1). `steady` is the "Steady hands" setting (FIGHT-79): no ring, a
 * fixed ×1.1. Kept on the action, so a replay repeats it.
 */
export type Timing = 'sweet' | 'plain' | 'steady';

/** The four ATB command buttons (recs FIGHT-40). */
export type AtbCommand = 'go' | 'careful' | 'switch' | 'back';
export const ATB_COMMANDS: readonly AtbCommand[] = ['go', 'careful', 'switch', 'back'];
export type AtbPause = 'hidden' | 'items';
/** What a Nubbin does instead of an order it ignores, by personality. */
export type AtbGag = 'sit' | 'raspberry' | 'hide' | 'wave';

/** The ATB clock (recs FIGHT-40, FIGHT-41); present only on an ATB bout. */
export interface AtbClock {
  /** ATB time: moves only in ticks from the live sim step, never while paused. */
  timeMs: number;
  /** Step time not yet spent on a whole tick. */
  accMs: number;
  /** 0..100 per combatant id; acts at 100. */
  gauge: Record<string, number>;
  /** ATB time each command button is ready again. */
  ready: Partial<Record<AtbCommand, number>>;
  /** Obeyed orders waiting for that ally's next turn. */
  orders: Record<string, AtbCommand>;
  /** Affection and trust read from the Nubbins at the start, for obedience. */
  bond: Record<string, { affection: number; trust: number }>;
  /** Why the clock is stopped; empty or absent = running. */
  paused?: Partial<Record<AtbPause, true>>;
}

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
  /** ATB: an order called out, and whether the Nubbin listened. */
  | { k: 'order'; who: string; cmd: AtbCommand; obeyed: boolean }
  /** ATB: the personality gag on an ignored order. */
  | { k: 'gag'; who: string; gag: AtbGag }
  /** Slapstick (FUN-74): a move fumbled, no harm done. */
  | { k: 'fumble'; who: string }
  /** A story world's guide calls out (FUN-51): plain text, kept in the bout's own log. */
  | { k: 'bark'; text: string }
  /** Fusion burst (FIGHT-95): a pair fused (`on`) or split again. */
  | { k: 'fusion'; who: string; of: [string, string]; on: boolean }
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
  /** Doubles (recs FIGHT-60): two a side, all on the field; spread moves hit at ×0.75 each. */
  doubles?: boolean;
  /** The ATB "Command" bout (recs FIGHT-40): `mode` stays 'turn' so records and views work. */
  atb?: AtbClock;
  /** Pass-and-play (FIGHT-96): both sides are played by hand; `choosing` is whose picks are next. */
  passPlay?: { choosing: SideIx };
  /** Fusion burst (FIGHT-95): the partner pair that may fuse, and whether it has. */
  fusable?: { pair: [string, string]; used: boolean };
  /** What the finished bout gave (the `battleSpoils` event's copy), for the results card. */
  spoils?: BoutSpoils;
}
