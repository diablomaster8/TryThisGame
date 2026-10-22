import * as THREE from 'three';
import type { InteriorId } from '../config/stage-marks';
import { CG4_C4 } from '../config/tuning';
import { interiorOf, roomOrigin, wallsShown } from '../render/interior-layout';
import { OCCLUDE, shadowHides } from './building-kit';
import type { Dress3dCtx, Dressing3d } from './dressings';
import {
  buildInterior,
  disposeInterior,
  interiorMats,
  type Interior3d,
  type InteriorMats,
} from './interiors';
import { groveHeight } from './terrain-shape';

/**
 * Campaign graphics 4, package c4, Full 3D.
 * - K2: hidden buildings cast no shadow. Every shadow-casting building-kit mesh gets the
 *   hide-aware depth material (`shadowHides` in building-kit.ts); the scene is swept again
 *   now and then, since story sets and houses build late. (Taps: `dress-x.ts`.)
 * - K10: a stage at `place: 'inside-<id>'` shows its interior (`interiors.ts`) round
 *   `CG4_C4.room.origin`, on the scene (not the Grove's group, which an exclusive stage
 *   hides). The wall between the camera and the room is left out each frame. By night the
 *   room carries a warm emissive fill and its windows glow; by day the glass is pale sky.
 *   Nothing moves, so reduced motion needs no other form.
 */
export const dress3dC4: Dressing3d = (() => {
  let ctx: Dress3dCtx | null = null;
  let sweepIn = 0;
  let lastHides = -1;
  let mats: InteriorMats | null = null;
  const rooms = new Map<InteriorId, Interior3d>();
  const warm = new THREE.Color();
  const glass = new THREE.Color();
  const toCam = new THREE.Vector3();

  const sweep = (root: THREE.Object3D): void => {
    shadowHides(root);
    sweepIn = CG4_C4.shadowSweepS;
  };

  const roomFor = (c: Dress3dCtx, id: InteriorId): Interior3d => {
    let r = rooms.get(id);
    if (r) return r;
    mats ??= interiorMats(c.tex);
    r = buildInterior(c.tex, mats, id);
    const o = roomOrigin();
    r.group.position.set(o.x, groveHeight(o.x, o.z) + 0.02, o.z);
    r.group.visible = false;
    c.scene.add(r.group);
    shadowHides(r.group);
    void c.compile(r.group);
    rooms.set(id, r);
    return r;
  };

  return {
    id: 'c4',
    build(c) {
      ctx = c;
      sweep(c.scene);
    },
    update(world, stage, daylight, dt) {
      if (!ctx) return;
      sweepIn -= dt;
      // A building hidden for the first time sweeps at once (its set may have just built).
      const hides = OCCLUDE.hides.value;
      if (sweepIn <= 0 || (hides > 0 && lastHides === 0)) sweep(ctx.scene);
      lastHides = hides;

      const id = interiorOf(stage);
      for (const [k, r] of rooms) r.group.visible = k === id;
      if (!id) return;
      const room = roomFor(ctx, id);
      room.group.visible = true;
      toCam.copy(ctx.camera.position).sub(room.group.position);
      const shown = wallsShown({ x: toCam.x, z: toCam.z });
      room.walls.forEach((w, i) => (w.visible = shown[i]!));
      if (!mats) return;
      const L = CG4_C4.light;
      const k = Math.min(1, daylight.darkness / 0.7);
      warm.set(L.emissive).multiplyScalar(L.emissiveDay + (L.emissiveNight - L.emissiveDay) * k);
      for (const m of [mats.wood, mats.stone, mats.plain]) m.emissive.copy(warm);
      glass
        .set('#cfe6f2')
        .multiplyScalar(L.dayWindow)
        .lerp(warm.set('#ffc070').multiplyScalar(L.window), k);
      mats.glass.color.copy(glass);
    },
    dispose() {
      for (const r of rooms.values()) disposeInterior(r);
      rooms.clear();
      if (mats) for (const m of Object.values(mats)) (m as THREE.Material).dispose();
      mats = null;
      ctx = null;
    },
  };
})();
