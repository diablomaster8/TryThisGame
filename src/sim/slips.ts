import { LIFECYCLE, SLIP_WARN, SLIPS } from '../config/tuning';
import type { Nubbin, SimEvent, SlipKind, World } from './types';

/**
 * Care slips, made visible: a need ignored for a couple of minutes logs a slip on the
 * Nubbin (the stats sheet shows the last few). Slips trim the adult span a little and,
 * at evolution, enough of them mark the Grumpy or Sleepy look; a childhood with none
 * earns the well-raised bonus grade.
 */
const SLIP_KINDS = ['hungry', 'sleepy', 'lonely', 'wet'] as const;

function wants(n: Nubbin, world: World, away: boolean): SlipKind[] {
  const out: SlipKind[] = [];
  if (n.stage === 'egg' || n.stage === 'cocoon') return out;
  if (n.needs.hunger < 0.15) out.push('hungry');
  if (n.needs.energy < 0.1 && n.behavior.state !== 'nap') out.push('sleepy');
  // Lonely: a child past its first ten minutes with little affection.
  if (n.stage === 'child' && n.needs.affection < 15 && n.ageMs > 600_000) out.push('lonely');
  // Away, the weather is not simulated and nobody runs for shelter, so rain is no slip.
  if (
    !away &&
    world.weather.kind === 'rain' &&
    n.behavior.state !== 'shelter' &&
    n.behavior.state !== 'swim'
  ) {
    out.push('wet');
  }
  return out;
}

/**
 * Live steps and catch-up's coarse steps both count: a child left alone while the game is
 * closed is still left alone, so it cannot come back "well raised" for free.
 */
export function stepSlips(world: World, dtMs: number, events: SimEvent[], away = false): void {
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon') continue;
    n.slipTimers ??= {};
    const active = wants(n, world, away);
    for (const kind of SLIP_KINDS) {
      const t = n.slipTimers[kind] ?? 0;
      if (!active.includes(kind)) {
        // Cooling down after a slip, or simply fine: ease the timer back.
        n.slipTimers[kind] = t < 0 ? Math.min(0, t + dtMs) : 0;
        continue;
      }
      if (t < 0) {
        n.slipTimers[kind] = Math.min(0, t + dtMs);
        continue;
      }
      const next = t + dtMs;
      if (next >= SLIPS.afterMs) {
        n.slips.push({ kind, atMs: world.timeMs });
        while (n.slips.length > SLIPS.keep) n.slips.shift();
        n.slipCount += 1;
        n.slipTimers[kind] = -SLIPS.cooldownMs;
        events.push({ kind: 'slip', nubbinId: n.id, slip: kind });
      } else {
        // R0307: in a new save, a minute's warning first (live play only).
        const warnAt = SLIPS.afterMs - SLIP_WARN.leadMs;
        if (!away && t < warnAt && next >= warnAt && earlySave(world))
          events.push({ kind: 'slipSoon', nubbinId: n.id, slip: kind });
        n.slipTimers[kind] = next;
      }
    }
  }
}

/** R0307: every Nubbin in the save is still young (the first minutes of a new Grove). */
function earlySave(world: World): boolean {
  return world.nubbins.every((x) => x.stage === 'egg' || x.ageMs < SLIP_WARN.earlyMs);
}

/**
 * The player is in a minigame with this Nubbin (a race, an Expedition): that is time spent
 * together, so its slip timers start again rather than run on (review 2026-10-21, bug 21).
 * Cooldowns (negative timers) are left alone.
 */
export function holdSlips(world: World, nubbinId: string): void {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n?.slipTimers) return;
  for (const kind of SLIP_KINDS) if ((n.slipTimers[kind] ?? 0) > 0) n.slipTimers[kind] = 0;
}

/** The adult span for this Nubbin, trimmed by its slips. */
export function lifespanMs(n: Nubbin): number {
  const f = Math.max(SLIPS.lifespanFloor, 1 - n.slipCount * SLIPS.lifespanPerSlip);
  return Math.round(LIFECYCLE.adultMs * f * (n.spanScale ?? 1));
}

/** At evolution: a clean childhood or a moody one. */
export function noteEvolutionSlips(n: Nubbin): 'wellRaised' | 'moody' | null {
  if (n.slipCount === 0) {
    n.wellRaised = true;
    return 'wellRaised';
  }
  if (n.slipCount >= SLIPS.moodyAt) {
    n.moody =
      n.slips.filter((s) => s.kind === 'sleepy').length >= n.slips.length / 2 ? 'sleepy' : 'grumpy';
    return 'moody';
  }
  return null;
}
