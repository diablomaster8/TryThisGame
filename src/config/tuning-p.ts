/** Tunables for campaign-graphics-2 package p (re-exported from tuning.ts). */
export const CG2_P = {
  /** C6: Moss "the grey shape": the stone colour and how the lightness maps through it. */
  weathered: { stone: '#8c9a88', lift: 0.3, gain: 0.8, speckle: 0.1 },
  /** H6: the speaker chevron above the speaking actor. */
  pip: {
    /**
     * Pixel view: world units above the feet for a Keeper and for a Nubbin, the bob (2 output
     * pixels at 32 px a unit) and its rate, and the chevron card's size.
     */
    pixelLiftKeeper: 1.82,
    pixelLiftNubbin: 1.5,
    pixelBob: 2 / 32,
    pixelBobHz: 1.6,
    pixelSize: 0.5,
    /** 3D: metres above a figure's head, the bob and the sprite size. */
    lift3d: 0.42,
    bob3d: 0.06,
    bobHz: 1.6,
    size3d: 0.5,
    /** The chevron's fill: the dialogue box's name colour. */
    fill: '#f2d34c',
    edge: '#2c2433',
  },
  /** C1: stage actors that are not sim NPCs. */
  actor: {
    /** Pixel: shadow radius under a stage actor. */
    shadow: 0.45,
  },
  /** H9: the festival crowd. */
  festival: {
    /** Extra Nubbins on the ring between the Keepers, drawn only on the festival scene. */
    nubbinRadius: 4.3,
    nubbinCount: 6,
    nubbinHeight: 0.9,
  },
  /** H9: bunting fades out within this many units of the camera (full at `far`). */
  buntingFade: { near: 3.2, far: 6 },
  /** N3: the carry props in 3D, in units from the carrier's feet (the hand lantern's offset). */
  carry: { poolSize: 6 },
} as const;
