import { describe, expect, it } from 'vitest';
import { PIXEL_GOV, RENDER } from '../../src/config/tuning';
import { computeTargetSize } from '../../src/render/pipeline';
import { PixelGovernor } from '../../src/render/pixel-gov';
import { PIXEL_WIND, windSway } from '../../src/render/wind-px';

/** TECH-53: Pixel mode under a light frame governor. */
describe('Pixel governor', () => {
  it('sheds particles, wind, weather, then the frame height, in that order', () => {
    const g = new PixelGovernor(false);
    const seen: number[] = [];
    for (let i = 0; i < 600; i++) {
      if (g.sample(50, i * 50) && !seen.includes(g.level)) seen.push(g.level);
    }
    expect(seen).toEqual([1, 2, 3, 4]);
    for (const name of PIXEL_GOV.order) expect(g.sheds(name)).toBe(true);
    expect(g.targetHeight).toBe(PIXEL_GOV.smallHeight);
    expect(g.particles('full')).toBe('light');
    expect(g.particles('off')).toBe('off');
  });

  it('keeps everything on a device that holds 30 fps, and gives steps back when easy', () => {
    const g = new PixelGovernor(false);
    for (let i = 0; i < 2000; i++) g.sample(28, i * 28);
    expect(g.level).toBe(0);
    expect(g.targetHeight).toBe(RENDER.targetHeight);
    for (let i = 0; i < 100; i++) g.sample(50, i * 50);
    expect(g.level).toBeGreaterThan(0);
    for (let i = 0; i < 5000; i++) g.sample(10, i * 10);
    expect(g.level).toBe(0);
  });

  it('draws the small frame at a whole-number upscale', () => {
    const s = computeTargetSize(1920, 1080, PIXEL_GOV.smallHeight);
    expect(Number.isInteger(s.scale)).toBe(true);
    expect(s.height).toBeLessThanOrEqual(computeTargetSize(1920, 1080).height);
  });

  it('holds the wind lean without the sway once shed', () => {
    PIXEL_WIND.lean = 0.5;
    PIXEL_WIND.shed = true;
    expect(windSway(1, 0)).toBe(windSway(1, 10_000));
    PIXEL_WIND.shed = false;
    PIXEL_WIND.lean = 0;
  });
});
