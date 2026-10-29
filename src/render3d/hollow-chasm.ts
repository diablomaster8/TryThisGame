import * as THREE from 'three';
import { cellAt, CHASM, type Floor } from '../sim/dungeon';
import { CELL, disposeObjects, mat, type HollowCtx, type HollowModule } from './hollow-ctx';

/**
 * The Hollow's chasm cells in Full 3D (R0031): the floor mesh leaves a hole over each one
 * (`hollow-rock.ts`), and this draws the pit under it: dark rock sides dropping to a soft blue
 * glow, never black, so a gap reads as "jump here" and stays kid-friendly. One merged mesh for
 * the sides and one for the glow, so a floor with gaps adds two draw calls.
 */
export class HollowChasm implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private readonly side = mat('#2e2b3a', { roughness: 0.95 });
  private readonly glow = mat('#4f86c6', {
    emissive: new THREE.Color('#3f7fd0'),
    emissiveIntensity: 0.85,
    roughness: 1,
  });

  build(f: Floor, ctx: HollowCtx): void {
    const sides: number[] = [];
    const bottom: number[] = [];
    // Counter-clockwise from above for the glow; the sides are listed the other way round.
    const quad = (out: number[], a: number[], b: number[], c: number[], d: number[]) =>
      out === bottom
        ? out.push(...a, ...c, ...b, ...b, ...c, ...d)
        : out.push(...a, ...b, ...c, ...b, ...d, ...c);
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (cellAt(f, x, y) !== CHASM) continue;
        const top = f.elevation[y * f.cols + x] ?? 0;
        const low = top - DEPTH;
        const x0 = (x - f.cols / 2) * CELL;
        const z0 = (y - f.rows / 2) * CELL;
        const x1 = x0 + CELL;
        const z1 = z0 + CELL;
        quad(bottom, [x0, low, z0], [x1, low, z0], [x0, low, z1], [x1, low, z1]);
        // A side wall on every edge that borders anything but more chasm, facing inward.
        if (cellAt(f, x, y - 1) !== CHASM)
          quad(sides, [x1, top, z0], [x0, top, z0], [x1, low, z0], [x0, low, z0]);
        if (cellAt(f, x, y + 1) !== CHASM)
          quad(sides, [x0, top, z1], [x1, top, z1], [x0, low, z1], [x1, low, z1]);
        if (cellAt(f, x - 1, y) !== CHASM)
          quad(sides, [x0, top, z0], [x0, top, z1], [x0, low, z0], [x0, low, z1]);
        if (cellAt(f, x + 1, y) !== CHASM)
          quad(sides, [x1, top, z1], [x1, top, z0], [x1, low, z1], [x1, low, z0]);
      }
    if (bottom.length === 0) return;
    for (const [data, m] of [
      [sides, this.side],
      [bottom, this.glow],
    ] as const) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
      g.computeVertexNormals();
      const mesh = new THREE.Mesh(g, m);
      mesh.name = 'hollow-chasm';
      mesh.receiveShadow = true;
      ctx.group.add(mesh);
      this.objs.push(mesh);
    }
  }

  dispose(): void {
    disposeObjects(this.objs);
  }
}

/** How far a chasm drops below the ground round it, in world units. */
const DEPTH = 2.2;
