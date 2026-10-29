import { CRITTER_SPECIES } from '../critters';
import { LESSON_IDS } from '../kindergarten';
import { SPECIES, type Family } from '../species';
import type { AlignmentBand, Nubbin, NubbinType, Personality, SimEvent } from '../types';
import { moveOf } from './moves';
import type { MoveDef, NubbinBattle } from './types';

/**
 * Where moves come from (recs FIGHT-16) and the four slots (FIGHT-17). A Nubbin's history
 * shows in its kit: its species, the critter parts it wears, its kindergarten lessons, its
 * adult form, an Eternal's ultimate and a final species' signature, plus a Normal fallback so
 * a loadout is never empty. `Nubbin.battle` is optional in the save: `battleOf` fills it the
 * first time it is read, and `syncMoves` (once a sim second) adds new moves to empty slots.
 */

/** Two moves per species, by family and type, with the Zapling line and digi babies apart. */
const TYPE_MOVE: Record<NubbinType, string> = {
  swim: 'bubble-pop',
  fly: 'gust-pat',
  run: 'scamper-swipe',
  power: 'stone-nudge',
  normal: 'pound-puff',
};
const FAMILY_MOVE: Record<Family, string> = {
  chao: 'wobble',
  pocket: 'puppy-eyes',
  digi: 'hop-bump',
};
const ZAP_LINE = ['zapling', 'zapkin', 'zapmaw'];

export function speciesKit(speciesId: string): string[] {
  const sp = SPECIES.find((s) => s.id === speciesId);
  if (!sp) return ['wobble'];
  if (sp.family === 'chao') return ['bonk', 'wobble'];
  if (ZAP_LINE.includes(sp.id)) return ['static-hug', 'zip-zap'];
  if (sp.family === 'digi' && sp.stage === 'baby') return ['bubble-blow', 'hop-bump'];
  return [TYPE_MOVE[sp.type], FAMILY_MOVE[sp.family]];
}

/** One move per critter; both of a critter's parts teach it. */
export const CRITTER_MOVE: Record<string, string> = {
  penguin: 'belly-slide',
  seal: 'flipper-slap',
  otter: 'splash-back',
  peacock: 'fan-dazzle',
  parrot: 'copycat',
  condor: 'dive-hug',
  cheetah: 'zoomies',
  rabbit: 'ear-flop',
  boar: 'snuffle-charge',
  gorilla: 'chest-drum',
  bear: 'bear-hug',
  tiger: 'pounce',
  sheep: 'woolly-wall',
  raccoon: 'pocket-snack',
  skunk: 'pong',
};

/** The critter behind a part id such as "rabbit-ears". */
export const partCritter = (part: string): string => part.split('-')[0] ?? part;

export const LESSON_MOVE: Record<string, string> = {
  drawing: 'doodle-decoy',
  singing: 'lullaby',
  dance: 'jiggle-jig',
  instrument: 'kazoo-blast',
};
/** A lesson at this level polishes its move. */
export const LESSON_BOOST_LEVEL = 3;

export const FORM_MOVE: Record<`${AlignmentBand}:${NubbinType}`, string> = {
  'sun:swim': 'halo-wave',
  'sun:fly': 'halo-glide',
  'sun:run': 'sunbeam-dash',
  'sun:power': 'radiant-bonk',
  'sun:normal': 'warm-glow',
  'moon:swim': 'moonshade-tide',
  'moon:fly': 'night-swoop',
  'moon:run': 'shadow-scamper',
  'moon:power': 'moonshade-bonk',
  'moon:normal': 'gloom-hum',
  'neutral:swim': 'river-roll',
  'neutral:fly': 'breeze-loop',
  'neutral:run': 'meadow-dash',
  'neutral:power': 'boulder-hug',
  'neutral:normal': 'steady-smile',
};

export const CHAOS_MOVE: Record<AlignmentBand, string> = {
  sun: 'eternal-dawn',
  moon: 'eternal-dusk',
  neutral: 'eternal-hush',
};

export const FINAL_MOVE: Record<`${Exclude<Family, 'chao'>}:${NubbinType}`, string> = {
  'pocket:swim': 'tidal-tumble',
  'pocket:fly': 'sky-twirl',
  'pocket:run': 'thunder-scoot',
  'pocket:power': 'mighty-mash',
  'pocket:normal': 'big-bounce',
  'digi:swim': 'drift-dream',
  'digi:fly': 'feather-cloud',
  'digi:run': 'turbo-trot',
  'digi:power': 'mega-clank',
  'digi:normal': 'giant-hug',
};

/**
 * Round 5 comedy moves (recs FIGHT-75). A personality, once set at evolution, brings its own
 * move; each dojo belt teaches one; and a good loser, after a few lost bouts, learns the
 * Dramatic Gasp. None of these is a grind: they arrive with things the Nubbin does anyway.
 */
