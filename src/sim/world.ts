import { stepGroveDiary } from './grove-diary';
import { runHandler } from './commands';
import { orderSystems, runSystems, type SimSystem, type StepCtx, type SystemRuns } from './systems';
import { AUDIO_MIX } from '../config/tuning-r8d-audio';
import { isRidden, stepRide } from './ride';
import { stepSwimTow } from './swim-tow';
import { stepBattleMoves } from './battle';
import { holdBattleNeeds } from './battle/resume';
import { NUBBIN_NAMES } from '../config/strings';
import { EGG, GROVE, OFFLINE, SKILLS, THROW, TREES } from '../config/tuning';
import { decayNeeds } from './needs';
import { fruitOnHead, sampleAll, updateBehavior } from './behavior';
import { createKeeper, updateKeeper } from './keeper';
import { stepTrust } from './trust';
import { createWeather, seasonAt, stepWeather } from './weather';
import { tzOf } from './local-time';
import { stepBreeding } from './breeding';
import { stepCollection } from './collection';
import { stepDaily } from './daily';
import { stepPlants } from './plants';
import { queueQuestEvents, stepQuests } from './quests';
import { stepHabitats } from './habitats';
import { stepKeeper2 } from './coop';
import { stepLandmarks } from './landmarks';
import { travel } from './regions';
import { crossExits } from './region-walk';
import { stepCollectibles } from './collectibles';
import { stepRegionCompanion } from './region-companion';
import { stepRegionCritters } from './region-critters';
import { stepRegionGates } from './region-gates';
import { stepShorePlay } from './shore-play';
import { stepGardenWalkout } from './garden-walkout';
import { stepSnowballs } from './snowballs';
import { stepTraces } from './regions-trace';
import { stepWildNubbin } from './region-wild-nubbin';
import { stepWeatherPlay } from './region-weather-play';
import { stepSeasonProps } from './region-season-props';
import { stepPhotoSpots } from './photo-spots';
import { stepWorldHints } from './world-hints';
import { stepLittleGrove } from './little-grove';
import { stepCottageHide } from './cottage-hide';
import { stepCrying } from './cry-soul';
import { stepShadowSoul } from './shadow-soul';
import { stepFavSpots } from './fav-spot';
import { calmEternalReactions } from './old-soul';
import { stepSoulGroups } from './soul-groups';
import { stepFriendships } from './friendships';
import { stepKeeperIdle } from './keeper-idle';
import { stepSeasons, fruitIntervalMultiplier } from './seasons';
import { stepAchievements } from './achievements';
import { stepCampaign } from './campaign';
import { noteSideCommand } from './side-stories';
import { noteCampaignEvents } from './storyline';
import { noteLineEvents, stepLineQueue, stepStoryBook } from './story-book';
import { stepNpcs } from './npcs';
import { separateBodies } from './separation';
import { stepPropReach } from './prop-reach';
import { stepHopLesson } from './hop-lesson';
import { stepHopCourse } from './hop-course';
import { DEFAULT_TRAINER, rollEggSpecies, trainerOf } from './trainers';
import { advanceStage, hatch, keepEggshell } from './lifecycle';
import { createEgg, isHeld } from './nubbin';
import { Rng } from './rng';
import { stepTown } from './town';
import { stepSlips } from './slips';
import { stepMoody } from './soul-idle';
import { setAnticsLive } from './antics';
import { stepDiary } from './diary';
import { stepPartners } from './partners';
import { stepCurfew } from './curfew';
import { hollowBattleEnded, inParty, stepDungeon } from './dungeon';
import { stepGearNeeds } from './dungeon-gear-effects';
import { hasSkill, stepSkillPoints } from './skills';
import { stepScans } from './scans';
import { stepTeams } from './teams';
import { resolve } from './obstacles';
import { resolveNubbin } from './nubbin-hop';
import { collideThrown } from './throw-collide';
import { stepEdu } from './edu';
/* Lane E r9 */
import {
  type Command,
  type Item,
  type Nubbin,
  type Settings,
  type SimEvent,
  type Tree,
  type Vec2,
  type World,
} from './types';
import { hatchInArms } from './hatch-arms';
import { SYSTEM_THROTTLE } from '../config/tuning-r13d3';
import { stepLevelWatch } from './level-watch';
import { stepKeeperDodge } from './keeper-dodge'; /* Lane E r10, R0299 */
import { flightStep, flightTrigger } from './flight-zones'; /* R0109 (lane D r11) */

