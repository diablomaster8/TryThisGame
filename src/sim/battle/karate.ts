import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { end, settle, strikeOn } from './damage';
import type { BattleAction, BattleState, KarateClock } from './types';

/**
 * The timed dojo bout on the battle core. A bar swings; a tap near its centre lands a strong
 * strike, anywhere else a weak one, and the rival strikes on a clock. Rival strikes fire at
 * their exact times, not at frame times, so the bout depends only on when the taps came: the
 * screen runs a local copy for drawing and the sim replays the same taps to decide the result.
 */
const K = BATTLE.karate;

export function karateClock(tier: number): KarateClock {
  return {
    timeMs: 0,
    barSpeed: K.barSpeed + tier * K.barSpeedPerTier,
    rivalEveryMs: Math.max(K.rivalEveryFloorMs, K.rivalEveryMs - tier * K.rivalEveryPerTier),
    rivalNextMs: K.rivalFirstMs,
    lastHit: null,
  };
}

/** The bar's position 0..1 at bout time `ms`. */
export function barAt(clock: KarateClock, ms: number): number {
  return 0.5 + 0.5 * Math.sin((ms / 1000) * clock.barSpeed * Math.PI);
}

/** How far the bar is from the centre, 0 (centre) to 1 (edge). */
export function barOffsetAt(clock: KarateClock, ms: number): number {
  return Math.abs(barAt(clock, ms) - 0.5) * 2;
}

function advance(s: BattleState, rng: Rng, toMs: number): void {
  const c = s.karate!;
  const player = s.sides[0][0]!;
  const rival = s.sides[1][0]!;
  const target = Math.min(K.maxMs, Math.max(c.timeMs, toMs));
  while (!s.result && c.rivalNextMs <= target) {
    c.timeMs = c.rivalNextMs;
    const strong = rng.chance(K.rivalStrongChance);
    const dmg = strikeOn(
      s,
      rng,
      rival,
      player,
      strong ? K.rivalStrong : K.rivalWeak,
      K.hitSpread,
      1,
      strong,
    );
    c.lastHit = { who: 1, strong, dodged: dmg === 0, atMs: c.timeMs };
    c.rivalNextMs += c.rivalEveryMs;
    settle(s);
  }
  if (s.result) return;
  c.timeMs = target;
  if (c.timeMs >= K.maxMs) end(s, { k: 'end', winner: null, reason: 'time' });
}

export function karateAct(s: BattleState, rng: Rng, a: BattleAction): boolean {
  if (s.result || s.mode !== 'karate' || !s.karate) return false;
  if (a.k === 'advance') {
    if (!Number.isFinite(a.toMs)) return false;
    advance(s, rng, a.toMs);
    return true;
  }
  if (a.k !== 'tap' || !Number.isFinite(a.atMs)) return false;
  advance(s, rng, a.atMs);
  if (s.result) return true;
  const c = s.karate;
  const strong = barOffsetAt(c, c.timeMs) <= K.sweetSpot;
  const dmg = strikeOn(
    s,
    rng,
    s.sides[0][0]!,
    s.sides[1][0]!,
    strong ? K.strong : K.weak,
    K.hitSpread,
    1,
    strong,
  );
  c.lastHit = { who: 0, strong, dodged: dmg === 0, atMs: c.timeMs };
  settle(s);
  return true;
}
