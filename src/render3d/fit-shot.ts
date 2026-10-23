import * as THREE from 'three';
import { GROVE3D, READ3D, STAGE2, STAGE4 } from '../config/tuning';
import { fitTiers, type FitPoint } from '../render/stage-fit';

/**
 * The 3D story fit (H4, K3), pure so the shot test (K49) can run it without a renderer: the
 * look point and distance that fit `points` (their feet and heads) inside the HUD-safe area
 * at a yaw and pitch. A search on the distance, then the look point slid so the framed
 * bounds sit in the middle of the safe area; three rounds. K3: when the whole set would
 * stand further back than `STAGE4.fit3dBudget`, the tiers of `fitTiers` are tried in turn
 * (big props cropped, places dropped, props dropped; the speaker always stays).
 */

/** The safe area in normalised device coordinates (-1..1, y up). */
export interface SafeNdc {
  sx0: number;
  sx1: number;
  sy0: number;
  sy1: number;
}

export interface Lens {
  fov: number;
  aspect: number;
  near: number;
  far: number;
}

export interface Fit3d {
  x: number;
  z: number;
  distance: number;
  kept: FitPoint[];
}

/** Vertical field of view for an aspect: the tuned one, widened in portrait so the view
 * keeps `minHFovDeg` across and a Nubbin beside the Keeper stays on screen. */
export function fovFor(aspect: number): number {
  const half = THREE.MathUtils.degToRad(GROVE3D.minHFovDeg) / 2;
  const need = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(half) / aspect));
  return Math.max(GROVE3D.fovDeg, need);
}

/** A screen rect (CSS px) inside a view, as NDC. */
export function safeNdc(
  rect: { x: number; y: number; w: number; h: number },
  view: { x: number; y: number; w: number; h: number },
): SafeNdc {
  return {
    sx0: ((rect.x - view.x) / view.w) * 2 - 1,
    sx1: ((rect.x + rect.w - view.x) / view.w) * 2 - 1,
    sy1: 1 - ((rect.y - view.y) / view.h) * 2,
    sy0: 1 - ((rect.y + rect.h - view.y) / view.h) * 2,
  };
}

/** Stand `cam` at a shot: looking at (x, ground + lookHeight, z) from `d` away at yaw, pitch. */
export function placeCam(
  cam: THREE.PerspectiveCamera,
  x: number,
  z: number,
  d: number,
  yaw: number,
  pitch: number,
  ground: (x: number, z: number) => number,
  lookUp = 0,
): void {
  const ty = ground(x, z) + GROVE3D.lookHeight + lookUp;
  cam.position.set(
    x + Math.sin(yaw) * Math.cos(pitch) * d,
    ty + Math.sin(pitch) * d,
    z + Math.cos(yaw) * Math.cos(pitch) * d,
  );
  cam.lookAt(x, ty, z);
  cam.updateMatrixWorld();
}

const lensCam = (cam: THREE.PerspectiveCamera, lens: Lens): void => {
  cam.fov = lens.fov;
  cam.aspect = lens.aspect;
  cam.near = lens.near;
  cam.far = lens.far;
  cam.updateProjectionMatrix();
};

/** One set of points fitted (no tiers). */
function fitOnce(
  points: readonly FitPoint[],
  yaw: number,
  pitch: number,
  cam: THREE.PerspectiveCamera,
  s: SafeNdc,
  ground: (x: number, z: number) => number,
): { x: number; z: number; distance: number } {
  const m = STAGE2.fitMargin;
  const wx = (s.sx1 - s.sx0) * (1 - m);
  const wy = (s.sy1 - s.sy0) * (1 - m);
  const pts: THREE.Vector3[] = [];
  for (const p of points) {
    // A mark that carries its own size (MARK_FIT: the Hush's colossus) is kept whole,
    // where its card stands.
    const fit = p.fit;
    const r = fit ? Math.max(STAGE2.fitRadius3d, fit.r) : STAGE2.fitRadius3d;
    const h = fit ? fit.h3d : STAGE2.figureH3d;
    const pz = p.z + (fit?.dz3d ?? 0);
    for (const [dx, dz] of [
      [-r, 0],
      [r, 0],
      [0, -r],
      [0, r],
    ] as const) {
      const g = ground(p.x + dx, pz + dz);
      pts.push(
        new THREE.Vector3(p.x + dx, g, pz + dz),
        new THREE.Vector3(p.x + dx, g + h, pz + dz),
      );
    }
  }
  const v = new THREE.Vector3();
  const bounds = (x: number, z: number, d: number) => {
    placeCam(cam, x, z, d, yaw, pitch, ground);
    let x0 = Infinity;
    let x1 = -Infinity;
    let y0 = Infinity;
    let y1 = -Infinity;
    for (const p of pts) {
      v.copy(p).project(cam);
      x0 = Math.min(x0, v.x);
      x1 = Math.max(x1, v.x);
      y0 = Math.min(y0, v.y);
      y1 = Math.max(y1, v.y);
    }
    return { x0, x1, y0, y1 };
  };
  let x = points.reduce((a, p) => a + p.x, 0) / Math.max(1, points.length);
  let z = points.reduce((a, p) => a + p.z, 0) / Math.max(1, points.length);
  let d: number = READ3D.stage.minDistance;
  for (let round = 0; round < 3; round++) {
    let lo: number = READ3D.stage.minDistance;
    let hi: number = STAGE2.fitMaxDistance;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      const b = bounds(x, z, mid);
      if (b.x1 - b.x0 <= wx && b.y1 - b.y0 <= wy) hi = mid;
      else lo = mid;
    }
    d = hi;
    // Slide the look point so the bounds' middle lands on the safe area's middle.
    const b = bounds(x, z, d);
    const halfH = d * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const halfW = halfH * cam.aspect;
    const dx = ((b.x0 + b.x1) / 2 - (s.sx0 + s.sx1) / 2) * halfW;
    const dy = ((b.y0 + b.y1) / 2 - (s.sy0 + s.sy1) / 2) * halfH;
    // Camera right on the ground, and up the screen along the ground (away from it).
    x += Math.cos(yaw) * dx - (Math.sin(yaw) * dy) / Math.max(0.3, Math.sin(pitch));
    z += -Math.sin(yaw) * dx - (Math.cos(yaw) * dy) / Math.max(0.3, Math.sin(pitch));
  }
  return { x, z, distance: d };
}

