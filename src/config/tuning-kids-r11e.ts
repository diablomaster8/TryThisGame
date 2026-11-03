/** Round 11, lane E (kids): tunables for the Learning Grove's Grove-noticing moments. */
export const EDU_NOTICING = {
  /** R0723: at most one spoken noticing moment per this long (ms). */
  gapMs: 180_000,
  /** R0723: counting stops here ("One, two, three, four, five apples!"). */
  maxCount: 5,
} as const;

/** R0743: the free-play paint pad ("draw your Nubbin"). */
export const PAINT = {
  /** The most drawings kept in a save; saving one more drops the oldest. */
  maxDrawings: 12,
  /** The canvas is this many pixels square (shown larger, nearest-neighbour). */
  size: 64,
  /** Brush widths in pixels, small to large. */
  brushes: [1, 3, 6],
  /** Eight colours from the shared 48 (indices into `PALETTE`). */
  palette: [0, 6, 22, 20, 9, 18, 27, 24],
  /** A saved drawing's data URL is refused above this many characters. */
  maxChars: 12_000,
  /** How many of the child's Nubbins can be stamped. */
  maxStamps: 8,
} as const;
