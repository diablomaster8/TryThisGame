import { hasRoom, mossSeat } from './roster';
import { CHAPTERS, type Choice } from '../config/story';
import { GROVE, STORY, TRUST } from '../config/tuning';
import { endingScenes, followUps, openingFor, walkScene } from './campaign-routes';
import { hatch } from './lifecycle';
import { npcNear, removeNpc, spawnNpc } from './npcs';
import { createEgg } from './nubbin';
import {
  noteSideRace,
  sideAct,
  sideHolds,
  sideHoldsOpening,
  sideOpen,
  sideSceneDone,
  sideState,
  stepSideStories,
} from './side-stories';
import { noteSceneWords } from './lang';
import { pickBark } from './barks';
import { sceneById, sceneFor } from './story-scenes';
import { campaignSeason, ensureTrainers, syncSceneGuests } from './scene-cast';
import {
  collectorRoute,
  noteSceneEnded,
  queueScene,
  resting,
  sableOf,
  sceneTimeHolds,
  seen,
} from './story-state';
import './storyline-rules-index';
import {
  applyStorylineCommand,
  startStoryline,
  stepStoryline,
  stepStorylineEvents,
  foldCounters,
  storyGoalMet,
  storySceneDone,
} from './storyline';
import type { CampaignState, Command, Location, SimEvent, World } from './types';
import { newId, uniqueName, withRng } from './world';

/**
 * The campaign state machine. Chapters open with a scene, wait for a goal, and close
 * with a scene. Scenes are queued here and shown by the UI, which answers with
 * `sceneDone`; what follows each scene comes from campaign-routes.ts. Triggers (a Nubbin
 * going Shadow, Sable bonding) queue extra scenes. Side stories the campaign waits on
 * (side-stories.ts) can hold a chapter's close or the next chapter's start. The ending
 * is decided from flags when chapter 12 closes. Pure sim: no DOM, no randomness outside
 * the world's Rng.
 */

export { sceneById };

/**
 * Where each of Hazel's chapters is played (campaign graphics H1): the Hollow for 8,
 * Corvin's garden for 9, the Grove otherwise. The debug chapter jump moves there before
 * `beginChapter`, so a jump that skips a chapter's own move (9 to 11 skips 10's return
 * home) still lands in the right place.
 */
export const HAZEL_HOME: Readonly<Record<number, Location>> = { 8: 'hollow', 9: 'corvin' };

export function hazelHome(n: number): Location {
  return HAZEL_HOME[n] ?? 'grove';
}

export function chapterDef(n: number) {
  return CHAPTERS.find((c) => c.n === n);
}

export const FINAL_CHAPTER = 12;

const LANTERNS = ['lantern-1', 'lantern-2', 'lantern-3', 'lantern-4'];

function freshState(nowMs: number): CampaignState {
  return {
    chapter: 0,
    step: 0,
    flags: {},
    friendship: {},
    queue: [],
    seen: [],
    seenMs: {},
    chapterStartMs: nowMs,
    ending: null,
    sableId: null,
    mossId: null,
    stats: {
      pets: 0,
      feeds: 0,
      throws: 0,
      hatched: 0,
      evolved: 0,
      reborn: 0,
      departed: 0,
      races: 0,
      expeditions: 0,
      lanterns: 0,
      talks: 0,
    },
    side: {},
    fun: {},
    vigil: null,
    openedMs: null,
    goalMetMs: null,
    storyline: null,
  };
}

/** Fresh state for a storyline (sim/storyline.ts), public for its tests. */
export function freshCampaignState(nowMs: number): CampaignState {
  return freshState(nowMs);
}

/** Begin (or restart) the campaign in this world. */
export function startCampaign(world: World, events: SimEvent[]): void {
  const oldMossId = world.campaign?.mossId ?? null;
  const c = freshState(world.timeMs);
  world.campaign = c;
  // All ten valley Keepers, the player's pick included: the player is Hazel's grandchild.
  world.npcs = [];
  ensureTrainers(world);
  world.season = campaignSeason(c);
  // A restart leaves the last campaign's Moss behind; there is only ever one.
  if (oldMossId) world.nubbins = world.nubbins.filter((n) => n.id !== oldMossId);
  // Moss: the old Eternal on the western hill. He stays off the roster until he comes down.
  withRng(world, (rng) => {
    const moss = createEgg(newId(world, 'nub'), mossSeat(world), rng, 'plain');
    moss.name = 'Moss';
    hatch(moss, [], world.timeMs);
    moss.stage = 'adult';
    moss.stageMs = 0;
    moss.form = {
      band: 'neutral',
      type: 'normal',
      second: null,
      leanAtEvolution: { ...moss.typeLean },
    };
    moss.eternal = 'neutral';
    moss.rebirths = 2;
    moss.trust = 90;
    moss.needs.affection = 30;
    moss.behavior.state = 'sit';
    moss.behavior.untilMs = world.timeMs + 60_000;
    world.nubbins.push(moss);
    c.mossId = moss.id;
  });
  beginChapter(world, c, 1, events);
  queueOpening(world, c);
}

