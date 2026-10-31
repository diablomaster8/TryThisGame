/**
 * R0546 (SOUL-28): a glutton (and, less often, a lazy one) goes for fruit it can see when it
 * isn't hungry yet, so fallen fruit stops lying about; three fruits inside five minutes give
 * it a full belly for a while (a waddle in both renderers), then a burp and a nap. A fussy
 * one leaves anything but its favourite until it is properly hungry. Behaviour only: a
 * snack fills the belly and gives its points like any fruit.
 *
 * The snack chance is hashed from the Nubbin and the second (no world rng drawn). Like the
 * traits it runs in a short catch-up's fine steps too, so a short gap plays as live play.
 */
import { GLUTTON, NEEDS } from '../config/tuning';
import { hasTrait, roll } from './traits';
import type { IdleAct } from './soul-idle';
import type { Nubbin, SimEvent, World } from './types';

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

/** How keen it is on a snack it doesn't need: glutton 1, lazy half, others none. */
function snackScale(n: Nubbin): number {
  if (hasTrait(n, 'glutton')) return 1;
  return n.personality === 'lazy' ? GLUTTON.lazyScale : 0;
}

/** A fruit on the ground within reach to snack on now, or null. Once per sim second. */
export function snackFruit(n: Nubbin, world: World, now: number, dtMs: number): string | null {
  if (n.stage === 'egg' || n.stage === 'cocoon') return null;
  if (Math.floor(now / 1000) === Math.floor((now - dtMs) / 1000)) return null;
  const scale = snackScale(n);
  if (scale <= 0 || n.needs.hunger >= GLUTTON.below || isFull(n, now)) return null;
  const r = roll(n, 'snack', now);
  if (r >= GLUTTON.perSecond * scale) return null;
  let best: string | null = null;
  let bestD: number = GLUTTON.radius;
  for (const i of world.items) {
    if (i.kind !== 'fruit' || i.y > 0.05) continue;
    const d = dist(i.pos, n.pos);
    if (d < bestD) {
      bestD = d;
      best = i.id;
    }
  }
  return best;
}

/** A fussy Nubbin passes over a fruit that isn't its favourite until it is this hungry. */
export function fussySkips(n: Nubbin, taste: 'yum' | 'bleh' | null): boolean {
  return taste !== 'yum' && hasTrait(n, 'fussy') && n.needs.hunger >= GLUTTON.fussyBelow;
}

export function isFull(n: Nubbin, now: number): boolean {
  return (n.fullUntilMs ?? 0) > now;
}

/**
 * A fruit eaten: counts toward the full belly. Returns true when this one filled it, so
 * behavior.ts can follow the meal with the burp and the nap.
 */
export function noteMeal(n: Nubbin, now: number): boolean {
  const meals = (n.recentMeals ?? []).filter((t) => now - t < GLUTTON.fullWithinMs);
  meals.push(now);
  if (meals.length >= GLUTTON.fullAfter && !isFull(n, now)) {
    n.fullUntilMs = now + GLUTTON.fullMs;
    delete n.recentMeals;
    return true;
  }
  n.recentMeals = meals.slice(-GLUTTON.fullAfter);
  return false;
}

/** Whether a meal was a snack (it wasn't hungry): it counts toward the glutton trait. */
export function wasSnack(hungerBefore: number): boolean {
  return hungerBefore > NEEDS.hungryThreshold * 2;
}

export function burpEvent(n: Nubbin): SimEvent {
  return { kind: 'burp', nubbinId: n.id };
}

/** The burp, then the nap, each once per full belly; transient, as the looks are. */
const burpDue = new WeakSet<Nubbin>();
const napDue = new WeakSet<Nubbin>();

/** Queue the burp and the nap that follow a full belly. */
export function queueBurp(n: Nubbin): void {
  burpDue.add(n);
}

/** The belly's act for this idle choice: the burp, then a nap if it has any yawn in it. */
export function bellyAct(n: Nubbin): IdleAct | null {
  if (burpDue.has(n)) {
    burpDue.delete(n);
    napDue.add(n);
    return { state: 'perform', ms: GLUTTON.burpMs, itemId: 'burp' };
  }
  if (napDue.has(n)) {
    napDue.delete(n);
    if (n.needs.energy < 1) return { state: 'nap', ms: NEEDS.napMs * 0.5, itemId: 'fullNap' };
  }
  return null;
}
