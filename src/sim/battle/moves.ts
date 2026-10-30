import type { NubbinType } from '../types';
import { BATTLE_CONTENT } from '../../config/tuning-battle';
import type { MoveDef, MoveKind, MoveSource } from './types';

/**
 * Every move, as data only (recs FIGHT-16). Names and blurbs live in
 * `config/strings-battle-moves.ts`; where each move is learned lives in `moves-sources.ts`.
 * Powers sit around 40 for a starter, 55–70 for a form's signature and 90 for an Eternal's,
 * and Puff costs rise with them, so the 0-cost Bonk is always there (no softlocks).
 */
type Opts = Partial<Omit<MoveDef, 'id' | 'type' | 'kind' | 'power' | 'puff' | 'source'>>;

const SINGLE: MoveDef['grid'] = { range: [1, 1], aoe: 'single', heightReach: 1 };

function m(
  id: string,
  type: NubbinType,
  kind: MoveKind,
  power: number,
  puff: number,
  source: MoveSource,
  o: Opts = {},
): MoveDef {
  const status = kind === 'status' || kind === 'support';
  return {
    id,
    type,
    align: 'none',
    kind,
    power,
    acc: status ? 0.9 : 0.95,
    puff,
    priority: 0,
    target: kind === 'support' ? 'self' : 'foe',
    grid: SINGLE,
    anim: kind === 'splash' ? 'cast' : kind === 'bonk' ? 'lunge' : 'pose',
    source,
    ...o,
  };
}

const ALL_FOES: Opts = { target: 'allFoes', grid: { range: [1, 3], aoe: 'ring1', heightReach: 1 } };

