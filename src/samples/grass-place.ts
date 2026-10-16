import * as THREE from 'three';

/**
 * Where the instanced grass goes: a seeded scatter over a square, tested tuft by tuft
 * against the ground. Pure (three's maths only, no DOM), so the Full 3D Grove runs it in
 * a worker (`render3d/grass-worker.ts`) and the AAA sample runs it on the page; both get
 * the same matrices for the same field.
 */

/** Where grass may grow: ground height, the half-size of the square, its centre, and a test a tuft must pass. */
export interface GrassField {
  ground: (x: number, z: number) => number;
  half: number;
  centreZ: number;
  allow: (x: number, z: number, y: number) => boolean;
  count: number;
}

/** The two crossed passes of tufts: per pass, `count` 4×4 matrices and RGB colours. */
export interface GrassPlacement {
  matrices: Float32Array[];
  colours: Float32Array[];
}

export function placeGrass(field: GrassField): GrassPlacement {
  const count = field.count;
  const out: GrassPlacement = { matrices: [], colours: [] };
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();
  for (let pass = 0; pass < 2; pass++) {
    const matrices = new Float32Array(count * 16);
    const colours = new Float32Array(count * 3);
    let placed = 0;
    seed = 11 + pass * 977;
    while (placed < count) {
      const x = (rnd() - 0.5) * field.half * 2;
      const z = (rnd() - 0.5) * field.half * 2 + field.centreZ;
      const y = field.ground(x, z);
      if (!field.allow(x, z, y)) continue;
      p.set(x, y - 0.03, z);
      q.setFromAxisAngle(up, rnd() * Math.PI + pass * (Math.PI / 2));
      const sc = 0.7 + rnd() * 0.8;
      s.set(sc, sc * (0.8 + rnd() * 0.5), sc);
      m.compose(p, q, s);
      m.toArray(matrices, placed * 16);
      col.setHSL(0.26 + rnd() * 0.06, 0.55 + rnd() * 0.3, 0.42 + rnd() * 0.18);
      col.toArray(colours, placed * 3);
      placed++;
    }
    out.matrices.push(matrices);
    out.colours.push(colours);
  }
  return out;
}
