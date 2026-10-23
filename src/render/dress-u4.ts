import { Vector3 } from 'three';
import { markAt } from '../config/stage-marks';
import { CG4_U4 } from '../config/tuning-u4';
import { boardFace, noticeSheet } from '../ui/board-art';
import { setInspectSource } from '../ui/item-inspect';
import { dressItems } from './dress-d-rules';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { stageFlags } from './scene-stage';
import type { SpriteSheet } from './sprites/atlas';
import { sheetFromImage } from './sprites/atlas';

/**
 * Campaign graphics 4, package u4, pixel. K29: the message board's face (a card for each
 * open request) and the guard house notices are drawn from strings.ts into sheet frames four
 * times the old painted size, then laid over the board and the cabin wall as billboards, so
 * a close shot reads the lines. A frame is rebuilt only when the card count changes.
 *
 * K12 in the pixel view is the default inspector (ui/item-inspect.ts: two angle sprites),
 * so this dressing only makes sure no 3D source is left registered.
 */
let ctx: PixelDressCtx | null = null;

/** The sprite sheet of one board face (`key` names its card count) built on demand. */
function faceSheet(
  c: PixelDressCtx,
  key: string,
  w: number,
  h: number,
  make: () => HTMLCanvasElement | null,
): { sheet: SpriteSheet; rect: { x: number; y: number; w: number; h: number } } | null {
  const sp = c.sprites;
  if (!sp) return null;
  const sheet = sp.sheets.get(key, () => {
    const art = make() ?? document.createElement('canvas');
    return sheetFromImage(art, { face: [0, 0, w, h] }, w, h);
  });
  const rect = sheet.frames.get('face');
  return rect ? { sheet, rect } : null;
}

export const dressU4: PixelDressing = {
  id: 'u4',
  build(c) {
    ctx = c;
    setInspectSource(null);
  },
  update(world, stage, daylight) {
    const c = ctx;
    const sp = c?.sprites;
    if (!c || !sp || stage.exclusive) return;
    const B = CG4_U4.board;
    const right = (sp.batch as unknown as { right: Vector3 }).right;
    // Toward the camera on the ground plane, so a face stands just in front of what it covers.
    const tx = -right.z;
    const tz = right.x;
    const tint = 1 - daylight.darkness * 0.35;
    const item = dressItems(world, stage, daylight.darkness).find((i) => i.shape === 'board');
    if (item) {
      const f = faceSheet(c, `u4:board:${item.n}`, 176, 128, () => boardFace(176, 128, item.n));
      if (f)
        sp.batch.draw({
          sheet: f.sheet,
          rect: f.rect,
          flip: false,
          x: item.x + tx * B.pixel.forward,
          y: B.pixel.bottom,
          z: item.z + tz * B.pixel.forward,
          mode: 'billboard',
          w: B.pixel.w,
          h: B.pixel.h,
          tint,
        });
    }
    const flags = stageFlags(world, stage);
    const gh = flags.storyline === 'beetle' ? markAt('grove', 'guardhouse') : null;
    if (gh) {
      const f = faceSheet(c, 'u4:notice', 160, 124, () => noticeSheet(160, 124));
      const N = B.notice;
      if (f)
        sp.batch.draw({
          sheet: f.sheet,
          rect: f.rect,
          flip: false,
          x: gh.x + right.x * N.side + tx * N.pixelOut,
          y: N.pixelBottom,
          z: gh.z + right.z * N.side + tz * N.pixelOut,
          mode: 'billboard',
          w: N.w,
          h: N.h,
          tint,
        });
    }
  },
  dispose() {
    ctx = null;
  },
};
