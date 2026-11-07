/** The sim half of a frame (TECH-37), split out of game.ts. */
import { SIM } from './config/tuning';
import type { SimEvent } from './sim/types';
import { applyCommand, stepWorld } from './sim/world';
import { stepKeeperMotion } from './sim/keeper';
import { KEEPER_MOTION } from './config/tuning-sim';
import { FAST_TIME } from './config/tuning-r8d-perf';
import type { Game } from './game';

/** One frame's sim: queued commands, fixed steps, the Keeper's fine clock. Returns the events. */
export function stepSim(g: Game, dt: number): SimEvent[] {
  const steps = g.clock.advance(dt);
  const events: SimEvent[] = [];
  const wall = Date.now();
  if (g.catchingUp || g.visiting) {
    // The world is mid catch-up (or a visit, R0669): draw it, but hold steps and commands.
    g.clock.reset();
    if (g.visiting) g.pending.length = 0;
  } else if (steps > 0 || g.pending.length > 0) {
    (g.scene3d ?? g.view).snapshot(g.world);
    for (const cmd of g.pending.splice(0)) applyCommand(g.world, cmd, events);
    const playCounts = g.clock.timeScale === 1 && !document.hidden;
    // TECH-54: above ×10 the steps stop once they have had their share of the frame; the
    // rest go back to the clock and run as the same fine live steps on later frames.
    const fast = g.clock.timeScale > FAST_TIME.fromScale;
    const t0 = fast ? performance.now() : 0;
    let ran = 0;
    while (ran < steps) {
      events.push(...stepWorld(g.world, SIM.stepMs, wall, false, playCounts));
      ran++;
      if (fast && ran >= FAST_TIME.minSteps && performance.now() - t0 > FAST_TIME.budgetMs) break;
    }
    g.clock.giveBack(steps - ran);
    g.simBehind = ran < steps;
    // Far behind (very high time scale, slow device): live play keeps the live rules, so
    // the backlog runs as fine steps on later frames and only what is past
    // `maxLiveBacklogMs` is dropped (review C, item 14). Offline rules are for absences.
    g.clock.capBacklog(SIM.maxLiveBacklogMs);
    g.spikes.noteSteps(ran);
  }
  // The Keeper's own fine clock (MOVE-15): it moves at 60 Hz between the 10 Hz sim steps,
  // so a key or a jump shows on the next frame. Never during catch-up or a time skip.
  const kview = g.scene3d ?? g.view;
  if (g.catchingUp || g.visiting || g.clock.timeScale !== 1) {
    g.keeperAccMs = 0;
    kview.keeperAlpha = null;
  } else {
    const sub = 1000 / KEEPER_MOTION.hz;
    g.keeperAccMs += dt;
    while (g.keeperAccMs >= sub) {
      kview.snapshotKeeper(g.world);
      if (!stepKeeperMotion(g.world, events)) {
        // A whole sim step ahead already: wait for the sim and draw where it stands.
        g.keeperAccMs = sub;
        break;
      }
      g.keeperAccMs -= sub;
    }
    kview.keeperAlpha = Math.min(1, g.keeperAccMs / sub);
  }
  return events;
}
