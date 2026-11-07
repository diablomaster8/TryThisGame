/**
 * R0741: the Nubbin's keepsake for each learning domain. A deterministic milestone: when the
 * stars of a domain's games reach its threshold (`EDU_KEEPSAKES`), the keepsake is added to
 * `inventory.keepsakes` once. Each is also a hat (`config/cosmetics-edu.ts`, same id): it goes
 * in the hat box, and onto the first Nubbin's head when that hat slot is empty, so the child
 * sees it worn. Called by `eduResult`; answers the ids newly granted.
 */
import { EDU_KEEPSAKES } from '../config/tuning-more/kids-noticing';
import { wearInSlot } from './wear';
import type { World } from './types';

export function eduKeepsakes(world: World): string[] {
  const e = world.edu;
  if (!e) return [];
  const have = (world.inventory.keepsakes ??= []);
  const granted: string[] = [];
  for (const k of EDU_KEEPSAKES) {
    if (have.includes(k.id)) {
      // A keepsake earned before it was a hat: the hat box catches up (no save change needed).
      if (!world.inventory.hats.includes(k.id)) world.inventory.hats.push(k.id);
      continue;
    }
    const stars = k.games.reduce(
      (sum, g) => sum + (e.progress[g as keyof typeof e.progress]?.stars ?? 0),
      0,
    );
    if (stars < k.stars) continue;
    have.push(k.id);
    granted.push(k.id);
    if (!world.inventory.hats.includes(k.id)) world.inventory.hats.push(k.id);
    const first = world.nubbins[0];
    if (first && !first.hat) wearInSlot(world, first.id, 'hat', k.id);
  }
  return granted;
}
