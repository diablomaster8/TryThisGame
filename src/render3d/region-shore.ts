import * as THREE from 'three';
import {
  SHORE_CASTLES,
  SHORE_HOUSES,
  SHORE_LIGHT,
  SHORE_ROCKS,
  SHORE_SPEC,
  tideAt,
  waterlineZ,
} from '../config/region-shore';
import { SHORE_LOOK } from '../config/tuning-r11d7';
import { deckMesh, disposeDecks } from '../render/region-kit-px';
import { hourNow, paintShore, SHORE_GROUND } from '../render/region-shore';
import { at, kit3dModule, merged, tinted, type Kit3dDecor } from './region-kit';
import type { RegionLayout } from '../config/region-layout';

/**
 * WORLD-35 (R11 lane D, d7): the shore in Full 3D, on the region kit. The pixel view's painted
 * sand and dunes as the ground; wind-bent sea pines, gorse and marram as the fill; one merged
 * mesh for the stilt houses, the lighthouse, the sandcastles, the rocks, the signpost, the
 * stepping stones and two boats; the sea as one plane whose edge follows the real tide and
 * swells gently (held still under reduced motion), with a foam strip at its edge.
 */

const BARK = '#6b4a2e';
const PINE = '#2f5a45';
const PLANK = '#9c6e3e';
const STONE = '#8d8a84';
const SAND = '#e2c98e';
const RED = '#c8463a';
const WHITE = '#f4f1e8';

function seaPine(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.14, 0.24, 2.8, 6);
  trunk.rotateZ(-0.25);
  const parts = [tinted(at(trunk, 0.35, 1.35, 0), BARK)];
  for (const [x, y, r] of [
    [0.9, 2.8, 1.5],
    [0.3, 2.4, 1.1],
    [1.3, 3.3, 0.9],
  ] as const) {
    const c = new THREE.CylinderGeometry(r * 0.6, r, 0.5, 8);
    parts.push(tinted(at(c, x, y, 0), PINE, 0.25));
  }
  return merged(parts);
}

function gorse(): THREE.BufferGeometry {
  const b = new THREE.IcosahedronGeometry(0.9, 1);
  b.scale(1.2, 0.75, 1.1);
  const parts = [tinted(at(b, 0, 0.55, 0), '#3f6a32', 0.3)];
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1;
    parts.push(
      tinted(
        at(new THREE.OctahedronGeometry(0.14, 0), Math.cos(a) * 0.8, 0.8, Math.sin(a) * 0.7),
        '#f2c94a',
      ),
    );
  }
  return merged(parts);
}

function marram(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const p: number[] = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const lean = 0.5 + (i % 3) * 0.15;
    p.push(-0.05, 0, 0, 0.05, 0, 0, Math.cos(a) * lean, 0.9 + (i % 2) * 0.3, Math.sin(a) * lean);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return merged([tinted(g, '#b8b06a')]);
}

function shell(): THREE.BufferGeometry {
  const g = new THREE.DodecahedronGeometry(0.22, 0);
  g.scale(1.3, 0.4, 1);
  return merged([tinted(at(g, 0, 0.08, 0), '#efd2b4', 0.2)]);
}

function house(x: number, z: number, tone: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  for (const [dx, dz] of [
    [-1.6, -1],
    [1.6, -1],
    [-1.6, 1],
    [1.6, 1],
  ] as const)
    parts.push(
      tinted(at(new THREE.CylinderGeometry(0.1, 0.12, 1.4, 5), x + dx, 0.5, z + dz), BARK),
    );
  parts.push(tinted(at(new THREE.BoxGeometry(4, 0.2, 3), x, 1.2, z), PLANK));
  const wall = new THREE.Color(PLANK).multiplyScalar(1.05 + tone * 0.07);
  parts.push(tinted(at(new THREE.BoxGeometry(3.4, 1.9, 2.2), x, 2.25, z), wall, 0.08));
  const roof = new THREE.ConeGeometry(2.7, 1.5, 4);
  roof.rotateY(Math.PI / 4);
  roof.scale(1, 1, 0.75);
  parts.push(tinted(at(roof, x, 3.95, z), '#4a6f8c'));
  parts.push(tinted(at(new THREE.BoxGeometry(0.7, 0.55, 0.05), x - 0.9, 2.5, z - 1.13), '#ffe9a0'));
  parts.push(tinted(at(new THREE.BoxGeometry(0.7, 1.2, 0.05), x + 0.6, 1.9, z - 1.13), '#5a3e24'));
  return parts;
}

