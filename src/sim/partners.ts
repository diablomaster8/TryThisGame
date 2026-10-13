import { PARTNERS } from '../config/tuning';
import { levelOf } from './stats';
import { STAT_KEYS, type Nubbin, type SimEvent, type StatKey, type World } from './types';

/**
 * Partners: two Nubbins the Keeper names as theirs. They keep near the Keeper and
 * their affection grows for it. With a twine from the shop, two adult partners at full
 * bond merge for a minute into a glowing form whose race and karate stats are the pair's
 * best plus a little. Nothing is lost when they split.
 */
export function setPartner(world: World, slot: 0 | 1, nubbinId: string | null): void {
  if (nubbinId && !world.nubbins.some((n) => n.id === nubbinId)) return;
  const other = world.partners[slot === 0 ? 1 : 0];
  if (nubbinId && other === nubbinId) world.partners[slot === 0 ? 1 : 0] = null;
  world.partners[slot] = nubbinId;
}

export function isPartner(world: World, id: string): boolean {
  return world.partners[0] === id || world.partners[1] === id;
}

export function canMerge(world: World): string | null {
  const [a, b] = world.partners.map((id) => world.nubbins.find((n) => n.id === id));
  if (!a || !b) return 'partners';
  if (a.stage !== 'adult' || b.stage !== 'adult') return 'adults';
  if (a.needs.affection < PARTNERS.minAffection || b.needs.affection < PARTNERS.minAffection)
    return 'bond';
  if (world.inventory.twine <= 0) return 'twine';
  if (world.merge) return 'merged';
  return null;
}

export function merge(world: World, events: SimEvent[]): boolean {
  if (canMerge(world)) return false;
  world.inventory.twine -= 1;
  world.merge = {
    a: world.partners[0]!,
    b: world.partners[1]!,
    untilMs: world.timeMs + PARTNERS.mergeMs,
  };
  events.push({ kind: 'merged', a: world.merge.a, b: world.merge.b });
  return true;
}

export function isMerged(world: World, id: string): boolean {
  return !!world.merge && (world.merge.a === id || world.merge.b === id);
}

/** Stat levels for races and bouts: the pair's best per stat plus a bonus while merged. */
export function mergedLevels(world: World, n: Nubbin): Record<StatKey, number> | null {
  if (!isMerged(world, n.id) || !world.merge) return null;
  const a = world.nubbins.find((x) => x.id === world.merge!.a);
  const b = world.nubbins.find((x) => x.id === world.merge!.b);
  if (!a || !b) return null;
  const out = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) {
    out[k] = Math.min(
      99,
      Math.max(levelOf(a.stats[k].points), levelOf(b.stats[k].points)) + PARTNERS.mergeLevelBonus,
    );
  }
  return out;
}

export function stepPartners(world: World, dtMs: number, events: SimEvent[]): void {
  // Nothing to do for the common case: no partners chosen and no merge running.
  if (!world.partners[0] && !world.partners[1] && !world.merge) return;
  // Partners' affection grows a little while they are near the Keeper.
  for (const id of world.partners) {
    const n = id ? world.nubbins.find((x) => x.id === id) : undefined;
    if (!n || n.stage === 'egg') continue;
    const d = Math.hypot(n.pos.x - world.keeper.pos.x, n.pos.z - world.keeper.pos.z);
    if (d <= PARTNERS.followDistance) {
      n.needs.affection = Math.min(
        100,
        n.needs.affection + (PARTNERS.bondPerMinute * dtMs) / 60_000,
      );
    }
  }
  if (world.merge && world.timeMs >= world.merge.untilMs) {
    const { a, b } = world.merge;
    world.merge = null;
    events.push({ kind: 'unmerged', a, b });
  }
  // A departed or traded partner leaves the slot.
  world.partners = world.partners.map((id) =>
    id && world.nubbins.some((n) => n.id === id) ? id : null,
  ) as [string | null, string | null];
}
