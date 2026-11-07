import { GRACE, NEEDS, SLIPS } from '../config/tuning';
import type { NubbinMood, Needs, Nubbin } from './types';

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export function createNeeds(): Needs {
  return {
    hunger: 1,
    energy: 1,
    happiness: NEEDS.happinessStart,
    affection: NEEDS.affectionStart,
  };
}

/** Passive decay over `dtMs`. Napping restores energy instead of draining it. */
export function decayNeeds(n: Nubbin, dtMs: number): void {
  const needs = n.needs;
  const minutes = dtMs / 60_000;
  needs.hunger = clamp(needs.hunger - dtMs / NEEDS.hungerFullToStarvingMs, 0, 1);
  if (n.behavior.state === 'nap') {
    needs.energy = clamp(needs.energy + dtMs / NEEDS.napMs, 0, 1);
  } else {
    needs.energy = clamp(needs.energy - dtMs / NEEDS.energyFullToEmptyMs, 0, 1);
  }
  if (needs.hunger <= NEEDS.starvingThreshold) {
    addHappiness(n, NEEDS.starvingHappinessPerMinute * minutes);
  } else if (needs.happiness !== NEEDS.happinessRest) {
    // Drift toward the resting mood so moods fade instead of sticking forever.
    const rest = NEEDS.happinessRest;
    const drift = NEEDS.happinessDriftPerMinute * minutes;
    needs.happiness =
      needs.happiness > rest
        ? Math.max(rest, needs.happiness - drift)
        : Math.min(rest, needs.happiness + drift);
  }
}

export function addHappiness(n: Nubbin, delta: number): void {
  n.needs.happiness = clamp(n.needs.happiness + delta, NEEDS.happinessMin, NEEDS.happinessMax);
}

export function addAffection(n: Nubbin, delta: number): void {
  n.needs.affection = clamp(n.needs.affection + delta, NEEDS.affectionMin, NEEDS.affectionMax);
}

/**
 * Sample happiness for the lifetime average that rebirth checks, weighted by the sim
 * seconds the sample stands for: live play samples each second, catch-up each minute,
 * and an hour away must weigh the same as an hour watched. A Nubbin frozen at the end of
 * its life (`awaitingKeeper`) stops sampling, so its outcome cannot drift while it waits.
 */
export function sampleHappiness(n: Nubbin, seconds = 1): void {
  if (n.awaitingKeeper) return;
  n.happinessSum += n.needs.happiness * seconds;
  n.happinessSamples += seconds;
}

export function lifetimeHappiness(n: Nubbin): number {
  return n.happinessSamples === 0 ? n.needs.happiness : n.happinessSum / n.happinessSamples;
}

export function applyPet(n: Nubbin): void {
  addHappiness(n, NEEDS.petHappiness);
  addAffection(n, NEEDS.petAffection * (inGrace(n) ? GRACE.affectionScale : 1));
  graceCare(n);
}

/** In its last-day window (sim/lifecycle.ts): care counts extra until it closes. */
export function inGrace(n: Nubbin): boolean {
  return typeof n.graceMs === 'number';
}

/** A pet or a fruit in the window weighs on the lifetime average like a stretch of good time. */
function graceCare(n: Nubbin): void {
  if (!inGrace(n)) return;
  const seconds = GRACE.sampleMsPerCare / 1000;
  n.happinessSum += n.needs.happiness * seconds;
  n.happinessSamples += seconds;
}

export function applyDrop(n: Nubbin, scale = 1): void {
  addHappiness(n, NEEDS.dropHappiness * scale);
  addAffection(n, NEEDS.dropAffection * scale);
}

export function applyFruit(n: Nubbin): void {
  n.needs.hunger = clamp(n.needs.hunger + NEEDS.fruitHunger, 0, 1);
  addHappiness(n, NEEDS.fruitHappiness);
}

/** Fed by the Keeper's hand in the last-day window (fruit it finds itself does not count). */
export function graceFeed(n: Nubbin): void {
  if (!inGrace(n)) return;
  addAffection(n, NEEDS.petAffection * (GRACE.affectionScale - 1));
  graceCare(n);
}

export function isHungry(n: Nubbin): boolean {
  return n.needs.hunger < NEEDS.hungryThreshold;
}

/**
 * Tired enough to lie down: at the sleepy-slip threshold, so a Nubbin left free naps before
 * a slip can count. Only being kept awake (held, carried, mid-lesson) logs one; minigames
 * reset the timers.
 */
export function isExhausted(n: Nubbin): boolean {
  return n.needs.energy <= SLIPS.sleepyEnergy;
}

/** What the face, emote ball and bubbles show. Number meters are for the stats sheet. */
export function moodOf(n: Nubbin): NubbinMood {
  if (n.behavior.reaction === 'dizzy') return 'dizzy';
  if (n.behavior.state === 'nap') return 'sleepy';
  if (n.needs.hunger < NEEDS.hungryThreshold) return 'hungry';
  if (n.needs.happiness <= -20) return 'sad';
  if (n.needs.happiness >= 40) return 'happy';
  if (n.needs.energy < 0.15) return 'sleepy';
  return 'content';
}
