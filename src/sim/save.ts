import { GROVE, OFFLINE, TREES, TRUST } from '../config/tuning';
import { sceneById } from './story-scenes';
import { createWeather } from './weather';
import { npcHome } from './npcs';
import { GRADES, STAT_KEYS, type Grade, type World } from './types';
import { sanitizeMatureContent, sanitizeOfflineAging } from './audience';
import { defaultSettings } from './world';

export const SAVE_VERSION = 5;

export interface SaveFile {
  version: number;
  savedAtWallMs: number;
  world: World;
}

/**
 * One migration per version bump: index n-1 upgrades a version-n save to n+1.
 */
export const MIGRATIONS: Array<(data: Record<string, unknown>) => Record<string, unknown>> = [
  // 1 → 2: trust and Shadow, strays, visiting Keepers and the campaign.
  (data) => {
    const world = data.world as Record<string, unknown> | undefined;
    if (world) {
      world.strays ??= [];
      world.npcs ??= [];
      world.campaign ??= null;
      const nubbins = Array.isArray(world.nubbins)
        ? (world.nubbins as Record<string, unknown>[])
        : [];
      for (const n of nubbins) {
        n.trust ??= TRUST.start;
        n.shadow ??= false;
        n.bond ??= false;
        n.stray ??= false;
        n.lowTrustSinceMs ??= -1;
        n.lessons ??= {};
        n.courtingUntilMs ??= 0;
        n.parents ??= null;
        n.generation ??= 0;
        n.karate ??= { wins: 0, losses: 0, belt: 0 };
        n.friends ??= {};
        n.scarf ??= null;
        n.glasses ??= false;
        n.hatDye ??= null;
        n.slips ??= [];
        n.slipCount ??= 0;
        n.wellRaised ??= false;
        n.moody ??= null;
        n.memory ??= 'lesson';
        n.ancestry ??= [];
        n.heirloom ??= false;
      }
    }
    return data;
  },
  // 2 → 3: the "Mature content" setting and the one-time rift confirmation.
  (data) => {
    const world = data.world as Record<string, unknown> | undefined;
    const settings = world?.settings as Record<string, unknown> | undefined;
    if (settings) {
      settings.matureContent ??= 'off';
      settings.riftConfirmed ??= false;
    }
    return data;
  },
  // 3 → 4: story keepsakes and the fun-quest runner's state.
  (data) => {
    const world = data.world as Record<string, unknown> | undefined;
    const inventory = world?.inventory as Record<string, unknown> | undefined;
    if (inventory) inventory.keepsakes ??= [];
    const campaign = world?.campaign as Record<string, unknown> | null | undefined;
    if (campaign) {
      campaign.fun ??= {};
      campaign.seenMs ??= {};
    }
    return data;
  },
  // 4 → 5: the separate campaigns (storylines) share the campaign state.
  (data) => {
    const world = data.world as Record<string, unknown> | undefined;
    const campaign = world?.campaign as Record<string, unknown> | null | undefined;
    if (campaign) campaign.storyline ??= null;
    return data;
  },
];

export function serialize(world: World, savedAtWallMs: number): string {
  const file: SaveFile = { version: SAVE_VERSION, savedAtWallMs, world };
  return JSON.stringify(file);
}

export class SaveError extends Error {}

export function deserialize(json: string): SaveFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new SaveError('Save is not valid JSON');
  }
  if (!parsed || typeof parsed !== 'object') throw new SaveError('Save is not an object');
  let data = parsed as Record<string, unknown>;
  let version = typeof data.version === 'number' ? data.version : 0;
  if (version < 1 || version > SAVE_VERSION)
    throw new SaveError(`Unsupported save version ${version}`);
  while (version < SAVE_VERSION) {
    const migrate = MIGRATIONS[version - 1];
    if (!migrate) throw new SaveError(`No migration from version ${version}`);
    data = migrate(data);
    version += 1;
    data.version = version;
  }
  const world = data.world;
  if (!world || typeof world !== 'object') throw new SaveError('Save has no world');
  const savedAtWallMs = typeof data.savedAtWallMs === 'number' ? data.savedAtWallMs : 0;
  let valid: World;
  try {
    valid = validateWorld(world as World);
  } catch (err) {
    if (err instanceof SaveError) throw err;
    throw new SaveError(`Save world is malformed (${String(err)})`);
  }
  // The same deep check as an import: a Nubbin the renderers cannot draw (a crafted share
  // code saved before the check existed) sends the save down the unreadable path instead
  // of crashing every frame after load.
  const problem = importProblem(valid);
  if (problem) throw new SaveError(`Save has a broken Nubbin (${problem})`);
  return { version, savedAtWallMs, world: valid };
}

