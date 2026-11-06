import { describe, expect, it } from 'vitest';
import { PHOTO3D } from '../../src/config/tuning-photo3d';
import {
  clampCam,
  FACE_SET,
  formation,
  rigPose,
  yawToward,
  type PhotoCam,
} from '../../src/render3d/photo-cam';
import { filterPixels } from '../../src/ui/photo-look';
import { placeOnShelf, readShelf, SHELF } from '../../src/ui/shelf';

// R0412 (LOOK-56) photo mode and R0440 (LOOK-72) shelf: the pure parts.
describe('photo mode camera and subjects', () => {
  it('clamps tilt, distance and roll to the mode limits', () => {
    const k = PHOTO3D.camera;
    const c: PhotoCam = {
      target: { x: 0, y: 0, z: 0 },
      yaw: 0,
      tiltDeg: 200,
      dist: 0.01,
      rollDeg: -90,
      dof: false,
    };
    clampCam(c);
    expect(c.tiltDeg).toBe(k.tiltMax);
    expect(c.dist).toBe(k.distMin);
    expect(c.rollDeg).toBe(-k.rollMax);
  });

  it('lays a row across the view, the first one in the middle, evenly spaced', () => {
    const at = formation('row', 3, { x: 1, z: 2 }, 0);
    expect(at[0]).toEqual({ x: 1, z: 2 });
    const xs = at.map((p) => p.x).sort((a, b) => a - b);
    expect(xs[1]! - xs[0]!).toBeCloseTo(PHOTO3D.group.spacing);
    // Yaw 0 looks down -z: the row runs along x and keeps z.
    for (const p of at) expect(p.z).toBeCloseTo(2);
  });

  it('puts up to eight in a circle round the centre', () => {
    const at = formation('circle', 8, { x: 0, z: 0 }, 0.3);
    expect(at).toHaveLength(8);
    const r = Math.hypot(at[0]!.x, at[0]!.z);
    for (const p of at) expect(Math.hypot(p.x, p.z)).toBeCloseTo(r);
  });

  it('faces a subject toward a point', () => {
    expect(yawToward(0, 0, 0, 5)).toBeCloseTo(0);
    expect(yawToward(0, 0, 5, 0)).toBeCloseTo(Math.PI / 2);
  });

  it('maps the picker poses and faces', () => {
    expect(rigPose('own')).toBeUndefined();
    expect(rigPose('wave')).toBe('idle');
    expect(rigPose('sit')).toBe('sit');
    expect(FACE_SET.wink?.wink).toBe(true);
    expect(FACE_SET.own).toBeNull();
  });
});

describe('photo filters', () => {
  it('sepia makes grey-brown, warm lifts red over blue, none changes nothing', () => {
    const px = () => new Uint8ClampedArray([40, 120, 200, 255]);
    const s = px();
    filterPixels(s, 'sepia');
    expect(s[0]!).toBeGreaterThan(s[2]!);
    const w = px();
    filterPixels(w, 'warm');
    expect(w[0]!).toBeGreaterThan(40);
    expect(w[2]!).toBeLessThan(200);
    const n = px();
    filterPixels(n, 'none');
    expect([...n]).toEqual([40, 120, 200, 255]);
  });

  it('film grain is the same for the same seed', () => {
    const a = new Uint8ClampedArray(64).fill(128);
    const b = new Uint8ClampedArray(64).fill(128);
    filterPixels(a, 'film', 42);
    filterPixels(b, 'film', 42);
    expect([...a]).toEqual([...b]);
  });
});

describe('the shelf', () => {
  it('has three shelves of eight, empty without storage', () => {
    const s = readShelf({ seed: 1 });
    expect(s).toHaveLength(SHELF.rows * SHELF.slots);
    expect(s.every((x) => x === null)).toBe(true);
  });

  it('places, moves and swaps figures', () => {
    let s = readShelf({ seed: 1 });
    s = placeOnShelf(s, 'chao:sun:run', 0, null);
    s = placeOnShelf(s, 'nubbin:n1', 5, null);
    expect(s[0]).toBe('chao:sun:run');
    // Moving slot 5 onto slot 0 swaps them.
    s = placeOnShelf(s, 'nubbin:n1', 0, 5);
    expect(s[0]).toBe('nubbin:n1');
    expect(s[5]).toBe('chao:sun:run');
    // Moving onto an empty slot leaves the old one empty.
    s = placeOnShelf(s, 'nubbin:n1', 9, 0);
    expect(s[0]).toBeNull();
    expect(s[9]).toBe('nubbin:n1');
  });
});
