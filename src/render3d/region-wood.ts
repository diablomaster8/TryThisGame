import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { LayoutChunk, RegionLayout } from '../config/region-layout';
import { WOOD_POIS } from '../config/region-wood';
import type { ChunkLRU } from '../render/chunks';
import { dappleMarks } from '../render/paint/wood';
import { groundSize, groundTexture, paintRegionGround, WOOD_GROUND } from '../render/region-ground';
import type { Region3d } from './region-host';
import type { Vec2 } from '../sim/types';

/**
 * WORLD-25 (R11 lane D): the Wood in Full 3D, a lazy chunk the region host loads on the
 * approach (`region-host.ts`). Few draws whatever is in view: the painted ground (the pixel
 * view's own canvas, so both renderers show the same wood), a dapple cookie drifting over it,
 * three instanced tree batches (two broadleaf crowns and a pine, each trunk and crown merged
 * into one vertex-coloured mesh), a grass-tuft batch, a prop batch and one merged mesh for the
 * landmarks (the Wishing Oak, the mill and its wheel, the hollow tree, the vine wall, the
 * lookout). The batches hold only the chunks the host hands them; the instance data of each
 * chunk is cached in the host's LRU. Shared toon-free standard materials, flat-shaded, so the
 * programs are the few the host links on the approach (WORLD-68).
 */

const BARK = new THREE.Color('#6b4a2e');
const LEAVES = ['#2f6b3a', '#3d7d3c', '#24563c'].map((c) => new THREE.Color(c));
const STONE = new THREE.Color('#9c968a');
const ROOF = new THREE.Color('#7a3b2a');
const PLANK = new THREE.Color('#a8743e');
const VINE = new THREE.Color('#4f8a34');
const TUFT = new THREE.Color('#5d9a3c');

/** Paint a geometry one colour (as a vertex attribute) and make it non-indexed for merging. */
function tinted(g: THREE.BufferGeometry, c: THREE.Color, jitter = 0): THREE.BufferGeometry {
  const out = g.index ? g.toNonIndexed() : g;
  const n = out.attributes.position!.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const f = 1 + (jitter ? (((i * 7919) % 13) / 13 - 0.5) * jitter : 0);
    col[i * 3] = c.r * f;
    col[i * 3 + 1] = c.g * f;
    col[i * 3 + 2] = c.b * f;
  }
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.deleteAttribute('uv');
  return out;
}

function at(g: THREE.BufferGeometry, x: number, y: number, z: number): THREE.BufferGeometry {
  g.translate(x, y, z);
  return g;
}

function merged(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts)!;
  g.computeVertexNormals();
  g.computeBoundingSphere();
  for (const p of parts) p.dispose();
  return g;
}

function broadleaf(kind: number): THREE.BufferGeometry {
  const leaf = LEAVES[kind]!;
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.2, 0.3, 2.4, 6), 0, 1.2, 0), BARK),
    tinted(at(new THREE.IcosahedronGeometry(1.7, 1), 0, 3.2, 0), leaf, 0.25),
    tinted(
      at(new THREE.IcosahedronGeometry(1.1, 0), 0.8, 2.7, 0.5),
      leaf.clone().multiplyScalar(1.15),
    ),
  ]);
}

function pine(): THREE.BufferGeometry {
  const leaf = LEAVES[2]!;
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.15, 0.25, 1.6, 6), 0, 0.8, 0), BARK),
    tinted(at(new THREE.ConeGeometry(1.5, 2.2, 7), 0, 2.0, 0), leaf),
    tinted(at(new THREE.ConeGeometry(1.15, 1.9, 7), 0, 3.0, 0), leaf.clone().multiplyScalar(1.1)),
    tinted(at(new THREE.ConeGeometry(0.75, 1.5, 7), 0, 3.9, 0), leaf.clone().multiplyScalar(1.2)),
  ]);
}

function tuft(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const p: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const cx = Math.cos(a) * 0.12;
    const cz = Math.sin(a) * 0.12;
    const lx = Math.cos(a + 1.6) * 0.09;
    const lz = Math.sin(a + 1.6) * 0.09;
    p.push(cx - lx, 0, cz - lz, cx + lx, 0, cz + lz, cx * 2.2, 0.55, cz * 2.2);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return merged([tinted(g, TUFT)]);
}

