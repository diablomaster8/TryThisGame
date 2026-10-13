import { BREEDING, EGG } from '../config/tuning';
import { createEgg } from './nubbin';
import type { Rng } from './rng';
import { GRADES, STAT_KEYS, type Grade, type Nubbin, type SimEvent, type World } from './types';
import { newId, uniqueName } from './world';

/**
 * Breeding: feed an adult a heart fruit and it courts for a while. If another adult
 * that likes its Keeper comes close, they make an egg. The egg inherits a parent's
 * colour and lineage, a mix of grades (the better one half the time), a chance of
 * shine, and records its parents and generation. Eternals never breed (CLAUDE.md).
 */
export function canBreed(n: Nubbin): boolean {
  return n.stage === 'adult' && !n.eternal && n.needs.affection >= BREEDING.minAffection;
}

export function giveHeartFruit(world: World, n: Nubbin, events: SimEvent[]): boolean {
  if (world.inventory.heartFruit <= 0 || !canBreed(n)) return false;
  world.inventory.heartFruit -= 1;
  n.courtingUntilMs = world.timeMs + BREEDING.courtMs;
  n.needs.hunger = Math.min(1, n.needs.hunger + 0.3);
  events.push({ kind: 'courting', nubbinId: n.id });
  return true;
}

function mixGrade(a: Grade, b: Grade, rng: Rng): Grade {
  const ia = GRADES.indexOf(a);
  const ib = GRADES.indexOf(b);
  if (rng.chance(BREEDING.betterGradeChance)) return GRADES[Math.max(ia, ib)]!;
  return GRADES[Math.round((ia + ib) / 2)]!;
}

/** Make the egg of two parents next to them. */
export function breed(world: World, a: Nubbin, b: Nubbin, rng: Rng, events: SimEvent[]): Nubbin {
  const colourParent = rng.chance(0.5) ? a : b;
  const lineParent = rng.chance(0.5) ? a : b;
  const egg = createEgg(
    newId(world, 'nub'),
    { x: (a.pos.x + b.pos.x) / 2, z: (a.pos.z + b.pos.z) / 2 + 0.8 },
    rng,
    colourParent.eggColor,
    lineParent.lineage,
  );
  egg.tone = rng.chance(0.5) ? a.tone : b.tone;
  const shinyChance = a.shiny || b.shiny ? BREEDING.shinyIfParentShiny : BREEDING.shinyBase;
  egg.shiny = rng.chance(shinyChance);
  for (const key of STAT_KEYS) {
    egg.stats[key].grade = mixGrade(a.stats[key].grade, b.stats[key].grade, rng);
  }
  egg.parents = [a.id, b.id];
  egg.generation = Math.max(a.generation, b.generation) + 1;
  egg.genes = { colourFrom: colourParent.id, lineFrom: lineParent.id };
  egg.name = uniqueName(world, egg.name, rng);
  egg.hatchRemainingMs = EGG.hatchMs;
  world.nubbins.push(egg);
  a.courtingUntilMs = 0;
  b.courtingUntilMs = 0;
  a.needs.affection = Math.max(0, a.needs.affection - 5);
  b.needs.affection = Math.max(0, b.needs.affection - 5);
  events.push({ kind: 'bred', eggId: egg.id, parents: [a.id, b.id] });
  return egg;
}

/** Per step: courting adults look for a partner within reach. */
export function stepBreeding(world: World, rng: Rng, events: SimEvent[]): void {
  const courting = world.nubbins.filter(
    (n) => n.courtingUntilMs > world.timeMs && canBreed(n) && n.stage === 'adult',
  );
  if (courting.length === 0) return;
  if (world.nubbins.length >= EGG.maxRoster) return;
  for (const a of courting) {
    const partner = world.nubbins.find(
      (b) =>
        b.id !== a.id &&
        canBreed(b) &&
        Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) <= BREEDING.reach,
    );
    if (partner) {
      breed(world, a, partner, rng, events);
      return;
    }
  }
}
