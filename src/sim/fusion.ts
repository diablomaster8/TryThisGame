import { FUSION } from '../config/tuning';
import { GRADES, STAT_KEYS, type Nubbin, type SimEvent, type World } from './types';

/**
 * SL3's (The Beetle Road) fusion: two adult Nubbins who are both sure of their Keeper become one. Nothing
 * is rolled and nothing is lost by chance: the one that stays keeps the better grade and
 * the higher points of every stat, fills its empty part slots from the other, adds the
 * other's type lean, and remembers the other in its genes and its generation. The other
 * leaves the roster for good, so the sim asks for consent twice: both must be adults at
 * full affection and high trust, and the Keeper confirms in the story before the command.
 */
export function canFuse(world: World, aId: string, bId: string): string | null {
  const a = world.nubbins.find((n) => n.id === aId);
  const b = world.nubbins.find((n) => n.id === bId);
  if (!a || !b || a === b) return 'two';
  if (a.stage !== 'adult' || b.stage !== 'adult') return 'adults';
  if (a.eternal || b.eternal) return 'eternal';
  if (a.needs.affection < FUSION.minAffection || b.needs.affection < FUSION.minAffection)
    return 'bond';
  if (a.trust < FUSION.minTrust || b.trust < FUSION.minTrust) return 'trust';
  return null;
}

/** Fuse `bId` into `aId`. Returns false when the pair is not ready. */
export function fuse(world: World, aId: string, bId: string, events: SimEvent[]): boolean {
  if (canFuse(world, aId, bId)) return false;
  const a = world.nubbins.find((n) => n.id === aId)!;
  const b = world.nubbins.find((n) => n.id === bId)!;
  for (const k of STAT_KEYS) {
    const sa = a.stats[k];
    const sb = b.stats[k];
    sa.points = Math.max(sa.points, sb.points);
    if (GRADES.indexOf(sb.grade) > GRADES.indexOf(sa.grade)) sa.grade = sb.grade;
    a.typeLean[k === 'stamina' ? 'normal' : k] += b.typeLean[k === 'stamina' ? 'normal' : k];
  }
  for (const slot of ['ears', 'tail', 'arms', 'back'] as const) a.parts[slot] ??= b.parts[slot];
  a.needs.affection = Math.min(100, a.needs.affection + FUSION.affectionGain);
  a.generation = Math.max(a.generation, b.generation) + 1;
  a.genes.fusedFrom = [...((a.genes.fusedFrom as string[] | undefined) ?? []), b.name];
  a.ancestry.push(b.name);
  world.nubbins = world.nubbins.filter((n) => n.id !== b.id);
  if (world.selected === b.id) world.selected = null;
  if (world.keeper.carrying === b.id) world.keeper.carrying = null;
  world.partners = [
    world.partners[0] === b.id ? null : world.partners[0],
    world.partners[1] === b.id ? null : world.partners[1],
  ];
  if (world.merge && (world.merge.a === b.id || world.merge.b === b.id)) world.merge = null;
  events.push({ kind: 'fused', keptId: a.id, keptName: a.name, goneName: b.name });
  return true;
}

/** The names a Nubbin carries from fusions, for the stats sheet. */
export function fusedFrom(n: Nubbin): string[] {
  const list = n.genes.fusedFrom;
  return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : [];
}
