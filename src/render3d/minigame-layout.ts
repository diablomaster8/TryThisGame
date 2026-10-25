import { EXPEDITION, EXPEDITION3D, RACE3D } from '../config/tuning';
import type { GraphicsMode } from '../sim/types';
import type { Course, SectionKind } from '../sim/race';

/**
 * The pure maths behind the Full 3D Expedition and races (G17): which view a minigame
 * opens with, how a run's low-res pixels and a race's track units map to world units,
 * where the lanes lie, how the race track rises and dips by section, and how the chase
 * camera frames a span of track at any screen aspect. No Three.js here, so the tests
 * run without a GPU and the pixel views stay untouched.
 */

/** Which view a minigame opens with: 3D only when the setting says so and the scene is up. */
export function selectMinigameView(graphics: GraphicsMode, scene3dReady: boolean): 'pixel' | '3d' {
  return graphics === '3d' && scene3dReady ? '3d' : 'pixel';
}

// ---------------------------------------------------------------- expedition

/** The runner's world position: x along the track, y above the ground line. */
export function runnerWorld(distance: number, runnerY: number): { x: number; y: number } {
  const u = EXPEDITION3D.unitsPerPx;
  return { x: (distance + EXPEDITION.runnerX) * u, y: (EXPEDITION.groundY - runnerY) * u };
}

/** A thing's world centre from its low-res box (x,y is the box's top-left in the run). */
export function thingWorld(t: { x: number; y: number; w: number; h: number }): {
  x: number;
  y: number;
} {
  const u = EXPEDITION3D.unitsPerPx;
  return { x: (t.x + t.w / 2) * u, y: (EXPEDITION.groundY - t.y - t.h / 2) * u };
}

/**
 * Where a recycled item of a ring sits for a camera at `camX`: the ring's `count` items,
 * `spacing` apart, always cover the stretch from `behind` units before the camera to the
 * rest ahead of it. Item `i` keeps its own slot, so nothing visibly jumps except far
 * behind the camera, where it is recycled to the front.
 */
export function ringSlot(
  i: number,
  count: number,
  spacing: number,
  camX: number,
  behind: number,
): number {
  const span = count * spacing;
  const first = camX - behind;
  const base = Math.floor((first - i * spacing) / span) * span + i * spacing;
  return base < first ? base + span : base;
}

/**
 * Height of a hill row at x: two sines of one period, so a ribbon one period long tiles
 * seamlessly as the camera moves on, and no two bumps look alike within it.
 */
export function hillHeight(x: number, rise: number, period: number): number {
  const a = (x / period) * Math.PI * 2;
  return rise * (0.55 + 0.35 * Math.sin(a) + 0.1 * Math.sin(a * 3 + 1.3));
}

// ---------------------------------------------------------------- race

export interface SectionSpan {
  kind: SectionKind;
  /** Track units. */
  start: number;
  end: number;
  /** Track height at the start and the end (climbs rise across the section). */
  y0: number;
  y1: number;
}

/** The course's sections with their track positions and heights, in order. */
export function sectionSpans(course: Course): SectionSpan[] {
  const out: SectionSpan[] = [];
  let start = 0;
  let y = 0;
  for (const s of course.sections) {
    const y1 = s.kind === 'climb' ? y + RACE3D.climbRise : y;
    out.push({ kind: s.kind, start, end: start + s.length, y0: y, y1 });
    start += s.length;
    y = y1;
  }
  return out;
}

/** The track's height at a track position: flat, except that climbs ramp up and stay up. */
export function trackHeight(spans: SectionSpan[], pos: number): number {
  if (spans.length === 0) return 0;
  if (pos <= 0) return spans[0]!.y0;
  for (const s of spans) {
    if (pos < s.end) {
      const k = s.end > s.start ? (pos - s.start) / (s.end - s.start) : 1;
      return s.y0 + (s.y1 - s.y0) * k;
    }
  }
  return spans[spans.length - 1]!.y1;
}

/** The depth of a lane: lane 0 nearest the camera, the rest stacked away from it. */
export function laneZ(lane: number): number {
  return lane === 0 ? 0 : -lane * RACE3D.laneGap;
}

/**
 * Where a racer's body sits: on the track, lifted over a gap, sunk in the water. The
 * track height is the ground for a runner and a climber; a flyer hovers `flyLift` above
 * it; a swimmer's feet are at the channel's surface less the sink. A resting racer stands
 * on whatever is under it (a resting flyer lands on the gap's far ground height, as the
 * track has no floor there, so it floats at the surface of the pit instead).
 */
