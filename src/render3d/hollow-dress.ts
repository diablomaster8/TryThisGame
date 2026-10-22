import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { cellAt, cellCentre, WALL, WATER, type Floor } from '../sim/dungeon';
import type { Tex } from '../samples/aaa-kit';
import {
  CELL,
  cellHash,
  disposeObjects,
  mat,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import { paintedWater, type PaintedWater } from './water';

/**
 * The Hollow's dressing: everything decorative that is not rock, light or air. Loose
 * stones and stalagmites, the still pools (painted water), the stairs and their glowing
 * rings, the chest and its lid, and the loot lying about. Owns the tap targets (`picks`).
 */

/**
 * The way on and the chest glow a little, and stand in a soft ring of light on the floor,
 * so they read in the dark at a glance (review 2026-10-21, bug 12).
 */
const STEP = mat('#a8a2b8', { emissive: '#4a64a8', emissiveIntensity: 0.25 });
const RIM = mat('#b8c8e8', { emissive: '#7aa8ff', emissiveIntensity: 1.2 });
const MARKERS = new Map<string, THREE.MeshBasicMaterial>();
function marker(x: number, z: number, color: string): THREE.Mesh {
  let m = MARKERS.get(color);
  if (!m) {
    m = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    MARKERS.set(color, m);
  }
  const ring = new THREE.Mesh(new THREE.RingGeometry(CELL * 0.42, CELL * 0.56, 32), m);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.04, z);
  ring.userData.marker = true;
  return ring;
}

/** Loose stones and the odd spike: flat-shaded rock with plain UVs. */
function stoneMaterial(tex: Tex): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex.rock.map,
    color: '#9a8c94',
    roughness: 0.95,
    flatShading: true,
  });
}

/**
 * The still pools, one mesh over every wet cell, carrying the painted water's `depth`:
 * zero at a corner that touches dry ground, so foam rings the shore.
 */
function poolGeometry(f: Floor): THREE.BufferGeometry | null {
  const wet = (x: number, y: number) => cellAt(f, x, y) === WATER;
  const corners = new Map<number, number>();
  const pos: number[] = [];
  const depth: number[] = [];
  const index: number[] = [];
  const corner = (ix: number, iz: number): number => {
    const key = iz * (f.cols + 1) + ix;
    const had = corners.get(key);
    if (had !== undefined) return had;
    const i = pos.length / 3;
    corners.set(key, i);
    pos.push((ix - f.cols / 2) * CELL, 0.04, (iz - f.rows / 2) * CELL);
    const all = wet(ix - 1, iz - 1) && wet(ix, iz - 1) && wet(ix - 1, iz) && wet(ix, iz);
    depth.push(all ? 0.8 : 0);
    return i;
  };
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) {
      if (!wet(x, y)) continue;
      const a = corner(x, y);
      const b = corner(x + 1, y);
      const c = corner(x, y + 1);
      const d = corner(x + 1, y + 1);
      // A centre vertex with water under it, so a pool one cell wide still has open water
      // in the middle and foam only at its banks (it was foam from bank to bank).
      const m = pos.length / 3;
      pos.push((x + 0.5 - f.cols / 2) * CELL, 0.04, (y + 0.5 - f.rows / 2) * CELL);
      depth.push(0.8);
      index.push(a, c, m, c, d, m, d, b, m, b, a, m);
    }
  if (!index.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('depth', new THREE.Float32BufferAttribute(depth, 1));
  g.setIndex(index);
  return g;
}

/** Loot as the pixel floor paints it: a little heap of shells, a grey stone, a sprouting
 * seed, a violet essence crystal, a critter in a bubble, a speckled egg. */