/** Eggs hatch faster with the Warm hands skill, live and during catch-up alike. */
export function hatchSpeed(world: World): number {
  return hasSkill(world, 'warmHands') ? 1.1 : 1;
}

export function defaultSettings(): Settings {
  return {
    offlineAging: {
      mode: OFFLINE.defaultMode,
      capHours: OFFLINE.defaultCapHours,
      allowOfflineDepartures: OFFLINE.defaultAllowDepartures,
    },
    matureContent: 'off',
    riftConfirmed: false,
    joystick: false,
    sound: true,
    music: true,
    // R0464 (TECH-22): music sits under the effects by default.
    musicVolume: AUDIO_MIX.defaultMusic,
    sfxVolume: 0.8,
    textSpeed: 'normal',
    screenShake: true,
    gentleJumps: false,
    particles: 'full',
    reducedMotion: 'system',
    jukebox: null,
    ambience: true,
    graphics: 'pixel',
    sculptRes: null,
  };
}

export function createWorld(seed: number, wallMs: number): World {
  const rng = Rng.fromSeed(seed);
  const world: World = {
    seed,
    rngState: 0,
    timeMs: 0,
    lastWallMs: wallMs,
    nubbins: [],
    items: [],
    trees: [],
    keeper: createKeeper(GROVE.keeperStart),
    inventory: {
      shells: 0,
      fruit: EGG.startFruit,
      critters: {},
      essences: {},
      hats: [],
      heartFruit: 0,
      decor: {},
      wood: 0,
      stone: 0,
      reeds: 0,
      seeds: {},
      dyes: {},
      toys: {},
      twine: 0,
      keepsakes: [],
    },
    settings: defaultSettings(),
    memorials: [],
    gatherReadyMs: 0,
    unlocks: { sunGrove: false, moonGrove: false },
    creator: false,
    grove: 'main',
    races: {},
    raceRuns: 0,
    trainer: DEFAULT_TRAINER,
    nextId: 1,
    selected: null,
    strays: [],
    npcs: [],
    campaign: null,
    lines: {},
    weather: createWeather(),
    season: seasonAt(wallMs, 0),
    placed: [],
    seen: {},
    visits: { lastDay: '', count: 0, gifted: [] },
    location: 'grove',
    karate: { belt: 0, wins: 0, losses: 0 },
    plants: [],
    tiles: {},
    achievements: {},
    title: null,
    quests: [],
    questDay: '',
    plots: 0,
    wild: [],
    landmarks: {},
    coop: { active: false, trainer: 'nova' },
    keeper2: null,
    edu: null,
    town: { prosperity: 0, recruits: [] },
    partners: [null, null],
    merge: null,
    skillPoints: 0,
    skills: {},
    scans: {},
    team: null,
    night: false,
    tank: { runs: 0, best: 0 },
    dungeon: null,
    hollow: {
      runs: 0,
      best: 0,
      dailyDay: '',
      dailyDepth: 0,
      acts: [],
      actSeeds: [],
      rerollDay: '',
      waypoints: [],
      acorns: 0,
      portal: null,
      camp: { shells: 0, items: {}, questsPaid: [] },
      uniquesBeaten: [],
      lastParty: [],
      // Lane B round 6 (save version 12).
      bossChests: [],
      today: { day: '', deepest: 0, bestMs: 0, finds: 0 },
      stats: { levelMs: [], fights: [], losses: 0, pickups: {}, portals: 0 },
    },
    neighbours: {},
    festivalSeen: '',
    atlasFestivals: [],
  };
  for (const t of GROVE.trees) {
    world.trees.push({
      id: newId(world, 'tree'),
      pos: { x: t.x, z: t.z },
      fruitTimerMs: TREES.fruitIntervalMs / 2,
    });
  }
  for (let i = 0; i < EGG.startCount; i++) {
    const spot = GROVE.eggSpots[i] ?? { x: i * 2 - 1, z: 0 };
    const egg = createEgg(
      newId(world, 'nub'),
      spot,
      rng,
      'plain',
      rollEggSpecies(trainerOf(world.trainer), rng),
    );
    egg.name = uniqueName(world, egg.name, rng);
    world.nubbins.push(egg);
  }
  world.rngState = rng.state;
  return world;
}

