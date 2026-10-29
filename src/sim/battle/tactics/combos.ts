/**
 * Team combos (recs FIGHT-57): two allies whose friendship (`sim/friendships.ts`, read only)
 * is at least 60 may call "Together!" for 4 Puff each when they stand next to each other and
 * both next to the target. The type pair picks the combo. A combo is a plain `MoveDef` built
 * here, so the engine resolves it like any other move; its name lives in `strings-tactics.ts`.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import type { NubbinType } from '../../types';
import type { MoveDef } from '../types';

const R = TACTICS.range;

export type ComboId =
  | 'rainDanceHug'
  | 'wheelbarrowCharge'
  | 'highFive'
  | 'splashParade'
  | 'loopTheLoop'
  | 'relayRush'
  | 'bigSquish'
  | 'slipSlide'
  | 'geyserToss'
  | 'dustDevil'
  | 'dropBonk';

interface ComboDef {
  id: ComboId;
  type: NubbinType;
  kind: 'bonk' | 'splash' | 'support';
  aoe: MoveDef['grid']['aoe'];
  status?: MoveDef['status'];
  mood?: MoveDef['mood'];
  /** Pushes each target one tile away from the first caller. */
  knock?: boolean;
  power?: number;
}

const pair = (a: NubbinType, b: NubbinType): string => [a, b].sort().join('+');

const COMBOS: Record<string, ComboDef> = {
  [pair('swim', 'fly')]: {
    id: 'rainDanceHug',
    type: 'swim',
    kind: 'splash',
    aoe: 'ring1',
    status: { id: 'soggy', chance: 0.6 },
  },
  [pair('run', 'power')]: {
    id: 'wheelbarrowCharge',
    type: 'power',
    kind: 'bonk',
    aoe: 'line2',
    knock: true,
  },
  [pair('swim', 'swim')]: { id: 'splashParade', type: 'swim', kind: 'splash', aoe: 'cross1' },
  [pair('fly', 'fly')]: {
    id: 'loopTheLoop',
    type: 'fly',
    kind: 'bonk',
    aoe: 'single',
    status: { id: 'dizzy', chance: 0.5 },
  },
  [pair('run', 'run')]: {
    id: 'relayRush',
    type: 'run',
    kind: 'bonk',
    aoe: 'single',
    power: R.comboPower * 1.3,
  },
  [pair('power', 'power')]: {
    id: 'bigSquish',
    type: 'power',
    kind: 'bonk',
    aoe: 'single',
    power: R.comboPower * 1.2,
  },
  [pair('swim', 'run')]: {
    id: 'slipSlide',
    type: 'swim',
    kind: 'splash',
    aoe: 'line2',
    status: { id: 'soggy', chance: 0.5 },
  },
  [pair('swim', 'power')]: {
    id: 'geyserToss',
    type: 'swim',
    kind: 'splash',
    aoe: 'single',
    knock: true,
  },
  [pair('fly', 'run')]: {
    id: 'dustDevil',
    type: 'fly',
    kind: 'bonk',
    aoe: 'ring1',
    status: { id: 'dizzy', chance: 0.3 },
  },
  [pair('fly', 'power')]: {
    id: 'dropBonk',
    type: 'fly',
    kind: 'bonk',
    aoe: 'single',
    power: R.comboPower * 1.25,
  },
};

const HIGH_FIVE: ComboDef = {
  id: 'highFive',
  type: 'normal',
  kind: 'support',
  aoe: 'single',
  mood: { stat: 'bonk', delta: 1, who: 'self', chance: 1 },
};

/** The combo for a type pair; any pair with a Normal is a High Five (both Pumped). */
export function comboFor(a: NubbinType, b: NubbinType): ComboDef {
  if (a === 'normal' || b === 'normal') return HIGH_FIVE;
  return COMBOS[pair(a, b)] ?? HIGH_FIVE;
}

export const COMBO_IDS: readonly ComboId[] = [
  'rainDanceHug',
  'wheelbarrowCharge',
  'highFive',
  'splashParade',
  'loopTheLoop',
  'relayRush',
  'bigSquish',
  'slipSlide',
  'geyserToss',
  'dustDevil',
  'dropBonk',
];

/** The combo as a move the engine can resolve. */
export function comboMove(c: ComboDef): MoveDef & { knock?: boolean } {
  return {
    id: `combo:${c.id}`,
    type: c.type,
    align: 'none',
    kind: c.kind,
    power: c.kind === 'support' ? 0 : (c.power ?? R.comboPower),
    acc: 1,
    puff: R.comboPuff,
    priority: 0,
    ...(c.status ? { status: c.status } : {}),
    ...(c.mood ? { mood: c.mood } : {}),
    target: c.kind === 'support' ? 'self' : 'foe',
    grid: { range: [1, 1], aoe: c.aoe, heightReach: 2 },
    anim: 'combo',
    source: 'basic',
    ...(c.knock ? { knock: true } : {}),
  };
}

/** Friends enough for "Together!" (60 and up). */
export const friendsEnough = (score: number): boolean => score >= R.friendsAt;