export function racerY(kind: SectionKind, trackY: number, resting: boolean): number {
  if (kind === 'fly') return trackY + (resting ? RACE3D.flyLift * 0.6 : RACE3D.flyLift);
  if (kind === 'swim') return trackY + RACE3D.waterLevel - RACE3D.swimSink;
  return trackY;
}

// ---------------------------------------------------------------- name tags

export interface TagRect {
  /** Centre and size on screen, in pixels (y down). */
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Lift name tags so no two screen rectangles intersect: the lowest tag on screen (the
 * nearest racer) keeps its place, each higher one is raised until it clears every tag
 * already placed, and a lift that lands on another tag is raised again. Returns the lift
 * per tag in pixels (0 or more, up the screen), in the input order.
 */
export function stackTags(tags: TagRect[], gapPx = 2): number[] {
  const order = tags.map((t, i) => i).sort((a, b) => tags[b]!.y - tags[a]!.y);
  const placed: TagRect[] = [];
  const lift = tags.map(() => 0);
  for (const i of order) {
    const t = tags[i]!;
    let y = t.y;
    for (let moved = true, n = 0; moved && n < 32; n++) {
      moved = false;
      for (const p of placed) {
        const dx = Math.abs(p.x - t.x);
        const dy = Math.abs(p.y - y);
        if (dx < (p.w + t.w) / 2 && dy < (p.h + t.h) / 2 + gapPx) {
          y = p.y - (p.h + t.h) / 2 - gapPx;
          moved = true;
        }
      }
    }
    placed.push({ x: t.x, y, w: t.w, h: t.h });
    lift[i] = t.y - y;
  }
  return lift;
}

// ---------------------------------------------------------------- camera

export interface CameraFrame {
  /** Vertical field of view in degrees (widened in portrait). */
  fovDeg: number;
  /** Distance from the camera to the point it looks at. */
  distance: number;
}

/**
 * Frame `height` world units top to bottom at the look point (so a one-unit figure is
 * 1/height of the screen), whatever the aspect; when that shows fewer than `minSpan`
 * units across (portrait), keep the distance and widen the lens until it does.
 */
export function frameCamera(
  aspect: number,
  o: { height: number; minSpan: number; fovDeg: number },
): CameraFrame {
  const a = Math.max(0.1, aspect);
  const halfV = Math.tan((o.fovDeg * Math.PI) / 360);
  const distance = o.height / 2 / halfV;
  const shown = o.height * a;
  if (shown >= o.minSpan) return { fovDeg: o.fovDeg, distance };
  const halfH = o.minSpan / 2 / distance;
  return { fovDeg: (Math.atan(halfH / a) * 360) / Math.PI, distance };
}

/**
 * The camera's position for a chase view: `distance` from the look point, tilted down
 * by `pitchDeg`, toward +z (the viewer's side of a track laid along x).
 */
export function chasePosition(
  look: { x: number; y: number; z: number },
  distance: number,
  pitchDeg: number,
): { x: number; y: number; z: number } {
  const p = (pitchDeg * Math.PI) / 180;
  return { x: look.x, y: look.y + distance * Math.sin(p), z: look.z + distance * Math.cos(p) };
}

/** An exponential ease toward a target over `dt` seconds at `rate` per second. */
export function ease(from: number, to: number, rate: number, dt: number): number {
  return from + (to - from) * (1 - Math.exp(-rate * Math.max(0, dt)));
}

/**
 * Where the 3D Expedition's chase camera looks on a tall screen: how far ahead of the runner
 * (a share of the half-width the lens frames) and how high above the track, so the track
 * sits `trackAt` of the way down the screen. `halfV` is half the height the lens frames at
 * the look distance. Landscape keeps the tuned numbers.
 */
export function portraitChase(
  aspect: number,
  halfSpan: number,
  halfV: number,
  cam: { lookAhead: number; lookHeight: number; pitchDeg: number },
  p: { aheadShare: number; trackAt: number },
): { lookAhead: number; lookHeight: number } {
  if (aspect >= 1) return { lookAhead: cam.lookAhead, lookHeight: cam.lookHeight };
  const tilt = Math.cos((cam.pitchDeg * Math.PI) / 180);
  return {
    lookAhead: Math.min(cam.lookAhead, halfSpan * p.aheadShare),
    lookHeight: ((p.trackAt - 0.5) * 2 * halfV) / tilt,
  };
}
