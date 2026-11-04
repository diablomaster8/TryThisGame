import { POSTCARD_ALBUM_TEXT, POSTCARD_NOTES_ALL } from '../config/strings-r12d2';
import type { RegionId } from '../config/regions';
import { collectiblesIn, tally } from '../sim/collectibles';
import type { World } from '../sim/types';
import { el } from './dom';

/**
 * R0091 (WORLD-27): the postcard album page. A fold-out under a region's map tab that lists the
 * region's lost postcards: the ones found read in full, the ones still out there show a "?".
 * Reads the world only. Null for a region that has no postcards.
 */
export function postcardAlbum(
  world: Pick<World, 'collected'>,
  region: RegionId,
): HTMLElement | null {
  const cards = collectiblesIn(region).filter((c) => c.kind === 'postcard');
  const notes = POSTCARD_NOTES_ALL[region];
  if (cards.length === 0 || !notes) return null;
  const got = world.collected ?? {};
  const t = tally(world, region, 'postcard');
  const box = el('details', 'wm-album');
  box.appendChild(el('summary', 'wm-album-head', POSTCARD_ALBUM_TEXT.summary(t.got, t.of)));
  cards.forEach((c, i) => {
    const line = got[c.id] !== undefined ? (notes[i] ?? '') : POSTCARD_ALBUM_TEXT.unfound;
    box.appendChild(el('p', got[c.id] !== undefined ? 'wm-album-card' : 'wm-album-card dim', line));
  });
  return box;
}
