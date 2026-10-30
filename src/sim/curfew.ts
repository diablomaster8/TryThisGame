import { CURFEW, LIFECYCLE, NEEDS } from '../config/tuning';
import { litLanterns } from './campaign';
import { lifespanMs } from './slips';
import type { Nubbin, SimEvent, World } from './types';
import { dayPhase } from './soul-idle';
import { localHourOf, tzOf } from './local-time';

/**
 * The real clock: late at night Nubbins want to sleep and tire faster, unless the
 * Keeper has lit the lanterns. The stats sheet shows an age in days against the
 * typical span, so rebirth stops being a surprise.
 */
export function isNightHour(hour: number): boolean {
  return hour >= CURFEW.nightFrom || hour < CURFEW.nightTo;
}

export function stepCurfew(
  world: World,
  dtMs: number,
  wallMs: number | undefined,
  events: SimEvent[],
): void {
  if (wallMs === undefined) return;
  // TECH-45: the local hour from the sent time zone, not the device's.
  const hour = localHourOf(wallMs, tzOf(world));
  const night = isNightHour(hour);
  // R0535 (lane A r8): the time of day behaviour reads, from the same clock.
  world.phase = dayPhase(hour);
  if (night !== world.night) {
    world.night = night;
    events.push({ kind: 'curfew', night });
  }
  if (!night || litLanterns(world).size > 0) return;
  // Late play tires them: an extra drain on top of the usual one.
  const extra = (dtMs / NEEDS.energyFullToEmptyMs) * (CURFEW.energyDrainMultiplier - 1);
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.behavior.state === 'nap') continue;
    n.needs.energy = Math.max(0, n.needs.energy - extra);
  }
}

/** Age shown as days of the typical span for its line. */
export function dayCount(n: Nubbin): { day: number; of: number } {
  const dayMs = LIFECYCLE.adultMs / 5;
  const span = LIFECYCLE.childMs + lifespanMs(n);
  return {
    day: Math.min(Math.ceil(span / dayMs), Math.floor(n.ageMs / dayMs) + 1),
    of: Math.ceil(span / dayMs),
  };
}
