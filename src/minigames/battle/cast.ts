import { actFamilies } from '../../config/dungeon-foes';
import { foeArtId } from '../../render/sprites/foe-family-art';
import type { BattleContext } from '../../sim/battle';
import { HOLLOW_BATTLE_SOURCE } from '../../sim/dungeon-encounters';
import type { World } from '../../sim/types';

/**
 * The art id a bout's rival draws as, in both battle views (R0219, the leftover of R0157): a
 * Hollow pack's foe wears its family's own look (`foe:<family>`), colour-drained when the run
 * is in an act of Greylings, the same id the Hollow's packs draw with on the floor. The boss
 * (`pack-boss`) and any species that is no family's stand-in draw as themselves, as does every
 * rival outside the Hollow. Read only; no DOM.
 */
export function rivalArt(
  world: Partial<Pick<World, 'dungeon'>>,
  context: BattleContext,
  species: string,
): string {
  if (context.kind !== 'encounter' || context.source !== HOLLOW_BATTLE_SOURCE) return species;
  const act = world.dungeon?.act;
  const grey = act !== undefined && !!actFamilies(act)[0]?.grey;
  const family = context.key === 'pack-boss' ? 'boss' : 'pack';
  return foeArtId({ family, ...(grey ? { grey: true as const } : {}) }, species);
}
