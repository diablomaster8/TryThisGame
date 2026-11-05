/**
 * Lane A round 11 (SOUL), helper G3: the one step that runs the group-play acts: ambient
 * critters to chase, jam sessions, group games and the Keeper's tag, weather play, and the
 * kin, visitor and Keeper-doing reactions. world.ts calls it once per sim step.
 */
import { stepAmbient } from './ambient';
import { stepGames } from './group-games';
import { stepJams } from './jam';
import { stepKin } from './kin-play';
import { stepOldSouls } from './old-soul';
import { stepSeasonMoods } from './season-moods';
import { stepWeatherPlay } from './weather-play';
import type { SimEvent, World } from './types';

export function stepSoulGroups(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  stepAmbient(world, dtMs, events, offline);
  stepJams(world, dtMs, events, offline);
  stepGames(world, dtMs, events, offline);
  stepWeatherPlay(world, dtMs, events, offline);
  stepSeasonMoods(world, dtMs, events, offline);
  stepKin(world, dtMs, events, offline);
  stepOldSouls(world, dtMs, events, offline);
}
