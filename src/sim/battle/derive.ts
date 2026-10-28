import { BATTLE } from '../../config/tuning-battle';
import { mergedLevels } from '../partners';
import type { Rng } from '../rng';
import { hasSkill } from '../skills';
import { levelOf } from '../stats';
import type { Nubbin, World } from '../types';
import type { Combatant, SideIx } from './types';

/**
 * Battle stats from the care stats, the same for every mode (recs FIGHT-09): Stamina is HP,
 * Power is strike power, Run is dodge. A merged partner fights with its fused levels and the
 * `thickSkin` skill adds HP wherever the Nubbin fights. Rivals are built from one level that
 * follows the party (FIGHT-06), so a fresh child can win its first bout.
 */
const D = BATTLE.derive;

export interface CombatLevels {
  power: number;
  stamina: number;
  run: number;
}

export function combatLevels(n: Nubbin, world: World): CombatLevels {
  const merged = mergedLevels(world, n);
  return {
    power: merged?.power ?? levelOf(n.stats.power.points),
    stamina: merged?.stamina ?? levelOf(n.stats.stamina.points),
    run: merged?.run ?? levelOf(n.stats.run.points),
  };
}

/** The Nubbin as a combatant on the Keeper's side. */
export function combatantOf(n: Nubbin, world: World): Combatant {
  const lv = combatLevels(n, world);
  const maxHp = Math.round(
    D.hp + lv.stamina * D.hpPerStamina + (hasSkill(world, 'thickSkin') ? D.thickSkinHp : 0),
  );
  return {
    id: n.id,
    side: 0,
    nubbinId: n.id,
    name: n.name,
    foeName: -1,
    species: n.species,
    level: Math.round((lv.power + lv.stamina + lv.run) / 3),
    hp: maxHp,
    maxHp,
    power: D.power + lv.power * D.powerPerLevel,
    dodge: Math.min(D.dodgeCap, lv.run * D.dodgePerRun),
    guard: false,
  };
}

/** The rival level for a tier: the party average plus the tier offset, inside the tier band. */
export function rivalLevel(party: Combatant[], tier: number): number {
  const R = BATTLE.rivals;
  const t = Math.max(0, Math.min(R.tierOffset.length - 1, tier - 1));
  const avg = party.length ? party.reduce((s, c) => s + c.level, 0) / party.length : 0;
  return Math.max(R.tierFloor[t]!, Math.min(R.tierCap[t]!, Math.round(avg + R.tierOffset[t]!)));
}

/**
 * A rival at `level`. Tier 1 rivals get a share of the party's average HP instead of the
 * level formula, so the first bout is short and kind.
 */
export function rivalOf(
  ix: number,
  level: number,
  tier: number,
  party: Combatant[],
  species: string,
  foeName: number,
  opts: { power: number; hpShare: number },
  rng: Rng,
): Combatant {
  const R = BATTLE.rivals;
  const avgHp = party.length ? party.reduce((s, c) => s + c.maxHp, 0) / party.length : D.hp;
  const levelHp = (D.hp * opts.hpShare + level * D.hpPerStamina) * rng.float(...R.hpSpread);
  const maxHp = Math.max(1, Math.round(tier <= 1 ? avgHp * R.tier1HpShare : levelHp));
  return {
    id: `foe-${ix}`,
    side: 1 as SideIx,
    nubbinId: null,
    name: null,
    foeName,
    species,
    level,
    hp: maxHp,
    maxHp,
    power: opts.power + level * D.powerPerLevel * rng.float(...R.powerSpread),
    dodge: Math.min(R.dodgeCap, level * D.dodgePerRun * R.dodgeShare),
    guard: false,
  };
}
