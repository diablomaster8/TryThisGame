/**
 * Creating, acting on and ending a bout, and the three world commands that keep the live bout
 * in `world.battle`. Re-exported, with the rest of the public surface, by `index.ts`.
 */
import { FOE_NAME_BASE } from '../../config/strings-battle';
import { BATTLE } from '../../config/tuning-battle';
import { BATTLE_DOUBLES } from '../../config/tuning-battle-atb';
import { Rng } from '../rng';
import { atbAct, dressAtb, stepAtb } from './atb';
import type { Nubbin, SimEvent, World } from '../types';
import { combatantOf, rivalLevel, rivalOf } from './derive';
import { end } from './damage';
import { karateAct, karateClock } from './karate';
import { setSlots, syncMoves } from './moves-sources';
import { battleSeedFor, grantRewards } from './rewards';
import { CIRCUIT_GIMMICK, circuitOpen, circuitTeam } from './circuit';
import { bagFrom } from './items';
import { foeLooks } from './foes';
import { inflict } from './status';
import type { BattlePrefs } from '../types';
import { turnAct } from './turn';
import { autoResolve, skippable } from './auto';
import { debugAct } from './debug';
import { noteSeen } from './seen';
import { ladderRival, ladderValid } from './ladder';
import { fusionPair } from './fusion';
import type { BattleAction, BattleContext, BattleState, Combatant } from './types';

const DEFAULT_RIVAL = 'chao';
const T = BATTLE.turn;
/** Logged In's digital foes: a Power, a Swim and a Fly line (FIGHT-29). */
const LOGGED_FOES = ['dinolet', 'croaklet', 'skyserpent'];

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
    foes = [
      scaleForDojo(
        rivalOf(0, lv, tier, allies, rivalSpecies(world, context, 0, 1), tier - 1, opts, rng),
        tier,
      ),
    ];
  } else {
    if (!validTier(tier, BATTLE.rivals.tierFloor.length)) return null;
    if (context.kind === 'circuit' && !circuitOpen(world, context.trainer, !!context.champion))
      return null;
    if (context.kind === 'dojo' && !context.ladder && tier > world.karate.belt + 1) return null;
    if (context.kind === 'dojo' && context.ladder && !ladderValid(world, context)) return null;
    // Doubles (FIGHT-60) is exactly two a side; anything less is not a doubles bout.
    const doubles = !!context.doubles;
    const cap = doubles
      ? BATTLE_DOUBLES.slots
      : context.kind === 'encounter'
        ? 6
        : context.kind === 'dojo' && context.ladder
          ? 1
          : 3;
    const party = partyOf(world, context.ids).slice(0, cap);
    if (party.length === 0 || (doubles && party.length < BATTLE_DOUBLES.slots)) return null;
    allies = party.map((n) => combatantOf(n, world));
    const lv = rivalLevel(allies, tier);
    const opts = { share: BATTLE.rivals.foeShare, hpShare: BATTLE.rivals.foeHpShare };
    let specs = foeSpecs(world, context, lv, party.length);
    if (specs.length === 0) return null;
    // A lone dojo rival brings a partner of the same kind for doubles.
    if (doubles) specs = [...specs, ...specs].slice(0, BATTLE_DOUBLES.slots);
    foes = specs.map((f, i) => {
      const c = rivalOf(
        i,
        Math.max(0, Math.min(99, Math.round(f.level))),
        tier,
        allies,
        f.species,
        f.name ?? FOE_NAME_BASE + ((tier + i) % T.foeNames),
        opts,
        rng,
      );
      if (f.wild || f.shadow) c.calm = 0;
      if (f.shadow) c.shadow = true;
      return c;
    });
  }
  const log: BattleState['log'] = [];
  for (const c of allies) if (c.yawny && mode === 'turn') log.push({ k: 'yawny', who: c.id });
  const state: BattleState = {
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
  if (mode === 'turn') dressTurnBout(world, state, rng);
  if (mode === 'turn' && context.kind !== 'karate' && context.mode === 'atb')
    dressAtb(world, state);
  state.rngState = rng.state;
  return state;
}

