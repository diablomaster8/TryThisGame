import { describe, expect, it } from 'vitest';
import { CAMERA } from '../../src/config/tuning';
import { WORLD_SURVEY } from '../../src/config/tuning-world';
import { OrbitCamera } from '../../src/render/camera';
import { SPRITE_TOKENS } from '../../src/render/sprite-batch';

/** R0073: the survey zoom (index -1) and "Zoom out when running". */
function portraitPhone(): OrbitCamera {
  const cam = new OrbitCamera();
  cam.reduceMotion = true;
  // A 375 x 812 CSS portrait screen draws a 540-tall low-res frame about 249 wide.
  cam.setFrame(Math.round((540 * 375) / 812), 540);
  cam.setZoom(CAMERA.phoneZoomIndex, 0);
  return cam;
}

describe('survey zoom', () => {
  it('sits past the far step and shows at least 23 units across on a portrait phone', () => {
    const cam = portraitPhone();
    cam.zoomOut(0);
    cam.update(1000);
    expect(cam.currentZoomIndex).toBe(-1);
    expect(cam.survey).toBe(true);
    expect(cam.pixelsPerUnit).toBe(WORLD_SURVEY.pixelsPerUnit);
    expect(cam.visibleWidth).toBeGreaterThanOrEqual(23);
    expect(SPRITE_TOKENS.scale).toBe(WORLD_SURVEY.tokenScale);
    cam.zoomOut(0);
    expect(cam.currentZoomIndex).toBe(-1);
  });

  it('the zoom button goes nearer, then from the nearest round to the survey step', () => {
    const cam = portraitPhone();
    const seen: number[] = [];
    for (let i = 0; i < 4; i++) {
      cam.toggleZoom(0);
      seen.push(cam.currentZoomIndex);
    }
    expect(seen).toEqual([1, -1, 0, 1]);
  });

  it('pulls out after a long run and goes back once the run stops', () => {
    const cam = portraitPhone();
    cam.setZoom(1, 0);
    cam.runTick(true, 0);
    cam.runTick(true, WORLD_SURVEY.runMs - 1);
    expect(cam.currentZoomIndex).toBe(1);
    cam.runTick(true, WORLD_SURVEY.runMs);
    expect(cam.currentZoomIndex).toBe(-1);
    cam.runTick(false, WORLD_SURVEY.runMs + 10);
    expect(cam.currentZoomIndex).toBe(-1);
    cam.runTick(false, WORLD_SURVEY.runMs + 10 + WORLD_SURVEY.backMs);
    expect(cam.currentZoomIndex).toBe(1);
    cam.update(10_000);
    expect(SPRITE_TOKENS.scale).toBe(1);
  });

  it('keeps a zoom the player picks during the run', () => {
    const cam = portraitPhone();
    cam.setZoom(1, 0);
    cam.runTick(true, 0);
    cam.runTick(true, WORLD_SURVEY.runMs);
    cam.zoomIn(0);
    cam.runTick(false, 10_000);
    cam.runTick(false, 20_000);
    expect(cam.currentZoomIndex).toBe(0);
  });
});
