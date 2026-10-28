/**
 * Numbers for the outer ring's wild trees, bushes, logs and rocks in Full 3D (R0037).
 * `size` in `WILD_PROPS` is the pixel sprite's width, so each 3D piece is sized from it.
 */
export const WILD_3D = {
  /** Tree-kit scale per unit of `size` (the fruit trees are 1.05 at about 6.4 wide). */
  treeScalePerSize: 0.165,
  /** The first `seedBase` handed to the tree kit, kept apart from the fruit trees' 1..n. */
  treeSeedBase: 100,
  /** A bush blob cluster: radius per unit of size, and how much it is squashed. */
  bushRadius: 0.4,
  bushSquash: 0.72,
  /** A log: length from the collider (0.8 * size) plus this, and its radius. */
  logExtra: 0.5,
  logRadius: 0.3,
  /** A rock: radius per unit of size, and its height as a fraction of the radius. */
  rockRadius: 0.4,
  rockHeight: 0.65,
  /** Colour jitter per instance (lightness, 0..1). */
  jitter: 0.12,
  bushColours: ['#5f8f3c', '#6f9a42', '#547f38'],
  logColour: '#8a6a44',
  rockColour: '#b8aea6',
} as const;