export const MOVES: readonly MoveDef[] = [
  // ---- always there ----
  m('bonk', 'normal', 'bonk', 40, 0, 'basic', { acc: 1, anim: 'bonk' }),
  m('huddle', 'normal', 'support', 0, 3, 'basic', {
    target: 'allAllies',
    heal: 0.15,
    anim: 'huddle',
  }),

  // ---- species kits ----
  m('wobble', 'normal', 'bonk', 45, 1, 'species', {
    status: { id: 'dizzy', chance: 0.2 },
    anim: 'wobble',
  }),
  m('static-hug', 'run', 'bonk', 45, 1, 'species', { anim: 'hug' }),
  m('zip-zap', 'run', 'splash', 50, 2, 'species', { status: { id: 'giggly', chance: 0.3 } }),
  m('bubble-blow', 'swim', 'splash', 40, 1, 'species', { status: { id: 'soggy', chance: 0.2 } }),
  m('hop-bump', 'normal', 'bonk', 45, 1, 'species', { anim: 'hop' }),
  m('puppy-eyes', 'normal', 'status', 0, 1, 'species', {
    mood: { stat: 'bonk', delta: -1, who: 'target', chance: 0.8 },
  }),
  m('bubble-pop', 'swim', 'splash', 45, 1, 'species'),
  m('gust-pat', 'fly', 'splash', 45, 1, 'species'),
  m('scamper-swipe', 'run', 'bonk', 45, 1, 'species', { ground: true }),
  m('stone-nudge', 'power', 'bonk', 50, 1, 'species', { acc: 0.9, ground: true }),
  m('pound-puff', 'normal', 'bonk', 50, 1, 'species'),

  // ---- critter parts ----
  m('belly-slide', 'swim', 'bonk', 40, 1, 'critter', { priority: 1, ground: true, anim: 'slide' }),
  m('flipper-slap', 'swim', 'bonk', 55, 2, 'critter'),
  m('splash-back', 'swim', 'splash', 50, 2, 'critter', { status: { id: 'soggy', chance: 0.3 } }),
  m('fan-dazzle', 'fly', 'status', 0, 1, 'critter', {
    mood: { stat: 'acc', delta: -1, who: 'target', chance: 0.9 },
    anim: 'fan',
  }),
  m('copycat', 'normal', 'status', 0, 2, 'critter', { special: 'copycat', acc: 1 }),
  m('dive-hug', 'fly', 'bonk', 65, 3, 'critter', { acc: 0.9, anim: 'dive' }),
  m('zoomies', 'run', 'support', 0, 1, 'critter', {
    mood: { stat: 'zip', delta: 1, who: 'self', chance: 1 },
    anim: 'zoom',
  }),
  m('ear-flop', 'run', 'bonk', 45, 1, 'critter', { status: { id: 'dizzy', chance: 0.2 } }),
  m('snuffle-charge', 'run', 'bonk', 60, 2, 'critter', { acc: 0.9, ground: true, anim: 'charge' }),
  m('chest-drum', 'power', 'support', 0, 2, 'critter', {
    mood: { stat: 'bonk', delta: 1, who: 'self', chance: 1 },
    anim: 'drum',
  }),
  m('bear-hug', 'power', 'bonk', 50, 2, 'critter', {
    status: { id: 'sticky', chance: 0.5 },
    anim: 'hug',
  }),
  m('pounce', 'power', 'bonk', 60, 2, 'critter', { ground: true, anim: 'pounce' }),
  m('woolly-wall', 'normal', 'support', 0, 2, 'critter', {
    target: 'allAllies',
    mood: { stat: 'guard', delta: 1, who: 'allies', chance: 1 },
  }),
  m('pocket-snack', 'normal', 'bonk', 35, 1, 'critter', { special: 'snack', heal: 0.1 }),
  m('pong', 'normal', 'status', 0, 2, 'critter', {
    ...ALL_FOES,
    mood: { stat: 'acc', delta: -1, who: 'foes', chance: 0.7 },
  }),

  // ---- kindergarten lessons ----
  m('doodle-decoy', 'normal', 'support', 0, 2, 'lesson', { special: 'decoy', anim: 'draw' }),
  m('lullaby', 'normal', 'status', 0, 2, 'lesson', {
    status: { id: 'drowsy', chance: 0.7 },
    anim: 'sing',
  }),
  m('jiggle-jig', 'normal', 'support', 0, 3, 'lesson', {
    target: 'allAllies',
    mood: { stat: 'zip', delta: 1, who: 'allies', chance: 1 },
    anim: 'dance',
  }),
  m('kazoo-blast', 'normal', 'splash', 25, 2, 'lesson', { ...ALL_FOES, acc: 1, anim: 'kazoo' }),

  // ---- the 15 adult forms: a signature each ----
  m('halo-wave', 'swim', 'splash', 65, 3, 'form', { align: 'sun' }),
  m('halo-glide', 'fly', 'splash', 65, 3, 'form', { align: 'sun', anim: 'glide' }),
  m('sunbeam-dash', 'run', 'bonk', 65, 3, 'form', { align: 'sun', priority: 1 }),
  m('radiant-bonk', 'power', 'bonk', 70, 3, 'form', { align: 'sun' }),
  m('warm-glow', 'normal', 'support', 0, 3, 'form', {
    align: 'sun',
    target: 'allAllies',
    heal: 0.2,
  }),
  m('moonshade-tide', 'swim', 'splash', 65, 3, 'form', { align: 'moon' }),
  m('night-swoop', 'fly', 'bonk', 65, 3, 'form', { align: 'moon', anim: 'dive' }),
  m('shadow-scamper', 'run', 'bonk', 65, 3, 'form', { align: 'moon', priority: 1 }),
  m('moonshade-bonk', 'power', 'bonk', 70, 3, 'form', { align: 'moon' }),
  m('gloom-hum', 'normal', 'status', 0, 3, 'form', {
    align: 'moon',
    ...ALL_FOES,
    mood: { stat: 'bonk', delta: -1, who: 'foes', chance: 0.8 },
  }),
  m('river-roll', 'swim', 'bonk', 60, 2, 'form', { ground: true }),
  m('breeze-loop', 'fly', 'splash', 60, 2, 'form'),
  m('meadow-dash', 'run', 'bonk', 60, 2, 'form', { ground: true }),
  m('boulder-hug', 'power', 'bonk', 65, 3, 'form', { acc: 0.9 }),
  m('steady-smile', 'normal', 'support', 0, 2, 'form', {
    target: 'allAllies',
    mood: { stat: 'guard', delta: 1, who: 'allies', chance: 1 },
  }),

  // ---- the three Eternal (Chaos) forms ----
  m('eternal-dawn', 'normal', 'splash', 90, 5, 'chaos', { align: 'sun', ...ALL_FOES }),
  m('eternal-dusk', 'normal', 'splash', 90, 5, 'chaos', { align: 'moon', ...ALL_FOES }),
  m('eternal-hush', 'normal', 'splash', 90, 5, 'chaos', { ...ALL_FOES }),

  // ---- the pocket and digi finals, by family and type ----
  m('tidal-tumble', 'swim', 'splash', 75, 4, 'final'),
  m('sky-twirl', 'fly', 'splash', 75, 4, 'final'),
  m('thunder-scoot', 'run', 'bonk', 75, 4, 'final', { priority: 1 }),
  m('mighty-mash', 'power', 'bonk', 80, 4, 'final', { acc: 0.9 }),
  m('big-bounce', 'normal', 'bonk', 75, 4, 'final'),
  m('mega-clank', 'power', 'bonk', 80, 4, 'final', { acc: 0.9 }),
  m('giant-hug', 'normal', 'bonk', 75, 4, 'final', { status: { id: 'sticky', chance: 0.3 } }),
  m('drift-dream', 'swim', 'status', 0, 3, 'final', { status: { id: 'drowsy', chance: 0.6 } }),
  m('feather-cloud', 'fly', 'support', 0, 3, 'final', {
    target: 'allAllies',
    mood: { stat: 'guard', delta: 1, who: 'allies', chance: 1 },
  }),
  m('turbo-trot', 'run', 'bonk', 70, 4, 'final', { priority: 1 }),

  // ---- round 5 comedy (recs FIGHT-75): a personality's own move, the dojo belts' lessons
  // and a consolation for a good loser. Where each is learned is in `moves-sources.ts`. ----
  m('belly-flop', 'normal', 'bonk', 50, 2, 'species', { acc: 0.9, anim: 'flop' }),
  m('pillow-fort', 'normal', 'support', 0, 2, 'species', {
    mood: { stat: 'guard', delta: 1, who: 'self', chance: 1 },
    anim: 'fort',
  }),
  m('noogie', 'normal', 'bonk', 40, 1, 'species', {
    status: { id: 'giggly', chance: 0.3 },
    anim: 'noogie',
  }),
  m('nap-attack', 'normal', 'support', 0, 2, 'species', { heal: 0.2, anim: 'nap' }),
  m('polite-shove', 'normal', 'bonk', 40, 1, 'lesson', { priority: 1, anim: 'shove' }),
  m('stare-contest', 'normal', 'status', 0, 1, 'lesson', {
    mood: { stat: 'acc', delta: -1, who: 'target', chance: 0.8 },
    anim: 'stare',
  }),
  m('hug-of-doom', 'power', 'bonk', 60, 3, 'lesson', {
    status: { id: 'sticky', chance: 0.3 },
    anim: 'hug',
  }),
  m('dramatic-gasp', 'normal', 'status', 0, 1, 'lesson', {
    ...ALL_FOES,
    mood: { stat: 'bonk', delta: -1, who: 'foes', chance: 0.5 },
    anim: 'gasp',
  }),

  // ---- the Normal fallback, so a loadout is never empty ----
  m('raspberry', 'normal', 'status', 0, 1, 'fallback', {
    mood: { stat: 'bonk', delta: -1, who: 'target', chance: 0.3 },
  }),
  m('tickle-storm', 'normal', 'bonk', 35, 1, 'fallback', { status: { id: 'giggly', chance: 0.3 } }),
];

