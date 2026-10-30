import { RIDE_TEXT } from '../config/strings';
import { isRidden, rideRefusal } from '../sim/ride';
import type { Nubbin, World } from '../sim/types';
import type { Game } from '../game';
import { button } from './dom';

/**
 * R0085: the stats sheet's Ride button. It reads "Ride" when this Nubbin could carry the
 * Keeper, "Get down" while it does, and stays visible but disabled with the reason as its
 * title otherwise, so a player learns what riding needs. "Cheer on" shows on a ride.
 */
export class RideButton {
  readonly ride: HTMLButtonElement;
  readonly cheer: HTMLButtonElement;
  private id: string | null = null;

  constructor(private readonly game: () => Game | null) {
    this.ride = button(RIDE_TEXT.ride, () => this.toggle(), 'btn btn-small');
    this.cheer = button(
      RIDE_TEXT.cheer,
      () => this.game()?.send({ kind: 'rideCheer' }),
      'btn btn-small',
    );
    this.cheer.hidden = true;
  }

  private toggle(): void {
    const g = this.game();
    if (!g || !this.id) return;
    g.send({ kind: 'ride', nubbinId: isRidden(g.world, this.id) ? null : this.id });
  }

  refresh(world: World, n: Nubbin): void {
    this.id = n.id;
    const on = isRidden(world, n.id);
    const why = on ? null : rideRefusal(world, n);
    this.ride.textContent = on ? RIDE_TEXT.getDown : RIDE_TEXT.ride;
    this.ride.disabled = !!why;
    this.ride.title = why ? RIDE_TEXT.refusal[why] : '';
    // Eggs and cocoons have no ride to offer at all.
    this.ride.hidden = why === 'egg';
    this.cheer.hidden = !on;
  }
}
