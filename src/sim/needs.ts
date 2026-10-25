import { NEEDS } from '../config/tuning';
import type { Mood, Needs, Nubbin } from './types';

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
  } else if (needs.happiness !== 0) {
    // Drift toward neutral so moods fade instead of sticking forever.
    const drift = NEEDS.happinessDriftPerMinute * minutes;
    needs.happiness =
      needs.happiness > 0
        ? Math.max(0, needs.happiness - drift)
        : Math.min(0, needs.happiness + drift);
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
  addAffection(n, NEEDS.petAffection);
}

export function applyDrop(n: Nubbin): void {
  addHappiness(n, NEEDS.dropHappiness);
  addAffection(n, NEEDS.dropAffection);
}

export function applyFruit(n: Nubbin): void {
  n.needs.hunger = clamp(n.needs.hunger + NEEDS.fruitHunger, 0, 1);
  addHappiness(n, NEEDS.fruitHappiness);
}

export function isHungry(n: Nubbin): boolean {
  return n.needs.hunger < NEEDS.hungryThreshold;
}

export function isExhausted(n: Nubbin): boolean {
  return n.needs.energy <= 0;
}

/** What the face, emote ball and bubbles show. Number meters are for the stats sheet. */
export function moodOf(n: Nubbin): Mood {
  if (n.behavior.reaction === 'dizzy') return 'dizzy';
  if (n.behavior.state === 'nap') return 'sleepy';
  if (n.needs.hunger < NEEDS.hungryThreshold) return 'hungry';
  if (n.needs.happiness <= -20) return 'sad';
  if (n.needs.happiness >= 40) return 'happy';
  if (n.needs.energy < 0.15) return 'sleepy';
  return 'content';
}
