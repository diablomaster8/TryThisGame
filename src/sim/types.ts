import type { EduAge, EduGameId } from '../config/edu';
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
  | 'avoid'
  | 'lesson'
  | 'perform'
  | 'shelter'
  | 'court'
  | 'fetch'
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
  /** Species id (see sim/species.ts); 'chao' is the original line. */
  species: string;
  /** The baby species this line started as; rebirth returns to it. */
  lineage: string;
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
  /** 0..100: how safe it feels with its Keeper (sim/trust.ts). */
  trust: number;
  /** Jaded by mistreatment: wary, dark-coated, for life. */
  shadow: boolean;
  /** A Shadow Nubbin that learned to love again. */
  bond: boolean;
  /** Came back from running away and has not been taken in yet. */
  stray: boolean;
  /** Sim time trust fell to rock bottom, or -1. */
  lowTrustSinceMs: number;
  /** Kindergarten lessons learned: 0..3 per lesson. */
  lessons: Record<string, number>;
  /** Breeding: fed a heart fruit, looking for a partner until this sim time. */
  courtingUntilMs: number;
  /** Ids of the parents when bred, else null. */
  parents: [string, string] | null;
  generation: number;
  /** Karate bouts. */
  karate: { wins: number; losses: number; belt: number };
  /** Friendship with other Nubbins, by id. */
  friends: Record<string, number>;
  /** Accessories: a dyed scarf and glasses; a dyed hat. */
  scarf: DyeColor | null;
  glasses: boolean;
  hatDye: DyeColor | null;
  /** Care slips (sim/slips.ts): the last few, the lifetime count, and the running timers. */
  slips: Array<{ kind: SlipKind; atMs: number }>;
  slipCount: number;
  slipTimers?: Partial<Record<SlipKind, number>>;
  wellRaised: boolean;
  moody: 'grumpy' | 'sleepy' | null;
  /** What the next rebirth keeps (sim/inheritance.ts). */
  memory: Memory;
  /** Past lives, newest last. */
  ancestry: string[];
  heirloom: boolean;
  lastPetMs: number;
  lastShakeMs: number;
  // Future fields (v2), empty by default so no migration is needed later.
  genes: Record<string, unknown>;
  skills: Record<string, unknown>;
  karateRecord: Record<string, unknown>;
}

export type ItemKind = 'fruit' | 'toy' | 'notebook';

export interface Item {
  id: string;
  kind: ItemKind;
  pos: Vec2;
  y: number;
  vel: { x: number; y: number; z: number };
  /** Toys: which toy. */
  toy?: ToyKind;
  /** Fruit: a stat or alignment flavour, or plain. */
  flavor?: Flavor;
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
  /** Running: faster movement (Shift, or the Run toggle). */
  running: boolean;
}

/** Extra ways to interact with a Nubbin beyond pet, feed and carry. */
export type Interaction = 'tickle' | 'hug' | 'groom' | 'tuckIn' | 'praise' | 'highFive';

export type KeeperIntent =
  | { kind: 'pet'; nubbinId: string }
  | { kind: 'pickUp'; nubbinId: string }
  | { kind: 'feed'; nubbinId: string }
  | { kind: 'shakeTree'; treeId: string }
  | { kind: 'collect'; itemId: string }
  | { kind: 'interact'; nubbinId: string; action: Interaction }
  | { kind: 'heartFruit'; nubbinId: string };

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
  music: boolean;
  /** 0..1 */
  musicVolume: number;
  sfxVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  screenShake: boolean;
  particles: 'full' | 'light' | 'off';
  /** Override the system reduced-motion preference. */
  reducedMotion: 'system' | 'on' | 'off';
  /** Jukebox: a fixed piece, or null for the automatic score. */
  jukebox: string | null;
  /** Ambient sounds (birds, crickets, rain, the stream). */
  ambience: boolean;
  /** How the Grove is drawn: the pixel-art scene or the full-3D scene. */
  graphics: GraphicsMode;
  /**
   * The 3D mode's sculpt grid for this device (a torso resolution, 48 to 104), picked by
   * a benchmark the first time the 3D mode opens; null until then.
   */
  sculptRes: number | null;
}

