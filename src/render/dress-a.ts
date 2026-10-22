import type { DirectionalLight, HemisphereLight } from 'three';
import { CG_A } from '../config/tuning';
import type { PixelDressing } from './dressings';

/**
 * Campaign-graphics package a, pixel renderer (see the registry contract at the top of
 * render/dressings.ts). C2: the Hollow camp is lit at under half the Grove's fill and key,
 * which left it near black at night. Here both are held at a floor while the Keeper is in
 * the Hollow, so the ground reads at about a fifth of full brightness and the fire ring and
 * figures read. The scene resets its lights every few seconds; this runs every frame, so
 * the floor never steps. Nothing moves, so reduced motion needs no other form.
 */
let hemi: HemisphereLight | null = null;
let sun: DirectionalLight | null = null;

export const dressA: PixelDressing = {
  id: 'a',
  build(ctx) {
    hemi = null;
    sun = null;
    ctx.scene.traverse((o) => {
      if ((o as HemisphereLight).isHemisphereLight && !hemi) hemi = o as HemisphereLight;
      if ((o as DirectionalLight).isDirectionalLight && !sun) sun = o as DirectionalLight;
    });
  },
  update(world) {
    if (world.location !== 'hollow') return;
    const f = CG_A.pixelHollow;
    if (hemi) {
      hemi.color.set(f.color);
      hemi.intensity = Math.max(hemi.intensity, f.hemi);
    }
    if (sun) sun.intensity = Math.max(sun.intensity, f.sun);
  },
  dispose() {
    hemi = null;
    sun = null;
  },
};
