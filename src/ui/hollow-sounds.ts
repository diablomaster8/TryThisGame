/**
 * Which Hollow events get which cue (R0199, DUNG-56). Pure: the HUD plays what this returns
 * through `playHollowCue`, which stays silent until the first tap. A boss bump plays its
 * act's sting; a drop chimes by its rarity.
 */
import type { HollowCue } from '../platform/audio';
import type { SimEvent, World } from '../sim/types';

export function hollowCueFor(e: SimEvent, world: World): HollowCue | null {
  switch (e.kind) {
    case 'packNoticed':
      return 'notice';
    case 'packBeaten':
      return 'poof';
    case 'shrineUsed':
      return 'shrine';
    case 'waypointActivated':
    case 'waypointArrived':
      return 'waypoint';
    case 'gearFound': {
      const r = e.item.rarity;
      const known = ['plain', 'shiny', 'fancy', 'legendary', 'set'];
      // A charm chimes like a Shiny find.
      if (r === 'charm') return 'drop:shiny';
      return known.includes(r) ? (`drop:${r}` as HollowCue) : 'drop:plain';
    }
    case 'encounterStarted':
      return e.packId === 'pack-boss' ? `boss:${world.dungeon?.act ?? 0}` : null;
    default:
      return null;
  }
}
