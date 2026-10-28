/**
 * The battle core's data. A `BattleState` is plain JSON: it goes into the save as
 * `world.battle`, and seed plus the list of actions replays it exactly. The random generator
 * lives only as `rngState`. Nothing here holds player-facing text: foes carry a name slot that
 * `config/strings-battle.ts` turns into a name, and the log holds events, not sentences.
 */

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
  power: number;
  dodge: number;
  guard: boolean;
}

/** Where a bout comes from; it picks the rules, the rivals and the prize table. */
export type BattleContext =
  | { kind: 'karate'; tier: number; nubbinId: string }
  | { kind: 'party'; tier: number; ids: string[] }
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
      foes: { species: string; level: number }[];
    };

export type BattleMode = 'turn' | 'karate';

/** What a combatant (or the Keeper, for the timed bout) does. */
export type BattleAction =
  | { k: 'strike'; target?: string }
  | { k: 'guard' }
  | { k: 'rally' }
  /** Timed bout: a tap at bout time `atMs`. */
  | { k: 'tap'; atMs: number }
  /** Timed bout: let the clock run to `toMs` (the rival keeps striking). */
  | { k: 'advance'; toMs: number };

export type BattleEvent =
  | { k: 'hit'; by: string; to: string; dmg: number; strong: boolean; guarded: boolean }
  | { k: 'miss'; by: string; to: string }
  | { k: 'guard'; by: string }
  | { k: 'rally'; by: string; heal: number }
  /** HP reached 0: an ally naps under a leaf blanket, a rival yawns and toddles home. */
  | { k: 'tuckered'; who: string; side: SideIx }
  | { k: 'round'; n: number }
  | { k: 'end'; winner: SideIx | null; reason: BattleEndReason };

export type BattleEndReason = 'tuckered' | 'forfeit' | 'time';

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
  v: 1;
  mode: BattleMode;
  seed: number;
  rngState: number;
  sides: [Combatant[], Combatant[]];
  /** Round number, from 1. */
  turn: number;
  /** Index into side 0 of the ally choosing next (turn mode). */
  active: number;
  phase: 'choose' | 'done';
  log: BattleEvent[];
  result: BattleResult | null;
  context: BattleContext;
  /** Timed bout only. */
  karate?: KarateClock;
  /** Set once the sim has paid the prize, so a result is never paid twice. */
  settled?: boolean;
}
