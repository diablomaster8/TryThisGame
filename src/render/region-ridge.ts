import type { ReadonlyWorld } from './readonly-world';
import type { LayoutTree } from '../config/region-layout';
import { terraceHeight } from '../config/region-layout';
import {
  RIDGE_CAVE,
  RIDGE_FALLS,
  RIDGE_HUT,
  RIDGE_SNOW_Y,
  RIDGE_SPEC,
  RIDGE_TELESCOPE,
  RIDGE_TERRACES,
} from '../config/region-ridge';
import { ridgeSheet } from './paint/ridge';
import type { GroundLook, GroundPaint } from './region-ground';
import { kitModule, type KitPiece } from './region-kit-px';
import { snowballs } from '../sim/snowballs';

import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import type { SpriteSheet } from './sprites/atlas';

/**
 * WORLD-36 (R11 lane D, d7): the ridge in the pixel view, on the region kit. The ground lifts
 * through five terraces; the cliffs between are painted rock with the switchback's ramps cut
 * through them, and everything from level 3 up lies under snow. Shared with the 3D module.
 */

export const RIDGE_GROUND: GroundLook = {
  floor: '#5f7a4a',
  floorDark: '#4c6640',
  open: '#8fa66a',
  track: '#b49a72',
  water: '#4f8fc0',
  waterLight: '#bfe6f8',
};

export const ridgeHeight = (_x: number, z: number): number => terraceHeight(RIDGE_SPEC, z);

/** Snowy pines above the snow line; pines and boulders below it. */
export const ridgeKind = (t: LayoutTree): number =>
  ridgeHeight(t.x, t.z) >= RIDGE_SNOW_Y ? 2 : t.kind % 2;

/**
 * Where the Grove lies across the ridge's seamless border (its east edge, offset by the
 * border's re-basing): left clear so the Grove's stand-in shows through.
 */
export const RIDGE_GROVE_SEAM = { x: -29, z0: 42 } as const;

export const paintRidge: GroundPaint = (g, px, pz, ppu) => {
  const W = g.canvas.width;
  const H = g.canvas.height;
  g.clearRect(0, pz(RIDGE_GROVE_SEAM.z0), px(RIDGE_GROVE_SEAM.x), H - pz(RIDGE_GROVE_SEAM.z0));
  // The snow: everything at or above the snow line (the north part of the canvas).
  const snowZ = RIDGE_TERRACES.find((t) => t.y === RIDGE_SNOW_Y)!.z1;
  g.fillStyle = 'rgba(242, 246, 250, 0.9)';
  g.fillRect(0, 0, W, pz(snowZ + 3));
  g.fillStyle = 'rgba(168, 196, 220, 0.5)';
  for (let i = 0; i < 260; i++) {
    const x = ((i * 7919) % 991) / 991;
    const z = ((i * 104729) % 983) / 983;
    g.fillRect(x * W, z * pz(snowZ + 3), 3, 1);
  }
  // The cliffs: rock strata across each gap, the switchback's ramp cut through it.
  for (let i = 0; i + 1 < RIDGE_TERRACES.length; i++) {
    const z0 = RIDGE_TERRACES[i]!.z1;
    const z1 = RIDGE_TERRACES[i + 1]!.z0;
    g.fillStyle = '#7a7266';
    g.fillRect(0, pz(z0), W, (z1 - z0) * ppu);
    g.fillStyle = '#5e574d';
    for (let r = z0; r < z1; r += 0.7) g.fillRect(0, pz(r), W, 1);
    const ramp = i % 2 === 0 ? -14 : 14;
    g.fillStyle = '#b49a72';
    g.fillRect(px(ramp - 2.2), pz(z0), 4.4 * ppu, (z1 - z0) * ppu);
    g.fillStyle = '#9a8060';
    for (let r = z0; r < z1; r += 0.6) g.fillRect(px(ramp - 2.2), pz(r), 4.4 * ppu, 1);
  }
};

function pieces(): KitPiece[] {
  return [
    { key: 'hut', x: RIDGE_HUT.x, z: RIDGE_HUT.z + 1, w: 6 },
    { key: 'telescope', x: RIDGE_TELESCOPE.x, z: RIDGE_TELESCOPE.z + 0.3, w: 2 },
    { key: 'cave', x: RIDGE_CAVE.x, z: RIDGE_CAVE.z + 1.2, w: 7 },
    { key: 'falls', x: RIDGE_FALLS.x, z: RIDGE_FALLS.z + 3.2, w: RIDGE_FALLS.w, y: 0 },
  ];
}

const mod = kitModule({
  name: 'ridge',
  look: RIDGE_GROUND,
  sheet: ridgeSheet,
  treeW: [3.4, 2.4, 3.4],
  propW: 1.3,
  pieces,
  heightAt: ridgeHeight,
  kindAt: ridgeKind,
  paint: paintRidge,
  arch: { key: 'arch', w: 5 },
  cut: true,
});

export const createRegionPx = mod.createRegionPx;
export const drawEntrance = mod.drawEntrance;

const ball: SpriteDraw = {
  sheet: undefined as unknown as SpriteSheet,
  rect: undefined as unknown as SpriteDraw['rect'],
  flip: false,
  x: 0,
  y: 0,
  z: 0,
  mode: 'billboard',
  w: 0.45,
  h: 0.45,
};

/** R0113 (R13 d1): the snowballs in the air (the sim's, read only) and the kit's own dynamics. */
export function drawDynamic(batch: SpriteBatch, world: ReadonlyWorld, tint: number): void {
  mod.drawDynamic(batch, world, tint);
  const list = snowballs(world);
  if (list.length === 0) return;
  const sheet = ridgeSheet();
  const rect = sheet.frames.get('snowball');
  if (!rect) return;
  ball.sheet = sheet;
  ball.rect = rect;
  for (const b of list) {
    ball.x = b.x;
    ball.z = b.z;
    ball.y = b.y;
    ball.tint = tint;
    batch.draw(ball);
  }
}
