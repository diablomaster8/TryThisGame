import { VILLAGE, VILLAGE_PICK } from '../config/region-village';
import { frameKey } from './sprites/animations';
import type { SpriteSheet } from './sprites/atlas';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import { villageSheet } from './paint/village';
import { villageBuildings, villageDressing, villageRecruits } from '../sim/village';
import type { World } from '../sim/types';

/**
 * R0095 (WORLD-32): the village square in the pixel Grove, the same pieces in the same places
 * as the 3D square (`render3d/village-square.ts`): the paving and fountain always, a building
 * for each open service, a dressing set per 20 prosperity and the recruits on their loops.
 * Buildings and recruits carry `village:` picks the HUD answers (`ui/village-tap.ts`).
 */
const TEXELS = 24;

type Shadow = (x: number, y: number, z: number, r: number) => void;

export function drawVillage(
  batch: SpriteBatch,
  world: World,
  scenery: SpriteSheet,
  shadow: Shadow,
  light: (x: number, z: number) => number,
): void {
  const sheet = villageSheet();
  const sq = VILLAGE.square;
  const put = (
    key: string,
    x: number,
    z: number,
    o: { sheet?: SpriteSheet; w?: number; flat?: boolean; pick?: string; flip?: boolean } = {},
  ): void => {
    const s = o.sheet ?? sheet;
    const rect = s.frames.get(key);
    if (!rect) return;
    const w = o.w ?? rect.w / TEXELS;
    const d: SpriteDraw = {
      sheet: s,
      rect,
      flip: !!o.flip,
      x,
      y: o.flat ? 0.02 : 0,
      z,
      mode: o.flat ? 'flat' : 'billboard',
      w,
      h: (w * rect.h) / rect.w,
      tint: light(x, z),
    };
    batch.draw(d, o.pick ? { id: `${VILLAGE_PICK}${o.pick}`, kind: 'building' } : undefined);
  };
  put('paving', sq.x, sq.z, { w: sq.r * 2, flat: true });
  shadow(sq.x, 0, sq.z, 1.1);
  put('fountain', sq.x, sq.z);
  for (const b of villageBuildings(world)) {
    shadow(b.x, 0, b.z, Math.max(b.hw, b.hd) * 0.9);
    if (b.id === 'stall')
      put(frameKey('stall', 'front', 0), b.x, b.z, { sheet: scenery, w: 2.4, pick: b.id });
    else put(b.id, b.x, b.z, { pick: b.id });
  }
  const sets = villageDressing(world);
  const ring = (n: number, r: number, f: (x: number, z: number, i: number) => void): void => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.2;
      f(sq.x + Math.cos(a) * r, sq.z + Math.sin(a) * r, i);
    }
  };
  for (let s = 0; s < sets; s++) {
    const set = VILLAGE.dressing[s]!;
    if (set === 'bunting')
      ring(8, sq.r - 0.6, (x, z, i) => put('bunting', x, z, { flip: i % 2 === 1 }));
    else if (set === 'lanterns') ring(6, sq.r - 1.1, (x, z) => put('lanterns', x, z));
    else if (set === 'flowers') ring(8, sq.r - 2.3, (x, z) => put('flowers', x, z));
    else if (set === 'pennants') ring(4, sq.r + 0.6, (x, z) => put('pennants', x, z));
    else {
      const a = Math.atan2(-0.72, 0.69);
      put('arch', sq.x + Math.cos(a) * (sq.r + 0.2), sq.z + Math.sin(a) * (sq.r + 0.2));
    }
  }
  for (const r of villageRecruits(world)) {
    shadow(r.pos.x, 0, r.pos.z, 0.35);
    const frame = Math.floor(world.timeMs / 300 + r.index) % 2;
    put(`figure-${r.role}-${frame}`, r.pos.x, r.pos.z, {
      pick: `r${r.index}`,
      flip: Math.sin(r.yaw) < 0,
      w: VILLAGE.figure.h,
    });
  }
}
