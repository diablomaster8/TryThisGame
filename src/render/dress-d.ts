import { DRESS_D } from '../config/tuning-d';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import { dressItems, itemSignature, shelfKeepsakes, type DressItem } from './dress-d-rules';
import { buildDressSheet, buildShelfSheet } from './paint/dress-props';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { frameKey } from './sprites/animations';
import type { SpriteSheet } from './sprites/atlas';

/**
 * Campaign-graphics package d, pixel renderer: props and items (H11, M1, M2, M7, M12, M17,
 * N1, N4). What stands comes from dress-d-rules.ts, shared with Full 3D; here each item is
 * a painted billboard (paint/dress-props.ts) drawn into the sprite batch. Glinting items
 * get a star billboard over them and bob a little; under reduced motion the star is held
 * still and nothing bobs. The keepsake shelf is repainted when its contents change.
 */
let ctx: PixelDressCtx | null = null;
let sheet: SpriteSheet | null = null;
let shelf: { sig: string; sheet: SpriteSheet } | null = null;
let clock = 0;

/** The frame key for an item's current look, or null when it draws nothing here. */
function frameFor(it: DressItem): string | null {
  switch (it.shape) {
    case 'signpost':
      return it.n > 0 ? 'signpost-letter' : 'signpost';
    case 'shrine':
      return it.lit ? 'shrine-lit' : 'shrine';
    case 'bell':
      return it.n > 0 ? 'bell-new' : 'bell';
    case 'board':
      return `board${Math.min(6, it.n)}`;
    case 'porchLight':
      return it.lit ? 'porchLight-lit' : 'porchLight';
    case 'none':
    case 'keepShelf':
    case 'chair':
    case 'bench':
      return null;
    default:
      return it.shape;
  }
}

function disposeShelf(): void {
  shelf?.sheet.dispose();
  shelf = null;
}

export const dressD: PixelDressing = {
  id: 'd',
  build(c) {
    ctx = c;
    clock = 0;
    shelf = null;
    sheet = null;
    if (!c.sprites) return;
    sheet = buildDressSheet();
    c.track(sheet);
  },
  update(world: World, stage: SceneStage, daylight: Daylight, dt: number) {
    const c = ctx;
    const spr = c?.sprites;
    if (!c || !spr || !sheet) return;
    const still = c.reduceMotion();
    if (!still) clock += dt;
    const items = dressItems(world, stage, daylight.darkness);
    const dim = 1 - daylight.darkness * 0.35;
    const batch = spr.batch;
    const props = spr.sheets.props();
    const star = sheet.frames.get(frameKey('glint', 'front', 0));
    for (const it of items) {
      const bob =
        it.glint && !still
          ? Math.sin(clock * DRESS_D.glint.speed + it.x * 1.7 + it.z * 2.3) * DRESS_D.glint.bob
          : 0;
      const dz = it.cottage ? DRESS_D.pixelCottageDz : 0;
      const lit = it.lit;
      const tint = lit ? 1 : dim;
      if (it.shape === 'keepShelf') {
        const ids = it.ids ?? [];
        const keeps = world.inventory.keepsakes;
        const newest = keeps[keeps.length - 1];
        const slot = newest ? shelfKeepsakes(world).indexOf(newest) : -1;
        const sig = `${itemSignature(it)}|${slot}`;
        if (!shelf || shelf.sig !== sig) {
          disposeShelf();
          shelf = { sig, sheet: buildShelfSheet(ids, slot) };
        }
        const rect = shelf.sheet.frames.get(frameKey('keepShelf', 'front', 0));
        if (rect)
          batch.draw({
            sheet: shelf.sheet,
            rect,
            flip: false,
            x: it.x,
            y: 0,
            z: it.z + dz,
            mode: 'billboard',
            tint,
          });
        continue;
      }
      if (it.shape === 'chair' || it.shape === 'bench') {
        const rect = props.frames.get(
          frameKey(it.shape === 'chair' ? 'prop-chair' : 'prop-oldBench', 'front', 0),
        );
        if (rect)
          batch.draw({
            sheet: props,
            rect,
            flip: false,
            x: it.x,
            y: 0,
            z: it.z + dz,
            mode: 'billboard',
            tint,
          });
        continue;
      }
      const key = frameFor(it);
      const rect = key ? sheet.frames.get(frameKey(key, 'front', 0)) : undefined;
      if (rect)
        batch.draw({
          sheet,
          rect,
          flip: false,
          x: it.x,
          y: bob,
          z: it.z + dz,
          mode: 'billboard',
          tint,
        });
      // The star is the cue, so it hangs over the item even where the item has no sprite of its own.
      // Keepsakes' star is painted into the shelf, where its row is.
      if (it.glint && star && it.shape !== 'none') {
        const size =
          DRESS_D.glint.size *
          (still ? 1 : 1 + DRESS_D.glint.twinkle * Math.sin(clock * 3.1 + it.x));
        batch.draw({
          sheet,
          rect: star,
          flip: false,
          x: it.x,
          y: (it.shape === 'signpost' ? 0.8 : it.glintAt[1]) - size / 2 + bob,
          z: it.z + dz,
          mode: 'billboard',
          w: size,
          h: size,
          tint: 1,
        });
      }
    }
  },
  dispose() {
    disposeShelf();
    sheet = null;
    ctx = null;
  },
};
