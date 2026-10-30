/**
 * LOOK-53 in Full 3D: a Nubbin's birthmark painted onto its sculpt as soft marks, from the
 * look key's `~mark:<kind>:<side>` (render/birthmark.ts decides it from the seed). Each mark
 * is a small volume sat on the head dome's surface; the sculpt bakes whatever it covers in
 * the mark's colour, and a later mark paints over an earlier one (the crescent is a pale
 * disc with a body-coloured one laid over its edge).
 */
import { Color, Vector3 } from 'three';
import { cloneSpec, paletteOf } from '../samples/nubbin-variants';
import { headDome } from '../samples/nubbin-critter-parts';
import type { Mark, SpeciesSpec } from '../samples/species';

export function withBirthmark(base: SpeciesSpec, mod: string): SpeciesSpec {
  const [kind, sideText] = mod.split(':');
  const side = sideText === '-1' ? -1 : 1;
  const spec = cloneSpec(base);
  const d = headDome(spec);
  const pal = paletteOf(base);
  const dark = `#${new Color(pal.body).multiplyScalar(0.62).getHexString()}`;
  // A point on the dome's front at (u, v) of its half-widths, pushed just inside the skin.
  const at = (u: number, v: number): Vector3 => {
    const w = Math.sqrt(Math.max(0, 1 - u * u - v * v));
    return new Vector3(d.c.x + u * d.rx, d.c.y + v * d.ry, d.c.z + w * d.rz * 0.98);
  };
  const dot = (u: number, v: number, r: number, color: string, soft = 0.02): Mark => ({
    kind: 'sphere',
    a: at(u, v),
    r: r * d.rx,
    color,
    soft,
  });
  const s = side;
  const marks: Mark[] = [];
  switch (kind) {
    case 'spots':
      marks.push(dot(0.62 * s, -0.05, 0.07, dark), dot(0.5 * s, -0.25, 0.05, dark));
      marks.push(dot(0.7 * s, -0.3, 0.045, dark));
      break;
    case 'freckles':
      for (const u of [-0.3, -0.15, 0.15, 0.3]) marks.push(dot(u, -0.32, 0.035, dark));
      break;
    case 'patch':
      marks.push(dot(0.45 * s, 0.55, 0.2, dark, 0.04));
      break;
    case 'stripe':
      marks.push({
        kind: 'capsule',
        a: at(-0.35, 0.78),
        b: at(0.35, 0.78),
        r: 0.07 * d.rx,
        color: dark,
        soft: 0.02,
      });
      break;
    case 'moon':
      marks.push(dot(0.6 * s, -0.1, 0.11, '#fff1c9'), dot(0.66 * s, -0.04, 0.1, pal.body));
      break;
    case 'notch':
      marks.push(dot(0.1, 0.97, 0.08, pal.crownShade));
      break;
    case 'star':
      for (const [u, v] of [
        [0, 0.5],
        [0.07, 0.5],
        [-0.07, 0.5],
        [0, 0.58],
        [0, 0.42],
      ] as const)
        marks.push(dot(u, v, 0.045, '#ffd94a', 0));
      break;
    case 'heart':
      marks.push(dot(-0.06, 0.53, 0.06, '#ff7a9a', 0), dot(0.06, 0.53, 0.06, '#ff7a9a', 0));
      marks.push(dot(0, 0.45, 0.06, '#ff7a9a', 0));
      break;
    default:
      return base;
  }
  spec.marks = [...spec.marks, ...marks];
  return spec;
}
