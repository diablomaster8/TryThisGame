import { GROVE3D, HOLLOW_ZONES } from '../config/tuning';

/**
 * The Hollow's colour script by depth (recommendations item 8), shared by both renderers:
 * the Full 3D light rig and the pixel painter read the same band for a floor, so a floor
 * looks like the same place in either mode. Pure and Three-free, so the pixel side and the
 * tests can import it without pulling in the 3D stack.
 */
export type CaveBand = (typeof GROVE3D.cave.bands)[number];

/** The band for a 1-based floor depth: the last band whose `from` is at or above it. */
export function bandFor(depth: number): CaveBand {
  const bands = GROVE3D.cave.bands;
  let band: CaveBand = bands[0];
  for (const b of bands) if (depth >= b.from) band = b;
  return band;
}

/** Whether a Hollow floor is under the open sky: an act's camp or field (R0147, R0152). */
export function openSky(f: { zone?: string } | null | undefined): boolean {
  return f?.zone === 'town' || f?.zone === 'field';
}

/** A floor's band: the open-sky band above ground, the depth's band below. */
export function bandForFloor(f: { zone?: string } | null | undefined, depth: number): CaveBand {
  return openSky(f) ? (HOLLOW_ZONES.openBand as unknown as CaveBand) : bandFor(depth);
}
