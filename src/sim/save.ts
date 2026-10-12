import { OFFLINE } from '../config/tuning';
import type { World } from './types';
import { defaultSettings } from './world';

export const SAVE_VERSION = 1;

export interface SaveFile {
  version: number;
  savedAtWallMs: number;
  world: World;
}

/**
 * One migration per version bump: index n upgrades a version-n save to n+1.
 * Version 1 is the first, so the table starts empty.
 */
export const MIGRATIONS: Array<(data: Record<string, unknown>) => Record<string, unknown>> = [];

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
  w.inventory ??= { shells: 0, fruit: 0, critters: {}, essences: {}, hats: [] };
  w.inventory.hats ??= [];
  w.settings ??= defaultSettings();
  w.settings.offlineAging ??= defaultSettings().offlineAging;
  w.settings.sound ??= true;
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
  w.grove ??= 'main';
  w.races ??= {};
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
    n.personality ??= null;
    n.hat ??= null;
    n.eternal ??= null;
    n.awaitingKeeper ??= false;
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
