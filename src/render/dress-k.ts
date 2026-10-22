import type { Vector3 } from 'three';
import type { SceneStage } from '../config/story';
import { GROVE, STORY } from '../config/tuning';
import { LOOK_F } from '../config/tuning-f';
import { CG2_K } from '../config/tuning-k';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { RasterAtlas } from './paint/atlas';
import {
  K_PPU,
  paintBannerPole,
  paintCart,
  paintMilestone,
  paintRoad,
  paintSundial,
  paintTallyPost,
  paintWreath,
} from './paint/campaign-k';
import { SCENERY } from './scenery';
import { stageFlags } from './scene-stage';
import { ddLayout, foldExtras } from './story-b-layout';
import { stateFrom } from './story-b-state';
import type { SpriteSheet } from './sprites/atlas';

/**
 * Campaign graphics 2, package k, pixel renderer (H3, M4, N5): each separate campaign's own
 * landmarks as painted billboards in the sprite pass. The Hundred Days' Fold gets the well's
 * tally post (a stroke per day) and wreaths on its doors from chapter 7; the Beetle Road gets
 * its lane flat on the ground with ruts, three milestones, three banner poles (crest shapes:
 * sun, moon, drop) and a cart with its tarp on or off; Dawn & Dusk gets the green's sundial.
 * The carved creature plaques over the crest-house doors are painted into those houses'
 * sprites (render/paint/story-b.ts). The Fold's ruin art and the memorial flowers are
 * package b's and memorial-spot.ts. Reads the world, writes nothing.
 */
const ROAD_BOUNDS = { x0: -17, z0: 22, x1: 4, z1: 37 };
const ROAD_PPU = 8;

interface Sheets {
  base: SpriteSheet;
  tally: SpriteSheet | null;
  tallyDays: number;
}

