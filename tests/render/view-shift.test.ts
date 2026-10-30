import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { applyViewShift, clearShift, easeShift, NO_SHIFT } from '../../src/render/view-shift';

// HOT-1: the selected Nubbin sits at the centre of the part of the screen the sheet leaves clear.
describe('HOT-1 view shift', () => {
  it('centres in the strip left of a docked sheet, or above a bottom sheet', () => {
    // Desktop: the sheet docks on the right from x = 900 of 1280.
    expect(clearShift(1280, 800, { left: 900, top: 0, right: 1280, bottom: 800 })).toEqual({
      x: (450 - 640) / 1280,
      y: 0,
    });
    // Phone: a bottom sheet from y = 380 of 812.
    const s = clearShift(375, 812, { left: 0, top: 380, right: 375, bottom: 812 });
    expect(s.x).toBe(0);
    expect(s.y).toBeCloseTo((406 - 190) / 812);
    expect(clearShift(375, 812, null)).toEqual(NO_SHIFT);
  });

  it('puts the aimed-at point where the shift says, in both camera kinds', () => {
    for (const cam of [
      new OrthographicCamera(-8, 8, 5, -5, 0.1, 100),
      new PerspectiveCamera(40, 1.6, 0.1, 100),
    ]) {
      cam.position.set(0, 10, 10);
      cam.lookAt(0, 0, 0);
      cam.updateMatrixWorld();
      const aspect = 'aspect' in cam ? cam.aspect : 1;
      applyViewShift(cam, { x: -0.15, y: 0.2 });
      if ('aspect' in cam) expect(cam.aspect).toBe(aspect);
      const p = new Vector3(0, 0, 0).project(cam);
      // NDC runs -1..1, so a share of the view is twice that in NDC.
      expect(p.x).toBeCloseTo(-0.3);
      expect(p.y).toBeCloseTo(0.4);
      applyViewShift(cam, NO_SHIFT);
      expect(cam.view?.enabled ?? false).toBe(false);
    }
  });

  it('eases and lands exactly', () => {
    let s = { x: 0.2, y: 0 };
    for (let i = 0; i < 200; i++) s = easeShift(s, NO_SHIFT, 0.1);
    expect(s).toBe(NO_SHIFT);
  });
});
