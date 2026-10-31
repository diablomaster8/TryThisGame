import { ACHIEVEMENTS, BYTE_WATCHES } from '../config/tuning';
import { secretTitles } from './dungeon-secret-levels';
import { ACHIEVEMENT_TEXT } from '../config/strings-badges';
import { byteWatches } from './byte-watches';
import { allKeys } from './collection';
import { fernStoneChapters } from './fern-stone';
import type { SimEvent, World } from './types';

/**
 * Achievements and Keeper titles. Each one is checked against the world or the
 * events of the step; the first time it holds it is recorded with the sim time, pays a
 * few Shells, and unlocks a title for the profile card. Titles and blurbs live in
 * `config/strings-badges.ts` (R0315); the joke badges count small events in
 * `world.funCounts`, which is only touched on steps that have events.
 */
export interface Achievement {
  id: string;
  /** From `ACHIEVEMENT_TEXT`; the profile saves it as the chosen title. */
  title: string;
  /** R0315: a joke badge (the profile's Silly filter). */
  silly: boolean;
  check: (world: World, events: SimEvent[]) => boolean;
}

type Check = Achievement['check'];

/** R0315: a counter in `world.funCounts` reached `n`. */
const counted =
  (key: string, n: number): Check =>
  (w) =>
    (w.funCounts?.[key] ?? 0) >= n;

const stat = (w: World, k: 'pets' | 'feeds' | 'expeditions' | 'throws'): number =>
  w.campaign?.stats[k] ?? 0;

const CHECKS: Array<[id: string, check: Check]> = [
  ['firstHatch', (_w, e) => e.some((x) => x.kind === 'hatched')],
  ['firstEvolve', (_w, e) => e.some((x) => x.kind === 'evolved')],
  ['rebirth', (_w, e) => e.some((x) => x.kind === 'reborn')],
  ['eternal', (_w, e) => e.some((x) => x.kind === 'eternal')],
  ['raceWin', (w) => Object.values(w.races).some((t) => t >= 1)],
  ['raceTier3', (w) => Object.values(w.races).some((t) => t >= 3)],
  ['blackBelt', (w) => w.karate.belt >= 3],
  ['bonded', (_w, e) => e.some((x) => x.kind === 'shadowBonded')],
  ['lanterns', (_w, e) => e.some((x) => x.kind === 'lanternNight')],
  ['bred', (_w, e) => e.some((x) => x.kind === 'bred')],
  ['decorated', (w) => w.placed.length >= 10],
  ['orchard', (w) => w.plants.filter((p) => p.kind === 'tree' && p.stage === 3).length >= 3],
  ['crafter', (_w, e) => e.some((x) => x.kind === 'crafted' && x.ok)],
  ['halfBook', (w) => Object.keys(w.seen).length >= allKeys().length / 2],
  ['fullBook', (w) => Object.keys(w.seen).length >= allKeys().length],
  ['friends', (_w, e) => e.some((x) => x.kind === 'friendsMade')],
  ['neighbour', (_w, e) => e.some((x) => x.kind === 'neighbourGift' && x.ok)],
  ['wild', (_w, e) => e.some((x) => x.kind === 'wildSettled')],
  ['explorer', (w) => Object.keys(w.landmarks).length >= 6],
  ['storyEnd', (w) => (w.campaign?.chapter ?? 0) > 12],
  // R0315: the joke badges. None rewards throwing, neglect or loss.
  ['gravity', counted('fruitBonk', 1)],
  ['patter', (w) => stat(w, 'pets') >= 100],
  ['ruleFour', (w) => stat(w, 'feeds') >= 10],
  ['bonkAppetit', counted('bonkSnack', 1)],
  [
    'neverEver',
    (w, e) => e.some((x) => x.kind === 'evolved') && !!w.campaign && stat(w, 'throws') === 0,
  ],
  ['stopwatchSix', (w) => (byteWatches(w.campaign ?? null) ?? 0) >= BYTE_WATCHES.start + 2],
  ['goodStone', (w) => fernStoneChapters(w) >= 5],
  ['liftAndPush', (w) => !!w.campaign?.flags['c1-gate-pushed']],
  ['snackDiplomacy', counted('strayFed', 3)],
  ['whoopsADaisy', counted('sceneryBonk', 2)],
  ['legDay', (w) => stat(w, 'expeditions') >= 10],
  ['springStep', counted('boing', 10)],
  ['shakeItOff', counted('treeShaken', 25)],
  ['eggWhisperer', counted('eggShaken', 10)],
  ['puddlePerson', counted('dipped', 1)],
  ['skidMark', counted('skid', 5)],
  ['lookAThing', counted('lookout', 1)],
  ['tickleMonster', counted('tickle', 20)],
  ['highFiveClub', counted('highFive', 10)],
  ['hugMileage', counted('hug', 50)],
  ['smallTalk', counted('talked', 30)],
  ['heardItBefore', (w) => (Number(w.campaign?.flags['fern-stone-taps']) || 0) >= 10],
  ['openHouse', counted('visitor', 5)],
  ['hatTrick', counted('dyed', 3)],
  ['downTheHole', counted('descended', 1)],
];

