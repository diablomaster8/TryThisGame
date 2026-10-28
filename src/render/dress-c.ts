import {
  CanvasTexture,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  NearestFilter,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  ShapeGeometry,
  Shape,
  type Group,
} from 'three';
import type { Vector3 } from 'three';
import { GROVE } from '../config/tuning';
import { markAt } from '../config/stage-marks';
import { CG_C } from '../config/tuning-c';
import type { SceneStage } from '../config/story';
import { hillHeight, rampPath, TERRACES } from '../sim/terrain';
import type { World } from '../sim/types';
import { leafHinge, pennedSpots } from './corvin-layout';
import type { Daylight } from './daylight';
import { NUMBER_CELL, numberCell, paintNumberAtlas } from './number-atlas';
import { RasterAtlas } from './paint/atlas';
import { paintFeatheredHill } from './paint/backdrop-w';
import { buildStoryArt } from './paint/story-art';
import { pondOutline } from './paint/shore';
import { stageFlags } from './scene-stage';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { frameKey } from './sprites/animations';
import { viewIndex } from './sprites/angles';
import { sheetFromImage, type FrameRect, type SpriteSheet } from './sprites/atlas';
import { activeFx, hazelHill } from './story-fx-state';

/**
 * Campaign-graphics package c, pixel renderer: the story places (see the registry contract
 * at the top of render/dressings.ts). Corvin's garden (C8, H15): a frost floor over the
 * Grove grass, a ring of frosted trees and low hills, his grey house and gate, a gate leaf
 * on each pen (swung open by chapter 9), and a painted number on the back of every penned
 * grey Nubbin. The Hollow (H5): a cold fire ring and a dozen bowls. The Grove (H7, H5, H6):
 * a worn path up the memorial hill, the flat stone halfway up, the crest hawthorn, Briar's
 * flower in its ring, the rock ledge behind the falls, and the held effects (frozen icy
 * falls, a halo on the stone, gold water). Painted sprites go through the batch; the floor
 * and the two overlays are meshes in the place's own group. N2 and N3 are 3D only.
 */
let ctx0: PixelDressCtx | null = null;
let art: SpriteSheet | null = null;
let nums: SpriteSheet | null = null;
let frostFloor: Mesh | null = null;
let ice: Mesh | null = null;
let gold: Mesh | null = null;
let trees: Array<{ x: number; z: number; k: number; s: number }> = [];
let hills: Array<{ x: number; z: number; w: number }> = [];
let hillSheet: SpriteSheet | null = null;
const state = { still: 0, glow: 0, gold: 0, open: [0, 0, 0] };

const HILL = GROVE.hills[0];
/** The terrace top under (x, z), as the scene builds it from the sim's shelves (MOVE-09). */
function hillY(x: number, z: number): number {
  return hillHeight(x, z, false);
}

function seq(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/** A tiling floor of frost: pale blue-white, slow patches and a scatter of bright specks. */
function frostTexture(): CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const n = 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = n;
  const g = cv.getContext('2d');
  if (!g) return null;
  const img = g.createImageData(n, n);
  const rnd = seq(5);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const t = (x / n) * Math.PI * 2;
      const u = (y / n) * Math.PI * 2;
      const v =
        0.5 + 0.25 * Math.sin(t * 2 + Math.sin(u * 3)) + 0.2 * Math.sin(u * 2 + Math.cos(t * 3));
      const speck = rnd() > 0.965;
      const i = (y * n + x) * 4;
      img.data[i] = speck ? 255 : 196 + v * 36;
      img.data[i + 1] = speck ? 255 : 212 + v * 30;
      img.data[i + 2] = speck ? 255 : 230 + v * 22;
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(cv);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(26, 26);
  t.magFilter = t.minFilter = NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** The falls' ice: pale streaks on a frosted blue, drawn over the falling water. */
function iceTexture(): CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = 24;
  cv.height = 48;
  const g = cv.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#b9d6ee';
  g.fillRect(0, 0, 24, 48);
  const rnd = seq(17);
  for (let i = 0; i < 9; i++) {
    g.fillStyle = i % 2 ? '#e8f4fc' : '#8fb7d9';
    const x = Math.floor(rnd() * 22);
    g.fillRect(x, 0, 2, 48 - Math.floor(rnd() * 14));
  }
  g.fillStyle = '#f6fbff';
  for (let y = 0; y < 48; y += 8) g.fillRect(0, y, 24, 1);
  const t = new CanvasTexture(cv);
  t.magFilter = t.minFilter = NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = SRGBColorSpace;
  return t;
}