const scratch = new THREE.PerspectiveCamera();

/**
 * K3 review: the smallest a person (`STAGE4.personH` tall, a weight-1 point with no size of
 * its own) is drawn from this camera, in CSS px of a view `viewPxH` high; Infinity with none.
 */
function smallestPerson(
  points: readonly FitPoint[],
  cam: THREE.PerspectiveCamera,
  ground: (x: number, z: number) => number,
  viewPxH: number,
): number {
  let least = Infinity;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  for (const p of points) {
    if ((p.w ?? STAGE4.weight.cast) < STAGE4.weight.cast || p.fit) continue;
    const g = ground(p.x, p.z);
    a.set(p.x, g, p.z).project(cam);
    b.set(p.x, g + STAGE4.personH, p.z).project(cam);
    least = Math.min(least, ((b.y - a.y) / 2) * viewPxH);
  }
  return least;
}

/**
 * K3's weighted fit: the first tier that fits within the budget, else the narrowest. On a
 * phone held upright (`lens.aspect < 1` and `viewPxH` given), a tier also has to draw every
 * person in it at least `STAGE4.minPersonPx` tall; the narrowest tier is pushed in until it
 * does (never nearer than the shortest story distance).
 */
export function fitShot3d(
  points: readonly FitPoint[],
  yaw: number,
  pitchDeg: number,
  lens: Lens,
  safe: SafeNdc,
  ground: (x: number, z: number) => number,
  cam: THREE.PerspectiveCamera = scratch,
  viewPxH = 0,
): Fit3d {
  lensCam(cam, lens);
  const pitch = THREE.MathUtils.degToRad(pitchDeg);
  const phone = lens.aspect < 1 && viewPxH > 0;
  const size = (f: { x: number; z: number; distance: number }, t: readonly FitPoint[]) => {
    placeCam(cam, f.x, f.z, f.distance, yaw, pitch, ground);
    return smallestPerson(t, cam, ground, viewPxH);
  };
  const tiers = fitTiers(points);
  let out: Fit3d | null = null;
  for (const t of tiers) {
    const f = fitOnce(t, yaw, pitch, cam, safe, ground);
    out = { ...f, kept: t };
    if (f.distance <= STAGE4.fit3dBudget && (!phone || size(f, t) >= STAGE4.minPersonPx)) break;
  }
  if (out && phone) {
    for (let i = 0; i < 4; i++) {
      const px = size(out, out.kept);
      if (!(px < STAGE4.minPersonPx) || out.distance <= READ3D.stage.minDistance) break;
      const d = Math.max(READ3D.stage.minDistance, (out.distance * px) / STAGE4.minPersonPx);
      out = { ...out, distance: d };
    }
  }
  return out ?? { x: 0, z: 0, distance: READ3D.stage.minDistance, kept: [] };
}

/** Where a ground point (raised `up`) lands in NDC from a shot; z > 1 is behind the camera. */
export function projectShot(
  p: { x: number; z: number },
  shot: { x: number; z: number; distance: number; yaw: number; pitchDeg: number; lookUp?: number },
  lens: Lens,
  ground: (x: number, z: number) => number,
  up = 0,
  cam: THREE.PerspectiveCamera = scratch,
): THREE.Vector3 {
  lensCam(cam, lens);
  placeCam(
    cam,
    shot.x,
    shot.z,
    shot.distance,
    shot.yaw,
    THREE.MathUtils.degToRad(shot.pitchDeg),
    ground,
    shot.lookUp ?? 0,
  );
  return new THREE.Vector3(p.x, ground(p.x, p.z) + up, p.z).project(cam);
}
