import * as THREE from 'three';
import type { LayoutChunk, RegionLayout } from '../config/region-layout';
import { WORLD_STREAM } from '../config/tuning-world';
import type { SpriteSheet } from './sprites/atlas';
import {
  groundSize,
  groundTexture,
  paintRegionGround,
  type GroundLook,
  type GroundPaint,
} from './region-ground';
import type { RegionPx, RegionPxModule } from './region-host-px';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import type { World } from '../sim/types';

/**
 * R11 lane D (d7): the pixel half of a region built on the engine, from a style: the Wood's
 * module (`region-wood.ts`) made generic, so a new biome is a sprite sheet, a ground look and
 * a list of pieces. The ground is painted once; fill trees, props and pieces are billboards
 * handed out per chunk (cached by the host); a piece may stand above the ground (`y`, a
 * terrace). `dynamic` draws the few sprites that change with the world (a door that thaws)
 * every frame, outside the chunk cache. `decorate` hangs extra meshes on the ground (the sea).
 */

export interface KitPiece {
  key: string;
  x: number;
  z: number;
  /** Width, units. */
  w: number;
  y?: number;
  flip?: boolean;
}

export interface KitPxStyle {
  name: string;
  look: GroundLook;
  sheet: () => SpriteSheet;
  /** Width of each fill-tree kind (0..2), units at scale 1. */
  treeW: readonly [number, number, number];
  /** Width of a small prop. */
  propW: number;
  /** The fixed pieces (buildings, landmarks), each drawn in the chunk it stands in. */
  pieces: (l: RegionLayout) => readonly KitPiece[];
  /** The fill's height above the ground (a terraced region), by position. */
  heightAt?: (x: number, z: number) => number;
  paint?: GroundPaint;
  /** Extra meshes on the ground plane; returns their disposer. */
  decorate?: (ground: THREE.Mesh, l: RegionLayout) => () => void;
  /** Sprites that change with the world, drawn every frame (region-local, never many). */
  dynamic?: (world: World) => readonly KitPiece[];
  /** The arch over a loaded way in: its key and width. */
  arch: { key: string; w: number };
  /** The painting clears ground a seamless neighbour shows through (alpha-tested). */
  cut?: boolean;
}

export function sprite(
  sheet: SpriteSheet,
  key: string,
  x: number,
  z: number,
  w: number,
  y = 0,
  flip = false,
): SpriteDraw | null {
  const rect = sheet.frames.get(key);
  if (!rect) return null;
  return { sheet, rect, flip, x, y, z, mode: 'billboard', w, h: (w * rect.h) / rect.w };
}

class KitPx implements RegionPx {
  readonly ground: THREE.Mesh;
  private readonly tex: THREE.CanvasTexture;
  private readonly undecorate: (() => void) | null;
  private readonly byChunk = new Map<string, KitPiece[]>();

  constructor(
    private readonly l: RegionLayout,
    private readonly s: KitPxStyle,
  ) {
    this.tex = groundTexture(paintRegionGround(l, s.look, false, s.paint));
    const size = groundSize(l);
    const geo = new THREE.PlaneGeometry(size.w, size.h);
    geo.rotateX(-Math.PI / 2);
    this.ground = new THREE.Mesh(
      geo,
      new THREE.MeshLambertMaterial({ map: this.tex, alphaTest: s.cut ? 0.75 : 0 }),
    );
    this.ground.name = `region-${s.name}-ground`;
    this.ground.receiveShadow = true;
    this.ground.renderOrder = -1;
    this.undecorate = s.decorate ? s.decorate(this.ground, l) : null;
    const cs = WORLD_STREAM.chunk;
    for (const p of s.pieces(l)) {
      const k = `${Math.floor(p.x / cs)},${Math.floor(p.z / cs)}`;
      let list = this.byChunk.get(k);
      if (!list) this.byChunk.set(k, (list = []));
      list.push(p);
    }
  }

  chunkDraws(c: LayoutChunk): SpriteDraw[] {
    const sheet = this.s.sheet();
    const out: SpriteDraw[] = [];
    const push = (d: SpriteDraw | null) => d && out.push(d);
    const y = this.s.heightAt;
    for (const i of c.trees) {
      const t = this.l.trees[i]!;
      const w = this.s.treeW[t.kind]! * t.s;
      push(sprite(sheet, `tree-${t.kind}`, t.x, t.z, w, y ? y(t.x, t.z) : 0, (i & 1) === 1));
    }
    for (const i of c.props) {
      const p = this.l.props[i]!;
      push(sprite(sheet, `prop-${p.kind}`, p.x, p.z, this.s.propW, y ? y(p.x, p.z) : 0));
    }
    for (const p of this.byChunk.get(`${c.cx},${c.cz}`) ?? [])
      push(sprite(sheet, p.key, p.x, p.z, p.w, p.y ?? (y ? y(p.x, p.z) : 0), p.flip ?? false));
    return out;
  }

  dispose(): void {
    this.undecorate?.();
    this.tex.dispose();
    this.ground.geometry.dispose();
    (this.ground.material as THREE.Material).dispose();
  }
}

/** A region's pixel module from its style (what `REGION_PX` loads). */
export function kitModule(s: KitPxStyle): RegionPxModule & {
  drawDynamic(batch: SpriteBatch, world: World, tint: number): void;
} {
  const dyn = new Map<KitPiece, SpriteDraw | null>();
  return {
    createRegionPx: (l) => new KitPx(l, s),
    drawEntrance(batch, x, z, tint) {
      const d = sprite(s.sheet(), s.arch.key, x, z, s.arch.w);
      if (!d) return;
      d.tint = tint;
      batch.draw(d);
    },
    drawDynamic(batch, world, tint) {
      if (!s.dynamic) return;
      const sheet = s.sheet();
      // `dynamic` hands back the same piece objects frame to frame: one draw record each.
      for (const p of s.dynamic(world)) {
        let d = dyn.get(p);
        if (d === undefined) {
          d = sprite(sheet, p.key, p.x, p.z, p.w, p.y ?? 0, p.flip ?? false);
          dyn.set(p, d);
        }
        if (!d) continue;
        d.tint = tint;
        batch.draw(d);
      }
    },
  };
}
