import * as THREE from 'three';
import { SIM } from '../config/tuning';
import { WORLD_STREAM } from '../config/tuning-world';
import { groveHeight } from '../sim/terrain';

/**
 * R0104 (WORLD-46): the debug chunk grid. The 16 u streaming chunks drawn as lines laid over
 * the Grove's ground in either renderer's scene (both are three.js scenes), with the chunk
 * the Keeper stands in outlined brighter, so a chunk readout can be matched to a place.
 * Built once per scene; dev-only, toggled from the debug panel's World row. Reads nothing
 * from the sim but the Keeper's position.
 */
const LIFT = 0.12;
const STEP = 1;

export class ChunkGrid {
  readonly group = new THREE.Group();
  private readonly here: THREE.LineLoop;

  constructor() {
    this.group.name = 'debug-chunk-grid';
    const size = WORLD_STREAM.chunk;
    const half = Math.ceil(SIM.worldHalf / size) * size;
    const pts: number[] = [];
    // Each grid line follows the ground in short straight pieces.
    for (let a = -half; a <= half; a += size) {
      for (let b = -half; b < half; b += STEP) {
        pts.push(a, groveHeight(a, b) + LIFT, b, a, groveHeight(a, b + STEP) + LIFT, b + STEP);
        pts.push(b, groveHeight(b, a) + LIFT, a, b + STEP, groveHeight(b + STEP, a) + LIFT, a);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0x66e0ff, transparent: true, opacity: 0.7 }),
    );
    const loop = new THREE.BufferGeometry();
    loop.setAttribute('position', new THREE.Float32BufferAttribute(new Array(12).fill(0), 3));
    this.here = new THREE.LineLoop(
      loop,
      new THREE.LineBasicMaterial({ color: 0xffe066, depthTest: false }),
    );
    this.here.renderOrder = 10;
    this.group.add(lines, this.here);
  }

  /** Outline the chunk under (x, z). */
  mark(x: number, z: number): void {
    const s = WORLD_STREAM.chunk;
    const x0 = Math.floor(x / s) * s;
    const z0 = Math.floor(z / s) * s;
    const p = this.here.geometry.getAttribute('position') as THREE.BufferAttribute;
    const corners: Array<[number, number]> = [
      [x0, z0],
      [x0 + s, z0],
      [x0 + s, z0 + s],
      [x0, z0 + s],
    ];
    corners.forEach(([cx, cz], i) => p.setXYZ(i, cx, groveHeight(cx, cz) + LIFT * 2, cz));
    p.needsUpdate = true;
  }

  dispose(): void {
    this.group.removeFromParent();
    this.group.traverse((o) => {
      if (o instanceof THREE.Line) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  }
}
