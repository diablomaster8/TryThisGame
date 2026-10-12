// The one shared 32-color palette. World textures and generated sprites both draw
// from it so everything reads as one piece.

export const PALETTE = [
  '#0d0a1a', // 0  ink
  '#2b2440', // 1  dark plum
  '#4a4063', // 2  plum
  '#7a6f8c', // 3  dusk
  '#b3a9bd', // 4  lilac grey
  '#e8e2ee', // 5  pale
  '#ffffff', // 6  white
  '#1d3b2a', // 7  deep green
  '#2f6b3a', // 8  forest
  '#4f9c3f', // 9  leaf
  '#86c94a', // 10 grass
  '#c6ec6a', // 11 sprout
  '#3b2416', // 12 dark bark
  '#6b3f22', // 13 bark
  '#a06a3b', // 14 wood
  '#d9a66c', // 15 sand
  '#1b2a5c', // 16 night blue
  '#2e5ca8', // 17 deep water
  '#4a9be0', // 18 water
  '#8fd6f0', // 19 shallows
  '#f2d34c', // 20 sun yellow
  '#f29c2e', // 21 orange
  '#e0562e', // 22 ember
  '#9e2b3f', // 23 berry
  '#e85a7a', // 24 rose
  '#f7a3c2', // 25 blush
  '#5a2d8c', // 26 moon purple
  '#9b5de5', // 27 violet
  '#cdb1f0', // 28 lavender
  '#1e7a74', // 29 teal
  '#3fbfa8', // 30 mint
  '#fff1c9', // 31 cream
] as const;

export type PaletteIndex = number & { readonly __paletteIndex?: never };

export const C = {
  ink: 0,
  darkPlum: 1,
  plum: 2,
  dusk: 3,
  lilacGrey: 4,
  pale: 5,
  white: 6,
  deepGreen: 7,
  forest: 8,
  leaf: 9,
  grass: 10,
  sprout: 11,
  darkBark: 12,
  bark: 13,
  wood: 14,
  sand: 15,
  nightBlue: 16,
  deepWater: 17,
  water: 18,
  shallows: 19,
  sunYellow: 20,
  orange: 21,
  ember: 22,
  berry: 23,
  rose: 24,
  blush: 25,
  moonPurple: 26,
  violet: 27,
  lavender: 28,
  teal: 29,
  mint: 30,
  cream: 31,
} as const;

export function color(index: number): string {
  const hex = PALETTE[index];
  if (hex === undefined) throw new Error(`Palette index out of range: ${index}`);
  return hex;
}
