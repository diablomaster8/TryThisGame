import { BATTLE_STORY_MAPS } from '../../config/battle-maps';
import { BATTLE_R6 } from '../../config/tuning-battle-r6';
import type { NubbinType, SimEvent, World } from '../types';
import type { BattleContext } from './types';
import { QUIET_CHAPTERS } from './contexts';
import { startBattleCmd } from './core';
import { circuitTeam } from './circuit';
import { createTactics } from './tactics/engine';
import { keeperSeed } from './tactics/keeper-unit';
import { mapFromRows } from './tactics/map';
import type { Objective } from './tactics/types';
import { unitFromLevels, unitFromNubbin } from './tactics/units';
import './tactics/ai';

/**
 * The story battles (recs FIGHT-82) and the Hollow's floor-5 guardian (FIGHT-72). Each story
 * battle has a scene in `content/battles-story.ts` ending on a choice: `fight` (or `defend`)
 * starts the bout here, `skip` (or `talk`) lets the story go on as if it never happened. All
 * are optional: the campaign reads none of these results, so no ending ever waits on one.
 * None is offered in chapters 9–11 except Corvin's garden, which is the opt-in choice there.
 *
 * Results live in `world.storyBouts` (optional, no save bump): the choice made and `won` once
 * the bout is won, matched on the `story` source and the bout's key.
 */
export type StoryBoutId = 'exhibition' | 'rumble' | 'fort' | 'corvin' | 'logged' | 'remembering';

export const STORY_SOURCE = 'story';
export const GUARDIAN_SOURCE = 'guardian';

export type StoryBoutMark = 'fight' | 'skip' | 'won';

interface Row {
  /** Whether the scene may be offered now. */
  open: (w: World) => boolean;
  /** Turn bout (`turn`) or a tactics map (`tactics`). */
  mode: 'turn' | 'tactics';
}

const chapter = (w: World): number => w.campaign?.chapter ?? 0;
const quiet = (w: World): boolean => QUIET_CHAPTERS.includes(chapter(w));
const grove = (w: World): boolean => !!w.campaign && w.campaign.storyline === null;
const sideDone = (w: World, id: string): boolean => w.campaign?.side[id]?.status === 'done';
const happyEnding = (w: World): boolean => {
  const e = w.campaign?.ending;
  return !!e && e !== 'moss-sleeps' && e !== 'collector';
};

export const STORY_BOUTS: Readonly<Record<StoryBoutId, Row>> = {
  exhibition: { mode: 'turn', open: (w) => grove(w) && chapter(w) >= 5 && !quiet(w) },
  rumble: { mode: 'tactics', open: (w) => grove(w) && chapter(w) >= 8 && !quiet(w) },
  fort: { mode: 'tactics', open: (w) => grove(w) && chapter(w) >= 12 && sideDone(w, 's20') },
  // The one bout inside chapters 9–11, and only because the Keeper chooses it.
  corvin: { mode: 'tactics', open: (w) => grove(w) && chapter(w) === 9 },
  logged: { mode: 'turn', open: (w) => w.campaign?.storyline === 'logged' },
  remembering: { mode: 'tactics', open: (w) => grove(w) && happyEnding(w) },
};

export const storyBoutsOf = (w: World): Partial<Record<string, StoryBoutMark>> =>
  w.storyBouts ?? {};

/** The scene's choice: records it and, for `fight`, starts the bout. */
export function storyBoutChoice(
  world: World,
  id: StoryBoutId,
  fight: boolean,
  ids: readonly string[],
  events: SimEvent[],
): boolean {
  const row = STORY_BOUTS[id];
  if (!row || !row.open(world)) return false;
  const marks = (world.storyBouts ??= {});
  if (id === 'corvin') marks['corvin-choice'] = fight ? 'fight' : 'skip';
  if (!fight) {
    if (marks[id] !== 'won') marks[id] = 'skip';
    return true;
  }
  if (marks[id] !== 'won') marks[id] = 'fight';
  const party = hatchedOf(world, ids);
  if (!party.length) return false;
  if (row.mode === 'turn') return startTurnBout(world, id, party, events);
  return startStoryTactics(world, `bs-${id}`, STORY_SOURCE, party, events);
}

