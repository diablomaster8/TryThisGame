import { terraceHeight } from '../config/region-layout';
import {
  RUINS_COLUMNS,
  RUINS_DOOR,
  RUINS_LANTERNS,
  RUINS_POIS,
  RUINS_SPEC,
  RUINS_SPIRE,
  RUINS_TEMPLE,
  RUINS_TERRACES,
  ruinsState,
  type RuinsState,
} from '../config/region-ruins';
import type { World } from '../sim/types';
import { ruinsSheet } from './paint/ruins';
import type { GroundLook, GroundPaint } from './region-ground';
import { kitModule, type KitPiece } from './region-kit-px';

/**
 * WORLD-37 (R11 lane D, d7): the ruins in the pixel view, on the region kit. Old flagstones
 * gone mossy and frost-touched, a stone retaining wall between the courts with the grand stair
 * through it, and the fixed ruins as pieces. The door and the avenue's lanterns are drawn every
 * frame from `ruinsState` (campaign flags, read only), so all three of the story's states show.
 */

export const RUINS_GROUND: GroundLook = {
  floor: '#56634f',
  floorDark: '#455140',
  open: '#9c9da3',
  track: '#c3c0b2',
  water: '#3f6f9a',
  waterLight: '#9fd0e8',
};

export const ruinsHeight = (_x: number, z: number): number => terraceHeight(RUINS_SPEC, z);

/** Flagstone joints over the courts, frost in their cracks, the wall and its stair. */
export const paintRuins: GroundPaint = (g, px, pz, ppu) => {
  g.fillStyle = 'rgba(60, 60, 70, 0.35)';
  for (const b of RUINS_SPEC.open ?? []) {
    const x0 = px(b.x - b.w / 2);
    const z0 = pz(b.z - b.h / 2);
    for (let x = 0; x < b.w; x += 1.5) g.fillRect(x0 + x * ppu, z0, 1, b.h * ppu);
    for (let z = 0; z < b.h; z += 1.5) g.fillRect(x0, z0 + z * ppu, b.w * ppu, 1);
  }
  g.fillStyle = 'rgba(220, 236, 246, 0.55)';
  for (let i = 0; i < 400; i++) {
    const x = ((i * 7919) % 983) / 983;
    const z = ((i * 104729) % 977) / 977;
    g.fillRect(x * g.canvas.width, z * g.canvas.height, 2 + (i % 3), 1);
  }
  const W = g.canvas.width;
  const z0 = RUINS_TERRACES[0].z1;
  const z1 = RUINS_TERRACES[1].z0;
  g.fillStyle = '#7d7e86';
  g.fillRect(0, pz(z0), W, (z1 - z0) * ppu);
  g.fillStyle = '#5e5f68';
  for (let r = z0; r < z1; r += 0.9) g.fillRect(0, pz(r), W, 1);
  g.fillStyle = '#b4b2a8';
  g.fillRect(px(-3), pz(z0), 6 * ppu, (z1 - z0) * ppu);
  g.fillStyle = '#8a887e';
  for (let r = z0; r < z1; r += 0.5) g.fillRect(px(-3), pz(r), 6 * ppu, 1);
};

export function ruinsPieces(): KitPiece[] {
  const out: KitPiece[] = [];
  for (const c of RUINS_COLUMNS)
    out.push({ key: c.broken ? 'column-broken' : 'column', x: c.x, z: c.z + 0.3, w: 1.4 });
  out.push({ key: 'spire', x: RUINS_SPIRE.x, z: RUINS_SPIRE.z + 0.8, w: 3.6 });
  out.push({ key: 'temple', x: RUINS_TEMPLE.x, z: RUINS_TEMPLE.z + 1.4, w: RUINS_TEMPLE.w });
  const archive = RUINS_POIS.find((p) => p.id === 'archive')!;
  out.push({ key: 'archive', x: archive.x, z: archive.z - 5, w: 10 });
  const ring = RUINS_POIS.find((p) => p.id === 'stones')!;
  out.push({ key: 'stones', x: ring.x, z: ring.z, w: 6 });
  return out;
}

const y = (z: number) => terraceHeight(RUINS_SPEC, z);
/** The story's pieces, one stable list per state (the kit keeps a draw record per piece). */
const DYNAMIC: Record<RuinsState, KitPiece[]> = {
  sealed: [],
  thawed: [],
  relit: [],
};
for (const s of ['sealed', 'thawed', 'relit'] as const) {
  DYNAMIC[s].push({
    key: s === 'sealed' ? 'door-sealed' : 'door-open',
    x: RUINS_DOOR.x,
    z: RUINS_DOOR.z + 0.05,
    w: 4,
    y: y(RUINS_DOOR.z),
  });
  for (const l of RUINS_LANTERNS)
    DYNAMIC[s].push({
      key: s === 'relit' ? 'lantern-lit' : 'lantern-cold',
      x: l.x,
      z: l.z,
      w: 0.9,
    });
}

export function ruinsDynamic(world: World): readonly KitPiece[] {
  return DYNAMIC[ruinsState(world.campaign)];
}

const mod = kitModule({
  name: 'ruins',
  look: RUINS_GROUND,
  sheet: ruinsSheet,
  treeW: [3.6, 1.4, 2.2],
  propW: 1.3,
  pieces: ruinsPieces,
  heightAt: ruinsHeight,
  paint: paintRuins,
  dynamic: ruinsDynamic,
  arch: { key: 'arch', w: 6 },
});

export const createRegionPx = mod.createRegionPx;
export const drawEntrance = mod.drawEntrance;
export const drawDynamic = mod.drawDynamic;
