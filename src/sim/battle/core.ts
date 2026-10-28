/**
 * Creating, acting on and ending a bout, and the three world commands that keep the live bout
 * in `world.battle`. Re-exported, with the rest of the public surface, by `index.ts`.
 */
import { FOE_NAME_BASE } from '../../config/strings-battle';
import { BATTLE } from '../../config/tuning-battle';
import { Rng } from '../rng';
import type { Nubbin, SimEvent, World } from '../types';
import { combatantOf, rivalLevel, rivalOf } from './derive';
import { end } from './damage';
import { karateAct, karateClock } from './karate';
import { battleSeedFor, grantRewards } from './rewards';
import { turnAct } from './turn';
import type { BattleAction, BattleContext, BattleState, Combatant } from './types';

const DEFAULT_RIVAL = 'chao';

function partyOf(world: World, ids: string[]): Nubbin[] {
  const out: Nubbin[] = [];
  for (const id of ids) {
    const n = world.nubbins.find((x) => x.id === id);
    if (n && n.stage !== 'egg' && n.stage !== 'cocoon' && !out.includes(n)) out.push(n);
  }
  return out;
}

const validTier = (t: number, max: number): boolean => Number.isInteger(t) && t >= 1 && t <= max;

/**
 * A new bout for `context`, seeded from `seed`, or null when the context is not valid: an
 * unknown or unhatched Nubbin, a dojo tier above the next belt, or no foes.
 */
export function createBattle(
  world: World,
  context: BattleContext,
  seed: number,
): BattleState | null {
  const rng = Rng.fromSeed(seed);
  const tier = context.tier;
  let mode: BattleState['mode'] = 'turn';
  let allies: Combatant[];
  let foes: Combatant[];
  if (context.kind === 'karate') {
    if (!validTier(tier, Math.min(BATTLE.karate.tiers, world.karate.belt + 1))) return null;
    const fighter = partyOf(world, [context.nubbinId])[0];
    if (!fighter) return null;
    mode = 'karate';
    allies = [combatantOf(fighter, world)];
    const lv = rivalLevel(allies, tier);
    const opts = { power: BATTLE.derive.power, hpShare: 1 };
    foes = [rivalOf(0, lv, tier, allies, DEFAULT_RIVAL, tier - 1, opts, rng)];
  } else {
    if (!validTier(tier, BATTLE.rivals.tierFloor.length)) return null;
    const party = partyOf(world, context.ids);
    if (party.length === 0) return null;
    allies = party.map((n) => combatantOf(n, world));
    const lv = rivalLevel(allies, tier);
    const opts = { power: BATTLE.rivals.foePower, hpShare: BATTLE.rivals.foeHpShare };
    const T = BATTLE.turn;
    const specs =
      context.kind === 'encounter'
        ? context.foes.slice(0, 6).map((f) => ({ species: f.species, level: f.level }))
        : Array.from({ length: Math.min(T.foesPerTier, party.length) }, () => ({
            species: DEFAULT_RIVAL,
            level: lv,
          }));
    if (specs.length === 0) return null;
    foes = specs.map((f, i) =>
      rivalOf(
        i,
        Math.max(0, Math.min(99, Math.round(f.level))),
        tier,
        allies,
        f.species,
        FOE_NAME_BASE + ((tier + i) % T.foeNames),
        opts,
        rng,
      ),
    );
  }
  return {
    v: 1,
    mode,
    seed,
    rngState: rng.state,
    sides: [allies, foes],
    turn: 1,
    active: 0,
    phase: 'choose',
    log: [],
    result: null,
    context,
    ...(mode === 'karate' ? { karate: karateClock(tier) } : {}),
  };
}

/** Applies one action. Returns false (and changes nothing) when it does not apply. */
export function battleAct(s: BattleState, a: BattleAction): boolean {
  if (s.result) return false;
  const rng = new Rng(s.rngState);
  const ok = s.mode === 'karate' ? karateAct(s, rng, a) : turnAct(s, rng, a);
  s.rngState = rng.state;
  if (s.log.length > BATTLE.logCap) s.log.splice(0, s.log.length - BATTLE.logCap);
  return ok;
}

export function battleForfeit(s: BattleState): void {
  end(s, { k: 'end', winner: 1, reason: 'forfeit' });
}

// ---------- world commands ----------

export function startBattleCmd(world: World, context: BattleContext, events: SimEvent[]): void {
  const s = createBattle(world, context, battleSeedFor(world, context));
  if (!s) return;
  world.battleRuns = (world.battleRuns ?? 0) + 1;
  world.battle = s;
  events.push({ kind: 'battleStart', context: context.kind });
}

export function actBattleCmd(world: World, action: BattleAction, events: SimEvent[]): void {
  const s = world.battle;
  if (!s || !battleAct(s, action)) return;
  if (s.result) grantRewards(world, s, events);
}

export function forfeitBattleCmd(world: World, events: SimEvent[]): void {
  const s = world.battle;
  if (!s) return;
  battleForfeit(s);
  grantRewards(world, s, events);
}
