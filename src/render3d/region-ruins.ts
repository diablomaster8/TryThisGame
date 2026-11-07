import type { ReadonlyWorld } from '../render/readonly-world';
import * as THREE from 'three';
import {
  RUINS_COLUMNS,
  RUINS_DOOR,
  RUINS_LANTERNS,
  RUINS_POIS,
  RUINS_SPIRE,
  RUINS_TEMPLE,
  RUINS_TERRACES,
  ruinsState,
  type RuinsState,
} from '../config/region-ruins';
import type { RegionLayout } from '../config/region-layout';
import { paintRuins, RUINS_GROUND, ruinsHeight } from '../render/region-ruins';

import { at, kit3dModule, merged, tinted, type Kit3dDecor } from './region-kit';

/**
 * WORLD-37 (R11 lane D, d7): the ruins in Full 3D, on the region kit. Frost-killed trees,
 * column stubs and rubble as the fill; one merged mesh for the retaining wall (open at the
 * stair), the colonnade, the broken spire, the temple front, the archive's walls, the stones
 * and the lantern posts. The story's three states are three small meshes switched by `sync`
 * from the campaign (read only): the ice over the door, the open doorway, and the lanterns'
 * flames (unlit glow, so no light is added and no program relinks).
 */

const STONE = '#a9aab0';
const DARK = '#6e6f78';
const MOSS = '#5d7a4a';
const FROST = '#dcecf6';
const BARK = '#5a4c40';

function deadTree(): THREE.BufferGeometry {
  const parts = [tinted(at(new THREE.CylinderGeometry(0.16, 0.26, 3, 6), 0, 1.5, 0), BARK)];
  for (const [a, tilt, h] of [
    [0, 0.7, 1.6],
    [2.1, 0.8, 1.3],
    [4.2, 0.6, 1.4],
  ] as const) {
    const b = new THREE.CylinderGeometry(0.05, 0.1, h, 4);
    b.translate(0, h / 2, 0);
    b.rotateZ(tilt);
    b.rotateY(a);
    parts.push(tinted(at(b, 0, 2.6, 0), BARK));
    const tip = new THREE.OctahedronGeometry(0.1, 0);
    parts.push(
      tinted(
        at(
          tip,
          Math.cos(a) * -Math.sin(tilt) * h,
          2.6 + Math.cos(tilt) * h,
          Math.sin(a) * Math.sin(tilt) * h,
        ),
        FROST,
      ),
    );
  }
  return merged(parts);
}

function stub(): THREE.BufferGeometry {
  return merged([
    tinted(at(new THREE.BoxGeometry(1, 0.3, 1), 0, 0.15, 0), DARK),
    tinted(at(new THREE.CylinderGeometry(0.36, 0.38, 1.3, 8), 0, 0.95, 0), STONE, 0.1),
    tinted(at(new THREE.CylinderGeometry(0.37, 0.37, 0.06, 8), 0, 1.62, 0), FROST),
  ]);
}

function rubble(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const g = new THREE.DodecahedronGeometry(0.3 + (i % 3) * 0.12, 0);
    parts.push(
      tinted(
        at(g, Math.cos(i * 1.3) * 0.6, 0.18, Math.sin(i * 1.3) * 0.5),
        i === 2 ? MOSS : STONE,
        0.3,
      ),
    );
  }
  return merged(parts);
}

function capital(): THREE.BufferGeometry {
  return merged([tinted(at(new THREE.BoxGeometry(0.9, 0.35, 0.6), 0, 0.17, 0), STONE, 0.15)]);
}

