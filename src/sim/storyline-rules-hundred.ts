import { HABITAT, STORYLINES } from '../config/tuning';
import { setLocation } from './campaign';
import { enterDungeon } from './dungeon';
import { createEgg } from './nubbin';
import { setPartner } from './partners';
import { Rng } from './rng';
import { speciesByFamily } from './species';
import { registerStorylineRule } from './storyline-rules';
import { counter, storyPartner } from './storyline-checks';
import { setWeather } from './weather';
import type { HabitatKind, SimEvent, World } from './types';
import { newId, uniqueName, withRng } from './world';

/**
 * SL1 "The Hundred Days" (content/storyline-hundred.ts): one partner with a stretched span,
 * six areas that map to places both renderers already draw, a wild visitor waiting in
 * each, the Hush as the chapter-9 dojo bout, and an ending read from prosperity and the
 * partner's evolution.
 */
export const HUNDRED_AREAS = ['meadow', 'shore', 'cave', 'mountain', 'mire', 'mill'] as const;
export type HundredArea = (typeof HUNDRED_AREAS)[number];

/** Which habitat patch each area's visitor belongs to, and so which species pool. */
const AREA_PATCH: Record<HundredArea, HabitatKind> = {
  meadow: 'meadow',
  shore: 'water',
  cave: 'rocky',
  mountain: 'rocky',
  mire: 'thicket',
  mill: 'meadow',
};

function areaSpecies(area: HundredArea, seed: number): string {
  const patch = AREA_PATCH[area];
  const pool = [...speciesByFamily('pocket', 'baby'), ...speciesByFamily('digi', 'baby')].filter(
    (s) =>
      patch === 'water'
        ? s.type === 'swim'
        : patch === 'meadow'
          ? s.type === 'fly' || s.type === 'normal'
          : patch === 'rocky'
            ? s.type === 'power' || s.type === 'run'
            : s.family === 'digi',
  );
  const rng = Rng.fromSeed(seed * 17 + area.length);
  return pool.length > 0 ? rng.pick(pool).id : 'chao';
}

/** A wild creature waits in each area: standing there is how the Fold meets it. */
function spawnAreaVisitor(world: World, area: HundredArea, events: SimEvent[]): void {
  if (world.wild.length >= HABITAT.maxWild) return;
  const patch = AREA_PATCH[area];
  if (world.wild.some((w) => w.patch === patch)) return;
  const species = areaSpecies(area, world.seed);
  const visitKey = `wild:${patch}:visits`;
  const visits = Number(world.landmarks[visitKey] ?? 0) + 1;
  world.landmarks[visitKey] = visits;
  const id = newId(world, 'wild');
  world.wild.push({
    id,
    species,
    patch,
    pos: { x: world.keeper.pos.x + 2, z: world.keeper.pos.z + 1 },
    visits,
    untilMs: world.timeMs + HABITAT.visitMs,
    fed: false,
  });
  events.push({ kind: 'wildArrived', id, species, patch });
}

registerStorylineRule({
  id: 'hundred',
  areas: [...HUNDRED_AREAS],
  setup: (world, c) => {
    // One egg, and nothing else in the roster. Its adult span runs the hundred days.
    withRng(world, (rng) => {
      const egg = createEgg(newId(world, 'nub'), { x: 0, z: 2 }, rng, 'plain');
      egg.name = uniqueName(world, egg.name, rng);
      egg.spanScale = STORYLINES.hundredSpanScale;
      world.nubbins = [egg];
      world.selected = null;
      world.keeper.carrying = null;
      c.flags.partnerId = egg.id;
      setPartner(world, 0, egg.id);
    });
    c.flags.area = 'meadow';
  },
  onChapter: (_world, c, n) => {
    if (n === 9) c.flags['hush-wins-at'] = counter(c, 'karateWon');
  },
  onEvent: (_world, c, e) => {
    if (c.chapter === 9 && e.kind === 'karate' && e.won) c.flags['hush-beaten'] = true;
  },
  onArea: (world, _c, area, events) => {
    if (world.dungeon) return;
    withRng(world, (rng) => {
      switch (area as HundredArea) {
        case 'cave':
          setLocation(world, 'grove', events);
          enterDungeon(world, false, rng, events);
          return;
        case 'mountain':
          setLocation(world, 'hollow', events);
          break;
        case 'mire':
          setLocation(world, 'corvin', events);
          setWeather(world, 'rain', rng, events);
          break;
        case 'mill':
          setLocation(world, 'corvin', events);
          setWeather(world, 'clear', rng, events);
          break;
        default:
          setLocation(world, 'grove', events);
          break;
      }
      spawnAreaVisitor(world, area as HundredArea, events);
    });
  },
  endingFor: (world, c) => {
    const p = storyPartner(world, c);
    const prosperity = world.town.prosperity;
    if (p?.moody || p?.shadow) return 'grey-fold';
    if (prosperity >= 100) return 'bright-fold';
    if (prosperity < 60) return 'quiet-fold';
    return 'the-fold';
  },
});
