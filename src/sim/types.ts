import type { StoryBoutId } from './battle/story-bouts';
import type {
  BattleAction,
  BattleContext,
  BattleEndReason,
  BattleState,
  NubbinBattle,
} from './battle/types';
import type { CircuitState } from './battle/circuit';
import type { BattleOnceState, BoutSpoils } from './battle/rewards';
import type { NubbinCombat } from './battle/tactics/grid';
import type { TacticsAction, TacticsResult, TacticsState } from './battle/tactics/types';

/** Lane C: battle options kept in the save (all optional; recs FIGHT-19, -24, -26). */
export interface BattlePrefs {
  /** The last party picked, by Nubbin id (1–3). */
  party?: string[];
  /** Settings → "Gentle bouts" for anyone (always on in the Learning Grove). */
  gentle?: boolean;
  /** The battle playback speed. */
  speed?: 1 | 2;
}
import type { EduAge, EduGameId } from '../config/edu';
import type { EduBand } from '../content/types';
import type { LineAct } from '../config/story';
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

/**
 * R0401: the part slots added after the first four (legs, a horn on the forehead, a face
 * piece such as a beak, and wings apart from the back). They are optional on a Nubbin, so
 * saves from before them load unchanged.
 */
export type ExtraPartSlot = 'legs' | 'horn' | 'face' | 'wings';
export type AnyPartSlot = PartSlot | ExtraPartSlot;
export type NubbinParts = Record<PartSlot, string | null> &
  Partial<Record<ExtraPartSlot, string | null>>;

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
  /** Being petted: faces the Keeper and leans into the hand for a moment. */
  | 'pet'
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
  /** SOUL-01: the best distance to the walk target so far, when it was reached, and the start. */
  progress?: { d: number; atMs: number; d0: number };
  /** SOUL-01: a toy or fruit this Nubbin gave up walking to, skipped until skipItemUntilMs. */
  skipItemId?: string;
  skipItemUntilMs?: number;
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
  /** Lane E, R0399: a metal or glass egg finish (`sim/nubbin.ts` `finishOf`); absent is plain. */
  finish?: 'metal' | 'glass';
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
  /** Sim seconds sampled (the weight behind happinessSum), not a count of calls. */
  happinessSamples: number;
  stats: Record<StatKey, StatBlock>;
  typeLean: Record<NubbinType, number>;
  /** Hidden -1..1. */
  alignment: number;
  personality: Personality | null;
  /** How it was treated as a child; decides the personality at evolution. */
  childCare: {
    pets: number;
    throws: number;
    feeds: number;
    /** Lane C round 5 (recs FIGHT-73): bouts won and lost as a child; absent = 0. */
    boutWins?: number;
    boutLosses?: number;
  };
  /** Set at evolution. */
  form: NubbinForm | null;
  /** Part ids from critters, e.g. "rabbit-ears". The newest critter wins a slot. */
  parts: NubbinParts;
  hat: string | null;
  /** Lane E, R0394: live-play time left on the eggshell hat; absent once it is off. */
  shellMs?: number;
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
  /** Adult span multiplier for a storyline partner (S1); unset means 1. */
  spanScale?: number;
  lastPetMs: number;
  lastShakeMs: number;
  // Future fields (v2), empty by default so no migration is needed later.
  genes: Record<string, unknown>;
  skills: Record<string, unknown>;
  karateRecord: Record<string, unknown>;
  /** Lane C: known moves and the four slots (sim/battle/moves-sources.ts); set on first use. */
  battle?: NubbinBattle;
  /** Lane C: the tactical grid's Jump and Move (MOVE-61); reserved, empty by default. */
  combat?: NubbinCombat;
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
  /** Height of the feet (MOVE-10): the ground under them when grounded. */
  y: number;
  /** Vertical speed, units per second; up is positive. */
  vy: number;
  grounded: boolean;
  /** Jumps left before landing (the double jump). */
  airJumps: number;
  /** Time left to jump after walking off a ledge (coyote time), ms. */
  coyoteMs: number;
  /** Time left on a jump pressed just before landing (the buffer), ms. */
  bufferMs: number;
  /** The jump button is down: a held jump rises higher. */
  jumpHeld: boolean;
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

/** The "Mature content" setting: Off, 13+ (teen) or 18+ (adult). */
export type MatureContent = 'off' | 'teen' | 'adult';