function column(x: number, y: number, z: number, broken: boolean): THREE.BufferGeometry[] {
  const h = broken ? 2.2 : 4.2;
  const out = [
    tinted(at(new THREE.BoxGeometry(1.3, 0.3, 1.3), x, y + 0.15, z), DARK),
    tinted(at(new THREE.CylinderGeometry(0.45, 0.5, h, 10), x, y + 0.3 + h / 2, z), STONE, 0.08),
  ];
  if (!broken)
    out.push(tinted(at(new THREE.BoxGeometry(1.2, 0.3, 1.2), x, y + 0.45 + h, z), STONE));
  out.push(tinted(at(new THREE.CylinderGeometry(0.47, 0.47, 0.05, 10), x, y + 0.32 + h, z), FROST));
  return out;
}

function pieces(l: RegionLayout): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const E = l.spec.size.w / 2 + l.margin;
  const hi = RUINS_TERRACES[0];
  const lo = RUINS_TERRACES[1];
  // The retaining wall, open 3 units either side of the stair.
  for (const [x0, x1] of [
    [-E, -3],
    [3, E],
  ] as const)
    parts.push(
      tinted(
        at(
          new THREE.BoxGeometry(x1 - x0, hi.y, lo.z0 - hi.z1 - 0.2),
          (x0 + x1) / 2,
          hi.y / 2,
          (hi.z1 + lo.z0) / 2,
        ),
        DARK,
        0.08,
      ),
    );
  for (const c of RUINS_COLUMNS) parts.push(...column(c.x, ruinsHeight(c.x, c.z), c.z, c.broken));
  // The broken spire.
  const S = RUINS_SPIRE;
  const sy = ruinsHeight(S.x, S.z);
  parts.push(tinted(at(new THREE.BoxGeometry(4.4, 0.8, 4.4), S.x, sy + 0.4, S.z), DARK));
  parts.push(tinted(at(new THREE.BoxGeometry(3.2, 9, 3.2), S.x, sy + 5.3, S.z), STONE, 0.08));
  for (let i = 0; i < 4; i++) {
    const g = new THREE.ConeGeometry(0.6, 1.2 + (i % 2) * 1.4, 4);
    parts.push(
      tinted(
        at(g, S.x - 1 + (i % 2) * 2, sy + 10.2 + (i % 2) * 0.7, S.z - 1 + (i >> 1) * 2),
        STONE,
      ),
    );
  }
  parts.push(tinted(at(new THREE.BoxGeometry(3.3, 0.08, 3.3), S.x, sy + 9.84, S.z), FROST));
  // The temple front with the door's frame (the door is the story's).
  const T = RUINS_TEMPLE;
  const ty = ruinsHeight(T.x, T.z);
  for (const [x0, x1] of [
    [-T.w / 2, -2.2],
    [2.2, T.w / 2],
  ] as const)
    parts.push(
      tinted(
        at(new THREE.BoxGeometry(x1 - x0, 7, T.h), T.x + (x0 + x1) / 2, ty + 3.5, T.z),
        STONE,
        0.08,
      ),
    );
  parts.push(tinted(at(new THREE.BoxGeometry(4.4, 1, T.h), T.x, ty + 6.5, T.z), STONE));
  parts.push(
    tinted(at(new THREE.BoxGeometry(T.w + 0.6, 0.8, T.h + 0.6), T.x, ty + 7.4, T.z), DARK),
  );
  parts.push(
    tinted(at(new THREE.BoxGeometry(T.w + 0.6, 0.08, T.h + 0.6), T.x, ty + 7.84, T.z), FROST),
  );
  // The archive's walls.
  const A = RUINS_POIS.find((p) => p.id === 'archive')!;
  for (const [dx, dz, w, d, h] of [
    [0, -6, 10, 1, 3.4],
    [-5, -1, 1, 8, 2.2],
    [6, 2, 1, 5, 2.8],
  ] as const)
    parts.push(tinted(at(new THREE.BoxGeometry(w, h, d), A.x + dx, h / 2, A.z + dz), STONE, 0.12));
  const R = RUINS_POIS.find((p) => p.id === 'stones')!;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const h = 1.8 + (i % 3) * 0.5;
    const g = new THREE.BoxGeometry(0.8, h, 0.5);
    g.rotateY(-a);
    parts.push(tinted(at(g, R.x + Math.cos(a) * 3, h / 2, R.z + Math.sin(a) * 3), DARK, 0.2));
  }
  for (const p of RUINS_LANTERNS) {
    parts.push(tinted(at(new THREE.CylinderGeometry(0.07, 0.09, 1.8, 5), p.x, 0.9, p.z), DARK));
    parts.push(tinted(at(new THREE.BoxGeometry(0.5, 0.08, 0.5), p.x, 2.2, p.z), DARK));
  }
  return merged(parts);
}

