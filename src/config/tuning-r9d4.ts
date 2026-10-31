/**
 * Lane D round 9: world teaching hints (R0127), the Grove's secret (R0111), the biome sound
 * beds (R0139) and the seasons' Grove dressing (R0118). Imported directly where used.
 */
import type { Biome, RegionId } from './regions';

/** R0127 (WORLD-61): the mechanics a hint teaches. */
export type HintId = 'shake' | 'wade' | 'swim' | 'hop' | 'glide' | 'ride' | 'cave' | 'clue';

export interface HintSpot {
  id: HintId;
  region: RegionId;
  /** Region-local spot: the safe, obvious place the mechanic is first met. */
  x: number;
  z: number;
  /** The icon shown with the line (also not colour-only). */
  icon: string;
}

/**
 * R0127: each mechanic's teaching spot in the Grove. A hint shows once, the first time the
 * Keeper walks within `radius` of its spot while the mechanic applies, and is remembered in
 * `world.hintsSeen`; two hints never come within `gapMs` of each other (the later one waits
 * for the next pass). Spots keep clear of the start, the egg spots and the landmarks' cards.
 */
export const WORLD_HINTS = {
  radius: 2.2,
  gapMs: 20_000,
  spots: [
    { id: 'shake', region: 'grove', x: 6, z: -10.4, icon: '🍎' },
    { id: 'wade', region: 'grove', x: 9.8, z: 16.4, icon: '🌊' },
    { id: 'swim', region: 'grove', x: 12.6, z: 7, icon: '🏊' },
    { id: 'hop', region: 'grove', x: 13, z: -6.3, icon: '🪨' },
    { id: 'glide', region: 'grove', x: 16, z: -16, icon: '🪶' },
    { id: 'ride', region: 'grove', x: -26, z: 14, icon: '🐾' },
    { id: 'cave', region: 'grove', x: -10.6, z: -11.8, icon: '🕳️' },
    // R0111: the clue to the Grove's secret, within 20 u of the nook.
    { id: 'clue', region: 'grove', x: 9.2, z: -12.6, icon: '🗝️' },
  ] as const satisfies readonly HintSpot[],
} as const;

/**
 * R0111 (WORLD-28): one secret per region, opened by that region's Old Key (`<region>:key:1`
 * in `world.collected`). Only the Grove's is placed: a mossy nook at the foot of the falls,
 * where a sleeping stone Nubbin winks once and leaves a statue of its own. The others wait
 * for their maps. `glintRadius`: the nook twinkles while the key is held and the Keeper is
 * this close (the keepsakes' own sparkle, no new draw).
 */
export const SECRETS = {
  radius: 1.5,
  glintRadius: 6,
  spots: {
    grove: { x: 13.2, z: -9.2, reward: { decor: 'statue' as const, shells: 25 } },
  } as Partial<
    Record<RegionId, { x: number; z: number; reward: { decor: 'statue'; shells: number } }>
  >,
} as const;

/**
 * R0139 (WORLD-73): one looping sound bed per biome, synthesised (no files): filtered noise
 * that breathes on a slow wobble, and for some a quiet tone (the Sun lands' chimes, the Moon
 * lands' crickets, the caves' drip). Silent until the first tap unlocks sound; it rides the
 * ambience bus, so the Ambience setting and the sound volume and mute govern it. Moving to
 * another biome cross-fades over `crossfadeSec`. Only the Grove (meadow) and the Hollow
 * (cave) are reachable today; the rest are ready for their regions.
 */
export interface BedSpec {
  noise: { type: BiquadFilterType; hz: number; q: number; gain: number };
  /** The noise gain's wobble. */
  lfo: { hz: number; depth: number };
  tone?: { hz: number; wave: OscillatorType; gain: number; pulseHz: number; pulseDepth: number };
}

export const BIOME_BEDS: { crossfadeSec: number; beds: Record<Biome, BedSpec> } = {
  crossfadeSec: 1.5,
  beds: {
    // The Grove: a soft wind through the leaves.
    meadow: {
      noise: { type: 'lowpass', hz: 520, q: 0.5, gain: 0.018 },
      lfo: { hz: 0.09, depth: 0.01 },
    },
    // Surf: a deep swell that rolls in and out.
    beach: {
      noise: { type: 'lowpass', hz: 420, q: 0.7, gain: 0.05 },
      lfo: { hz: 0.11, depth: 0.04 },
    },
    // The wood: hushed canopy (the birds come from the day ambience).
    forest: {
      noise: { type: 'bandpass', hz: 900, q: 0.5, gain: 0.014 },
      lfo: { hz: 0.07, depth: 0.008 },
    },
    // The ridge and peaks: a thin high wind.
    alpine: {
      noise: { type: 'bandpass', hz: 1400, q: 1.3, gain: 0.03 },
      lfo: { hz: 0.05, depth: 0.02 },
    },
    // Caves: a low hum and a slow drip.
    cave: {
      noise: { type: 'bandpass', hz: 280, q: 0.8, gain: 0.02 },
      lfo: { hz: 0.04, depth: 0.006 },
      tone: { hz: 1750, wave: 'sine', gain: 0.004, pulseHz: 0.6, pulseDepth: 0.004 },
    },
    // Ruins: a still, low air.
    ruin: {
      noise: { type: 'lowpass', hz: 260, q: 0.6, gain: 0.02 },
      lfo: { hz: 0.035, depth: 0.01 },
    },
    // The Sun lands: soft chimes over a warm breeze.
    sun: {
      noise: { type: 'lowpass', hz: 700, q: 0.5, gain: 0.01 },
      lfo: { hz: 0.08, depth: 0.006 },
      tone: { hz: 1318.5, wave: 'sine', gain: 0.004, pulseHz: 0.45, pulseDepth: 0.004 },
    },
    // The Moon lands: crickets over a cool night air.
    moon: {
      noise: { type: 'lowpass', hz: 380, q: 0.5, gain: 0.01 },
      lfo: { hz: 0.06, depth: 0.005 },
      tone: { hz: 4600, wave: 'triangle', gain: 0.004, pulseHz: 27, pulseDepth: 0.004 },
    },
  },
};

/**
 * R0118 (WORLD-51): the Pixel Grove's season-only drift from the existing particle layer (one
 * draw, the same pool): blossom off the fruit trees in spring, fireflies on summer nights,
 * falling leaves in autumn. Only near the Keeper (`reach`), per second at full density;
 * reduced motion and "off" density make none. Winter dresses through the existing snow
 * crowns, frost and pond ice instead.
 */
export const SEASON_DRIFT = {
  reach: 14,
  spring: { kind: 'petal', rate: 2.2, life: 3200, size: 0.5 },
  summer: { kind: 'firefly', rate: 1.6, life: 2600, size: 0.45 },
  autumn: { kind: 'leaf', rate: 2.6, life: 3000, size: 0.55 },
} as const;
