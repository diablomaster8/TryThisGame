import { describe, expect, it } from 'vitest';
import { championMod, type ChampionModId } from '../../src/config/dungeon-foes';
import { BATTLE_R9 } from '../../src/config/tuning-battle-r9';
import { createBattle, type BattleState } from '../../src/sim/battle';
import { damageWith } from '../../src/sim/battle/damage';
import { afterModHit, tickMods } from '../../src/sim/battle/hollow-mods';
import { moveOf } from '../../src/sim/battle/moves';
import { cellOf, runFloor } from '../../src/sim/dungeon';
import { battleHandler, encounterSpec } from '../../src/sim/dungeon-encounters';
import { ensureGear, keepGear } from '../../src/sim/gear';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// R0155 (DUNG-15): a Hollow foe's champion modifiers play inside the fight.
// R0164 (DUNG-24): the Keeper's Brave gear reaches the fight through the encounter spec.

function world(): World {
  const w = createWorld(5, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = 2000;
  }
  return w;
}

function bout(
  w: World,
  mods: ChampionModId[][],
  brave?: Record<string, number>,
  seed = 3,
): BattleState {
  return createBattle(
    w,
    {
      kind: 'encounter',
      tier: 1,
      ids: w.nubbins.map((n) => n.id),
      source: 'test',
      key: 'k',
      foes: mods.map((m) => ({
        species: 'zapling',
        level: 10,
        wild: true,
        ...(m.length ? { mods: m } : {}),
      })),
      ...(brave ? { brave } : {}),
    },
    seed,
  )!;
}

const bonk = moveOf('bonk');

describe('champion modifiers in the fight (R0155)', () => {
  it('leaves an unmodded bout exactly as before', () => {
    const w = world();
    const a = bout(w, [[], []]);
    for (const c of [...a.sides[0], ...a.sides[1]]) expect(c.mod).toBeUndefined();
    expect(JSON.stringify(bout(w, [[], []]))).toBe(JSON.stringify(a));
  });

  it('Zoomy, Big Biceps and Bouncy change speed, hits and damage taken', () => {
    const w = world();
    const plain = bout(w, [[]]);
    const champ = bout(w, [['zoomy', 'bigBiceps', 'bouncy']]);
    const [p, c] = [plain.sides[1][0]!, champ.sides[1][0]!];
    const ally = champ.sides[0][0]!;
    expect(c.zip).toBeCloseTo(p.zip * (1 + championMod('zoomy').effect.speed!));
    const hitPlain = damageWith(p, ally, bonk, false, 1).dmg;
    const hitChamp = damageWith(c, ally, bonk, false, 1).dmg;
    expect(hitChamp).toBeGreaterThan(hitPlain);
    const takenPlain = damageWith(ally, p, bonk, false, 1).dmg;
    const takenChamp = damageWith(ally, c, bonk, false, 1).dmg;
    expect(takenChamp).toBeLessThan(takenPlain);
    expect(c.mod).toMatchObject({ hit: 1.4, taken: 0.7 });
  });

  it('Bossy lifts its packmates and Grumpy Cloud dims the party for three turns', () => {
    const w = world();
    const s = bout(w, [['bossy', 'grumpyCloud'], []]);
    expect(s.sides[1][0]!.mod?.hit).toBeUndefined();
    expect(s.sides[1][1]!.mod?.hit).toBeCloseTo(1.2);
    const ally = s.sides[0][0]!;
    expect(ally.mod?.cloud).toEqual({ mult: 0.85, turns: 3 });
    const foe = s.sides[1][1]!;
    const dimmed = damageWith(ally, foe, bonk, false, 1).dmg;
    tickMods(ally);
    tickMods(ally);
    tickMods(ally);
    expect(ally.mod?.cloud).toBeUndefined();
    expect(damageWith(ally, foe, bonk, false, 1).dmg).toBeGreaterThan(dimmed);
  });

  it('Sparkly zaps back whoever strikes it; Sticky slows whoever it hits', () => {
    const w = world();
    const s = bout(w, [['sparkly', 'sticky']]);
    const [ally, foe] = [s.sides[0][0]!, s.sides[1][0]!];
    const hp = ally.hp;
    afterModHit(s, new Rng(1), ally, foe, 40);
    expect(ally.hp).toBe(hp - Math.round(40 * championMod('sparkly').effect.chainOnStruck!));
    afterModHit(s, new Rng(1), foe, ally, 10);
    expect(ally.moods.zip).toBe(-BATTLE_R9.hollow.stickyZip);
  });

  it('plays a whole modded bout to the end', () => {
    const w = world();
    applyCommand(w, { kind: 'battleStart', context: bout(w, [['zoomy', 'sparkly']]).context }, []);
    let guard = 0;
    while (w.battle && !w.battle.result && guard++ < 200)
      applyCommand(w, { kind: 'battleAct', action: { k: 'strike' } }, []);
    expect(w.battle?.result).toBeTruthy();
  });
});

describe('Brave in the fight (R0164)', () => {
  it('adds to the Nubbin’s hits, capped', () => {
    const w = world();
    const id = w.nubbins[0]!.id;
    const s = bout(w, [[]], { [id]: 4 });
    expect(s.sides[0][0]!.mod?.hit).toBeCloseTo(1 + 4 * BATTLE_R9.hollow.bravePerPoint);
    const capped = bout(w, [[]], { [id]: 99 });
    expect(capped.sides[0][0]!.mod?.hit).toBeCloseTo(1 + BATTLE_R9.hollow.braveCap);
  });

  it('reaches the fight from a Hollow encounter, with the pack’s modifiers', () => {
    const w = world();
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'enterDungeon', daily: false }, events);
    const run = w.dungeon!;
    const g = ensureGear(w);
    const gloves = {
      id: `g${g.next++}`,
      base: 'gloves',
      slot: 'gloves',
      rarity: 'shiny' as const,
      level: 1,
      affixes: [{ id: 'brave', value: 3 }],
    };
    keepGear(w, gloves);
    applyCommand(w, { kind: 'equipGear', itemId: gloves.id, nubbinId: null }, events);
    const f = runFloor(w)!;
    const pack = f.packs![0]!;
    for (const m of pack.members) m.mods = ['bigBiceps'];
    run.encounter = { packId: pack.id };
    const spec = encounterSpec(w, f, pack, cellOf(f, w.keeper.pos));
    for (const id of run.party) expect(spec.brave?.[id]).toBeGreaterThanOrEqual(3);
    expect(battleHandler(w, spec, new Rng(1), events)).toBeNull();
    const b = w.battle!;
    expect(b.context.kind === 'encounter' && b.context.brave).toBeTruthy();
    for (const a of b.sides[0]) expect(a.mod?.hit).toBeGreaterThan(1);
    for (const foe of b.sides[1]) expect(foe.mod?.hit).toBeCloseTo(1.4);
  });
});
