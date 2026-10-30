/**
 * LOOK-58: one rarity language across the roster and the Grove. Common; uncommon (a
 * two-tone); rare (shiny or heirloom, or a metal finish); legendary (a jewel, a glass
 * finish, or an Eternal). The roster frames each portrait in its tier's colour with an icon
 * and a label, so colour is never the only signal; in the Grove a rare one glints every 4 s
 * and a legendary one sheds a soft mote now and then.
 */
import { isJewel } from '../sim/nubbin';
import type { Nubbin } from '../sim/types';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export function rarityOf(
  n: Pick<Nubbin, 'eggColor' | 'finish' | 'eternal' | 'shiny' | 'heirloom' | 'tone'>,
): Rarity {
  if (isJewel(n.eggColor) || n.finish === 'glass' || n.eternal) return 'legendary';
  if (n.shiny || n.heirloom || n.finish === 'metal') return 'rare';
  if (n.tone) return 'uncommon';
  return 'common';
}
