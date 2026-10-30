import { NAMES, RIDE_TEXT } from '../config/strings';
import { rideTows } from '../sim/ride';
import type { SimEvent, World } from '../sim/types';

/** R0085/R0088: the toast for a ride or swim-tow event, or null for any other event. */
export function rideToast(e: SimEvent, world: World): string | null {
  if (e.kind === 'swimHint') return RIDE_TEXT.swimHint;
  if (
    e.kind !== 'rideStarted' &&
    e.kind !== 'rideEnded' &&
    e.kind !== 'rideSat' &&
    e.kind !== 'rideHopped'
  )
    return null;
  const n = world.nubbins.find((x) => x.id === e.nubbinId);
  const name = n?.name ?? NAMES.creature;
  if (e.kind === 'rideStarted')
    return n && rideTows(n) ? RIDE_TEXT.towStarted(name) : RIDE_TEXT.started(name);
  if (e.kind === 'rideSat') return RIDE_TEXT.sat(name);
  if (e.kind === 'rideHopped') return RIDE_TEXT.hopped(name);
  // A carrier that wandered off or was picked up needs no toast of its own.
  if (e.reason === 'gone') return null;
  return e.reason === 'tired' ? RIDE_TEXT.tired(name) : RIDE_TEXT.down(name);
}