function approach(v: number, target: number, step: number): number {
  return v < target ? Math.min(target, v + step) : Math.max(target, v - step);
}

/** The camera's yaw as the sprite batch was begun with it (its `right` vector, private). */
function cameraYaw(batch: { right?: Vector3 }): number {
  const r = batch.right;
  return r ? Math.atan2(-r.z, r.x) : 0;
}

/** Hide the east-wall rails and middle post of each pen: the gate leaf swings there. */
function openPenWalls(group: Group): void {
  for (const child of group.children) {
    const m = child as Mesh;
    if (!m.isMesh || Math.abs(m.position.x - CG_C.corvin.leaf.x) > 0.01) continue;
    const y = m.position.y;
    const isRail = Math.abs(y - 0.35) < 0.01 || Math.abs(y - 0.8) < 0.01;
    const z = m.position.z;
    const mid = [-6, -3, 0].some((c) => Math.abs(z - c) < 0.01);
    if (isRail || mid) m.visible = false;
  }
}

export const dressC: PixelDressing = {
  id: 'c',
  build(ctx) {
    ctx0 = ctx;
    hillSheet = null;
    state.still = state.glow = state.gold = 0;
    state.open = [0, 0, 0];
    const rnd = seq(23);
    trees = Array.from({ length: 30 }, (_, i) => {
      const a = (i / 30) * Math.PI * 2 + (rnd() - 0.5) * 0.2;
      const k = 0.78 + rnd() * 0.3;
      return { x: Math.cos(a) * 24 * k, z: Math.sin(a) * 16 * k - 3, k: i % 3, s: 4 + rnd() * 1.6 };
    });
    hills = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      return { x: Math.cos(a) * 31, z: Math.sin(a) * 21 - 3, w: 20 + (i % 3) * 3 };
    });
    if (ctx.sprites) {
      art = buildStoryArt();
      ctx.track(art);
      // M8: the backdrop hill with a feathered foot (the stock card ends in a hard line).
      const atlas = new RasterAtlas(512);
      atlas.add('hills', paintFeatheredHill());
      hillSheet = atlas.build();
      ctx.track(hillSheet);
      const cv = paintNumberAtlas();
      if (cv) {
        const map: Record<string, [number, number, number, number]> = {};
        for (
          let n = CG_C.corvin.numbers.first;
          n < CG_C.corvin.numbers.first + CG_C.corvin.numbers.count;
          n++
        ) {
          const { col, row } = numberCell(n);
          map[String(n)] = [col * NUMBER_CELL.w, row * NUMBER_CELL.h, NUMBER_CELL.w, NUMBER_CELL.h];
        }
        nums = sheetFromImage(cv, map, NUMBER_CELL.w, NUMBER_CELL.h);
        ctx.track(nums);
      }
    }
    // The floor: Corvin's garden is frosted ground, not the Grove's grass.
    const ft = frostTexture();
    if (ft) {
      const geo = new PlaneGeometry(140, 140);
      const mat = new MeshLambertMaterial({ map: ft, emissive: '#6e80a4' });
      frostFloor = new Mesh(geo, mat);
      frostFloor.rotation.x = -Math.PI / 2;
      frostFloor.position.y = 0.03;
      frostFloor.userData.pick = { kind: 'ground', id: 'ground' };
      ctx.groups.corvin.add(frostFloor);
      ctx.pickables.push(frostFloor);
      ctx.track(geo);
      ctx.track(mat);
      ctx.track(ft);
    }
    openPenWalls(ctx.groups.corvin);
    // The held effects' overlays, in the Grove's group: ice over the falls, gold over the pond.
    const it = iceTexture();
    if (it) {
      const wf = GROVE.waterfall;
      const geo = new PlaneGeometry(wf.width, wf.height);
      const mat = new MeshBasicMaterial({
        map: it,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      ice = new Mesh(geo, mat);
      ice.position.set(wf.x - 3.2 + 0.03, wf.height / 2 + 0.3, wf.z + 4.6 + 0.05);
      ice.rotation.y = Math.PI / 6;
      ice.visible = false;
      ctx.groups.grove.add(ice);
      ctx.track(geo);
      ctx.track(mat);
      ctx.track(it);
    }
    const pts = pondOutline(72, 0);
    const shape = new Shape();
    pts.forEach((p, i) => {
      const x = p.x - GROVE.pond.x;
      const y = -(p.z - GROVE.pond.z);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();
    const pg = new ShapeGeometry(shape, 1);
    const pm = new MeshBasicMaterial({
      color: '#f2c14e',
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: DoubleSide,
    });
    gold = new Mesh(pg, pm);
    gold.rotation.x = -Math.PI / 2;
    gold.position.set(GROVE.pond.x, 0.03, GROVE.pond.z);
    gold.visible = false;
    ctx.groups.grove.add(gold);
    ctx.track(pg);
    ctx.track(pm);
  },

  update(world: World, stage: SceneStage, _daylight: Daylight, dt: number) {
    const ctx = ctx0;
    if (!ctx) return;
    const flags = stageFlags(world, stage);
    const still = ctx.reduceMotion();
    const on = activeFx(stage, flags);
    const step = still ? 1 : dt / CG_C.fx.settle;
    state.still = approach(state.still, on.has('fallsStill') ? 1 : 0, step);
    state.glow = approach(state.glow, on.has('stoneGlow') ? 1 : 0, step);
    state.gold = approach(state.gold, on.has('goldWater') ? 1 : 0, step);
    state.open.forEach((v, i) => {
      state.open[i] = approach(v, flags.pens[i] ? 1 : 0, still ? 1 : dt * 1.6);
    });
    // The falls hold still and freeze; the scene rewrites the scroll each frame before this.
    if (state.still > 0.001) ctx.textures.falls.offset.y = 0;
    if (ice) {
      ice.visible = state.still > 0.01;
      (ice.material as MeshBasicMaterial).opacity = 0.78 * state.still;
    }
    if (gold) {
      gold.visible = state.gold > 0.01;
      (gold.material as MeshBasicMaterial).opacity = 0.6 * state.gold;
    }
    const sp = ctx.sprites;
    if (!sp || !art) return;
    const batch = sp.batch;
    const sheet = art;
    const frame = (name: string): FrameRect | undefined =>
      sheet.frames.get(frameKey(name, 'front', 0));
    const draw = (
      name: string,
      x: number,
      y: number,
      z: number,
      o: {
        w?: number;
        flat?: boolean;
        opacity?: number;
        sheet?: SpriteSheet;
        rect?: FrameRect;
      } = {},
    ): void => {
      const rect = o.rect ?? frame(name);
      if (!rect) return;
      const w = o.w ?? rect.w / 32;
      batch.draw({
        sheet: o.sheet ?? sheet,
        rect,
        flip: false,
        x,
        y,
        z,
        mode: o.flat ? 'flat' : 'billboard',
        w,
        h: o.flat ? w * (rect.h / rect.w) : (w * rect.h) / rect.w,
        ...(o.opacity !== undefined ? { opacity: o.opacity } : {}),
      });
    };
    const yaw = cameraYaw(batch as unknown as { right?: Vector3 });

    if (flags.location === 'corvin') {
      const hr = hillSheet?.frames.get('hills');
      for (const h of hills)
        draw('hills', h.x, -0.2, h.z, {
          w: h.w,
          ...(hillSheet && hr ? { sheet: hillSheet, rect: hr } : {}),
        });
      for (const t of trees) draw(`frostTree-${t.k}`, t.x, -0.1, t.z, { w: t.s });
      const hs = CG_C.corvin.house;
      draw('house', hs.x, -0.4, hs.z + hs.d / 2 - 0.6, { w: 6.9 });
      draw('gate', CG_C.corvin.gate.x, 0, CG_C.corvin.gate.z, { w: 4 });
      for (let p = 0; p < 3; p++) {
        const a = state.open[p] ?? 0;
        const h = leafHinge(p);
        const len = CG_C.corvin.leaf.len;
        if (a < 0.12) draw('leafShut', h.x, 0, h.z + len / 2, { w: 0.44 });
        else {
          const w = 0.44 + (len - 0.44) * a;
          draw('leafOpen', h.x + w / 2, 0, h.z + 0.05, { w });
        }
      }
      // The numbers show on the back view only: the Nubbins face north, away from the road.
      if (nums) {
        const vi = viewIndex(Math.PI, yaw);
        if (vi >= 3 && vi <= 5)
          for (const s of pennedSpots()) {
            const rect = nums.frames.get(String(s.n));
            if (!rect) continue;
            // A hand toward the camera, so the badge sits on the sprite rather than in it.
            draw('', s.x + Math.sin(yaw) * 0.08, 0.62, s.z + Math.cos(yaw) * 0.08, {
              w: 0.52,
              sheet: nums,
              rect,
            });
          }
      }
    } else if (flags.location === 'hollow') {
      const f = CG_C.hollow.fire;
      draw('fireRing', f.x, 0, f.z, { w: 2.1, flat: true });
      const b = CG_C.hollow.bowls;
      const rnd = seq(9);
      for (let i = 0; i < b.count; i++) {
        const a = ((b.from + ((b.to - b.from) * i) / (b.count - 1)) * Math.PI) / 180;
        const r = b.r + (rnd() - 0.5) * 0.5;
        draw('bowl', f.x + Math.cos(a) * r, 0, f.z + Math.sin(a) * r, { w: 0.62 });
      }
      if (state.glow > 0.01) {
        const s = CG_C.hollow.stone;
        draw('halo', s.x, -1.2, s.z - 0.4, { w: 3.6, opacity: 0.7 * state.glow });
      }
    } else if (flags.location === 'grove' && hazelHill(flags)) {
      // The worn path: dabs of earth up the middle of the ramp, each on the ground under it.
      const pts = rampPath(TERRACES[0]!);
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, z0] = pts[i]!;
        const [x1, z1] = pts[i + 1]!;
        const n = Math.max(1, Math.round(Math.hypot(x1 - x0, z1 - z0) / 0.55));
        for (let k = 0; k < n; k++) {
          const x = HILL.x + x0 + ((x1 - x0) * k) / n;
          const z = HILL.z + z0 + ((z1 - z0) * k) / n;
          draw('pathDab', x, hillY(x, z) + 0.02, z, { w: 1.2, flat: true });
        }
      }
      // The flat stone, halfway up (the second terrace), from the props sheet.
      const fs = markAt('grove', 'flat-stone');
      const props = sp.sheets.props();
      const stone = props.frames.get(frameKey('prop-flatStone', 'front', 0));
      if (fs && stone) {
        const ang = Math.atan2(fs.z - HILL.z, fs.x - HILL.x);
        const x = HILL.x + Math.cos(ang) * HILL.r * 0.55;
        const z = HILL.z + Math.sin(ang) * HILL.r * 0.55;
        draw('', x, hillY(x, z), z, { w: 1.5, sheet: props, rect: stone });
      }
      const cx = HILL.x + CG_C.hill.crest.dx;
      const cz = HILL.z + CG_C.hill.crest.dz;
      draw('hawthorn', cx, hillY(cx, cz) - 0.1, cz, {
        w: 3.6,
      });
      const briar = markAt('grove', 'briar');
      const flower = props.frames.get(frameKey('flower', 'front', 0));
      if (briar && flower) {
        const y = hillY(briar.x, briar.z);
        draw('ring', briar.x, y + 0.02, briar.z, { w: 1.5, flat: true });
        const s = CG_C.hill.briar.scale;
        draw('', briar.x, y, briar.z, {
          w: (flower.w / 32) * s,
          sheet: props,
          rect: flower,
        });
      }
      // The ledge behind the falls' foot, on the first terrace, and its stone's halo.
      const wf = GROVE.waterfall;
      const lx = wf.x - 3.2 - 0.3;
      const lz = wf.z + 4.6 + 0.55;
      draw('ledge', lx, hillY(lx, lz), lz, { w: CG_C.ledge.width * 1.3 });
      if (state.glow > 0.01)
        draw('halo', lx, hillY(lx, lz) - 0.6, lz - 0.1, { w: 3.4, opacity: 0.7 * state.glow });
    }
  },

  dispose() {
    ctx0 = null;
    art = nums = null;
    frostFloor = ice = gold = null;
  },
};
