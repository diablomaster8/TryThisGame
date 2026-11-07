import * as THREE from 'three';
import {
  MOON_LAKE,
  MOON_LANTERNS,
  MOON_POIS,
  MOON_SPEC,
  MOON_SPIRE,
  SUN_COLUMNS,
  SUN_DOME,
  SUN_FOUNTAIN,
  SUN_TERRACES,
} from '../config/region-sunmoon';
import {
  MOON_GARDEN_PROPS,
  SUN_GARDEN_PROPS,
  type GardenProp,
} from '../config/region-sunmoon-gardens';
import { MOON_GROUND, paintMoon, paintSun, sunHeight, SUN_GROUND } from '../render/region-sunmoon';
import { deckMesh, disposeDecks } from '../render/region-kit-px';
import { at, kit3dModule, merged, tinted, type Kit3dDecor } from './region-kit';
import type { RegionLayout } from '../config/region-layout';

/**
 * WORLD-34 (R11 lane D, d7): the Sun and Moon lands in Full 3D, two styles on the region kit.
 * Sun: cypresses, golden shrubs and flowering urns; white retaining walls with gold caps between
 * the terraces (gaps where the path's steps climb), the halo-ball fountain, the gold dome and
 * the colonnade. Moon: crystal spikes, glow-berry shrubs and crystal clusters; the spire, the
 * ring of standing stones and the shore lanterns, whose lamps and the spire's heart are unlit
 * glow (no new lights, so no program relinks), a still dark lake and a drift of fireflies.
 */

const WHITE = '#f3efe4';
const STONE = '#d9d2bf';
const GOLD = '#e8b93a';
const DLEAF = '#2f5a34';
const VIOLET = '#9b5de5';
const DEEP = '#3a2a5e';
const SLATE = '#5a5470';

function cypress(): THREE.BufferGeometry {
  const c = new THREE.ConeGeometry(0.8, 4.2, 7);
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.12, 0.16, 0.8, 5), 0, 0.4, 0), '#6b4a2e'),
    tinted(at(c, 0, 2.7, 0), DLEAF, 0.2),
  ]);
}

function goldShrub(): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(0.9, 1);
  g.scale(1.2, 0.8, 1.1);
  return merged([tinted(at(g, 0, 0.6, 0), GOLD, 0.25)]);
}

function urn(): THREE.BufferGeometry {
  const parts = [
    tinted(at(new THREE.CylinderGeometry(0.25, 0.3, 0.2, 8), 0, 0.1, 0), STONE),
    tinted(at(new THREE.SphereGeometry(0.42, 8, 6), 0, 0.55, 0), WHITE),
    tinted(at(new THREE.CylinderGeometry(0.45, 0.35, 0.12, 8), 0, 0.92, 0), STONE),
  ];
  for (let i = 0; i < 6; i++) {
    const a = i * 1.05;
    parts.push(
      tinted(
        at(new THREE.IcosahedronGeometry(0.13, 0), Math.cos(a) * 0.3, 1.05, Math.sin(a) * 0.3),
        i % 2 ? '#e86a7a' : GOLD,
      ),
    );
  }
  return merged(parts);
}

function sunflower(): THREE.BufferGeometry {
  const head = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10);
  head.rotateX(Math.PI / 2.4);
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.03, 0.04, 1, 4), 0, 0.5, 0), '#4f7a3a'),
    tinted(at(head, 0, 1.05, 0.05), GOLD),
  ]);
}

/** A wall box from x0 to x1 over the gap between two terraces, its top at the upper level. */
function wall(x0: number, x1: number, z0: number, z1: number, top: number): THREE.BufferGeometry[] {
  const w = x1 - x0;
  const d = z1 - z0 - 0.3;
  return [
    tinted(
      at(new THREE.BoxGeometry(w, top, d), (x0 + x1) / 2, top / 2, (z0 + z1) / 2),
      WHITE,
      0.06,
    ),
    tinted(at(new THREE.BoxGeometry(w, 0.12, 0.5), (x0 + x1) / 2, top + 0.06, z1 - 0.35), GOLD),
  ];
}