export interface Settings {
  offlineAging: OfflineAgingSettings;
  /** Which quest audiences the main game offers. Off by default; never read in the Learning Grove. */
  matureContent: MatureContent;
  /** True once the player has confirmed their age at the Multiverse rift (one time only). */
  riftConfirmed: boolean;
  joystick: boolean;
  sound: boolean;
  music: boolean;
  /** 0..1 */
  musicVolume: number;
  sfxVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  screenShake: boolean;
  /** Floatier, more forgiving jumps (MOVE-11); a Learning Grove save always has them. */
  gentleJumps: boolean;
  /** MOVE-24: tap walks hop logs and jump terraces. Unset: on in a Learning Grove, and set on
   * for a phone at its first launch. */
  autoHop?: boolean;
  /** MOVE-42: tap walks over ten units run by themselves. Unset: off (a phone sets it on). */
  autoRun?: boolean;
  /** MOVE-53: the Pixel view turns toward a steady sideways walk. Unset: off. */
  cameraFollowsWalk?: boolean;
  /** MOVE-14: the thumb buttons and the pad swap sides for a left hand. Unset: off. */
  leftHanded?: boolean;
  /** R0302: the dialogue's per-speaker typing blips. Unset: on. */
  voiceBlips?: boolean;
  /** R0294: Do it skips the quest micro-games. Unset: on for Little Sprouts, else off. */
  microSkip?: boolean;
  particles: 'full' | 'light' | 'off';
  /** Override the system reduced-motion preference. */
  reducedMotion: 'system' | 'on' | 'off';
  /** Jukebox: a fixed piece, or null for the automatic score. */
  jukebox: string | null;
  /** Ambient sounds (birds, crickets, rain, the stream). */
  ambience: boolean;
  /** How the Grove is drawn: the pixel-art scene or the full-3D scene. */
  graphics: GraphicsMode;
  /** The corner minimap: off, on, or auto; an older save has none, which reads as auto. */
  minimap?: 'off' | 'on' | 'auto';
  /** R0073: zoom out to the survey step while running; unset: on for a phone. */
  surveyWhenRunning?: boolean;
  /** R0106: tuck the bottom bar away while walking; unset: on for a phone. */
  hideBarWhileWalking?: boolean;
  /**
   * R0102: Travel assist: walk, auto-walk to a tapped beacon or pin, or skip there. Unset:
   * auto-walk in a Learning Grove, walk otherwise (`travelMode`).
   */
  travel?: 'walk' | 'auto' | 'skip';
  /**
   * The 3D mode's sculpt grid for this device (a torso resolution, 48 to 104), picked by
   * a benchmark the first time the 3D mode opens; null until then.
   */
  sculptRes: number | null;
  /**
   * Lane C round 5: Settings → Bouts (recs FIGHT-71). `play` (unset), `gentle` (kid-mode bouts)
   * or `skip` (story bouts resolve without the battle screen). Optional; no save bump.
   */
  bouts?: 'play' | 'gentle' | 'skip';
  /** Lane C round 5: "Steady hands" (FIGHT-79), a fixed ×1.1 in place of the timing ring. */
  steadyHands?: boolean;
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
  /** Story rewards kept: items, cosmetics, memories and unlocks, by reward id. */
  keepsakes: string[];
  /** Lane C: flavoured fruit pocketed for bouts (FIGHT-20); absent in older saves. */
  pocketFruit?: Partial<Record<Flavor, number>>;
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
  /** Unused since missions stopped renewing by week; kept so older saves load as they are. */
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
  /** Wall-clock ms until which the break screen locks play; 0 when no break is running. */
  breakUntilMs: number;
  /** Live play ms counted today, kept across reloads (KIDS-07). */
  todayMs: number;
  /** The local date `todayMs` belongs to, YYYY-MM-DD; empty before the first count. */
  todayKey: string;
  /** Which educational text the story plays in (CV2): Little Sprouts or Grove Readers. */
  band: EduBand;
  /** The grown-up's "Story language" switch: the band's text, or the main text with childLines. */
  storyLanguage: 'learning' | 'standard';
  /** Lessons played, by lesson id; `best` is null for notice and do beats and think questions. */
  lessons: Record<string, { best: boolean | null }>;
  /** Little Sprouts: speak each line with the device's voice (once sound is on). */
  readAloud: boolean;
  /** Language course words (CV3), by vocab id: times heard in a scene or tapped, times used. */
  words: Record<string, { heard: number; used: number }>;
  /** The language courses the child has started from Nova's postcard. */
  courses: Record<LangCourseId, boolean>;
}

export type LangCourseId = 'hebrew' | 'japanese';

/** How a Nubbin shows it knows a course word (CV3). */
export type LangGesture = 'wave' | 'bow' | 'nod' | 'yawn' | 'look-up' | 'smile' | 'droop' | 'point';

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
  | 'thicket'
  | 'springShroom'
  | 'hayBale';

/** Why a piece of decor can't go somewhere (MOVE-05); each has a line in `UI_TEXT.decorRefused`. */
export type PlaceRefusal = 'water' | 'edge' | 'solid' | 'path' | 'someone' | 'spot';

