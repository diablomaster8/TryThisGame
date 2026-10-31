/** Lane A round 10, helper B: colliders, decor, NPC separation and occluder fades. */

/** R0017 (MOVE-17): a wandering visitor treats a standing Nubbin like the Keeper. */
export const NPC_YIELD = {
  /** A free Nubbin counts as in the way when within this of the probe point (units). */
  nubbinBlock: 0.6,
} as const;

/** R0018 (MOVE-18): the see-through Keeper's rim and the story places' fading houses. */
export const OCCLUDE_R10 = {
  /** The silhouette's rim colour, a darker gold than its fill. */
  edgeColor: '#7a5a1e',
  /** How far the rim stands out round each part, in world units (about 1 px at 540p). */
  edgeU: 0.035,
  /** Slack round a story or visit house's walls, past the roof's own overhang (units). */
  housePad: 0.2,
} as const;