/** R0096: the Nubbin gardens' bench, beds, toy stands and fence posts on the region kit. */
function gardenGeo(
  props: readonly GardenProp[],
  y: (x: number, z: number) => number,
  c: { seat: string; frame: string; bloom: string; bloom2: string; ball: string },
): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const box = (w: number, h: number, d: number, x: number, yy: number, z: number, col: string) =>
    parts.push(tinted(at(new THREE.BoxGeometry(w, h, d), x, yy, z), col));
  for (const p of props) {
    const gy = y(p.x, p.z);
    if (p.kind === 'bench') {
      box(1.8, 0.14, 0.6, p.x, gy + 0.5, p.z, c.seat);
      box(0.14, 0.5, 0.5, p.x - 0.75, gy + 0.25, p.z, c.frame);
      box(0.14, 0.5, 0.5, p.x + 0.75, gy + 0.25, p.z, c.frame);
      box(1.8, 0.4, 0.1, p.x, gy + 0.85, p.z - 0.28, c.seat);
    } else if (p.kind === 'bed') {
      parts.push(
        tinted(at(new THREE.CylinderGeometry(1.1, 1.2, 0.25, 10), p.x, gy + 0.12, p.z), '#5a4630'),
      );
      for (let i = 0; i < 6; i++) {
        const a = i * 1.05;
        const fx = p.x + Math.cos(a) * 0.65;
        const fz = p.z + Math.sin(a) * 0.65;
        parts.push(
          tinted(at(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 3), fx, gy + 0.5, fz), DLEAF),
        );
        parts.push(
          tinted(
            at(new THREE.IcosahedronGeometry(0.14, 0), fx, gy + 0.78, fz),
            i % 2 ? c.bloom : c.bloom2,
          ),
        );
      }
    } else if (p.kind === 'toy') {
      parts.push(
        tinted(at(new THREE.CylinderGeometry(0.05, 0.07, 0.7, 5), p.x, gy + 0.35, p.z), '#8a7a60'),
      );
      parts.push(tinted(at(new THREE.SphereGeometry(0.28, 8, 6), p.x, gy + 0.95, p.z), c.ball));
    } else {
      box(0.2, 0.9, 0.2, p.x, gy + 0.45, p.z, c.seat);
      box(0.26, 0.1, 0.26, p.x, gy + 0.92, p.z, c.frame);
    }
  }
  return parts;
}

function sunPieces(l: RegionLayout): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const E = l.spec.size.w / 2 + l.margin;
  // Walls between terraces, open where the path's steps climb (x of each ramp, 2.4 either side).
  const ramps: Record<number, number[]> = { 0: [0], 1: [-12, 12] };
  for (let i = 0; i + 1 < SUN_TERRACES.length; i++) {
    const lo = SUN_TERRACES[i + 1]!;
    const hi = SUN_TERRACES[i]!;
    const top = hi.y - lo.y;
    const gaps = (ramps[SUN_TERRACES.length - 2 - i] ?? []).slice().sort((a, b) => a - b);
    let x = -E;
    for (const g of gaps) {
      parts.push(...wall(x, g - 2.4, hi.z1, lo.z0, top).map((p) => p.translate(0, lo.y, 0)));
      x = g + 2.4;
    }
    parts.push(...wall(x, E, hi.z1, lo.z0, top).map((p) => p.translate(0, lo.y, 0)));
  }
  // The halo-ball fountain.
  const F = SUN_FOUNTAIN;
  const fy = sunHeight(F.x, F.z);
  parts.push(tinted(at(new THREE.CylinderGeometry(2.4, 2.5, 0.6, 16), F.x, fy + 0.3, F.z), STONE));
  parts.push(
    tinted(at(new THREE.CylinderGeometry(2.1, 2.1, 0.08, 16), F.x, fy + 0.58, F.z), '#6fb6d8'),
  );
  parts.push(tinted(at(new THREE.CylinderGeometry(0.3, 0.4, 1.8, 8), F.x, fy + 1.4, F.z), WHITE));
  parts.push(tinted(at(new THREE.SphereGeometry(0.6, 12, 8), F.x, fy + 3, F.z), '#fff6d0'));
  const ring = new THREE.TorusGeometry(0.75, 0.07, 6, 16);
  ring.rotateX(Math.PI / 2);
  parts.push(tinted(at(ring, F.x, fy + 3.9, F.z), GOLD));
  // The gold dome on its white drum.
  const D = SUN_DOME;
  const dy = sunHeight(D.x, D.z);
  parts.push(tinted(at(new THREE.CylinderGeometry(3.4, 3.6, 0.4, 16), D.x, dy + 0.2, D.z), STONE));
  parts.push(
    tinted(at(new THREE.CylinderGeometry(3, 3, 2.6, 16), D.x, dy + 1.7, D.z), WHITE, 0.05),
  );
  const dome = new THREE.SphereGeometry(3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  parts.push(tinted(at(dome, D.x, dy + 3, D.z), GOLD, 0.1));
  parts.push(tinted(at(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 6), D.x, dy + 6.5, D.z), GOLD));
  parts.push(tinted(at(new THREE.SphereGeometry(0.3, 8, 6), D.x, dy + 7.2, D.z), '#fff6d0'));
  for (const c of SUN_COLUMNS) {
    const cy = sunHeight(c.x, c.z);
    parts.push(
      tinted(at(new THREE.CylinderGeometry(0.35, 0.4, 3.2, 10), c.x, cy + 1.6, c.z), WHITE),
    );
    parts.push(tinted(at(new THREE.BoxGeometry(0.95, 0.25, 0.95), c.x, cy + 3.3, c.z), GOLD));
  }
  parts.push(
    ...gardenGeo(SUN_GARDEN_PROPS, sunHeight, {
      seat: WHITE,
      frame: GOLD,
      bloom: '#e86a7a',
      bloom2: GOLD,
      ball: GOLD,
    }),
  );
  return merged(parts);
}