/** Avoid two Nubbins sharing a random name. */
export function uniqueName(world: World, name: string, rng: Rng): string {
  const taken = new Set(world.nubbins.map((n) => n.name));
  if (!taken.has(name)) return name;
  const free = NUBBIN_NAMES.filter((n) => !taken.has(n));
  if (free.length > 0) return rng.pick(free);
  return `${name} ${world.nubbins.length + 1}`;
}

export function newId(world: World, prefix: string): string {
  const id = `${prefix}-${world.nextId}`;
  world.nextId += 1;
  return id;
}

export function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

/** Take the world's RNG, use it, and store the state back. */
export function withRng<T>(world: World, fn: (rng: Rng) => T): T {
  const rng = new Rng(world.rngState);
  const out = fn(rng);
  world.rngState = rng.state;
  return out;
}

// ---------- commands ----------

export function applyCommand(world: World, cmd: Command, events: SimEvent[]): void {
  const start = events.length;
  applyCommandInner(world, cmd, events);
  // Lane B: a Hollow bout that just ended finishes its encounter, calm bout or rumble room.
  if (world.dungeon && events.length > start) hollowBattleEnded(world, events.slice(start), events);
  // A side-story step waiting on this very action (a talk, a visit, a tap) is met.
  if (world.campaign) noteSideCommand(world, world.campaign, cmd);
  // Events from commands (a visit, a craft, a watering) count toward requests on the
  // next step, the same as events the step itself produces.
  if (events.length > start) {
    queueQuestEvents(world, events.slice(start));
    // The campaign counters (storyline goals, the expansions) see command events too.
    if (world.campaign) noteCampaignEvents(world, world.campaign, events.slice(start));
    // Lane C r7 (R0596): and every questline running beside Hazel's Grove.
    noteLineEvents(world, events.slice(start));
  }
}

function applyCommandInner(world: World, cmd: Command, events: SimEvent[]): void {
  // TECH-35: every command kind is answered by a handler in sim/commands/.
  runHandler(world, cmd, events);
}

export function heldNubbin(world: World): Nubbin | undefined {
  return world.nubbins.find((n) => n.behavior.state === 'held');
}

// ---------- stepping ----------

const LIVE_ONLY: SystemRuns = { live: true, offline: false, coarse: false };
const ALWAYS: SystemRuns = { live: true, offline: true, coarse: true };

