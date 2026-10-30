/**
 * Numbers for the Hollow Below's rebuild (lane B of the 2026-10-27 recommendations, DUNG).
 * The older Hollow numbers stay in `DUNGEON` in tuning.ts; everything the rebuild adds
 * lives here, so the dungeon work never has to edit the shared tuning file.
 */
export const HOLLOW = {
  /**
   * After arriving on a floor (entering, descending, or the loading veil lifting) strays
   * and packs leave the Keeper be for this long (R0142).
   */
  arrivalGraceMs: 8000,
  /**
   * The generator new floors use (`DUNGEON.genVersion` in tuning.ts is the older setting,
   * kept for the pixel samples). Saved runs keep the version their floor was made with.
   */
  genVersion: 4,
  /**
   * Hollow platforming (R0031, version 4 floors): deep water and chasm cuts. Gaps start at
   * `fromDepth`, every gap has a walking bypass before `nookFromDepth`, and from there up to
   * `nooks` side pockets sit behind a jump with a find in each. A single jump clears one
   * cell, the double jump `maxJump`. Stepping stones leave water gaps from `stonesFromDepth`.
   */
  gaps: {
    fromDepth: 2,
    nookFromDepth: 3,
    stonesFromDepth: 3,
    maxJump: 2,
    maxWidth: 3,
    cuts: { shallow: [2, 3] as const, deep: [3, 5] as const },
    nooks: [4, 6] as const,
    nookCells: [3, 90] as const,
    spacing: 5,
    keepClear: 3,
    fixups: 40,
    /** A Keeper at or under this height counts as standing (a fall); a Nubbin this far off hops a gap. */
    standHeight: 0.05,
    hopDistance: 4.5,
  },
  /**
   * Strays (R0162): snatches per stray per floor, a dropped Shell every `dropEveryMs` while
   * it flees, the energy a party Nubbin spends to shoo one, how near counts as seeing one.
   */
  strays: { maxSnatches: 2, dropEveryMs: 350, shooEnergy: 10, seeRadius: 7 },
  /**
   * Shrines (R0159): per level, cells from the stairs and between shrines, how near counts as
   * walking onto one, each buff's seconds (0 is instant), and the effect sizes.
   */
  /**
   * Traps (R0161): per level, cells from the stairs and apart, re-arm time, the scout's Run
   * level and reach, and each trap's size.
   */
  traps: {
    perLevel: [2, 5] as const,
    fromStairs: 5,
    spacing: 6,
    rearmMs: 20_000,
    scoutRun: 30,
    scoutCells: 3,
    whoopeeHop: 4,
    stickySlow: 0.4,
    stickyMs: 3000,
    leafCells: 3,
    bellReach: 20,
  },
  shrines: {
    perLevel: [1, 3] as const,
    fromStairs: 6,
    spacing: 8,
    reach: 0.9,
    seconds: {
      sunny: 120,
      bouncy: 90,
      snuggly: 120,
      lucky: 120,
      picnic: 0,
      glowy: 180,
      gem: 0,
      secret: 0,
    },
    sunny: 0.25,
    bouncy: 0.3,
    snugglyHappy: 15,
    snugglyPower: 0.1,
    luckyMagicFind: 50,
    glowySight: 4,
  },
  /**
   * Fog of war (R0153): brightness of cells never seen, seen but out of sight, and in sight.
   * The sight radius is `DUNGEON.explore.radius` plus these bonuses (cells); the outdoor
   * zones and the Light role will fill them in later, so both stay 0 for now.
   */
  fog: {
    hidden: 0.1,
    remembered: 0.55,
    visible: 1,
    sightBonus: { outdoor: 0, light: 0 },
  },
  /**
   * The automap (R0154): the full-screen overlay's opacity, its size in CSS px per cell
   * (clamped to fit the screen), and how far the stairs chevron sits from the Keeper.
   */
  automap: {
    overlayAlpha: 0.5,
    cellPx: { min: 4, max: 9 },
    /** The share of the shorter screen side the overlay map may span at most. */
    fitShare: 0.9,
    chevronPx: 34,
    /** Markers' half-size in CSS px, and the party dot's radius. */
    markPx: 6,
    partyPx: 3.5,
    /** Phone layout breakpoint for the corner panel starting collapsed (CSS px). */
    phoneW: 700,
    phoneH: 500,
  },
  /** Monster packs on version-3 floors (R0146). Radii and spacing in cells. */
  packs: {
    minFromEntry: 8,
    spacing: 6,
    members: [2, 4] as const,
    championFrom: 3,
    championChance: 0.15,
    aggroRadius: 5,
    leash: 12,
    wander: 3,
    /** World units per second; the chase is a share of the Keeper's walking speed. */
    wanderSpeed: 0.9,
    chaseSpeed: 0.8,
    /** The "!" beat before a chase starts, and how close counts as a bump (world units). */
    noticeMs: 600,
    contact: 0.9,
    fleeGraceMs: 3000,
    /** The auto-resolve stub: a member's weight on top of its level, the win-chance clamp. */
    memberBase: 4,
    winBias: 0.15,
    winMin: 0.25,
    winMax: 0.95,
    rewardShells: 6,
    rewardPerTier: 4,
    /** An act boss: levels over its depth, notice radius and leash (cells). */
    bossLevels: 6,
    bossAggro: 6,
    bossLeash: 30,
    /** Pack members beyond the party's size that join a bout (the rest hang back). */
    boutExtraFoes: 0,
    /** Levels a bout's foes may sit over a dojo rival of the same tier for this party. */
    boutLevelOver: 0,
  },
  /**
   * Generator version 3 (R0143, R0144): authored pieces on a grid of slots, a branching
   * walk between them, cave rock roughened around them. The three dungeon levels set the
   * size; acts pick a level per floor (R0145), the endless Hollow by depth (`deepLevels`).
   */
  v3: {
    /** Cells per macro slot; a piece is at most `slot - 2` across, leaving a gap for tunnels. */
    slot: 12,
    /** Cells kept as rock around the slot grid. */
    margin: 2,
    /** Chance the walk branches from an earlier slot instead of carrying on from its tip. */
    branchChance: 0.35,
    loops: [1, 3] as const,
    /** Chance a plain slot gets a corridor piece rather than a room. */
    corridorChance: 0.35,
    /** No piece more often than this on one floor. */
    maxRepeats: 3,
    treasureRooms: [2, 3] as const,
    /** Where the stairs down sit, as a share of the farthest walk from the stairs up. */
    stairsBand: [0.55, 0.75] as const,
    /** The walk picks the exit leaf nearest this share of the slot walk (tuned to land the stairs in the band). */
    exitAim: 1,
    /** The cave rock around the pieces (open chance per level below): passes, smallest pocket. */
    caPasses: 4,
    minPocket: 6,
    tunnelWidth: 2,
    /** Share of side-cave cells that may hold a find (the rest lie in rooms and tunnels). */
    caveFinds: 0.12,
    levels: {
      small: { cols: 64, rows: 48, rooms: [8, 10], poi: [22, 28], packs: [3, 4], caFill: 0.78 },
      standard: { cols: 80, rows: 60, rooms: [10, 14], poi: [28, 36], packs: [4, 6], caFill: 0.6 },
      big: { cols: 96, rows: 72, rooms: [14, 18], poi: [36, 44], packs: [6, 8], caFill: 0.58 },
    },
    /** The endless Hollow's level by depth: up to `small` floors, then up to `standard`. */
    deepLevels: { small: 3, standard: 9 },
  },
  /** Levels kept per run so going back finds them as left (R0151). */
  levels: { keep: 12 },
  /**
   * Waypoint stones (R0148): on level 1 of every act and every `every` levels after, never on
   * the boss level; `reach` is how close (world units) counts as standing on one.
   */
  waypoints: { every: 2, reach: 1.2 },
  /** The Homing Acorn (R0150): a bundle in the cave-mouth shop, and the chance a find holds one. */
  acorns: { bundle: 5, price: 10, dropChance: 0.12 },
  /**
   * Solid set pieces (R0032): the landmark blocks this share of its clear radius (cells); nav
   * closes cells within the block plus `navClearance` (world units).
   */
  props: { landmarkShare: 0.7, navClearance: 0.35 },
  /**
   * Rumble rooms (R0257, R0282): from `fromDepth`, about `share` of dungeon levels mark one
   * room (at least `minSide` cells each way, never the stairs', the chest's or a boss's) whose
   * glowing door starts a tactics bout on lane C's grid. `prefix` weights the champion pack's
   * modifier; `fluffyHp` and `speedyZip` size it. The chest after a win: `hatChance` for a hat
   * not yet owned, else `critterChance` for a critter bubble, else `shells` more Shells.
   */
  rumble: {
    fromDepth: 2,
    share: 0.36,
    minSide: 4,
    prefix: { fluffy: 1, speedy: 1, sticky: 1 },
    fluffyHp: 1.5,
    speedyZip: 1.3,
    hatChance: 0.15,
    critterChance: 0.55,
    shells: 30,
  },
  /**
   * The stray's choice (R0281): a stray that bumps the Keeper waits `askMs` for Calm it or a
   * snack before it snatches; a calmed stray pays back `payback` times what it would have
   * taken. Its bout's level is `level` plus `perDepth` a floor.
   */
  strayChoice: { askMs: 3000, payback: 1.5, level: 2, perDepth: 1 },
} as const;

