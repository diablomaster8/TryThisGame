import * as THREE from 'three';
import { cellAt, CHASM, type Floor } from '../sim/dungeon';
import { assistBridges } from '../sim/dungeon-falls';
import { CELL, disposeObjects, mat, type HollowCtx, type HollowModule } from './hollow-ctx';

/**
 * The sprout leaf-bridge in Full 3D (R0025, round 12): after two falls into the same gap a
 * deck of green leaves grows across it. The sim says which cells (`assistBridges`); this
 * module watches that list and lays a slab of overlapping leaf strips over each cell at the
 * lip's height, so the pit's hole is covered and the way reads as "walk here". It adds one
 * merged mesh per change, and nothing when no bridge has grown.
 */
export class HollowLeafBridge implements HollowModule {
  private floor: Floor | null = null;
  private ctx: HollowCtx | null = null;
  private shown = -1;
  private readonly objs: THREE.Object3D[] = [];
  private readonly leaf = mat('#ffffff', { roughness: 0.9, flatShading: true, vertexColors: true });

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = f;
    this.ctx = ctx;
    this.shown = -1;
    this.sync();
  }

  update(): void {
    this.sync();
  }

  private sync(): void {
    const f = this.floor;
    if (!f || !this.ctx) return;
    const cells = assistBridges(f).filter((c) => cellAt(f, c.x, c.y) === CHASM);
    if (cells.length === this.shown) return;
    this.shown = cells.length;
    disposeObjects(this.objs.splice(0));
    if (!cells.length) return;
    const pos: number[] = [];
    const col: number[] = [];
    const light = new THREE.Color('#8ad468');
    const dark = new THREE.Color('#4f9a48');
    // Six strips across each cell, alternating shade, the top a hair above the lip.
    for (const c of cells) {
      const top = (f.elevation[c.y * f.cols + c.x] ?? 0) + 0.03;
      const x0 = (c.x - f.cols / 2) * CELL;
      const z0 = (c.y - f.rows / 2) * CELL;
      const n = 6;
      for (let i = 0; i < n; i++) {
        const a = x0 + (CELL * i) / n + 0.02;
        const b = x0 + (CELL * (i + 1)) / n - 0.02;
        const lift = (i % 2) * 0.015;
        pos.push(a, top + lift, z0, a, top + lift, z0 + CELL, b, top + lift, z0);
        pos.push(b, top + lift, z0, a, top + lift, z0 + CELL, b, top + lift, z0 + CELL);
        const k = i % 2 ? dark : light;
        for (let v = 0; v < 6; v++) col.push(k.r, k.g, k.b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    const mesh = new THREE.Mesh(g, this.leaf);
    mesh.name = 'hollow-leaf-bridge';
    mesh.receiveShadow = true;
    this.ctx.group.add(mesh);
    this.objs.push(mesh);
  }

  dispose(): void {
    disposeObjects(this.objs.splice(0));
    this.floor = null;
    this.ctx = null;
  }
}
