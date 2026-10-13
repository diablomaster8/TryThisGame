import { SEASONS } from '../config/tuning';
import type { Season, SimEvent, World } from './types';

/**
 * Festivals: each real season changes one thing. Spring hatching (cheap, rarer eggs),
 * summer races (double prizes), autumn harvest (fruit falls twice as often), winter
 * lanterns (lit all day, fireflies out). A banner toast marks the first day.
 */
export function eggPriceMultiplier(world: World): number {
  return world.season === 'spring' ? SEASONS.spring.eggPrice : 1;
}

export function rareEggMultiplier(world: World): number {
  return world.season === 'spring' ? SEASONS.spring.rareEgg : 1;
}

export function racePrizeMultiplier(world: World): number {
  return world.season === 'summer' ? SEASONS.summer.racePrize : 1;
}

export function fruitIntervalMultiplier(world: World): number {
  return world.season === 'autumn' ? SEASONS.autumn.fruitInterval : 1;
}

export function lanternsAllDay(world: World): boolean {
  return world.season === 'winter' && SEASONS.winter.lanternsAllDay;
}

/** The winter egg colour on sale only in that season. */
export function seasonalEggColor(season: Season): string | null {
  return season === 'winter' ? 'frost' : season === 'autumn' ? 'ember' : null;
}

export function stepSeasons(world: World, events: SimEvent[]): void {
  if (world.festivalSeen === world.season) return;
  world.festivalSeen = world.season;
  events.push({ kind: 'festival', season: world.season });
}