export type HollowLevel = keyof typeof HOLLOW.v3.levels;

/**
 * Act towns and outdoor fields (R0152, R0147, lane B round 4). A town is an authored 40×30
 * hub; a field is a 128×96 meadow stitched from 16×16 tiles between the town and the act's
 * dungeon gate, with cave mouths onto one-level side caves.
 */
export const HOLLOW_ZONES = {
  field: {
    cols: 128,
    rows: 96,
    tile: 16,
    /** Cave mouths onto side caves, and monster packs (sparser than below ground). */
    mouths: [2, 3],
    packs: [10, 14],
    wildlife: [6, 8],
    shrines: [1, 2],
    loot: 10,
    /** The road is this many cells wide. */
    road: 2,
  },
  /** How close (world units) the Keeper must stand to use a service or a cave mouth. */
  reach: 1.6,
  /** Stash: Shells kept safe from strays; the most it holds. */
  stash: { maxShells: 99_999 },
  /** The vendor's fruit, for feeding strays; Shells each. */
  vendor: { fruitPrice: 6 },
  /** The cave-mouth party picker (R0168): energy (0..1) below this shows as tired. */
  party: { tired: 0.25 },
  /** The quest-giver's one-time reward per act for beating its boss (Shells). */
  questReward: [60, 90, 120, 160, 220],
  /**
   * The open-sky colour band for camps and fields, in place of the cave's depth band
   * (`bandForFloor`, render/cave-bands.ts): grass for the floor, hedge for the rock.
   */
  openBand: {
    from: 1,
    name: 'open sky',
    background: '#8cc0dc',
    hemiSky: '#d6eaff',
    hemiGround: '#6f8a4a',
    key: '#fff1d6',
    torch: '#ffc070',
    grade: '#fff8ee',
    rock: '#5d7a3c',
    moss: '#74b04a',
    crystal: '#c4ecff',
    floor: '#6e9a48',
    rim: '#a6cc6a',
    glow: '#ffd890',
  },
} as const;