function beginChapter(world: World, c: CampaignState, n: number, events: SimEvent[]): void {
  c.chapter = n;
  c.step = 0;
  c.chapterStartMs = world.timeMs;
  c.openedMs = null;
  c.goalMetMs = null;
  const def = chapterDef(n);
  if (!def) return;
  switch (n) {
    case 3:
      spawnSable(world, c);
      break;
    case 5:
      spawnNpc(world, 'corvin');
      break;
    case 8: {
      // Into the Hollow: Hazel's notebook waits on a flat stone past the trees.
      setLocation(world, 'hollow', events);
      world.items = world.items.filter((i) => i.kind !== 'notebook');
      world.items.push({
        id: newId(world, 'item'),
        kind: 'notebook',
        pos: { x: -9, z: -9 },
        y: 0,
        vel: { x: 0, y: 0, z: 0 },
      });
      break;
    }
    case 6: {
      const hill = GROVE.hills[0];
      world.memorials.push({
        id: `memorial-fossil`,
        name: 'Fossil',
        pos: { x: hill.x + 3.5, z: hill.z - 1 },
      });
      break;
    }
    case 9:
      setLocation(world, 'corvin', events);
      spawnNpc(world, 'corvin');
      break;
    case 10: {
      setLocation(world, 'grove', events);
      const moss = c.mossId ? world.nubbins.find((x) => x.id === c.mossId) : undefined;
      c.flags.mossFaded = !moss || moss.needs.affection < 40;
      for (const k of Object.keys(c.flags)) if (k.startsWith('lantern:')) delete c.flags[k];
      c.flags.lanternsRound = 2;
      c.vigil = null;
      removeNpc(world, 'corvin');
      break;
    }
    case 11:
      spawnNpc(world, 'hazel');
      for (const k of Object.keys(c.flags)) if (k.startsWith('talked:')) delete c.flags[k];
      break;
    default:
      break;
  }
  events.push({ kind: 'chapter', chapter: n });
}

/**
 * Queue the chapter's opening (or its variant, marking the plain id seen so the
 * chapter machine moves on once the variant has played).
 */
function queueOpening(world: World, c: CampaignState): void {
  const def = chapterDef(c.chapter);
  if (!def || seen(c, def.opening) || c.queue.includes(def.opening)) return;
  const { before, opening } = openingFor(c, c.chapter, def.opening);
  for (const s of before) queueScene(c, s);
  queueScene(c, opening);
  if (opening !== def.opening) c.seen.push(def.opening);
}

function spawnSable(world: World, c: CampaignState): void {
  if (c.sableId && world.nubbins.some((n) => n.id === c.sableId)) return;
  withRng(world, (rng) => {
    const edge = GROVE.size / 2 - 1.5;
    const sable = createEgg(newId(world, 'nub'), { x: -edge, z: edge * 0.7 }, rng, 'plain');
    sable.name = uniqueName(world, 'Sable', rng);
    hatch(sable, [], world.timeMs);
    sable.shadow = true;
    sable.bond = false;
    sable.stray = true;
    sable.trust = 10;
    sable.needs.hunger = 0.5;
    sable.behavior.state = 'sit';
    sable.behavior.untilMs = world.timeMs + 8000;
    world.nubbins.push(sable);
    c.sableId = sable.id;
  });
}

function lanternsLit(c: CampaignState): number {
  return Object.keys(c.flags).filter((k) => k.startsWith('lantern:') && c.flags[k]).length;
}

function talkedThisChapter(c: CampaignState): number {
  return Object.keys(c.flags).filter((k) => k.startsWith(`talked:${c.chapter}:`)).length;
}

