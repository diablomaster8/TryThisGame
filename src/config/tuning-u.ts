/** Tunables for campaign-graphics-2 package u (re-exported from tuning.ts). */
export const CG2_U = {
  card: {
    /** Seconds the item card takes to fade in (M9); it simply appears under reduced motion. */
    fadeS: 0.2,
    /** The 3D item image, in device pixels, drawn once and cached. */
    px3d: 192,
    /** The pixel item art's grid and its scale on screen (3x). */
    grid: 20,
    scale: 3,
  },
  postcard: {
    /** Seconds a chapter opening holds before its first line (N1); `stage.hold` overrides. */
    holdS: 1.5,
    /** Each letterbox bar's share of the view height. */
    barShare: 0.12,
    barSlideS: 0.3,
  },
  photo: {
    /** The chapter photo's picture size, in photo-grid pixels (the frame is 160 x 128). */
    w: 148,
    h: 72,
    /** The offer card stays this long before it tucks itself away. */
    offerS: 14,
  },
} as const;
