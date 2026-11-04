import type { Season } from '../sim/types';

/**
 * R0118 (WORLD-51): what a region's seasons do to its trees and ground, as data keyed by season
 * (a region without an entry wears the summer look). Colours are the crown's three greens (two
 * broadleaf looks and the pine) and the ground's multiplier and wash. The Wood's own modules
 * read this in both renderers, so the seasons change the place, not only the prices.
 */
export interface SeasonLook {
  /** Broadleaf crown colours (the Wood's two looks), then the pine. */
  crowns: readonly [string, string, string];
  /** The ground's colour multiplier (3D standard and pixel Lambert alike). */
  ground: string;
  /** A pale wash added to the ground (a dusting of snow), with its strength 0..1. */
  wash: { color: string; amount: number };
}

export const SEASON_LOOK: Record<Season, SeasonLook> = {
  spring: {
    crowns: ['#6fae48', '#e3a2c0', '#2f6a48'],
    ground: '#f2ffe8',
    wash: { color: '#000000', amount: 0 },
  },
  summer: {
    crowns: ['#2f6b3a', '#3d7d3c', '#24563c'],
    ground: '#ffffff',
    wash: { color: '#000000', amount: 0 },
  },
  autumn: {
    crowns: ['#c8661e', '#d89a2a', '#4a5a30'],
    ground: '#ffd9a8',
    wash: { color: '#000000', amount: 0 },
  },
  winter: {
    crowns: ['#d6e2e8', '#bccdd8', '#7fa2a4'],
    ground: '#f2f6ff',
    wash: { color: '#c4d4e4', amount: 0.55 },
  },
};
