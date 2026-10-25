/**
 * Tunables for the Learning Grove's story prompt (review fixes 2026-10-25), kept out of the
 * shared tuning.ts.
 */
export const EDU_PROMPT = {
  /** Show the prompt again after this long with no tap or key in the Learning Grove. */
  idleMs: 45_000,
  /** Wait this long after the Grove first appears before the entry prompt. */
  enterDelayMs: 1_200,
};
