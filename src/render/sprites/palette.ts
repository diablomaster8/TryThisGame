// The one shared palette. World textures and generated sprites both draw from it so
// everything reads as one piece. The first 32 are the base colours; the 16 after are
// hue-shifted ramp partners (highlights lean warm, shadows lean cool) used by the
// automatic lighting pass so shading reads as painted rather than merely darker.

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
  // ---- ramp partners ----
  '#cdf0fb', // 32 sky light
  '#2c5f9c', // 33 sky deep
  '#ffc8d8', // 34 rose light
  '#a3365e', // 35 rose deep
  '#b9e677', // 36 leaf light
  '#2a5a3c', // 37 leaf deep
  '#fff3a6', // 38 sun light
  '#c7862a', // 39 sun deep
  '#e0c9f7', // 40 violet light
  '#5b3a8f', // 41 violet deep
  '#f3d8ae', // 42 sand light
  '#9f6a3c', // 43 sand deep
  '#8ae5d2', // 44 teal light
  '#17564f', // 45 teal deep
  '#dcd6e6', // 46 grey light
  '#5c5273', // 47 grey deep
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
  skyLight: 32,
  skyDeep: 33,
  roseLight: 34,
  roseDeep: 35,
  leafLight: 36,
  leafDeep: 37,
  sunLight: 38,
  sunDeep: 39,
  violetLight: 40,
  violetDeep: 41,
  sandLight: 42,
  sandDeep: 43,
  tealLight: 44,
  tealDeep: 45,
  greyLight: 46,
  greyDeep: 47,
} as const;

export function color(index: number): string {
  const hex = PALETTE[index];
  if (hex === undefined) throw new Error(`Palette index out of range: ${index}`);
  return hex;
}

/** Highlight partner of each colour: the next step up its ramp, hue shifted warm. */
const LIGHT: Record<number, number> = {
  [C.ink]: C.darkPlum,
  [C.darkPlum]: C.plum,
  [C.plum]: C.dusk,
  [C.dusk]: C.lilacGrey,
  [C.lilacGrey]: C.greyLight,
  [C.pale]: C.white,
  [C.white]: C.white,
  [C.deepGreen]: C.forest,
  [C.forest]: C.leaf,
  [C.leaf]: C.leafLight,
  [C.grass]: C.sprout,
  [C.sprout]: C.sunLight,
  [C.darkBark]: C.bark,
  [C.bark]: C.wood,
  [C.wood]: C.sand,
  [C.sand]: C.sandLight,
  [C.nightBlue]: C.skyDeep,
  [C.deepWater]: C.water,
  [C.water]: C.shallows,
  [C.shallows]: C.skyLight,
  [C.sunYellow]: C.sunLight,
  [C.orange]: C.sunYellow,
  [C.ember]: C.orange,
  [C.berry]: C.rose,
  [C.rose]: C.roseLight,
  [C.blush]: C.roseLight,
  [C.moonPurple]: C.violet,
  [C.violet]: C.violetLight,
  [C.lavender]: C.violetLight,
  [C.teal]: C.mint,
  [C.mint]: C.tealLight,
  [C.cream]: C.white,
  [C.skyLight]: C.white,
  [C.skyDeep]: C.water,
  [C.roseLight]: C.white,
  [C.roseDeep]: C.rose,
  [C.leafLight]: C.sunLight,
  [C.leafDeep]: C.leaf,
  [C.sunLight]: C.white,
  [C.sunDeep]: C.sunYellow,
  [C.violetLight]: C.white,
  [C.violetDeep]: C.violet,
  [C.sandLight]: C.cream,
  [C.sandDeep]: C.sand,
  [C.tealLight]: C.white,
  [C.tealDeep]: C.teal,
  [C.greyLight]: C.white,
  [C.greyDeep]: C.lilacGrey,
};

/** Shadow partner of each colour: the next step down its ramp, hue shifted cool. */
const SHADE: Record<number, number> = {
  [C.ink]: C.ink,
  [C.darkPlum]: C.ink,
  [C.plum]: C.darkPlum,
  [C.dusk]: C.greyDeep,
  [C.lilacGrey]: C.dusk,
  [C.pale]: C.lilacGrey,
  [C.white]: C.pale,
  [C.deepGreen]: C.ink,
  [C.forest]: C.leafDeep,
  [C.leaf]: C.forest,
  [C.grass]: C.leaf,
  [C.sprout]: C.grass,
  [C.darkBark]: C.ink,
  [C.bark]: C.darkBark,
  [C.wood]: C.sandDeep,
  [C.sand]: C.wood,
  [C.nightBlue]: C.ink,
  [C.deepWater]: C.nightBlue,
  [C.water]: C.skyDeep,
  [C.shallows]: C.water,
  [C.sunYellow]: C.sunDeep,
  [C.orange]: C.sunDeep,
  [C.ember]: C.berry,
  [C.berry]: C.roseDeep,
  [C.rose]: C.roseDeep,
  [C.blush]: C.rose,
  [C.moonPurple]: C.violetDeep,
  [C.violet]: C.violetDeep,
  [C.lavender]: C.violet,
  [C.teal]: C.tealDeep,
  [C.mint]: C.teal,
  [C.cream]: C.sandLight,
  [C.skyLight]: C.shallows,
  [C.skyDeep]: C.nightBlue,
  [C.roseLight]: C.blush,
  [C.roseDeep]: C.darkPlum,
  [C.leafLight]: C.grass,
  [C.leafDeep]: C.deepGreen,
  [C.sunLight]: C.sunYellow,
  [C.sunDeep]: C.sandDeep,
  [C.violetLight]: C.lavender,
  [C.violetDeep]: C.darkPlum,
  [C.sandLight]: C.sand,
  [C.sandDeep]: C.bark,
  [C.tealLight]: C.mint,
  [C.tealDeep]: C.deepGreen,
  [C.greyLight]: C.lilacGrey,
  [C.greyDeep]: C.plum,
};

export function lightOf(index: number): number {
  return LIGHT[index] ?? index;
}

export function shadeOf(index: number): number {
  return SHADE[index] ?? index;
}

/** Two steps down the ramp: the colour of a coloured outline. */
export function outlineOf(index: number): number {
  return shadeOf(shadeOf(index));
}

/** Mix two `#rrggbb` colours: `t` 0 gives `a`, 1 gives `b`. */
export function mixHex(a: string, b: string, t: number): string {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);
  const ch = (shift: number): number => {
    const x = (ca >> shift) & 255;
    const y = (cb >> shift) & 255;
    return Math.round(x + (y - x) * t);
  };
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

/**
 * The palette colour nearest a `#rrggbb` (a weighted RGB distance, kinder to how the eye
 * sees greens), skipping any index in `avoid`: for blends that must not land back on the
 * colour they were mixed from.
 */
export function nearestIndex(hex: string, avoid: readonly number[] = []): number {
  const v = parseInt(hex.slice(1), 16);
  const r = (v >> 16) & 255;
  const g = (v >> 8) & 255;
  const b = v & 255;
  let best = 0;
  let bestD = Infinity;
  PALETTE.forEach((p, i) => {
    if (avoid.includes(i)) return;
    const q = parseInt(p.slice(1), 16);
    const dr = ((q >> 16) & 255) - r;
    const dg = ((q >> 8) & 255) - g;
    const db = (q & 255) - b;
    const d = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}
