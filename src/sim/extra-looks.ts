import type { TrainerLook } from './trainers';

// Kept apart from npcs.ts so the renderers (and the sculpt worker) can read the looks without
// loading the NPC sim, which reaches the world and the campaign ↔ side-story import cycle.

/** Looks for story Keepers who are not playable trainers (palette indices, see trainers.ts). */
export const EXTRA_LOOKS: Record<string, TrainerLook> = {
  corvin: {
    skin: 15,
    hat: 0,
    hatBand: 4,
    shirt: 4,
    shirtShade: 1,
    pants: 0,
    boots: 0,
    hair: 1,
    outline: 0,
    hatStyle: 'band',
  },
  hazel: {
    skin: 15,
    hat: 31,
    hatBand: 25,
    shirt: 28,
    shirtShade: 27,
    pants: 13,
    boots: 12,
    hair: 5,
    outline: 1,
    hatStyle: 'sun',
  },
  // The language teachers: their own faces on the dialogue portrait, not a stand-in Keeper's.
  ori: {
    skin: 14,
    hat: 29,
    hatBand: 17,
    shirt: 29,
    shirtShade: 17,
    pants: 16,
    boots: 12,
    hair: 12,
    outline: 0,
    hatStyle: 'none',
  },
  hana: {
    skin: 15,
    hat: 31,
    hatBand: 24,
    shirt: 24,
    shirtShade: 23,
    pants: 2,
    boots: 1,
    hair: 0,
    outline: 0,
    hatStyle: 'band',
  },
};
