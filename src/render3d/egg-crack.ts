/**
 * LOOK-63: the Full 3D egg cracks and wobbles as the pixel one does. A shaken egg rocks fast
 * and squashes, a waiting one gives an occasional wobble past halfway, and in the last 20 s a
 * zigzag crack runs halfway round the shell, then all the way round in the last 5 s (the
 * pixel `crack1` and `crack2` frames). The cracks are lines on the shell mesh, kept on its
 * `userData` so a pooled shell going to another egg is wiped clean.
 */
import * as THREE from 'three';
import { EGG } from '../config/tuning';
import type { Nubbin } from '../sim/types';

const CRACK_MAT = new THREE.LineBasicMaterial({ color: '#3a2a20' });

/** 0 none, 1 half round, 2 all round, by the time left to hatch. */
export function crackLevel(n: Pick<Nubbin, 'hatchRemainingMs'>): 0 | 1 | 2 {
  return n.hatchRemainingMs < 5000 ? 2 : n.hatchRemainingMs < 20000 ? 1 : 0;
}

function crackLine(shell: THREE.Mesh, level: 1 | 2): THREE.Line {
  const geo = shell.geometry;
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const rx = (box.max.x - box.min.x) / 2;
  const rz = (box.max.z - box.min.z) / 2;
  const cy = (box.max.y + box.min.y) / 2;
  const ry = (box.max.y - box.min.y) / 2;
  const y0 = cy + ry * 0.3;
  // How wide the shell is at that height, on an ellipsoid; a hair proud of the surface.
  const k = Math.sqrt(Math.max(0.05, 1 - 0.09)) * 1.02;
  const pts: THREE.Vector3[] = [];
  const steps = level === 2 ? 24 : 12;
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI * 0.5 + (i / 24) * Math.PI * 2;
    const y = y0 + (i % 2 ? 0.06 : -0.06) * ry;
    pts.push(new THREE.Vector3(Math.cos(a) * rx * k, y, Math.sin(a) * rz * k));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), CRACK_MAT);
}

/**
 * HOT-2: a crack line for the scene's shader warm-up. The cracks appear in an egg's last
 * 20 s, and their first draw used to link a program mid-play.
 */
export function crackWarmObject(): THREE.Line {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0.1, 0)]),
    CRACK_MAT,
  );
}

/** Bring a shell's cracks to the egg's level (none on a cocoon). */
export function updateCracks(shell: THREE.Mesh, level: 0 | 1 | 2): void {
  const ud = shell.userData as { crack?: { level: number; line: THREE.Line } };
  if ((ud.crack?.level ?? 0) === level) return;
  if (ud.crack) {
    ud.crack.line.removeFromParent();
    ud.crack.line.geometry.dispose();
    delete ud.crack;
  }
  if (level) {
    const line = crackLine(shell, level);
    shell.add(line);
    ud.crack = { level, line };
  }
}

/**
 * The egg's rock about its foot, radians, and a squash factor: fast and deep while shaken,
 * an occasional wobble once it is past half its time, a gentle sway otherwise.
 */
export function eggWobble(
  n: Pick<Nubbin, 'lastShakeMs' | 'hatchRemainingMs'>,
  simMs: number,
  nowMs: number,
  phase: number,
): { rz: number; squash: number } {
  if (simMs - n.lastShakeMs < EGG.shakeCooldownMs * 2) {
    const w = Math.sin((nowMs / 90) * Math.PI);
    return { rz: w * 0.28, squash: 1 - Math.abs(w) * 0.08 };
  }
  if (n.hatchRemainingMs < EGG.hatchMs * 0.5 && Math.floor(nowMs / 700) % 6 === 0)
    return { rz: Math.sin((nowMs / 120) * Math.PI) * 0.16, squash: 1 };
  return { rz: Math.sin(nowMs / 455 + phase) * 0.06, squash: 1 };
}
