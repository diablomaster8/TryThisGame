import * as THREE from 'three';
import { CROWN_SPRING } from '../config/tuning';
import { sdf, type Prim } from './sculpted';

/**
 * R0380 (LOOK-11): the Chao head point on a spring bone. The crown and its tip are sculpted
 * into the head mesh, so at build time the triangles of the point above a cut are moved into
 * their own small mesh (the head keeps its vertex buffers, re-indexed) under a
 * `crown` pivot at the cut. Each frame the pivot lags behind the head: a damped spring driven
 * by the head's own acceleration (a hop's landing, a start or a stop) and its yaw (a turn),
 * so the point trails a turn and swings past when it ends. A band of triangles at the cut
 * sits in both meshes, so a bent point never opens a hole in the head.
 *
 * The bend follows the crown's shape, which is the form's type: a long point swings more, a
 * stub barely, and a Swim fin flexes from side to side more than fore and aft.
 */
export interface CrownSpring {
  pivot: THREE.Group;
  /** Step the spring by `dt` seconds; `still` (reduced motion) holds the point at rest. */
  update(dt: number, still: boolean): void;
}

const v = new THREE.Vector3();
const tipW = new THREE.Vector3();
const q = new THREE.Quaternion();
const fwd = new THREE.Vector3();
const scl = new THREE.Vector3();
const acc = new THREE.Vector3();

/** A geometry of `geo`'s triangles `idx`, with only the vertices they use. */
function compact(geo: THREE.BufferGeometry, idx: number[]): THREE.BufferGeometry {
  const map = new Map<number, number>();
  const order: number[] = [];
  const index = idx.map((i) => {
    let j = map.get(i);
    if (j === undefined) {
      j = order.length;
      map.set(i, j);
      order.push(i);
    }
    return j;
  });
  const g = new THREE.BufferGeometry();
  for (const [name, attr] of Object.entries(geo.attributes)) {
    const a = attr as THREE.BufferAttribute;
    const n = a.itemSize;
    const Ctor = a.array.constructor as new (len: number) => THREE.TypedArray;
    const out = new Ctor(order.length * n);
    order.forEach((src, k) => {
      for (let c = 0; c < n; c++) out[k * n + c] = a.array[src * n + c]!;
    });
    g.setAttribute(name, new THREE.BufferAttribute(out, n, a.normalized));
  }
  g.setIndex(index);
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
}

/**
 * Split the crown out of `mesh` (the head's, hung from `head` with its geometry about
 * `origin`) and hang it from a spring pivot. Null when the head has no crown, or too few
 * triangles of it lie above the cut.
 */
