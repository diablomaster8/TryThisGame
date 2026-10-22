/**
 * Tunables for campaign-graphics-4 package c4 (re-exported from tuning.ts): K2's shadow
 * sweep, K10's interiors and K16's story floors. Every number is a default.
 */
export const CG4_C4 = {
  /** K2: seconds between sweeps that give new building meshes the hide-aware shadow. */
  shadowSweepS: 2,
  /**
   * K10: the interiors' room, round one origin (on flat ground north-east of the dojo, clear of
   * every building's hide box, since an exclusive stage hides them all): `w` across, `d`
   * deep, walls `h` high.
   */
  room: { origin: { x: 25, z: -25 }, w: 8, d: 6, h: 3.2 },
  /**
   * K10: the rooms' light. Pixel: `day` multiplies the painted cards, `nightTint` (RGB) is
   * the lamp-warm colour they ease to after dark. 3D: `emissive` is the warm fill the walls
   * and furniture carry at full dark (no light is added), `window` the glass glow by night
   * (above 1 so bloom takes it) and `dayWindow` its pale sky by day.
   */
  light: {
    day: 0.96,
    nightTint: [1, 0.8, 0.6],
    emissive: '#ffb066',
    emissiveNight: 0.32,
    emissiveDay: 0.06,
    window: 2.2,
    dayWindow: 0.95,
  },
} as const;
