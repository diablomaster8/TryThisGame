/**
 * Pure maths for the compass and the minimap (R0082, R0083): bearings on the rose, which
 * rim ticks to show, and when the minimap is on. No DOM, so tests can run it.
 *
 * Conventions: world north is -z; the camera sits at target + (sin yaw, cos yaw) and looks
 * toward (-sin yaw, -cos yaw), which is "up" on screen. Angles here are clockwise from up.
 */

export interface Pt {
  x: number;
  z: number;
}

const TAU = Math.PI * 2;

/** Wrap to [0, 2pi). */
export function wrapAngle(a: number): number {
  return ((a % TAU) + TAU) % TAU;
}

/** Clockwise angle from screen-up at which the world direction (dx, dz) appears. */
export function screenBearing(dx: number, dz: number, yaw: number): number {
  const right = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  const forward = -dx * Math.sin(yaw) - dz * Math.cos(yaw);
  return wrapAngle(Math.atan2(right, forward));
}

/** Where `to` lies from `from` on the rose, clockwise from up, in radians. */
export function bearingOnRose(from: Pt, to: Pt, yaw: number): number {
  return screenBearing(to.x - from.x, to.z - from.z, yaw);
}

/** How far the rose's north marker is turned from up: north (0, -1) seen at this yaw. */
export function roseAngle(yaw: number): number {
  return screenBearing(0, -1, yaw);
}

export type TickKind = 'home' | 'landmark' | 'objective';

export interface Tick {
  kind: TickKind;
  /** Clockwise from up, radians. */
  angle: number;
}

/** The nearest of `landmarks` not yet found and within `range`, or null. */
export function nearestUnfound(
  from: Pt,
  landmarks: readonly { id: string; x: number; z: number }[],
  found: Readonly<Record<string, number | undefined>>,
  range: number,
): { id: string; x: number; z: number } | null {
  let best: { id: string; x: number; z: number } | null = null;
  let bestD = range;
  for (const l of landmarks) {
    if (found[l.id] !== undefined) continue;
    const d = Math.hypot(l.x - from.x, l.z - from.z);
    if (d <= bestD) {
      best = l;
      bestD = d;
    }
  }
  return best;
}

export interface TickInput {
  inGrove: boolean;
  keeper: Pt;
  yaw: number;
  landmarks: readonly { id: string; x: number; z: number }[];
  found: Readonly<Record<string, number | undefined>>;
  range: number;
  maxTicks: number;
  /** A tracked objective's place, when something exposes one (none does yet). */
  objective?: Pt | null;
}

/** The rim ticks to draw, at most `maxTicks`. */
export function compassTicks(i: TickInput): Tick[] {
  const out: Tick[] = [];
  if (!i.inGrove) {
    // Away from the Grove no direction home is known: the house sits at the rim's foot.
    out.push({ kind: 'home', angle: Math.PI });
  } else {
    const near = nearestUnfound(i.keeper, i.landmarks, i.found, i.range);
    if (near) out.push({ kind: 'landmark', angle: bearingOnRose(i.keeper, near, i.yaw) });
  }
  if (i.objective)
    out.push({ kind: 'objective', angle: bearingOnRose(i.keeper, i.objective, i.yaw) });
  return out.slice(0, i.maxTicks);
}

export type MinimapMode = 'off' | 'on' | 'auto';

/** The minimap setting as read from a save: an older save has none, so it means Auto. */
export function minimapModeOf(v: unknown): MinimapMode {
  return v === 'off' || v === 'on' || v === 'auto' ? v : 'auto';
}

/**
 * Whether the minimap shows. It draws the Grove, so it needs the Grove; Auto also needs a
 * screen tall enough to spare the corner; the Learning Grove's sprout band never has it.
 */
export function minimapVisible(
  mode: MinimapMode,
  inGrove: boolean,
  viewportHeight: number,
  autoMinHeight: number,
  sprout: boolean,
): boolean {
  if (sprout || !inGrove || mode === 'off') return false;
  return mode === 'on' || viewportHeight >= autoMinHeight;
}
