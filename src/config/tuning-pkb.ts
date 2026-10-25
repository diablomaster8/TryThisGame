/**
 * Egg odds for the second half of the first-generation pocket line (agent pkB).
 * A species' `eggWeight` multiplies its odds in an egg roll; anything below 1 is rare and
 * never turns up wild, in the Hollow Below or in a neighbour's garden.
 */
export const GEN1B_EGGS = {
  /** The ferry, the copy blob, the sleeper and the ribbon-wyrm line. */
  rare: 0.06,
  /** The three plume birds, the psychic clone and the wish kit. */
  legendary: 0.012,
} as const;
