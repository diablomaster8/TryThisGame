/**
 * Building a fresh world: default settings, the starting Grove and unique Nubbin names. Split out
 * of world.ts (R0477); world.ts re-exports all three.
 */
import { AUDIO_MIX } from '../config/tuning-more/audio-mix';
import { NUBBIN_NAMES } from '../config/strings';
import { EGG, GROVE, OFFLINE, TREES } from '../config/tuning';
import { createKeeper } from './keeper';
import { createEgg } from './nubbin';
import { Rng } from './rng';
import { DEFAULT_TRAINER, rollEggSpecies, trainerOf } from './trainers';
import type { Settings, World } from './types';
import { createWeather, seasonAt } from './weather';
import { newId } from './world-util';

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
