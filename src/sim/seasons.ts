import { SEASONS } from '../config/tuning';
import { seasonHat } from '../config/cosmetics';
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
  // LOOK-70: the season's first visit brings its hat as a free gift (kept for good).
  const hat = seasonHat(world.season);
  const gift = hat && !world.inventory.hats.includes(hat) ? hat : null;
  if (gift) world.inventory.hats.push(gift);
  events.push(gift ? { kind: 'festival', season: world.season, giftHat: gift } : { kind: 'festival', season: world.season });
}