/** Goal checks by id. */
const GOALS: Record<string, (world: World, c: CampaignState) => boolean> = {
  firstHatch: (_w, c) => c.stats.hatched >= 1 && c.stats.pets >= 1,
  feedTwice: (_w, c) => c.stats.feeds >= 2,
  sableTrust20: (w, c) => (sableOf(w, c)?.trust ?? 0) >= 20,
  lanternsAndMoss: (_w, c) => lanternsLit(c) >= 4 && Boolean(c.flags.mossPetted),
  winRace: (_w, c) => c.stats.races >= 1,
  talkDusty: (_w, c) => Boolean(c.flags[`talked:6:dusty`]),
  sableTrust45: (w, c) => (sableOf(w, c)?.trust ?? 0) >= 45,
  expedition: (_w, c) => c.stats.expeditions >= 1,
  notebook: (_w, c) => Boolean(c.flags.notebookFound),
  corvinChoice: (_w, c) => typeof c.flags.corvin === 'string',
  lanternsAgain: (_w, c) => c.flags.lanternsRound === 2 && lanternsLit(c) >= 4,
  threeFriends: (_w, c) => talkedThisChapter(c) >= 3,
  finalChoice: (_w, c) => typeof c.flags.finalChoice === 'string',
};

/** Public, for the journal: is the current goal met. */
export function goalMet(world: World, c: CampaignState): boolean {
  if (c.storyline) return storyGoalMet(world, c);
  const def = chapterDef(c.chapter);
  if (!def) return false;
  return GOALS[def.goal]?.(world, c) ?? false;
}

/**
 * Moss has faded: his affection was under 40 when chapter 10 began, or he carried the
 * stone into the Wellspring and did not come back out.
 */
export function mossFaded(c: CampaignState): boolean {
  if (c.flags.mossFaded) return true;
  return c.flags.stoneUnmadeBy === 'moss' && c.flags.mossReturned !== true;
}

/** Which ending the flags add up to, in the bible's order. Checked when chapter 12 closes. */
export function endingFor(world: World, c: CampaignState): string {
  const s = sableOf(world, c);
  const bonded = Boolean(s?.bond);
  if (collectorRoute(c) || c.flags.keptStone) return 'collector';
  if (!s) return 'empty-lantern';
  if (c.flags.eternalRaised && bonded) return 'eternal-dawn';
  if (c.flags.freedByForce && c.flags.letThemGo) return 'wild-grove';
  // Either final choice: "Open" plays a body variant (endingScenes).
  if (bonded && c.flags.corvin === 'reconciled' && !mossFaded(c)) return 'hazels-grove';
  if (bonded && mossFaded(c)) return 'moss-sleeps';
  if (bonded) return 'shadow-keeper';
  return 'long-road';
}

/**
 * S9 has had its chance, so chapter 11 may close: s9-ask and s9-word have played, or S9
 * jumped to its dawn gate scene, or it cannot run (the stone was kept).
 */
export function s9HadItsChance(c: CampaignState): boolean {
  if (c.flags.keptStone) return true;
  const st = sideState(c, 's9');
  if (!st) return false;
  return st.status !== 'open' || (st.step >= 2 && st.stage !== 'wait' && st.stage !== 'scene');
}

/** Side stories that hold this chapter's closing scene. */
function closingHeld(world: World, c: CampaignState): boolean {
  if (sideHolds(world, c, 'close')) return true;
  switch (c.chapter) {
    case 5: {
      // S5 must finish before c5-close: c6-open is Fossil's farewell.
      const st = sideState(c, 's5');
      return !st || st.status === 'open';
    }
    case 11:
      return !s9HadItsChance(c);
    default:
      return false;
  }
}

/** Side stories that hold the start of the next chapter. */
function nextChapterHeld(world: World, c: CampaignState): boolean {
  if (sideHolds(world, c, 'next')) return true;
  switch (c.chapter) {
    case 8: {
      // S27 closes before chapter 9 opens; S28's autumn steps (1–10) hold c9-open.
      if (sideOpen(c, 's27')) return true;
      const s28 = sideState(c, 's28');
      return !s28 || (s28.status === 'open' && s28.step <= 9);
    }
    case 11: {
      // S10's step 4 scene plays on the eve of chapter 12, before it begins.
      const s10 = sideState(c, 's10');
      if (!s10 || s10.status !== 'open') return false;
      return s10.step < 3 || (s10.step === 3 && (s10.stage === 'wait' || s10.stage === 'scene'));
    }
    default:
      return false;
  }
}

