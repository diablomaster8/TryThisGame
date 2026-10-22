import {
  CircleGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RingGeometry,
  type Texture,
} from 'three';
import { markAt } from '../config/stage-marks';
import { DUNGEON } from '../config/tuning';
import { CG2_S } from '../config/tuning-s';
import type { World } from '../sim/types';
import { buildArtS, gridTexture, ovalMaskTexture, US, type ArtS } from './art-s';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { buildDungeonProps, paintFloorTexture } from './paint/dungeon';
import { belowFloor, belowMark, dripSpot, rootMark, setsS, torchSpots } from './sets-s';
import type { SpriteSheet } from './sprites/atlas';
import { frameKey } from './sprites/animations';

/**
 * Campaign graphics 2, package s, pixel renderer (see render/dressings.ts):
 *
 * - C3, the Root Node's white room: a white void under everything, a pale floor disc with a
 *   1 px horizon ring round the chair's mark. Package f's own disc and chair draw on it.
 * - C4, the Beetle Road's floors below: the dungeon painter's floor (a made-up oval room),
 *   dark beyond, a dithered torch-lit oval mask, wall sconces, and drips when it rains.
 * - M3, Logged In's digital set: a 1 px grid decal on the meadow, a holo edge on the board,
 *   pixel sparkles on the eggs, and chapter 6's plain door.
 *
 * Under reduced motion the drips hang still and the sparkles hold one size.
 */

let ctx: PixelDressCtx | null = null;
let art: ArtS | null = null;
let props: SpriteSheet | null = null;
let clock = 0;
let root: Group | null = null;
let below: Group | null = null;
let grid: Mesh | null = null;
let gridMat: MeshBasicMaterial | null = null;

function basic(color: string, map?: Texture | null, transparent = false): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color,
    ...(map ? { map } : {}),
    transparent,
    depthWrite: !transparent,
    toneMapped: false,
  });
}

