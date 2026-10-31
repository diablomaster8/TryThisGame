/**
 * LOOK-63: the Full 3D egg cracks and wobbles as the pixel one does. A shaken egg rocks fast
 * and squashes, a waiting one gives an occasional wobble past halfway, and a zigzag
 * crack runs further round the shell at each of five stages (R0503; the pixel `crack1` to
 * `crack5` frames). The cracks are lines on the shell mesh, kept on its
 * `userData` so a pooled shell going to another egg is wiped clean.
 */
import * as THREE from 'three';
import { EGG } from '../config/tuning';
import type { Nubbin } from '../sim/types';
import { crackStage, type CrackStage } from '../render/egg-crack-stage';

const CRACK_MAT = new THREE.LineBasicMaterial({ color: '#3a2a20' });

/**
 * R0503: 0 none to 5 all the way round, the pixel egg's five crack stages
 * (render/egg-crack-stage.ts), so each shake runs the crack a little further.
 */
export function crackLevel(n: Pick<Nubbin, 'hatchRemainingMs'>): CrackStage {
  return crackStage(n);
}

function crackLine(shell: THREE.Mesh, level: Exclude<CrackStage, 0>): THREE.Line {
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
  const steps = Math.max(4, Math.round((level / 5) * 24));
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
export function updateCracks(shell: THREE.Mesh, level: CrackStage): void {
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
