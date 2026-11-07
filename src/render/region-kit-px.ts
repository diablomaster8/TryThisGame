import type { ReadonlyWorld } from './readonly-world';
import * as THREE from 'three';
import type { LayoutChunk, LayoutTree, RegionBox, RegionLayout } from '../config/region-layout';
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
  /** The look a fill tree takes (default its layout kind): snowy pines above a snow line. */
  kindAt?: (t: LayoutTree) => number;
  paint?: GroundPaint;
  /** Extra meshes on the ground plane; returns their disposer. */
  decorate?: (ground: THREE.Mesh, l: RegionLayout) => () => void;
  /** Sprites that change with the world, drawn every frame (region-local, never many). */
  dynamic?: (world: ReadonlyWorld) => readonly KitPiece[];
  /** The arch over a loaded way in: its key and width. */
  arch: { key: string; w: number };
  /** The painting clears ground a seamless neighbour shows through (alpha-tested). */
  cut?: boolean;
}

/**
 * The ground plane, flat, or for a terraced region cut into 1-unit rows across z and lifted
 * to the terrace heights (the cliffs between become steep slopes the painting colours as rock).
 */
export function terracedPlane(
  w: number,
  h: number,
  heightAt?: (x: number, z: number) => number,
): THREE.PlaneGeometry {
  const g = new THREE.PlaneGeometry(w, h, 1, heightAt ? Math.ceil(h) : 1);
  g.rotateX(-Math.PI / 2);
  if (heightAt) {
    const p = g.attributes.position!;
    for (let i = 0; i < p.count; i++) p.setY(i, heightAt(p.getX(i), p.getZ(i)));
    g.computeVertexNormals();
  }
  return g;
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
    const geo = terracedPlane(size.w, size.h, s.heightAt);
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
      const k = this.s.kindAt ? this.s.kindAt(t) : t.kind;
      const w = this.s.treeW[k]! * t.s;
      push(sprite(sheet, `tree-${k}`, t.x, t.z, w, y ? y(t.x, t.z) : 0, (i & 1) === 1));
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
  drawDynamic(batch: SpriteBatch, world: ReadonlyWorld, tint: number): void;
} {
  const dyn = new Map<KitPiece, SpriteDraw | null>();
  return {
    createRegionPx: (l) => new KitPx(l, s),
    drawEntrance(batch, x, z, tint, fade) {
      const d = sprite(s.sheet(), s.arch.key, x, z, s.arch.w);
      if (!d) return;
      d.tint = tint;
      d.opacity = fade ? fade(d) : 1;
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

/**
 * R11 d7: boardwalks and jetties as one flat mesh standing just above the water (the painted planks
 * would sit under the water plane): world-space UVs over a small plank texture. Both renderers.
 */
export function deckMesh(decks: readonly RegionBox[], y: number): THREE.Mesh {
  const pos: number[] = [];
  const uv: number[] = [];
  for (const d of decks) {
    const x0 = d.x - d.w / 2;
    const x1 = d.x + d.w / 2;
    const z0 = d.z - d.h / 2;
    const z1 = d.z + d.h / 2;
    const along = d.w > d.h;
    const corner = (x: number, z: number) => {
      pos.push(x, y, z);
      uv.push(along ? x / 0.75 : z / 0.75, along ? z : x);
    };
    corner(x0, z0);
    corner(x0, z1);
    corner(x1, z1);
    corner(x0, z0);
    corner(x1, z1);
    corner(x1, z0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  const c = document.createElement('canvas');
  c.width = c.height = 8;
  const cg = c.getContext('2d')!;
  cg.fillStyle = '#9c6e3e';
  cg.fillRect(0, 0, 8, 8);
  cg.fillStyle = '#7a5230';
  cg.fillRect(0, 0, 1, 8);
  cg.fillStyle = '#b4834e';
  cg.fillRect(1, 0, 1, 8);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide }));
  m.name = 'shore-decks';
  m.receiveShadow = true;
  return m;
}

/** Dispose a mesh made by `deckMesh`. */
export function disposeDecks(m: THREE.Mesh): void {
  m.removeFromParent();
  m.geometry.dispose();
  const mat = m.material as THREE.MeshLambertMaterial;
  mat.map?.dispose();
  mat.dispose();
}
