import * as THREE from 'three';
import type { RegionLayout } from '../config/region-layout';
import { hash } from './paint/raster';
import { dappleMarks } from './paint/wood';

/**
 * R11 lane D: a drawn region's ground, painted once into a canvas both renderers lay flat
 * (WORLD-25): the forest floor, the open ground from the walk grid (paths, spurs, clearings,
 * so the drawing always matches where the Keeper can walk), a worn track down the middle of
 * it, the stream, grass speckle and, for the pixel view, the canopy's dapple painted in. The
 * Full 3D view leaves the dapple out and scrolls a cookie over the ground instead.
 */
export interface GroundLook {
  floor: string;
  floorDark: string;
  open: string;
  track: string;
  water: string;
  waterLight: string;
}

export const WOOD_GROUND: GroundLook = {
  floor: '#35552e',
  floorDark: '#25401f',
  open: '#6f9a48',
  track: '#a88a5a',
  water: '#3f7fb0',
  waterLight: '#8fd0f0',
};

/** Texels per world unit of the painted ground. */
export const GROUND_PPU = 8;

export function paintRegionGround(
  l: RegionLayout,
  look: GroundLook,
  dapple: boolean,
): HTMLCanvasElement {
  const ppu = GROUND_PPU;
  const M = l.margin;
  const W = Math.round((l.spec.size.w + 2 * M) * ppu);
  const H = Math.round((l.spec.size.h + 2 * M) * ppu);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  // The canvas covers the region and the forest margin round it.
  const hw = l.spec.size.w / 2 + M;
  const hh = l.spec.size.h / 2 + M;
  const px = (x: number) => (x + hw) * ppu;
  const pz = (z: number) => (z + hh) * ppu;
  g.fillStyle = look.floor;
  g.fillRect(0, 0, W, H);
  // Leaf litter: darker blots on the forest floor.
  g.fillStyle = look.floorDark;
  for (let i = 0; i < (W * H) / 220; i++) {
    const x = hash(i, 11) * W;
    const y = hash(17, i) * H;
    g.fillRect(x | 0, y | 0, 2 + ((hash(i, 3) * 3) | 0), 2);
  }
  // Open ground, cell by cell, with soft rounded edges.
  const cs = l.cell * ppu;
  g.fillStyle = look.open;
  for (let iz = 0; iz < l.gh; iz++)
    for (let ix = 0; ix < l.gw; ix++) {
      if (l.grid[iz * l.gw + ix] !== 1) continue;
      g.beginPath();
      g.arc((ix + 0.5) * cs + M * ppu, (iz + 0.5) * cs + M * ppu, cs * 0.78, 0, Math.PI * 2);
      g.fill();
    }
  // The worn track down the path and spurs.
  const stroke = (pts: readonly { x: number; z: number }[], loop: boolean, w: number) => {
    g.beginPath();
    pts.forEach((p, i) => (i ? g.lineTo(px(p.x), pz(p.z)) : g.moveTo(px(p.x), pz(p.z))));
    if (loop) g.closePath();
    g.lineWidth = w * ppu;
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.stroke();
  };
  g.strokeStyle = look.track;
  stroke(l.spec.path, l.spec.loop, 1.6);
  for (const s of l.spec.spurs ?? []) stroke(s, false, 1.2);
  // The stream: a deep band and a lit ripple line.
  if (l.spec.stream) {
    g.strokeStyle = look.water;
    stroke(l.spec.stream, false, 3.4);
    g.strokeStyle = look.waterLight;
    g.setLineDash([ppu * 1.5, ppu * 2]);
    stroke(l.spec.stream, false, 0.5);
    g.setLineDash([]);
    // The bridge planks over the crossing.
    g.fillStyle = '#a8743e';
    for (const cr of l.spec.crossings ?? [])
      g.fillRect(px(cr.x - cr.r), pz(cr.z - 1), cr.r * 2 * ppu, 2 * ppu);
  }
  // Grass speckle and little flowers on the open ground.
  const img = g.getImageData(0, 0, W, H);
  const d = img.data;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const h = hash(x, y, 5);
      if (h < 0.86) continue;
      const i = (y * W + x) * 4;
      const f = h > 0.995 ? 1.6 : h > 0.93 ? 1.12 : 0.88;
      d[i] = Math.min(255, d[i]! * f);
      d[i + 1] = Math.min(255, d[i + 1]! * f);
      d[i + 2] = Math.min(255, d[i + 2]! * (h > 0.995 ? 1.4 : f));
    }
  g.putImageData(img, 0, 0);
  if (dapple) {
    // The pixel view's painted dapple: pools of light under the canopy, and shade.
    g.globalAlpha = 0.16;
    g.fillStyle = '#fff2b0';
    for (const m of dappleMarks(W, H, 7)) {
      g.beginPath();
      g.ellipse(m.x, m.y, m.r * 2.2, m.r * 1.4, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }
  return c;
}

/** The ground plane's size, the region and its forest margin. */
export function groundSize(l: RegionLayout): { w: number; h: number } {
  return { w: l.spec.size.w + 2 * l.margin, h: l.spec.size.h + 2 * l.margin };
}

/** A canvas as a nearest-filtered texture, for the pixel look in both renderers. */
export function groundTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
