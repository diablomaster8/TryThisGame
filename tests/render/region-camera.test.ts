/**
 * R0125 (WORLD-59): camera presets per region. The data keeps the caves on the Hollow's
 * framing and every Pixel zoom step a whole-number ratio of the art's; the Pixel camera takes
 * a region's zoom steps and gives them back; a region with no entry gets the defaults.
 * Also R0126 (WORLD-60): a landscape phone's frame shows at least 45 u across and 20 u deep
 * at the far zoom.
 */
import { describe, expect, it } from 'vitest';
import { REGION_CAMERA, regionCameraFor } from '../../src/config/region-camera';
import { CAMERA, READ3D } from '../../src/config/tuning';
import { OrbitCamera } from '../../src/render/camera';
import { computeTargetSize } from '../../src/render/pipeline';
import { NATIVE_PPU } from '../../src/render/sprite-batch';

describe('region camera presets (WORLD-59)', () => {
  it('keeps the caves on the Hollow framing and the Pixel steps on whole ratios', () => {
    expect(regionCameraFor('hollow').pitchDeg3d).toBe(READ3D.hollow.pitchDeg);
    expect(regionCameraFor('hollow').distanceK3d).toBe(READ3D.hollow.distanceK);
    expect(regionCameraFor('peaks').pitchDeg3d).toBe(30);
    expect(regionCameraFor('peaks').distanceK3d).toBeCloseTo(1.2, 6);
    expect(regionCameraFor('wood').canopyCut).toBe(true);
    expect(regionCameraFor('lane')).toEqual({});
    for (const preset of Object.values(REGION_CAMERA)) {
      for (const ppu of preset?.zooms ?? []) expect(Number.isInteger(NATIVE_PPU / ppu)).toBe(true);
    }
  });

  it("takes a region's Pixel zoom steps and gives them back", () => {
    const cam = new OrbitCamera();
    cam.reduceMotion = true;
    cam.setFrame(249, 540);
    cam.setZoom(0, 0);
    const wide = cam.visibleWidth;
    expect(cam.pixelsPerUnit).toBe(CAMERA.pixelsPerUnit[0]);
    cam.setRegionZooms(regionCameraFor('peaks').zooms ?? null, 0);
    cam.update(1000);
    expect(cam.pixelsPerUnit).toBe(8);
    expect(cam.visibleWidth).toBeCloseTo(wide * 2, 6);
    cam.setRegionZooms(null, 0);
    cam.update(2000);
    expect(cam.pixelsPerUnit).toBe(CAMERA.pixelsPerUnit[0]);
    expect(cam.visibleWidth).toBeCloseTo(wide, 6);
  });
});

describe('landscape phones (WORLD-60)', () => {
  it('shows at least 45 u across and 20 u deep at 812 x 375, far zoom', () => {
    const size = computeTargetSize(812, 375);
    expect(size.scale).toBe(1);
    const cam = new OrbitCamera();
    cam.reduceMotion = true;
    cam.setFrame(size.width, size.height);
    cam.setZoom(0, 0);
    cam.update(1000);
    expect(cam.visibleWidth).toBeGreaterThanOrEqual(45);
    expect(cam.visibleHeight / Math.sin(cam.pitch)).toBeGreaterThanOrEqual(20);
  });
});
