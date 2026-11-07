import type { SceneStage } from '../config/story';
import { C12C } from '../config/tuning-more/story-quest-markers';
import { DRESS_D } from '../config/tuning-more/campaign-props-items';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { buildQuestMarkSheet } from './paint/quest-marks';
import { questMarkers } from './quest-markers';
import { NATIVE_PPU } from './sprite-batch';
import { frameKey } from './sprites/animations';
import type { SpriteSheet } from './sprites/atlas';

/**
 * R0608, pixel renderer: draws `questMarkers(world)` as camera-facing sprites in the sprite
 * batch (no extra draw call). They bob a little; under reduced motion they hold still.
 */
let ctx: PixelDressCtx | null = null;
let sheet: SpriteSheet | null = null;
let clock = 0;

export const dressQuestMarkers: PixelDressing = {
  id: 'quest-markers',
  build(c) {
    ctx = c;
    clock = 0;
    sheet = null;
    if (!c.sprites) return;
    sheet = buildQuestMarkSheet();
    c.track(sheet);
  },
  update(world: World, _stage: SceneStage, _daylight: Daylight, dt: number) {
    const c = ctx;
    const spr = c?.sprites;
    if (!c || !spr || !sheet) return;
    const still = c.reduceMotion();
    if (!still) clock += dt;
    for (const m of questMarkers(world)) {
      const key = m.kind === 'offer' ? 'markOffer' : 'markStep';
      const rect = sheet.frames.get(frameKey(key, 'front', 0));
      if (!rect) continue;
      const bob = still ? 0 : Math.sin(clock * 3 + m.x) * DRESS_D.glint.bob;
      // R0629: a child's markers are larger and pulse (still under reduced motion).
      const grow = m.big ? C12C.markers.kidScale * (still ? 1 : 1 + 0.1 * Math.sin(clock * 4)) : 1;
      spr.batch.draw({
        sheet,
        rect,
        flip: false,
        x: m.x,
        y: m.lift + bob,
        z: m.z,
        mode: 'billboard',
        tint: 1,
        w: (rect.w / NATIVE_PPU) * C12C.markers.pixelScale * grow,
        h: (rect.h / NATIVE_PPU) * C12C.markers.pixelScale * grow,
      });
    }
  },
  dispose() {
    ctx = null;
    sheet = null;
  },
};
