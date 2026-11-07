import type { ReadonlyWorld } from './readonly-world';
import { BORDER } from '../config/tuning-more/ui-tap-prints-border';

import { borderBlockers, borderEdge } from '../sim/border';
import type { ChunkMask, SpriteCuller } from './chunks';
import type { Decoration } from './decor';
import { SCENERY } from './scenery';
import { isSceneryHidden } from './scenery-hide';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import { frameKey } from './sprites/animations';
import type { SpriteSheet } from './sprites/atlas';

/**
 * WORLD-39 (R12 lane D): the real Grove drawn back across a seamless border from inside a
 * neighbour (the shore, the ridge), in the pixel view. The Grove scene shows its own ground,
 * hills, pond and stream at the offset (`GroveScene.setEdgeOffset`); this stands the Grove's
 * own scenery, fence posts, ground dressing and border hedge on it, chunk by chunk through the
 * same masks the Grove uses, so only the strip in view costs anything. Nothing here is
 * pickable: the Keeper walks back into the Grove to touch it.
 */
export interface GroveBackSheets {
  scenery: SpriteSheet;
  props: SpriteSheet;
}

const DRAW: SpriteDraw = {
  sheet: null as never,
  rect: null as never,
  flip: false,
  x: 0,
  y: 0,
  z: 0,
  mode: 'billboard',
};

function put(
  batch: SpriteBatch,
  sheet: SpriteSheet,
  key: string,
  flip: boolean,
  x: number,
  y: number,
  z: number,
  mode: SpriteDraw['mode'],
  w: number | undefined,
  tint: number,
  opacity = 1,
): void {
  const rect = sheet.frames.get(frameKey(key, 'front', 0));
  if (!rect) return;
  DRAW.sheet = sheet;
  DRAW.rect = rect;
  DRAW.flip = flip;
  DRAW.x = x;
  DRAW.y = y;
  DRAW.z = z;
  DRAW.mode = mode;
  DRAW.w = w;
  DRAW.h = w === undefined ? undefined : (w * rect.h) / rect.w;
  DRAW.tint = tint;
  DRAW.opacity = opacity;
  batch.draw(DRAW);
}

export function drawGroveBack(
  batch: SpriteBatch,
  world: ReadonlyWorld,
  sheets: GroveBackSheets,
  masks: { scenery: ChunkMask; fences: ChunkMask; decor: ChunkMask },
  culler: SpriteCuller | null,
  items: { fences: ReadonlyArray<{ x: number; z: number }>; decor: readonly Decoration[] },
  off: { x: number; z: number },
  keeper: { x: number; z: number },
  tint: number,
  hides: (d: SpriteDraw) => number,
): void {
  masks.scenery.update(culler, off.x, off.z);
  masks.fences.update(culler, off.x, off.z);
  masks.decor.update(culler, off.x, off.z);
  for (let i = 0; i < SCENERY.length; i++) {
    if (!masks.scenery.has(i)) continue;
    const s = SCENERY[i]!;
    if (isSceneryHidden(s.kind)) continue;
    const rect = sheets.scenery.frames.get(frameKey(s.kind, 'front', 0));
    if (!rect) continue;
    DRAW.x = s.x + off.x;
    DRAW.z = s.z + off.z;
    DRAW.mode = 'billboard';
    DRAW.sheet = sheets.scenery;
    DRAW.rect = rect;
    DRAW.w = s.size;
    DRAW.h = (s.size * rect.h) / rect.w;
    const fade = s.kind.startsWith('rock') || s.kind.startsWith('log') ? 1 : hides(DRAW);
    put(
      batch,
      sheets.scenery,
      s.kind,
      false,
      s.x + off.x,
      0,
      s.z + off.z,
      'billboard',
      s.size,
      tint,
      fade,
    );
  }
  items.fences.forEach((f, i) => {
    if (masks.fences.has(i))
      put(
        batch,
        sheets.scenery,
        'fencePost',
        false,
        f.x + off.x,
        0,
        f.z + off.z,
        'billboard',
        0.75,
        tint,
      );
  });
  items.decor.forEach((d, i) => {
    if (!masks.decor.has(i)) return;
    put(
      batch,
      sheets.props,
      d.frame,
      d.flip,
      d.x + off.x,
      d.flat ? 0.03 : 0,
      d.z + off.z,
      d.flat ? 'flat' : 'billboard',
      undefined,
      tint,
    );
  });
  // The hedge round the Grove's edge and the logs across ways not open yet, near the Keeper.
  const kx = keeper.x - off.x;
  const kz = keeper.z - off.z;
  const bushes = ['bush-1', 'bush-2', 'bush-3'];
  borderBlockers().forEach((b, i) => {
    if (Math.abs(b.x - kx) > BORDER.pxDraw || Math.abs(b.z - kz) > BORDER.pxDraw) return;
    const log = b.kind === 'log';
    if (log && borderEdge(b.x, b.z, world).kind === 'exit') return;
    put(
      batch,
      sheets.scenery,
      log ? 'log' : bushes[i % bushes.length]!,
      i % 2 === 1,
      b.x + off.x,
      0,
      b.z + off.z,
      'billboard',
      log ? BORDER.logLen : BORDER.bushSize,
      tint,
    );
  });
}