export const PERSONALITY_MOVE: Record<Personality, string> = {
  cheerful: 'belly-flop',
  shy: 'pillow-fort',
  mischievous: 'noogie',
  lazy: 'nap-attack',
};
/** By belt: belt 1 teaches the first, and so on. */
export const BELT_MOVES = ['polite-shove', 'stare-contest', 'hug-of-doom'];
export const GOOD_LOSER = { move: 'dramatic-gasp', losses: 3 };

export const FALLBACK_MOVES = ['raspberry', 'tickle-storm'];

/** Moves every combatant has without a slot. */
export const BASIC_MOVES = ['bonk', 'huddle'];

/** Every move this Nubbin's history teaches, in the order it learned them (roughly). */
export function sourcesOf(n: Nubbin): string[] {
  const out: string[] = [];
  const add = (id: string | undefined): void => {
    if (id && !BASIC_MOVES.includes(id) && !out.includes(id)) out.push(id);
  };
  for (const id of speciesKit(n.species)) add(id);
  for (const part of Object.values(n.parts)) if (part) add(CRITTER_MOVE[partCritter(part)]);
  for (const l of LESSON_IDS) if ((n.lessons[l] ?? 0) >= 1) add(LESSON_MOVE[l]);
  if (n.form) add(FORM_MOVE[`${n.form.band}:${n.form.type}`]);
  if (n.eternal) add(CHAOS_MOVE[n.eternal]);
  const sp = SPECIES.find((s) => s.id === n.species);
  if (sp && sp.stage === 'final' && sp.family !== 'chao')
    add(FINAL_MOVE[`${sp.family}:${sp.type}`]);
  if (n.personality) add(PERSONALITY_MOVE[n.personality]);
  BELT_MOVES.slice(0, n.karate?.belt ?? 0).forEach(add);
  if ((n.battle?.losses ?? 0) >= GOOD_LOSER.losses) add(GOOD_LOSER.move);
  for (const id of FALLBACK_MOVES) add(id);
  return out;
}

/** Moves a level-3 lesson has polished. */
export function boostedOf(n: Nubbin): string[] {
  return LESSON_IDS.filter((l) => (n.lessons[l] ?? 0) >= LESSON_BOOST_LEVEL).map(
    (l) => LESSON_MOVE[l]!,
  );
}

/** How good a move is to slot by default: signatures first, then power, then effects. */
function rank(d: MoveDef): number {
  const tier = { chaos: 300, final: 200, form: 200, critter: 50, lesson: 50 }[d.source as string];
  return (tier ?? 0) + d.power + (d.status ? 20 : 0) + (d.mood ? 15 : 0) + (d.heal ? 25 : 0);
}

/** The best four of `known`, strongest first. */
export function bestFour(known: string[]): NubbinBattle['slots'] {
  const top = [...known].sort((a, b) => rank(moveOf(b)) - rank(moveOf(a))).slice(0, 4);
  return [top[0] ?? null, top[1] ?? null, top[2] ?? null, top[3] ?? null];
}

/** The Nubbin's battle record, or what it would be: never writes (safe for the UI). */
export function peekBattle(n: Nubbin): NubbinBattle {
  if (n.battle) return n.battle;
  const known = sourcesOf(n);
  return { known, slots: bestFour(known), wins: 0, losses: 0, befriended: 0, life: n.rebirths };
}

/** The sim's way in: creates the record from the Nubbin's history the first time. */
export function battleOf(n: Nubbin): NubbinBattle {
  return (n.battle ??= peekBattle(n));
}

/** The slotted moves, without gaps. */
export function slottedMoves(n: Nubbin): string[] {
  return peekBattle(n).slots.filter((x): x is string => x !== null);
}

/**
 * New moves join `known` and the first empty slot; with all four full, a `moveLearned` event
 * asks the Keeper whether to swap one in. A rebirth keeps `known` and resets the slots to the
 * best four.
 */
export function syncMoves(n: Nubbin, events: SimEvent[]): void {
  if (n.stage === 'egg') return;
  const b = battleOf(n);
  if (b.life !== n.rebirths) {
    b.life = n.rebirths;
    b.slots = bestFour(b.known);
  }
  for (const id of sourcesOf(n)) {
    if (b.known.includes(id)) continue;
    b.known.push(id);
    const empty = b.slots.indexOf(null);
    if (empty >= 0) b.slots[empty] = id;
    events.push({ kind: 'moveLearned', nubbinId: n.id, move: id, slotted: empty >= 0 });
  }
}

/** Sets the four slots from the stats sheet: only known moves, no repeats. */
export function setSlots(n: Nubbin, slots: (string | null)[]): boolean {
  const b = battleOf(n);
  const clean: (string | null)[] = [];
  for (let i = 0; i < 4; i++) {
    const id = slots[i] ?? null;
    if (id !== null && (!b.known.includes(id) || clean.includes(id))) return false;
    clean.push(id);
  }
  if (clean.every((x) => x === null)) return false;
  b.slots = clean as NubbinBattle['slots'];
  return true;
}

/** For the exhaustiveness test: every critter species has a move. */
export const CRITTER_IDS = CRITTER_SPECIES.map((c) => c.id);
