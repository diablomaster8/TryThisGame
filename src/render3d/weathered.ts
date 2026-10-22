import { Color } from 'three';
import { cloneSpec } from '../samples/nubbin-variants';
import type { SpeciesSpec } from '../samples/species';
import { CG2_P } from '../config/tuning-p';

/**
 * C6 in Full 3D: Moss as "the grey shape". Every prim and mark colour goes to a moss-grey of
 * the same luminance (Tears of the Kingdom's weathered statues), with a stone speckle: each
 * piece is lifted or sunk a little by a fixed hash of its place in the spec, so the surface
 * reads as lichened stone and not as a flat grey. The eyes keep their iris. The look key
 * modifier `~weathered` (render3d/looks.ts) runs this once per key; the sculpt worker builds
 * the same spec from the key, and the colour returns the moment the key drops it.
 */
export function weathered(base: SpeciesSpec): SpeciesSpec {
  const spec = cloneSpec(base);
  const W = CG2_P.weathered;
  const stone = new Color(W.stone);
  const c = new Color();
  let n = 0;
  const grey = (hex: string): string => {
    c.set(hex);
    const l = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
    const h = (Math.imul(++n, 2654435761) >>> 0) % 97;
    const speck = h < 18 ? -W.speckle : h < 30 ? W.speckle : 0;
    return `#${c
      .copy(stone)
      .multiplyScalar(Math.max(0.1, W.lift + l * W.gain + speck))
      .getHexString()}`;
  };
  const prims = spec.torso.prims.concat(spec.head.prims);
  for (const part of spec.parts) prims.push(...part.prims, ...(part.joint?.prims ?? []));
  for (const p of prims) p.color = grey(p.color);
  for (const m of spec.marks) m.color = grey(m.color);
  if (spec.ball) spec.ball = { ...spec.ball, color: grey(spec.ball.color) };
  return spec;
}