/** Called when a bout ends: marks a won story bout (by its key `bs-<id>`). */
export function markStoryBout(world: World, source: string, key: string, won: boolean): void {
  if (source !== STORY_SOURCE || !won || !key.startsWith('bs-')) return;
  (world.storyBouts ??= {})[key.slice(3)] = 'won';
}

export function hatchedOf(world: World, ids: readonly string[]): string[] {
  const ok = (id: string) =>
    world.nubbins.some((n) => n.id === id && n.stage !== 'egg' && n.stage !== 'cocoon');
  const out = ids.filter(ok);
  for (const n of world.nubbins)
    if (out.length < 6 && !out.includes(n.id) && ok(n.id)) out.push(n.id);
  return out;
}

function startTurnBout(
  world: World,
  id: StoryBoutId,
  party: string[],
  events: SimEvent[],
): boolean {
  const before = world.battleRuns ?? 0;
  startBattleCmd(world, storyTurnContext(world, id, party), events);
  return (world.battleRuns ?? 0) > before;
}

/**
 * The turn bout for a story battle: the screen starts it through its pre-bout sheet, the
 * `storyBout` command starts it straight away. Both settle the same way (source `story`).
 */
export function storyTurnContext(
  world: World,
  id: StoryBoutId,
  party: readonly string[],
): Extract<BattleContext, { kind: 'encounter' }> {
  if (id === 'exhibition') {
    // A 3v3 against Sparks: her Circuit team at Champion size, a comedic warm-up.
    const foes = circuitTeam(world, 'sparks', true).map((species) => ({ species, level: 8 }));
    return {
      kind: 'encounter',
      tier: 2,
      ids: party.slice(0, 3),
      source: STORY_SOURCE,
      key: 'bs-exhibition',
      foes,
      singles: true,
    };
  }
  // Logged In's finale: 5v5 on the Night server, Juno's two beside your three.
  const foes = ['dinolet', 'croaklet', 'skyserpent', 'dinolet', 'skyserpent'].map((species) => ({
    species,
    level: 14,
  }));
  return {
    kind: 'encounter',
    tier: 3,
    ids: party.slice(0, 5),
    source: STORY_SOURCE,
    key: 'bs-logged',
    foes,
  };
}

interface StoryMapRow {
  map: string;
  objective: Objective;
  allies: number;
  foes: { species: string; type: NubbinType; calm?: boolean }[];
  level: number;
  fruit?: { x: number; y: number }[];
}

/** Each tactics story bout's map, objective and foes (the guardian is the Hollow's own). */
const TACTICS_BOUTS: Readonly<Record<string, StoryMapRow>> = {
  'bs-rumble': {
    map: 'rumble-room',
    objective: { kind: 'reach', goal: { x: 9, y: 1 } },
    allies: 4,
    foes: [
      { species: 'zapkin', type: 'run' },
      { species: 'scrapper', type: 'power' },
      { species: 'zapkin', type: 'run' },
      { species: 'scrapper', type: 'power' },
    ],
    level: 10,
  },
  'bs-fort': {
    map: 'snow-fort',
    objective: { kind: 'gather', count: 5 },
    allies: 4,
    foes: [
      { species: 'croaklet', type: 'swim' },
      { species: 'zapkin', type: 'run' },
      { species: 'croaklet', type: 'swim' },
      { species: 'scrapper', type: 'power' },
    ],
    level: 12,
    fruit: [
      { x: 2, y: 1 },
      { x: 7, y: 1 },
      { x: 4, y: 3 },
      { x: 5, y: 5 },
      { x: 2, y: 6 },
      { x: 8, y: 6 },
      { x: 5, y: 2 },
      { x: 6, y: 4 },
      { x: 3, y: 4 },
    ],
  },
  'bs-corvin': {
    map: 'corvin-garden',
    objective: { kind: 'protectPlot', rounds: 6 },
    allies: 3,
    foes: [
      { species: 'zapkin', type: 'run' },
      { species: 'scrapper', type: 'power' },
      { species: 'zapkin', type: 'run' },
    ],
    level: 12,
  },
  'bs-remembering': {
    map: 'old-cold',
    objective: { kind: 'calmBoss', target: 'foe-0' },
    allies: 5,
    foes: [
      { species: 'spinmaster', type: 'normal', calm: true },
      { species: 'zapkin', type: 'run' },
      { species: 'scrapper', type: 'power' },
    ],
    level: 18,
  },
  guardian: {
    map: 'guardian-hall',
    objective: { kind: 'calmBoss', target: 'foe-0' },
    allies: 3,
    foes: [
      { species: 'spinmaster', type: 'normal', calm: true },
      { species: 'zapkin', type: 'run' },
      { species: 'scrapper', type: 'power' },
    ],
    level: BATTLE_R6.guardian.level,
  },
};