function pieces(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  SHORE_HOUSES.forEach((h, i) => parts.push(...house(h.x, h.z, i % 3)));
  // The lighthouse: banded tower, gallery, lamp, cap.
  const L = SHORE_LIGHT;
  parts.push(tinted(at(new THREE.CylinderGeometry(2.2, 2.4, 0.5, 12), L.x, 0.25, L.z), STONE));
  for (let i = 0; i < 5; i++) {
    const r0 = 1.5 - i * 0.12;
    parts.push(
      tinted(
        at(new THREE.CylinderGeometry(r0 - 0.12, r0, 1.6, 12), L.x, 1.3 + i * 1.6, L.z),
        i % 2 ? WHITE : RED,
      ),
    );
  }
  parts.push(tinted(at(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 12), L.x, 9.2, L.z), '#3a3a44'));
  parts.push(tinted(at(new THREE.CylinderGeometry(0.7, 0.7, 1, 8), L.x, 9.8, L.z), '#ffe9a0'));
  parts.push(tinted(at(new THREE.ConeGeometry(0.95, 0.9, 8), L.x, 10.75, L.z), '#3a3a44'));
  for (const c of SHORE_CASTLES) {
    parts.push(tinted(at(new THREE.BoxGeometry(1.4, 0.6, 1), c.x, 0.3, c.z), SAND, 0.15));
    for (const dx of [-0.55, 0.55])
      parts.push(
        tinted(at(new THREE.CylinderGeometry(0.25, 0.3, 0.9, 6), c.x + dx, 0.45, c.z), SAND),
      );
    parts.push(tinted(at(new THREE.BoxGeometry(0.03, 0.6, 0.03), c.x, 0.9, c.z), PLANK));
    parts.push(tinted(at(new THREE.BoxGeometry(0.3, 0.18, 0.02), c.x + 0.15, 1.1, c.z), RED));
  }
  for (const r of SHORE_ROCKS) {
    const g = new THREE.DodecahedronGeometry(r.r, 0);
    g.scale(1, 0.6, 0.9);
    parts.push(tinted(at(g, r.x, r.r * 0.3, r.z), STONE, 0.3));
  }
  // The signpost at the landing.
  parts.push(tinted(at(new THREE.BoxGeometry(0.12, 1.6, 0.12), -39, 0.8, -18), PLANK));
  parts.push(tinted(at(new THREE.BoxGeometry(1.2, 0.3, 0.06), -38.6, 1.4, -18), PLANK));
  parts.push(tinted(at(new THREE.BoxGeometry(1, 0.28, 0.06), -39.4, 1.05, -18), PLANK));
  // Stepping stones over the stream's mouth.
  for (let i = 0; i < 4; i++) {
    const g = new THREE.CylinderGeometry(0.45, 0.55, 0.3, 7);
    parts.push(tinted(at(g, -49.1 + i, 0.12, 3 + (i % 2) * 0.3), STONE, 0.2));
  }
  // Stilts under the boardwalk and jetties.
  for (const d of SHORE_SPEC.decks ?? [])
    for (let i = 0; i <= Math.floor(Math.max(d.w, d.h) / 3); i++) {
      const along = d.w > d.h;
      const t = -Math.max(d.w, d.h) / 2 + i * 3;
      for (const s of [-1, 1]) {
        const x = along ? d.x + t : d.x + (s * d.w) / 2.2;
        const z = along ? d.z + (s * d.h) / 2.2 : d.z + t;
        parts.push(tinted(at(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 5), x, -0.34, z), BARK));
      }
    }
  // Two boats: one pulled up on the sand, one at the jetty.
  for (const [x, z, yaw] of [
    [-26, 8.6, 0.3],
    [60.6, 19.4, -0.2],
  ] as const) {
    const hull = new THREE.CylinderGeometry(0.7, 0.4, 3, 6, 1, false, 0, Math.PI);
    hull.rotateZ(Math.PI / 2);
    hull.rotateX(Math.PI);
    hull.rotateY(yaw);
    parts.push(tinted(at(hull, x, 0.45, z), '#3f6f8f'));
  }
  return merged(parts);
}

function sign(): THREE.BufferGeometry {
  return merged([
    tinted(at(new THREE.BoxGeometry(0.12, 1.6, 0.12), 0, 0.8, 0), PLANK),
    tinted(at(new THREE.BoxGeometry(1.2, 0.3, 0.06), 0.4, 1.4, 0), PLANK),
  ]);
}

/** The sea: one plane hung from the tide line out to the margin, and its foam strip. */
function decorate(group: THREE.Group, l: RegionLayout): Kit3dDecor {
  const w = l.spec.size.w + 2 * l.margin;
  const deep = l.spec.size.h / 2 + l.margin - SHORE_LOOK.highTideZ + 4;
  const sg = new THREE.PlaneGeometry(w, deep);
  sg.rotateX(-Math.PI / 2);
  sg.translate(0, 0, deep / 2);
  const sm = new THREE.MeshStandardMaterial({
    color: '#3a84b6',
    roughness: 0.25,
    metalness: 0,
    transparent: true,
    opacity: 0.9,
  });
  const sea = new THREE.Mesh(sg, sm);
  sea.name = 'shore-sea';
  sea.receiveShadow = true;
  const fg = new THREE.PlaneGeometry(w, 0.4);
  fg.rotateX(-Math.PI / 2);
  const fm = new THREE.MeshBasicMaterial({ color: '#f4fbff', transparent: true, opacity: 0.85 });
  const foam = new THREE.Mesh(fg, fm);
  foam.position.set(0, 0.02, 0.15);
  sea.add(foam);
  group.add(sea);
  // The boardwalk stands on its stilts above the water.
  const decks = deckMesh(SHORE_SPEC.decks ?? [], 0.07);
  decks.castShadow = true;
  group.add(decks);
  let checked = -Infinity;
  let line = waterlineZ(tideAt(hourNow()));
  return {
    tick(t, still) {
      const now = performance.now();
      if (now - checked > 1000) {
        checked = now;
        line = waterlineZ(tideAt(hourNow()));
      }
      // A slow swell: the water's edge breathes half a unit up the sand.
      const s = still ? 0 : Math.sin(t * SHORE_LOOK.swell);
      sea.position.set(0, 0.04 + s * 0.02, line - s * 0.25);
      foam.scale.z = 1 + (still ? 0 : 0.4 * Math.max(0, s));
    },
    dispose() {
      disposeDecks(decks);
      sea.removeFromParent();
      sg.dispose();
      sm.dispose();
      fg.dispose();
      fm.dispose();
    },
  };
}

const mod = kit3dModule({
  name: 'shore',
  look: SHORE_GROUND,
  paint: paintShore,
  fill: () => [seaPine(), gorse(), marram()],
  tuft: '#a9b06a',
  prop: shell,
  pieces,
  decorate,
  arch: sign,
  fold: false,
  cut: true,
});

export const createRegion3d = mod.createRegion3d;
export const entrance = mod.entrance;