export function splitCrown(
  prims: readonly Prim[],
  head: THREE.Group,
  mesh: THREE.Mesh,
  origin: THREE.Vector3,
): CrownSpring | null {
  const crown = prims.filter((p) => p.tag === 'crown' || p.tag === 'tip');
  const body = crown.filter((p) => p.tag === 'crown');
  if (!body.length) return null;
  const geo = mesh.geometry;
  const index = geo.index;
  const pos = geo.attributes.position as THREE.BufferAttribute | undefined;
  if (!index || !pos) return null;
  // The cut: a little above the crown's root, where the point leaves the dome.
  let cutY = Infinity;
  let topY = -Infinity;
  for (const p of body) {
    const lo = p.kind === 'ellipsoid' ? p.a.y + 0.1 : Math.min(p.a.y, p.b?.y ?? p.a.y) + 0.25;
    cutY = Math.min(cutY, lo);
    topY = Math.max(topY, p.a.y + (p.radii?.y ?? 0), p.b?.y ?? -Infinity);
  }
  for (const p of crown) if (p.tag === 'tip') topY = Math.max(topY, p.a.y);
  const near = (i: number): boolean => {
    v.fromBufferAttribute(pos, i).add(origin);
    if (v.y < cutY - CROWN_SPRING.band) return false;
    for (const p of crown) if (sdf(v, p) < CROWN_SPRING.reach) return true;
    return false;
  };
  const inCrown = new Uint8Array(pos.count);
  const above = new Uint8Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    if (!near(i)) continue;
    inCrown[i] = 1;
    above[i] = pos.getY(i) + origin.y >= cutY ? 1 : 0;
  }
  const keep: number[] = [];
  const point: number[] = [];
  let sx = 0;
  let sz = 0;
  let ring = 0;
  for (let t = 0; t < index.count; t += 3) {
    const a = index.getX(t);
    const b = index.getX(t + 1);
    const c = index.getX(t + 2);
    const all = above[a]! && above[b]! && above[c]!;
    const touches =
      inCrown[a]! && inCrown[b]! && inCrown[c]! && (above[a]! || above[b]! || above[c]!);
    // The point: every triangle near the crown that reaches above the cut. The head keeps
    // all but those wholly above it, so the straddling band is in both.
    if (touches) {
      point.push(a, b, c);
      if (!all) {
        for (const i of [a, b, c]) {
          sx += pos.getX(i);
          sz += pos.getZ(i);
          ring++;
        }
      }
    }
    if (!all || !touches) keep.push(a, b, c);
  }
  if (point.length < 3 * CROWN_SPRING.minTris || !ring) return null;
  const share = (idx: number[]): THREE.BufferGeometry => {
    const g = new THREE.BufferGeometry();
    for (const [name, attr] of Object.entries(geo.attributes)) g.setAttribute(name, attr);
    g.setIndex(idx);
    g.boundingBox = geo.boundingBox;
    g.boundingSphere = geo.boundingSphere;
    return g;
  };
  // The pivot: the middle of the ring at the cut, in the head's frame.
  const pivotAt = new THREE.Vector3(sx / ring, cutY - origin.y, sz / ring);
  const pivot = new THREE.Group();
  pivot.name = 'crown';
  pivot.position.copy(pivotAt);
  head.add(pivot);
  // The point keeps only the vertices it uses (a few hundred), so the far stand-in that
  // merges every part (`lod-proxy.ts`) does not take the whole head's vertices twice.
  const pointGeo = compact(geo, point);
  const pm = new THREE.Mesh(pointGeo, mesh.material);
  pm.position.copy(pivotAt).negate();
  pm.castShadow = mesh.castShadow;
  pm.receiveShadow = mesh.receiveShadow;
  // Small, but part of the silhouette: it keeps the head's toon outline.
  pm.userData.forceOutline = true;
  pivot.add(pm);
  mesh.geometry = share(keep);
  // The bend for this crown's shape: length against the stock point's, and a thin fin.
  const length = Math.max(0.05, topY - cutY);
  const reachK = THREE.MathUtils.clamp(length / CROWN_SPRING.stockLength, 0.35, 1.4);
  const fin = body.some(
    (p) => p.kind === 'ellipsoid' && (p.radii?.x ?? 1) < (p.radii?.z ?? 0) * 0.5,
  );
  const sideK = reachK * (fin ? CROWN_SPRING.finSide : 1);
  const foreK = reachK * (fin ? CROWN_SPRING.finFore : 1);
  const tipLocal = new THREE.Vector3(0, length, 0);

  // Spring state: the tip's lean in the head's frame, x (side) and z (fore and aft), radians.
  let bx = 0;
  let bz = 0;
  let wx = 0;
  let wz = 0;
  let primed = false;
  const lastPos = new THREE.Vector3();
  const lastVel = new THREE.Vector3();
  let lastYaw = 0;
  let lastYawVel = 0;
  const S = CROWN_SPRING;
  return {
    pivot,
    update(dt, still) {
      if (still || dt <= 0) {
        if (still) {
          bx = bz = wx = wz = 0;
          pivot.rotation.set(0, 0, 0);
          primed = false;
        }
        return;
      }
      pivot.updateWorldMatrix(true, false);
      pivot.matrixWorld.decompose(v, q, scl);
      const s = scl.x || 1;
      tipW.copy(tipLocal).applyMatrix4(pivot.matrixWorld);
      fwd.set(0, 0, 1).applyQuaternion(q);
      const yaw = Math.atan2(fwd.x, fwd.z);
      if (!primed) {
        lastPos.copy(tipW);
        lastVel.set(0, 0, 0);
        lastYaw = yaw;
        lastYawVel = 0;
        primed = true;
        return;
      }
      const vel = v.copy(tipW).sub(lastPos).divideScalar(dt);
      let dyaw = yaw - lastYaw;
      dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
      // A teleport (a pooled body placed elsewhere) restarts the spring rather than kick it.
      if (vel.length() / s > S.teleport || Math.abs(dyaw) > 1) {
        lastPos.copy(tipW);
        lastVel.set(0, 0, 0);
        lastYaw = yaw;
        lastYawVel = 0;
        return;
      }
      const yawVel = dyaw / dt;
      const yawAcc = (yawVel - lastYawVel) / dt;
      // The head's acceleration in its own frame, in rig units.
      acc
        .copy(vel)
        .sub(lastVel)
        .divideScalar(dt * s);
      acc.applyQuaternion(q.invert());
      lastPos.copy(tipW);
      lastVel.copy(vel);
      lastYaw = yaw;
      lastYawVel = yawVel;
      // The point is pushed against the acceleration (a landing droops it back), and trails
      // a turn the other way from the face's swing.
      const fx = -acc.x * S.push - yawAcc * S.turn;
      const fz = -acc.z * S.push - Math.max(0, acc.y) * S.drop + Math.max(0, -acc.y) * S.drop * 0.5;
      const steps = Math.max(1, Math.ceil(dt / 0.02));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        wx += (-S.stiffness * bx - S.damping * wx + fx * sideK) * h;
        wz += (-S.stiffness * bz - S.damping * wz + fz * foreK) * h;
        bx += wx * h;
        bz += wz * h;
      }
      const mx = S.maxLag * sideK;
      const mz = S.maxLag * foreK;
      if (Math.abs(bx) > mx) {
        bx = Math.sign(bx) * mx;
        wx = 0;
      }
      if (Math.abs(bz) > mz) {
        bz = Math.sign(bz) * mz;
        wz = 0;
      }
      // Positive x leans the tip toward the head's +x, positive z toward the face.
      pivot.rotation.set(bz, 0, -bx);
    },
  };
}