export interface PlacedDecor {
  id: string;
  kind: DecorKind;
  pos: Vec2;
  /** Turn about the vertical, radians (fences and benches face the way they were placed). */
  yaw?: number;
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
  /**
   * R0162: snatches on this floor (at most `HOLLOW.strays.maxSnatches`), Shells still to drop
   * as a trail while it flees, seen once (shown on the automap), shooed off for good.
   */
  snatches?: number;
  carrying?: number;
  seen?: boolean;
  /** R0326: a Stray King (bottle-cap crown); calming or feeding it leaves a hat. */
  king?: true;
  shooed?: boolean;
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
  /** R0162: single Shells a fleeing stray dropped, waiting to be picked up. */
  shellTrail?: Array<{ id: string; x: number; z: number }>;
  /** R0159: shrines used on this level, and the shrine buffs still running (paused in fights). */
  shrinesUsed?: string[];
  buffs?: Array<{ kind: string; leftMs: number }>;
  /** R0161: traps sprung and waiting to re-arm (sticky ones slow for `slowMs`), and spotted. */
  trapsSprung?: Array<{ id: string; kind: string; leftMs: number; slowMs: number }>;
  trapsSpotted?: string[];
  /** Set while the Learning Grove is on: no traps are shown or sprung. */
  noTraps?: boolean;
  wild: DungeonWild[];
  /** 'up', 'down', 'chest' or 'stray:<id>': used on arrival at `pendingPos`. */
  pending: string | null;
  pendingPos: Vec2 | null;
  /** Which loot each party Nubbin is fetching. */
  fetch: Record<string, string>;
  haul: { shells: number; items: number };
  startedMs: number;
  /** The generator version the current floor was made with (saves from before it: 1). */
  genVersion: number;
  /**
   * The cells of the current floor the Keeper has seen, for the minimap: a hex string, one
   * digit per 4 cells in row-major order (bit j of digit k is cell 4k + j); '' when none.
   * Read it through `exploredMask` in sim/dungeon.ts.
   */
  explored: string;
  /** Strays and packs leave the Keeper be until this sim time (R0142). */
  graceUntilMs?: number;
  /** The floor's monster packs as they stand now (R0146); absent on floors without packs. */
  packs?: DungeonPack[];
  /** A fight under way with this pack: the floor holds still until it is answered. */
  /**
   * A fight in progress; `bout` is `world.battleRuns` once the battle core took it on, so an
   * old bout with the same key is never mistaken for this one.
   */
  encounter?: { packId: string; bout?: number };
  /** The act whose dungeon this run is in (R0145), by `ACTS` index; absent in the Deep Hollow. */
  act?: number;
  /** A storyline's fixed floor: it stays on generator version 2 all the way down. */
  story?: true;
  /** Set while the boot veil is up: the floor holds still (R0142). Never saved. */
  loading?: true;
  /**
   * Levels left behind on this run, by level id (R0151): what was taken, beaten, opened and
   * seen, so going back finds them as they were. At most `HOLLOW.levels.keep`, oldest out.
   */
  levels?: Record<string, LevelState>;
  /** This run's free Homing Acorn ("Grandma's acorn", R0150) is spent. */
  acornUsed?: true;
  /** Above ground in the act (R0147, R0152): its camp, its fields, or a side cave. */
  zone?: DungeonZone;
  /** Which side cave, by cave-mouth index, while `zone` is 'side'. */
  side?: number;
  /**
   * Rumble rooms (R0257, R0282): level ids whose room is won, and the one the Keeper must
   * step out of before it starts again (after a loss, or a start nobody could fight).
   */
  rumble?: { done: string[]; wait?: string };
  /** R0281: a stray that bumped the Keeper waits this long for Calm or a snack. */
  strayAsk?: { id: string; leftMs: number };
  /** R0281: the calm bout under way (`bout` is `world.battleRuns` when it began). */
  strayBout?: { id: string; bout: number; shells: number };
  // Lane B round 6.
  /** R0175: gear found on this trip, banked at a waypoint, a camp, an acorn or home. */
  sack?: GearItem[];
  /** R0180: losses to each pack on this trip, and packs sneaked past until a sim time. */
  packLosses?: Record<string, number>;
  sneakUntil?: Record<string, number>;
  /** R0209: co-op hooks, data only (always empty for now). */
  keepers?: string[];
  /** R0211: when the current level began, and fights on it. */
  levelStartMs?: number;
  levelFights?: number;
}

/** An act's places above its dungeon (lane B round 4). */
export type DungeonZone = 'town' | 'field' | 'side';

/** A Hollow level as the Keeper left it (R0151). */
export interface LevelState {
  taken: string[];
  packsCleared: string[];
  chestOpen: boolean;
  explored: string;
  /** Shrines come with DUNG-19; the slot is here so levels never need migrating. */
  shrinesUsed: string[];
}

/** An open Homing Acorn portal (R0150): the run waits, frozen, until the Keeper steps back. */
export interface HollowPortal {
  levelId: string;
  cell: { x: number; y: number };
  run: DungeonRun;
}

/** How far the Keeper has got in one act of the Hollow (R0145). */
export interface ActProgress {
  bossDefeated: boolean;
  /** Deepest level of the act dungeon reached, 1-based; 0 before the first visit. */
  deepest: number;
}

