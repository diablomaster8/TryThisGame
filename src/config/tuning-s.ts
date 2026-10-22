/**
 * Tunables for campaign-graphics-2 package s (re-exported from tuning.ts): the Root Node's
 * white room (C3), the Beetle Road's floors below (C4) and Logged In's digital set (M3).
 */
export const CG2_S = {
  /** C3: the white room round the `rootNode-chair` mark. */
  root: {
    /** The floor disc's radius (world units) and its colour; the void round it. */
    floorRadius: 9,
    floor: '#eef0f6',
    void: '#fbfbfe',
    /** The 1 px horizon where the floor meets the void (pixel: a ring; 3D: a fine rim). */
    horizon: '#c4c8d6',
    /** The chair's scale in 3D (the prop kit's chair is a child's size). */
    chairScale: 1.6,
    /** Pixel: the room's radius as a share of the safe view's height, its floor and ceiling. */
    viewShare: 0.34,
    minRadius: 2.5,
    /** Pixel: the horizon ring's width as a share of the radius, and the chair's height. */
    rimShare: 0.012,
    chairH: 1.5,
    /** 3D: the whites are lifted past 1 so the warm grade leaves them white. */
    gain: 1.45,
  },
  /** C4: the cave set round the `keeper-below` mark. */
  below: {
    /** Cells across the painted floor (each `DUNGEON.cell` wide), and the lit oval's radii. */
    cells: 16,
    ovalX: 7.2,
    ovalZ: 5.6,
    /** The cave's depth band (colours) and the dark beyond the torchlight. */
    depth: 1,
    dark: '#07060a',
    /** Wall torches round the oval, and the warm card colour (emissive, times this). */
    torches: 5,
    torchGlow: 2.4,
    torchColor: '#ffa850',
    /** The cave shell: rocks round the oval, its height. */
    rocks: 30,
    wallH: 3.6,
    /** Rain below is drips: how many, the fall time (s) and the drop height. */
    drips: 18,
    dripFallS: 0.9,
    dripFrom: 3.4,
  },
  /** M3: Logged In's digital set language in the Day and Night Grove. */
  digital: {
    /** The grid decal: centre, size (world units), the cell (world units), its strength. */
    gridX: 0,
    gridZ: 2,
    gridSize: 44,
    gridCell: 1.5,
    gridDay: 0.16,
    gridNight: 0.34,
    gridColor: '#52e6ff',
    /** Pixel: a smaller, fainter grid round the board (its lines are one texel, about 1 px). */
    pxX: 1,
    pxZ: -3,
    pxSize: 26,
    pxDay: 0.07,
    pxNight: 0.22,
    /** The plain freestanding door of chapter 6, and its holo edge. */
    doorX: 0,
    doorZ: -5.5,
    doorYaw: -0.5,
    /** Egg glints: seconds per twinkle cycle (still under reduced motion). */
    glintS: 1.6,
  },
} as const;