/** The Nubbins' own step: eggs incubate, needs decay, ages advance, behaviour runs. */
function stepNubbins({ world, dtMs, offline, events }: StepCtx, rng: Rng): void {
  // Iterate a copy: a departure removes its Nubbin from the list.
  for (const n of [...world.nubbins]) {
    if (n.stage === 'egg') {
      // Eggs incubate on the ground, held and carried alike.
      n.hatchRemainingMs -= dtMs * hatchSpeed(world);
      // TECH-18: an egg ready in the Keeper's arms pops there and the child tumbles into a
      // hug; a thrown egg waits to land.
      if (n.hatchRemainingMs <= 0 && isHeld(n)) hatchInArms(world, n, events);
      if (n.hatchRemainingMs <= 0 && n.stage === 'egg' && n.behavior.state !== 'thrown') {
        hatch(n, events, world.timeMs);
        // Lane E, R0394: the eggshell goes in the hat box as the egg hatches.
        keepEggshell(n, world);
      }
      if (n.behavior.state === 'thrown') {
        updateBehavior(n, world, dtMs, rng, events);
        // MOVE-33: a thrown egg bounces off walls and never comes to rest inside one.
        if (n.behavior.state === 'thrown') collideThrown(world, n, events);
        else resolve(n.pos, world, 0.25, 'nubbin');
      }
      continue;
    }
    decayNeeds(n, dtMs);
    // R0164: Snug and Naps from worn gear.
    stepGearNeeds(world, n, dtMs);
    advanceStage(n, dtMs, events, world, offline);
    // Party members underground are moved by the Hollow step instead.
    // R0085: the ridden Nubbin is pinned under the Keeper by stepRide instead.
    // R0121: a partner in a drawn region follows the Keeper there instead.
    if (stepRegionCompanion(world, n, dtMs)) continue;
    if (world.nubbins.includes(n) && !inParty(world, n.id) && !isRidden(world, n.id)) {
      updateBehavior(n, world, dtMs, rng, events);
      // MOVE-33: a thrown Nubbin bonks off what is taller than it flies.
      if (n.behavior.state === 'thrown') collideThrown(world, n, events);
      resolveNubbin(n, world);
    }
  }
}

/** The Keeper's own step: intent, ride, tow, dodge. Live play only (catch-up never acts). */
function stepKeeperSystem({ world, dtMs, events }: StepCtx): void {
  // R0085/R0088: the carrier follows the Keeper's step; a swimmer tows it through the pond.
  const fx = world.keeper.pos.x;
  const fz = world.keeper.pos.z;
  // R0109: an updraft or a glide moves the Keeper in place of its walking step.
  if (!flightStep(world, dtMs)) {
    updateKeeper(world, dtMs, events);
    flightTrigger(world, fx, fz);
  }
  const moved = Math.hypot(world.keeper.pos.x - fx, world.keeper.pos.z - fz);
  stepRide(world, dtMs, moved, events);
  stepSwimTow(world);
  stepKeeperDodge(world); /* R0299 (lane E r10): a hop past a Nubbin on a hard turn */
  // R11 lane D (WORLD-39): a border walked into: seamless now, loaded through the iris.
  const seam = crossExits(world, events);
  if (seam) travel(world, seam.id, events);
}

const rngSys = (
  id: string,
  order: number,
  runs: SystemRuns,
  step: (ctx: StepCtx, rng: Rng) => void,
): SimSystem => ({ id, order, runs, rng: true, step });
const plainSys = (
  id: string,
  order: number,
  runs: SystemRuns,
  step: (ctx: StepCtx) => void,
): SimSystem => ({ id, order, runs, rng: false, step });

/**
 * Every step system, in the order the step has always run them. The numbers leave room to
 * slot a new one in: pick a gap, and mind that rng systems (inside `withRng`) come first.
 */
