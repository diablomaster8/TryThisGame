import { ACTS } from '../config/dungeon-acts';
import { ACT_LOOKS, type ActLook } from '../config/dungeon-r9-a';
import { GROVE3D, HOLLOW_ZONES } from '../config/tuning';

/**
 * The Hollow's colour script by depth (recommendations item 8), shared by both renderers:
 * the Full 3D light rig and the pixel painter read the same band for a floor, so a floor
 * looks like the same place in either mode. Pure and Three-free, so the pixel side and the
 * tests can import it without pulling in the 3D stack.
 *
 * An act's own dungeon floors and side caves wear that act's look over the depth band
 * (R0190, DUNG-47, `ACT_LOOKS`): warm stone, moss and lantern gold, ochre and turquoise,
 * blue-white with pink light, and the Gloom's grey, which colours back in as its packs are
 * warmed (`caveSaturation`). The endless Hollow keeps the depth bands.
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

interface ActFloorish {
  zone?: string;
  act?: number;
}

/** The act look a floor wears: an act's dungeon level or side cave; null otherwise. */
export function actLookOf(f: ActFloorish | null | undefined): ActLook | null {
  if (!f || openSky(f) || f.act === undefined) return null;
  const def = ACTS[f.act];
  return (def && ACT_LOOKS[def.tileset]) ?? null;
}

/** Merged bands, one per act look and depth band, so a floor's band object stays the same. */
const merged = new Map<string, CaveBand>();

/** A floor's band: the open-sky band above ground, the act's look in its caves, else depth. */
export function bandForFloor(f: ActFloorish | null | undefined, depth: number): CaveBand {
  if (openSky(f)) return HOLLOW_ZONES.openBand as unknown as CaveBand;
  const base = bandFor(depth);
  const look = actLookOf(f);
  if (!look) return base;
  const key = `${f!.act}:${base.from}`;
  let band = merged.get(key);
  if (!band) {
    // Only the band's own colours are taken; the lamp and saturation are read elsewhere.
    const over: Record<string, string> = {};
    for (const k of Object.keys(base)) {
      const v = (look as unknown as Record<string, unknown>)[k];
      if (typeof v === 'string') over[k] = v;
    }
    band = { ...base, ...over } as CaveBand;
    merged.set(key, band);
  }
  return band;
}

/**
 * The cave's colour saturation (R0190): 1 everywhere but the Gloom, which starts at its
 * look's `saturation` and rises to 1 as the floor's packs are warmed (beaten).
 */
export function caveSaturation(
  f: ActFloorish | null | undefined,
  packs: ReadonlyArray<{ state: string }> | undefined,
): number {
  const look = actLookOf(f);
  if (!look || look.saturation >= 1) return 1;
  const all = packs?.length ?? 0;
  const warmed = all === 0 ? 1 : packs!.filter((p) => p.state === 'beaten').length / all;
  return look.saturation + (1 - look.saturation) * warmed;
}