/** The two renderers; the save mirrors the device-wide choice made on the title screen. */
export type GraphicsMode = 'pixel' | '3d';

export interface Inventory {
  shells: number;
  fruit: number;
  critters: Record<string, number>;
  essences: Record<string, number>;
  /** Hat ids owned; wearing them is M5. */
  hats: string[];
  heartFruit: number;
  /** Decorations bought and not yet placed. */
  decor: Partial<Record<DecorKind, number>>;
  /** Gathered materials for the workshop. */
  wood: number;
  stone: number;
  reeds: number;
  /** Seeds by flavour, from Expeditions and harvests. */
  seeds: Partial<Record<Flavor, number>>;
  /** Dyes from the workshop. */
  dyes: Partial<Record<DyeColor, number>>;
  /** Toys bought and not yet placed. */
  toys: Partial<Record<ToyKind, number>>;
  /** Twine for merging partners. */
  twine: number;
}

/** Stat fruit and seeds: one per stat, plus Sun and Moon fruit that nudge alignment. */
export type Flavor = 'swim' | 'fly' | 'run' | 'power' | 'stamina' | 'sun' | 'moon';
export const FLAVORS: readonly Flavor[] = ['swim', 'fly', 'run', 'power', 'stamina', 'sun', 'moon'];

export type ToyKind = 'ball' | 'radio' | 'blocks' | 'mirror' | 'tv';
export type DyeColor = 'rose' | 'sky' | 'mint' | 'gold' | 'violet' | 'ember';
export type TileKind = 'grass' | 'dirt' | 'water' | 'flowers' | 'stone';
export type HabitatKind = 'meadow' | 'rocky' | 'water' | 'thicket';

/** A planted tree or crop row. */
export interface Plant {
  id: string;
  kind: 'tree' | 'crop';
  flavor: Flavor;
  pos: Vec2;
  plantedMs: number;
  /** 0..1, drops in dry spells; rain or a tap refills it. */
  water: number;
  /** 0 seed, 1 sprout, 2 young, 3 grown. */
  stage: number;
  /** Grown: ms until the next fruit. */
  fruitTimerMs: number;
  /** Crops: ready to harvest. */
  ripe: boolean;
}

export interface Quest {
  id: string;
  template: string;
  /** Who asked: a trainer id or a Nubbin name. */
  from: string;
  param: string | null;
  target: number;
  progress: number;
  rewardShells: number;
  rewardEgg: boolean;
  claimed: boolean;
}

/** A wild creature drawn to a habitat patch; it settles after enough visits. */
export interface WildVisitor {
  id: string;
  species: string;
  patch: HabitatKind;
  pos: Vec2;
  visits: number;
  /** Sim time this visit ends. */
  untilMs: number;
  fed: boolean;
}

export type SlipKind = 'hungry' | 'sleepy' | 'lonely' | 'wet';
export type Memory = 'grade' | 'part' | 'lesson' | 'accessory';
export type TownRole = 'stall' | 'gym' | 'attendant' | 'fortune' | 'festival' | 'guard';
export interface TownState {
  prosperity: number;
  recruits: Array<{ name: string; species: string; role: TownRole; atMs: number }>;
}
export type TeamId = 'dawn' | 'dusk' | 'dew';
export interface TeamState {
  id: TeamId;
  rank: number;
  points: number;
  week: string;
  mission: { kind: string; target: number; progress: number; done: boolean } | null;
}