const SYSTEM_LIST: readonly SimSystem[] = [
  rngSys('trees', 10, ALWAYS, ({ world, dtMs, events }, rng) =>
    updateTrees(world, dtMs, rng, events),
  ),
  rngSys('items', 20, ALWAYS, ({ world, dtMs }) => updateItems(world, dtMs)),
  rngSys('nubbins', 30, ALWAYS, stepNubbins),
  rngSys('keeper', 40, LIVE_ONLY, stepKeeperSystem),
  // MOVE-56: walking up to a story prop with a reach meets its step, as a tap does.
  rngSys('prop-reach', 50, LIVE_ONLY, ({ world }) => stepPropReach(world)),
  // MOVE-58: the one-time hop lesson.
  rngSys('hop-lesson', 60, LIVE_ONLY, ({ world, events }) => stepHopLesson(world, events)),
  // MOVE-63: the hop course's flags and timer.
  rngSys('hop-course', 70, LIVE_ONLY, ({ world, events }) => stepHopCourse(world, events)),
  // R0352: the idle Keeper's antics and rule three's sit, in real live play only (a wall
  // clock at x1 with the tab showing), so scripted runs and catch-up never see them.
  rngSys('keeper-idle', 80, LIVE_ONLY, ({ world, dtMs, events, countPlay, wallMs }) => {
    if (countPlay && wallMs !== undefined) stepKeeperIdle(world, dtMs, events);
  }),
  rngSys('trust', 90, ALWAYS, ({ world, dtMs, events }) => stepTrust(world, dtMs, events)),
  // R0527 (lane A r10): in the Learning Grove a Nubbin hides in the cottage, never runs.
  rngSys('cottage-hide', 100, ALWAYS, ({ world, offline, events }) =>
    stepCottageHide(world, offline, events),
  ),
  rngSys('npcs', 110, ALWAYS, ({ world, dtMs, events }, rng) => stepNpcs(world, dtMs, rng, events)),
  rngSys('bodies', 120, ALWAYS, ({ world, dtMs }) => separateBodies(world, dtMs)),
  rngSys('weather', 130, ALWAYS, ({ world, dtMs, events }, rng) =>
    stepWeather(world, dtMs, rng, events),
  ),
  rngSys('breeding', 140, ALWAYS, ({ world, events }, rng) => stepBreeding(world, rng, events)),
  rngSys('season-daily', 150, ALWAYS, ({ world, wallMs, events }, rng) => {
    if (wallMs === undefined) return;
    // R0118 (lane D r9): the debug panel can force a season for checks.
    world.season = world.debugSeason ?? seasonAt(wallMs, tzOf(world));
    stepDaily(world, wallMs, rng, events);
  }),
  rngSys('line-queue', 160, ALWAYS, ({ world, dtMs, events }) =>
    stepLineQueue(world, dtMs, events),
  ),
  rngSys('campaign', 170, ALWAYS, ({ world, dtMs, events }) => stepCampaign(world, dtMs, events)),
  rngSys('story-book', 180, ALWAYS, ({ world, dtMs, events }) =>
    stepStoryBook(world, dtMs, events),
  ),
  rngSys('plants', 190, ALWAYS, ({ world, dtMs, events }, rng) =>
    stepPlants(world, dtMs, rng, events),
  ),
  rngSys('habitats', 200, ALWAYS, ({ world, dtMs, events }, rng) =>
    stepHabitats(world, dtMs, rng, events),
  ),
  rngSys('keeper2', 210, ALWAYS, ({ world, dtMs, events }) => stepKeeper2(world, dtMs, events)),
  rngSys('edu', 220, ALWAYS, ({ world, dtMs, wallMs, offline, countPlay }) =>
    stepEdu(world, dtMs, offline || !countPlay ? undefined : wallMs, offline || !countPlay),
  ),
  rngSys('slips', 230, ALWAYS, ({ world, dtMs, events }) => stepSlips(world, dtMs, events)),
  rngSys('moody', 240, ALWAYS, ({ world, dtMs, events }) => stepMoody(world, dtMs, events)),
  rngSys('partners', 250, ALWAYS, ({ world, dtMs, events }) => stepPartners(world, dtMs, events)),
  rngSys('curfew', 260, ALWAYS, ({ world, dtMs, wallMs, events }) =>
    stepCurfew(world, dtMs, wallMs, events),
  ),
  rngSys('quests', 270, ALWAYS, ({ world, wallMs, events }, rng) =>
    stepQuests(world, wallMs, rng, events),
  ),
  rngSys('dungeon', 280, ALWAYS, ({ world, dtMs, events }, rng) =>
    stepDungeon(world, dtMs, rng, events),
  ),
  plainSys('collection', 500, ALWAYS, ({ world, events }) => stepCollection(world, events)),
  plainSys('friendships', 510, ALWAYS, ({ world, dtMs, events }) =>
    stepFriendships(world, dtMs, events),
  ),
  // R0558, R0581 (lane A r11): brief cries and friends who come to comfort.
  plainSys('soul-crying', 511, ALWAYS, ({ world, offline, events }) =>
    stepCrying(world, events, offline),
  ),
  // R0566 (lane A r11): a Shadow's bond hug, and a watcher's eyes on the Keeper.
  plainSys('soul-shadow', 512, ALWAYS, ({ world, offline, events }) =>
    stepShadowSoul(world, events, offline),
  ),
  // R0569 (lane A r11): sitting at a favourite spot.
  plainSys('soul-fav-spots', 513, LIVE_ONLY, ({ world, dtMs, events }) =>
    stepFavSpots(world, dtMs, events),
  ),
  // R0547, R0555 (lane A r11): critters to chase, jam sessions (sim/soul-groups.ts).
  plainSys('soul-groups', 514, ALWAYS, ({ world, dtMs, events, offline }) =>
    stepSoulGroups(world, dtMs, events, offline),
  ),
  // R0450: the level-up sound hangs on this event.
  plainSys('level-watch', 515, ALWAYS, ({ world, events, offline }) =>
    stepLevelWatch(world, events, offline),
  ),
  plainSys('diary', 520, ALWAYS, ({ world, offline, events }) => stepDiary(world, events, offline)),
  plainSys('landmarks', 530, ALWAYS, ({ world, events }) => stepLandmarks(world, events)),
  plainSys('collectibles', 540, ALWAYS, ({ world, events }) => stepCollectibles(world, events)),
  plainSys('region-life', 541, ALWAYS, ({ world, dtMs, events }) => {
    // R0120/R0110 (R11 d8): a region's critter spots and its stat gates.
    stepRegionCritters(world, events);
    stepRegionGates(world, dtMs, events);
    // R0097 (R13 d1): the shore's castles and folk.
    stepShorePlay(world, dtMs, events);
    stepGardenWalkout(world, events);
    stepSnowballs(world, dtMs);
    // R0120 (R12 d2): the region's shy wild Nubbin.
    stepWildNubbin(world, dtMs, events);
    // R0137 (R12 d2): the shore's ghost ship in fog.
    stepWeatherPlay(world, events);
    // R0118 (R12 d2): a season keepsake in each region.
    stepSeasonProps(world, events);
  }),
  plainSys('traces', 543, ALWAYS, ({ world, events }) => stepTraces(world, events)),
  plainSys('photo-spots', 546, ALWAYS, ({ world, events }) => stepPhotoSpots(world, events)),
  // R0127/R0111 (lane D r9): teach each mechanic once in the world; the Grove's secret.
  plainSys('world-hints', 550, ALWAYS, ({ world, events }) => stepWorldHints(world, events)),
  plainSys('little-grove', 560, ALWAYS, ({ world }) => stepLittleGrove(world)),
  plainSys('seasons', 570, ALWAYS, ({ world, events }) => stepSeasons(world, events)),
  plainSys('achievements', 580, ALWAYS, ({ world, dtMs, events }) =>
    stepAchievements(world, events, dtMs),
  ),
  plainSys('town', 590, ALWAYS, ({ world, events }) => stepTown(world, events)),
  plainSys('scans', 600, ALWAYS, ({ world, dtMs, events }) => stepScans(world, dtMs, events)),
  plainSys('skill-points', 610, ALWAYS, ({ world, events }) => stepSkillPoints(world, events)),
  plainSys('teams', 620, ALWAYS, ({ world, events }) => stepTeams(world, events)),
  // Lane C: new moves join the kit (sim/battle/moves-sources.ts), in live play only.
  plainSys('battle-moves', 630, LIVE_ONLY, ({ world, dtMs, events }) =>
    stepBattleMoves(world, dtMs, events),
  ),
  // Lane C round 6 (FIGHT-64, FIGHT-85): a live bout's party keeps its needs, offline too.
  plainSys('battle-needs', 640, ALWAYS, ({ world }) => holdBattleNeeds(world)),
  plainSys('old-soul-calm', 650, ALWAYS, ({ world, events }) =>
    calmEternalReactions(world, events),
  ),
];

