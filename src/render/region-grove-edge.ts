import * as THREE from 'three';
import { groveEdgePieces } from '../config/region-grove-edge';
import type { LayoutChunk } from '../config/region-layout';
import { GROVE } from '../config/tuning';
import { GROVE_EDGE } from '../config/tuning-r11d7';
import { WORLD_STREAM } from '../config/tuning-world';
import { borderBlockers } from '../sim/border';
import { hash, hex, Raster, rimObjects, shade } from './paint/raster';
import { RasterAtlas } from './paint/atlas';
import { groundTexture, GROUND_PPU } from './region-ground';
import type { RegionPx } from './region-host-px';
import type { SpriteSheet } from './sprites/atlas';
import type { SpriteDraw } from './sprite-batch';

/**
 * R11 d7 (WORLD-39): the Grove drawn back across a seamless border from inside a neighbour (the
 * shore), in the pixel view. The Grove has its own scene, which is not live while the Keeper
 * is away, so this paints a strip of its south edge once (meadow, the marsh's darker wet
 * ground and the stream running out), and stands the Grove's own trees, rocks, reeds and the
 * border hedge on it as billboards. The 3D twin (`render3d/region-grove-edge.ts`) uses the
 * same canvas.
 */

const H = GROVE.size / 2;

/** The strip's ground canvas: x across the Grove, z from `H - depth` to the edge (plus 2). */
export function paintGroveEdge(): { canvas: HTMLCanvasElement; w: number; h: number; z0: number } {
  const ppu = GROUND_PPU;
  const depth = GROVE_EDGE.depth;
  const w = GROVE.size;
  const h = depth + 2;
  const z0 = H - depth;
  const c = document.createElement('canvas');
  c.width = w * ppu;
  c.height = h * ppu;
  const g = c.getContext('2d')!;
  g.fillStyle = '#5f9e3c';
  g.fillRect(0, 0, c.width, c.height);
  // The marsh: wet, darker ground toward the edge round the stream.
  const grad = g.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, 'rgba(79,110,56,0)');
  grad.addColorStop(1, 'rgba(79,110,56,0.75)');
  g.fillStyle = grad;
  g.fillRect(0, 0, c.width, c.height);
  // Grass texture: light and dark blades.
  for (let i = 0; i < (c.width * c.height) / 40; i++) {
    const x = hash(i, 3) * c.width;
    const y = hash(7, i) * c.height;
    g.fillStyle = hash(i, 11) > 0.5 ? '#8fcf62' : '#4d9440';
    g.fillRect(x | 0, y | 0, 1, 2);
  }
  const px = (x: number) => (x + H) * ppu;
  const pz = (z: number) => (z - z0) * ppu;
  const out = GROVE.river.outflow;
  g.lineJoin = 'round';
  g.lineCap = 'round';
  const stroke = (col: string, width: number) => {
    g.strokeStyle = col;
    g.lineWidth = width * ppu;
    g.beginPath();
    out.forEach((p, i) => (i ? g.lineTo(px(p.x), pz(p.z)) : g.moveTo(px(p.x), pz(p.z))));
    g.stroke();
  };
  stroke('#8c7b55', GROVE.river.width + 1.4);
  stroke('#3f7fb0', GROVE.river.width);
  g.setLineDash([ppu * 1.5, ppu * 2]);
  stroke('#8fd0f0', 0.4);
  g.setLineDash([]);
  return { canvas: c, w, h, z0 };
}

function paintTree(): Raster {
  const r = new Raster(72, 88, null);
  r.tracking = true;
  const b = r.h - 1;
  r.rect(32, 46, 8, b - 46, hex('#6b4a2e'));
  r.ellipse(36, 32, 30, 26, hex('#3d7d3c'));
  r.ellipse(30, 26, 18, 14, hex('#5a9a48'));
  for (let i = 0; i < 9; i++)
    r.disc(14 + hash(i, 2) * 44, 16 + hash(3, i) * 30, 2.4, hex('#e0503c'));
  r.tracking = false;
  rimObjects(r);
  return r;
}

