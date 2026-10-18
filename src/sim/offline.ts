import { NEEDS, SIM, TREES } from '../config/tuning';
import { splitSpan } from './clock';
import { stepCollection } from './collection';
import { advanceStage, hatch } from './lifecycle';
import { applyFruit, decayNeeds, isHungry, sampleHappiness } from './needs';
import { isFree } from './nubbin';
import { stepSlips } from './slips';
import { addPoints } from './stats';
import type { AwayReport, OfflineAgingSettings, SimEvent, World } from './types';
import { stepWorld } from './world';

/** How much of an absence the settings allow to be simulated. */
export function allowedSpan(elapsedMs: number, settings: OfflineAgingSettings): number {
  if (elapsedMs <= 0) return 0;
  switch (settings.mode) {
    case 'off':
      return 0;
    case 'capped':
      return Math.min(elapsedMs, settings.capHours * 3_600_000);
    case 'indefinite':
      return elapsedMs;
  }
}

/**
 * Catch the world up after an absence. Short gaps use real steps; long ones use coarse
 * 1-minute steps, so days away finish in well under a second. Evolutions and rebirths
 * are recorded; departures respect `allowOfflineDepartures` in every step, fine or coarse.
 */
export function catchUp(world: World, elapsedMs: number, nowWallMs: number): AwayReport {
  const settings = world.settings.offlineAging;
  const span = allowedSpan(elapsedMs, settings);
  const events: SimEvent[] = [];
  const { coarseSteps, fineSteps } = splitSpan(span);

  for (let i = 0; i < coarseSteps; i++) coarseStep(world, SIM.coarseStepMs, events);
  for (let i = 0; i < fineSteps; i++) {
    // The leftover under a minute still counts as time away: a Nubbin waiting for the
    // Keeper keeps waiting, and departures follow allowOfflineDepartures.
    events.push(...stepWorld(world, SIM.stepMs, undefined, true));
  }

  world.lastWallMs = nowWallMs;
  const simulatedMs = coarseSteps * SIM.coarseStepMs + fineSteps * SIM.stepMs;
  return { elapsedMs, simulatedMs, mode: settings.mode, events: events.filter(isReportable) };
}

function isReportable(e: SimEvent): boolean {
  return (
    e.kind === 'hatched' ||
    e.kind === 'evolved' ||
    e.kind === 'reborn' ||
    e.kind === 'departed' ||
    e.kind === 'eternal' ||
    e.kind === 'awaitingKeeper'
  );
}

/**
 * One coarse step: needs, stage timers and trees only. Nubbins eat from the trees on
 * their own, so being away does not by itself starve them. No wandering, no RNG.
 */
export function coarseStep(world: World, dtMs: number, events: SimEvent[]): void {
  const firstEvent = events.length;
  world.timeMs += dtMs;
  for (const tree of world.trees) {
    tree.fruitTimerMs -= dtMs;
    while (tree.fruitTimerMs <= 0) {
      tree.fruitTimerMs += TREES.fruitIntervalMs;
      // Fruit grown while away goes straight to whoever is hungriest.
      const hungry = world.nubbins
        .filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon')
        .sort((a, b) => a.needs.hunger - b.needs.hunger)[0];
      if (hungry && isHungry(hungry)) {
        applyFruit(hungry);
        addPoints(hungry.stats.stamina, NEEDS.fruitStaminaPoints);
      }
    }
  }
  for (const n of [...world.nubbins]) {
    if (n.stage === 'egg') {
      n.hatchRemainingMs -= dtMs;
      if (n.hatchRemainingMs <= 0) hatch(n, events, world.timeMs);
      continue;
    }
    // Sleep when exhausted, otherwise rest a little: coarse steps do not model naps.
    if (n.needs.energy <= 0) {
      n.behavior.state = 'nap';
      n.needs.energy = 0.6;
    } else if (isFree(n) && n.behavior.state !== 'sit') {
      n.behavior.state = 'sit';
      n.behavior.target = null;
      n.behavior.itemId = null;
    }
    decayNeeds(n, dtMs);
    if (n.behavior.state === 'nap') n.behavior.state = 'sit';
    advanceStage(n, dtMs, events, world, true);
    if (world.nubbins.includes(n)) sampleHappiness(n, dtMs / 1000);
  }
  stepSlips(world, dtMs, events, true);
  // Hatches, evolutions, rebirths and Eternals while away count as seen (review C, item 8).
  stepCollection(world, events, firstEvent);
}