/** Light validation and defaulting, so a hand-edited or partial save still loads. */
export function validateWorld(w: World): World {
  if (!Array.isArray(w.nubbins) || !Array.isArray(w.trees) || !w.keeper) {
    throw new SaveError('Save world is missing core fields');
  }
  // Every timer counts from the clock; a missing or junk one cannot be repaired.
  if (!isNum(w.timeMs) || w.timeMs < 0) throw new SaveError('Save world has no clock');
  // A walk or a pet the Keeper had started belongs to the session that saved it; a load
  // starts still, so catch-up and the first live step never replay it.
  w.keeper.intent = null;
  w.keeper.moveTarget = null;
  // The away screen that held end-of-life checks belongs to the session that saved; a load
  // starts released (the next away screen holds them again).
  if (w.endOfLife) w.endOfLife.held = false;
  w.items ??= [];
  w.memorials ??= [];
  if (!isNum(w.gatherReadyMs)) w.gatherReadyMs = 0;
  // Memorials once saved their form as ":" or "eternal:"; the band is gone, so forget it.
  for (const m of w.memorials) if (m.form?.endsWith(':')) delete m.form;
  w.unlocks ??= { sunGrove: false, moonGrove: false };
  w.inventory ??= {
    shells: 0,
    fruit: 0,
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
  };
  w.inventory.hats ??= [];
  w.inventory.keepsakes ??= [];
  // Counts from a hand-edited file: "5" would concatenate on +=, so make every count a number.
  const inv = w.inventory as unknown as Record<string, unknown>;
  for (const k of INVENTORY_COUNTS) inv[k] = toCount(inv[k]);
  for (const k of INVENTORY_MAPS) {
    const map = inv[k];
    if (!isObj(map)) continue;
    for (const [id, v] of Object.entries(map)) map[id] = toCount(v);
  }
  w.settings ??= defaultSettings();
  w.settings.offlineAging ??= defaultSettings().offlineAging;
  w.settings.matureContent = sanitizeMatureContent(w.settings.matureContent);
  w.settings.riftConfirmed = w.settings.riftConfirmed === true;
  w.settings.sound ??= true;
  w.settings.music ??= true;
  w.settings.musicVolume ??= 0.8;
  w.settings.sfxVolume ??= 0.8;
  w.settings.textSpeed ??= 'normal';
  w.settings.graphics ??= 'pixel';
  w.settings.sculptRes ??= null;
  w.settings.screenShake ??= true;
  w.settings.particles ??= 'full';
  w.settings.reducedMotion ??= 'system';
  w.inventory.heartFruit ??= 0;
  w.inventory.decor ??= {};
  w.weather ??= createWeather();
  w.season ??= 'spring';
  w.placed ??= [];
  w.seen ??= {};
  w.visits ??= { lastDay: '', count: 0, gifted: [] };
  w.visits.gifted ??= [];
  w.location ??= 'grove';
  w.karate ??= { belt: 0, wins: 0, losses: 0 };
  w.inventory.wood ??= 0;
  w.inventory.stone ??= 0;
  w.inventory.reeds ??= 0;
  w.inventory.seeds ??= {};
  w.inventory.dyes ??= {};
  w.inventory.toys ??= {};
  w.plants ??= [];
  w.tiles ??= {};
  w.achievements ??= {};
  w.title ??= null;
  w.quests ??= [];
  w.questDay ??= '';
  w.plots ??= 0;
  w.wild ??= [];
  w.landmarks ??= {};
  w.coop ??= { active: false, trainer: 'nova' };
  w.keeper2 ??= null;
  w.edu ??= null;
  w.town ??= { prosperity: 0, recruits: [] };
  w.partners ??= [null, null];
  w.merge ??= null;
  w.skillPoints ??= 0;
  w.skills ??= {};
  w.scans ??= {};
  w.team ??= null;
  w.night ??= false;
  w.tank ??= { runs: 0, best: 0 };
  w.dungeon ??= null;
  if (w.dungeon) {
    // Runs saved before the version-2 floors keep the floor they were standing on.
    w.dungeon.genVersion ??= 1;
    w.dungeon.explored ??= '';
  }
  w.hollow ??= { runs: 0, best: 0, dailyDay: '', dailyDepth: 0 };
  // A save written underground without its run: back to the Grove.
  if (w.location === 'dungeon' && !w.dungeon) w.location = 'grove';
  w.inventory.twine ??= 0;
  if (w.edu) {
    w.edu.playedMs = 0;
    w.edu.childName ??= '';
    w.edu.stickers ??= 0;
    // CV2: saves from before the language switch were Little Sprouts.
    w.edu.band ??= 'sprout';
    w.edu.storyLanguage ??= 'learning';
    w.edu.lessons ??= {};
    w.edu.readAloud ??= true;
    w.edu.words ??= {};
    w.edu.courses ??= { hebrew: false, japanese: false };
  }
  if (w.keeper2) w.keeper2.running ??= false;
  w.neighbours ??= {};
  // Older saves kept a last-gift day; any past gift now counts as the one-time gift.
  for (const rec of Object.values(w.neighbours) as { gifted?: boolean; lastGiftDay?: string }[]) {
    rec.gifted ??= Boolean(rec.lastGiftDay);
    delete rec.lastGiftDay;
  }
  w.festivalSeen ??= '';
  w.atlasFestivals ??= [];
  w.settings.jukebox ??= null;
  w.settings.ambience ??= true;
  // Visiting Keepers keep their home spots in the save; re-home them to the current layout.
  // The trees stand where the current layout puts them (a tree once sat on a hill).
  w.trees.forEach((t, i) => {
    const g = GROVE.trees[i];
    if (g) t.pos = { x: g.x, z: g.z };
  });
  // A bigger Grove grew more fruit trees: older saves get them.
  for (let i = w.trees.length; i < GROVE.trees.length; i++) {
    const g = GROVE.trees[i]!;
    w.trees.push({
      id: `tree-grown-${i}`,
      pos: { x: g.x, z: g.z },
      fruitTimerMs: TREES.fruitIntervalMs / 2,
    });
  }
  for (const npc of w.npcs) {
    const home = npcHome(npc.trainer);
    npc.home = { ...home };
    if (Math.hypot(npc.pos.x - home.x, npc.pos.z - home.z) > 6) npc.pos = { ...home };
    npc.target = null;
  }
  w.settings.joystick ??= false;
  sanitizeOfflineAging(w.settings.offlineAging, OFFLINE.defaultCapHours);
  w.selected ??= null;
  w.strays ??= [];
  w.npcs ??= [];
  w.campaign ??= null;
  if (w.campaign) {
    // Campaign v2: side-story progress, the vigil and the chapter's timings; scenes from
    // the old script that no longer exist are dropped so the queue never stalls.
    const c = w.campaign;
    c.side ??= {};
    c.fun ??= {};
    c.seenMs ??= {};
    c.vigil ??= null;
    c.openedMs ??= null;
    c.goalMetMs ??= null;
    c.storyline ??= null;
    c.queue = c.queue.filter((id) => sceneById(id) !== undefined);
  }
  w.grove ??= 'main';
  w.races ??= {};
  w.raceRuns ??= 0;
  w.trainer ??= 'fern';
  w.inventory.critters ??= {};
  w.inventory.essences ??= {};
  for (const n of w.nubbins) {
    n.genes ??= {};
    n.skills ??= {};
    n.karateRecord ??= {};
    n.gradeUpgrades ??= {};
    n.parts ??= { ears: null, tail: null, arms: null, back: null };
    n.cocoonKind ??= n.stage === 'cocoon' ? 'evolve' : null;
    n.childCare ??= { pets: 0, throws: 0, feeds: 0 };
    n.shiny ??= false;
    n.species ??= 'chao';
    n.lineage ??= n.species;
    n.tone ??= null;
    n.personality ??= null;
    n.hat ??= null;
    n.eternal ??= null;
    n.awaitingKeeper ??= false;
    n.trust ??= TRUST.start;
    n.shadow ??= false;
    n.bond ??= false;
    n.stray ??= false;
    n.lowTrustSinceMs ??= -1;
    if (n.form) {
      n.form.second ??= null;
      n.form.leanAtEvolution ??= { ...n.typeLean };
    }
    // A held Nubbin saved mid-drag lands where it was.
    if (n.behavior.state === 'held' || n.behavior.state === 'thrown') {
      n.behavior.state = 'sit';
      n.y = 0;
      n.vel = { x: 0, y: 0, z: 0 };
    }
  }
  if (w.keeper.carrying && !w.nubbins.some((n) => n.id === w.keeper.carrying))
    w.keeper.carrying = null;
  w.keeper.running ??= false;
  w.keeper.input = { x: 0, z: 0 };
  return w;
}