/** A monster pack's live state on the current floor (R0146); its make-up is on the floor. */
export interface DungeonPack {
  id: string;
  pos: Vec2;
  /** Ambling near home, chasing the Keeper, walking back, or beaten (gone home for good). */
  state: 'idle' | 'chase' | 'home' | 'beaten';
  target: Vec2 | null;
  /** When it noticed the Keeper (the "!" beat); -1 before. */
  noticedMs: number;
  /** R0203: a sleepy pack (Zzz) that a walking Keeper can tiptoe past. */
  asleep?: true;
  /** R0203: the tiptoe bonus for this pack is paid. */
  tiptoed?: true;
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
  /**
   * A scene's visiting speaker (side story or fun-quest guest, Corvin at the gate): spawned
   * beside the Keeper while the scene is queued, removed after it (campaign.ts). `trainer`
   * is then the speaker id, which may have no trainer look of its own.
   */
  guest?: boolean;
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
  /** Sim time each scene was first seen, for "the morning after" rules. */
  seenMs: Record<string, number>;
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
  /** Fun quests Q1–Q65 the runner drives (sim/fun-quests.ts), by quest id. */
  fun: Record<string, SideStoryState>;
  /** A separate campaign's id (sim/storyline.ts), or null for Hazel's Grove. */
  storyline: string | null;
  /**
   * When the last scene ended and whose it was (its id's first part: 'c2', 's9', 'q12'):
   * the breathing gap before the next unrelated scene (story-state.ts `resting`).
   */
  rest?: { atMs: number; owner: string } | null;
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
  /**
   * End-of-life checks for Nubbins that waited for the Keeper: held while the "While you
   * were away" screen is up, then run one at a time `nextMs` apart so each cocoon is seen.
   * Absent in older saves; a load always starts released.
   */
  endOfLife?: { held: boolean; nextMs: number };
  /** Sim time from which a rock or the stream bank can be tapped for materials again. */
  gatherReadyMs: number;
  unlocks: { sunGrove: boolean; moonGrove: boolean };
  /** Which Grove is shown. Sun and Moon are recolours, unlocked by the first adult of that band. */
  grove: GroveKind;
  /** Highest tier won per race course (0 = none). */
  races: Record<string, number>;
  /** Race results recorded, so each attempt's seed is fixed until it is run (review C, 28). */
  raceRuns: number;
  /** Lane C: the live bout (sim/battle), absent when none; old saves have neither field. */
  battle?: BattleState;
  /** Lane C: bouts started, so each bout's seed is fixed until it is fought. */
  battleRuns?: number;
  /** Lane C: the live grid-tactics bout (recs FIGHT-65), absent when none; no save bump. */
  tactics?: TacticsState;
  /** Lane B round 5: Hollow gear (R0163, R0164), made by `ensureGear` in sim/gear.ts; save v11. */
  gear?: GearState;
  /** Lane C: the last party picked and the bout options (recs FIGHT-19, -24, -26). */
  battlePrefs?: BattlePrefs;
  /** Lane C: Grove Circuit ribbons (sim/battle/circuit.ts, recs FIGHT-22). */
  circuit?: CircuitState;
  /**
   * Lane C round 5 (recs FIGHT-74): one-time bout rewards already given (first win per tier,
   * keepsakes, move cards for the Collection book). No save bump.
   */
  battleOnce?: BattleOnceState;
  /** Lane C round 6 (recs FIGHT-82): each story battle's choice and result; absent = none. */
  storyBouts?: Record<string, 'fight' | 'skip' | 'won'>;
  /** Lane C round 6 (FIGHT-64): a live bout's party needs, held until it ends. */
  battleHeld?: Record<string, { hunger: number; energy: number }>;
  /** Lane C round 6 (FIGHT-97): each trial map's best steps and whether par was met. */
  trials?: Record<string, { best: number; par: boolean }>;
  /**
   * Lane C round 5 (recs FIGHT-77): matchups the Keeper has seen land, "moveType>foeType",
   * for the move buttons' effectiveness badges. Written by sim/battle/seen.ts; no save bump.
   */
  battleSeen?: {
    pairs: string[];
    /** Lane C round 6 (FIGHT-84): every move id seen used in a bout, for the Battle Book. */
    moves?: string[];
  };
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
  /** Lane E, R0411: the name of the Nubbin that first showed each book key (absent: unknown). */
  seenBy?: Record<string, string>;
  /** Lane E, R0411: book tabs completed, each rewarded once. */
  bookTabs?: string[];
  /** Lane E, R0332: the curiosities (easter eggs) found, by id, with the sim time first found. */
  curiosities?: Record<string, number>;
  /** Daily visits: the last real day (YYYY-MM-DD) a Keeper came by. */
  visits: { lastDay: string; count: number; gifted: string[] };
  location: Location;
  /** MOVE-43: bushes already searched (one find each per save) and when each was last looked in. */
  bushFinds?: { found: string[]; checked: Record<string, number> };
  /** MOVE-55: lookout finds already made (vista ids and "well"), each once per save. */
  lookouts?: string[];
  /** MOVE-58: the one-time hop lesson: shown once near a log or the stream, done on the first clear. */
  hopLesson?: 'shown' | 'done';
  /** MOVE-59: the view's yaw (radians), sent by the UI as a hint for care walks; never a rule. */
  viewYaw?: number;
  /** MOVE-65: pond spots already searched on a dip (one shell each, once per save). */
  pondFinds?: string[];
  /** WORLD-04: regions the Keeper has entered (optional; read through `regionsFound`). */
  regionsFound?: string[];
  /** Karate belts won per tier. */
  karate: { belt: number; wins: number; losses: number };
  plants: Plant[];
  /** Painted tiles by "x,z" at half-unit snaps. */
  tiles: Record<string, TileKind>;
  achievements: Record<string, number>;
  /** R0315: small counts the joke badges read (fruit bonks, tickles, skids). Optional, no save bump. */
  funCounts?: Record<string, number>;
  /** Keeper title shown on the profile. */
  title: string | null;
  quests: Quest[];
  /** Unused since the board stopped refreshing by date; kept so older saves load as they are. */
  questDay: string;
  /** Extra garden plots bought: each adds roster room. */
  plots: number;
  wild: WildVisitor[];
  landmarks: Record<string, number>;
  /** R0091: one-time collectibles picked up, id → sim time (absent in older saves). */
  collected?: Record<string, number>;
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
  hollow: {
    runs: number;
    best: number;
    dailyDay: string;
    dailyDepth: number;
    /** Progress through the five acts, by `ACTS` index (R0145; save version 8). */
    acts: ActProgress[];
    /** Each act's floor seed, set on first entry (R0149; save version 9); 0 = not yet. */
    actSeeds: number[];
    /** The real day of the last "New paths" reroll, '' before any. */
    rerollDay: string;
    /** Waypoints activated for good, by id like `rootways.1` (R0148). */
    waypoints: string[];
    /** Homing Acorns carried (R0150). */
    acorns: number;
    /** The open acorn portal, if any. */
    portal: HollowPortal | null;
    /**
     * The act camps (R0152; save version 10): Shells in the stash chest, a slot for stashed
     * items (gear, DUNG-23), and the acts whose quest reward was paid.
     */
    camp: { shells: number; items: Record<string, number>; questsPaid: number[] };
    /** Named uniques beaten at least once (R0156; save version 10), by `UNIQUES` id. */
    uniquesBeaten: string[];
    /** The party picked at the cave mouth (R0168; save version 10), Nubbin ids. */
    lastParty: string[];
    /** Lane B round 6 (save version 12). R0160: acts whose boss chest is paid. */
    bossChests?: number[];
    /** R0185: today's run results, refreshed each real day (never a streak). */
    today?: { day: string; deepest: number; bestMs: number; finds: number };
    /** R0211: rolling tuning numbers, never shown to players. */
    stats?: HollowStats;
  };
  /** Per neighbour: the last real day a gift was taken. */
  neighbours: Record<string, { gifted: boolean }>;
  /** Festival banner shown for this season already. */
  festivalSeen: string;
  /** Atlas and Arcade festivals already announced in this Grove (sim/atlas.ts), by id. */
  atlasFestivals: string[];
}