function flat(
  geo: PlaneGeometry | CircleGeometry | RingGeometry,
  m: MeshBasicMaterial,
  y: number,
  at?: { x: number; z: number },
) {
  const mesh = new Mesh(geo, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(at?.x ?? 0, y, at?.z ?? 0);
  return mesh;
}

function buildRoot(c: PixelDressCtx): Group {
  const R = CG2_S.root;
  const g = new Group();
  g.name = 'dress-s-root';
  const m = rootMark();
  const parts = [
    flat(new PlaneGeometry(240, 240), basic(R.void), -0.06),
    flat(new CircleGeometry(R.floorRadius, 48), basic(R.floor), -0.04, m),
    flat(new RingGeometry(R.floorRadius, R.floorRadius + 0.07, 64), basic(R.horizon), -0.03, m),
  ];
  for (const p of parts) {
    c.track(p.geometry);
    c.track(p.material as MeshBasicMaterial);
    g.add(p);
  }
  g.visible = false;
  return g;
}

function buildBelow(c: PixelDressCtx): Group {
  const B = CG2_S.below;
  const g = new Group();
  g.name = 'dress-s-below';
  const m = belowMark();
  const size = B.cells * DUNGEON.cell;
  const floorTex = paintFloorTexture(belowFloor(), B.depth);
  const mask = ovalMaskTexture(size, B.ovalX, B.ovalZ);
  c.track(floorTex);
  if (mask) c.track(mask);
  const parts = [
    flat(new PlaneGeometry(240, 240), basic(B.dark), -0.06),
    flat(new PlaneGeometry(size, size), basic('#ffffff', floorTex), -0.04, m),
    ...(mask ? [flat(new PlaneGeometry(size, size), basic('#ffffff', mask, true), -0.02, m)] : []),
  ];
  for (const p of parts) {
    c.track(p.geometry);
    c.track(p.material as MeshBasicMaterial);
    g.add(p);
  }
  g.visible = false;
  return g;
}

function buildGrid(c: PixelDressCtx): Mesh | null {
  const D = CG2_S.digital;
  const t = gridTexture(1024, D.pxSize);
  if (!t) return null;
  c.track(t);
  gridMat = new MeshBasicMaterial({
    color: D.gridColor,
    map: t,
    transparent: true,
    opacity: D.pxDay,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
  });
  c.track(gridMat);
  const geo = new PlaneGeometry(D.pxSize, D.pxSize);
  c.track(geo);
  const mesh = flat(geo, gridMat, 0.03);
  mesh.position.set(D.pxX, 0.03, D.pxZ);
  mesh.renderOrder = 1;
  mesh.visible = false;
  return mesh;
}

export const dressS: PixelDressing = {
  id: 's',
  build(c) {
    ctx = c;
    clock = 0;
    art = c.sprites ? buildArtS() : null;
    if (art) c.track(art.sheet);
    props = null;
    root = null;
    below = null;
    grid = null;
    gridMat = null;
    if (typeof document === 'undefined') return;
    root = buildRoot(c);
    below = buildBelow(c);
    c.scene.add(root, below);
    grid = buildGrid(c);
    if (grid) c.groups.grove.add(grid);
  },

  update(world: World, stage, daylight, dt) {
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    clock += dt;
    const s = setsS(world, stage);
    if (root) root.visible = s.root;
    if (below) below.visible = s.below;
    if (grid && gridMat) {
      grid.visible = s.digital;
      const D = CG2_S.digital;
      gridMat.opacity = D.pxDay + (D.pxNight - D.pxDay) * Math.min(1, daylight.darkness / 0.7);
    }
    const sp = ctx.sprites;
    if (!sp || !art) return;
    const a = art;
    const dim = 1 - 0.55 * daylight.darkness;
    const up = (key: string, x: number, y: number, z: number, tint = 1, opacity = 1) => {
      const r = a.frame(key);
      sp.batch.draw({
        sheet: a.sheet,
        rect: r,
        flip: false,
        x,
        y,
        z,
        mode: 'billboard',
        w: r.w / US,
        h: r.h / US,
        tint,
        opacity,
      });
    };

    if (s.below) {
      const m = belowMark();
      props ??= buildDungeonProps();
      if (!ctx.sprites) return;
      const sconce = props.frames.get(frameKey('sconce', 'front', 0));
      for (const t of torchSpots()) {
        up('glow', m.x + t.x, 0.6, m.z + t.z);
        if (sconce)
          sp.batch.draw({
            sheet: props,
            rect: sconce,
            flip: false,
            x: m.x + t.x,
            y: 0.9,
            z: m.z + t.z,
            mode: 'billboard',
            w: sconce.w / 16,
            h: sconce.h / 16,
            tint: 1,
          });
      }
      if (s.drips) {
        const B = CG2_S.below;
        for (let i = 0; i < B.drips; i++) {
          const d = dripSpot(i);
          const t = reduce ? 0.5 : (clock / B.dripFallS + d.phase) % 1;
          up('drip', m.x + d.x, B.dripFrom * (1 - t), m.z + d.z, 1, 0.9);
          if (reduce || t > 0.8) up('ripple', m.x + d.x, 0.02, m.z + d.z, 1, 0.8);
        }
      }
    }

    if (s.digital) {
      // The board's holo edge, drawn over package f's board on the same spot.
      const bm = markAt('grove', 'board') ?? { x: 3, z: -2, yaw: 0 };
      up('board-edge', bm.x, 0, bm.z);
      if (s.door) {
        const D = CG2_S.digital;
        up('door', D.doorX, 0, D.doorZ, Math.max(0.7, dim));
      }
      // Pixel sparkles over the eggs on the grass.
      const D = CG2_S.digital;
      let i = 0;
      for (const n of world.nubbins) {
        if (n.stage !== 'egg') continue;
        const ph = reduce ? 2 : Math.floor(((clock / D.glintS + i * 0.37) % 1) * 6);
        i++;
        if (ph > 3) continue;
        up(`spark-${ph}`, n.pos.x + 0.28, 0.75 + n.y, n.pos.z + 0.05);
      }
    }
  },

  dispose() {
    props?.dispose();
    props = null;
    art = null;
    ctx = null;
    root = null;
    below = null;
    grid = null;
    gridMat = null;
  },
};
