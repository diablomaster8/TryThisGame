import { CHAPTERS, SCENES, type Choice, type Scene } from '../config/story';
import { GROVE, TRUST } from '../config/tuning';
import { hatch } from './lifecycle';
import { npcNear, removeNpc, spawnNpc } from './npcs';
import { createEgg } from './nubbin';
import { TRAINERS } from './trainers';
import type { CampaignState, Command, Nubbin, SimEvent, World } from './types';
import { newId, uniqueName, withRng } from './world';

/**
 * The campaign state machine. Chapters open with a scene, wait for a goal, and close
 * with a scene. Scenes are queued here and shown by the UI, which answers with
 * `sceneDone`. Triggers (a Nubbin going Shadow, Sable bonding) queue extra scenes.
 * The ending is decided from flags when chapter 12 closes. Pure sim: no DOM, no
 * randomness outside the world's Rng.
 */

const SCENE_BY_ID = new Map<string, Scene>(SCENES.map((s) => [s.id, s]));

export function sceneById(id: string): Scene | undefined {
  return SCENE_BY_ID.get(id);
}

export function chapterDef(n: number) {
  return CHAPTERS.find((c) => c.n === n);
}

export const FINAL_CHAPTER = 12;

function freshState(nowMs: number): CampaignState {
  return {
    chapter: 0,
    step: 0,
    flags: {},
    friendship: {},
    queue: [],
    seen: [],
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
  };
}

function queue(c: CampaignState, scene: string): void {
  if (!SCENE_BY_ID.has(scene)) return;
  if (c.queue.includes(scene) || c.seen.includes(scene)) return;
  c.queue.push(scene);
}