/** Counters the rest of the sim reports into. */
export function noteCampaign(
  world: World,
  what: 'pet' | 'feed' | 'throw' | 'raceWin' | 'raceEntered' | 'expedition',
  nubbinId?: string,
): void {
  const c = world.campaign;
  if (!c) return;
  switch (what) {
    case 'pet':
      c.stats.pets += 1;
      if (nubbinId && nubbinId === c.mossId) {
        c.flags.mossPetted = true;
        // Before c4-open he has not spoken yet.
        queueScene(c, c.chapter < 4 ? 't-moss-first-pet-early' : 't-moss-first-pet');
      }
      break;
    case 'feed':
      c.stats.feeds += 1;
      break;
    case 'throw':
      c.stats.throws += 1;
      break;
    case 'raceWin':
      c.stats.races += 1;
      break;
    case 'raceEntered':
      noteSideRace(c);
      break;
    case 'expedition':
      c.stats.expeditions += 1;
      break;
  }
}

/** Chapter 10's vigil: hold all four lanterns until dawn; the cold blows them out. */
function stepVigil(world: World, c: CampaignState, dtMs: number, events: SimEvent[]): void {
  const v = c.vigil;
  if (!v || v.done || c.queue.length > 0) return;
  if (LANTERNS.every((id) => c.flags[`lantern:${id}`])) v.progressMs += dtMs;
  const t = v.progressMs / STORY.vigilMs;
  const wave = STORY.vigilWaves[v.waves];
  if (wave !== undefined && t >= wave) {
    // Wave one blows out the stream lantern; wave two shrinks the Long-Grass lantern to
    // a blue bead (it stays lit, and renders low until dawn).
    const id = STORY.vigilWaveLanterns[v.waves];
    if (v.waves === 0 && id) {
      delete c.flags[`lantern:${id}`];
      events.push({ kind: 'lanternOut', id });
    } else if (id) {
      c.flags[`lanternLow:${id}`] = true;
    }
    v.waves += 1;
  }
  if (!v.lull && t >= STORY.vigilLullAt) {
    v.lull = true;
    queueScene(c, 'c10-lull');
  }
  if (t >= 1) {
    v.done = true;
    for (const k of Object.keys(c.flags)) if (k.startsWith('lanternLow:')) delete c.flags[k];
    queueScene(c, 'c10-falls');
  }
}

/** The chapter machine, once a sim second while no scene is waiting. */
function stepChapter(world: World, c: CampaignState, events: SimEvent[]): void {
  const def = chapterDef(c.chapter);
  if (!def) return;
  if (c.step === 0) {
    // Chapter 12 opens once S9's dawn gate scene has played.
    if (c.chapter === 12 && sideOpen(c, 's9')) return;
    if (sideHoldsOpening(world, c)) return;
    if (!seen(c, def.opening)) {
      // A breath after the last scene, and the time of day the opening names.
      if (resting(world, c) || !sceneTimeHolds(world.timeMs, def.opening)) return;
      queueOpening(world, c);
      return;
    }
    c.step = 1;
    c.openedMs = world.timeMs;
  }
  if (c.step === 1) {
    if (!goalMet(world, c)) return;
    c.goalMetMs ??= world.timeMs;
    if (closingHeld(world, c)) return;
    // The closing answers what the player just did, so it follows the goal after a short
    // settle; the goal phase's minimum and the breather hold the next opening instead.
    // A side story that opened in this chapter still gets the whole goal phase to run
    // (S31's dawn and dusk steps need it before Gourd Night holds the closing).
    if (c.queue.length > 0) return;
    const opened = c.openedMs ?? world.timeMs;
    const sideBusy = Object.values(c.side).some((s) => s.status === 'open' && s.openedMs >= opened);
    const quickGoal = STORY.goalsInOpening.includes(def.goal);
    if (sideBusy && !quickGoal && world.timeMs < opened + STORY.goalMinMs) return;
    if (sideBusy ? resting(world, c) : c.rest && world.timeMs < c.rest.atMs + STORY.closingSettleMs)
      return;
    if (c.chapter !== 10 && !sceneTimeHolds(world.timeMs, def.closing)) return;
    c.step = 2;
    if (c.chapter === 10) {
      // The fellowship scene, then the vigil; c10-close comes at the end of the night.
      queueScene(c, 'c10-vigil');
      return;
    }
    if (c.chapter !== FINAL_CHAPTER) {
      queueScene(c, def.closing);
      return;
    }
  }
  if (c.step !== 2) return;
  if (c.chapter === 10 && seen(c, 'c10-vigil') && !c.vigil) {
    c.vigil = { progressMs: 0, waves: 0, lull: false, done: false };
    return;
  }
  if (c.chapter === FINAL_CHAPTER && !seen(c, def.closing)) {
    // The walk (after S10's foot-of-the-hill choice, if S10 is still running), then c12-close.
    const s10 = sideState(c, 's10');
    if (s10?.status === 'open' && s10.step < 4) return;
    const walk = walkScene(c);
    if (!seen(c, walk)) queueScene(c, walk);
    else queueScene(c, def.closing);
    return;
  }
  if (!seen(c, def.closing)) return;
  if (c.chapter === FINAL_CHAPTER) {
    // S10's letter plays the morning after, before the ending.
    if (sideOpen(c, 's10')) return;
    const ending = endingFor(world, c);
    c.ending = ending;
    c.chapter = FINAL_CHAPTER + 1;
    for (const s of endingScenes(world, c, ending)) queueScene(c, s);
    events.push({ kind: 'ending', ending });
    return;
  }
  if (nextChapterHeld(world, c)) return;
  // The goal phase is played, not skipped in seconds: a chapter lasts at least goalMinMs.
  const quick = STORY.goalsInOpening.includes(def.goal);
  if (!quick && world.timeMs < (c.openedMs ?? world.timeMs) + STORY.goalMinMs) return;
  // A breath after the closing, and the next opening's hour, before the chapter card.
  const next = chapterDef(c.chapter + 1);
  if (resting(world, c) || (next && !sceneTimeHolds(world.timeMs, next.opening))) return;
  // The opening queues on the next tick, once any side story due first has had its turn.
  beginChapter(world, c, c.chapter + 1, events);
}