export const dressK: PixelDressing = (() => {
  let ctx: PixelDressCtx | null = null;
  let sheets: Sheets | null = null;

  function buildBase(c: PixelDressCtx): SpriteSheet {
    const B = CG2_K.beetle;
    const atlas = new RasterAtlas(1024);
    atlas.add('wreath', paintWreath());
    atlas.add('sundial', paintSundial());
    atlas.add('cart:shut', paintCart(false));
    atlas.add('cart:open', paintCart(true));
    for (const n of [1, 2, 3]) atlas.add(`stone:${n}`, paintMilestone(n));
    for (const p of B.poles) atlas.add(`pole:${p.crest}`, paintBannerPole(p.crest, p.colour));
    atlas.add(
      'road',
      paintRoad(B.road, B.roadWidth, B.rutOffset, B.rutWidth, ROAD_BOUNDS, ROAD_PPU),
    );
    const sheet = atlas.build();
    c.track(sheet);
    return sheet;
  }

  function tallySheet(c: PixelDressCtx, days: number): SpriteSheet {
    const atlas = new RasterAtlas(64);
    atlas.add('post', paintTallyPost(days, CG2_K.fold.perGroup));
    const sheet = atlas.build();
    c.track(sheet);
    return sheet;
  }

  return {
    id: 'k',
    build(c) {
      ctx = c;
      sheets = null;
    },
    update(world: World, stage: SceneStage, daylight: Daylight) {
      if (!ctx?.sprites) return;
      const st = Object.keys(stage).length ? stage : null;
      const f = stageFlags(world, st);
      if (f.location !== 'grove' || stage.exclusive) return;
      const b = stateFrom(world, st, f);
      const onBeetle = f.campaign === 'beetle';
      if (!b.hundred && !b.dawnDusk && !onBeetle) return;
      if (!sheets) sheets = { base: buildBase(ctx), tally: null, tallyDays: -1 };
      const { batch } = ctx.sprites;
      const tint = 1 - daylight.darkness * 0.35;
      const right = (batch as unknown as { right?: Vector3 }).right;
      const up = (batch as unknown as { up?: Vector3 }).up;
      // A step toward the camera, so a sprite drawn over another one stands in front of it.
      const nudge = (d: number) => ({
        x: (right ? -right.z : 0) * d,
        z: (right ? right.x : 0) * d,
      });
      const draw = (
        sheet: SpriteSheet,
        key: string,
        x: number,
        z: number,
        w: number,
        o: { y?: number; mode?: 'billboard' | 'flat'; h?: number; front?: number } = {},
      ) => {
        const rect = sheet.frames.get(key);
        if (!rect) return;
        const n = nudge(o.front ?? 0);
        batch.draw({
          sheet,
          rect,
          flip: false,
          x: x + n.x,
          y: o.y ?? 0,
          z: z + n.z,
          mode: o.mode ?? 'billboard',
          w,
          h: o.h ?? (w * rect.h) / rect.w,
          tint,
        });
      };
      /** Draw a billboard `t` up the camera's tilted vertical from the ground at (x, z). */
      const drawUp = (key: string, x: number, z: number, t: number, w: number, front: number) => {
        const base = sheets!.base;
        const px = x + (up ? up.x : 0) * t;
        const pz = z + (up ? up.z : 0) * t;
        draw(base, key, px, pz, w, { y: (up ? up.y : 1) * t, front });
      };

      if (b.hundred) {
        const T = CG2_K.fold;
        const days = Math.min(T.tallyMax, Math.max(0, Math.floor(world.timeMs / STORY.dayMs)));
        if (!sheets.tally || sheets.tallyDays !== days) {
          if (sheets.tally) sheets.tally.texture.dispose();
          sheets.tally = tallySheet(ctx, days);
          sheets.tallyDays = days;
        }
        const well = GROVE.buildings.well;
        draw(
          sheets.tally,
          'post',
          well.x + Math.cos(T.postAngle) * T.postOut,
          well.z + Math.sin(T.postAngle) * T.postOut,
          18 / K_PPU,
          { front: 0.1 },
        );
        const idx = f.storyChapter ?? -1;
        if (idx >= T.wreathFromIndex) {
          const homes: Array<{ x: number; z: number; size: number }> = [];
          for (const s of SCENERY)
            if (s.kind === 'cottage' || s.kind === 'school' || s.kind === 'dojo')
              homes.push({ x: s.x, z: s.z, size: s.size });
          for (const e of foldExtras()) {
            const sc = SCENERY.find((q) => q.kind === e.kind);
            homes.push({ x: e.x, z: e.z, size: sc?.size ?? 7 });
          }
          for (const h of homes)
            drawUp('wreath', h.x, h.z, h.size * 0.17, 0.6, 0.35 + h.size * 0.1);
        }
      }

      if (onBeetle) {
        const B = CG2_K.beetle;
        const base = sheets.base;
        const cx = (ROAD_BOUNDS.x0 + ROAD_BOUNDS.x1) / 2;
        const cz = (ROAD_BOUNDS.z0 + ROAD_BOUNDS.z1) / 2;
        draw(base, 'road', cx, cz, ROAD_BOUNDS.x1 - ROAD_BOUNDS.x0, {
          mode: 'flat',
          y: 0.03,
          h: ROAD_BOUNDS.z1 - ROAD_BOUNDS.z0,
        });
        for (const m of B.milestones) draw(base, `stone:${m.n}`, m.x, m.z, 16 / K_PPU);
        if (stage.props?.banners !== 'hide')
          for (const p of B.poles) draw(base, `pole:${p.crest}`, p.x, p.z, 24 / K_PPU);
        const idx = f.storyChapter ?? -1;
        const open = stage.props?.cart ? stage.props.cart === 'open' : idx >= 4;
        const at = LOOK_F.beetle.cart;
        draw(base, open ? 'cart:open' : 'cart:shut', at.x, at.z, 88 / 32, { front: 0.2 });
      }

      if (b.dawnDusk) {
        const L = ddLayout();
        draw(sheets.base, 'sundial', L.centre.x, L.centre.z, 30 / K_PPU);
      }
    },
    dispose() {
      ctx = null;
      sheets = null;
    },
  };
})();