/** Educational mode (sim/edu.ts). Null outside it. */
export interface EduState {
  age: EduAge;
  /** Which games are switched on; starts as the recommended set for the age. */
  games: Record<EduGameId, boolean>;
  sessionMinutes: number;
  /** The child's name, for the letter games. */
  childName: string;
  progress: Record<EduGameId, { plays: number; stars: number }>;
  stickers: number;
  /** Live play time this session, toward the break screen. */
  playedMs: number;
}

export interface CoopState {
  active: boolean;
  trainer: string;
}

/** What an Expedition brings home. */
export interface Rewards {
  shells: number;
  essences: Partial<Record<NubbinType, number>>;
  critters: Record<string, number>;
  /** Seeds for the orchard, by flavour. */
  seeds?: Partial<Record<Flavor, number>>;
}

export type ShopItem = 'fruit' | 'egg' | 'hat' | 'toy' | 'heartFruit' | 'twine';

export interface Memorial {
  id: string;
  name: string;
  pos: Vec2;
  /** Remembered for the memorial card. */
  species?: string;
  form?: string;
  ageMs?: number;
  rebirths?: number;
  eggColor?: string;
  departedAtMs?: number;
}

export type WeatherKind = 'clear' | 'rain' | 'snow';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Weather {
  kind: WeatherKind;
  /** Sim time the current weather ends. */
  untilMs: number;
  /** 0..1 */
  intensity: number;
}

export type DecorKind =
  | 'fence'
  | 'flowerbed'
  | 'bench'
  | 'statue'
  | 'pathTile'
  | 'lanternSmall'
  | 'nursery'
  | 'bathhouse'
  | 'workshop'
  | 'rockPile'
  | 'thicket';

export interface PlacedDecor {
  id: string;
  kind: DecorKind;
  pos: Vec2;
}

/** The home Grove, the story places, or a neighbour's Grove (`visit:<trainer>`). */
export type Location = 'grove' | 'hollow' | 'corvin' | 'dungeon' | `visit:${string}`;

/** What lies on a Hollow floor. */
export type DungeonLootKind = 'shells' | 'stone' | 'seed' | 'essence' | 'critter' | 'egg';

/** A Shadow stray wandering a Hollow floor. */
export interface DungeonStray {
  id: string;
  pos: Vec2;
  target: Vec2 | null;
  /** Fleeing after a snatch while this counts down. */
  cooldownMs: number;
}

/** A wild creature in a nook; walking up to it fills its scan. */
export interface DungeonWild {
  id: string;
  species: string;
  pos: Vec2;
  scanned: boolean;
}

/** One run into the Hollow Below; the floor itself comes from the seed and depth. */
export interface DungeonRun {
  seed: number;
  depth: number;
  /** The day key when this is today's shared Hollow, else null. */
  daily: string | null;
  /** Nubbin ids that came along. */
  party: string[];
  returnKeeper: Vec2;
  returnParty: Record<string, Vec2>;
  /** Loot ids picked up on this floor. */
  taken: string[];
  chestOpen: boolean;
  strays: DungeonStray[];
  wild: DungeonWild[];
  /** 'up', 'down', 'chest' or 'stray:<id>': used on arrival at `pendingPos`. */
  pending: string | null;
  pendingPos: Vec2 | null;
  /** Which loot each party Nubbin is fetching. */
  fetch: Record<string, string>;
  haul: { shells: number; items: number };
  startedMs: number;
}

export type LessonId = 'drawing' | 'singing' | 'dance' | 'instrument';

/** A Nubbin that ran away; it comes back to the Grove edge later. */
export interface Stray {
  nubbin: Nubbin;
  leftAtMs: number;
  returnsAtMs: number;
}

/** A visiting Keeper walking the Grove during the campaign. */
export interface Npc {
  id: string;
  trainer: string;
  pos: Vec2;
  facing: number;
  target: Vec2 | null;
  waitMs: number;
  home: Vec2;
}

export interface CampaignStats {
  pets: number;
  feeds: number;
  throws: number;
  hatched: number;
  evolved: number;
  reborn: number;
  departed: number;
  races: number;
  expeditions: number;
  lanterns: number;
  talks: number;
}

