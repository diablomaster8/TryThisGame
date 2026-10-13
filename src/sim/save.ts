import { OFFLINE, TRUST } from '../config/tuning';
import { createWeather } from './weather';
import { npcHome } from './npcs';
import type { World } from './types';
import { defaultSettings } from './world';

export const SAVE_VERSION = 2;

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
      }
    }
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
  return { version, savedAtWallMs, world: validateWorld(world as World) };
}

/** Light validation and defaulting, so a hand-edited or partial save still loads. */
export function validateWorld(w: World): World {
  if (!Array.isArray(w.nubbins) || !Array.isArray(w.trees) || !w.keeper) {
    throw new SaveError('Save world is missing core fields');
  }
  w.items ??= [];
  w.memorials ??= [];
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
  };
  w.inventory.hats ??= [];
  w.settings ??= defaultSettings();
  w.settings.offlineAging ??= defaultSettings().offlineAging;
  w.settings.sound ??= true;
  w.settings.music ??= true;
  w.settings.musicVolume ??= 0.8;
  w.settings.sfxVolume ??= 0.8;
  w.settings.textSpeed ??= 'normal';
  w.settings.screenShake ??= true;
  w.settings.particles ??= 'full';
  w.settings.reducedMotion ??= 'system';
  w.inventory.heartFruit ??= 0;
  w.inventory.decor ??= {};
  w.weather ??= createWeather();
  w.season ??= 'spring';
  w.placed ??= [];
  w.seen ??= {};
  w.visits ??= { lastDay: '', count: 0 };
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
  if (w.keeper2) w.keeper2.running ??= false;
  w.neighbours ??= {};
  w.festivalSeen ??= '';
  w.settings.jukebox ??= null;
  w.settings.ambience ??= true;
  // Visiting Keepers keep their home spots in the save; re-home them to the current layout.
  for (const npc of w.npcs) {
    const home = npcHome(npc.trainer);
    npc.home = { ...home };
    if (Math.hypot(npc.pos.x - home.x, npc.pos.z - home.z) > 6) npc.pos = { ...home };
    npc.target = null;
  }
  w.settings.joystick ??= false;
  const oa = w.settings.offlineAging;
  if (oa.mode !== 'indefinite' && oa.mode !== 'capped' && oa.mode !== 'off')
    oa.mode = OFFLINE.defaultMode;
  if (
    !Number.isInteger(oa.capHours) ||
    oa.capHours < OFFLINE.minCapHours ||
    oa.capHours > OFFLINE.maxCapHours
  ) {
    oa.capHours = OFFLINE.defaultCapHours;
  }
  oa.allowOfflineDepartures = Boolean(oa.allowOfflineDepartures);
  w.selected ??= null;
  w.strays ??= [];
  w.npcs ??= [];
  w.campaign ??= null;
  w.grove ??= 'main';
  w.races ??= {};
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

/** Stable text of the world for "reload restores the game exactly" checks. */
export function worldFingerprint(world: World): string {
  return JSON.stringify(world, (key, value: unknown) => {
    // Wall time and pending input are not part of the game state.
    if (key === 'lastWallMs' || key === 'input') return undefined;
    return value;
  });
}
