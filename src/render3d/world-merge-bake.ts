/**
 * The geometry half of `world-merge.ts`: still pieces baked into one mesh in the merge root's
 * space, each vertex tagged with its piece and texture set (`wmId` = piece + set * 65536).
 */
import * as THREE from 'three';

/** What `bakeGeometry` needs of a piece. */
export interface BakePiece {
  readonly mesh: THREE.Mesh;
  readonly mat: THREE.MeshStandardMaterial;
  /** Its world matrix when it joined. */
  readonly matrix: THREE.Matrix4;
  readonly set: number;
}

/** The value that reads as 1.0 in an attribute like `a` (255 for normalised bytes, ...). */
function whiteOf(a: THREE.BufferAttribute): number {
  if (!a.normalized) return 1;
  const arr = a.array;
  if (arr instanceof Uint8Array || arr instanceof Uint8ClampedArray) return 255;
  if (arr instanceof Uint16Array) return 65535;
  if (arr instanceof Int8Array) return 127;
  if (arr instanceof Int16Array) return 32767;
  return 1;
}

/**
 * Positions and normals through each piece's matrix (mirrored pieces with their winding
 * turned), every other attribute copied, and vertex colours where `coloured` (a piece with
 * them) says the program reads them: white for pieces without.
 */
export function bakeGeometry(
  pieces: readonly BakePiece[],
  invRoot: THREE.Matrix4,
  coloured: BakePiece | undefined,
): { geo: THREE.BufferGeometry; verts: number } {
  // Every other attribute (uv, a terrain's blend weights) is copied as it is; the key made
  // sure every piece has the same ones, of the same type. Colour only where it is used.
  const first = pieces[0]!.mesh.geometry;
  const extra = Object.keys(first.attributes)
    .filter((k) => k !== 'position' && k !== 'normal' && k !== 'color')
    .map((name) => {
      const a = first.getAttribute(name) as THREE.BufferAttribute;
      return { name, size: a.itemSize, normalized: a.normalized, ctor: a.array.constructor };
    });
  const cAttr = coloured?.mesh.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
  const white = cAttr ? whiteOf(cAttr) : 1;
  if (cAttr)
    extra.push({
      name: 'color',
      size: cAttr.itemSize,
      normalized: cAttr.normalized,
      ctor: cAttr.array.constructor,
    });
  let verts = 0;
  let idx = 0;
  for (const { mesh } of pieces) {
    const geo = mesh.geometry;
    const n = geo.getAttribute('position').count;
    verts += n;
    idx += geo.index ? geo.index.count : n;
  }
  const pos = new Float32Array(verts * 3);
  const nor = new Float32Array(verts * 3);
  const outs = extra.map(
    (e) => new (e.ctor as Float32ArrayConstructor)(verts * e.size) as THREE.TypedArray,
  );
  const ids = new Float32Array(verts);
  const index = verts > 65535 ? new Uint32Array(idx) : new Uint16Array(idx);
  const local = new THREE.Matrix4();
  const nm = new THREE.Matrix3();
  const v = new THREE.Vector3();
  let vo = 0;
  let io = 0;
  pieces.forEach((p, k) => {
    const geo = p.mesh.geometry;
    const P = geo.getAttribute('position');
    const N = geo.getAttribute('normal');
    const ins = extra.map((e) =>
      e.name === 'color' && !p.mat.vertexColors ? null : geo.getAttribute(e.name),
    );
    local.multiplyMatrices(invRoot, p.matrix);
    nm.getNormalMatrix(local);
    const id = k + p.set * 65536;
    // Straight off the arrays where they are plain (the merge of a 90k-vertex prop ring took
    // ~100 ms through the attribute getters); the same arithmetic as `applyMatrix4`.
    const e = local.elements;
    const q = nm.elements;
    const plain = (a: THREE.BufferAttribute | THREE.InterleavedBufferAttribute): boolean =>
      !(a as THREE.InterleavedBufferAttribute).isInterleavedBufferAttribute && !a.normalized;
    const pa = plain(P) ? (P.array as ArrayLike<number>) : null;
    const na = plain(N) ? (N.array as ArrayLike<number>) : null;
    for (let i = 0; i < P.count; i++) {
      const x = pa ? pa[i * 3]! : P.getX(i);
      const y = pa ? pa[i * 3 + 1]! : P.getY(i);
      const z = pa ? pa[i * 3 + 2]! : P.getZ(i);
      const w = 1 / (e[3]! * x + e[7]! * y + e[11]! * z + e[15]!);
      const o = (vo + i) * 3;
      pos[o] = (e[0]! * x + e[4]! * y + e[8]! * z + e[12]!) * w;
      pos[o + 1] = (e[1]! * x + e[5]! * y + e[9]! * z + e[13]!) * w;
      pos[o + 2] = (e[2]! * x + e[6]! * y + e[10]! * z + e[14]!) * w;
      const nx = na ? na[i * 3]! : N.getX(i);
      const ny = na ? na[i * 3 + 1]! : N.getY(i);
      const nz = na ? na[i * 3 + 2]! : N.getZ(i);
      v.set(
        q[0]! * nx + q[3]! * ny + q[6]! * nz,
        q[1]! * nx + q[4]! * ny + q[7]! * nz,
        q[2]! * nx + q[5]! * ny + q[8]! * nz,
      ).normalize();
      nor[o] = v.x;
      nor[o + 1] = v.y;
      nor[o + 2] = v.z;
      ids[vo + i] = id;
    }
    for (let k2 = 0; k2 < extra.length; k2++) {
      const size = extra[k2]!.size;
      const src = ins[k2];
      const dst = outs[k2]!;
      const at = vo * size;
      if (!src) dst.fill(white, at, at + P.count * size);
      else if (!(src as THREE.InterleavedBufferAttribute).isInterleavedBufferAttribute)
        dst.set((src.array as THREE.TypedArray).subarray(0, P.count * size), at);
      else
        for (let i = 0; i < P.count; i++)
          for (let c = 0; c < size; c++) dst[at + i * size + c] = src.getComponent(i, c);
    }
    // A mirrored piece is drawn with the winding turned (three flips the front face for it).
    const flip = local.determinant() < 0;
    const n = geo.index ? geo.index.count : P.count;
    const ia = geo.index ? (geo.index.array as ArrayLike<number>) : null;
    for (let i = 0; i < n; i += 3) {
      const a = ia ? ia[i]! : i;
      const b = ia ? ia[i + 1]! : i + 1;
      const c = ia ? ia[i + 2]! : i + 2;
      index[io++] = a + vo;
      index[io++] = (flip ? c : b) + vo;
      index[io++] = (flip ? b : c) + vo;
    }
    vo += P.count;
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  extra.forEach((e, k) =>
    geo.setAttribute(e.name, new THREE.BufferAttribute(outs[k]!, e.size, e.normalized)),
  );
  geo.setAttribute('wmId', new THREE.BufferAttribute(ids, 1));
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  geo.computeBoundingSphere();
  return { geo, verts };
}
