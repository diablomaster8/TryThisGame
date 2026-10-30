/**
 * Difficulty tiers for the acts (R0179, DUNG-36): Cosy, Brisk and Wild, like D2's Normal,
 * Nightmare and Hell. Brisk opens when the Act V boss falls on Cosy, Wild when it falls on
 * Brisk, and any open tier can be picked again at the cave mouth, so Cosy is always there.
 * Each tier keeps its own act progress, waypoints and paid boss chests: the save's main
 * fields hold the tier in play and `hollow.tierSaves` the others, swapped on a change, so
 * everything that reads act progress keeps working unchanged. A run carries its tier, which
 * sets its floors' foe levels and pack sizes (`dungeon-density.ts`) and its loot. Pure sim.
 */
import { ACTS } from '../config/dungeon-acts';
import type { Difficulty } from '../config/dungeon-foes';
import { HOLLOW_R7 } from '../config/tuning-dungeon';
import type { SimEvent, World } from './types';

export const TIERS: readonly Difficulty[] = ['cosy', 'brisk', 'wild'];

/** The tier picked for the next act run. */
export function hollowTier(world: World): Difficulty {
  return world.hollow.difficulty ?? 'cosy';
}

/** Tiers the Keeper may pick; Cosy always. */
export function tiersOpen(world: World): Difficulty[] {
  const open = world.hollow.tiersOpen ?? [];
  return TIERS.filter((t) => t === 'cosy' || open.includes(t));
}

/** The chance multiplier for Fancy-or-better gear on a run of this tier. */
export function fancyMul(tier: Difficulty | undefined): number {
  return HOLLOW_R7.tiers.fancyMul[tier ?? 'cosy'];
}

/** FIGHT's assist flag for a tier: gentle (auto-target, free retry), standard or tactics. */
export function fightFlag(tier: Difficulty | undefined): 'gentle' | 'standard' | 'tactics' {
  return HOLLOW_R7.tiers.fight[tier ?? 'cosy'];
}

/** Pick a tier at the cave mouth; refused underground or while it is still shut. */
export function setHollowTier(world: World, tier: Difficulty, events: SimEvent[]): boolean {
  if (world.dungeon || !tiersOpen(world).includes(tier)) return false;
  const from = hollowTier(world);
  if (from === tier) return true;
  const h = world.hollow;
  const saves = (h.tierSaves ??= {});
  saves[from] = {
    acts: h.acts,
    waypoints: h.waypoints,
    bossChests: h.bossChests ?? [],
  };
  const next = saves[tier];
  h.acts = next?.acts ?? [];
  h.waypoints = next?.waypoints ?? [];
  h.bossChests = next?.bossChests ?? [];
  delete saves[tier];
  if (tier === 'cosy') delete h.difficulty;
  else h.difficulty = tier;
  events.push({ kind: 'hollowTier', tier });
  return true;
}

/** The last act's boss fell: the next tier opens (once). */
export function noteFinalBoss(world: World, act: number, events: SimEvent[]): void {
  if (act !== ACTS.length - 1) return;
  // Never Cosy: it is first, so it is nobody's next.
  const next = TIERS[TIERS.indexOf(hollowTier(world)) + 1] as 'brisk' | 'wild' | undefined;
  if (!next) return;
  const open = (world.hollow.tiersOpen ??= []);
  if (open.includes(next)) return;
  open.push(next);
  events.push({ kind: 'hollowTierOpened', tier: next });
}
