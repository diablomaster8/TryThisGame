/**
 * R0741: the Nubbin's keepsake for each learning domain. A deterministic milestone: when the
 * stars of a domain's games reach its threshold (`EDU_KEEPSAKES`), the keepsake is added to
 * `inventory.keepsakes` once. Called by `eduResult`; answers the ids newly granted.
 */
import { EDU_KEEPSAKES } from '../config/tuning-more/kids-noticing';
import type { World } from './types';

export function eduKeepsakes(world: World): string[] {
  const e = world.edu;
  if (!e) return [];
  const have = (world.inventory.keepsakes ??= []);
  const granted: string[] = [];
  for (const k of EDU_KEEPSAKES) {
    if (have.includes(k.id)) continue;
    const stars = k.games.reduce(
      (sum, g) => sum + (e.progress[g as keyof typeof e.progress]?.stars ?? 0),
      0,
    );
    if (stars < k.stars) continue;
    have.push(k.id);
    granted.push(k.id);
  }
  return granted;
}
