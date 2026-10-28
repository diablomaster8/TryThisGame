import { BATTLE } from '../../config/tuning-battle';
import type { AlignmentBand, NubbinType } from '../types';
import type { MoveAlign } from './types';

/**
 * The type chart (recs FIGHT-13): a four-way loop, Swim soaks Fly, Fly goes over Run, Run is
 * too quick for Power and Power makes a bigger wave than Swim, with steady Normal outside it.
 * The diagonals (Swim–Run, Fly–Power) are even. On top sits a Sun/Moon layer: a move of one
 * pole lands harder on the other band and a little softer on its own. Eternals take ×1 from
 * everything. The help card's wording is built from `LOOP`, so the two cannot drift apart.
 */
export const LOOP: readonly NubbinType[] = ['swim', 'fly', 'run', 'power'];

/** The type `t` beats, or null for Normal. */
export function beats(t: NubbinType): NubbinType | null {
  const i = LOOP.indexOf(t);
  return i < 0 ? null : LOOP[(i + 1) % LOOP.length]!;
}

export function typeMult(attack: NubbinType, defend: NubbinType): number {
  if (attack === 'normal' || defend === 'normal') return 1;
  if (beats(attack) === defend) return BATTLE.chart.strong;
  if (beats(defend) === attack) return BATTLE.chart.weak;
  return 1;
}

export function alignMult(move: MoveAlign, target: AlignmentBand, eternal: boolean): number {
  if (eternal || move === 'none' || target === 'neutral') return 1;
  return move === target ? BATTLE.chart.same : BATTLE.chart.across;
}
