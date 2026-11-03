import {
  MOON_LANTERNS,
  MOON_POIS,
  MOON_SPIRE,
  SUN_COLUMNS,
  SUN_DOME,
  SUN_FOUNTAIN,
  SUN_SPEC,
  SUN_TERRACES,
} from '../config/region-sunmoon';
import { terraceHeight } from '../config/region-layout';
import { sunMoonSheet } from './paint/sunmoon';
import type { GroundLook, GroundPaint } from './region-ground';
import { kitModule, type KitPiece } from './region-kit-px';

/**
 * WORLD-34 (R11 lane D, d7): the Sun and Moon lands in the pixel view, two styles on the region
 * kit. The Sun lands' ground lifts to its three terraces (white retaining walls painted on the
 * slopes between, broad steps where the path climbs); the Moon lands lie flat round the lantern
 * lake. The ground looks and the painting are shared with the 3D modules.
 */

export const SUN_GROUND: GroundLook = {
  floor: '#c9c48e',
  floorDark: '#b3ad78',
  open: '#efe8d4',
  track: '#e2c870',
  water: '#6fb6d8',
  waterLight: '#c8ecf8',
};

export const MOON_GROUND: GroundLook = {
  floor: '#2e2848',
  floorDark: '#231e3a',
  open: '#4a3f6e',
  track: '#6a5a92',
  water: '#1c2652',
  waterLight: '#8a9ae8',
};

export const sunHeight = (_x: number, z: number): number => terraceHeight(SUN_SPEC, z);

/** The retaining walls between the terraces, and the steps where the path climbs them. */
export const paintSun: GroundPaint = (g, px, pz, ppu) => {
  const W = g.canvas.width;
  for (let i = 0; i + 1 < SUN_TERRACES.length; i++) {
    const z0 = SUN_TERRACES[i]!.z1;
    const z1 = SUN_TERRACES[i + 1]!.z0;
    g.fillStyle = '#e4dcc4';
    g.fillRect(0, pz(z0), W, (z1 - z0) * ppu);
    g.fillStyle = '#c9bfa2';
    for (let r = z0; r < z1; r += 0.8) g.fillRect(0, pz(r), W, 1);
    for (let x = 0; x < W; x += 1.6 * ppu) g.fillRect(x, pz(z0), 1, (z1 - z0) * ppu);
    // A gold cap along the top of each wall.
    g.fillStyle = '#e8b93a';
    g.fillRect(0, pz(z0) - 2, W, 2);
  }
  // Steps where the path climbs (the path's own x at each wall).
  for (const [x, z0, z1] of [
    [0, 14, 18],
    [12, -14, -10],
    [-12, -14, -10],
  ] as const) {
    g.fillStyle = '#f3efe4';
    g.fillRect(px(x - 2.4), pz(z0), 4.8 * ppu, (z1 - z0) * ppu);
    g.fillStyle = '#c9bfa2';
    for (let r = z0; r < z1; r += 0.5) g.fillRect(px(x - 2.4), pz(r), 4.8 * ppu, 1);
  }
};

/** Glints of lantern light on the lake, and pale flowers in the grass. */
export const paintMoon: GroundPaint = (g, px, pz, ppu) => {
  g.fillStyle = 'rgba(255, 216, 144, 0.35)';
  for (const l of MOON_LANTERNS) g.fillRect(px(l.x) - ppu, pz(l.z) + ppu, ppu * 2, 2);
  g.fillStyle = 'rgba(200, 220, 255, 0.5)';
  for (let i = 0; i < 160; i++) {
    const x = ((i * 7919) % 997) / 997;
    const z = ((i * 104729) % 991) / 991;
    g.fillRect(x * g.canvas.width, z * g.canvas.height, 1, 1);
  }
};

function sunPieces(): KitPiece[] {
  const out: KitPiece[] = [];
  const y = (z: number) => terraceHeight(SUN_SPEC, z);
  out.push({ key: 'fountain', x: SUN_FOUNTAIN.x, z: SUN_FOUNTAIN.z + 0.8, w: 5.6 });
  out.push({ key: 'dome', x: SUN_DOME.x, z: SUN_DOME.z + 1.2, w: 9 });
  for (const c of SUN_COLUMNS) out.push({ key: 'column', x: c.x, z: c.z + 0.2, w: 1.2, y: y(c.z) });
  return out;
}

function moonPieces(): KitPiece[] {
  const out: KitPiece[] = [];
  out.push({ key: 'spire', x: MOON_SPIRE.x, z: MOON_SPIRE.z + 0.6, w: 5.2 });
  for (const l of MOON_LANTERNS) out.push({ key: 'lantern', x: l.x, z: l.z + 0.1, w: 0.9 });
  const ring = MOON_POIS.find((p) => p.id === 'moon-stones')!;
  out.push({ key: 'stones', x: ring.x, z: ring.z, w: 6 });
  return out;
}

export const sun = kitModule({
  name: 'sunlands',
  look: SUN_GROUND,
  sheet: () => sunMoonSheet('sun'),
  treeW: [1.9, 2.6, 1.6],
  propW: 1.3,
  pieces: sunPieces,
  heightAt: sunHeight,
  paint: paintSun,
  arch: { key: 'gate', w: 5.6 },
});

export const moon = kitModule({
  name: 'moonlands',
  look: MOON_GROUND,
  sheet: () => sunMoonSheet('moon'),
  treeW: [2.8, 2.6, 1.8],
  propW: 1.3,
  pieces: moonPieces,
  paint: paintMoon,
  arch: { key: 'gate', w: 5.6 },
});