// ---------- commands (input → sim) ----------

export type Command =
  // Lane E (R0332): the UI spotted a curiosity; the sim logs it once.
  | { kind: 'curiosity'; id: string }
  // Lane C: the battle core (sim/battle/index.ts).
  | { kind: 'battleStart'; context: BattleContext }
  | { kind: 'battleAct'; action: BattleAction }
  | { kind: 'battleForfeit' }
  | { kind: 'battleSlots'; nubbinId: string; slots: (string | null)[] }
  | { kind: 'battlePrefs'; prefs: Partial<BattlePrefs> }
  // Lane C: the grid-tactics rumble (sim/battle/tactics/slice.ts).
  | { kind: 'tacticsStart'; depth?: number; ids?: string[] }
  /** Lane C round 6 (FIGHT-82, FIGHT-72): a story battle's choice, and the Hollow guardian. */
  | { kind: 'storyBout'; id: StoryBoutId; fight: boolean; ids?: string[] }
  | { kind: 'guardianStart'; depth: number; key: string; ids?: string[] }
  /** Lane C round 6 (FIGHT-64): resume a loaded bout at its turn's start, or call a draw. */
  | { kind: 'battleResume' }
  /** Lane C round 6: a seen-once marker kept with the bout keepsakes (Play-fight Day). */
  | { kind: 'battleKeepsake'; id: 'playday-seen' }
  | { kind: 'trialClear'; id: string; steps: ('n' | 'e' | 's' | 'w')[] }
  | { kind: 'battleDraw' }
  | { kind: 'tacticsAct'; action: TacticsAction }
  | { kind: 'tacticsForfeit' }
  | { kind: 'tacticsClose' }
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
  /** The jump button pressed or let go (MOVE-10); with something held it shakes instead. */
  | { kind: 'jump'; down: boolean }
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
  | { kind: 'confirmRift' }
  | { kind: 'rename'; nubbinId: string; name: string }
  /** The UI holds waiting end-of-life checks while the away screen is open. */
  | { kind: 'holdEndOfLife'; hold: boolean }
  // Debug
  | { kind: 'debugGive'; what: 'shells' | 'fruit' | 'critter' | 'essence' | 'egg'; amount: number }
  | { kind: 'debugFillNeeds'; nubbinId: string }
  | { kind: 'debugForceEvolve'; nubbinId: string }
  | { kind: 'debugForceEndOfLife'; nubbinId: string }
  | { kind: 'debugHatchNow'; nubbinId: string }
  | { kind: 'campaignStart' }
  | { kind: 'sceneDone'; scene: string; choice: string | null }
  /** R0322: the tap toy's beats (a surprised face for hiccups, a dizzy one for the sneeze). */
  | { kind: 'tapToy'; nubbinId: string; beat: 'hiccup' | 'sneeze' }
  /** R0304 (FUN-15): a story line's hands-on beat was played (the gate, the cup). */
  | { kind: 'lineAct'; scene: string; act: LineAct }
  | { kind: 'talk'; npcId: string }
  | { kind: 'lightLantern'; id: string }
  | { kind: 'debugChapter'; chapter: number }
  /** Do the current step of a side story (journal button; see sim/side-stories.ts). */
  | { kind: 'sideAct'; story: string }
  /** Start a separate campaign (sim/storyline.ts) in this world. */
  | { kind: 'storylineStart'; id: string; flags?: Record<string, number | boolean | string> }
  /** Travel to one of a storyline's areas (S1's six places). */
  | { kind: 'storyArea'; area: string }
  /** The journal's Do-it for a storyline goal that waits on `act:<label>`. */
  | { kind: 'storyAct'; label: string }
  /** S2's party bout finished in the panel (sim/party-bout.ts). */
  | { kind: 'partyBoutResult'; won: boolean; tier: number; shells: number }
  /** S3's fusion of the two partners into one (sim/fusion.ts). */
  | { kind: 'fuse' }
  /** A tap on a story prop (the old trowel, the flat stone...), by prop id. */
  | { kind: 'storyProp'; prop: string }
  | { kind: 'giveHeartFruit'; nubbinId: string }
  | { kind: 'startLesson'; nubbinId: string; lesson: LessonId }
  | { kind: 'payService'; service: 'doctor' | 'fortune'; nubbinId: string }
  | { kind: 'buyDecor'; decor: DecorKind }
  | { kind: 'placeDecor'; decor: DecorKind; pos: Vec2; yaw?: number }
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
  /** The player is in a minigame with this Nubbin (sent while it runs): no care slips. */
  | { kind: 'playingWith'; nubbinId: string }
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
  // MOVE-54: Keeper 2's jump, pressed and let go.
  | { kind: 'keeper2Jump'; down: boolean }
  // MOVE-55: look around from a lookout.
  | { kind: 'lookAround' }
  // MOVE-59: the camera's yaw, so care walks stop where the Nubbin stays in view.
  | { kind: 'viewYaw'; yaw: number }
  // MOVE-64: roll the way the Keeper faces, or along `dir`.
  | { kind: 'roll'; dir?: Vec2 }
  | { kind: 'teleport'; pos: Vec2 }
  // WORLD-04: walk out through a region exit (sub picks a place in the lane)
  | { kind: 'travel'; exit: string; sub?: string }
  // R0074: fast travel to a found landmark or a shown story mark (`sim/travel.ts`)
  | { kind: 'fastTravel'; poi?: string; pos?: Vec2 }
  // R0102: Travel assist's Auto-walk: walk to a place at running speed (`sim/travel.ts`)
  | { kind: 'travelAssist'; pos: Vec2 }
  | { kind: 'photoTaken'; species: string }
  // Educational mode
  | { kind: 'eduStart'; age: EduAge; band?: EduBand }
  | { kind: 'eduSetBand'; band: EduBand }
  | { kind: 'eduSetLanguage'; language: EduState['storyLanguage'] }
  | { kind: 'eduLesson'; id: string; best: boolean | null }
  | { kind: 'eduSetReadAloud'; on: boolean }
  | { kind: 'langStart'; course: LangCourseId }
  | { kind: 'langWord'; word: string; how: 'heard' | 'used' }
  | { kind: 'langTraced'; quest: string }
  | { kind: 'eduSetAge'; age: EduAge; resetGames: boolean }
  | { kind: 'eduSetGame'; game: EduGameId; on: boolean }
  | { kind: 'eduSetSession'; minutes: number }
  | { kind: 'eduSetName'; name: string }
  | { kind: 'eduResult'; game: EduGameId; stars: number }
  | { kind: 'eduResetSession' }
  | { kind: 'eduStartBreak' }
  | { kind: 'eduEndBreak' }
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
  | { kind: 'setLoading'; on: boolean }
  | { kind: 'encounterDone'; outcome: 'won' | 'lost' | 'fled' }
  | { kind: 'enterAct'; act: number }
  // Lane B round 4: act camps and fields (R0147, R0152).
  | { kind: 'enterTown'; act: number }
  | { kind: 'enterMouth' }
  | { kind: 'stash'; amount: number }
  | { kind: 'townBuy'; item: 'fruit' | 'acorns' }
  | { kind: 'townQuest' }
  // Lane B round 5: the stray's choice (R0281).
  | { kind: 'strayCalm'; id: string }
  // Lane B round 5: Hollow gear (R0164).
  | { kind: 'equipGear'; itemId: string; nubbinId: string | null }
  | { kind: 'unequipGear'; itemId: string }
  | { kind: 'setHollowParty'; ids: string[] }
  // Lane B round 6: sneak past (R0180), the Mystery Basket (R0176).
  | { kind: 'packSneak'; packId: string }
  | { kind: 'gambleBasket'; slot: string }
  | { kind: 'stashTake'; itemId: string }
  // Lane B round 2: waypoints, the acts' paths, the Homing Acorn (R0148–R0150).
  | { kind: 'waypointTravel'; id: string }
  | { kind: 'rerollActs' }
  | { kind: 'buyAcorns' }
  | { kind: 'useAcorn' }
  | { kind: 'portalReturn' }
  | { kind: 'feedStray'; id: string }
  | { kind: 'atlasFestival'; id: string }
  | { kind: 'recruit'; name: string; species: string };