/** Begin (or restart) the campaign in this world. */
export function startCampaign(world: World, events: SimEvent[]): void {
  const c = freshState(world.timeMs);
  world.campaign = c;
  world.npcs = [];
  for (const t of TRAINERS) if (t.id !== world.trainer) spawnNpc(world, t.id);
  // Moss: the old Eternal on the western hill.
  withRng(world, (rng) => {
    const hill = GROVE.hills[0];
    const moss = createEgg(newId(world, 'nub'), { x: hill.x + 2.5, z: hill.z - 2.5 }, rng, 'plain');
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
}

function beginChapter(world: World, c: CampaignState, n: number, events: SimEvent[]): void {
  c.chapter = n;
  c.step = 0;
  c.chapterStartMs = world.timeMs;
  const def = chapterDef(n);
  if (!def) return;
  switch (n) {
    case 3:
      spawnSable(world, c);
      break;
    case 5:
      spawnNpc(world, 'corvin');
      break;
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
      spawnNpc(world, 'corvin');
      break;
    case 10: {
      const moss = c.mossId ? world.nubbins.find((x) => x.id === c.mossId) : undefined;
      c.flags.mossFaded = !moss || moss.needs.affection < 40;
      for (const k of Object.keys(c.flags)) if (k.startsWith('lantern:')) delete c.flags[k];
      c.flags.lanternsRound = 2;
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
  queue(c, def.opening);
  events.push({ kind: 'chapter', chapter: n });
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

function sable(world: World, c: CampaignState): Nubbin | undefined {
  return c.sableId ? world.nubbins.find((n) => n.id === c.sableId) : undefined;
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
  sableTrust20: (w, c) => (sable(w, c)?.trust ?? 0) >= 20,
  lanternsAndMoss: (_w, c) => lanternsLit(c) >= 4 && Boolean(c.flags.mossPetted),
  winRace: (_w, c) => c.stats.races >= 1,
  talkDusty: (_w, c) => Boolean(c.flags[`talked:6:dusty`]),
  sableTrust45: (w, c) => (sable(w, c)?.trust ?? 0) >= 45,
  expedition: (_w, c) => c.stats.expeditions >= 1,
  corvinChoice: (_w, c) => typeof c.flags.corvin === 'string',
  lanternsAgain: (_w, c) => c.flags.lanternsRound === 2 && lanternsLit(c) >= 4,
  threeFriends: (_w, c) => talkedThisChapter(c) >= 3,
  finalChoice: (_w, c) => typeof c.flags.finalChoice === 'string',
};

/** Public, for the journal: is the current goal met. */
export function goalMet(world: World, c: CampaignState): boolean {
  const def = chapterDef(c.chapter);
  if (!def) return false;
  return GOALS[def.goal]?.(world, c) ?? false;
}

/** Which ending the flags add up to. Checked when chapter 12 closes. */
export function endingFor(world: World, c: CampaignState): string {
  const s = sable(world, c);
  const bonded = Boolean(s?.bond);
  if (c.flags.soldNubbin && !c.flags.boughtBack) return 'collector';
  if (!s) return 'empty-lantern';
  if (c.flags.eternalRaised && bonded) return 'eternal-dawn';
  if (c.flags.freedByForce && c.flags.letThemGo) return 'wild-grove';
  if (bonded && c.flags.corvin === 'reconciled' && !c.flags.mossFaded) return 'hazels-grove';
  if (bonded && c.flags.mossFaded) return 'moss-sleeps';
  if (bonded) return 'shadow-keeper';
  return 'long-road';
}

/** Counters the rest of the sim reports into. */
export function noteCampaign(
  world: World,
  what: 'pet' | 'feed' | 'throw' | 'raceWin' | 'expedition',
  nubbinId?: string,
): void {
  const c = world.campaign;
  if (!c) return;
  switch (what) {
    case 'pet':
      c.stats.pets += 1;
      if (nubbinId && nubbinId === c.mossId) {
        c.flags.mossPetted = true;
        queue(c, 't-moss-first-pet');
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
    case 'expedition':
      c.stats.expeditions += 1;
      break;
  }
}

/** Per step: fold events into stats and triggers, then advance the chapter machine. */
export function stepCampaign(world: World, dtMs: number, events: SimEvent[]): void {
  const c = world.campaign;
  if (!c || c.chapter === 0) return;
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
        if (e.nubbinId !== c.sableId) queue(c, 't-first-shadow');
        break;
      case 'ranAway':
        queue(c, 't-ran-away');
        break;
      case 'strayReturned':
        queue(c, 't-stray-returned');
        break;
      case 'shadowBonded':
        if (e.nubbinId === c.sableId) queue(c, 't-sable-bonded');
        break;
      default:
        break;
    }
  }
  if (c.chapter > FINAL_CHAPTER) return;
  // Once a sim second, and only while no scene is waiting.
  const crossed = Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000);
  if (!crossed || c.queue.length > 0) return;
  const def = chapterDef(c.chapter);
  if (!def) return;
  if (c.step === 0 && c.seen.includes(def.opening)) c.step = 1;
  if (c.step === 1 && goalMet(world, c)) {
    c.step = 2;
    queue(c, def.closing);
  }
  if (c.step === 2 && c.seen.includes(def.closing)) {
    if (c.chapter === FINAL_CHAPTER) {
      const ending = endingFor(world, c);
      c.ending = ending;
      c.chapter = FINAL_CHAPTER + 1;
      queue(c, `end-${ending}`);
      events.push({ kind: 'ending', ending });
    } else {
      beginChapter(world, c, c.chapter + 1, events);
    }
  }
}

function applyChoice(world: World, c: CampaignState, scene: string, choice: Choice): void {
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
    const s = sable(world, c);
    const bonus = Number(c.flags.sableTrustBonus ?? 0);
    if (s) s.trust = Math.max(TRUST.min, Math.min(TRUST.max, s.trust + bonus));
    if (s && choice.id === 'grab') {
      const edge = GROVE.size / 2 - 1.5;
      s.pos = { x: edge * 0.8, z: -edge * 0.8 };
    }
  }
  if (scene === 'c9-open' && choice.id === 'bargain') {
    world.inventory.shells = Math.max(0, world.inventory.shells - 200);
    const soldId = typeof c.flags.soldId === 'string' ? c.flags.soldId : null;
    const stray = soldId ? world.strays.find((s) => s.nubbin.id === soldId) : undefined;
    if (stray && world.nubbins.length < 8) {
      world.strays = world.strays.filter((s) => s !== stray);
      const n = stray.nubbin;
      n.pos = { x: world.keeper.pos.x + 1, z: world.keeper.pos.z + 1 };
      n.trust = 20;
      n.stray = false;
      n.behavior.state = 'sit';
      world.nubbins.push(n);
    }
  }
}

export function applyCampaignCommand(world: World, cmd: Command, events: SimEvent[]): void {
  switch (cmd.kind) {
    case 'campaignStart':
      startCampaign(world, events);
      return;
    case 'sceneDone': {
      const c = world.campaign;
      if (!c) return;
      const scene = SCENE_BY_ID.get(cmd.scene);
      c.queue = c.queue.filter((s) => s !== cmd.scene);
      if (!c.seen.includes(cmd.scene)) c.seen.push(cmd.scene);
      if (!scene) return;
      if (scene.set) Object.assign(c.flags, scene.set);
      const choice = scene.choices?.find((ch) => ch.id === cmd.choice);
      if (choice) applyChoice(world, c, cmd.scene, choice);
      return;
    }
    case 'talk': {
      const c = world.campaign;
      const npc = npcNear(world, cmd.npcId);
      if (!c || !npc) return;
      c.stats.talks += 1;
      c.friendship[npc.trainer] = (c.friendship[npc.trainer] ?? 0) + 1;
      c.flags[`talked:${c.chapter}:${npc.trainer}`] = true;
      events.push({ kind: 'talked', npcId: npc.id });
      world.keeper.facing = Math.atan2(npc.pos.x - world.keeper.pos.x, npc.pos.z - world.keeper.pos.z);
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
    case 'debugChapter': {
      const c = world.campaign;
      if (!c) return;
      c.queue = [];
      beginChapter(world, c, Math.max(1, Math.min(FINAL_CHAPTER, cmd.chapter)), events);
      return;
    }
    default:
      return;
  }
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
