/**
 * Lane C round 8 (recs FIGHT-82): a campaign replay with Settings → Bouts on Skip, taking every
 * story bout the moment it opens, still reaches all eight endings. Turn bouts resolve without
 * the battle screen; a tactics board (the Rumble Room, Corvin's garden) is walked away from.
 * Second half of the eight routes (see `battle-story-routes.ts`).
 */
import { describe, it } from 'vitest';
import { replayRoutes, ROUTES } from './battle-story-routes';

describe('story bouts on Skip (recs FIGHT-82), second half', () => {
  it('a replay taking every bout reaches the last four endings', () => {
    replayRoutes(ROUTES.slice(4));
  }, 180_000);
});
