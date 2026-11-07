/** Game event reactions (TECH-37): the camera, sky and scene responses to sim events, split out of game.ts. */
import { REGIONS } from './config/regions';
import { regionOf, rideSeen } from './sim/regions';
import { CAMERA, LANDMARK_HOLD } from './config/tuning';
import { litLanterns } from './sim/campaign';
import type { SimEvent } from './sim/types';
import { playIris } from './ui/travel-iris';
import { playSound } from './platform/audio';
import { REGION_BORDER } from './config/tuning-more/world-region-engine';
import { regionFar } from './render/region-host-px';
import type { Game } from './game';

export function takeExit(g: Game, exit: string): void {
  if (g.exitPending) return;
  g.exitPending = true;
  // R12 lane D (WORLD-69): a ride plays its side-on scene, then arrives (lazy module).
  const def = REGIONS[regionOf(g.world.location)].exits.find((e) => e.id === exit);
  if (def?.kind === 'vehicle' && def.ride) {
    const ride = def.ride;
    void import('./render/vignette').then(({ playRide }) =>
      playRide(ride, rideSeen(g.world, ride), g.reduceMotion, () => {
        g.exitPending = false;
        g.send({ kind: 'travel', exit });
      }),
    );
    return;
  }
  playSound(REGION_BORDER.stepSound);
  playIris(() => {
    g.exitPending = false;
    g.send({ kind: 'travel', exit });
  });
}

/** What the game itself does with each sim event (camera shake, restage, travel iris, scene sync). */
export function reactToEvents(g: Game, events: SimEvent[], nowMs: number): void {
  for (const e of events) {
    // Shake is motion too: the in-game Reduced motion choice turns it off (review D, 42).
    const shake = g.world.settings.screenShake && !g.reduceMotion;
    if (e.kind === 'landed' && shake) g.camera.shake(0.18);
    else if (e.kind === 'treeShaken' && shake) g.camera.shake(0.08);
    else if (e.kind === 'weather' || e.kind === 'located') g.lastDaylightMs = -Infinity;
    // R11 lane D (WORLD-39): a loaded border: a footstep and the iris, the trip at the
    // dark moment; arriving anywhere cuts the follow to the Keeper's new spot.
    else if (e.kind === 'exitReached') takeExit(g, e.exit);
    else if (e.kind === 'regionEntered') {
      g.camera.target.x = g.world.keeper.pos.x;
      g.camera.target.z = g.world.keeper.pos.z;
      // WORLD-56: the pixel camera's far plane reaches across the region's diagonal.
      regionFar(g.camera.camera, e.region);
      // R0094/R0118: the new place's sky and season show at once, not at the next 3 s check.
      g.lastDaylightMs = -Infinity;
    } else if (e.kind === 'travelled') {
      // R0074: the iris hides the jump; the follow starts at the new place, not across the map.
      g.camera.target.x = e.to.x;
      g.camera.target.z = e.to.z;
    } else if (e.kind === 'tilePainted') g.grove?.setTiles(g.world.tiles);
    // R0107: a found landmark gets a beat: the view holds while the Keeper takes it in.
    else if (e.kind === 'landmarkFound' && !g.reduceMotion)
      g.landmarkHoldUntil = nowMs + LANDMARK_HOLD.ms;
    else if (e.kind === 'endOfLifeFocus')
      g.focus = { id: e.nubbinId, untilMs: nowMs + CAMERA.focusMs };
    else if (e.kind === 'lanternLit') {
      g.grove?.setLit(litLanterns(g.world));
      g.scene3d?.setLit(litLanterns(g.world));
    } else if (
      e.kind === 'dungeonEntered' ||
      e.kind === 'descended' ||
      e.kind === 'levelChanged' ||
      e.kind === 'dungeonLeft'
    )
      g.syncDungeon();
  }
}
