/**
 * Tunables for campaign-graphics package f (re-exported from tuning.ts): the campaign
 * looks, title cards, staged seasons and weather, and the story sets.
 */
export const LOOK_F = {
  /** Title card: seconds shown, and the fade in and out (a cut under reduced motion). */
  card: { holdS: 2.6, fadeS: 0.6 },
  /** Staged weather and held effects drawn in screen space at low resolution. */
  fx: {
    rain: 110,
    snow: 80,
    wind: 26,
    /** Pixels of the low-res fx canvas per screen pixel. */
    scale: 0.25,
    /** Seconds the pale seed takes to drift down. */
    seedFallS: 28,
  },
  /** Fireflies on the walk back (world space). */
  fireflies: { count: 26, radius: 7, height: 2.2 },
  /** The plum tree's wasps (world space). */
  wasps: { count: 5, radius: 0.9, height: 2.4, speed: 3.2 },
  /** Which tree carries the plums: the one nearest here (the gate, where Ember waits). */
  plumNear: { x: 0, z: 23 },
  /** Bunting: lanterns per run, the sag of each run and the height at the posts. */
  bunting: { perRun: 9, sag: 1.1, postHeight: 2.5, size: 0.42 },
  /** The Beetle Road's set on the lane in (grove coordinates). */
  beetle: {
    cabin: { w: 3.4, d: 2.6, h: 2.3 },
    cart: { x: 3, z: 19 },
    machine: { x: 7.5, z: 20.5 },
  },
  /** Logged In: the holographic fence's radius round the lobby, panels and their size. */
  holo: { cx: 0, cz: 1, radius: 11.5, panels: 28, width: 2.5, height: 1.5 },
  /** The Root Node room: dome radius round the chair. */
  root: { radius: 6 },
} as const;