function lootModel(kind: string): THREE.Object3D {
  const g = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = true;
    g.add(o);
    return o;
  };
  if (kind === 'shells') {
    const gold = mat('#f2d34c', {
      metalness: 0.6,
      roughness: 0.35,
      emissive: '#c89a20',
      emissiveIntensity: 0.7,
    });
    const geo = new THREE.SphereGeometry(0.09, 10, 8);
    for (const [x, z] of [
      [-0.1, 0.05],
      [0.08, 0.09],
      [-0.02, -0.08],
      [0.12, -0.06],
    ] as const)
      add(geo, gold, x, -0.12, z).scale.set(1, 0.45, 0.8);
  } else if (kind === 'stone') {
    add(
      new THREE.DodecahedronGeometry(0.16),
      mat('#9a9aac', { flatShading: true, emissive: '#6a6a90', emissiveIntensity: 0.35 }),
    ).scale.set(1, 0.7, 0.85);
  } else if (kind === 'seed') {
    add(
      new THREE.SphereGeometry(0.11, 12, 10),
      mat('#8a5a32', { roughness: 0.6, emissive: '#6a4020', emissiveIntensity: 0.4 }),
    ).scale.set(0.85, 1.1, 0.85);
    add(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 5), mat('#4a9c42'), 0.03, 0.17, 0);
    add(new THREE.SphereGeometry(0.05, 8, 6), mat('#8fd262'), 0.07, 0.24, 0).scale.set(
      1.4,
      0.5,
      0.8,
    );
  } else if (kind === 'essence') {
    const glow = { emissive: '#b58cff', emissiveIntensity: 0.9, roughness: 0.25 };
    add(new THREE.ConeGeometry(0.11, 0.34, 6), mat('#b58cff', glow), 0, 0.02, 0);
    add(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 12), mat('#7a5ad0'), 0, -0.16, 0);
  } else if (kind === 'critter') {
    add(new THREE.SphereGeometry(0.08, 10, 8), mat('#3a3346'));
    const eye = mat('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.4 });
    const dot = new THREE.SphereGeometry(0.018, 6, 4);
    add(dot, eye, -0.03, 0.02, 0.07);
    add(dot, eye, 0.03, 0.02, 0.07);
    const bubble = add(
      new THREE.SphereGeometry(0.2, 16, 12),
      mat('#9ad0ff', {
        emissive: '#9ad0ff',
        emissiveIntensity: 0.5,
        roughness: 0.1,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    bubble.castShadow = false;
  } else {
    add(
      new THREE.SphereGeometry(0.2, 14, 10),
      mat('#f3efe2', { roughness: 0.5, emissive: '#a89cc0', emissiveIntensity: 0.45 }),
    ).scale.set(0.85, 1.1, 0.85);
    const speck = mat('#c9a0ff');
    const geo = new THREE.SphereGeometry(0.025, 6, 4);
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4;
      const y = -0.1 + (i % 3) * 0.09;
      const r = Math.sqrt(Math.max(0, 1 - (y / 0.22) ** 2)) * 0.165;
      add(geo, speck, Math.cos(a) * r, y, Math.sin(a) * r);
    }
  }
  return g;
}

export type HollowPick = [THREE.Vector3, 'stairs' | 'chest' | 'loot', string, number];

export class HollowDress implements HollowModule {
  readonly stone: THREE.MeshStandardMaterial;
  readonly water: PaintedWater;
  readonly loot = new Map<string, THREE.Object3D>();
  readonly picks: HollowPick[] = [];
  private readonly objs: THREE.Object3D[] = [];
  private chestLid: THREE.Object3D | null = null;
  private sky: HollowCtx['sky'] | null = null;

  constructor(tex: Tex) {
    this.stone = stoneMaterial(tex);
    this.water = paintedWater(0, 0.55);
  }

  private put(...o: THREE.Object3D[]): void {
    this.group?.add(...o);
    this.objs.push(...o);
  }
  private group: THREE.Group | null = null;

  build(f: Floor, ctx: HollowCtx): void {
    this.group = ctx.group;
    this.sky = ctx.sky;
    // Loose stones and spikes on the open cells that touch the rock, leaned against it;
    // never on a cell with something to tap.
    const busy = new Set(
      [f.stairsUp, f.stairsDown, f.chest, ...f.torches, ...f.loot.map((l) => l.cell)]
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => `${c.x},${c.y}`),
    );
    const stones: THREE.Matrix4[] = [];
    const spikes: THREE.Matrix4[] = [];
    const { rubbleShare, spikeShare } = GROVE3D.cave;
    const e = new THREE.Euler();
    const q = new THREE.Quaternion();
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        const c = cellAt(f, x, y);
        if (c === WALL || c === WATER || busy.has(`${x},${y}`)) continue;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          if (cellAt(f, x + dx, y + dy) !== WALL) continue;
          const at = cellCentre(f, { x, y });
          const h1 = cellHash(x * 2 + dx, y * 2 + dy, 1);
          const along = (cellHash(x, y, 2 + dx + dy * 3) - 0.5) * CELL * 0.7;
          const px = at.x + dx * CELL * 0.38 + dy * along;
          const pz = at.z + dy * CELL * 0.38 + dx * along;
          if (h1 < rubbleShare) {
            const n = 1 + Math.floor(cellHash(x, y, 7 + dx) * 3);
            for (let i = 0; i < n; i++) {
              const r = 0.07 + cellHash(x + i, y, 9) * 0.12;
              const ox = (cellHash(x, y + i, 11) - 0.5) * 0.5;
              const oz = (cellHash(x + i, y + i, 13) - 0.5) * 0.5;
              e.set(cellHash(i, x, 3) * 3, cellHash(y, i, 5) * 6, 0);
              stones.push(
                new THREE.Matrix4().compose(
                  new THREE.Vector3(px + ox * 0.6, r * 0.45, pz + oz * 0.6),
                  q.clone().setFromEuler(e),
                  new THREE.Vector3(r, r * 0.7, r),
                ),
              );
            }
          } else if (h1 < rubbleShare + spikeShare) {
            const tall = 0.45 + cellHash(x, y, 17) * 0.65;
            const r = 0.13 + cellHash(y, x, 19) * 0.1;
            spikes.push(
              new THREE.Matrix4().compose(
                new THREE.Vector3(px, tall / 2 - 0.02, pz),
                q.clone().setFromEuler(e.set((cellHash(x, y, 23) - 0.5) * 0.25, 0, 0)),
                new THREE.Vector3(r, tall, r),
              ),
            );
          }
        }
      }
    const scatter = (geo: THREE.BufferGeometry, list: THREE.Matrix4[], shadow: boolean) => {
      if (!list.length) return;
      const im = new THREE.InstancedMesh(geo, this.stone, list.length);
      list.forEach((m, i) => im.setMatrixAt(i, m));
      im.castShadow = shadow;
      im.receiveShadow = true;
      this.put(im);
    };
    scatter(new THREE.DodecahedronGeometry(1, 0), stones, false);
    scatter(new THREE.ConeGeometry(1, 1, 6, 2), spikes, true);
    const pool = poolGeometry(f);
    if (pool) this.put(new THREE.Mesh(pool, this.water.material));
    // Stairs: steps rising for the way up, a dark well with a rim for the way down.
    const up = cellCentre(f, f.stairsUp);
    const steps = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const st = new THREE.Mesh(
        new THREE.BoxGeometry(CELL * 0.8, 0.18 * (i + 1), CELL * 0.22),
        STEP,
      );
      st.position.set(0, 0.09 * (i + 1), -CELL * 0.3 + i * CELL * 0.2);
      steps.add(st);
    }
    steps.position.set(up.x, 0, up.z);
    this.put(steps, marker(up.x, up.z, '#9ec8ff'));
    this.picks.push([new THREE.Vector3(up.x, 0.4, up.z), 'stairs', 'up', 0.9]);
    if (f.stairsDown) {
      const dn = cellCentre(f, f.stairsDown);
      const hole = new THREE.Mesh(new THREE.CircleGeometry(CELL * 0.38, 20), mat('#05040a'));
      hole.rotation.x = -Math.PI / 2;
      hole.position.set(dn.x, 0.03, dn.z);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(CELL * 0.4, 0.08, 8, 24), RIM);
      rim.rotation.x = -Math.PI / 2;
      rim.position.set(dn.x, 0.06, dn.z);
      this.put(hole, rim, marker(dn.x, dn.z, '#9ec8ff'));
      this.picks.push([new THREE.Vector3(dn.x, 0.2, dn.z), 'stairs', 'down', 0.9]);
    }
    // The chest.
    const ch = cellCentre(f, f.chest);
    const chest = new THREE.Group();
    chest.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.4, 0.45),
        mat('#8a5a2a', { emissive: '#4a2a10', emissiveIntensity: 0.5 }),
      ),
    );
    chest.children[0]!.position.y = 0.2;
    const lid = new THREE.Group();
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.47), mat('#a06a32'));
    lidMesh.position.set(0, 0.07, 0.235);
    lid.add(lidMesh);
    lid.position.set(0, 0.4, -0.235);
    chest.add(lid);
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.42, 0.47),
      mat('#e0c060', {
        metalness: 0.8,
        roughness: 0.3,
        emissive: '#c89a20',
        emissiveIntensity: 0.9,
      }),
    );
    band.position.y = 0.21;
    chest.add(band);
    chest.position.set(ch.x, 0, ch.z);
    chest.traverse((o) => (o.castShadow = true));
    this.chestLid = lid;
    this.put(chest, marker(ch.x, ch.z, '#ffd870'));
    this.picks.push([new THREE.Vector3(ch.x, 0.3, ch.z), 'chest', 'chest', 0.6]);
    for (const l of f.loot) {
      const p = cellCentre(f, l.cell);
      const m = lootModel(l.kind);
      m.position.set(p.x, 0.25, p.z);
      this.put(m);
      this.loot.set(l.id, m);
      this.picks.push([m.position, 'loot', l.id, 0.45]);
    }
  }

  dispose(): void {
    disposeObjects(this.objs);
    this.loot.clear();
    this.picks.length = 0;
    this.chestLid = null;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const run = fr.run;
    if (!fr.on || !run) return;
    for (const [id, m] of this.loot) {
      m.visible = !run.taken.includes(id);
      m.position.y = 0.25 + Math.sin(t * 2 + m.position.x) * 0.04;
      m.rotation.y = t * 0.8;
    }
    if (this.chestLid) this.chestLid.rotation.x = run.chestOpen ? -1.9 : 0;
    if (this.sky) this.water.update(t, this.sky.sun, this.sky.hemi);
  }
}
