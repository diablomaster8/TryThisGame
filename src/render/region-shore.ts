import * as THREE from 'three';
import {
  SHORE_CASTLES,
  SHORE_FOLK,
  SHORE_HOUSES,
  SHORE_LIGHT,
  SHORE_ROCKS,
  SHORE_SPEC,
  tideAt,
  waterlineZ,
} from '../config/region-shore';
import type { RegionLayout } from '../config/region-layout';
import { SHORE_LOOK } from '../config/tuning-more/world-region-lands';
import { coastSheet } from './paint/coast';
import type { GroundLook, GroundPaint } from './region-ground';
import { castleStands } from '../sim/shore-play';
import { deckMesh, disposeDecks, kitModule, type KitPiece } from './region-kit-px';
import type { ReadonlyWorld } from './readonly-world';

/**
 * WORLD-35 (R11 lane D, d7): the shore in the pixel view, on the region kit. Dune grass and
 * sparse pines to the north, the beach, the stilt village's boardwalk, the lighthouse, and the
 * sea: a flat water plane hung on the ground whose edge follows the real tide (high at 06:00
 * and 18:00), with a foam line. Shared with the 3D module: the ground look and painting.
 */

export const SHORE_GROUND: GroundLook = {
  floor: '#9aa860',
  floorDark: '#7f8f4c',
  open: '#e2c98e',
  track: '#d4b678',
  water: '#3d86b4',
  waterLight: '#9fd6ee',
};

/** The wet sand the tide uncovers, the lagoon's shallows and the boardwalk planks. */
/**
 * Where the Grove lies across the seamless border (its south marsh, offset by the border's
 * re-basing): the shore's painting leaves it clear so the Grove's own strip shows through.
 * Shore z below `seamZ` and x inside the Grove's width.
 */
export const GROVE_SEAM = { seamZ: -21, x0: -110, x1: -14 } as const;

export const paintShore: GroundPaint = (g, px, pz, ppu) => {
  g.clearRect(px(GROVE_SEAM.x0), 0, (GROVE_SEAM.x1 - GROVE_SEAM.x0) * ppu, pz(GROVE_SEAM.seamZ));
  const hz = SHORE_LOOK.highTideZ;
  g.fillStyle = '#c2a46e';
  g.fillRect(0, pz(hz - 0.6), g.canvas.width, (SHORE_LOOK.tideRange + 1.6) * ppu);
  g.fillStyle = 'rgba(255,255,255,0.18)';
  g.fillRect(0, pz(hz - 0.6), g.canvas.width, 0.25 * ppu);
  // The lagoon and the pools: lighter, shallow water over sand.
  g.fillStyle = '#57aecb';
  for (const b of SHORE_SPEC.water ?? []) {
    if (b.w > 100) continue;
    g.fillRect(px(b.x - b.w / 2), pz(b.z - b.h / 2), b.w * ppu, b.h * ppu);
  }
};

export function shorePieces(): KitPiece[] {
  const out: KitPiece[] = [];
  SHORE_HOUSES.forEach((h, i) => out.push({ key: `house-${i % 3}`, x: h.x, z: h.z + 1.2, w: 4.6 }));
  out.push({ key: 'light', x: SHORE_LIGHT.x, z: SHORE_LIGHT.z + 0.6, w: 3.4 });
  for (const r of SHORE_ROCKS) out.push({ key: 'rock', x: r.x, z: r.z + 0.4, w: r.r * 2.6 });
  out.push({ key: 'sign', x: -39, z: -17.8, w: 1.8 });
  out.push({ key: 'stones', x: -47.6, z: 3.2, w: 3.2 });
  out.push({ key: 'boat', x: -26, z: 8.6, w: 3.6 });
  out.push({ key: 'boat', x: 60.6, z: 19.6, w: 3.4, flip: true });
  return out;
}

const UP: KitPiece[] = SHORE_CASTLES.map((c) => ({ key: 'castle', x: c.x, z: c.z + 0.3, w: 2 }));
const DOWN: KitPiece[] = SHORE_CASTLES.map((c) => ({
  key: 'castle-down',
  x: c.x,
  z: c.z + 0.3,
  w: 2,
}));
const FOLK: KitPiece[] = SHORE_FOLK.map((f) => ({ key: `folk-${f.tone}`, x: f.x, z: f.z, w: 0.9 }));
const CURRENT: KitPiece[] = [];

/** R13 d1: the castles (standing or flat) and the folk; the same objects frame to frame. */
function shoreDynamic(world: ReadonlyWorld): readonly KitPiece[] {
  CURRENT.length = 0;
  SHORE_CASTLES.forEach((_, i) => CURRENT.push(castleStands(world, i) ? UP[i]! : DOWN[i]!));
  for (const f of FOLK) CURRENT.push(f);
  return CURRENT;
}

/** The real hour on this device (the tide reads only the picture's clock). */
export function hourNow(): number {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

/** The sea on the pixel ground: a water plane and its foam line, moved with the tide. */
function decorate(ground: THREE.Mesh, l: RegionLayout): () => void {
  const w = l.spec.size.w + 2 * l.margin;
  const deep = l.spec.size.h / 2 + l.margin - SHORE_LOOK.highTideZ;
  const sg = new THREE.PlaneGeometry(w, deep);
  sg.rotateX(-Math.PI / 2);
  sg.translate(0, 0, deep / 2);
  const sm = new THREE.MeshLambertMaterial({ color: '#3d86b4', transparent: true, opacity: 0.94 });
  const sea = new THREE.Mesh(sg, sm);
  sea.name = 'shore-sea';
  const fg = new THREE.PlaneGeometry(w, 0.35);
  fg.rotateX(-Math.PI / 2);
  const fm = new THREE.MeshBasicMaterial({ color: '#f4fbff', transparent: true, opacity: 0.8 });
  const foam = new THREE.Mesh(fg, fm);
  foam.position.set(0, 0.01, 0.1);
  sea.add(foam);
  sea.position.y = 0.02;
  let checked = -Infinity;
  sea.onBeforeRender = () => {
    // The tide moves a few units over hours: check the clock once a second, no more.
    const now = performance.now();
    if (now - checked < 1000) return;
    checked = now;
    sea.position.z = waterlineZ(tideAt(hourNow()));
  };
  sea.position.z = waterlineZ(tideAt(hourNow()));
  ground.add(sea);
  const decks = deckMesh(SHORE_SPEC.decks ?? [], 0.06);
  ground.add(decks);
  return () => {
    disposeDecks(decks);
    sea.removeFromParent();
    sg.dispose();
    sm.dispose();
    fg.dispose();
    fm.dispose();
  };
}

const mod = kitModule({
  name: 'shore',
  look: SHORE_GROUND,
  sheet: coastSheet,
  treeW: [4.2, 2.6, 2.2],
  propW: 1.2,
  pieces: shorePieces,
  paint: paintShore,
  dynamic: shoreDynamic,
  decorate,
  arch: { key: 'sign', w: 1.8 },
  cut: true,
});

export const createRegionPx = mod.createRegionPx;
export const drawEntrance = mod.drawEntrance;
export const drawDynamic = mod.drawDynamic;