function prop(): THREE.BufferGeometry {
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.42, 0.5, 0.45, 7), 0, 0.22, 0), BARK),
    tinted(
      at(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 7), 0, 0.46, 0),
      new THREE.Color('#d9a76a'),
    ),
  ]);
}

/** The landmarks the Wood stands on its points of interest, merged into one mesh. */
function landmarks(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const poi = (id: string) => WOOD_POIS.find((p) => p.id === id)!;
  const oak = poi('old-oak');
  parts.push(tinted(at(new THREE.CylinderGeometry(0.8, 1.2, 4.2, 9), oak.x, 2.1, oak.z - 1), BARK));
  for (const [dx, dy, dz, r] of [
    [-1.8, 4.6, 0, 2.6],
    [1.9, 4.8, -0.4, 2.6],
    [0, 5.8, -1, 3],
  ] as const)
    parts.push(
      tinted(
        at(new THREE.IcosahedronGeometry(r, 1), oak.x + dx, dy, oak.z - 1 + dz),
        LEAVES[0]!,
        0.2,
      ),
    );
  const mill = poi('old-mill');
  const mx = mill.x - 2;
  const mz = mill.z - 2;
  parts.push(tinted(at(new THREE.BoxGeometry(4.4, 3, 4), mx, 1.5, mz), STONE, 0.1));
  const roof = new THREE.ConeGeometry(3.4, 2.2, 4);
  roof.rotateY(Math.PI / 4);
  parts.push(tinted(at(roof, mx, 4.1, mz), ROOF));
  const wheel = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 12);
  wheel.rotateZ(Math.PI / 2);
  parts.push(tinted(at(wheel, mx + 2.5, 1.6, mz), PLANK));
  const hollow = poi('hollow-tree');
  parts.push(tinted(at(new THREE.CylinderGeometry(0.9, 1.2, 3, 8), hollow.x, 1.5, hollow.z), BARK));
  parts.push(
    tinted(at(new THREE.IcosahedronGeometry(2, 1), hollow.x, 4, hollow.z), LEAVES[1]!, 0.2),
  );
  const vines = poi('vine-wall');
  parts.push(tinted(at(new THREE.BoxGeometry(4, 1.8, 0.8), vines.x, 0.9, vines.z), STONE));
  parts.push(tinted(at(new THREE.BoxGeometry(4.1, 1.5, 0.9), vines.x, 1, vines.z), VINE, 0.3));
  const look = poi('lookout');
  for (const [dx, dz] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ] as const)
    parts.push(tinted(at(new THREE.BoxGeometry(0.2, 3, 0.2), look.x + dx, 1.5, look.z + dz), BARK));
  parts.push(tinted(at(new THREE.BoxGeometry(2.6, 0.2, 2.6), look.x, 3, look.z), PLANK));
  return merged(parts);
}

/** The tree tunnel: two leaning trunks under one crown, the way dark beyond. */
function arch(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const s of [-1, 1]) {
    const t = new THREE.CylinderGeometry(0.35, 0.55, 4.6, 7);
    t.rotateZ(s * 0.25);
    parts.push(tinted(at(t, s * 2.6, 2.2, 0), BARK));
    parts.push(tinted(at(new THREE.IcosahedronGeometry(2, 1), s * 2, 4.6, 0), LEAVES[0]!, 0.25));
  }
  parts.push(tinted(at(new THREE.IcosahedronGeometry(2.2, 1), 0, 5.4, 0), LEAVES[1]!, 0.25));
  const dark = new THREE.CircleGeometry(2, 12);
  parts.push(tinted(at(dark, 0, 1.8, -0.6), new THREE.Color('#0e1a10')));
  return merged(parts);
}

let shared: { mat: THREE.MeshStandardMaterial; arch: THREE.Mesh } | null = null;

function sharedParts(): { mat: THREE.MeshStandardMaterial; arch: THREE.Mesh } {
  if (shared) return shared;
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const a = new THREE.Mesh(arch(), mat);
  a.castShadow = true;
  a.name = 'wood-arch';
  shared = { mat, arch: a };
  return shared;
}

/** How close (crown radii at scale 1) a tree may stand to the camera's line to the Keeper. */
const CLEAR_R = 2.3;
/** The rotation-scale part of an instance matrix: zeroed, the tree folds to a point. */
const FOLD = [0, 1, 2, 4, 5, 6, 8, 9, 10];

/** The batches, in the order a chunk's cached instance data lists them. */
const BATCHES = 5;
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