function sunGate(): THREE.BufferGeometry {
  const parts = [
    tinted(at(new THREE.BoxGeometry(0.8, 4, 0.8), -2.2, 2, 0), WHITE),
    tinted(at(new THREE.BoxGeometry(0.8, 4, 0.8), 2.2, 2, 0), WHITE),
    tinted(at(new THREE.BoxGeometry(5.6, 0.6, 1), 0, 4.3, 0), WHITE),
    tinted(at(new THREE.BoxGeometry(5.6, 0.15, 1.05), 0, 4, 0), GOLD),
  ];
  const disc = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 12);
  disc.rotateX(Math.PI / 2);
  parts.push(tinted(at(disc, 0, 5.1, 0), GOLD));
  return merged(parts);
}

function crystals(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const [x, z, h, r] of [
    [0, 0, 3.2, 0.45],
    [0.6, 0.3, 2.2, 0.35],
    [-0.5, 0.2, 1.6, 0.3],
    [0.2, -0.5, 1.3, 0.28],
  ] as const) {
    const c = new THREE.ConeGeometry(r, h, 5);
    c.rotateZ(x * 0.25);
    parts.push(tinted(at(c, x, h / 2, z), VIOLET, 0.3));
  }
  return merged(parts);
}

function glowShrub(): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(0.9, 1);
  g.scale(1.2, 0.75, 1.1);
  const parts = [tinted(at(g, 0, 0.55, 0), DEEP, 0.3)];
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1;
    parts.push(
      tinted(
        at(new THREE.OctahedronGeometry(0.1, 0), Math.cos(a) * 0.9, 0.7, Math.sin(a) * 0.8),
        '#7af0d0',
      ),
    );
  }
  return merged(parts);
}

function smallCrystals(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const [x, z, h] of [
    [0, 0, 1],
    [0.35, 0.2, 0.7],
    [-0.3, 0.15, 0.55],
  ] as const)
    parts.push(tinted(at(new THREE.ConeGeometry(0.18, h, 5), x, h / 2, z), VIOLET, 0.3));
  return merged(parts);
}

function glowCap(): THREE.BufferGeometry {
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.05, 0.06, 0.35, 5), 0, 0.17, 0), '#d8d0f0'),
    tinted(
      at(new THREE.SphereGeometry(0.18, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), 0, 0.33, 0),
      '#7af0d0',
    ),
  ]);
}

function moonPieces(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const S = MOON_SPIRE;
  for (const [dx, dz, h, r] of [
    [0, 0, 11, 1.6],
    [-1.6, 0.6, 5, 0.9],
    [1.5, 0.4, 6.5, 1],
    [0.4, 1.4, 3.2, 0.7],
  ] as const)
    parts.push(
      tinted(at(new THREE.ConeGeometry(r, h, 6), S.x + dx, h / 2, S.z + dz), VIOLET, 0.25),
    );
  for (const l of MOON_LANTERNS) {
    parts.push(
      tinted(at(new THREE.CylinderGeometry(0.06, 0.08, 1.8, 5), l.x, 0.9, l.z), '#2e2a40'),
    );
    parts.push(tinted(at(new THREE.BoxGeometry(0.42, 0.08, 0.42), l.x, 2.18, l.z), '#2e2a40'));
  }
  const ring = MOON_POIS.find((p) => p.id === 'moon-stones')!;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const h = 1.6 + (i % 3) * 0.4;
    const g = new THREE.BoxGeometry(0.7, h, 0.45);
    g.rotateY(-a);
    parts.push(
      tinted(at(g, ring.x + Math.cos(a) * 3, h / 2, ring.z + Math.sin(a) * 3), SLATE, 0.2),
    );
  }
  parts.push(
    ...gardenGeo(MOON_GARDEN_PROPS, () => 0, {
      seat: SLATE,
      frame: '#c8d0ff',
      bloom: '#7af0d0',
      bloom2: '#c8d0ff',
      ball: VIOLET,
    }),
  );
  return merged(parts);
}

