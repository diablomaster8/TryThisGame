import { NEEDS, SIM, TREES } from '../config/tuning';
import { splitSpan } from './clock';
import { advanceStage, hatch } from './lifecycle';
import { applyFruit, decayNeeds, isHungry, sampleHappiness } from './needs';
import { isFree } from './nubbin';
import { stepSlips } from './slips';
import { addPoints } from './stats';
import type { AwayReport, OfflineAgingSettings, SimEvent, World } from './types';
import { hatchSpeed, stepWorld } from './world';

/**
 * How much of an absence the settings allow to be simulated. Every mode stops at
 * `SIM.maxAwayMs` (30 days): a broken clock or a missing timestamp must not run decades.
 */
export function allowedSpan(elapsedMs: number, settings: OfflineAgingSettings): number {
  if (!(elapsedMs > 0)) return 0;
  const gap = Math.min(elapsedMs, SIM.maxAwayMs);
  switch (settings.mode) {
    case 'off':
      return 0;
    case 'capped':
      return Math.min(gap, settings.capHours * 3_600_000);
    case 'indefinite':
      return gap;
  }
}

/**
 * Catch the world up after an absence. Short gaps use real steps; long ones use coarse
 * 1-minute steps, so days away finish in well under a second. Evolutions and rebirths
 * are recorded; departures respect `allowOfflineDepartures` in every step, fine or coarse.
 */
export function catchUp(world: World, elapsedMs: number, nowWallMs: number): AwayReport {
  const run = catchUpInChunks(world, elapsedMs, nowWallMs);
  for (;;) {
    const next = run.next();
    if (next.done) return next.value;
  }
}

/**
 * The same catch-up, pausing every `chunkSteps` coarse steps with the fraction done, so the
 * game can let the browser paint a progress indicator between chunks (review C, item 12).
 * The world is only consistent again once the generator returns its report.
 */
export function* catchUpInChunks(
  world: World,
  elapsedMs: number,
  nowWallMs: number,
  chunkSteps: number = SIM.catchUpChunkSteps,
): Generator<number, AwayReport, void> {
  const settings = world.settings.offlineAging;
  const span = allowedSpan(elapsedMs, settings);
  const events: SimEvent[] = [];
  const { coarseSteps, fineSteps } = splitSpan(span);

  for (let i = 0; i < coarseSteps; i++) {
    coarseStep(world, SIM.coarseStepMs, events);
    if ((i + 1) % chunkSteps === 0 && i + 1 < coarseSteps) yield (i + 1) / coarseSteps;
  }
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
      n.hatchRemainingMs -= dtMs * hatchSpeed(world);
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
}
