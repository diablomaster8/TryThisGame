// was tuning-soul-r12a; review pass R12 A
/** Lane A round 12 (SOUL): the hum (R0589), the favourite Keeper's follow and greet (R0568). */
export const HUM = {
  /** Chance per second that a content idler near the Keeper hums. */
  perSecond: 0.01,
  musicalMult: 3,
  cooldownMs: 45_000,
  keeperRadius: 6,
  minHappiness: 20,
  minHunger: 0.4,
  minEnergy: 0.3,
} as const;

/** R0568: a favourite Keeper's Nubbins trot over to walk beside it and run to greet a switch. */
export const FOND_FOLLOW = {
  /** Idlers this far from the Keeper (between the two) may come over. */
  minDist: 3.5,
  maxDist: 10,
  /** Chance per second, and the pause before the same Nubbin does it again. */
  perSecond: 0.08,
  cooldownMs: 20_000,
  /** How long the Nubbin stays beside the Keeper once there, and how far to the side. */
  stayMs: 3_000,
  sideOffset: 1.4,
  /** After the Keeper switches to its favourite: everyone this near runs over for this long. */
  switchRadius: 16,
  switchWindowMs: 12_000,
} as const;
