import { HOUSE_FOOTPRINT } from './grove-layout';
import { GROVE } from './tuning';

/**
 * R0742 (KIDS-74): the Learning Grove's Kindergarten hut is the door to Play and learn.
 * Walking the Keeper up to its door opens the picker once; the Keeper has to step away before
 * the door answers again. The numbers are world units (the Keeper's collider keeps it outside
 * the hut's footprint, so the door spot sits just in front of the +z face).
 */
export const EDU_HUT = {
  /** The door spot: the school's centre, out past the front face by half a unit. */
  x: GROVE.buildings.school.x,
  z: GROVE.buildings.school.z + HOUSE_FOOTPRINT.school.hd + 0.5,
  /** Within this of the door spot counts as "at the door". */
  enterR: 1.7,
  /** The Keeper must go this far past `enterR` before the door re-arms. */
  leaveExtra: 0.9,
  /** How often the Keeper's place is looked at (ms). */
  pollMs: 150,
  /** Most Nubbins shown at desks. */
  maxDesks: 4,
} as const;

/** Words for the desk row (read by a screen reader; the row itself is pictures). */
export const EDU_HUT_TEXT = {
  desks: 'Your Nubbins at their little desks',
} as const;