export const ACHIEVEMENT_LIST: Achievement[] = CHECKS.map(([id, check]) => ({
  id,
  title: ACHIEVEMENT_TEXT[id]?.title ?? id,
  silly: ACHIEVEMENT_TEXT[id]?.silly === true,
  check,
}));

/** R0315: the small events the joke badges count, by `funCounts` key. */
function countKey(world: World, e: SimEvent): string | null {
  switch (e.kind) {
    case 'bonked': {
      if (e.by === 'obstacle') return 'sceneryBonk';
      // A hungry Nubbin heads straight for the fruit that hit it.
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (n?.behavior.state === 'findFood') bump(world, 'bonkSnack');
      return 'fruitBonk';
    }
    case 'strayFed':
      return e.ok ? 'strayFed' : null;
    case 'springBounced':
      return 'boing';
    case 'treeShaken':
      return 'treeShaken';
    case 'eggShaken':
      return 'eggShaken';
    case 'keeperDipped':
      return 'dipped';
    case 'keeperSkid':
      return 'skid';
    case 'lookoutFind':
      return 'lookout';
    case 'interacted':
      return e.ok && (e.action === 'tickle' || e.action === 'highFive' || e.action === 'hug')
        ? e.action
        : null;
    case 'talked':
      return 'talked';
    case 'visitor':
      return 'visitor';
    case 'dyed':
      return 'dyed';
    case 'descended':
    case 'dungeonEntered':
      return 'descended';
    default:
      return null;
  }
}

function bump(world: World, key: string): void {
  world.funCounts ??= {};
  world.funCounts[key] = (world.funCounts[key] ?? 0) + 1;
}

/**
 * Event-driven badges are checked whenever something happened; the world-state ones
 * (book size, plots placed, orchard) once a sim second, since they cannot change
 * without an event anyway and the check allocates. `dtMs` undefined means "always".
 */
export function stepAchievements(world: World, events: SimEvent[], dtMs?: number): void {
  if (events.length === 0 && dtMs !== undefined) {
    const second = Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000);
    if (!second) return;
  }
  for (const e of events) {
    const key = countKey(world, e);
    if (key) bump(world, key);
  }
  for (const a of ACHIEVEMENT_LIST) {
    if (world.achievements[a.id] !== undefined) continue;
    if (!a.check(world, events)) continue;
    world.achievements[a.id] = world.timeMs;
    world.inventory.shells += ACHIEVEMENTS.shells;
    events.push({ kind: 'achievement', id: a.id, shells: ACHIEVEMENTS.shells });
  }
}

export function titlesEarned(world: World): string[] {
  return (
    ACHIEVEMENT_LIST.filter((a) => world.achievements[a.id] !== undefined)
      .map((a) => a.title)
      // Lane B r9 (R0183): the Pillow Champion.
      .concat(secretTitles(world))
  );
}