/** Foes for a turn bout: by context (recs FIGHT-19, -22, -29). */
/** A rival's real species from the context's pool (FIGHT-90), the base Nubbin if none. */
function rivalSpecies(world: World, context: BattleContext, i: number, n: number): string {
  return foeLooks(world, context, n)[i]?.species ?? DEFAULT_RIVAL;
}

function foeSpecs(
  world: World,
  context: Exclude<BattleContext, { kind: 'karate' }>,
  lv: number,
  partySize: number,
): { species: string; level: number; name?: number; wild?: boolean; shadow?: boolean }[] {
  switch (context.kind) {
    case 'encounter':
      return context.foes.slice(0, 6).map((f) => ({ ...f }));
    case 'circuit': {
      const team = circuitTeam(world, context.trainer, !!context.champion);
      const level = context.champion ? Math.min(99, lv + BATTLE.circuit.championBonus) : lv;
      return team.map((species) => ({ species, level }));
    }
    case 'story':
      // Logged In: Glitch, Proxy and Null, digital foes whose type follows their place.
      return LOGGED_FOES.slice(0, 3).map((species, i) => ({
        species,
        level: lv,
        name: FOE_NAME_BASE + i,
      }));
    case 'dojo': {
      // The Dojo Ladder (FIGHT-99) sends a rival a little above the fighter, more each belt.
      const up = context.ladder ? ladderRival(world, context).level : 0;
      return [{ species: rivalSpecies(world, context, 0, 1), level: lv + up }];
    }
    case 'party':
      return Array.from({ length: Math.min(T.foesPerTier, partySize) }, (_, i) => ({
        species: rivalSpecies(world, context, i, Math.min(T.foesPerTier, partySize)),
        level: lv,
      }));
  }
}

/** Singles, the AI level, gentle bouts, the bag and a Circuit Keeper's field rule. */
function dressTurnBout(world: World, s: BattleState, rng: Rng): void {
  const c = s.context;
  // The old all-at-once party bout keeps its format; the new kinds are singles.
  const singles = c.kind === 'encounter' ? !!c.singles : c.kind !== 'karate' && c.kind !== 'party';
  // Doubles has no bench: both of each side's two are on the field.
  if (c.kind !== 'karate' && c.doubles) {
    s.doubles = true;
    // Fusion burst (FIGHT-95): the Keeper's partners, if both are here and close enough.
    const pair = fusionPair(world, s.sides[0]);
    if (pair) s.fusable = { pair, used: false };
  } else if (singles) s.lead = [0, 0];
  if (c.kind === 'dojo' && c.ladder) s.ai = ladderRival(world, c).ai;
  if (c.kind === 'circuit') {
    s.ai = c.champion ? 'champion' : c.tier >= 3 ? 'champion' : 'keeper';
    const g = CIRCUIT_GIMMICK[c.trainer];
    if (g) s.gimmick = g;
    if (c.champion) s.foeBag = { fruit: 2 };
  }
  // Kid mode is always gentle; otherwise the pre-bout sheet's override (FIGHT-86) wins over
  // the Keeper's usual choice (Gentle bouts, or Settings → Bouts on Gentle).
  const usual = !!world.battlePrefs?.gentle || world.settings?.bouts === 'gentle';
  const gentle = c.kind !== 'karate' && c.difficulty ? c.difficulty === 'gentle' : usual;
  if (c.kind !== 'karate' && c.difficulty === 'spicy' && !world.edu) s.ai = 'champion';
  if (world.edu || gentle) {
    s.gentle = world.edu ? (world.edu.band === 'sprout' ? 'sprout' : 'reader') : 'all';
  }
  const bag = bagFrom(world);
  if (Object.keys(bag).length) s.bag = bag;
  if (s.gimmick === 'shuffle')
    for (const a of s.sides[0]) {
      for (let i = a.moves.length - 1; i > 0; i--) {
        const j = rng.int(0, i);
        [a.moves[i], a.moves[j]] = [a.moves[j]!, a.moves[i]!];
      }
    }
  if (s.gimmick === 'naps')
    for (const f of s.sides[1])
      if (rng.chance(BATTLE.circuit.napChance)) inflict(s, rng, f, f, 'drowsy', 1);
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
  if (a.k === 'debug') return debugAct(s, a.set);
  const rng = new Rng(s.rngState);
  const ok =
    s.mode === 'karate' ? karateAct(s, rng, a) : s.atb ? atbAct(s, rng, a) : turnAct(s, rng, a);
  s.rngState = rng.state;
  if (s.log.length > BATTLE.logCap) s.log.splice(0, s.log.length - BATTLE.logCap);
  return ok;
}