/** Per step: fold events into stats and triggers, then advance the chapter machine. */
export function stepCampaign(world: World, dtMs: number, events: SimEvent[]): void {
  const c = world.campaign;
  if (!c || c.chapter === 0) return;
  if (c.storyline) {
    stepStorylineEvents(world, c, events);
    const tick = Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000);
    if (tick && c.queue.length === 0) stepStoryline(world, c, events);
    return;
  }
  foldCounters(c, events);
  for (const e of events) {
    switch (e.kind) {
      case 'hatched':
        c.stats.hatched += 1;
        break;
      case 'evolved':
        c.stats.evolved += 1;
        break;
      case 'reborn':
        c.stats.reborn += 1;
        break;
      case 'departed':
        c.stats.departed += 1;
        break;
      case 'eternal':
        if (e.nubbinId !== c.mossId) c.flags.eternalRaised = true;
        break;
      case 'turnedShadow':
        if (e.nubbinId !== c.sableId) queueScene(c, 't-first-shadow');
        break;
      case 'ranAway':
        queueScene(c, 't-ran-away');
        break;
      case 'strayReturned':
        queueScene(c, 't-stray-returned');
        break;
      case 'shadowBonded':
        if (e.nubbinId === c.sableId) queueScene(c, 't-sable-bonded');
        break;
      default:
        break;
    }
  }
  // Hazel's Grove sets the Grove's season to its chapter's (review 2026-10-24, item 2).
  world.season = campaignSeason(c);
  // After the ending the chapter machine is done, but the spring stories still run.
  const over = c.chapter > FINAL_CHAPTER;
  if (!over) stepVigil(world, c, dtMs, events);
  // Once a sim second.
  const crossed = Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000);
  if (!crossed) return;
  // Moss comes down in chapter 7 and joins the roster as soon as there is room for him.
  if (c.mossId && !c.flags.mossDown && (c.chapter >= 8 || c.seen.includes('c7-stillness'))) {
    if (hasRoom(world)) c.flags.mossDown = true;
  }
  ensureTrainers(world);
  syncSceneGuests(world, c);
  // Nothing new starts underground in the Hollow Below; it waits for the Grove (item 4).
  if (world.location === 'dungeon') return;
  if (!over && c.queue.length === 0) stepChapter(world, c, events);
  stepSideStories(world, c, events);
  syncSceneGuests(world, c);
}