const INVENTORY_COUNTS = ['shells', 'fruit', 'heartFruit', 'wood', 'stone', 'reeds', 'twine'];
const INVENTORY_MAPS = ['critters', 'essences', 'decor', 'seeds', 'dyes', 'toys'];

/** A whole, non-negative count from whatever a file held: "5" becomes 5, junk becomes 0. */
function toCount(v: unknown): number {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return isNum(n) && n > 0 ? Math.floor(n) : 0;
}

/** Stable text of the world for "reload restores the game exactly" checks. */
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const STAGES: readonly string[] = ['egg', 'child', 'cocoon', 'adult'];

/**
 * Pure: what is wrong with one saved Nubbin, or null. Load stays lenient (migrations fill
 * gaps), but an imported file must carry everything the sim and both renderers read every
 * frame, or a hand-made `nubbins: [{}]` would crash the render loop.
 */
export function nubbinProblem(n: unknown): string | null {
  if (!isObj(n)) return 'not an object';
  if (typeof n.id !== 'string' || n.id === '') return 'no id';
  if (typeof n.name !== 'string') return `${n.id}: no name`;
  if (typeof n.stage !== 'string' || !STAGES.includes(n.stage)) return `${n.id}: bad stage`;
  for (const k of ['species', 'lineage', 'eggColor'] as const) {
    if (typeof n[k] !== 'string') return `${n.id}: no ${k}`;
  }
  for (const k of ['stageMs', 'ageMs', 'hatchRemainingMs', 'alignment', 'rebirths'] as const) {
    if (!isNum(n[k])) return `${n.id}: bad ${k}`;
  }
  if (!isObj(n.pos) || !isNum(n.pos.x) || !isNum(n.pos.z)) return `${n.id}: bad pos`;
  if (!isObj(n.behavior) || typeof n.behavior.state !== 'string') return `${n.id}: bad behavior`;
  const needs = n.needs;
  if (!isObj(needs) || !isNum(needs.hunger) || !isNum(needs.energy) || !isNum(needs.happiness))
    return `${n.id}: bad needs`;
  if (!isObj(n.stats)) return `${n.id}: no stats`;
  for (const k of STAT_KEYS) {
    const s = n.stats[k];
    if (!isObj(s) || !isNum(s.points) || !GRADES.includes(s.grade as Grade))
      return `${n.id}: bad ${k} stat`;
  }
  if (!isObj(n.typeLean) || !isObj(n.parts)) return `${n.id}: no type lean or parts`;
  return null;
}

/** Pure: the first problem in an imported world's Nubbins (including a repeated id), or null. */
export function importProblem(world: World): string | null {
  const ids = new Set<string>();
  for (const n of world.nubbins as unknown[]) {
    const problem = nubbinProblem(n);
    if (problem) return problem;
    const id = (n as { id: string }).id;
    if (ids.has(id)) return `${id}: repeated id`;
    ids.add(id);
  }
  return null;
}

export function worldFingerprint(world: World): string {
  return JSON.stringify(world, (key, value: unknown) => {
    // Wall time and pending input are not part of the game state.
    if (key === 'lastWallMs' || key === 'input') return undefined;
    return value;
  });
}