// ---------- events (sim → render/ui) ----------

export type SimEvent =
  // Lane E (R0332): a curiosity found for the first time (sim/curiosities.ts).
  | { kind: 'curiosityFound'; id: string }
  // Lane C: the battle core (sim/battle/rewards.ts).
  | { kind: 'battleStart'; context: BattleContext['kind'] }
  // Lane C: the grid-tactics rumble (sim/battle/tactics/slice.ts).
  | { kind: 'tacticsStart'; source: string; key: string }
  | {
      kind: 'tacticsEnd';
      source: string;
      key: string;
      winner: TacticsResult['winner'];
      reason: TacticsResult['reason'];
      shells: number;
      essence: NubbinType | null;
    }
  | {
      kind: 'battleEnd';
      context: BattleContext['kind'];
      source: string;
      key: string;
      winner: 0 | 1 | null;
      reason: BattleEndReason;
      shells: number;
    }
  | { kind: 'circuitRibbon'; trainer: string; champion: boolean }
  /** A wild foe came home: as a new child (`child`, its id), or as a full scan and a gift. */
  | { kind: 'befriended'; species: string; child: string | null; gift: number }
  | { kind: 'moveLearned'; nubbinId: string; move: string; slotted: boolean }
  /** Lane C round 5 (recs FIGHT-73, -74): what a finished bout gave, after `battleEnd`. */
  | { kind: 'battleSpoils'; spoils: BoutSpoils }
  /** Lane C round 6 (FIGHT-97): a trial map cleared, at par or not, and a first par. */
  | { kind: 'trialCleared'; id: string; steps: number; par: boolean; first: boolean }
  /** Lane C round 6 (recs FIGHT-99): a Dojo Ladder bout won (`belt` set once all its bouts are). */
  | { kind: 'ladderStep'; nubbinId: string; belt: number; step: number; beltWon: boolean }
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
  /** A waiting Nubbin's end-of-life check runs now: renderers may bring it into view. */
  | { kind: 'endOfLifeFocus'; nubbinId: string }
  | { kind: 'critterGiven'; nubbinId: string; species: string }
  | { kind: 'essenceGiven'; nubbinId: string; type: NubbinType }
  | { kind: 'reborn'; nubbinId: string }
  | { kind: 'departed'; nubbinId: string; name: string }
  | { kind: 'reaction'; nubbinId: string; reaction: Reaction }
  | { kind: 'langReact'; nubbinId: string; word: string; gesture: LangGesture }
  | { kind: 'fruitDropped'; treeId: string; itemId: string }
  | { kind: 'ate'; nubbinId: string }
  | { kind: 'napStarted'; nubbinId: string }
  | { kind: 'pickedUp'; nubbinId: string }
  | { kind: 'thrown'; nubbinId: string }
  | { kind: 'landed'; nubbinId: string }
  // MOVE-30: a Nubbin hopped (up, down, over or for joy).
  | { kind: 'nubbinHop'; nubbinId: string }
  /** MOVE-43: the Keeper pushed into a bush; `leaves` sheds a few, `found` a hidden shell. */
  | { kind: 'bushRustle'; id: string; x: number; z: number; leaves: boolean; found: boolean }
  /** The Keeper left the ground (MOVE-10); `air` for a double jump. */
  | { kind: 'keeperJumped'; air: boolean }
  /** `fall`: how far the feet dropped from the top of the arc (MOVE-21). */
  | { kind: 'keeperLanded'; fall: number }
  // MOVE-64: the Keeper starts a roll.
  | { kind: 'keeperRolled' }
  // MOVE-57: a spring mushroom bounced the Keeper (or a Nubbin, `nubbinId`) off its cap.
  | { kind: 'springBounced'; id: string; nubbinId?: string }
  // R0300/R0299 (FUN-11/10): something landed on a Nubbin's head, or it walked into a thing.
  | { kind: 'bonked'; nubbinId: string; by: 'fruit' | 'obstacle' }
  // MOVE-63: the hop course: a run starts, a flag is touched (1-based count so far), a run
  // ends (its time, the ghost as x, y, z triples every 100 ms, and whether the hat came now).
  | { kind: 'hopCourse'; stage: 'start' | 'gaveUp' }
  | { kind: 'hopCourse'; stage: 'flag'; flag: number }
  | { kind: 'hopCourse'; stage: 'finish'; ms: number; ghost: number[]; hat: boolean }
  // MOVE-65: the Keeper dips under the pond (shells: a one-time find there, or 0).
  | { kind: 'keeperDipped'; shells: number }
  // MOVE-55: a lookout's one-time find, and a look round (found: whether anything was).
  | { kind: 'lookoutFind'; id: string; shells: number; critter: string | null }
  | { kind: 'lookedAround'; at: 'top' | 'well'; found: boolean }
  // MOVE-58: the hop lesson's chip shows (near what), or the first clear completes it.
  | { kind: 'hopLesson'; stage: 'shown' | 'done'; near: 'log' | 'stream' | null }
  /** A sharp turn at speed (MOVE-20): the renderers kick up a puff of skid dust. */
  | { kind: 'keeperSkid' }
  /** MOVE-35: a tap target the Keeper cannot reach; it walks to `nearest`. `jump`: a jump would. */
  | { kind: 'moveUnreachable'; nearest: Vec2; jump: boolean }
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
  | { kind: 'storylineStarted'; id: string }
  | { kind: 'areaChanged'; area: string }
  | { kind: 'partyBout'; won: boolean; tier: number; shells: number }
  | { kind: 'fused'; keptId: string; keptName: string; goneName: string }
  | { kind: 'degenerated'; nubbinId: string; name: string }
  | { kind: 'restored'; nubbinId: string; name: string }
  | { kind: 'keepsake'; id: string; quest: string }
  // R0295: `bark`, the line the Keeper says back (content/barks.ts).
  | { kind: 'talked'; npcId: string; bark?: string }
  | { kind: 'courting'; nubbinId: string }
  | { kind: 'bred'; eggId: string; parents: [string, string] }
  | { kind: 'lessonStarted'; nubbinId: string; lesson: LessonId }
  | { kind: 'lessonDone'; nubbinId: string; lesson: LessonId; level: number }
  | { kind: 'service'; service: 'doctor' | 'fortune'; nubbinId: string; ok: boolean }
  | { kind: 'weather'; weather: WeatherKind }
  | { kind: 'visitor'; trainer: string; gift: 'shells' | 'fruit' | 'egg' | 'heartFruit' | null }
  | { kind: 'lanternNight' }
  | { kind: 'decorPlaced'; id: string; decor: DecorKind }
  | { kind: 'decorRefused'; decor: DecorKind; reason: PlaceRefusal }
  | { kind: 'decorBought'; decor: DecorKind; ok: boolean }
  | { kind: 'firstSeen'; key: string }
  | { kind: 'traded'; name: string }
  | { kind: 'received'; name: string; ok: boolean }
  | { kind: 'karate'; nubbinId: string; won: boolean; belt: number }
  | { kind: 'located'; location: Location }
  | { kind: 'regionEntered'; region: string }
  | { kind: 'regionDiscovered'; region: string }
  | { kind: 'travelRefused'; exit: string; reason: string }
  /** R0091: a one-time collectible was picked up, and a region's set of a kind finished. */
  | { kind: 'keepsakeFound'; id: string; what: 'petal' | 'postcard' | 'key' }
  | { kind: 'collectionSetDone'; region: string; what: 'petal' | 'postcard' | 'key' }
  /** R0074: a fast-travel trip arrived (the renderer plays the iris). */
  | { kind: 'travelled'; from: Vec2; to: Vec2 }
  | { kind: 'interacted'; nubbinId: string; action: Interaction; ok: boolean }
  /** A care walk got stuck and gave up (target: a Nubbin, tree or item id); the UI can toast it. */
  | { kind: 'cantReach'; targetId: string }
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
  /** R0330 (FUN-41): two Nubbins play together: a copycat, a tug over fruit, a bump. */
  | { kind: 'pairPlay'; play: 'copy' | 'tug' | 'bump'; a: string; b: string }
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
  /** R0307: a slip is a minute away (a new save only): the HUD says what helps. */
  | { kind: 'slipSoon'; nubbinId: string; slip: SlipKind }
  /** R0296 / R0297: a Keeper says a routine or chatter line in a bubble (no gameplay effect). */
  | { kind: 'npcBark'; npcId: string; text: string; station?: string }
  /** R0313: Fern's stone was tapped (the `line`-th tap; the cairn has `stones`). */
  | { kind: 'fernStone'; line: number; stones: number }
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
  | { kind: 'dungeonEntered'; depth: number; daily: boolean; camp?: true }
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
  /** R0162: a party Nubbin chased a stray off; or the Keeper picked up a dropped Shell. */
  | { kind: 'strayShooed'; by: string | null }
  | { kind: 'trailShell' }
  /** R0159: a shrine used, and a shrine buff run out. */
  | { kind: 'shrineUsed'; shrine: string }
  | { kind: 'shrineFaded'; shrine: string }
  /** R0161: a trap sprung under the Keeper, and one a scouting Nubbin spotted. */
  | { kind: 'trapSprung'; trap: string }
  | { kind: 'trapSpotted'; trap: string }
  /** R0031: the Keeper stood in a Hollow chasm or deep water and popped back to dry ground. */
  | { kind: 'hollowFell'; water: boolean; from: Vec2; to: Vec2 }
  | { kind: 'packNoticed'; packId: string }
  | { kind: 'encounterStarted'; packId: string }
  | { kind: 'packBeaten'; packId: string; x: number; z: number; shells: number }
  | { kind: 'partyGiggles'; packId: string }
  | { kind: 'packFled'; packId: string }
  | { kind: 'bossGuard' }
  | { kind: 'bossBeaten'; act: number }
  /** The run moved to another level without descending (climbing, a waypoint, a portal). */
  | { kind: 'levelChanged'; depth: number }
  | { kind: 'waypointActivated'; id: string }
  // Lane B round 4: act camps and fields (R0147, R0152).
  | { kind: 'stashMoved'; amount: number }
  | { kind: 'townBought'; item: 'fruit' }
  | { kind: 'townQuestPaid'; act: number; shells: number }
  | { kind: 'sideCaveEntered'; index: number }
  | { kind: 'uniqueBeaten'; id: string; bonus: number }
  // Lane B round 5: rumble rooms (R0257, R0282) and the stray's choice (R0281).
  | {
      kind: 'rumbleRoom';
      phase: 'start' | 'won' | 'lost';
      prefix: string;
      loot: { kind: 'hat' | 'critter' | 'shells'; param: string; amount: number } | null;
    }
  | { kind: 'strayAsk'; id: string }
  | { kind: 'strayCalmed'; ok: boolean; shells: number }
  | { kind: 'gearFound'; item: GearItem }
  | { kind: 'waypointArrived'; id: string }
  | { kind: 'actsRerolled'; ok: boolean }
  | { kind: 'acornsBought'; ok: boolean; count: number }
  | { kind: 'acornFound' }
  | { kind: 'acornPortal'; free: boolean; camp?: true }
  | { kind: 'portalReturned' }
  | { kind: 'wildScanned'; species: string }
  | { kind: 'wellRaised'; nubbinId: string }
  // Lane B round 6.
  | { kind: 'haulBanked'; items: number; where: 'home' | 'waypoint' | 'camp' | 'portal' }
  | { kind: 'bossCelebration'; act: number; item: GearItem; next: string | null }
  | { kind: 'sneakOffer'; packId: string }
  | { kind: 'sneakPast'; packId: string }
  | { kind: 'tiptoe'; packId: string; shells: number }
  | { kind: 'packWoke'; packId: string; yawn: boolean }
  | { kind: 'tumbleHome'; kept: number; camp: number }
  | { kind: 'basketOpened'; ok: boolean; price: number; item?: GearItem }
  | { kind: 'strayKing'; hat: string };