function archway(): THREE.BufferGeometry {
  return merged([
    tinted(at(new THREE.BoxGeometry(0.9, 4.4, 0.9), -2.4, 2.2, 0), STONE, 0.1),
    tinted(at(new THREE.BoxGeometry(0.9, 3.4, 0.9), 2.4, 1.7, 0), STONE, 0.1),
    tinted(at(new THREE.BoxGeometry(3.6, 0.7, 1), -1, 4.6, 0), STONE),
    tinted(at(new THREE.BoxGeometry(3.6, 0.08, 1.02), -1, 4.98, 0), FROST),
  ]);
}

/** The story's three small meshes: ice over the door, the open doorway, the flames. */
function story(group: THREE.Group, mat: THREE.Material): Kit3dDecor {
  const D = RUINS_DOOR;
  const dy = ruinsHeight(D.x, D.z);
  const ig = merged([
    tinted(at(new THREE.BoxGeometry(4.2, 6, 0.4), D.x, dy + 3, D.z - 0.3), '#9cc4dc', 0.2),
  ]);
  const ice = new THREE.Mesh(ig, mat);
  const og = merged([
    tinted(at(new THREE.BoxGeometry(4.2, 6, 0.1), D.x, dy + 3, D.z - 1.4), '#1c1c22'),
    tinted(at(new THREE.BoxGeometry(3.4, 0.3, 1), D.x, dy + 0.15, D.z - 0.9), DARK),
  ]);
  const open = new THREE.Mesh(og, mat);
  const fg = merged(
    RUINS_LANTERNS.map((p) =>
      at(new THREE.BoxGeometry(0.3, 0.34, 0.3), p.x, 1.98, p.z).toNonIndexed(),
    ),
  );
  const fm = new THREE.MeshBasicMaterial({ color: '#ffcf6a' });
  const flames = new THREE.Mesh(fg, fm);
  const cold = new THREE.Mesh(
    merged(
      RUINS_LANTERNS.map((p) =>
        tinted(at(new THREE.BoxGeometry(0.3, 0.34, 0.3), p.x, 1.98, p.z), '#7c8a96'),
      ),
    ),
    mat,
  );
  ice.name = 'ruins-ice';
  open.name = 'ruins-doorway';
  flames.name = 'ruins-flames';
  cold.name = 'ruins-cold-lamps';
  for (const m of [ice, open, flames, cold]) group.add(m);
  let was: RuinsState | null = null;
  return {
    sync(world: ReadonlyWorld) {
      const s = ruinsState(world.campaign);
      if (s === was) return;
      was = s;
      ice.visible = s === 'sealed';
      open.visible = s !== 'sealed';
      flames.visible = s === 'relit';
      cold.visible = s !== 'relit';
    },
    dispose() {
      for (const m of [ice, open, flames, cold]) {
        m.removeFromParent();
        m.geometry.dispose();
      }
      fm.dispose();
    },
  };
}

const mod = kit3dModule({
  name: 'ruins',
  look: RUINS_GROUND,
  paint: paintRuins,
  fill: () => [deadTree(), stub(), rubble()],
  tuft: '#6f7f5a',
  prop: capital,
  pieces,
  heightAt: ruinsHeight,
  decorate: (group, _l, mat) => story(group, mat),
  arch: archway,
  fold: false,
});

export const createRegion3d = mod.createRegion3d;
export const entrance = mod.entrance;
