/** Round 11, helper d6: tunables. */
import type { RegionId } from './regions';

/**
 * R0130 (WORLD-64): where each place sits on the World overview (a 100 x 100 sheet), its
 * landmark icon and its paint colour (a palette colour from `render/sprites/palette.ts`).
 */
export const OVERVIEW_NODES: Readonly<
  Record<Exclude<RegionId, 'little-grove'>, { x: number; y: number; icon: string; fill: string }>
> = {
  grove: { x: 50, y: 50, icon: '🌳', fill: '#86c94a' },
  wood: { x: 38, y: 26, icon: '🌲', fill: '#2f6b3a' },
  ruins: { x: 66, y: 14, icon: '🏛️', fill: '#7a6f8c' },
  ridge: { x: 80, y: 48, icon: '⛰️', fill: '#b3a9bd' },
  peaks: { x: 88, y: 26, icon: '🚩', fill: '#e8e2ee' },
  caves: { x: 92, y: 8, icon: '🕳️', fill: '#4a4063' },
  sunlands: { x: 16, y: 40, icon: '🔆', fill: '#f2d34c' },
  moonlands: { x: 16, y: 62, icon: '💎', fill: '#9b5de5' },
  hollow: { x: 50, y: 68, icon: '🕯️', fill: '#2b2440' },
  shore: { x: 72, y: 82, icon: '🗼', fill: '#d9a66c' },
  lane: { x: 36, y: 80, icon: '🛤️', fill: '#a06a3b' },
  village: { x: 22, y: 92, icon: '🏘️', fill: '#f29c2e' },
};

/**
 * R0137 (WORLD-71): rain fills puddles. A Nubbin that is wandering or playing within `radius`
 * of one splashes and gains `happinessPerMinute`, a little better than sheltering. Bonus only:
 * nothing needs it.
 */
export const PUDDLES = {
  radius: 1.6,
  happinessPerMinute: 2.4,
  spots: [
    { x: 0, z: 6 },
    { x: -4, z: 8 },
    { x: 5, z: 15 },
  ],
} as const;
