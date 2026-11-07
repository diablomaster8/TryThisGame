import {
  fruitIntervalMs,
  dropFruit,
  stepKeeperSystem,
  stepNubbins,
  updateItems,
  updateTrees,
} from './world-step';
import { createWorld, defaultSettings, uniqueName } from './world-create';
import { findNubbin, hatchSpeed, heldNubbin, newId, positionOf, withRng } from './world-util';
import { stepGroveDiary } from './grove-diary';
import { runHandler } from './commands';
import { orderSystems, runSystems, type SimSystem, type StepCtx, type SystemRuns } from './systems';
import { stepBattleMoves } from './battle';
import { holdBattleNeeds } from './battle/resume';
import { sampleAll } from './behavior';
import { stepTrust } from './trust';
import { seasonAt, stepWeather } from './weather';
import { tzOf } from './local-time';
import { stepBreeding } from './breeding';
import { stepCollection } from './collection';
import { stepDaily } from './daily';
import { stepPlants } from './plants';
import { queueQuestEvents, stepQuests } from './quests';
import { stepHabitats } from './habitats';
import { stepKeeper2 } from './coop';
import { stepLandmarks } from './landmarks';
import { stepCollectibles } from './collectibles';
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
import { noteCalendarSeason } from './ice';
import { stepLittleGrove } from './little-grove';
import { stepCottageHide } from './cottage-hide';
import { stepCrying } from './cry-soul';
import { stepShadowSoul } from './shadow-soul';
import { stepFavSpots } from './fav-spot';
import { calmEternalReactions } from './old-soul';
import { stepSoulGroups } from './soul-groups';
import { stepFriendships } from './friendships';
import { stepKeeperIdle } from './keeper-idle';
import { stepSeasons } from './seasons';
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
import { Rng } from './rng';
import { stepTown } from './town';
import { stepSlips } from './slips';
import { stepMoody } from './soul-idle';
import { setAnticsLive } from './antics';
import { stepDiary } from './diary';
import { stepPartners } from './partners';
import { stepCurfew } from './curfew';
import { hollowBattleEnded, stepDungeon } from './dungeon';
import { stepSkillPoints } from './skills';
import { stepScans } from './scans';
import { stepTeams } from './teams';
import { stepEdu } from './edu';
/* Lane E r9 */
import { type Command, type SimEvent, type World } from './types';
import { SYSTEM_THROTTLE } from '../config/tuning-r13d3';
import { stepLevelWatch } from './level-watch';

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

// ---------- stepping ----------

const LIVE_ONLY: SystemRuns = { live: true, offline: false, coarse: false };
const ALWAYS: SystemRuns = { live: true, offline: true, coarse: true };

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
    noteCalendarSeason(world); // R0118: only a real calendar winter freezes the pond
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

export {
  createWorld,
  defaultSettings,
  uniqueName,
  dropFruit,
  fruitIntervalMs,
  findNubbin,
  hatchSpeed,
  heldNubbin,
  newId,
  positionOf,
  withRng,
};