/**
 * R0476: systems that only scan state (where is the Keeper, what is in reach, which season)
 * and never read this step's events run twice a second, not ten times. Their results do not
 * depend on how often they run; the runner hands each the time it waited.
 */
const THROTTLED = new Set<string>(SYSTEM_THROTTLE.ids);
export const SYSTEMS: readonly SimSystem[] = orderSystems(
  SYSTEM_LIST.map((s) => (THROTTLED.has(s.id) ? { ...s, everyMs: SYSTEM_THROTTLE.everyMs } : s)),
);

/**
 * One fixed step with full fidelity. Returns the events that happened. `offline` is set by
 * catch-up for the leftover under a minute, so end-of-life checks follow the away rules.
 * The work is the ordered system list above (TECH-34).
 */
export function stepWorld(
  world: World,
  dtMs: number,
  wallMs?: number,
  offline = false,
  countPlay = true,
): SimEvent[] {
  const events: SimEvent[] = [];
  world.timeMs += dtMs;
  if (wallMs !== undefined) world.lastWallMs = wallMs;
  // R0544 (lane A r8): no antics while catching up on time away.
  setAnticsLive(!offline);

  runSystems(SYSTEMS, { world, dtMs, wallMs, offline, countPlay, events }, withRng);

  // Lifetime happiness sampling, once a sim second.
  if (Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000)) {
    sampleAll(world);
  }
  // R0474: the diary counts live play only.
  if (!offline) stepGroveDiary(world, dtMs, events);
  return events;
}

