import { GROVE } from '../../config/tuning';
import { fbm } from './noise';

/**
 * The pond's shoreline: its radius is a noise function of the angle, so the bank
 * wanders like a real pond's. The ground painter and the water geometry both read it.
 */
const TABLE = 720;
let radii: Float32Array | null = null;

export function pondRadius(angle: number, grow = 0): number {
  if (!radii) {
    radii = new Float32Array(TABLE);
    for (let i = 0; i < TABLE; i++) {
      const a = (i / TABLE) * Math.PI * 2;
      const n = fbm(Math.cos(a) * 2 + 9, Math.sin(a) * 2 + 9, 4, 10);
      radii[i] = GROVE.pond.r * (1 + 0.14 * (n - 0.5) * 2);
    }
  }
  const i = ((Math.round((angle / (Math.PI * 2)) * TABLE) % TABLE) + TABLE) % TABLE;
  return (radii[i] ?? GROVE.pond.r) + grow;
}

/** Points around the shoreline, counter-clockwise, in world x/z. */
export function pondOutline(segments = 72, grow = 0): Array<{ x: number; z: number }> {
  const out: Array<{ x: number; z: number }> = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = pondRadius(a, grow);
    out.push({ x: GROVE.pond.x + Math.cos(a) * r, z: GROVE.pond.z + Math.sin(a) * r });
  }
  return out;
}

/** Signed distance-ish: how far inside (negative) or outside (positive) the shoreline a point is. */
export function shoreDistance(x: number, z: number): number {
  const dx = x - GROVE.pond.x;
  const dz = z - GROVE.pond.z;
  const d = Math.hypot(dx, dz);
  return d - pondRadius(Math.atan2(dz, dx));
}
