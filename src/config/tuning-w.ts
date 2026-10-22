/** Tunables for campaign-graphics-2 package w (winter, water, the Hush); re-exported by tuning.ts. */
export const CG2_W = {
  /** C7: the pond's ice. */
  ice: {
    /** Pixel: height above the pond's water layers (the foam ring sits at 0.03). */
    pixelY: 0.029,
    /** 3D: lift over the water plane. */
    lift3d: 0.03,
    /** 3D ice disc oversize past the pond radius (the bank hides the spill). */
    grow3d: 0.7,
    /** 3D: how much the ice glows by day; less at night. */
    glow3d: 0.18,
  },
  /** H8: winter in the Grove. */
  winter: {
    /** Pixel: snow depth on tree crowns, in painted pixels, by kind of plant. */
    crownDepth: { tree: 7, wild: 7, bush: 3 },
    /** Pixel: how far the ground leaves its green, 0..1, and how many frost flecks. */
    groundDesat: 0.62,
    groundFleck: 0.07,
    /** 3D: blade height scale in winter. */
    grassScale: 0.35,
    /** 3D: the ground's colour multiplier at full winter (white is none). */
    groundFrost: '#a9bccf',
    /** 3D: the frost the ground gives off at full winter, so green does not carry through. */
    groundGlowColor: '#b9cbdc',
    groundGlow: 0.45,
    /** Seconds the grass takes to follow a season change. */
    grassEase: 1.5,
  },
  /** C8, M14: the Hush. */
  hush: {
    /** Pixel colossus (world units): a tall, soft silhouette on the far layer. */
    pixelWidth: 8,
    pixelHeight: 17.5,
    pixelY: 7.6,
    pixelOpacity: 0.8,
    /** 3D colossus scale against the stock card, and its fog-coloured rim. */
    scale3d: 0.42,
    opacity3d: 0.85,
    /** 3D colossus centre height above the ground: its foot fades out at the ground. */
    y3d: 4,
    rimColor: '#dfe7f2',
    /** Frost decals under put-out lanterns: radius (world units), seconds to grow, tint. */
    frostRadius: 2.1,
    frostGrow: 1.6,
    frostColor: '#a9b4c4',
    frostOpacity: 0.62,
  },
  /** M7: the mill wheel in the stream (pixel). */
  mill: {
    sluiceW: 2.2,
    /** How far the wheel's foot sinks below the bank, so its paddles stand in the water. */
    sink: 0.3,
    foamW: 2.6,
  },
} as const;
