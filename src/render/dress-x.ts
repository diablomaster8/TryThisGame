import { CG2_X } from '../config/tuning';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { SceneStager, terraceY } from './scene-stage';
import type { ScreenRect } from './stage-api';

/**
 * Campaign graphics 2, package x, pixel (H12): while a scene is staged, a building sprite
 * that covers one of the framed people (the Keeper, the speakers, the shot's focus) thins
 * through the registry's checkerboard dither, which the pixel view draws inside a circle
 * round the cast. "Covers" means one of the subject's feet, middle or head lands inside
 * the sprite's last screen rect while the subject's feet sit above the sprite's foot, so
 * the subject stands behind it. The fade eases in and out, and is a straight swap under
 * reduced motion (the dither itself never moves). Only fades this dressing set are reset.
 */
export const dressX: PixelDressing = (() => {
  let ctx: PixelDressCtx | null = null;
  const stager = new SceneStager();
  /** This dressing's fade per building id, eased toward its target. */
  const mine = new Map<string, number>();

  const inside = (r: ScreenRect, x: number, y: number) =>
    x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

  return {
    id: 'x',
    build(c) {
      ctx = c;
    },
    update(world: World, _stage: SceneStage, _daylight: Daylight, dt: number) {
      if (!ctx) return;
      stager.update(world);
      const P = CG2_X.pixel;
      const people = stager.active && world.location === 'grove' ? stager.frame(world) : [];
      const pts = people.map((p) => {
        const y = terraceY(p.x, p.z);
        return [0, 0.5, 1].map((t) => ctx!.camera.toScreen(p.x, y + P.height * t, p.z));
      });
      const step = ctx.reduceMotion() ? 1 : Math.min(1, dt / P.ease);
      for (const b of ctx.buildings.list()) {
        const r = b.rect;
        const covers =
          r !== null &&
          pts.some((s) => {
            const feet = s[0];
            if (!feet || feet.y > r.y + r.h - P.behind) return false;
            return s.some((q) => q !== null && inside(r, q.x, q.y));
          });
        const was = mine.get(b.id) ?? 0;
        const target = covers ? 1 : 0;
        if (was === 0 && target === 0) continue;
        const now = target > was ? Math.min(target, was + step) : Math.max(target, was - step);
        ctx.buildings.setFade(b.id, now);
        if (now === 0) mine.delete(b.id);
        else mine.set(b.id, now);
      }
    },
    dispose() {
      if (ctx) for (const id of mine.keys()) ctx.buildings.setFade(id, 0);
      mine.clear();
      ctx = null;
    },
  };
})();