/** Starts a tactics story bout (or the guardian) on its authored map; false if one is on. */
export function startStoryTactics(
  world: World,
  key: string,
  source: string,
  party: readonly string[],
  events: SimEvent[],
): boolean {
  if (world.tactics && !world.tactics.result) return false;
  const row = TACTICS_BOUTS[source === GUARDIAN_SOURCE ? 'guardian' : key];
  if (!row) return false;
  const ids = party.slice(0, row.allies);
  const nubbins = ids.map((id) => world.nubbins.find((n) => n.id === id)!).filter(Boolean);
  if (!nubbins.length) return false;
  const authored = BATTLE_STORY_MAPS[row.map];
  if (!authored) return false;
  const map = mapFromRows(authored.rows, authored.heights);
  const allies = nubbins.map((n) => unitFromNubbin(n, world));
  const avg = Math.round(allies.reduce((s, u) => s + u.c.level, 0) / allies.length);
  const level = Math.max(row.level, avg);
  const foes = row.foes.map((f, i) => {
    const u = unitFromLevels({
      id: `foe-${i}`,
      side: 1,
      species: f.species,
      level: i ? level - 1 : level + 2,
      type: f.type,
    });
    if (f.calm) {
      u.c.calm = 0;
      u.c.moves = ['wobble', 'lullaby', 'raspberry'];
    }
    return u;
  });
  const seed = (world.battleRuns ?? 0) * 7919 + key.length * 131 + 29;
  world.battleRuns = (world.battleRuns ?? 0) + 1;
  world.tactics = createTactics({
    seed,
    map,
    allies: [...allies, keeperSeed()],
    foes,
    context: {
      kind: 'encounter',
      tier: 3,
      ids,
      source,
      key,
      foes: row.foes.map((f, i) => ({
        species: f.species,
        level,
        ...(i === 0 && f.calm ? { wild: true } : {}),
      })),
    },
    objective: row.objective,
    ai: [null, 'keeper'],
    aura: null,
    ...(row.fruit ? { fruit: row.fruit } : {}),
  });
  events.push({ kind: 'tacticsStart', source, key });
  return true;
}

/**
 * The Hollow's floor-5 guardian (FIGHT-72): a calm-only Old Shadow in its hall. Lane B's
 * floor 5 calls this on entering the guardian room and matches `tacticsEnd` on the
 * `guardian` source and the key it passes. Winning gives a keepsake once (paid by the slice).
 */
export function startGuardian(
  world: World,
  events: SimEvent[],
  o: { depth: number; key: string; ids?: readonly string[] },
): boolean {
  if (o.depth !== BATTLE_R6.guardian.depth) return false;
  return startStoryTactics(world, o.key, GUARDIAN_SOURCE, hatchedOf(world, o.ids ?? []), events);
}
