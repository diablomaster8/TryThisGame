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
import { setSlots, syncMoves } from './moves-sources';
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
    allies = [scaleForDojo(combatantOf(fighter, world))];
    const lv = rivalLevel(allies, tier);
    const opts = { share: 1, hpShare: 1 };
    foes = [scaleForDojo(rivalOf(0, lv, tier, allies, DEFAULT_RIVAL, tier - 1, opts, rng), tier)];
  } else {
    if (!validTier(tier, BATTLE.rivals.tierFloor.length)) return null;
    const party = partyOf(world, context.ids);
    if (party.length === 0) return null;
    allies = party.map((n) => combatantOf(n, world));
    const lv = rivalLevel(allies, tier);
    const opts = { share: BATTLE.rivals.foeShare, hpShare: BATTLE.rivals.foeHpShare };
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
  const log: BattleState['log'] = [];
  for (const c of allies) if (c.yawny && mode === 'turn') log.push({ k: 'yawny', who: c.id });
  return {
    v: 2,
    mode,
    seed,
    rngState: rng.state,
    sides: [allies, foes],
    turn: 1,
    active: 0,
    phase: 'choose',
    choices: {},
    log,
    result: null,
    context,
    ...(mode === 'karate' ? { karate: karateClock(tier) } : {}),
  };
}

/**
 * The timed dojo bout keeps its old length: HP is scaled up (tier 1 rivals already follow
 * the fighter's HP, so they are scaled once, through it).
 */
function scaleForDojo(c: Combatant, tier = 0): Combatant {
  if (tier !== 1) c.hp = c.maxHp = Math.round(c.maxHp * BATTLE.karate.hpScale);
  return c;
}

/** Applies one action. Returns false (and changes nothing) when it does not apply. */
export function battleAct(s: BattleState, a: BattleAction): boolean {
  if (s.result) return false;
  // A turn bout saved before moves existed has none of their stats: call it a draw.
  if (s.v !== 2 && s.mode === 'turn') {
    end(s, { k: 'end', winner: null, reason: 'time' });
    return true;
  }
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

/** The stats sheet's slot editor (recs FIGHT-17). */
export function setSlotsCmd(world: World, nubbinId: string, slots: (string | null)[]): void {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (n && n.stage !== 'egg') setSlots(n, slots);
}

/** Once a sim second: new moves from parts, lessons and forms join the kit. */
export function stepBattleMoves(world: World, dtMs: number, events: SimEvent[]): void {
  if (Math.floor(world.timeMs / 1000) === Math.floor((world.timeMs - dtMs) / 1000)) return;
  for (const n of world.nubbins) syncMoves(n, events);
}

export function forfeitBattleCmd(world: World, events: SimEvent[]): void {
  const s = world.battle;
  if (!s) return;
  battleForfeit(s);
  grantRewards(world, s, events);
}
