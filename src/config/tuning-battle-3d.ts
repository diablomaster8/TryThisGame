/**
 * Numbers for the Full 3D battle stage (R0219, FIGHT-07; `render3d/battle-3d.ts`): where the
 * two sides stand, the camera that frames them inside the screen's stage box, the arenas by
 * bout kind, and how far each playback beat moves a rig. World units throughout; a child
 * Nubbin is about 1 unit tall.
 */
export const BATTLE3D = {
  /** The hour the arena is lit at (the sky's sun and fill; the backdrop is painted). */
  hour: 11,
  /** Ours stands front left, theirs back right, the way the pixel stage reads. */
  ally: { x: -1.35, z: 1.05 },
  foe: { x: 1.35, z: -1.1 },
  /** Turned from facing each other toward the camera (radians), so both faces read. */
  faceTurn: { ally: 1.5, foe: 0.15 },
  camera: {
    /** The look point and the camera's offset from it. */
    look: { x: 0, y: 0.75, z: 0 },
    from: { x: -0.4, y: 2.1, z: 6.2 },
    /** Half the world box the stage must show (both rigs and a little ground). */
    halfWidth: 3.0,
    halfHeight: 1.65,
    /** The narrowest and widest vertical field of view, degrees. */
    minFov: 22,
    maxFov: 60,
  },
  /** Wait this long for rigs before stand-ins show (the race's own wait). */
  rigWaitMs: 2600,
  /** Playback beats: a lunge, a hit shake, a dodge step, the walk home, the trot over. */
  lunge: 0.7,
  shake: 0.12,
  dodge: 0.45,
  walkHome: 4.5,
  trotOver: 2.4,
  /** View pixels (the personality idles' unit) to world units. */
  idlePxToWorld: 1 / 24,
  /** Floating words: size, and how far a pop rises over its 700 ms. */
  tag: { width: 1.6, height: 0.42, fontPx: 44 },
  glyph: { width: 0.55, height: 0.55, fontPx: 64 },
  popRise: 0.45,
  /** A hit's camera kick (never under reduced motion), and a big one's. */
  kick: 0.05,
  kickBig: 0.11,
  /** Particle beats on a hit, a dodge and a hug. */
  burst: { count: 10, spread: 0.35, speed: 1.1, rise: 1.0, lifeMs: 600 },
  arena: {
    dojo: {
      top: '#3a2516',
      bottom: '#7a5232',
      floor: '#d8b07a',
      mat: '#b8433a',
      wall: '#efe3c6',
      post: '#6a4224',
    },
    grove: { top: '#7fc4ef', bottom: '#d9f0ff' },
    story: { top: '#1b1430', bottom: '#4a3366' },
    hollow: { top: '#2a2238', bottom: '#5a4a66', lamp: '#ffcf7a' },
  },
} as const;
