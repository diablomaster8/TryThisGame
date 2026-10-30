import * as THREE from 'three';
import '../world-hud.css';
import { LITTLE_GROVE, WORLD_BEACON } from '../config/tuning-world';
import { TRAVEL_TEXT, WORLD_TEXT } from '../config/strings-world';
import type { Game } from '../game';
import { Beacon } from '../render/beacon';
import { buildEduFence } from '../render/edu-fence';
import { terraceY } from '../render/scene-stage';
import { objectivePoi } from '../sim/beacon';
import { travelMode } from '../sim/travel';
import type { Vec2 } from '../sim/types';
import { edgeArrow } from './hud-world-math';
import { objectiveOf } from './objective';
import { playIris } from './travel-iris';

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
  // R0102: with Travel assist on, the chip is the beacon's handle: Auto-walk runs there, Skip
  // hops there; with Walk it opens the Map as before.
  arrow.addEventListener('click', () => {
    const g = game();
    const at = OBJECTIVE_TARGET.pos;
    const mode = g ? travelMode(g.world) : 'walk';
    if (
      !g ||
      !at ||
      mode === 'walk' ||
      document.documentElement.classList.contains('dialogue-open')
    ) {
      openMap();
      return;
    }
    if (mode === 'auto') g.send({ kind: 'travelAssist', pos: { ...at } });
    else playIris(() => g.send({ kind: 'fastTravel', pos: { ...at } }));
  });
  root.appendChild(arrow);
  const beacons = new WeakMap<THREE.Object3D, Beacon>();
  // R0099: the Learning Grove's fence, one per scene, shown while the Learning Grove is on.
  const fences = new WeakMap<THREE.Object3D, THREE.Mesh>();
  // R0099: the sprout band's Home button walks the Keeper back to the cottage.
  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'btn edu-home';
  home.textContent = `🏠 ${WORLD_TEXT.eduHome}`;
  home.hidden = true;
  home.addEventListener('click', () =>
    game()?.send({ kind: 'moveKeeperTo', pos: { ...LITTLE_GROVE.home } }),
  );
  root.appendChild(home);
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
    const kids = !!g?.world.edu && g.world.location === 'grove';
    home.hidden = !kids || g?.world.edu?.band !== 'sprout';
    if (scene && kids && !fences.has(scene)) {
      const ground = g?.scene3d ? terraceY : () => 0;
      const f = buildEduFence(ground);
      scene.add(f);
      fences.set(scene, f);
    }
    const fence = scene ? fences.get(scene) : undefined;
    if (fence) fence.visible = kids;
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
      // R0102: with Travel assist on, a visible beacon still far from the Keeper gets the chip
      // over it, so tapping the beacon travels.
      const assist =
        travelMode(g!.world) !== 'walk' &&
        !!k &&
        Math.hypot(at.x - k.x, at.z - k.z) > WORLD_BEACON.assistFrom;
      if (assist) {
        const r = root.getBoundingClientRect();
        const sx = ((v.x + 1) / 2) * r.width;
        const sy = ((1 - v.y) / 2) * r.height;
        arrow.hidden = false;
        arrow.classList.add('beacon-arrow-on');
        arrow.setAttribute('aria-label', TRAVEL_TEXT.goBeacon);
        arrow.style.transform = `translate(${Math.round(sx)}px, ${Math.round(sy)}px) translate(-50%, -50%)`;
        return;
      }
      arrow.hidden = true;
      return;
    }
    const r = root.getBoundingClientRect();
    arrow.classList.remove('beacon-arrow-on');
    arrow.setAttribute('aria-label', WORLD_TEXT.compassObjective);
    const p = edgeArrow({ x: v.x, y: v.y, behind }, r.width, r.height, WORLD_BEACON.inset);
    arrow.hidden = false;
    arrow.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px) translate(-50%, -50%)`;
    pointer.style.transform = `rotate(${p.angle}rad)`;
    arrow.dataset['angle'] = p.angle.toFixed(3);
  };
  requestAnimationFrame(frame);
}
