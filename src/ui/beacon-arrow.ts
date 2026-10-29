import * as THREE from 'three';
import '../world-hud.css';
import { WORLD_BEACON } from '../config/tuning-world';
import { WORLD_TEXT } from '../config/strings-world';
import type { Game } from '../game';
import { Beacon } from '../render/beacon';
import { terraceY } from '../render/scene-stage';
import { objectivePoi } from '../sim/beacon';
import type { Vec2 } from '../sim/types';
import { edgeArrow } from './hud-world-math';
import { objectiveOf } from './objective';

/**
 * R0100 (WORLD-42): draws the tracked objective in the world. Each frame it asks where the
 * objective chip's step is (`sim/beacon.ts`), keeps a beacon there in whichever scene is
 * drawing, and when that place is off screen shows a round arrow chip on the screen's edge
 * pointing at it (tap: the Map). `OBJECTIVE_TARGET` is what the compass tick and the minimap
 * star read. Everything hides when the step has no place, the chip is hidden or the step is done.
 */
export const OBJECTIVE_TARGET: { pos: Vec2 | null } = { pos: null };

export function mountBeacon(root: HTMLElement, game: () => Game | null, openMap: () => void): void {
  const arrow = document.createElement('button');
  arrow.type = 'button';
  arrow.className = 'beacon-arrow';
  arrow.hidden = true;
  arrow.setAttribute('aria-label', WORLD_TEXT.compassObjective);
  const pointer = document.createElement('span');
  pointer.className = 'beacon-arrow-point';
  pointer.textContent = '➤';
  const star = document.createElement('span');
  star.className = 'beacon-arrow-star';
  star.textContent = '★';
  arrow.append(pointer, star);
  arrow.addEventListener('click', openMap);
  root.appendChild(arrow);
  const beacons = new WeakMap<THREE.Object3D, Beacon>();
  let shown: Beacon | null = null;
  const v = new THREE.Vector3();
  const frame = (): void => {
    requestAnimationFrame(frame);
    const g = game();
    const chip = root.querySelector<HTMLElement>('.objective-chip');
    const o = g && chip && !chip.hidden ? objectiveOf(g) : null;
    const at = g && o ? objectivePoi(g.world, o.key) : null;
    OBJECTIVE_TARGET.pos = at;
    const scene = g ? (g.scene3d?.scene ?? g.grove?.scene ?? null) : null;
    const camera: THREE.Camera | null = g ? (g.scene3d?.camera ?? g.camera.camera) : null;
    let b = scene ? (beacons.get(scene) ?? null) : null;
    if (scene && !b && at) {
      b = new Beacon(scene);
      beacons.set(scene, b);
    }
    if (shown && shown !== b) shown.update(null, 0, false, 0, true);
    shown = b;
    const k = g?.world.keeper.pos;
    const far = !at || !k || Math.hypot(at.x - k.x, at.z - k.z) > WORLD_BEACON.seenFrom;
    const reduce = document.documentElement.classList.contains('reduce-motion');
    // The pixel ground is flat; the 3D one is the terraced field.
    const y = at && g?.scene3d ? terraceY(at.x, at.z) : 0;
    b?.update(far ? null : at, y, !!g?.world.edu, performance.now() / 1000, reduce);
    if (!at || !camera) {
      arrow.hidden = true;
      return;
    }
    v.set(at.x, y + 1, at.z).project(camera);
    const behind = v.z > 1;
    const lim = WORLD_BEACON.onScreen;
    if (!behind && Math.abs(v.x) <= lim && Math.abs(v.y) <= lim) {
      arrow.hidden = true;
      return;
    }
    const r = root.getBoundingClientRect();
    const p = edgeArrow({ x: v.x, y: v.y, behind }, r.width, r.height, WORLD_BEACON.inset);
    arrow.hidden = false;
    arrow.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px) translate(-50%, -50%)`;
    pointer.style.transform = `rotate(${p.angle}rad)`;
    arrow.dataset['angle'] = p.angle.toFixed(3);
  };
  requestAnimationFrame(frame);
}
