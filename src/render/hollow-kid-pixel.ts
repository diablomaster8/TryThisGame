import type { Floor } from '../sim/dungeon';
import { berryId, hasBerries, kidBerryCells } from '../sim/dungeon-kid-play';
import type { DungeonRun, Vec2 } from '../sim/types';
import { cellCentre } from '../sim/dungeon';
import { lootFog, type PixelPackCtx } from './hollow-packs-pixel';
import { frameKey } from './sprites/animations';

/**
 * Kid mode's counting berries in the Pixel renderer (R0188, lane B r10): the props sheet's
 * red fruit, small, on each of the level's five berry cells (`sim/dungeon-kid-play.ts`), shown
 * like loot (once explored, dimmed out of sight) until picked. No new sheet.
 */
export function drawKidBerries(f: Floor, run: DungeonRun, keeper: Vec2, ctx: PixelPackCtx) {
  if (!hasBerries(run)) return;
  const sheet = ctx.sheets.props();
  const rect = sheet.frames.get(frameKey('fruit-power', 'front', 0));
  if (!rect) return;
  const bob = ctx.reduceMotion ? 0 : Math.sin(ctx.nowMs / 300) * 0.05;
  kidBerryCells(f).forEach((c, i) => {
    if (run.taken.includes(berryId(i))) return;
    const fog = lootFog(run, f, keeper, c);
    if (fog === 0) return;
    const at = cellCentre(f, c);
    ctx.batch.draw({
      sheet,
      rect,
      flip: false,
      x: at.x,
      y: 0.05 + bob,
      z: at.z,
      w: 0.6,
      h: 0.6,
      mode: 'billboard',
      tint: fog * ctx.lightAt(at.x, at.z),
    });
  });
}
