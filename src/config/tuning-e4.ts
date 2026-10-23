/**
 * Tunables for campaign-graphics-4 package e4, "world detail" (re-exported from tuning.ts):
 * window figures (K18), lantern streaks on water (K19), the crop plot (K27), lantern heads
 * and tags (K28), rising lanterns (K42), cottage seasons (K43), birds and moths (K44), the
 * gate's frost bloom (K45) and Logged In's boot-up (K46). Every number is a default.
 */
export const CG4_E4 = {
  /** K18: a figure card over a lit window. */
  figures: {
    /** 3D: the card's size as a share of the 0.7-unit glass, and how far in front of it. */
    share: 0.8,
    lift: 0.045,
    /** 3D: how bright the warm glass is (past the bloom threshold). */
    glow: 1.5,
    /** Variants in the sheet (standing, two together, seated); the beat picks one per house. */
    variants: 3,
    /** Pixel: the Grove cottage's window rectangles on its 176 x 150 raster (see paintCottage). */
    cottage: {
      w: 176,
      h: 150,
      size: 7.0,
      wins: [
        { x: 42, y: 80, w: 24, h: 22 },
        { x: 110, y: 80, w: 24, h: 22 },
      ],
    },
    /** Pixel: a crest house's windows on its 160 x 146 raster, drawn 5.2 wide. */
    crest: {
      w: 160,
      h: 146,
      size: 5.2,
      wins: [
        { x: 36, y: 88, w: 22, h: 18 },
        { x: 102, y: 88, w: 22, h: 18 },
      ],
    },
    /** Pixel: Corvin's house, 220 x 160 drawn 6.9 wide at y -0.4 (one lit window). */
    corvin: { w: 220, h: 160, size: 6.9, y: -0.4, win: { x: 52, y: 92, w: 28, h: 24 } },
    /** Pixel: how far toward the camera the card sits, to win the depth tie. */
    lift2d: 0.06,
    /** Mixed into the beat hash so a house keeps its figure through one scene. */
    salt: 7,
  },

  /** K19: streaks of lamplight on the pond. */
  streak: {
    /** A lamp this far (xz) from open water still throws a streak onto it. */
    reach: 4.5,
    /** World length (toward the viewer) and width of one streak. */
    length: 2.8,
    width: 0.6,
    opacity: 0.9,
    /** 3D: emissive strength on the card; the pixel card is plain. */
    glow: 1.7,
    /** Lift above the water (3D) and above the ground paint (pixel). */
    lift3d: 0.03,
    lift2d: 0.04,
    /** The water's small shimmer, per second (still under reduced motion). */
    hz: 0.9,
  },

  /** K27: Hazel's crop plot beside the cottage, one state per season. */
  plot: {
    x: -8,
    z: 18.5,
    /** Plot size on the ground (world units). */
    w: 4,
    d: 3,
    /** Crop rows and plants per row. */
    rows: 3,
    perRow: 5,
    /** Pixel: billboard width of the drawn plot, and the raster it is cut from. */
    pixelSize: 3.6,
  },

  /** K28: the four named lantern posts' head shapes and hung tags. */
  heads: {
    /** Post id to its shape and tag colour (the shape carries it; the colour is only a second cue). */
    shapes: {
      'lantern-1': { shape: 'round', tag: '#7fd1ff' },
      'lantern-2': { shape: 'square', tag: '#9be08a' },
      'lantern-3': { shape: 'hex', tag: '#ffc86b' },
      'lantern-4': { shape: 'tall', tag: '#e8a0ff' },
    },
    /** 3D: where the original head's centre is above the post's foot. */
    headY: 2.1,
    /** 3D: tag size and drop below the head. */
    tag: 0.5,
    tagDrop: 0.55,
    tagSide: 0.34,
    /** 3D glass emissive follows the stock glass; this is the out-state floor. */
    outGlass: '#7d869c',
    /** Pixel: world units per design pixel of the 32-cell head overlay (the lamp sprite is 0.045; the heads are drawn a third larger so the shape reads). */
    pixelUnit: 0.058,
  },

  /** K42: paper lanterns rising at the ch12 festival's close. */
  rising: {
    count: 36,
    /** Rise speed (units per second), the climb before they fade, and sway width. */
    speed: 0.6,
    climb: 15,
    sway: 0.5,
    /** Start disc round the Grove's centre, and the card size (3D box / pixel sprite). */
    radius: 9,
    size: 0.5,
    colors: ['#ffb347', '#ff8f5a', '#ffd27a', '#ff9bb0', '#fff0b0'],
    glow3d: 1.3,
    /** Pixel: card width of the lantern sprite, and its glow. */
    pixelSize: 0.7,
    /** Seconds the field takes to build up when the scene begins (a cut when still). */
    fadeIn: 3,
    /** Reduced motion: the still field hangs at this share of the climb. */
    stillAt: 0.55,
  },

  /** K43: the cottage's seasonal dressing, by the staged season. */
  wreath: {
    /** 3D: door position from the cottage mark (the door faces +z). */
    door: { dx: 0, dy: 1.45, dz: 0.18 },
    /** Window boxes (spring) beside the door, as x offsets from the cottage mark. */
    boxes: [-2.1, 2.1],
    /** Pixel: the cottage raster's door and window centres (px) for the 176 x 150 frame. */
    px: { doorX: 88, doorY: 100, boxY: 118, boxXs: [54, 122] },
  },

  /** K44: day birds and night moths. */
  fauna: {
    birds: 5,
    /** Height band over the Grove, speed range (units per second), and the loop's half width. */
    birdY: [6.5, 9.5] as const,
    /** Pixel: lower, so the birds stay in the tilted view. */
    pixelY: [5, 8] as const,
    birdSpeed: [1.6, 2.6] as const,
    loop: 36,
    birdSize: 0.9,
    /** Moths per lit lamp, orbit radius band, flutter rate and size. */
    moths: 3,
    mothRadius: [0.35, 0.7] as const,
    mothHz: 4.5,
    mothSize: 0.22,
    /** Daylight darkness below this is "day"; at or above 0.4 the moths are out. */
    dayBelow: 0.3,
    nightFrom: 0.4,
    /** Pixel: sprite widths. */
    pixelBird: 0.8,
    pixelMoth: 0.22,
  },

  /** K45: frost spreading over the lychgate when Corvin returns. */
  frost: {
    seconds: 7,
    color: '#eaf6ff',
    opacity: 0.85,
    /** 3D: the posts' size comes from CG2_X.gate; the bloom reaches this height at full growth. */
    height: 1.9,
    /** Pixel: growth stages cut from the gate frame. */
    stages: 6,
  },

  /** K46: the Logged In boot-up. */
  boot: {
    /** Seconds the grid takes to resolve outward; the hold before it starts. */
    seconds: 1.5,
    hold: 0.15,
    /** Grid cell in pixels and the base colours. */
    cell: 28,
    base: '#020816',
    line: '#35e0ff',
    edge: '#c9fbff',
  },

  /** Scenes the effects run on, besides a `props` key (the content wave moves these to authored data). */
  scenes: {
    boot: ['l-c1-open'] as readonly string[],
    rising: [
      'c12-close',
      'end-hazels-grove',
      'end-hazels-grove-open',
      'end-hazels-grove-last',
    ] as readonly string[],
    frost: ['c11-gate'] as readonly string[],
  },
} as const;
