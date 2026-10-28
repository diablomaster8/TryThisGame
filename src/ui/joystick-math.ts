/**
 * The pure parts of the floating joystick: the speed curve, the screen-to-world turn with
 * the camera's current yaw, and the recentring of a pad that the thumb drags too far.
 * No DOM here, so tests can run it.
 */
import { JOYSTICK_TUNING as J } from '../config/tuning-move-joy';

export interface Pt {
  x: number;
  y: number;
}

const smoothstep = (a: number, b: number, v: number): number => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Pace (0..1) for a stick length (0..1): none in the dead zone, full near the rim. */
export function stickSpeed(len: number): number {
  return smoothstep(J.deadZone, J.fullAt, len);
}

/**
 * Stick vector in screen space (x right, y down, in units of the throw radius, length at
 * most 1) turned into a ground vector for the camera at `yaw`. The length is the pace, so
 * a light touch gives a short vector. Same maths as the keyboard poll.
 */
export function stickToWorld(sx: number, sy: number, yaw: number): { x: number; z: number } {
  const raw = Math.hypot(sx, sy);
  if (raw === 0) return { x: 0, z: 0 };
  const pace = stickSpeed(Math.min(1, raw));
  if (pace === 0) return { x: 0, z: 0 };
  const fwd = (-sy / raw) * pace;
  const right = (sx / raw) * pace;
  return {
    x: -Math.sin(yaw) * fwd + Math.cos(yaw) * right,
    z: -Math.cos(yaw) * fwd - Math.sin(yaw) * right,
  };
}

/**
 * Where the thumb is against the pad: the knob offset clamped to the radius, the stick
 * vector in radius units, and the centre, which follows the thumb once it is dragged past
 * `recentreAt` radii so the pad never ends up far from it.
 */
export function stickState(centre: Pt, thumb: Pt): { centre: Pt; knob: Pt; vec: Pt; len: number } {
  let dx = thumb.x - centre.x;
  let dy = thumb.y - centre.y;
  const dist = Math.hypot(dx, dy);
  let c = centre;
  const limit = J.radius * J.recentreAt;
  if (dist > limit) {
    const k = (dist - limit) / dist;
    c = { x: centre.x + dx * k, y: centre.y + dy * k };
    dx = thumb.x - c.x;
    dy = thumb.y - c.y;
  }
  const d = Math.hypot(dx, dy);
  const s = d > J.radius ? J.radius / d : 1;
  const knob = { x: dx * s, y: dy * s };
  const vec = { x: knob.x / J.radius, y: knob.y / J.radius };
  return { centre: c, knob, vec, len: Math.min(1, d / J.radius) };
}

/** True when a touch at (x, y) lands in the pad zone: left share of the screen, under the top bar. */
export function inPadZone(x: number, y: number, width: number, topBarBottom: number): boolean {
  return x <= width * J.zoneWidth && y > topBarBottom;
}
