import { V } from './art/sculpted';
import type { SpeciesSpec } from './art/species';
import { variant } from './art/nubbin-variants';
import { cone } from './art/nubbin-lineup-kit';
import { RADIANT3D } from '../config/tuning';

/**
 * Lane F r11 (EVO): the Chaos-tier look in Full 3D, the `~radiant:<band>` look modifier over
 * a Nubbin's second-form figure (the Pixel twin is `render/sprites/radiant-sign.ts`). The
 * wings grow toward an Eternal's without reaching them, the rim glows, and each band wears its
 * own signature, painted as marks or added as small head pieces so the sculpt stays cheap:
 * the Sun a gold star jewel on the brow and a gold-lit ball; the Moon a red crescent on the
 * brow and two red spikes behind the crown; the Neutral a jewel in its tip colour on the brow
 * and a gold star on the belly.
 */
const GOLD = '#ffd040';
const GOLD_DEEP = '#d0a020';
const RED = '#e0405a';
const BERRY = '#9e2b3f';
const MOON_WING = '#7a2040';
const SUN_WING = '#fff0a8';

/** A painted dot on the skin (body space). */
const dot = (x: number, y: number, z: number, r: number, color: string) => ({
  kind: 'ellipsoid' as const,
  a: V(x, y, z),
  radii: V(r, r, r * 0.8),
  color,
  soft: 0.01,
});

export function withRadiant(base: SpeciesSpec, band: string): SpeciesSpec {
  // The band's colour on the tips, pads and (Moon) wings, through the palette roles, so it
  // reads at a glance from any side as in Pixel (`radiantColors`).
  const spec = variant(base, `${base.name} (Chaos-tier)`, {
    colors:
      band === 'moon'
        ? { tip: RED, pad: BERRY, wing: MOON_WING }
        : { tip: GOLD, pad: GOLD_DEEP, ...(band === 'sun' ? { wing: SUN_WING } : {}) },
  });
  if (spec.wings)
    spec.wings.size = Math.max(spec.wings.size * RADIANT3D.wingGrow, RADIANT3D.wingMin);
  spec.surface = { ...spec.surface, rimGlow: RADIANT3D.rimGlow };
  const head = spec.head.prims.find((p) => p.tag === 'head');
  // The brow: just above the eyes, on the front of the head dome.
  const by = (head?.a.y ?? 2) + 0.42;
  const bz = (head?.a.z ?? 0) + (head?.radii?.z ?? head?.r ?? 0.95) * 0.86;
  if (band === 'sun') {
    spec.marks.push(
      dot(0, by, bz, 0.14, GOLD),
      dot(0, by + 0.12, bz - 0.03, 0.06, GOLD),
      dot(0, by - 0.12, bz - 0.03, 0.06, GOLD),
      dot(0.12, by, bz - 0.03, 0.06, GOLD),
      dot(-0.12, by, bz - 0.03, 0.06, GOLD),
    );
    if (spec.ball) spec.ball = { ...spec.ball, color: GOLD, glow: GOLD_DEEP };
  } else if (band === 'moon') {
    spec.marks.push(
      dot(-0.1, by, bz, 0.08, RED),
      dot(0, by - 0.07, bz, 0.08, RED),
      dot(0.1, by, bz, 0.08, RED),
    );
    const top = (head?.a.y ?? 2) + (head?.radii?.y ?? 0.85) * 0.8;
    spec.head.prims.push(
      ...[-1, 1].map((dx) =>
        cone(
          V(dx * 0.55, top, -0.25),
          V(dx * 0.8, top + 0.45, -0.55),
          0.12,
          0.02,
          BERRY,
          'horn',
          0.05,
        ),
      ),
    );
    // Grow the head's sculpt box so the spikes are not clipped.
    const [lo, hi] = spec.head.box;
    hi.y = Math.max(hi.y, top + 0.6);
    lo.z = Math.min(lo.z, -0.75);
    hi.x = Math.max(hi.x, 0.95);
    lo.x = Math.min(lo.x, -0.95);
  } else {
    const tip = spec.ball?.color ?? '#3fbfa8';
    spec.marks.push(dot(0, by, bz, 0.13, tip), dot(0, by + 0.03, bz + 0.02, 0.05, '#ffffff'));
    spec.marks.push(dot(0, 1.05, 0.8, 0.12, GOLD), dot(0, 1.05, 0.83, 0.05, '#fff6c0'));
  }
  return spec;
}