const BY_ID = new Map(MOVES.map((d) => [d.id, d]));

export function moveById(id: string): MoveDef | undefined {
  return BY_ID.get(id);
}

/** Bonk, for a missing id. */
export function moveOf(id: string): MoveDef {
  return BY_ID.get(id) ?? BY_ID.get('bonk')!;
}

// ---- Round 5: one move list for both modes (recs FIGHT-70) ----

/**
 * A move as content: every move has both a turn block and a grid block, unless it says it is
 * for one mode only. `gridOnly` and `turnOnly` are not on `MoveDef` yet (that type is owned
 * by the battle core); a move that needs one sets it here and the lint test reads it.
 */
export type ContentMove = MoveDef & { gridOnly?: true; turnOnly?: true };

/** A turn move's priority on the grid: +1 priority is +10 CT for its user. */
export function ctBonusOf(d: MoveDef): number {
  return d.priority * BATTLE_CONTENT.ctPerPriority;
}

/**
 * Why a move breaks the shared rules, or an empty list. The rules: a turn block (power, acc,
 * puff, priority, target) and a grid block (range, aoe, heightReach) unless marked one-mode,
 * an anim, and turn `allFoes` exactly when the grid hits a ring.
 */
export function moveProblems(d: ContentMove): string[] {
  const out: string[] = [];
  const num = (v: unknown): boolean => typeof v === 'number' && Number.isFinite(v);
  const turnOk =
    num(d.power) && num(d.acc) && num(d.puff) && num(d.priority) && typeof d.target === 'string';
  const g = d.grid as MoveDef['grid'] | undefined;
  const gridOk =
    !!g && Array.isArray(g.range) && g.range.length === 2 && !!g.aoe && num(g.heightReach);
  if (!turnOk && !d.gridOnly) out.push('no turn block');
  if (!gridOk && !d.turnOnly) out.push('no grid block');
  if (!d.anim) out.push('no anim');
  if (turnOk && gridOk && (d.target === 'allFoes') !== (g.aoe === 'ring1'))
    out.push('allFoes and a ring aoe must go together');
  return out;
}