class Wood3d implements Region3d {
  readonly group = new THREE.Group();
  private readonly batches: THREE.InstancedMesh[] = [];
  private readonly dapple: THREE.Mesh;
  private readonly dappleTex: THREE.CanvasTexture;
  private readonly groundTex: THREE.CanvasTexture;
  private readonly owned: THREE.BufferGeometry[] = [];
  private readonly mats: THREE.Material[] = [];

  constructor(private readonly l: RegionLayout) {
    this.group.name = 'region-wood';
    const { mat } = sharedParts();
    this.groundTex = groundTexture(paintRegionGround(l, WOOD_GROUND, false));
    const gg = new THREE.PlaneGeometry(groundSize(l).w, groundSize(l).h);
    gg.rotateX(-Math.PI / 2);
    const gm = new THREE.MeshStandardMaterial({ map: this.groundTex, roughness: 1, metalness: 0 });
    const ground = new THREE.Mesh(gg, gm);
    ground.receiveShadow = true;
    ground.name = 'wood-ground';
    ground.userData.pick = { kind: 'ground', id: 'ground' };
    this.group.add(ground);
    this.owned.push(gg);
    this.mats.push(gm);
    // The dapple: soft dark pools drifting slowly over the ground, the canopy's shade.
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = 'rgba(8, 20, 6, 0.32)';
    for (const m of dappleMarks(256, 256, 3)) {
      g.beginPath();
      g.ellipse(m.x, m.y, m.r * 1.6, m.r * 1.1, 0, 0, Math.PI * 2);
      g.fill();
    }
    this.dappleTex = new THREE.CanvasTexture(c);
    this.dappleTex.wrapS = this.dappleTex.wrapT = THREE.RepeatWrapping;
    this.dappleTex.repeat.set(l.spec.size.w / 24, l.spec.size.h / 24);
    const dm = new THREE.MeshBasicMaterial({
      map: this.dappleTex,
      transparent: true,
      depthWrite: false,
    });
    const dg = new THREE.PlaneGeometry(groundSize(l).w, groundSize(l).h);
    dg.rotateX(-Math.PI / 2);
    this.dapple = new THREE.Mesh(dg, dm);
    this.dapple.position.y = 0.05;
    this.dapple.renderOrder = 1;
    this.group.add(this.dapple);
    this.owned.push(dg);
    this.mats.push(dm);
    // The instanced batches, sized for the most any active ring can hold.
    const cap = [0, 0, 0];
    for (const t of l.trees) cap[t.kind]!++;
    const geos = [broadleaf(0), broadleaf(1), pine(), tuft(), prop()];
    const caps = [...cap, l.chunks.size * 64, Math.max(1, l.props.length)];
    geos.forEach((geo, i) => {
      const m = new THREE.InstancedMesh(geo, mat, Math.max(1, caps[i]!));
      m.count = 0;
      m.castShadow = i < 3;
      m.receiveShadow = i >= 3;
      m.frustumCulled = false;
      m.name = `wood-batch-${i}`;
      this.batches.push(m);
      this.group.add(m);
      this.owned.push(geo);
    });
    const lm = new THREE.Mesh(landmarks(), mat);
    lm.castShadow = true;
    lm.receiveShadow = true;
    lm.name = 'wood-landmarks';
    this.group.add(lm);
    this.owned.push(lm.geometry);
  }

  /** One chunk's instance matrices per batch (cached by the host). */
  private build(c: LayoutChunk, clip: boolean): Float32Array[] {
    const lists: number[][] = Array.from({ length: BATCHES }, () => []);
    const hw = this.l.spec.size.w / 2;
    const hh = this.l.spec.size.h / 2;
    const put = (b: number, x: number, z: number, s: number, yaw: number) => {
      if (clip && (Math.abs(x) > hw || Math.abs(z) > hh)) return;
      tmpP.set(x, 0, z);
      tmpQ.setFromAxisAngle(UP, yaw);
      tmpS.setScalar(s);
      tmpM.compose(tmpP, tmpQ, tmpS);
      lists[b]!.push(...tmpM.elements);
    };
    for (const i of c.trees) {
      const t = this.l.trees[i]!;
      put(t.kind, t.x, t.z, t.s, (i * 2.399) % (Math.PI * 2));
    }
    for (let i = 0; i < c.tufts.length; i += 3)
      put(3, c.tufts[i]!, c.tufts[i + 1]!, c.tufts[i + 2]!, i);
    for (const i of c.props) {
      const p = this.l.props[i]!;
      put(4, p.x, p.z, 0.8 + (p.kind % 3) * 0.2, i);
    }
    return lists.map((l) => new Float32Array(l));
  }

