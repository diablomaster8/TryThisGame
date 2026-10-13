import { ACHIEVEMENTS } from '../config/tuning';
import { allKeys } from './collection';
import type { SimEvent, World } from './types';

/**
 * Achievements and Keeper titles. Each one is checked against the world or the
 * events of the step; the first time it holds it is recorded with the sim time, pays a
 * few Shells, and unlocks a title for the profile card.
 */
export interface Achievement {
  id: string;
  title: string;
  check: (world: World, events: SimEvent[]) => boolean;
}

export const ACHIEVEMENT_LIST: Achievement[] = [
  { id: 'firstHatch', title: 'Warm Hands', check: (_w, e) => e.some((x) => x.kind === 'hatched') },
  { id: 'firstEvolve', title: 'Grown', check: (_w, e) => e.some((x) => x.kind === 'evolved') },
  { id: 'rebirth', title: 'Again and Again', check: (_w, e) => e.some((x) => x.kind === 'reborn') },
  { id: 'eternal', title: 'Timeless', check: (_w, e) => e.some((x) => x.kind === 'eternal') },
  { id: 'raceWin', title: 'Fast Friend', check: (w) => Object.values(w.races).some((t) => t >= 1) },
  { id: 'raceTier3', title: 'Champion', check: (w) => Object.values(w.races).some((t) => t >= 3) },
  { id: 'blackBelt', title: 'Black Belt', check: (w) => w.karate.belt >= 3 },
  { id: 'bonded', title: 'Slow Hands', check: (_w, e) => e.some((x) => x.kind === 'shadowBonded') },
  {
    id: 'lanterns',
    title: 'Lantern Lighter',
    check: (_w, e) => e.some((x) => x.kind === 'lanternNight'),
  },
  { id: 'bred', title: 'Matchmaker', check: (_w, e) => e.some((x) => x.kind === 'bred') },
  { id: 'decorated', title: 'Gardener', check: (w) => w.placed.length >= 10 },
  {
    id: 'orchard',
    title: 'Orchardist',
    check: (w) => w.plants.filter((p) => p.kind === 'tree' && p.stage === 3).length >= 3,
  },
  { id: 'crafter', title: 'Tinker', check: (_w, e) => e.some((x) => x.kind === 'crafted' && x.ok) },
  {
    id: 'halfBook',
    title: 'Collector',
    check: (w) => Object.keys(w.seen).length >= allKeys().length / 2,
  },
  {
    id: 'fullBook',
    title: 'Keeper of Every Kind',
    check: (w) => Object.keys(w.seen).length >= allKeys().length,
  },
  {
    id: 'friends',
    title: 'Good Company',
    check: (_w, e) => e.some((x) => x.kind === 'friendsMade'),
  },
  {
    id: 'neighbour',
    title: 'Neighbourly',
    check: (_w, e) => e.some((x) => x.kind === 'neighbourGift' && x.ok),
  },
  { id: 'wild', title: 'Habitat Maker', check: (_w, e) => e.some((x) => x.kind === 'wildSettled') },
  { id: 'explorer', title: 'Explorer', check: (w) => Object.keys(w.landmarks).length >= 6 },
  { id: 'storyEnd', title: 'Hazel’s Heir', check: (w) => (w.campaign?.chapter ?? 0) > 12 },
];

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
  for (const a of ACHIEVEMENT_LIST) {
    if (world.achievements[a.id] !== undefined) continue;
    if (!a.check(world, events)) continue;
    world.achievements[a.id] = world.timeMs;
    world.inventory.shells += ACHIEVEMENTS.shells;
    events.push({ kind: 'achievement', id: a.id, shells: ACHIEVEMENTS.shells });
  }
}

export function titlesEarned(world: World): string[] {
  return ACHIEVEMENT_LIST.filter((a) => world.achievements[a.id] !== undefined).map((a) => a.title);
}
