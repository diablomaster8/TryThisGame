import { describe, expect, it } from 'vitest';
import { EXPEDITION, EXPEDITION3D, RACE3D } from '../../src/config/tuning';
import {
  chasePosition,
  ease,
  frameCamera,
  hillHeight,
  laneZ,
  racerY,
  ringSlot,
  runnerWorld,
  sectionSpans,
  selectMinigameView,
  thingWorld,
  trackHeight,
} from '../../src/render3d/minigame-layout';
import { COURSES, courseLength } from '../../src/sim/race';

describe('minigame view selection', () => {
  it('opens the 3D view only in Full 3D with the scene loaded', () => {
    expect(selectMinigameView('3d', true)).toBe('3d');
    expect(selectMinigameView('3d', false)).toBe('pixel');
    expect(selectMinigameView('pixel', true)).toBe('pixel');
    expect(selectMinigameView('pixel', false)).toBe('pixel');
  });
});

describe('expedition world mapping', () => {
  it('puts the runner on the ground line at the start and lifts it with a jump', () => {
    const start = runnerWorld(0, EXPEDITION.groundY);
    expect(start.x).toBeCloseTo(EXPEDITION.runnerX * EXPEDITION3D.unitsPerPx);
    expect(start.y).toBeCloseTo(0);
    const up = runnerWorld(100, EXPEDITION.groundY - 26);
    expect(up.y).toBeCloseTo(1);
    expect(up.x).toBeGreaterThan(start.x);
  });

  it('maps a thing to its box centre, y up from the ground line', () => {
    const t = { x: 260, y: EXPEDITION.groundY - 14, w: 18, h: 14 };
    const w = thingWorld(t);
    expect(w.x).toBeCloseTo(269 * EXPEDITION3D.unitsPerPx);
    expect(w.y).toBeCloseTo(7 * EXPEDITION3D.unitsPerPx);
  });

  it('recycles ring items so they always cover the stretch around the camera', () => {
    const count = 6;
    const spacing = 5;
    for (const camX of [0, 3, 17, 100, 1234.5]) {
      const xs = Array.from({ length: count }, (_, i) => ringSlot(i, count, spacing, camX, 8)).sort(
        (a, b) => a - b,
      );
      expect(xs[0]).toBeGreaterThanOrEqual(camX - 8);
      expect(xs[0]).toBeLessThan(camX - 8 + spacing);
      for (let i = 1; i < count; i++) expect(xs[i]! - xs[i - 1]!).toBeCloseTo(spacing);
    }
  });

  it('keeps hills within their rise and never below the ground', () => {
    for (let x = -200; x < 200; x += 0.7) {
      const h = hillHeight(x, 3, 12);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(3);
    }
  });
});

describe('race track layout', () => {
  it('lays sections end to end and climbs stay up', () => {
    const cliffs = COURSES.find((c) => c.id === 'cliffs')!;
    const spans = sectionSpans(cliffs);
    expect(spans.length).toBe(cliffs.sections.length);
    expect(spans[spans.length - 1]!.end).toBe(courseLength(cliffs));
    for (let i = 1; i < spans.length; i++) {
      expect(spans[i]!.start).toBe(spans[i - 1]!.end);
      expect(spans[i]!.y0).toBe(spans[i - 1]!.y1);
    }
    const climbs = spans.filter((s) => s.kind === 'climb').length;
    expect(trackHeight(spans, courseLength(cliffs) + 5)).toBeCloseTo(climbs * RACE3D.climbRise);
    expect(trackHeight(spans, -3)).toBe(0);
    // Half way up the first climb.
    const climb = spans.find((s) => s.kind === 'climb')!;
    expect(trackHeight(spans, (climb.start + climb.end) / 2)).toBeCloseTo(
      climb.y0 + RACE3D.climbRise / 2,
    );
  });

  it('is flat on a course without climbs', () => {
    const meadow = COURSES.find((c) => c.id === 'meadow')!;
    const spans = sectionSpans(meadow);
    for (let p = 0; p < courseLength(meadow); p += 0.5) expect(trackHeight(spans, p)).toBe(0);
  });

  it('stacks lanes away from the camera and places racers by section', () => {
    expect(laneZ(0)).toBe(0);
    expect(laneZ(3)).toBeCloseTo(-3 * RACE3D.laneGap);
    expect(racerY('run', 1, false)).toBe(1);
    expect(racerY('fly', 1, false)).toBeCloseTo(1 + RACE3D.flyLift);
    expect(racerY('fly', 1, true)).toBeLessThan(1 + RACE3D.flyLift);
    expect(racerY('swim', 0, false)).toBeLessThan(RACE3D.waterLevel);
  });
});

describe('chase camera framing', () => {
  const o = { span: 16, minSpan: 8.5, fovDeg: 42 };

  it('frames the span in landscape at the base lens', () => {
    const f = frameCamera(16 / 9, o);
    expect(f.fovDeg).toBe(42);
    const halfV = Math.tan((42 * Math.PI) / 360);
    expect(2 * f.distance * halfV * (16 / 9)).toBeCloseTo(16);
  });

  it('keeps the distance in portrait and widens the lens to the least span', () => {
    const wide = frameCamera(1.25, o);
    const tall = frameCamera(375 / 812, o);
    expect(tall.distance).toBeCloseTo(wide.distance);
    expect(tall.fovDeg).toBeGreaterThan(42);
    const halfV = Math.tan((tall.fovDeg * Math.PI) / 360);
    expect(2 * tall.distance * halfV * (375 / 812)).toBeCloseTo(8.5);
  });

  it('places the camera toward the viewer and above the look point', () => {
    const p = chasePosition({ x: 3, y: 1, z: 0 }, 10, 30);
    expect(p.x).toBe(3);
    expect(p.y).toBeCloseTo(1 + 5);
    expect(p.z).toBeCloseTo(10 * Math.cos(Math.PI / 6));
  });

  it('eases toward a target and never overshoots', () => {
    let x = 0;
    for (let i = 0; i < 100; i++) x = ease(x, 10, 7, 1 / 60);
    expect(x).toBeGreaterThan(9.9);
    expect(x).toBeLessThanOrEqual(10);
    expect(ease(5, 5, 7, 0.1)).toBe(5);
  });
});
