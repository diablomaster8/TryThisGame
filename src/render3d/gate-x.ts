import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CG2_X } from '../config/tuning';
import { STORY_B } from '../config/tuning-b';
import type { Tex } from '../samples/aaa-kit';
import { bevelBox, buildingMaterial } from './building-kit';

/**
 * Campaign graphics 2, package x (C9): the Grove's gate in Full 3D as a symmetric lychgate,
 * two bevelled posts on stone feet, a tie beam with knee braces, a small pitched roof and
 * two leaves that swing the same way. The frame, roof and fence are one merged mesh and the
 * two leaves one instanced mesh, both on one vertex-coloured wood material: two draws.
 * The ivy (chapters 1 and 2) and the day post (The Hundred Days) are extra meshes shown
 * only when the story asks. The material's occluder fade can be switched off while the
 * gate is what a scene is about (`exempt`).
 */

export interface LychGate {
  group: THREE.Group;
  setOpenness(o: number): void;
  setIvy(on: boolean): void;
  /** The Hundred Days' gate stands with no fence either side. */
  setBare(bare: boolean): void;
  setTally(days: number): void;
  /** 1 lets the occluder thin the gate, 0 keeps it whole (the scene is about it). */
  readonly fade: { value: number };
  dispose(): void;
}

/** Each piece: its geometry, colour and where it goes. */
class Pieces {
  readonly geos: THREE.BufferGeometry[] = [];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly c = new THREE.Color();