function moonGate(): THREE.BufferGeometry {
  const parts = [
    tinted(at(new THREE.BoxGeometry(0.8, 4, 0.8), -2.2, 2, 0), SLATE),
    tinted(at(new THREE.BoxGeometry(0.8, 4, 0.8), 2.2, 2, 0), SLATE),
    tinted(at(new THREE.BoxGeometry(5.6, 0.6, 1), 0, 4.3, 0), SLATE),
  ];
  const moon = new THREE.TorusGeometry(0.55, 0.16, 6, 12, Math.PI * 1.3);
  parts.push(tinted(at(moon, 0, 5.2, 0), '#c8d0ff'));
  return merged(parts);
}

/** The lake's still surface, the lamps' and spire's glow, and the fireflies. */
function moonDecor(group: THREE.Group): Kit3dDecor {
  const L = MOON_LAKE;
  const lg = new THREE.PlaneGeometry(L.w, L.h);
  lg.rotateX(-Math.PI / 2);
  const lm = new THREE.MeshStandardMaterial({
    color: '#1c2652',
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
  });
  const lake = new THREE.Mesh(lg, lm);
  lake.position.set(L.x, 0.03, L.z);
  lake.name = 'moon-lake';
  group.add(lake);
  const decks = deckMesh(MOON_SPEC.decks ?? [], 0.07);
  group.add(decks);
  const glows: THREE.BufferGeometry[] = [];
  for (const l of MOON_LANTERNS)
    glows.push(at(new THREE.BoxGeometry(0.38, 0.4, 0.38), l.x, 1.96, l.z).toNonIndexed());
  glows.push(
    at(new THREE.OctahedronGeometry(0.45, 0), MOON_SPIRE.x, 7, MOON_SPIRE.z + 1.2).toNonIndexed(),
  );
  for (const g of glows) g.deleteAttribute('uv');
  const gg = merged(glows);
  const gm = new THREE.MeshBasicMaterial({ color: '#ffd890' });
  const glow = new THREE.Mesh(gg, gm);
  glow.name = 'moon-glow';
  group.add(glow);
  // Fireflies over the glade: a fixed drift, written into one small buffer each frame.
  const glade = MOON_POIS.find((p) => p.id === 'firefly-glade')!;
  const N = 48;
  const base = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    base[i * 3] = glade.x + (((i * 7919) % 97) / 97 - 0.5) * 18;
    base[i * 3 + 1] = 0.6 + ((i * 31) % 17) / 10;
    base[i * 3 + 2] = glade.z + (((i * 104729) % 89) / 89 - 0.5) * 16;
  }
  const fg = new THREE.BufferGeometry();
  const pos = new THREE.BufferAttribute(base.slice(), 3);
  fg.setAttribute('position', pos);
  const fm = new THREE.PointsMaterial({
    color: '#f6f09a',
    size: 0.22,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const flies = new THREE.Points(fg, fm);
  flies.frustumCulled = false;
  flies.name = 'moon-fireflies';
  group.add(flies);
  const a = pos.array as Float32Array;
  return {
    tick(t, still) {
      if (still) return;
      for (let i = 0; i < N; i++) {
        a[i * 3] = base[i * 3]! + Math.sin(t * 0.4 + i) * 0.8;
        a[i * 3 + 1] = base[i * 3 + 1]! + Math.sin(t * 0.9 + i * 2.1) * 0.25;
        a[i * 3 + 2] = base[i * 3 + 2]! + Math.cos(t * 0.35 + i * 1.3) * 0.8;
      }
      pos.needsUpdate = true;
    },
    dispose() {
      disposeDecks(decks);
      for (const o of [lake, glow, flies]) o.removeFromParent();
      lg.dispose();
      lm.dispose();
      gg.dispose();
      gm.dispose();
      fg.dispose();
      fm.dispose();
    },
  };
}

export const sun = kit3dModule({
  name: 'sunlands',
  look: SUN_GROUND,
  paint: paintSun,
  fill: () => [cypress(), goldShrub(), urn()],
  tuft: '#b8b06a',
  prop: sunflower,
  pieces: sunPieces,
  heightAt: sunHeight,
  arch: sunGate,
  fold: false,
});

export const moon = kit3dModule({
  name: 'moonlands',
  look: MOON_GROUND,
  paint: paintMoon,
  fill: () => [crystals(), glowShrub(), smallCrystals()],
  tuft: '#4a3f6e',
  prop: glowCap,
  pieces: moonPieces,
  decorate: (group) => moonDecor(group),
  arch: moonGate,
  fold: false,
});
