/** R11 lane D, helper d8: the tunables of the per-region sky, seasons, life and gates. */

export const REGION_WEATHER_LIVE = {
  /** A sunshower is a light rain under a bright sky. */
  sunshowerIntensity: 0.3,
  /** Rain that reaches the floor under a canopy (the Wood is drier than the Grove). */
  canopyShare: 0.45,
  /** The haze a fog spell lays over the picture, 0..1. */
  fog: 0.55,
} as const;