/** Lane B round 6 (2026-10-29): boss floors, the sack, warm losses, sleepy packs, the stall. */
export const HOLLOW_R6 = {
  /** R0160: a boss chest's guaranteed tier, and the energy a party retries a boss with. */
  bossChestRarity: 'legendary' as const,
  bossRetryEnergy: 100,
  /** R0180: a lost fight leaves the party at least this much energy; "Sneak past?" after this
   * many losses to one pack, and the pack leaves the Keeper be for `sneakMs`. */
  lossEnergy: 50,
  sneakAfter: 3,
  sneakMs: 60_000,
  /** R0203: share of normal packs asleep; cells within which a running Keeper wakes them; the
   * tiptoe bonus; a Lazy party Nubbin's chance to yawn one awake. */
  sleepyShare: 0.2,
  wakeCells: 3,
  tiptoeShells: 5,
  lazyYawn: 0.1,
  /** R0176: the Mystery Basket's price by act, and its odds (never Plain). */
  basketPrice: [50, 120, 250, 250, 250] as const,
  basketOdds: { shiny: 0.6, fancy: 0.3, legendary: 0.08, set: 0.02 } as const,
  /** R0362: share of the sack that tumbles home with the party; the rest goes to the stash. */
  tumbleKeep: 0.5,
  /** R0326: one stray in this many is a Stray King with a bottle-cap crown and a hat. */
  strayKingOneIn: 12,
  /** R0211: levels kept in the rolling stats. */
  statsKeep: 20,
} as const;

/** Lane B round 7 (2026-10-30): aggro, rest nooks, the Deep Hollow, tiers, rooms. */
export const HOLLOW_R7 = {
  /** R0200: a pack chases this long after its "!" beat, then walks home with a "?" and won't
   * notice the Keeper again for `ignoreMs`. A Shy party Nubbin shrinks the notice radius. */
  aggro: { chaseMaxMs: 8000, askMs: 1500, ignoreMs: 3000, shyLess: 1 },
} as const;
