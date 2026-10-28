/**
 * R0018: buildings that step aside when they stand between the camera and the Keeper
 * (`render3d/occluders.ts`). Fades are the share of the surface kept (a screen-door
 * dither): the roof thins more than the walls.
 */
export const OCCLUDE = {
  /** The most boxes the shader tests (houses, windmill, stalls, placed buildings). */
  max: 24,
  roofKeep: 0.25,
  wallKeep: 0.45,
  /** Seconds to thin out and to fill back in. */
  inS: 0.15,
  outS: 0.3,
  /** Slack on every box, in world units, so a ray grazing an eave still counts. */
  margin: 0.15,
  /** The Keeper's see-through silhouette. */
  ghostColor: '#ffeeb0',
  ghostOpacity: 0.8,
} as const;