/** Bring the sold Nubbin home from the strays (c9-open's bargain, S27's buy-back). */
function bringSoldHome(world: World, c: CampaignState): void {
  const soldId = typeof c.flags.soldId === 'string' ? c.flags.soldId : null;
  const stray = soldId ? world.strays.find((s) => s.nubbin.id === soldId) : undefined;
  if (!stray) return;
  if (!hasRoom(world)) {
    // The Grove is full: it waits in the strays and walks to the gate once there is room.
    stray.nubbin.trust = 20;
    stray.returnsAtMs = world.timeMs;
    return;
  }
  world.strays = world.strays.filter((s) => s !== stray);
  const n = stray.nubbin;
  n.pos = { x: world.keeper.pos.x + 1, z: world.keeper.pos.z + 1 };
  n.trust = 20;
  n.stray = false;
  n.behavior.state = 'sit';
  world.nubbins.push(n);
}

function applyChoice(
  world: World,
  c: CampaignState,
  scene: string,
  choice: Choice,
  before: { collector: boolean },
): void {
  if (choice.set) Object.assign(c.flags, choice.set);
  for (const [id, d] of Object.entries(choice.friendship ?? {})) {
    c.friendship[id] = (c.friendship[id] ?? 0) + d;
  }
  // Side effects that touch the world.
  if (scene === 'c2-corvin' && choice.id === 'sell') {
    const victim = world.nubbins.find(
      (n) => n.id !== c.mossId && n.id !== c.sableId && n.stage !== 'egg',
    );
    if (victim) {
      world.nubbins = world.nubbins.filter((n) => n.id !== victim.id);
      if (world.selected === victim.id) world.selected = null;
      if (world.keeper.carrying === victim.id) world.keeper.carrying = null;
      victim.shadow = true;
      victim.trust = 5;
      world.strays.push({ nubbin: victim, leftAtMs: world.timeMs, returnsAtMs: Infinity });
      c.flags.soldId = victim.id;
    }
    world.inventory.shells += 200;
  }
  if (scene === 'c3-open') {
    const s = sableOf(world, c);
    const bonus = Number(c.flags.sableTrustBonus ?? 0);
    if (s) s.trust = Math.max(TRUST.min, Math.min(TRUST.max, s.trust + bonus));
    if (s && choice.id === 'grab') {
      const edge = GROVE.size / 2 - 1.5;
      s.pos = { x: edge * 0.8, z: -edge * 0.8 };
    }
  }
  if ((scene === 'c9-open' || scene === 'c9-open-sold') && choice.id === 'bargain') {
    world.inventory.shells = Math.max(0, world.inventory.shells - 200);
    bringSoldHome(world, c);
  }
  // S27's buy-back: only on the sold path, judged before the choice wrote boughtBack.
  if (scene === 's27-home' && (choice.id === 'pay' || choice.id === 'hat') && before.collector) {
    if (choice.id === 'pay') {
      world.inventory.shells = Math.max(0, world.inventory.shells - STORY.buyBackShells);
    }
    bringSoldHome(world, c);
  }
}

/** Moss leaves the world (faded at dawn, or never came up from the Wellspring). */
function removeMoss(world: World, c: CampaignState): void {
  if (!c.mossId) return;
  world.nubbins = world.nubbins.filter((n) => n.id !== c.mossId);
  if (world.selected === c.mossId) world.selected = null;
  if (world.keeper.carrying === c.mossId) world.keeper.carrying = null;
}

/** His flower: on the hill, by the flat stone where he always sat. */
function mossFlower(world: World): void {
  if (world.memorials.some((m) => m.id === 'memorial-moss')) return;
  const hill = GROVE.hills[0];
  world.memorials.push({
    id: 'memorial-moss',
    name: 'Moss',
    pos: { x: hill.x + 2.5, z: hill.z - 2.5 },
  });
}

/** World side effects of the campaign's own scenes. */
function campaignSceneDone(world: World, c: CampaignState, scene: string): void {
  switch (scene) {
    case 'c10-bank-moss-gone':
      removeMoss(world, c);
      break;
    case 'c10-moss-fades':
      removeMoss(world, c);
      mossFlower(world);
      break;
    case 'c10-moss-mourned':
      mossFlower(world);
      break;
    default:
      break;
  }
}