  setChunks(chunks: readonly LayoutChunk[], cache: ChunkLRU<Float32Array[]>, clip: boolean): void {
    const counts = new Array<number>(BATCHES).fill(0);
    for (const c of chunks) {
      const key = `${c.cx},${c.cz}${clip ? 'c' : ''}`;
      let data = cache.get(key);
      if (!data) {
        data = this.build(c, clip);
        cache.set(
          key,
          data,
          data.reduce((n, a) => n + a.byteLength, 0),
        );
      }
      data.forEach((arr, b) => {
        const m = this.batches[b]!;
        const n = arr.length / 16;
        if (counts[b]! + n > m.instanceMatrix.count) return;
        (m.instanceMatrix.array as Float32Array).set(arr, counts[b]! * 16);
        counts[b]! += n;
      });
    }
    this.batches.forEach((m, b) => {
      m.count = counts[b]!;
      m.instanceMatrix.clearUpdateRanges();
      m.instanceMatrix.addUpdateRange(0, counts[b]! * 16);
      m.instanceMatrix.needsUpdate = true;
      if (b < 3) {
        // The trees' own matrices, to put back what `clearView` folds away.
        const a = m.instanceMatrix.array as Float32Array;
        this.orig[b] = a.slice(0, counts[b]! * 16);
        this.hidden[b] = new Uint8Array(counts[b]!);
      }
    });
  }

  /** The tree batches' matrices as filled, and which trees stand folded out of the way. */
  private readonly orig: Float32Array[] = [];
  private readonly hidden: Uint8Array[] = [];

  tick(t: number, still: boolean, cam: THREE.Vector3, keeper: Vec2): void {
    this.clearView(cam, keeper);
    if (still) return;
    this.dappleTex.offset.set((t * 0.004) % 1, (t * 0.0025) % 1);
  }

  /**
   * Keep the Keeper in sight: a tree standing between the camera and the Keeper is folded
   * away (its instance scaled to nothing) and put back once the view clears, the Wood's
   * stand-in for the Grove's crown fade (`crowns.ts`), which an instanced batch cannot do
   * per tree. Only the trees whose state changes are written.
   */
  private clearView(cam: THREE.Vector3, k: Vec2): void {
    const dx = k.x - cam.x;
    const dz = k.z - cam.z;
    const l2 = dx * dx + dz * dz;
    if (l2 < 1e-6) return;
    for (let b = 0; b < 3; b++) {
      const orig = this.orig[b];
      const hid = this.hidden[b];
      if (!orig || !hid) continue;
      const arr = this.batches[b]!.instanceMatrix.array as Float32Array;
      let lo = Infinity;
      let hi = -1;
      for (let i = 0; i < hid.length; i++) {
        const px = orig[i * 16 + 12]! - cam.x;
        const pz = orig[i * 16 + 14]! - cam.z;
        const t = (px * dx + pz * dz) / l2;
        let block = false;
        if (t > 0.02 && t < 0.94) {
          const ex = px - dx * t;
          const ez = pz - dz * t;
          block = ex * ex + ez * ez < CLEAR_R * CLEAR_R * orig[i * 16 + 5]! ** 2;
        }
        if (+block === hid[i]) continue;
        hid[i] = +block;
        const at = i * 16;
        if (block) for (const j of FOLD) arr[at + j] = 0;
        else for (const j of FOLD) arr[at + j] = orig[at + j]!;
        lo = Math.min(lo, at);
        hi = Math.max(hi, at + 16);
      }
      if (hi > lo) {
        const im = this.batches[b]!.instanceMatrix;
        im.clearUpdateRanges();
        im.addUpdateRange(lo, hi - lo);
        im.needsUpdate = true;
      }
    }
  }

  dispose(): void {
    for (const g of this.owned) g.dispose();
    for (const m of this.mats) m.dispose();
    for (const b of this.batches) b.dispose();
    this.groundTex.dispose();
    this.dappleTex.dispose();
  }
}

export function createRegion3d(l: RegionLayout): Region3d {
  return new Wood3d(l);
}

export function entrance(): THREE.Object3D {
  return sharedParts().arch;
}
