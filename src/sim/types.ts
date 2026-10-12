// Game state types. Plain data only: everything here must survive JSON round-trips.

export interface Vec2 {
  x: number;
  z: number;
}

export type StatKey = 'swim' | 'fly' | 'run' | 'power' | 'stamina';
export const STAT_KEYS: readonly StatKey[] = ['swim', 'fly', 'run', 'power', 'stamina'];

export type Grade = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export const GRADES: readonly Grade[] = ['E', 'D', 'C', 'B', 'A', 'S'];

export type NubbinType = 'normal' | 'swim' | 'fly' | 'run' | 'power';
export const NUBBIN_TYPES: readonly NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];

export type AlignmentBand = 'sun' | 'moon' | 'neutral';
export type KeeperAlignment = 'sun' | 'moon';

export type LifeStage = 'egg' | 'child' | 'cocoon' | 'adult';

/** Why a Nubbin is in a cocoon: growing up, being reborn, or moving on. */
export type CocoonKind = 'evolve' | 'rebirth' | 'depart';

export type Personality = 'cheerful' | 'shy' | 'mischievous' | 'lazy';

export type PartSlot = 'ears' | 'tail' | 'arms' | 'back';

export type BehaviorState =
  | 'wander'
  | 'findFood'
  | 'eat'
  | 'nap'
  | 'sit'
  | 'play'
  | 'greet'
  | 'cry'
  | 'swim'
  | 'react'
  | 'held'
  | 'carried'
  | 'thrown';

export type Reaction = 'happy' | 'sad' | 'surprised' | 'dizzy' | 'love' | 'confused';

export type Mood = 'content' | 'happy' | 'sad' | 'hungry' | 'sleepy' | 'dizzy';

export interface NubbinForm {
  band: AlignmentBand;
  type: NubbinType;
  /** Second evolution: the type trained most after evolving, or null before it happens. */
  second: NubbinType | null;
  /** Type lean snapshot at evolution, so the second evolution measures growth since. */
  leanAtEvolution: Record<NubbinType, number>;
}

export type GroveKind = 'main' | 'sun' | 'moon';

export interface StatBlock {
  points: number;
  grade: Grade;
}

export interface Needs {
  /** 1 = full, 0 = starving. */
  hunger: number;
  /** 1 = rested, 0 = exhausted. */
  energy: number;
  /** -100..100 */
  happiness: number;
  /** 0..100 */
  affection: number;
}

export interface Behavior {
  state: BehaviorState;
  /** Sim time the state started. */
  sinceMs: number;
  /** When the state should end, if timed. */
  untilMs: number;
  /** Walk target, if any. */
  target: Vec2 | null;
  /** Item id being sought or eaten. */
  itemId: string | null;
  reaction: Reaction | null;
}

export interface Nubbin {
  id: string;
  name: string;
  seed: number;
  stage: LifeStage;
  /** Time spent in the current stage. */
  stageMs: number;
  /** Set while in a cocoon. */
  cocoonKind: CocoonKind | null;
  /** Lifetime age across stages, excluding egg time. */
  ageMs: number;
  /** Hatch countdown while an egg. */
  hatchRemainingMs: number;
  /** Egg colour; it becomes the Nubbin's body colour for life. 'plain' is the default look. */
  eggColor: string;
  /** Rare: extra highlights and a bright outline. */
  shiny: boolean;
  /** Two-tone: a second colour for the belly and tips, or null. */
  tone: string | null;
  pos: Vec2;
  /** Height above ground, for held and thrown Nubbins. */
  y: number;
  /** Air velocity while thrown. */
  vel: { x: number; y: number; z: number };
  /** Facing angle in radians around Y. */
  facing: number;
  behavior: Behavior;
  needs: Needs;
  /** For the lifetime average used by rebirth. */
  happinessSum: number;
  happinessSamples: number;
  stats: Record<StatKey, StatBlock>;
  typeLean: Record<NubbinType, number>;
  /** Hidden -1..1. */
  alignment: number;
  personality: Personality | null;
  /** How it was treated as a child; decides the personality at evolution. */
  childCare: { pets: number; throws: number; feeds: number };
  /** Set at evolution. */
  form: NubbinForm | null;
  /** Part ids from critters, e.g. "rabbit-ears". The newest critter wins a slot. */
  parts: Record<PartSlot, string | null>;
  hat: string | null;
  rebirths: number;
  /** Grades raised at evolution, kept across rebirths. */
  gradeUpgrades: Partial<Record<StatKey, number>>;
  eternal: AlignmentBand | null;
  /** Reached end of life while the player was away; check runs in live play. */
  awaitingKeeper: boolean;
  lastPetMs: number;
  lastShakeMs: number;
  // Future fields (v2), empty by default so no migration is needed later.
  genes: Record<string, unknown>;
  skills: Record<string, unknown>;
  karateRecord: Record<string, unknown>;
}

export type ItemKind = 'fruit' | 'toy';

export interface Item {
  id: string;
  kind: ItemKind;
  pos: Vec2;
  y: number;
  vel: { x: number; y: number; z: number };
}

export interface Tree {
  id: string;
  pos: Vec2;
  /** Countdown to the next fruit. */
  fruitTimerMs: number;
}

export interface Keeper {
  pos: Vec2;
  facing: number;
  alignment: KeeperAlignment;
  /** Walk target from a tap, if any. */
  moveTarget: Vec2 | null;
  /** Direct input from keys, -1..1 on each axis. */
  input: Vec2;
  /** Nubbin id carried above the head. */
  carrying: string | null;
  /** Pending interaction once the Keeper arrives. */
  intent: KeeperIntent | null;
}