/**
 * The time between fruit drops now: the season (autumn) and Green Thumb change it. Live play
 * and offline catch-up both read it, so time away grows the same fruit as time here.
 */
export function fruitIntervalMs(world: World): number {
  const thumb = hasSkill(world, 'greenThumb') ? SKILLS.greenThumbFruitInterval : 1;
  return TREES.fruitIntervalMs * fruitIntervalMultiplier(world) * thumb;
}

function updateTrees(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  for (const tree of world.trees) {
    tree.fruitTimerMs -= dtMs;
    if (tree.fruitTimerMs <= 0) {
      tree.fruitTimerMs += fruitIntervalMs(world);
      if (world.items.filter((i) => i.kind === 'fruit').length >= TREES.maxFruitOnGround) continue;
      dropFruit(world, tree, rng, events);
    }
  }
}

export function dropFruit(world: World, tree: Tree, rng: Rng, events: SimEvent[]): Item {
  const a = rng.float(0, Math.PI * 2);
  const r = rng.float(0.8, TREES.dropRadius);
  const item: Item = {
    id: newId(world, 'fruit'),
    kind: 'fruit',
    pos: { x: tree.pos.x + Math.cos(a) * r, z: tree.pos.z + Math.sin(a) * r },
    y: 2.4,
    vel: { x: 0, y: 0, z: 0 },
  };
  world.items.push(item);
  events.push({ kind: 'fruitDropped', treeId: tree.id, itemId: item.id });
  // R0300: a Nubbin under the tree may get it on the head.
  fruitOnHead(world, item, tree.pos, events);
  return item;
}

function updateItems(world: World, dtMs: number): void {
  const dt = dtMs / 1000;
  for (const item of world.items) {
    if (item.y > 0) {
      item.vel.y -= THROW.gravity * dt;
      item.y = Math.max(0, item.y + item.vel.y * dt);
      if (item.y === 0) item.vel.y = 0;
    }
  }
}

export function positionOf(world: World, id: string): Vec2 | null {
  return findNubbin(world, id)?.pos ?? world.items.find((i) => i.id === id)?.pos ?? null;
}