/** R0211: the Hollow's local tuning numbers, rolling over the last 20 levels. */
export interface HollowStats {
  levelMs: number[];
  fights: number[];
  losses: number;
  pickups: Record<string, number>;
  portals: number;
}

/** R0316 (FUN-27): counts the catch-up keeps, by Nubbin id. */
export interface AwayTally {
  ate: Record<string, number>;
  naps: Record<string, number>;
  rained: boolean;
}

export interface AwayReport {
  elapsedMs: number;
  simulatedMs: number;
  mode: OfflineMode;
  events: SimEvent[];
  /** R0316: what the Nubbins got up to, for the away screen's diary lines. */
  tally?: AwayTally;
}

/** A piece of Hollow gear (R0163, R0164); bases, rarities and affixes in `config/dungeon-loot.ts`. */
export interface GearItem {
  id: string;
  base: string;
  slot: string;
  rarity: string;
  level: number;
  affixes: Array<{ id: string; value: number }>;
}

/** What the Keeper carries and who wears what (lane B round 5). */
export interface GearState {
  items: GearItem[];
  /** The Keeper's slots, by slot: item ids. */
  keeper: Record<string, string>;
  /** Each Nubbin's slots, by Nubbin id then slot. */
  nubbins: Record<string, Record<string, string>>;
  /** The next item number. */
  next: number;
  /** R0174 (save version 12): the shared stash; satchel overflow lands here, never lost. */
  stash?: GearItem[];
}
