/**
 * R0327 (FUN-38): the request board's asks in the askers' own voices. Each kind of request
 * (`sim/quests.ts` TEMPLATES) has a line for each Keeper who might ask it, a thank-you for
 * when it is claimed, and a fallback pair for anyone else. A Nubbin never speaks, so a
 * Nubbin's request is narrated (`nubbin`, with `{name}` for the Nubbin).
 */
import { REQUEST_VOICE_CORE } from './strings-requests-core';
import { REQUEST_VOICE_MORE } from './strings-requests-more';
import type { RequestVoice } from './strings-requests-types';

export * from './strings-requests-types';

export const REQUEST_VOICE: Record<string, RequestVoice> = {
  ...REQUEST_VOICE_CORE,
  ...REQUEST_VOICE_MORE,
};
