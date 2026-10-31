import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { cellCentre, exploredRooms, type Floor } from '../sim/dungeon';
import { lootHeld } from '../sim/dungeon-secrets';
import { caveShed } from './cave-shed';
import {
  CELL,
  disposeObjects,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';

/**
 * Readability overlay for the Hollow (items 25 and 40): a soft additive halo with a short
 * light shaft over every piece of loot still lying about, so it pops out of the dark, and a
 * faint glow on the floor of every room the Keeper has seen. It reads the run's `taken` ids
 * and explored mask only; it never touches the loot meshes themselves (`hollow-dress.ts`).
 * Two instanced meshes, so two draw calls. The loot sways gently up and down, and holds
 * still under reduced motion.
 */

/** A ground disc and an open shaft in one geometry, fading to black (additive: black is clear). */
function haloGeometry(radius: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const seg = 16;
  const add = (x: number, y: number, z: number, v: number) => {
    pos.push(x, y, z);
    col.push(v, v, v);
  };
  add(0, 0, 0, 1);
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    add(Math.cos(a) * radius, 0, Math.sin(a) * radius, 0);
  }
  for (let i = 0; i < seg; i++) idx.push(0, 1 + i, 1 + ((i + 1) % seg));
  // The shaft: narrow, bright at the foot, gone at the top.
  const base = pos.length / 3;
  const sr = radius * 0.22;
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    add(Math.cos(a) * sr, 0, Math.sin(a) * sr, 0.7);
    add(Math.cos(a) * sr * 0.6, 1.1, Math.sin(a) * sr * 0.6, 0);
  }
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    const a = base + i * 2;
    const b = base + j * 2;
    idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  return g;
}

const additive = (color: string, opacity: number): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
    side: THREE.DoubleSide,
    fog: false,
  });

export class HollowPop implements HollowModule {
  private floor: Floor | null = null;
  private loot: THREE.InstancedMesh | null = null;
  private rooms: THREE.InstancedMesh | null = null;
  private readonly objs: THREE.Object3D[] = [];
  private ctx: HollowCtx | null = null;
  private glow: number[] = [];
  private roomY: number[] = [];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  private readonly c = new THREE.Color();
  private lootPos: Array<{ x: number; z: number; y: number; id: string; h: number }> = [];
  private seen = '\u0000';
  private shed = false;
  private unshed: (() => void) | null = null;

  build(f: Floor, ctx: HollowCtx): void {
    const r = GROVE3D.cave.read;
    this.floor = f;
    this.ctx = ctx;
    this.seen = '\u0000';
    this.lootPos = f.loot.map((l) => {
      const at = cellCentre(f, l.cell);
      return {
        x: at.x,
        z: at.z,
        y: f.elevation[l.cell.y * f.cols + l.cell.x] ?? 0,
        id: l.id,
        h: (l.cell.x * 7 + l.cell.y * 13) % 11,
      };
    });
    const loot = new THREE.InstancedMesh(
      haloGeometry(r.loot.radius),
      additive(r.loot.color, r.loot.opacity),
      Math.max(1, this.lootPos.length),
    );
    loot.count = this.lootPos.length;
    loot.frustumCulled = false;
    loot.renderOrder = 4;
    loot.name = 'hollow-loot-halo';

    const plane = new THREE.PlaneGeometry(1, 1);
    plane.rotateX(-Math.PI / 2);
    const colors = new Float32Array(4 * 3).fill(1);
    plane.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const rooms = new THREE.InstancedMesh(
      plane,
      additive(r.roomGlow.color, r.roomGlow.opacity),
      Math.max(1, f.rooms.length),
    );
    rooms.count = f.rooms.length;
    rooms.frustumCulled = false;
    rooms.renderOrder = 3;
    rooms.name = 'hollow-room-glow';
    this.glow = f.rooms.map(() => 0);
    this.roomY = f.rooms.map((rm) => {
      let top = 0;
      for (let y = rm.y; y < rm.y + rm.h; y++)
        for (let x = rm.x; x < rm.x + rm.w; x++)
          top = Math.max(top, f.elevation[y * f.cols + x] ?? 0);
      return top + r.roomGlow.lift;
    });
    f.rooms.forEach((rm, i) => {
      const at = cellCentre(f, { x: rm.x + (rm.w - 1) / 2, y: rm.y + (rm.h - 1) / 2 });
      this.m.compose(
        this.p.set(at.x, this.roomY[i]!, at.z),
        this.q.identity(),
        this.s.set(rm.w * CELL, 1, rm.h * CELL),
      );
      rooms.setMatrixAt(i, this.m);
      rooms.setColorAt(i, this.c.setScalar(0));
    });
    this.loot = loot;
    this.rooms = rooms;
    ctx.group.add(loot, rooms);
    this.unshed = caveShed.register({
      name: 'particles',
      apply: (s) => {
        this.shed = s;
        rooms.visible = !s;
      },
    });
    this.objs.push(loot, rooms);
  }

  dispose(): void {
    this.unshed?.();
    this.unshed = null;
    for (const o of this.objs) ((o as THREE.InstancedMesh).material as THREE.Material).dispose();
    disposeObjects(this.objs);
    this.loot = this.rooms = null;
    this.floor = null;
    this.ctx = null;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const f = this.floor;
    const run = fr.run;
    if (!f || !run || !this.loot || !this.rooms) return;
    const r = GROVE3D.cave.read;
    const calm = this.ctx?.reduceMotion ?? false;
    const taken = run.taken;
    this.loot.visible = this.lootPos.length > 0;
    this.lootPos.forEach((l, i) => {
      const gone = taken.includes(l.id) || lootHeld(run, f, l.id);
      const bob =
        calm || this.shed ? 0 : Math.sin(t * r.loot.bobHz * Math.PI * 2 + l.h) * r.loot.bob;
      this.m.compose(
        this.p.set(l.x, l.y + r.loot.lift + bob, l.z),
        this.q.identity(),
        this.s.setScalar(gone ? 0 : 1),
      );
      this.loot!.setMatrixAt(i, this.m);
    });
    this.loot.instanceMatrix.needsUpdate = true;
    // Rooms ease in as they are seen (re-read only when the explored string changed).
    if (run.explored !== this.seen) {
      this.seen = run.explored;
      this.seenRooms = exploredRooms(run, f);
    }
    let dirty = false;
    for (let i = 0; i < this.glow.length; i++) {
      const goal = this.seenRooms[i] ? 1 : 0;
      const g = this.glow[i]!;
      if (g === goal) continue;
      const n = calm ? goal : g + Math.sign(goal - g) * Math.min(Math.abs(goal - g), 0.03);
      this.glow[i] = n;
      this.rooms.setColorAt(i, this.c.setScalar(n));
      dirty = true;
    }
    if (dirty && this.rooms.instanceColor) this.rooms.instanceColor.needsUpdate = true;
  }

  private seenRooms: boolean[] = [];
}
