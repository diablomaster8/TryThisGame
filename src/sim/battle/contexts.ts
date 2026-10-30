import type { World } from '../types';
import type { BattleContext } from './types';

/**
 * Where battles appear (recs FIGHT-72): the placement map. Every place a bout can happen is
 * one row, naming the `BattleContext` kind (or the tactics source) it uses, so the union
 * covers each placement and a test can check that it does. The story rows carry the one rule
 * that never bends: no bout in chapters 9–11 (Corvin's garden, an opt-in choice, is the only
 * exception), and no bout is ever a fail gate in the campaign.
 */
export type Placement =
  | 'dojo'
  | 'dojoLadder'
  | 'circuit'
  | 'hollowRumble'
  | 'hollowStray'
  | 'hollowGuardian'
  | 'wildHabitat'
  | 'storyLogged'
  | 'storyCampaign'
  | 'storySide'
  | 'storyWorld'
  | 'friendly';

export interface PlacementRow {
  /** The context kind a bout here is started with. */
  kind: BattleContext['kind'] | 'tactics';
  /** The encounter or tactics `source` a caller matches its end event on, if any. */
  source?: string;
  /** Story placements: refused in chapters 9–11 unless `optIn`. */
  story?: true;
  optIn?: true;
  /** Results stay in a side save (story worlds) or nowhere (friendly bouts). */
  readOnly?: true;
}

export const PLACEMENTS: Readonly<Record<Placement, PlacementRow>> = {
  dojo: { kind: 'dojo' },
  dojoLadder: { kind: 'dojo' },
  circuit: { kind: 'circuit' },
  hollowRumble: { kind: 'tactics', source: 'hollow' },
  hollowStray: { kind: 'encounter', source: 'stray' },
  hollowGuardian: { kind: 'tactics', source: 'guardian' },
  wildHabitat: { kind: 'encounter', source: 'wild' },
  storyLogged: { kind: 'story', story: true },
  storyCampaign: { kind: 'encounter', source: 'story', story: true },
  storySide: { kind: 'tactics', source: 'story', story: true },
  storyWorld: { kind: 'world', readOnly: true },
  friendly: { kind: 'friendly', readOnly: true },
};

/** Chapters with no bouts: the grave ones. */
export const QUIET_CHAPTERS: readonly number[] = [9, 10, 11];

/** Whether a story placement may start now: never in chapters 9–11 unless it is opt-in. */
export function placementOpen(world: World, p: Placement, optIn = false): boolean {
  const row = PLACEMENTS[p];
  if (!row.story) return true;
  const ch = world.campaign?.chapter ?? 0;
  if (!QUIET_CHAPTERS.includes(ch)) return true;
  return optIn && !!row.optIn;
}