export type KeeperIntent =
  | { kind: 'pet'; nubbinId: string }
  | { kind: 'pickUp'; nubbinId: string }
  | { kind: 'feed'; nubbinId: string }
  | { kind: 'shakeTree'; treeId: string }
  | { kind: 'collect'; itemId: string };

export type OfflineMode = 'indefinite' | 'capped' | 'off';

export interface OfflineAgingSettings {
  mode: OfflineMode;
  capHours: number;
  allowOfflineDepartures: boolean;
}

export interface Settings {
  offlineAging: OfflineAgingSettings;
  joystick: boolean;
  sound: boolean;
}

export interface Inventory {
  shells: number;
  fruit: number;
  critters: Record<string, number>;
  essences: Record<string, number>;
  /** Hat ids owned; wearing them is M5. */
  hats: string[];
}

/** What an Expedition brings home. */
export interface Rewards {
  shells: number;
  essences: Partial<Record<NubbinType, number>>;
  critters: Record<string, number>;
}

export type ShopItem = 'fruit' | 'egg' | 'hat' | 'toy';

export interface Memorial {
  id: string;
  name: string;
  pos: Vec2;
}

export interface World {
  seed: number;
  rngState: number;
  /** Sim time in ms since the world was created. */
  timeMs: number;
  /** Wall-clock time of the last live step, for offline catch-up. */
  lastWallMs: number;
  nubbins: Nubbin[];
  items: Item[];
  trees: Tree[];
  keeper: Keeper;
  inventory: Inventory;
  settings: Settings;
  memorials: Memorial[];
  unlocks: { sunGrove: boolean; moonGrove: boolean };
  /** Which Grove is shown. Sun and Moon are recolours, unlocked by the first adult of that band. */
  grove: GroveKind;
  /** Highest tier won per race course (0 = none). */
  races: Record<string, number>;
  nextId: number;
  /** Id of the Nubbin the player has selected, or null. */
  selected: string | null;
}

// ---------- commands (input → sim) ----------

export type Command =
  | { kind: 'moveKeeperTo'; pos: Vec2 }
  | { kind: 'keeperInput'; input: Vec2 }
  | { kind: 'select'; id: string | null }
  | { kind: 'pet'; nubbinId: string }
  | { kind: 'pickUp'; nubbinId: string }
  | { kind: 'putDown' }
  | { kind: 'feed'; nubbinId: string }
  | { kind: 'shakeTree'; treeId: string }
  | { kind: 'collect'; itemId: string }
  /** Pointer drag: lift a Nubbin straight off the ground. */
  | { kind: 'grab'; nubbinId: string }
  | { kind: 'drag'; pos: Vec2 }
  | { kind: 'shakeHeld' }
  | { kind: 'release'; vel: Vec2 }
  | { kind: 'switchKeeper'; alignment: KeeperAlignment }
  | { kind: 'setGrove'; grove: GroveKind }
  | { kind: 'giveCritter'; nubbinId: string; species: string }
  | { kind: 'giveEssence'; nubbinId: string; type: NubbinType }
  | { kind: 'addRewards'; rewards: Rewards }
  | { kind: 'buy'; item: ShopItem }
  | {
      kind: 'raceResult';
      course: string;
      tier: number;
      placement: number;
      shells: number;
      hat: string | null;
    }
  | { kind: 'wearHat'; nubbinId: string; hat: string | null }
  | { kind: 'setSettings'; settings: Settings }
  | { kind: 'rename'; nubbinId: string; name: string }
  // Debug
  | { kind: 'debugGive'; what: 'shells' | 'fruit' | 'critter' | 'essence' | 'egg'; amount: number }
  | { kind: 'debugFillNeeds'; nubbinId: string }
  | { kind: 'debugForceEvolve'; nubbinId: string }
  | { kind: 'debugForceEndOfLife'; nubbinId: string }
  | { kind: 'debugHatchNow'; nubbinId: string };

// ---------- events (sim → render/ui) ----------

export type SimEvent =
  | { kind: 'hatched'; nubbinId: string }
  | {
      kind: 'evolved';
      nubbinId: string;
      band: AlignmentBand;
      type: NubbinType;
      /** The stat whose grade went up, if any. */
      upgraded: StatKey | null;
      groveUnlocked: GroveKind | null;
    }
  | { kind: 'secondEvolved'; nubbinId: string; second: NubbinType }
  | { kind: 'cocoonStarted'; nubbinId: string; cocoon: CocoonKind }
  | { kind: 'eternal'; nubbinId: string; band: AlignmentBand }
  | { kind: 'awaitingKeeper'; nubbinId: string }
  | { kind: 'critterGiven'; nubbinId: string; species: string }
  | { kind: 'essenceGiven'; nubbinId: string; type: NubbinType }
  | { kind: 'reborn'; nubbinId: string }
  | { kind: 'departed'; nubbinId: string; name: string }
  | { kind: 'reaction'; nubbinId: string; reaction: Reaction }
  | { kind: 'fruitDropped'; treeId: string; itemId: string }
  | { kind: 'ate'; nubbinId: string }
  | { kind: 'napStarted'; nubbinId: string }
  | { kind: 'pickedUp'; nubbinId: string }
  | { kind: 'thrown'; nubbinId: string }
  | { kind: 'landed'; nubbinId: string }
  | { kind: 'collected'; itemId: string }
  | { kind: 'treeShaken'; treeId: string }
  | { kind: 'eggShaken'; nubbinId: string }
  | { kind: 'bought'; item: ShopItem; ok: boolean; reason: 'shells' | 'roster' | 'toys' | null }
  | { kind: 'rewards'; rewards: Rewards };

export interface AwayReport {
  elapsedMs: number;
  simulatedMs: number;
  mode: OfflineMode;
  events: SimEvent[];
}
