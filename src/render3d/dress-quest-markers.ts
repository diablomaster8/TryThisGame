import type { ReadonlyWorld } from '../render/readonly-world';
import * as THREE from 'three';
import type { SceneStage } from '../config/story';
import { C12C } from '../config/tuning-more/story-quest-markers';
import type { Daylight } from '../render/daylight';
import { questMarkers } from '../render/quest-markers';

import type { Dress3dCtx, Dressing3d } from './dressings';
import { groveHeight } from './terrain';

/**
 * R0608, Full 3D: `questMarkers(world)` as a small pool of glowing shapes over the giver, board
 * or step. Each slot owns one `!` mesh (a cone over a ball) and one diamond (an octahedron), both
 * rotation-symmetric so they read from every camera angle, and shows exactly one of them, so the
 * draw calls rise by at most `markers.max`. Meshes are built once; per frame only position,
 * visibility and a gentle spin and bob change (still under reduced motion).
 */
const GOLD = new THREE.Color('#f2b723').multiplyScalar(1.5);
const TEAL = new THREE.Color('#27b5a6').multiplyScalar(1.5);

interface Slot {
  offer: THREE.Mesh;
  step: THREE.Mesh;
}

let root: THREE.Group | null = null;
let slots: Slot[] = [];
let clock = 0;
const geos: THREE.BufferGeometry[] = [];

/** A tapered bar over a dot: the `!`. */
function offerGeometry(): THREE.BufferGeometry {
  const bar = new THREE.ConeGeometry(0.15, 0.42, 10).rotateX(Math.PI).translate(0, 0.16, 0);
  const dot = new THREE.SphereGeometry(0.08, 10, 8).translate(0, -0.13, 0);
  const a = bar.toNonIndexed();
  const b = dot.toNonIndexed();
  const na = a.attributes.position!.count * 3;
  const pos = new Float32Array(na + b.attributes.position!.count * 3);
  pos.set(a.attributes.position!.array as Float32Array, 0);
  pos.set(b.attributes.position!.array as Float32Array, na);
  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  bar.dispose();
  dot.dispose();
  a.dispose();
  b.dispose();
  return merged;
}

export const dress3dQuestMarkers: Dressing3d = {
  id: 'quest-markers',
  build(c: Dress3dCtx) {
    clock = 0;
    root = new THREE.Group();
    root.name = 'quest-markers';
    c.world3d.add(root);
    const og = offerGeometry();
    const dg = new THREE.OctahedronGeometry(0.22, 0).scale(0.8, 1.2, 0.8);
    geos.push(og, dg);
    const om = new THREE.MeshBasicMaterial({ color: GOLD, fog: false, toneMapped: false });
    const sm = new THREE.MeshBasicMaterial({ color: TEAL, fog: false, toneMapped: false });
    slots = [];
    for (let i = 0; i < C12C.markers.max; i++) {
      const offer = new THREE.Mesh(og, om);
      const step = new THREE.Mesh(dg, sm);
      offer.visible = false;
      step.visible = false;
      offer.name = 'mark-offer';
      step.name = 'mark-step';
      root.add(offer, step);
      slots.push({ offer, step });
    }
  },
  update(world: ReadonlyWorld, _stage: SceneStage, _daylight: Daylight, dt: number) {
    if (!root) return;
    clock += dt;
    const still = document.documentElement.classList.contains('reduce-motion');
    const list = questMarkers(world);
    slots.forEach((s, i) => {
      const m = list[i];
      s.offer.visible = !!m && m.kind === 'offer';
      s.step.visible = !!m && m.kind === 'step';
      if (!m) return;
      const mesh = m.kind === 'offer' ? s.offer : s.step;
      const bob = still ? 0 : Math.sin(clock * 3 + i) * 0.06;
      mesh.position.set(m.x, groveHeight(m.x, m.z) + m.lift + bob, m.z);
      mesh.rotation.y = still ? 0 : clock * 1.4;
      // R0629: a child's markers are larger and pulse (still under reduced motion).
      mesh.scale.setScalar(
        m.big ? C12C.markers.kidScale * (still ? 1 : 1 + 0.1 * Math.sin(clock * 4)) : 1,
      );
    });
  },
  dispose() {
    root?.removeFromParent();
    for (const g of geos) g.dispose();
    geos.length = 0;
    root = null;
    slots = [];
  },
};