/** Campaign progress (sim/campaign.ts). Null outside the campaign. */
export interface CampaignState {
  /** 1..12 while playing; 13 once an ending has played. */
  chapter: number;
  /** Steps completed within the chapter. */
  step: number;
  flags: Record<string, number | boolean | string>;
  /** Friendship per Keeper id. */
  friendship: Record<string, number>;
  /** Scenes waiting to be shown, in order. */
  queue: string[];
  seen: string[];
  chapterStartMs: number;
  ending: string | null;
  /** The Shadow Nubbin from chapter 3, and the Eternal elder. */
  sableId: string | null;
  mossId: string | null;
  stats: CampaignStats;
  /** Side stories the runner drives (sim/side-stories.ts), by quest id. */
  side: Record<string, SideStoryState>;
  /** Chapter 10's timed vigil; null until it starts. */
  vigil: VigilState | null;
  /** Sim time the current chapter's opening was seen, and its goal first seen met. */
  openedMs: number | null;
  goalMetMs: number | null;
}

/** One side story's progress. Steps are 0-based indexes into the quest's steps. */
export interface SideStoryState {
  status: 'open' | 'done' | 'closed';
  step: number;
  /**
   * wait: the step's scene waits for its gate; scene: it is queued; check: waiting for
   * the step's check; done: the done scene is queued; complete: the complete scene is.
   */
  stage: 'wait' | 'scene' | 'check' | 'done' | 'complete';
  /** The scene id (after variant choice) the stage waits on. */
  pending: string | null;
  /** Sim time the story opened, and the time the current stage began. */
  openedMs: number;
  sinceMs: number;
  /** The Keeper did the step's action (the journal's "do it" for checks the sim can't watch). */
  acted: boolean;
}

