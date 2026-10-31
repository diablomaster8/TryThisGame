import * as THREE from 'three';
import { IDLE_GLYPH, idlePose, type IdleKind } from '../ui/battle-idle';

/**
 * The Full 3D half of the battle-idle gallery row (recs FIGHT-78), at
 * `?aaa=1&creature=idles`: cheerful, shy, mischievous and lazy Nubbins, each shown moving and
 * then as its reduced-motion still, the same pairs as the Pixel row in `?sprites`. Each plays
 * its idle exactly as the 3D tactics board does (`tactics-3d.ts`: view pixels to world units at
 * 1/24), with the idle's emote on a little tag over the head while it plays. View-only timing,
 * seeded per figure; nothing here reads or writes the sim.
 */
export const IDLE_ROW: readonly { kind: IdleKind; still: boolean }[] = (
  ['bounce', 'peek', 'tongue', 'yawn'] as const
).flatMap((kind) => [false, true].map((still) => ({ kind, still })));

/** View pixels to world units, as on the 3D tactics board. */
const PX = 1 / 24;

interface Tagged {
  group: THREE.Group;
}

/** A canvas-texture tag with the idle's emote, drawn once (never per frame). */
function tag(glyph: string): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(glyph, 32, 34);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  s.scale.setScalar(1);
  s.position.set(0, 3.5, 0);
  s.visible = false;
  return s;
}

/** Remembers each figure's spot and hangs its emote tag over its head. */
export function setUpIdleRow(cast: readonly Tagged[]): void {
  cast.forEach((c, i) => {
    const row = IDLE_ROW[i];
    if (!row) return;
    c.group.userData.idleHome = c.group.position.clone();
    const t = tag(IDLE_GLYPH[row.kind]);
    c.group.userData.idleTag = t;
    c.group.add(t);
  });
}

/** One frame: each figure's idle offset from its spot, its tag shown while the idle plays. */
export function stepIdleRow(cast: readonly Tagged[], nowMs: number): void {
  cast.forEach((c, i) => {
    const row = IDLE_ROW[i];
    const home = c.group.userData.idleHome as THREE.Vector3 | undefined;
    if (!row || !home) return;
    const pose = idlePose(row.kind, `gallery-${i >> 1}`, 1, nowMs, row.still);
    c.group.position.set(home.x + pose.dx * PX, home.y - pose.dy * PX, home.z);
    const t = c.group.userData.idleTag as THREE.Sprite | undefined;
    if (t) t.visible = pose.glyph !== '';
  });
}