  add(
    geo: THREE.BufferGeometry,
    color: string,
    at: { x: number; y: number; z: number },
    rot: [number, number, number] = [0, 0, 0],
  ): void {
    const g = geo.index ? geo.toNonIndexed() : geo;
    if (g !== geo) geo.dispose();
    this.q.setFromEuler(this.e.set(rot[0], rot[1], rot[2]));
    this.m.compose(new THREE.Vector3(at.x, at.y, at.z), this.q, new THREE.Vector3(1, 1, 1));
    g.applyMatrix4(this.m);
    for (const k of Object.keys(g.attributes))
      if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if (!g.attributes.uv) {
      const n = g.attributes.position!.count;
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    }
    this.c.set(color);
    const n = g.attributes.position!.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) col.set([this.c.r, this.c.g, this.c.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.geos.push(g);
  }

  /** The vertex count so far (where the fence starts, for the bare draw range). */
  get count(): number {
    return this.geos.reduce((a, g) => a + g.attributes.position!.count, 0);
  }

  merge(): THREE.BufferGeometry {
    const g = mergeGeometries(this.geos, false)!;
    for (const p of this.geos) p.dispose();
    return g;
  }
}

/** The gate's wood: the kit's toon building program, vertex-coloured, with a fade switch. */
function gateMaterial(tex: Tex, fade: { value: number }): THREE.MeshStandardMaterial {
  const m = buildingMaterial(tex.wood, { color: '#ffffff', normal: 0.45 });
  m.vertexColors = true;
  const base = m.onBeforeCompile.bind(m);
  const key = m.customProgramCacheKey();
  m.onBeforeCompile = (shader, renderer) => {
    base(shader, renderer);
    shader.uniforms.uOccMine = fade;
    shader.fragmentShader = shader.fragmentShader
      .replace('uniform float uOccOn;', 'uniform float uOccOn;\nuniform float uOccMine;')
      .replace('if (uOccOn > 0.5 &&', 'if (uOccOn * uOccMine > 0.5 &&');
  };
  m.customProgramCacheKey = () => `${key}|vc|gate-x`;
  return m;
}

export function buildLychGate(tex: Tex): LychGate {
  const G = CG2_X.gate;
  const C = G.colors;
  const h = G.half;
  const ps = G.post;
  const ph = G.postHeight;
  const fade = { value: 1 };
  const mat = gateMaterial(tex, fade);
  const group = new THREE.Group();
  group.name = 'gate-x';

  // The frame: two posts on stone feet, each capped, a tie beam and two knee braces.
  const fr = new Pieces();
  for (const sx of [-1, 1]) {
    const x = sx * h;
    fr.add(bevelBox(ps + 0.26, 0.34, ps + 0.26, 0.06, 0.9), C.stone, { x, y: 0.1, z: 0 });
    fr.add(bevelBox(ps, ph, ps, 0.06, 1.2), C.timber, { x, y: ph / 2, z: 0 });
    fr.add(bevelBox(ps + 0.1, 0.12, ps + 0.1, 0.03), C.dark, { x, y: ph - 0.62, z: 0 });
    fr.add(
      new THREE.BoxGeometry(0.14, 0.78, 0.14),
      C.dark,
      { x: sx * (h - 0.36), y: ph - 0.5, z: 0 },
      [0, 0, sx * 0.72],
    );
  }
  const span = h * 2 + ps;
  fr.add(bevelBox(span + 0.6, 0.24, 0.34, 0.05, 1.2), C.timber, { x: 0, y: ph - 0.1, z: 0 });
  // A king post from the beam to the ridge, and the gable's two rafters at each end.
  const top = ph + 0.02;
  fr.add(bevelBox(0.16, G.rise, 0.16, 0.03), C.dark, { x: 0, y: top + G.rise / 2, z: 0 });
  const slope = Math.hypot(G.run, G.rise);
  const a = Math.atan2(G.rise, G.run);
  const roofW = span + G.overhang * 2;
  for (const sz of [-1, 1]) {
    // The slope: a board with three shingle courses stepped down it, and a fascia.
    const cz = (sz * G.run) / 2;
    const cy = top + G.rise / 2 + 0.06;
    fr.add(bevelBox(roofW, 0.1, slope + 0.12, 0.03, 1.4), C.roof, { x: 0, y: cy, z: cz }, [
      sz * a,
      0,
      0,
    ]);
    for (let i = 0; i < 3; i++) {
      const t = (i + 0.7) / 3.4;
      fr.add(
        bevelBox(roofW + 0.04, 0.05, 0.08, 0.02),
        C.ridge,
        { x: 0, y: top + G.rise * (1 - t) + 0.13, z: sz * G.run * t },
        [sz * a, 0, 0],
      );
    }
    for (const sx of [-1, 1])
      fr.add(
        bevelBox(0.1, 0.14, slope + 0.1, 0.02),
        C.dark,
        { x: sx * (span / 2 + 0.06), y: cy - 0.08, z: cz },
        [sz * a, 0, 0],
      );
  }
  fr.add(bevelBox(roofW + 0.1, 0.12, 0.16, 0.04), C.ridge, { x: 0, y: top + G.rise + 0.12, z: 0 });
  // The fence either side goes last, so the bare gate is a shorter draw of the same mesh.
  const fenceFrom = fr.count;
  for (const sx of [-1, 1])
    for (let i = 0; i < G.panels; i++) {
      const x0 = sx * (h + ps / 2 + i * G.panel);
      const x1 = sx * (h + ps / 2 + (i + 1) * G.panel);
      fr.add(bevelBox(0.15, 1.05, 0.15, 0.03, 1.2), C.timber, { x: x1, y: 0.52, z: 0 });
      for (const ry of [0.4, 0.8])
        fr.add(bevelBox(G.panel, 0.1, 0.07, 0.02, 1.2), C.plank, { x: (x0 + x1) / 2, y: ry, z: 0 });
    }
  const frame = new THREE.Mesh(fr.merge(), mat);
  const fenceAll = frame.geometry.attributes.position!.count;
  frame.name = 'gate-x-frame';
  frame.castShadow = true;
  frame.receiveShadow = true;
  group.add(frame);

  // A leaf, hinged at x 0 and reaching +x to the middle: stiles, rails, slats and a brace,
  // all centred on z 0, so the right leaf is the same leaf turned half round its hinge.
  const L = h - ps / 2 - 0.05;
  const lh = G.leafHeight;
  const y0 = G.leafFoot;
  const lf = new Pieces();
  for (const sx of [0.06, L - 0.06])
    lf.add(bevelBox(0.12, lh, 0.11, 0.02, 1), C.timber, { x: sx, y: y0 + lh / 2, z: 0 });
  for (const ry of [0.06, lh * 0.5, lh - 0.06])
    lf.add(bevelBox(L, 0.12, 0.12, 0.02, 1.2), C.timber, { x: L / 2, y: y0 + ry, z: 0 });
  const slats = 5;
  for (let i = 0; i < slats; i++)
    lf.add(bevelBox(L / slats - 0.06, lh - 0.12, 0.05, 0.01, 1.2), C.plank, {
      x: 0.14 + ((L - 0.28) * i) / (slats - 1),
      y: y0 + lh / 2,
      z: 0,
    });
  const diag = Math.hypot(L - 0.2, lh * 0.5 - 0.12);
  lf.add(
    new THREE.BoxGeometry(diag, 0.1, 0.13),
    C.dark,
    { x: L / 2, y: y0 + lh * 0.75 - 0.03, z: 0 },
    [0, 0, -Math.atan2(lh * 0.5 - 0.12, L - 0.2)],
  );
  // A pointed top on each leaf, rising to the meeting stile.
  lf.add(bevelBox(0.12, 0.3, 0.11, 0.02), C.timber, { x: L - 0.06, y: y0 + lh + 0.12, z: 0 });
  const leaves = new THREE.InstancedMesh(lf.merge(), mat, 2);
  leaves.name = 'gate-x-leaves';
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  group.add(leaves);
  const hinge = h - ps / 2 - 0.02;
  const tmp = new THREE.Object3D();
  const setOpenness = (o: number): void => {
    const turn = Math.max(0, Math.min(1, o)) * G.swing;
    tmp.position.set(-hinge, 0, 0);
    tmp.rotation.set(0, turn, 0);
    tmp.updateMatrix();
    leaves.setMatrixAt(0, tmp.matrix);
    tmp.position.set(hinge, 0, 0);
    tmp.rotation.set(0, Math.PI - turn, 0);
    tmp.updateMatrix();
    leaves.setMatrixAt(1, tmp.matrix);
    leaves.instanceMatrix.needsUpdate = true;
    leaves.computeBoundingSphere();
  };
  setOpenness(0);

  // The ivy: leaf cards up both posts, along the beam and over the fence.
  const ivy = ivyMesh(h, ps, ph);
  ivy.visible = false;
  group.add(ivy);

  // The day post: a light board on the left post's lane face, strokes in tally groups.
  const boardMat = new THREE.MeshStandardMaterial({ color: '#c9a77a', roughness: 0.9 });
  const tallyMat = new THREE.MeshBasicMaterial({ color: '#2b1a10' });
  const board = new THREE.Mesh(bevelBox(0.3, 0.86, 0.04, 0.015), boardMat);
  board.position.set(-h, 1.05, ps / 2 + 0.02);
  board.visible = false;
  group.add(board);
  let tally: THREE.Mesh | null = null;

  return {
    group,
    fade,
    setOpenness,
    setIvy(on) {
      ivy.visible = on;
    },
    setBare(bare) {
      frame.geometry.setDrawRange(0, bare ? fenceFrom : fenceAll);
    },
    setTally(days) {
      if (tally) {
        group.remove(tally);
        tally.geometry.dispose();
        tally = null;
      }
      board.visible = days > 0;
      if (days <= 0) return;
      const per = STORY_B.tally.perGroup;
      const geos: THREE.BufferGeometry[] = [];
      for (let gi = 0; gi < Math.ceil(days / per); gi++) {
        const gx = -h - 0.095 + (gi % 3) * 0.095;
        const gy = 1.42 - Math.floor(gi / 3) * 0.105;
        const n = Math.min(per, days - gi * per);
        for (let s = 0; s < Math.min(4, n); s++)
          geos.push(
            new THREE.BoxGeometry(0.009, 0.08, 0.012).translate(
              gx - 0.025 + s * 0.017,
              gy,
              ps / 2 + 0.045,
            ),
          );
        if (n === 5)
          geos.push(
            new THREE.BoxGeometry(0.1, 0.009, 0.012).rotateZ(-0.7).translate(gx, gy, ps / 2 + 0.05),
          );
      }
      tally = new THREE.Mesh(mergeGeometries(geos, false)!, tallyMat);
      for (const g of geos) g.dispose();
      group.add(tally);
    },
    dispose() {
      frame.geometry.dispose();
      leaves.geometry.dispose();
      leaves.dispose();
      ivy.geometry.dispose();
      (ivy.material as THREE.Material).dispose();
      board.geometry.dispose();
      boardMat.dispose();
      tallyMat.dispose();
      tally?.geometry.dispose();
      mat.dispose();
    },
  };
}

/** Seeded leaf cards (a fixed pattern; no randomness at run time). */
function ivyMesh(h: number, ps: number, ph: number): THREE.Mesh {
  let s = 4417;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const greens = ['#3f6a2f', '#4f7f3a', '#668f43', '#2f5a30'].map((c) => new THREE.Color(c));
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const card = (x: number, y: number, z: number, size: number, tall: number) => {
    const g = new THREE.PlaneGeometry(0.1 * size, 0.1 * size * tall).toNonIndexed();
    g.rotateZ((rnd() - 0.5) * 2.2);
    g.rotateY((rnd() - 0.5) * 2.4);
    g.translate(x, y, z);
    const c = greens[Math.floor(rnd() * greens.length)]!;
    pos.push(...(g.attributes.position!.array as Float32Array));
    nor.push(...(g.attributes.normal!.array as Float32Array));
    for (let i = 0; i < g.attributes.position!.count; i++) col.push(c.r, c.g, c.b);
    g.dispose();
  };
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 64; i++) {
      const t = Math.pow(rnd(), 1.4);
      const side = Math.floor(rnd() * 4);
      const o = ps / 2 + 0.03;
      const u = (rnd() - 0.5) * ps;
      const x = sx * h + (side < 2 ? (side ? o : -o) : u);
      const z = side >= 2 ? (side === 2 ? o : -o) : u;
      card(
        x,
        0.1 + t * (ph - 0.2) * (sx < 0 ? 1 : 0.8),
        z,
        1.6 + rnd() * 2.2,
        rnd() < 0.3 ? 2.6 : 1,
      );
    }
    for (let i = 0; i < 22; i++)
      card(
        sx * (h - 0.1 - rnd() * 1.1),
        ph - 0.12 - rnd() * 0.14,
        (rnd() - 0.5) * 0.36,
        1.8 + rnd() * 1.6,
        rnd() < 0.4 ? 3 : 1,
      );
    for (let i = 0; i < 16; i++)
      card(
        sx * (h + 0.3 + rnd() * 1.6),
        0.3 + rnd() * 0.7,
        (rnd() - 0.5) * 0.2,
        1.6 + rnd() * 1.4,
        1,
      );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.9,
      flatShading: true,
    }),
  );
  mesh.name = 'gate-x-ivy';
  mesh.castShadow = true;
  return mesh;
}