export function battleForfeit(s: BattleState): void {
  end(s, { k: 'end', winner: 1, reason: 'forfeit' });
}

// ---------- world commands ----------

export function startBattleCmd(world: World, context: BattleContext, events: SimEvent[]): void {
  // A skipped story bout (FIGHT-71) never reaches the screen; asked for any other way, refused.
  if (context.auto) {
    if (world.settings?.bouts === 'skip' && skippable(context)) autoResolve(world, context, events);
    return;
  }
  const s = createBattle(world, context, battleSeedFor(world, context));
  if (!s) return;
  world.battleRuns = (world.battleRuns ?? 0) + 1;
  world.battle = s;
  events.push({ kind: 'battleStart', context: context.kind });
}

export function actBattleCmd(world: World, action: BattleAction, events: SimEvent[]): void {
  const s = world.battle;
  const last = s?.log[s.log.length - 1];
  if (!s || !battleAct(s, action)) return;
  noteSeen(world, s, last ? s.log.indexOf(last) + 1 : 0);
  if (s.result) grantRewards(world, s, events);
}

/** The stats sheet's slot editor (recs FIGHT-17). */
export function setSlotsCmd(world: World, nubbinId: string, slots: (string | null)[]): void {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (n && n.stage !== 'egg') setSlots(n, slots);
}

/** Once a sim second: new moves from parts, lessons and forms join the kit. */
export function stepBattleMoves(world: World, dtMs: number, events: SimEvent[]): void {
  // An ATB bout's clock moves only here, from the live step (FIGHT-41); world.ts never calls
  // this during offline catch-up, so a closed game never fights.
  const b = world.battle;
  if (b?.atb && !b.result) {
    const last = b.log[b.log.length - 1];
    stepAtb(b, dtMs);
    noteSeen(world, b, last ? b.log.indexOf(last) + 1 : 0);
    if (b.result) grantRewards(world, b, events);
  }
  if (Math.floor(world.timeMs / 1000) === Math.floor((world.timeMs - dtMs) / 1000)) return;
  for (const n of world.nubbins) syncMoves(n, events);
}

export function forfeitBattleCmd(world: World, events: SimEvent[]): void {
  const s = world.battle;
  if (!s) return;
  battleForfeit(s);
  grantRewards(world, s, events);
}

/** Settings and the party sheet: the last party, Gentle bouts, the playback speed. */
export function setBattlePrefsCmd(world: World, prefs: Partial<BattlePrefs>): void {
  const p = (world.battlePrefs ??= {});
  if (prefs.party) {
    const ids = partyOf(world, prefs.party)
      .map((n) => n.id)
      .slice(0, 3);
    if (ids.length) p.party = ids;
  }
  if (prefs.gentle !== undefined) p.gentle = prefs.gentle;
  if (prefs.speed === 1 || prefs.speed === 2) p.speed = prefs.speed;
}
