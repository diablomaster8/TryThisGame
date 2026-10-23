import { STAGE4, type MarkFit } from '../config/tuning';
import type { Vec2 } from '../sim/types';

/**
 * K3: people before props. A framed point carries a weight (cast 1, prop 0.5, place 0.3),
 * whether it speaks now, and, for a mark with its own size (MARK_FIT), that size. Both
 * fits (`fitPixel`, the 3D `fitShot3d`) try these tiers in order and take the first that
 * fits; the speaker is in every tier. Pure: no DOM, no THREE.
 */
export type FitPoint = Vec2 & {
  fit?: MarkFit;
  /** K3's weight: 1 (cast, the default), 0.5 (a prop), 0.3 (a place). */
  w?: number;
  /** Whoever speaks the line on screen: never dropped. */
  speaker?: boolean;
};

const weightOf = (p: FitPoint): number => p.w ?? STAGE4.weight.cast;

/**
 * A sized prop cropped to `keep` of its width: its middle slides toward the people by what
 * is given up, so the part kept is the side they stand on.
 */
function cropped(p: FitPoint, people: readonly FitPoint[], keep: number): FitPoint {
  const fit = p.fit;
  if (!fit?.keep || people.length === 0) return p;
  const k = Math.max(keep, fit.keep);
  const cx = people.reduce((a, q) => a + q.x, 0) / people.length;
  const cz = people.reduce((a, q) => a + q.z, 0) / people.length;
  const d = Math.hypot(cx - p.x, cz - p.z);
  const shift = d > 1e-6 ? Math.min(d, fit.r * (1 - k)) / d : 0;
  return {
    ...p,
    x: p.x + (cx - p.x) * shift,
    z: p.z + (cz - p.z) * shift,
    fit: { ...fit, r: fit.r * k },
  };
}

/**
 * The candidate point sets, widest first: everything whole; big props cropped to their
 * `keep` share; without places; without props; the speaker and the first point (the
 * Keeper, when framed); the speaker alone. Duplicate tiers are left out.
 */
export function fitTiers(
  points: readonly FitPoint[],
  keep: number = STAGE4.propKeep,
): FitPoint[][] {
  const people = points.filter((p) => weightOf(p) >= STAGE4.weight.cast && !p.fit);
  const tiers: FitPoint[][] = [points.slice()];
  if (points.some((p) => p.fit?.keep)) tiers.push(points.map((p) => cropped(p, people, keep)));
  const above = (min: number) =>
    tiers[tiers.length - 1]!.filter((p) => p.speaker || weightOf(p) > min);
  const noPlaces = above(STAGE4.weight.place);
  if (noPlaces.length < tiers[tiers.length - 1]!.length && noPlaces.length > 0)
    tiers.push(noPlaces);
  const noProps = above(STAGE4.weight.prop);
  if (noProps.length < tiers[tiers.length - 1]!.length && noProps.length > 0) tiers.push(noProps);
  const last = tiers[tiers.length - 1]!;
  const spk = last.find((p) => p.speaker);
  const first = last[0];
  // A prop as the line's subject (the pond) never leaves the frame without a person: the
  // nearest one stays, with the prop's middle and a sliver of it round that (cg5, Hazel ch10
  // on a phone).
  const person = spk?.fit
    ? last
        .filter((p) => !p.fit && !p.speaker && weightOf(p) >= STAGE4.weight.cast)
        .sort(
          (a, b) => Math.hypot(a.x - spk.x, a.z - spk.z) - Math.hypot(b.x - spk.x, b.z - spk.z),
        )[0]
    : undefined;
  if (spk && person) {
    const whole = points.find((p) => p.speaker && p.fit) ?? spk;
    const rim = { ...whole, fit: { ...whole.fit!, r: whole.fit!.r * STAGE4.subjectRim } };
    if (last.length > 2) tiers.push([person, spk]);
    tiers.push([person, rim]);
    return tiers;
  }
  if (spk && first && last.length > 2) tiers.push(first === spk ? [spk] : [first, spk]);
  if (spk && tiers[tiers.length - 1]!.length > 1) tiers.push([spk]);
  return tiers;
}

/**
 * Where a ground point lands in the pixel view: shares of the view (0..1, y down), for an
 * orthographic camera at `pitch` turned to `yaw`, aimed at `aim`, seeing `view` world units.
 * `up` lifts the point (a head over the feet).
 */
export function projectPixel(
  p: Vec2,
  aim: Vec2,
  yaw: number,
  pitch: number,
  view: { w: number; h: number },
  up = 0,
): { x: number; y: number } {
  const dx = p.x - aim.x;
  const dz = p.z - aim.z;
  const sx = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  const sy = (-dx * Math.sin(yaw) - dz * Math.cos(yaw)) * Math.sin(pitch) + up * Math.cos(pitch);
  return { x: 0.5 + sx / view.w, y: 0.5 - sy / view.h };
}
