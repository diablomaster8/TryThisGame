/**
 * Numbers for lane C round 9's battle work, kept apart from `tuning-battle.ts`: how a Hollow
 * foe's champion modifiers (R0155, DUNG-15) and the Keeper's Brave gear (R0164, DUNG-24)
 * play inside a fight. The modifiers' own shares live in `config/dungeon-foes.ts`.
 */
export const BATTLE_R9 = {
  hollow: {
    /** Brave: hit power per point of Brave on a Nubbin (its own gear plus the Keeper's). */
    bravePerPoint: 0.05,
    /** Brave never adds more than this to a Nubbin's hits. */
    braveCap: 0.25,
    /** Sticky: Zip mood stages a struck Nubbin loses. */
    stickyZip: 1,
  },
} as const;
