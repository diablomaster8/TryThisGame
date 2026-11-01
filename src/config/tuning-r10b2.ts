/**
 * Lane B round 10, helper b2 (2026-10-31): the act fields' walk and sector streaming
 * (R0147, DUNG-07), and the act camps' own maps (R0152, DUNG-12).
 */
export const FIELD_R10 = {
  /**
   * Hedgerows: a hedge down every tile-column border of an act field, open only
   * where the road crosses it, and the road's bends alternating between the upper and lower
   * tile rows. The walk from the camp gate to the act gate then takes 2–3 minutes (item
   * text) rather than under one.
   */
  hedges: true,
  hedgeThick: 1,
  /** Tile rows (0-based) the bends alternate between: upper band, lower band. */
  upperRows: [1, 1] as const,
  lowerRows: [4, 4] as const,
  /** Walk-time target from entry to the far gate, seconds at walking pace (tested). */
  walkSec: [120, 180] as const,
  /**
   * Full 3D sector streaming: a field is cut into `sector`×`sector`-cell sectors and only
   * the 3×3 around the Keeper's sector are drawn (the ground and rock meshes' draw range).
   */
  sector: 32,
  /** Streaming on (the probe turns it off to measure the difference). */
  stream: true as boolean,
} as const;