export function applyCampaignCommand(world: World, cmd: Command, events: SimEvent[]): void {
  switch (cmd.kind) {
    case 'campaignStart':
      startCampaign(world, events);
      return;
    case 'storylineStart':
      startStoryline(world, freshState(world.timeMs), cmd.id, events, cmd.flags ?? {});
      return;
    case 'storyArea':
    case 'storyAct': {
      const c = world.campaign;
      if (c?.storyline) applyStorylineCommand(world, c, cmd, events);
      return;
    }
    case 'sceneDone': {
      const c = world.campaign;
      if (!c) return;
      const scene = sceneById(cmd.scene);
      c.queue = c.queue.filter((s) => s !== cmd.scene);
      if (!c.seen.includes(cmd.scene)) {
        c.seen.push(cmd.scene);
        c.seenMs[cmd.scene] = world.timeMs;
      }
      noteSceneEnded(world, c, cmd.scene);
      if (!scene) return;
      const before = { collector: collectorRoute(c) };
      if (scene.set) Object.assign(c.flags, scene.set);
      const choice = scene.choices?.find((ch) => ch.id === cmd.choice);
      if (choice) applyChoice(world, c, cmd.scene, choice, before);
      if (c.storyline) {
        storySceneDone(world, c, cmd.scene, cmd.choice, events);
        return;
      }
      campaignSceneDone(world, c, cmd.scene);
      sideSceneDone(world, c, cmd.scene, events);
      if (world.edu) {
        // The course words in the version the child saw (CV3); a picked choice uses its words.
        const shown = sceneFor(world, cmd.scene);
        const picked = shown?.choices?.find((ch) => ch.id === cmd.choice);
        const lines = [...(shown?.lines ?? []), ...(picked?.then ?? [])];
        noteSceneWords(world, lines, picked?.label ?? null, events);
      }
      for (const next of followUps(world, c, cmd.scene)) queueScene(c, next);
      return;
    }
    case 'talk': {
      const c = world.campaign;
      const npc = npcNear(world, cmd.npcId);
      if (!c || !npc) return;
      c.stats.talks += 1;
      c.friendship[npc.trainer] = (c.friendship[npc.trainer] ?? 0) + 1;
      c.flags[`talked:${c.chapter}:${npc.trainer}`] = true;
      // R0295: the Keeper says something of their own (content/barks.ts).
      const bark = withRng(world, (rng) => pickBark(world, npc.trainer, c.chapter, rng));
      events.push({ kind: 'talked', npcId: npc.id, ...(bark ? { bark } : {}) });
      world.keeper.facing = Math.atan2(
        npc.pos.x - world.keeper.pos.x,
        npc.pos.z - world.keeper.pos.z,
      );
      return;
    }
    case 'lightLantern': {
      const c = world.campaign;
      if (!c) return;
      if (c.flags[`lantern:${cmd.id}`]) return;
      c.flags[`lantern:${cmd.id}`] = true;
      c.stats.lanterns += 1;
      events.push({ kind: 'lanternLit', id: cmd.id });
      return;
    }
    case 'sideAct': {
      const c = world.campaign;
      if (c) sideAct(world, c, cmd.story);
      return;
    }
    case 'debugChapter': {
      const c = world.campaign;
      if (!c) return;
      if (c.storyline) {
        applyStorylineCommand(world, c, cmd, events);
        return;
      }
      c.queue = [];
      c.rest = null;
      const n = Math.max(1, Math.min(FINAL_CHAPTER, cmd.chapter));
      if (world.location !== 'dungeon') setLocation(world, hazelHome(n), events);
      beginChapter(world, c, n, events);
      // A jump always plays the chapter's opening, even one already seen (the current
      // chapter included).
      const def = chapterDef(n);
      if (def) {
        const { before, opening } = openingFor(c, n, def.opening);
        const again = new Set([def.opening, opening, ...before]);
        c.seen = c.seen.filter((id) => !again.has(id));
      }
      queueOpening(world, c);
      return;
    }
    default:
      return;
  }
}

/** Travel between the Grove, the Hollow and Corvin's garden. */
export function setLocation(world: World, location: Location, events: SimEvent[]): void {
  if (world.location === location) return;
  world.location = location;
  world.keeper.pos = { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
  events.push({ kind: 'located', location });
}

/** Lanterns lit this round, for the renderer. */
export function litLanterns(world: World): Set<string> {
  const out = new Set<string>();
  const c = world.campaign;
  if (!c) return out;
  for (const k of Object.keys(c.flags)) {
    if (k.startsWith('lantern:') && c.flags[k]) out.add(k.slice('lantern:'.length));
  }
  return out;
}
