import { BATTLE } from '../../config/tuning-battle';
import { bandOf } from '../alignment';
import { mergedLevels } from '../partners';
import type { Rng } from '../rng';
import { hasSkill } from '../skills';
import { SPECIES } from '../species';
import { levelOf } from '../stats';
import {
  NUBBIN_TYPES,
  STAT_KEYS,
  type Nubbin,
  type NubbinType,
  type StatKey,
  type World,
} from '../types';
import { boostedOf, slottedMoves, speciesKit, FALLBACK_MOVES } from './moves-sources';
import type { Combatant, SideIx, Trait, TraitId } from './types';

/**
 * Battle stats from the five care stats, the same for every mode (recs FIGHT-09, FIGHT-10):
 * HP from Stamina and Power, Bonk from Power, Splash from Swim and Stamina, Guard from Stamina
 * and Power, Zip from Run, Flutter from Fly and Puff from Stamina. Children fight at ×0.85,
 * Eternals at ×1.1 and Shadow Nubbins get no penalty. Grades never multiply again (they
 * already scale growth); an A or S grade gives a trait instead (FIGHT-12). A merged partner
 * fights with its fused levels and `thickSkin` adds HP wherever the Nubbin fights. Rivals are
 * built from one level that follows the party (FIGHT-06), so a fresh child can win its first
 * bout.
 */
const D = BATTLE.derive;

export type CombatLevels = Record<StatKey, number>;

export function combatLevels(n: Nubbin, world: World): CombatLevels {
  const merged = mergedLevels(world, n);
  const out = {} as CombatLevels;
  for (const k of STAT_KEYS) out[k] = merged?.[k] ?? levelOf(n.stats[k].points);
  return out;
}

export interface DerivedStats {
  hp: number;
  bonk: number;
  splash: number;
  def: number;
  zip: number;
  flutter: number;
  puffMax: number;
  level: number;
}

/** The table in recs FIGHT-10, times `mult` (child, Eternal). */
export function deriveStats(L: CombatLevels, mult = 1): DerivedStats {
  return {
    hp: Math.round((D.hp + D.hpPerStamina * L.stamina + D.hpPerPower * L.power) * mult),
    bonk: (D.bonk + D.bonkPerPower * L.power) * mult,
    splash: (D.splash + D.splashPerSwim * L.swim + D.splashPerStamina * L.stamina) * mult,
    def: (D.guard + D.guardPerStamina * L.stamina + D.guardPerPower * L.power) * mult,
    zip: (D.zip + D.zipPerRun * L.run) * mult,
    flutter: Math.min(D.flutterCap, D.flutterPerFly * L.fly) * mult,
    puffMax: D.puffMax + Math.floor(L.stamina * D.puffPerStamina),
    level: Math.round(STAT_KEYS.reduce((s, k) => s + L[k], 0) / STAT_KEYS.length),
  };
}

export const statMult = (n: Nubbin): number =>
  n.eternal ? D.eternal : n.stage === 'child' ? D.child : 1;

const TRAIT_OF: Record<StatKey, TraitId> = {
  swim: 'slippery',
  fly: 'featherlight',
  run: 'headStart',
  power: 'heavyHugger',
  stamina: 'secondWind',
};

/** An S grade gives the full trait, an A grade the half-strength one. */
export function traitsOf(n: Nubbin): Trait[] {
  const out: Trait[] = [];
  for (const k of STAT_KEYS) {
    const g = n.stats[k].grade;
    if (g === 'S' || g === 'A') out.push({ id: TRAIT_OF[k], full: g === 'S' });
  }
  return out;
}

export function speciesType(id: string): NubbinType {
  return SPECIES.find((s) => s.id === id)?.type ?? 'normal';
}

/** An adult fights as its form's type, anyone else as its species'. */
export function typeOf(n: Nubbin): NubbinType {
  return n.form?.type ?? speciesType(n.species);
}

/** A Normal combatant's second type: the one it leaned toward most. */
function secondOf(n: Nubbin, type: NubbinType): NubbinType | null {
  if (type !== 'normal') return null;
  if (n.form?.second && n.form.second !== 'normal') return n.form.second;
  let best: NubbinType | null = null;
  for (const t of NUBBIN_TYPES)
    if (t !== 'normal' && (n.typeLean[t] ?? 0) > (best ? n.typeLean[best] : 0)) best = t;
  return best;
}

