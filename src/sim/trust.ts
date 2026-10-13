import { GROVE, NEEDS, TRUST } from '../config/tuning';
import type { Nubbin, SimEvent, Stray, World } from './types';

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

/**
 * Trust is how safe a Nubbin feels with its Keeper. Kindness raises it; throws, drops
 * and neglect lower it. A Nubbin whose trust collapses turns Shadow: not evil, just
 * jaded and wary. It keeps its distance and stops greeting. Shadow is for life, but a
 * Shadow Nubbin cared for patiently bonds again, and a bonded Shadow loves as fully as
 * any other. Left at rock bottom for long enough, a Nubbin runs away; strays come back
 * to the Grove edge later, hoping to be found by someone kinder.
 */
export function addTrust(n: Nubbin, delta: number, events?: SimEvent[]): void {
  if (n.stage === 'egg') return;
  const scaled = delta > 0 && n.shadow && !n.bond ? delta * TRUST.shadowGainScale : delta;
  const before = n.trust;
  n.trust = clamp(n.trust + scaled, TRUST.min, TRUST.max);
  if (!n.shadow && n.trust < TRUST.shadowBelow) {
    n.shadow = true;
    n.bond = false;
    events?.push({ kind: 'turnedShadow', nubbinId: n.id });
  } else if (n.shadow && !n.bond && n.trust >= TRUST.bondAbove) {
    n.bond = true;
    events?.push({ kind: 'shadowBonded', nubbinId: n.id });
  }
  if (before >= TRUST.runawayBelow && n.trust < TRUST.runawayBelow) n.lowTrustSinceMs = -1;
}

/** Whether the Nubbin keeps away from the Keeper right now. */
export function isWary(n: Nubbin): boolean {
  return n.shadow && !n.bond && n.trust < TRUST.wary;
}

/** Per-step trust drift and the run-away check. */
export function stepTrust(world: World, dtMs: number, events: SimEvent[]): void {
  const minutes = dtMs / 60_000;
  for (const n of [...world.nubbins]) {
    if (n.stage === 'egg' || n.stage === 'cocoon') continue;
    if (n.needs.hunger <= NEEDS.starvingThreshold) {
      addTrust(n, TRUST.starvingPerMinute * minutes, events);
    } else if (n.behavior.state === 'cry') {
      addTrust(n, TRUST.cryingPerMinute * minutes, events);
    } else if (n.needs.happiness > 0 && n.trust < TRUST.start) {
      addTrust(n, TRUST.settlePerMinute * minutes, events);
    }
    if (n.trust < TRUST.runawayBelow) {
      if (n.lowTrustSinceMs < 0) n.lowTrustSinceMs = world.timeMs;
      else if (world.timeMs - n.lowTrustSinceMs >= TRUST.runawayAfterMs) runAway(world, n, events);
    } else {
      n.lowTrustSinceMs = -1;
    }
  }
  // Strays come back to the edge of the Grove once there is room.
  for (const s of [...world.strays]) {
    if (world.timeMs < s.returnsAtMs) continue;
    if (world.nubbins.length >= 8) continue;
    world.strays = world.strays.filter((x) => x !== s);
    const n = s.nubbin;
    const edge = GROVE.size / 2 - 1.5;
    n.pos = { x: -edge, z: edge * 0.6 };
    n.y = 0;
    n.behavior.state = 'sit';
    n.behavior.target = null;
    n.behavior.itemId = null;
    n.behavior.untilMs = world.timeMs + 5000;
    n.trust = Math.max(n.trust, 8);
    n.stray = true;
    n.lowTrustSinceMs = -1;
    world.nubbins.push(n);
    events.push({ kind: 'strayReturned', nubbinId: n.id, name: n.name });
  }
}

/** Trust collapsed for too long: the Nubbin leaves. It can come back as a stray. */
export function runAway(world: World, n: Nubbin, events: SimEvent[]): void {
  world.nubbins = world.nubbins.filter((x) => x.id !== n.id);
  if (world.selected === n.id) world.selected = null;
  if (world.keeper.carrying === n.id) world.keeper.carrying = null;
  n.shadow = true;
  n.bond = false;
  n.lowTrustSinceMs = -1;
  const stray: Stray = { nubbin: n, leftAtMs: world.timeMs, returnsAtMs: world.timeMs + TRUST.strayReturnMs };
  world.strays.push(stray);
  events.push({ kind: 'ranAway', nubbinId: n.id, name: n.name });
}

/** A stray that is fed or petted stops being a stray; it is yours to win over. */
export function settleStray(n: Nubbin): void {
  n.stray = false;
}
