import { NEEDS, SIM, TREES } from '../config/tuning';
import { splitSpan } from './clock';
import { advanceStage, hatch } from './lifecycle';
import { applyFruit, decayNeeds, isHungry, sampleHappiness } from './needs';
import { isFree } from './nubbin';
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
 * are recorded; departures are M3 and respect `allowOfflineDepartures` there.
 */
export function catchUp(world: World, elapsedMs: number, nowWallMs: number): AwayReport {
  const settings = world.settings.offlineAging;
  const span = allowedSpan(elapsedMs, settings);
  const events: SimEvent[] = [];
  const { coarseSteps, fineSteps } = splitSpan(span);

  for (let i = 0; i < coarseSteps; i++) coarseStep(world, SIM.coarseStepMs, events);
  for (let i = 0; i < fineSteps; i++) events.push(...stepWorld(world, SIM.stepMs));

  world.lastWallMs = nowWallMs;
  const simulatedMs = coarseSteps * SIM.coarseStepMs + fineSteps * SIM.stepMs;
  return { elapsedMs, simulatedMs, mode: settings.mode, events: events.filter(isReportable) };
}

function isReportable(e: SimEvent): boolean {
  return (
    e.kind === 'hatched' || e.kind === 'evolved' || e.kind === 'reborn' || e.kind === 'departed'
  );
}

/**
 * One coarse step: needs, stage timers and trees only. Nubbins eat from the trees on
 * their own, so being away does not by itself starve them. No wandering, no RNG.
 */
export function coarseStep(world: World, dtMs: number, events: SimEvent[]): void {
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
  for (const n of world.nubbins) {
    if (n.stage === 'egg') {
      n.hatchRemainingMs -= dtMs;
      if (n.hatchRemainingMs <= 0) hatch(n, events);
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
    advanceStage(n, dtMs, events, world);
    sampleHappiness(n);
  }
}
