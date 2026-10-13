import { GROVE, NEEDS, WEATHER } from '../config/tuning';
import { addHappiness } from './needs';
import type { Rng } from './rng';
import type { Season, SimEvent, Weather, WeatherKind, World } from './types';

/**
 * Weather on the sim clock: clear spells, rain, and snow in winter. Rain sends most
 * Nubbins under the trees (the swimmers stay out and train) and fills the pond's
 * foam; snow is slower and quieter. The season comes from the real calendar.
 */
export function createWeather(): Weather {
  return { kind: 'clear', untilMs: WEATHER.clearMs[0], intensity: 0 };
}

export function seasonOf(date: Date): Season {
  const m = date.getMonth();
  if (m <= 1 || m === 11) return 'winter';
  if (m <= 4) return 'spring';
  if (m <= 7) return 'summer';
  return 'autumn';
}

export function setWeather(
  world: World,
  kind: WeatherKind,
  rng: Rng,
  events: SimEvent[],
  durationMs?: number,
): void {
  const range =
    kind === 'rain' ? WEATHER.rainMs : kind === 'snow' ? WEATHER.snowMs : WEATHER.clearMs;
  world.weather = {
    kind,
    untilMs: world.timeMs + (durationMs ?? rng.float(range[0], range[1])),
    intensity: kind === 'clear' ? 0 : rng.float(0.5, 1),
  };
  events.push({ kind: 'weather', weather: kind });
}

/** Per step: roll the next weather when the current spell ends, apply small effects. */
export function stepWeather(world: World, dtMs: number, rng: Rng, events: SimEvent[]): void {
  if (world.timeMs >= world.weather.untilMs) {
    if (world.weather.kind !== 'clear') setWeather(world, 'clear', rng, events);
    else if (rng.chance(WEATHER.rainChance)) {
      setWeather(world, world.season === 'winter' ? 'snow' : 'rain', rng, events);
    } else setWeather(world, 'clear', rng, events);
  }
  if (world.weather.kind !== 'rain') return;
  const dt = dtMs / 1000;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon') continue;
    if (n.behavior.state === 'swim') n.typeLean.swim += WEATHER.rainSwimLeanPerSecond * dt;
    else if (n.behavior.state === 'shelter') {
      addHappiness(n, (WEATHER.shelterHappinessPerMinute * dtMs) / 60_000);
    }
  }
}

/** Nearest tree to shelter under. */
export function shelterSpot(x: number, z: number): { x: number; z: number } {
  let best: { x: number; z: number } = GROVE.trees[0]!;
  let bestD = Infinity;
  for (const t of GROVE.trees) {
    const d = Math.hypot(t.x - x, t.z - z);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return { x: best.x + 1.2, z: best.z + 1.0 };
}

/** The pond fills a little in the rain, for the renderer. */
export function pondSwell(world: World): number {
  return world.weather.kind === 'rain' ? 0.6 * world.weather.intensity : 0;
}

export { NEEDS };