/** Hold the four lanterns until dawn: progress only runs while all four are lit. */
export interface VigilState {
  progressMs: number;
  /** Waves of cold already through (each blows a lantern out). */
  waves: number;
  lull: boolean;
  done: boolean;
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
  /** The active trainer (playable Keeper), see sim/trainers.ts. */
  trainer: string;
  nextId: number;
  /** Id of the Nubbin the player has selected, or null. */
  selected: string | null;
  strays: Stray[];
  npcs: Npc[];
  campaign: CampaignState | null;
  weather: Weather;
  /** From the real calendar, updated each live step. */
  season: Season;
  placed: PlacedDecor[];
  /** Collection book: species ids and Chao form keys, with the sim time first seen. */
  seen: Record<string, number>;
  /** Daily visits: the last real day (YYYY-MM-DD) a Keeper came by. */
  visits: { lastDay: string; count: number };
  location: Location;
  /** Karate belts won per tier. */
  karate: { belt: number; wins: number; losses: number };
  plants: Plant[];
  /** Painted tiles by "x,z" at half-unit snaps. */
  tiles: Record<string, TileKind>;
  achievements: Record<string, number>;
  /** Keeper title shown on the profile. */
  title: string | null;
  quests: Quest[];
  questDay: string;
  /** Extra garden plots bought: each adds roster room. */
  plots: number;
  wild: WildVisitor[];
  landmarks: Record<string, number>;
  coop: CoopState;
  keeper2: Keeper | null;
  edu: EduState | null;
  town: TownState;
  partners: [string | null, string | null];
  merge: { a: string; b: string; untilMs: number } | null;
  skillPoints: number;
  skills: Record<string, boolean>;
  /** Scan progress per species (sim/scans.ts). */
  scans: Record<string, number>;
  team: TeamState | null;
  /** Curfew by the real clock. */
  night: boolean;
  tank: { runs: number; best: number };
  /** The Hollow Below: the current run, if inside. */
  dungeon: DungeonRun | null;
  hollow: { runs: number; best: number; dailyDay: string; dailyDepth: number };
  /** Per neighbour: the last real day a gift was taken. */
  neighbours: Record<string, { lastGiftDay: string }>;
  /** Festival banner shown for this season already. */
  festivalSeen: string;
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
  | { kind: 'setTrainer'; id: string }
  | { kind: 'setGrove'; grove: GroveKind }
  | { kind: 'giveCritter'; nubbinId: string; species: string }
  | { kind: 'giveEssence'; nubbinId: string; type: NubbinType }
  | { kind: 'addRewards'; rewards: Rewards }
  | { kind: 'buy'; item: ShopItem }
  | {
      kind: 'raceResult';
      nubbinId: string;
      course: string;
      tier: number;
      placement: number;
      shells: number;
      hat: string | null;
      /** The best rival, to recruit on a win. */
      rival?: { name: string; species: string };
    }
  | { kind: 'wearHat'; nubbinId: string; hat: string | null }
  | { kind: 'setSettings'; settings: Settings }
  | { kind: 'rename'; nubbinId: string; name: string }
  // Debug
  | { kind: 'debugGive'; what: 'shells' | 'fruit' | 'critter' | 'essence' | 'egg'; amount: number }
  | { kind: 'debugFillNeeds'; nubbinId: string }
  | { kind: 'debugForceEvolve'; nubbinId: string }
  | { kind: 'debugForceEndOfLife'; nubbinId: string }
  | { kind: 'debugHatchNow'; nubbinId: string }
  | { kind: 'campaignStart' }
  | { kind: 'sceneDone'; scene: string; choice: string | null }
  | { kind: 'talk'; npcId: string }
  | { kind: 'lightLantern'; id: string }
  | { kind: 'debugChapter'; chapter: number }
  /** Do the current step of a side story (journal button; see sim/side-stories.ts). */
  | { kind: 'sideAct'; story: string }
  | { kind: 'giveHeartFruit'; nubbinId: string }
  | { kind: 'startLesson'; nubbinId: string; lesson: LessonId }
  | { kind: 'payService'; service: 'doctor' | 'fortune'; nubbinId: string }
  | { kind: 'buyDecor'; decor: DecorKind }
  | { kind: 'placeDecor'; decor: DecorKind; pos: Vec2 }
  | { kind: 'removeDecor'; id: string }
  | {
      kind: 'karateResult';
      nubbinId: string;
      won: boolean;
      tier: number;
      shells: number;
      rival?: { name: string; species: string };
    }
  | { kind: 'receiveNubbin'; nubbin: Nubbin }
  | { kind: 'tradeAway'; nubbinId: string }
  | { kind: 'setLocation'; location: Location }
  | { kind: 'debugWeather'; weather: WeatherKind }
  | { kind: 'interact'; nubbinId: string; action: Interaction }
  /** Whistle: the named Nubbin (or everyone) comes to the Keeper. */
  | { kind: 'call'; nubbinId: string | null }
  /** Throw the ball for a Nubbin to fetch. */
  | { kind: 'playCatch'; nubbinId: string }
  | { kind: 'setRunning'; running: boolean }
  // Orchards and crops
  | { kind: 'plant'; plantKind: 'tree' | 'crop'; flavor: Flavor; pos: Vec2 }
  | { kind: 'waterPlant'; id: string }
  | { kind: 'harvest'; id: string }
  // Toys, tiles, crafting, gathering
  | { kind: 'buyToy'; toy: ToyKind }
  | { kind: 'placeToy'; toy: ToyKind; pos: Vec2 }
  | { kind: 'paintTile'; pos: Vec2; tile: TileKind }
  | { kind: 'craft'; recipe: string }
  | { kind: 'gather'; what: 'stone' | 'reeds' }
  | { kind: 'buyPlot' }
  // Keeper and friends
  | { kind: 'setTitle'; title: string | null }
  | { kind: 'claimQuest'; id: string }
  | { kind: 'visit'; trainer: string | null }
  | { kind: 'neighbourGift' }
  | { kind: 'feedWild'; id: string }
  | { kind: 'dye'; nubbinId: string; slot: 'hat' | 'scarf'; color: DyeColor | null }
  | { kind: 'wearGlasses'; nubbinId: string; on: boolean }
  | { kind: 'setCoop'; active: boolean; trainer: string }
  | { kind: 'keeper2Input'; input: Vec2 }
  | { kind: 'keeper2Act'; action: 'pet' | 'feed' }
  | { kind: 'teleport'; pos: Vec2 }
  | { kind: 'photoTaken'; species: string }
  // Educational mode
  | { kind: 'eduStart'; age: EduAge }
  | { kind: 'eduSetAge'; age: EduAge; resetGames: boolean }
  | { kind: 'eduSetGame'; game: EduGameId; on: boolean }
  | { kind: 'eduSetSession'; minutes: number }
  | { kind: 'eduSetName'; name: string }
  | { kind: 'eduResult'; game: EduGameId; stars: number }
  | { kind: 'eduResetSession' }
  // The Digimon-inspired ten
  | { kind: 'setPartner'; slot: 0 | 1; nubbinId: string | null }
  | { kind: 'merge' }
  | { kind: 'trainResult'; nubbinId: string; stat: StatKey; hits: number }
  | { kind: 'setMemory'; nubbinId: string; memory: Memory }
  | { kind: 'buySkill'; id: string }
  | { kind: 'convertScan'; species: string }
  | { kind: 'joinTeam'; team: TeamId }
  | { kind: 'tankResult'; shells: number; wood: number; stone: number; won: boolean }
  | { kind: 'enterDungeon'; daily: boolean }
  | { kind: 'leaveDungeon' }
  | { kind: 'dungeonGo'; to: 'up' | 'down' | 'chest' }
  | { kind: 'feedStray'; id: string }
  | { kind: 'recruit'; name: string; species: string };

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
      /** The species after evolving (unchanged for the Chao line). */
      species: string;
    }
  | { kind: 'secondEvolved'; nubbinId: string; second: NubbinType; species: string }
  /** A hatchling grew into its next baby form, or a champion took its final form. */
  | { kind: 'speciesGrew'; nubbinId: string; species: string }
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
  | { kind: 'rewards'; rewards: Rewards }
  | { kind: 'turnedShadow'; nubbinId: string }
  | { kind: 'shadowBonded'; nubbinId: string }
  | { kind: 'ranAway'; nubbinId: string; name: string }
  | { kind: 'strayReturned'; nubbinId: string; name: string }
  | { kind: 'scene'; scene: string }
  | { kind: 'chapter'; chapter: number }
  | { kind: 'ending'; ending: string }
  | { kind: 'lanternLit'; id: string }
  | { kind: 'lanternOut'; id: string }
  | { kind: 'sideStory'; story: string; status: 'open' | 'done' | 'closed' }
  | { kind: 'talked'; npcId: string }
  | { kind: 'courting'; nubbinId: string }
  | { kind: 'bred'; eggId: string; parents: [string, string] }
  | { kind: 'lessonStarted'; nubbinId: string; lesson: LessonId }
  | { kind: 'lessonDone'; nubbinId: string; lesson: LessonId; level: number }
  | { kind: 'service'; service: 'doctor' | 'fortune'; nubbinId: string; ok: boolean }
  | { kind: 'weather'; weather: WeatherKind }
  | { kind: 'visitor'; trainer: string; gift: 'shells' | 'fruit' | 'egg' | 'heartFruit' }
  | { kind: 'lanternNight' }
  | { kind: 'decorPlaced'; id: string; decor: DecorKind }
  | { kind: 'decorBought'; decor: DecorKind; ok: boolean }
  | { kind: 'firstSeen'; key: string }
  | { kind: 'traded'; name: string }
  | { kind: 'received'; name: string; ok: boolean }
  | { kind: 'karate'; nubbinId: string; won: boolean; belt: number }
  | { kind: 'located'; location: Location }
  | { kind: 'interacted'; nubbinId: string; action: Interaction; ok: boolean }
  | { kind: 'called'; count: number }
  | { kind: 'fetching'; nubbinId: string }
  | { kind: 'planted'; id: string; flavor: Flavor; plantKind: 'tree' | 'crop' }
  | { kind: 'watered'; id: string }
  | { kind: 'harvested'; id: string; flavor: Flavor; count: number }
  | { kind: 'plantGrew'; id: string; stage: number }
  | { kind: 'tilePainted'; tile: TileKind }
  | { kind: 'crafted'; recipe: string; ok: boolean }
  | { kind: 'gathered'; what: 'wood' | 'stone' | 'reeds'; count: number }
  | { kind: 'toyPlaced'; toy: ToyKind }
  | { kind: 'plotBought'; plots: number; ok: boolean }
  | { kind: 'achievement'; id: string; shells: number }
  | { kind: 'questDone'; id: string }
  | { kind: 'questClaimed'; id: string; shells: number; egg: boolean }
  | { kind: 'questsRefreshed' }
  | { kind: 'friendsMade'; a: string; b: string }
  | { kind: 'wildArrived'; id: string; species: string; patch: HabitatKind }
  | { kind: 'wildSettled'; species: string; nubbinId: string }
  | { kind: 'wildLeft'; id: string }
  | { kind: 'wildFed'; id: string }
  | { kind: 'visiting'; trainer: string | null }
  | { kind: 'neighbourGift'; trainer: string; shells: number; ok: boolean }
  | { kind: 'landmarkFound'; id: string }
  | { kind: 'festival'; season: Season }
  | { kind: 'sledding'; nubbinId: string }
  | { kind: 'dyed'; nubbinId: string; slot: 'hat' | 'scarf' }
  | { kind: 'coop'; active: boolean }
  | { kind: 'eduStarted'; age: EduAge }
  | { kind: 'eduResult'; game: EduGameId; stars: number; sticker: boolean }
  | { kind: 'recruited'; name: string; role: TownRole; prosperity: number }
  | { kind: 'townGrew'; unlock: string; prosperity: number }
  | { kind: 'slip'; nubbinId: string; slip: SlipKind }
  | { kind: 'trained'; nubbinId: string; stat: StatKey; points: number; rested: boolean }
  | { kind: 'merged'; a: string; b: string }
  | { kind: 'unmerged'; a: string; b: string }
  | { kind: 'curfew'; night: boolean }
  | { kind: 'skillBought'; id: string }
  | { kind: 'scanFull'; species: string }
  | { kind: 'converted'; species: string; nubbinId: string }
  | { kind: 'teamJoined'; team: TeamId }
  | { kind: 'missionDone'; team: TeamId; points: number }
  | { kind: 'raceWon'; nubbinId: string; course: string; tier: number }
  | { kind: 'tankDone'; shells: number; wood: number; stone: number; won: boolean }
  | { kind: 'dungeonEntered'; depth: number; daily: boolean }
  | { kind: 'dungeonLeft'; depth: number; shells: number; items: number }
  | { kind: 'descended'; depth: number; daily: boolean }
  | {
      kind: 'dungeonFound';
      loot: DungeonLootKind;
      amount: number;
      param: string | null;
      /** The party Nubbin that found it, or null for the Keeper. */
      by: string | null;
    }
  | { kind: 'chestOpened'; shells: number; egg: boolean }
  | { kind: 'strayFed'; ok: boolean; name: string | null }
  | { kind: 'strayStartled'; shells: number }
  | { kind: 'wildScanned'; species: string }
  | { kind: 'wellRaised'; nubbinId: string };

export interface AwayReport {
  elapsedMs: number;
  simulatedMs: number;
  mode: OfflineMode;
  events: SimEvent[];
}
