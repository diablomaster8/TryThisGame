import { describe, expect, it } from 'vitest';
import {
  cameraSubject,
  coopFrame,
  fitsView,
  lastMover,
  type Spot,
} from '../../src/render/camera-subject';
import { COOP_CAMERA } from '../../src/config/tuning-r18d2';
import { CAMERA, WORLD_SURVEY } from '../../src/config/tuning';

// R18 d2 (R0140): the two-Keeper camera subject.
const pitch = CAMERA.pitchRad;
const view = (frameW: number, ppu: number) => ({ w: frameW / ppu, h: 540 / ppu });
const frame = (
  a: Spot,
  b: Spot,
  mover: 1 | 2,
  v: ReturnType<typeof view>,
  out: typeof v | null,
  was = false,
) => coopFrame(a, b, mover, 0, pitch, v, out, was, COOP_CAMERA.enterFit, COOP_CAMERA.exitFit);

describe('co-op camera subject', () => {
  const a = { x: 0, z: 0 };
  it('close together: the midpoint, no zoom change', () => {
    const f = frame(a, { x: 3, z: 1 }, 1, view(960, 32), view(960, 16));
    expect(f).toEqual({ at: { x: 1.5, z: 0.5 }, framed: true, notch: false });
  });

  it('a little too far for this zoom: still the midpoint, one notch out', () => {
    const f = frame(a, { x: 24, z: 0 }, 2, view(960, 32), view(960, 16));
    expect(f.framed).toBe(true);
    expect(f.notch).toBe(true);
  });

  it('at the survey step there is no notch: far apart follows the Keeper moved last', () => {
    const far = { x: 200, z: 0 };
    expect(frame(a, far, 2, view(960, WORLD_SURVEY.pixelsPerUnit), null)).toMatchObject({
      at: far,
      framed: false,
    });
    expect(frame(a, far, 1, view(960, 16), view(960, 8)).at).toBe(a);
  });

  it('fits a 375x812 portrait view at every zoom, with margin', () => {
    for (const ppu of [32, 16, 8]) {
      const v = view(540 * (375 / 812), ppu);
      const within = { x: v.w * COOP_CAMERA.enterFit * 0.95, z: 0 };
      expect(fitsView(a, within, 0, pitch, v, COOP_CAMERA.enterFit)).toBe(true);
      expect(fitsView(a, { x: v.w * 0.8, z: 0 }, 0, pitch, v, COOP_CAMERA.enterFit)).toBe(false);
    }
  });

  it('hysteresis: framed stays framed a little past the entry distance', () => {
    const v = view(960, 32);
    const d = { x: v.w * 0.65, z: 0 };
    expect(frame(a, d, 1, v, null, false).framed).toBe(false);
    expect(frame(a, d, 1, v, null, true).framed).toBe(true);
  });

  it('the Keeper moved last is the one whose input began most recently', () => {
    const off = { k1: false, k2: false };
    expect(lastMover(1, off, { k1: false, k2: true })).toBe(2);
    expect(lastMover(2, { k1: false, k2: true }, { k1: true, k2: true })).toBe(1);
    expect(lastMover(2, { k1: false, k2: true }, { k1: false, k2: false })).toBe(2);
    expect(lastMover(1, { k1: true, k2: false }, { k1: true, k2: true })).toBe(2);
  });

  it('dialogue and co-op off: the subject rule is unchanged', () => {
    const k: Spot = { x: 1, z: 2 };
    const hazel: Spot = { x: 5, z: -3 };
    expect(cameraSubject(k, 'hazel', () => hazel)).toEqual({ at: hazel, talker: true });
    expect(cameraSubject(k, null, () => hazel)).toEqual({ at: k, talker: false });
  });
});
