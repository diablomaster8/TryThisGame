/**
 * Tunables for campaign-graphics-4 package c4 (re-exported from tuning.ts): K2's shadow
 * sweep, K10's interiors and K16's story floors. Every number is a default.
 */
export const CG4_C4 = {
  /** K2: seconds between sweeps that give new building meshes the hide-aware shadow. */
  shadowSweepS: 2,
  /**
   * K2 review: how far a hidden building's box reaches past its walls, so its whole
   * footprint goes with it: `side` across the ground (porch boards, steps, the plinth's
   * lip, rubble), `down` below the walls (the plinth reaches 0.65 under them).
   */
  // `ground`: stone and plaster flat pieces up to this far over the walls' foot stay (the
  // plinth's top is the only ground under a story house); floors, boards and tiles go.
  footprint: { side: 0.3, down: 1.0, ground: 0.5 },
  /** K16 review: cells a floor mark keeps clear of the stairs, chest, torches and loot. */
  floorClear: 1,
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
    window: 1.5,
    dayWindow: 0.95,
    /** The dark round an interior (3D): by day and by night. */
    voidDay: '#2b2622',
    voidNight: '#07070b',
  },
} as const;
