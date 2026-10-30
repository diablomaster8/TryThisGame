import {
  BATTLE_QUIPS,
  fillQuip,
  type BattleLang,
  type QuipKind,
} from '../../config/strings-battle';
import { hashSeed } from '../rng';
import type { BattleEvent, BattleState, Combatant } from './types';

/**
 * The comedy lines for a bout's log (recs FIGHT-75). Each log entry that has spare lines gets
 * one picked from the bout's seed and the entry's place in the log, never from the bout's own
 * dice, so adding lines never changes a replay and the same bout always reads the same. The
 * screen calls `quipFor` first and falls back to `formatEvent` when it returns null.
 */

const TUCKERED_BY: Record<string, QuipKind> = {
  cheerful: 'tuckeredCheerful',
  shy: 'tuckeredShy',
  mischievous: 'tuckeredMischievous',
  lazy: 'tuckeredLazy',
};

function find(s: BattleState, id: string): Combatant | undefined {
  return s.sides[0].find((c) => c.id === id) ?? s.sides[1].find((c) => c.id === id);
}

/** Which spare lines fit an event, or null when it has none. */
export function quipKind(s: BattleState, e: BattleEvent): QuipKind | null {
  switch (e.k) {
    case 'miss':
      return e.float ? 'missFloat' : 'miss';
    case 'boing':
      return 'boing';
    case 'shrug':
      return 'shrug';
    case 'tuckered': {
      const c = find(s, e.who);
      if (e.side === 1) return c?.calm !== undefined ? 'wildHome' : 'foeHome';
      return (c?.personality && TUCKERED_BY[c.personality]) || 'tuckered';
    }
    default:
      return null;
  }
}

/** A stable pick among `count` lines for log entry `ix` of the bout seeded `seed`. */
export function quipIndex(seed: number, ix: number, kind: QuipKind, count: number): number {
  return count <= 0 ? 0 : hashSeed(`${seed}:${ix}:${kind}`) % count;
}

/**
 * The line for `s.log[ix]`, or null when that event has no spare lines. `name` gives a
 * combatant's shown name (the screen already has one for `formatEvent`).
 */
export function quipFor(
  s: BattleState,
  ix: number,
  name: (id: string) => string,
  lang: BattleLang = 'en',
): string | null {
  const e = s.log[ix];
  if (!e) return null;
  const kind = quipKind(s, e);
  if (!kind) return null;
  const lines = BATTLE_QUIPS[lang][kind].length ? BATTLE_QUIPS[lang][kind] : BATTLE_QUIPS.en[kind];
  const line = lines[quipIndex(s.seed, ix, kind, lines.length)]!;
  const a = 'by' in e ? e.by : 'who' in e ? e.who : 'to' in e ? e.to : '';
  const b = 'to' in e ? e.to : '';
  return fillQuip(line, name(a), b ? name(b) : '');
}