interface Shell {
  id: string;
  side: SideIx;
  nubbinId: string | null;
  name: string | null;
  foeName: number;
  species: string;
}

function fromStats(
  base: Shell,
  st: DerivedStats,
  extra: Partial<Combatant> & Pick<Combatant, 'type' | 'band' | 'moves'>,
): Combatant {
  return {
    ...base,
    level: st.level,
    hp: st.hp,
    maxHp: st.hp,
    power: st.bonk,
    dodge: st.flutter,
    guard: false,
    second: null,
    eternal: false,
    personality: null,
    bonk: st.bonk,
    splash: st.splash,
    def: st.def,
    zip: st.zip,
    flutter: st.flutter,
    puff: BATTLE.puff.start,
    puffMax: st.puffMax,
    boosted: [],
    traits: [],
    major: null,
    moods: {},
    used: [],
    last: null,
    decoy: 0,
    yawny: false,
    ...extra,
  };
}

/** The Nubbin as a combatant on the Keeper's side. */
export function combatantOf(n: Nubbin, world: World): Combatant {
  const st = deriveStats(combatLevels(n, world), statMult(n));
  if (hasSkill(world, 'thickSkin')) st.hp += D.thickSkinHp;
  const type = typeOf(n);
  const yawny = n.needs.energy < BATTLE.puff.yawnyEnergy;
  return fromStats(
    { id: n.id, side: 0, nubbinId: n.id, name: n.name, foeName: -1, species: n.species },
    st,
    {
      type,
      second: secondOf(n, type),
      band: n.form?.band ?? bandOf(n.alignment),
      eternal: n.eternal !== null,
      personality: n.personality,
      moves: slottedMoves(n),
      boosted: boostedOf(n),
      traits: traitsOf(n),
      yawny,
      puff: Math.min(st.puffMax, yawny ? BATTLE.puff.yawnyStart : BATTLE.puff.start),
    },
  );
}

/** The rival level for a tier: the party average plus the tier offset, inside the tier band. */
export function rivalLevel(party: Combatant[], tier: number): number {
  const R = BATTLE.rivals;
  const t = Math.max(0, Math.min(R.tierOffset.length - 1, tier - 1));
  const avg = party.length ? party.reduce((s, c) => s + c.level, 0) / party.length : 0;
  return Math.max(R.tierFloor[t]!, Math.min(R.tierCap[t]!, Math.round(avg + R.tierOffset[t]!)));
}

/** A rival's moves: its species kit and the Normal fallback. */
export function rivalMoves(species: string): string[] {
  return [...speciesKit(species).filter((id) => id !== 'bonk'), ...FALLBACK_MOVES].slice(0, 4);
}

/**
 * A rival at `level`, every care stat at that level, times `share` (party foes are a little
 * softer than a dojo rival). Tier 1 rivals get a share of the party's average HP instead, so
 * the first bout is short and kind.
 */
export function rivalOf(
  ix: number,
  level: number,
  tier: number,
  party: Combatant[],
  species: string,
  foeName: number,
  opts: { share: number; hpShare: number },
  rng: Rng,
): Combatant {
  const R = BATTLE.rivals;
  const L = { swim: level, fly: level, run: level, power: level, stamina: level };
  const st = deriveStats(L, opts.share);
  const avgHp = party.length ? party.reduce((s, c) => s + c.maxHp, 0) / party.length : D.hp;
  const levelHp = deriveStats(L, opts.hpShare).hp * rng.float(...R.hpSpread);
  st.hp = Math.max(1, Math.round(tier <= 1 ? avgHp * R.tier1HpShare : levelHp));
  const spread = rng.float(...R.powerSpread);
  st.bonk *= spread;
  st.splash *= spread;
  st.flutter = Math.min(R.dodgeCap, st.flutter * R.dodgeShare);
  st.level = level;
  return fromStats({ id: `foe-${ix}`, side: 1, nubbinId: null, name: null, foeName, species }, st, {
    type: speciesType(species),
    band: 'neutral',
    moves: rivalMoves(species),
  });
}
