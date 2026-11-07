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
    case 'partnerPopped':
      return 'pop';
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
    // R0450 (R17 d1): the Hollow's own sounds, all soft.
    case 'dungeonEntered':
      return e.camp ? null : 'cavern';
    case 'descended':
      return 'stairs';
    case 'hollowSecret':
      return 'secret';
    case 'hollowPuzzle':
      return e.what === 'solved' || e.what === 'shortcut'
        ? 'puzzle'
        : e.what === 'reset'
          ? null
          : 'plate';
    case 'hollowFell':
      return e.water ? 'fall:water' : 'fall:chasm';
    case 'trapSpotted':
      return 'spot';
    case 'trapSprung':
      return 'trap';
    case 'bossBeaten':
      return 'bossDown';
    case 'hollowBossDoor':
      return e.sealed ? null : 'door';
    default:
      return null;
  }
}