function paintRock(): Raster {
  const r = new Raster(32, 22, null);
  r.tracking = true;
  r.ellipse(16, 14, 14, 7, hex('#7f7f88'));
  r.ellipse(13, 11, 8, 4, shade(hex('#7f7f88'), 1.25));
  r.tracking = false;
  rimObjects(r);
  return r;
}

function paintReeds(): Raster {
  const r = new Raster(28, 34, null);
  r.tracking = true;
  const b = r.h - 1;
  for (let i = 0; i < 8; i++) {
    const x = 4 + i * 2.8;
    const top = b - 18 - hash(i, 5) * 12;
    r.line(x, b, x + (i % 3) - 1, top, shade(hex('#6f8a3a'), 0.9 + (i % 3) * 0.1));
    if (i % 3 === 0) r.rect(x - 1, top, 3, 5, hex('#7a4a2a'));
  }
  r.tracking = false;
  rimObjects(r);
  return r;
}

function paintHedge(): Raster {
  const r = new Raster(40, 30, null);
  r.tracking = true;
  r.ellipse(20, 18, 19, 11, hex('#2f6b3a'));
  r.ellipse(15, 14, 10, 6, hex('#3d7d3c'));
  r.tracking = false;
  rimObjects(r);
  return r;
}

let sheet: SpriteSheet | null = null;

function edgeSheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(256);
  atlas.add('tree', paintTree());
  atlas.add('rock', paintRock());
  atlas.add('reeds', paintReeds());
  atlas.add('hedge', paintHedge());
  sheet = atlas.build();
  return sheet;
}

const KEYS = ['tree', 'rock', 'reeds'] as const;
const WIDTH = [4.6, 1.4, 1.4];

/** Every piece the strip stands: the Grove's own and the south border's hedge. */
export function edgePieces(): { key: string; x: number; z: number; w: number }[] {
  const out = groveEdgePieces(GROVE_EDGE.depth).map((p) => ({
    key: KEYS[p.kind] as string,
    x: p.x,
    z: p.z,
    w: WIDTH[p.kind]!,
  }));
  for (const b of borderBlockers())
    if (b.kind === 'hedge' && b.z > H - 1) out.push({ key: 'hedge', x: b.x, z: b.z, w: 2.4 });
  return out;
}

class GroveEdgePx implements RegionPx {
  readonly ground: THREE.Mesh;
  private readonly tex: THREE.CanvasTexture;

  constructor() {
    const p = paintGroveEdge();
    this.tex = groundTexture(p.canvas);
    const geo = new THREE.PlaneGeometry(p.w, p.h);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, p.z0 + p.h / 2);
    this.ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: this.tex }));
    this.ground.name = 'region-grove-edge-ground';
    this.ground.renderOrder = -1;
  }

  chunkDraws(c: LayoutChunk): SpriteDraw[] {
    const s = edgeSheet();
    const size = WORLD_STREAM.chunk;
    const out: SpriteDraw[] = [];
    for (const p of edgePieces()) {
      if (Math.floor(p.x / size) !== c.cx || Math.floor(p.z / size) !== c.cz) continue;
      const rect = s.frames.get(p.key);
      if (!rect) continue;
      out.push({
        sheet: s,
        rect,
        flip: false,
        x: p.x,
        y: 0,
        z: p.z,
        mode: 'billboard',
        w: p.w,
        h: (p.w * rect.h) / rect.w,
      });
    }
    return out;
  }

  dispose(): void {
    this.tex.dispose();
    this.ground.geometry.dispose();
    (this.ground.material as THREE.Material).dispose();
  }
}

export function createRegionPx(): RegionPx {
  return new GroveEdgePx();
}

/** The Grove is never entered through the engine: it has no arch of its own. */
export function drawEntrance(): void {}
