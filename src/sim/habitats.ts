import { GROVE, HABITAT } from '../config/tuning';
import { createEgg } from './nubbin';
import { hatch } from './lifecycle';
import { hasRoom } from './roster';
import { Rng } from './rng';
import { SPECIES } from './species';
import type { HabitatKind, SimEvent, World } from './types';
import { newId, uniqueName } from './world';

/**
 * Habitats: shape a patch and wild creatures of the pocket and digital lines come to
 * look. Flower beds make a meadow, rock piles a rocky corner, thickets a dark thicket,
 * and the pond edge is the water patch. A creature visits a complete patch now and then;
 * after enough visits, or one feeding, it settles into the roster as a child.
 */
const PATCH_DECOR: Record<HabitatKind, string> = {
  meadow: 'flowerbed',
  rocky: 'rockPile',
  thicket: 'thicket',
  water: 'reeds',
};

/** Species that like each patch, by their line's favourite type. */
function speciesFor(patch: HabitatKind, rng: Rng): string {
  const pool = Object.values(SPECIES).filter((s) => {
    if (s.family === 'chao' || s.stage !== 'baby') return false;
    const t = s.type;
    return patch === 'water'
      ? t === 'swim'
      : patch === 'meadow'
        ? t === 'fly' || t === 'normal'
        : patch === 'rocky'
          ? t === 'power' || t === 'run'
          : s.family === 'digi';
  });
  return pool.length > 0 ? rng.pick(pool).id : 'chao';
}

/** Where each patch sits: the centre of its decor pieces, or the pond for water. */
export function patchCentre(world: World, patch: HabitatKind): { x: number; z: number } | null {
  // The water patch is a stone landing: path stones laid by the pond.
  const pieces =
    patch === 'water'
      ? world.placed.filter(
          (d) =>
            d.kind === 'pathTile' &&
            Math.hypot(d.pos.x - GROVE.pond.x, d.pos.z - GROVE.pond.z) < GROVE.pond.r + 3,
        )
      : world.placed.filter((d) => d.kind === PATCH_DECOR[patch]);
  if (pieces.length < HABITAT.need) return null;
  const x = pieces.reduce((s, d) => s + d.pos.x, 0) / pieces.length;
  const z = pieces.reduce((s, d) => s + d.pos.z, 0) / pieces.length;
  return { x, z };
}

export function completePatches(world: World): HabitatKind[] {
  const out: HabitatKind[] = [];
  for (const patch of ['water', 'meadow', 'rocky', 'thicket'] as const) {
    if (patchCentre(world, patch)) out.push(patch);
  }
  return out;
}

export function stepHabitats(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  // Visits end.
  for (const w of [...world.wild]) {
    if (world.timeMs >= w.untilMs) {
      world.wild = world.wild.filter((x) => x !== w);
      if (w.visits >= HABITAT.settleVisits || w.fed) settle(world, w.species, w.pos, rng, events);
      else events.push({ kind: 'wildLeft', id: w.id });
    }
  }
  if (world.wild.length >= HABITAT.maxWild) return;
  // Once a sim second, roll a new visit.
  const crossed = Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000);
  if (!crossed || !rng.chance(HABITAT.visitChancePerMinute / 60)) return;
  const patches = completePatches(world).filter((p) => !world.wild.some((w) => w.patch === p));
  if (patches.length === 0) return;
  const patch = rng.pick(patches);
  const centre = patchCentre(world, patch);
  if (!centre) return;
  // The same creature returns to the same patch: pick it from the world seed.
  const species = speciesFor(patch, Rng.fromSeed(world.seed * 31 + patch.length * 7));
  const visitKey = `wild:${patch}:visits`;
  const visits = Number(world.landmarks[visitKey] ?? 0) + 1;
  world.landmarks[visitKey] = visits;
  const id = newId(world, 'wild');
  world.wild.push({
    id,
    species,
    patch,
    pos: { x: centre.x + rng.float(-0.8, 0.8), z: centre.z + rng.float(-0.8, 0.8) },
    visits,
    untilMs: world.timeMs + HABITAT.visitMs,
    fed: false,
  });
  events.push({ kind: 'wildArrived', id, species, patch });
}

export function feedWild(world: World, id: string, events: SimEvent[]): boolean {
  const w = world.wild.find((x) => x.id === id);
  if (!w || world.inventory.fruit <= 0) return false;
  world.inventory.fruit -= 1;
  w.fed = true;
  w.untilMs = Math.min(w.untilMs, world.timeMs + 3000);
  events.push({ kind: 'wildFed', id: w.id });
  return true;
}

function settle(
  world: World,
  species: string,
  pos: { x: number; z: number },
  rng: Rng,
  events: SimEvent[],
): void {
  if (!hasRoom(world)) return;
  const n = createEgg(newId(world, 'nub'), pos, rng, 'plain', species);
  n.name = uniqueName(world, n.name, rng);
  hatch(n, [], world.timeMs);
  n.trust = 35;
  world.nubbins.push(n);
  events.push({ kind: 'wildSettled', species, nubbinId: n.id });
}
