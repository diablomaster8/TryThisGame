import type { LineProgress, SideWorld } from '../side-saves';
import type { World } from '../types';
import { battleAct, createBattle } from './core';
import { battleSeedFor } from './rewards';
import type { BattleAction, BattleContext, BattleState } from './types';
import { SURVIVE_NAMES } from '../../config/strings-battle-r6';

/**
 * Story-world bouts (recs FIGHT-98, FIGHT-72). The Atlas, the Arcade, the Multiverse and
 * Neopia read the Grove and never write it, so a bout there is fought by copies: the Grove is
 * cloned at entry (the "sandbox"), the bout runs in the clone, and the only thing kept is the
 * result, written into the story world's own line progress (its side save). The Grove's
 * `world` is never touched: no Shells, records, moves seen or battle counters.
 *
 * Each world brings its own tone pack of foes (the Arcade's are 8-bit invaders), unless the
 * page names its own. The Keeper is a guest: the Nubbins act, the source's heroes keep their
 * story, so nothing here speaks for them.
 */

/** The world's own foes when a page names none: species stand-ins and a name slot each. */
export const WORLD_TONE: Readonly<Record<SideWorld, readonly string[]>> = {
  arcade: ['dinolet', 'croaklet', 'skyserpent'],
  atlas: ['zapkin', 'scrapper', 'spinmaster'],
  multiverse: ['spinmaster', 'zapkin', 'scrapper'],
  neopia: ['croaklet', 'zapkin', 'dinolet'],
};

export type WorldContext = Extract<BattleContext, { kind: 'world' }>;

/** A bout in a story world: the sandbox Grove copy and the bout inside it. */
export interface WorldBout {
  context: WorldContext;
  sandbox: World;
  battle: BattleState;
}

/** The foes a world bout meets: the page's own, else its world's tone pack. */
export function worldFoes(c: WorldContext, level: number): { species: string; level: number }[] {
  if (c.foes?.length) return c.foes.slice(0, 6).map((f) => ({ ...f }));
  const tone = WORLD_TONE[c.world];
  return tone.slice(0, Math.max(1, Math.min(3, c.ids.length))).map((species) => ({
    species,
    level,
  }));
}

/** Clones the Grove and starts the bout in the clone; null when the bout can't start. */
export function startWorldBout(grove: Readonly<World>, context: WorldContext): WorldBout | null {
  const sandbox = JSON.parse(JSON.stringify(grove)) as World;
  const battle = createBattle(sandbox, context, battleSeedFor(sandbox, context));
  if (!battle) return null;
  sandbox.battle = battle;
  // A survive boss is one big, named foe that hits but does not go down easily.
  if (context.boss) {
    const boss = battle.sides[1][0];
    if (boss) {
      boss.name = SURVIVE_NAMES[context.boss] ?? context.boss;
      boss.hp = boss.maxHp = boss.maxHp * 3;
    }
  }
  const b = { context, sandbox, battle };
  stepSurvive(b);
  return b;
}

/** Plays one action in the world bout (inside the sandbox only). */
export function worldBoutAct(b: WorldBout, a: BattleAction): boolean {
  const ok = battleAct(b.battle, a);
  stepSurvive(b);
  return ok;
}

/**
 * Writes a finished world bout into its line's progress, once: a `<key>:won` or `<key>:lost`
 * flag and, for a win, the page's reward id. Returns whether it wrote anything.
 */
export function settleWorldBout(b: WorldBout, line: LineProgress): boolean {
  const r = b.battle.result;
  if (!r || b.battle.settled) return false;
  b.battle.settled = true;
  const won = r.winner === 0;
  const key = b.context.key;
  line.flags[`${key}:${won ? 'won' : 'lost'}`] = true;
  line.flags[`${key}:bouts`] = Number(line.flags[`${key}:bouts`] ?? 0) + 1;
  if (won && b.context.reward && !line.rewards.includes(b.context.reward))
    line.rewards.push(b.context.reward);
  return true;
}

// ---- Survive bouts (recs FUN-51): `karate:survive:<boss>:<rounds>` steps in a story world ----

/** Each boss's stand-in look; its own art comes later (lane E). */
export const SURVIVE_LOOKS: Readonly<Record<string, string>> = {
  mechachiazilla: 'spinmaster',
  monoceraptor: 'dinolet',
  'razul-shadows': 'scrapper',
  'dr-sloth': 'skyserpent',
};

/** The boss and rounds of a survive check, or null for any other check. */
export function parseSurvive(check: string): { boss: string; rounds: number } | null {
  const m = /^karate:survive:([a-z0-9-]+):(\d+)$/.exec(check);
  return m ? { boss: m[1]!, rounds: Number(m[2]) } : null;
}

/** A survive bout's context: the party against one big boss, a few levels up. */
export function surviveContext(
  grove: Readonly<World>,
  world: WorldContext['world'],
  line: string,
  key: string,
  check: { boss: string; rounds: number },
  ids: readonly string[],
  barks: readonly string[] = [],
): WorldContext {
  const party = grove.nubbins.filter(
    (n) => ids.includes(n.id) && n.stage !== 'egg' && n.stage !== 'cocoon',
  );
  const level = Math.round(
    party.reduce((s, n) => s + Math.max(...Object.values(n.stats).map((x) => x.points)) / 100, 0) /
      Math.max(1, party.length),
  );
  return {
    kind: 'world',
    world,
    line,
    key,
    tier: 2,
    ids: party.map((n) => n.id).slice(0, 3),
    foes: [{ species: SURVIVE_LOOKS[check.boss] ?? 'spinmaster', level: Math.min(99, level + 8) }],
    survive: check.rounds,
    boss: check.boss,
    barks: [...barks],
  };
}

/** The survive rule and the guide's barks, after each action. */
export function stepSurvive(b: WorldBout): void {
  const s = b.battle;
  const c = b.context;
  const barks = c.barks ?? [];
  // A bark at the start of each of the first turns, once each.
  const said = s.log.filter((e) => e.k === 'bark').length;
  if (said < barks.length && s.turn > said && !s.result)
    s.log.push({ k: 'bark', text: barks[said]! });
  if (c.survive && !s.result && s.turn > c.survive && s.sides[0].some((x) => x.hp > 0)) {
    s.result = { winner: 0, reason: 'time' };
    s.phase = 'done';
    s.log.push({ k: 'end', winner: 0, reason: 'time' });
  }
}
