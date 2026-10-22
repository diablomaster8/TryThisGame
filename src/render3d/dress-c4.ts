import type * as THREE from 'three';
import { CG4_C4 } from '../config/tuning';
import { OCCLUDE, shadowHides } from './building-kit';
import type { Dress3dCtx, Dressing3d } from './dressings';

/**
 * Campaign graphics 4, package c4, Full 3D.
 * - K2: hidden buildings cast no shadow. Every shadow-casting building-kit mesh gets the
 *   hide-aware depth material (`shadowHides` in building-kit.ts); the scene is swept again
 *   now and then, since story sets and houses build late. (Taps: `dress-x.ts`.)
 */
export const dress3dC4: Dressing3d = (() => {
  let ctx: Dress3dCtx | null = null;
  let sweepIn = 0;
  let lastHides = -1;

  const sweep = (root: THREE.Object3D): void => {
    shadowHides(root);
    sweepIn = CG4_C4.shadowSweepS;
  };

  return {
    id: 'c4',
    build(c) {
      ctx = c;
      sweep(c.scene);
    },
    update(_world, _stage, _daylight, dt) {
      if (!ctx) return;
      sweepIn -= dt;
      // A building hidden for the first time sweeps at once (its set may have just built).
      const hides = OCCLUDE.hides.value;
      if (sweepIn <= 0 || (hides > 0 && lastHides === 0)) sweep(ctx.scene);
      lastHides = hides;
    },
  };
})();
