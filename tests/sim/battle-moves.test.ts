import { describe, expect, it } from 'vitest';
import {
  BATTLE_MOVE_TEXT,
  MOOD_TEXT,
  STATUS_TEXT,
  TRAIT_TEXT,
  TYPE_HELP,
  TYPE_WORDS,
  formatEvent,
} from '../../src/config/strings-battle';
import { BATTLE } from '../../src/config/tuning-battle';
import {
  alignMult,
  battleAct,
  beats,
  combatantOf,
  createBattle,
  deriveStats,
  LOOP,
  MOVES,
  moveOf,
  peekBattle,
  sourcesOf,
  typeMult,
  type BattleState,
  type Combatant,
} from '../../src/sim/battle';
import { moveDamage, hurt } from '../../src/sim/battle/damage';
import {
  CHAOS_MOVE,
  CRITTER_MOVE,
  FINAL_MOVE,
  FORM_MOVE,
  LESSON_MOVE,
  speciesKit,
  syncMoves,
} from '../../src/sim/battle/moves-sources';
import { canAct, inflict, shiftMood, tickStatus } from '../../src/sim/battle/status';
import { turnOrder } from '../../src/sim/battle/turn';
import { CRITTER_SPECIES } from '../../src/sim/critters';
import { LESSON_IDS } from '../../src/sim/kindergarten';
import { evolve, hatch, rebirth } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { SPECIES } from '../../src/sim/species';
import {
  NUBBIN_TYPES,
  STAT_KEYS,
  type AlignmentBand,
  type SimEvent,
  type World,
} from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { buildTypeHelp } from '../../src/ui/battle-help';

function freshWorld(seed = 3): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  return world;
}

const party = (w: World, tier = 2, seed = 1): BattleState =>
  createBattle(w, { kind: 'party', tier, ids: w.nubbins.map((n) => n.id) }, seed)!;

/** A plain combatant at one level for every stat. */
function fighter(level: number, over: Partial<Combatant> = {}): Combatant {
  const w = freshWorld();
  const n = w.nubbins[0]!;
  n.stage = 'adult';
  for (const k of STAT_KEYS) n.stats[k].points = level * 100;
  for (const k of STAT_KEYS) n.stats[k].grade = 'C';
  return { ...combatantOf(n, w), ...over };
}

describe('derived battle stats (recs FIGHT-10)', () => {
  it('follows the table at levels 0, 50 and 99 for each stat', () => {
    const zero = { swim: 0, fly: 0, run: 0, power: 0, stamina: 0 };
    const rows = [0, 50, 99].map((L) => ({
      L,
      stamina: deriveStats({ ...zero, stamina: L }),
      power: deriveStats({ ...zero, power: L }),
      swim: deriveStats({ ...zero, swim: L }),
      run: deriveStats({ ...zero, run: L }),
      fly: deriveStats({ ...zero, fly: L }),
    }));
    for (const { L, stamina, power, swim, run, fly } of rows) {
      expect(stamina.hp).toBe(Math.round(BATTLE.derive.hp + 1.5 * L));
      expect(stamina.splash).toBeCloseTo(10 + 0.3 * L);
      expect(stamina.def).toBeCloseTo(10 + 0.5 * L);
      expect(stamina.puffMax).toBe(6 + Math.floor(L / 20));
      expect(power.hp).toBe(Math.round(BATTLE.derive.hp + 0.5 * L));
      expect(power.bonk).toBe(10 + L);
      expect(power.def).toBeCloseTo(10 + 0.5 * L);
      expect(swim.splash).toBeCloseTo(10 + 0.7 * L);
      expect(run.zip).toBe(10 + L);
      expect(fly.flutter).toBeCloseTo(Math.min(0.2, 0.002 * L));
      expect(stamina.level).toBe(Math.round(L / 5));
    }
    const top = deriveStats({ swim: 99, fly: 99, run: 99, power: 99, stamina: 99 });
    expect(top.hp).toBe(222);
    expect(top.puffMax).toBe(10);
  });

  it('children fight at ×0.85, Eternals at ×1.1, Shadows without a penalty', () => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    for (const k of STAT_KEYS) n.stats[k].points = 5000;
    const child = combatantOf(n, w);
    n.stage = 'adult';
    const adult = combatantOf(n, w);
    n.shadow = true;
    expect(combatantOf(n, w).bonk).toBe(adult.bonk);
    n.eternal = 'neutral';
    const eternal = combatantOf(n, w);
    expect(child.bonk).toBeCloseTo(adult.bonk * 0.85);
    expect(eternal.bonk).toBeCloseTo(adult.bonk * 1.1);
  });
});

describe('one damage formula (recs FIGHT-11)', () => {
  it('golden numbers for ten attacker/defender pairs', () => {
    const pairs: [number, number, string][] = [
      [0, 0, 'bonk'],
      [10, 10, 'bonk'],
      [50, 50, 'bonk'],
      [99, 99, 'bonk'],
      [99, 0, 'bonk'],
      [0, 99, 'bonk'],
      [30, 30, 'bubble-pop'],
      [60, 20, 'radiant-bonk'],
      [20, 60, 'kazoo-blast'],
      [40, 40, 'mighty-mash'],
    ];
    const out = pairs.map(([a, d, id]) => {
      const rng = Rng.fromSeed(`${a}:${d}:${id}`);
      return moveDamage(rng, fighter(a), fighter(d), moveOf(id)).dmg;
    });
    expect(out).toMatchInlineSnapshot(`
      [
        14,
        17,
        18,
        18,
        14,
        4,
        14,
        38,
        6,
        44,
      ]
    `);
  });

  it('a hit never deals 0 and a non-crit never more than 60% of max HP', () => {
    const rng = Rng.fromSeed('bounds');
    for (let i = 0; i < 400; i++) {
      const by = fighter(rng.int(0, 99));
      const to = fighter(rng.int(0, 99), { type: rng.pick(NUBBIN_TYPES) });
      const mv = rng.pick(MOVES.filter((m) => m.power > 0));
      const { dmg, crit } = moveDamage(rng, by, to, mv);
      expect(dmg).toBeGreaterThanOrEqual(1);
      if (!crit) expect(dmg).toBeLessThanOrEqual(Math.max(1, Math.floor(to.maxHp * 0.6)));
    }
  });

  it('equal stats and a power-40 move deal about 14', () => {
    let sum = 0;
    const rng = Rng.fromSeed('mid');
    const by = fighter(0, { type: 'swim' });
    for (let i = 0; i < 200; i++) sum += moveDamage(rng, by, fighter(0), moveOf('bonk')).dmg;
    expect(sum / 200).toBeGreaterThan(12.5);
    expect(sum / 200).toBeLessThan(16);
  });
});

describe('grade traits (recs FIGHT-12)', () => {
  const withGrade = (k: (typeof STAT_KEYS)[number], g: 'A' | 'S'): Combatant => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    for (const s of STAT_KEYS) n.stats[s].grade = 'C';
    n.stats[k].grade = g;
    return combatantOf(n, w);
  };

  it('A and S grades give the trait, at half and full strength', () => {
    expect(withGrade('swim', 'S').traits).toEqual([{ id: 'slippery', full: true }]);
    expect(withGrade('fly', 'A').traits).toEqual([{ id: 'featherlight', full: false }]);
    expect(withGrade('run', 'S').traits[0]!.id).toBe('headStart');
    expect(withGrade('power', 'S').traits[0]!.id).toBe('heavyHugger');
    expect(withGrade('stamina', 'S').traits[0]!.id).toBe('secondWind');
    // Grades never multiply battle stats a second time.
    expect(withGrade('power', 'S').bonk).toBe(withGrade('power', 'A').bonk);
  });

  it('Slippery shrugs off the first status only', () => {
    const s = party(freshWorld());
    const to = withGrade('swim', 'S');
    const by = fighter(0);
    const rng = Rng.fromSeed(1);
    expect(inflict(s, rng, by, to, 'giggly', 1)).toBe(false);
    expect(inflict(s, rng, by, to, 'giggly', 1)).toBe(true);
  });

  it('Featherlight floats over ground moves', () => {
    const w = freshWorld();
    const s = party(w, 2, 4);
    const foe = s.sides[1][0]!;
    foe.traits = [{ id: 'featherlight', full: true }];
    foe.hp = foe.maxHp = 999;
    for (const c of s.sides[0]) c.moves = ['stone-nudge'];
    for (const c of s.sides[0])
      if (c.hp > 0) battleAct(s, { k: 'move', move: 'stone-nudge', target: foe.id });
    expect(s.log.some((e) => e.k === 'miss' && e.to === foe.id && e.float)).toBe(true);
    expect(s.log.some((e) => e.k === 'hit' && e.to === foe.id && e.move === 'stone-nudge')).toBe(
      false,
    );
  });

  it('Head Start (Run S) acts first on turn 1', () => {
    const s = party(freshWorld(), 2, 2);
    const me = s.sides[0][0]!;
    me.traits = [{ id: 'headStart', full: true }];
    me.zip = 1;
    for (const f of s.sides[1]) f.zip = 999;
    s.choices = { [me.id]: { k: 'strike' } };
    expect(turnOrder(s, Rng.fromSeed(2))[0]!.c.id).toBe(me.id);
  });

  it('Second Wind (Stamina S) keeps 1 HP once a bout, and only once', () => {
    const s = party(freshWorld());
    const to = withGrade('stamina', 'S');
    const rng = Rng.fromSeed(3);
    hurt(s, rng, to, to.maxHp * 2);
    expect(to.hp).toBe(1);
    to.hp = 10;
    hurt(s, rng, to, 999);
    expect(to.hp).toBe(0);
    expect(s.log.filter((e) => e.k === 'trait' && e.id === 'secondWind')).toHaveLength(1);
  });
});

describe('the type chart (recs FIGHT-13)', () => {
  it('covers all 25 pairs: the loop, the diagonals and steady Normal', () => {
    const want: Record<string, number> = {};
    for (const a of NUBBIN_TYPES) for (const d of NUBBIN_TYPES) want[`${a}>${d}`] = 1;
    Object.assign(want, {
      'swim>fly': 1.5,
      'fly>run': 1.5,
      'run>power': 1.5,
      'power>swim': 1.5,
      'fly>swim': 0.67,
      'run>fly': 0.67,
      'power>run': 0.67,
      'swim>power': 0.67,
    });
    for (const a of NUBBIN_TYPES)
      for (const d of NUBBIN_TYPES) expect(typeMult(a, d), `${a}>${d}`).toBe(want[`${a}>${d}`]);
  });

  it('the Sun/Moon layer for every move pole and target band', () => {
    const bands: AlignmentBand[] = ['sun', 'moon', 'neutral'];
    const want = {
      sun: { sun: 0.9, moon: 1.25, neutral: 1 },
      moon: { sun: 1.25, moon: 0.9, neutral: 1 },
      none: { sun: 1, moon: 1, neutral: 1 },
    } as const;
    for (const pole of ['sun', 'moon', 'none'] as const)
      for (const b of bands) {
        expect(alignMult(pole, b, false)).toBe(want[pole][b]);
        expect(alignMult(pole, b, true)).toBe(1);
      }
  });

  it('every line of the help card matches the table', () => {
    const help = buildTypeHelp();
    for (const a of LOOP) {
      const b = beats(a)!;
      expect(typeMult(a, b)).toBe(BATTLE.chart.strong);
      expect(help).toContain(TYPE_HELP.beats(a, b));
    }
    // And no line claims a pairing the table does not have.
    for (const a of LOOP)
      for (const d of LOOP)
        if (typeMult(a, d) !== BATTLE.chart.strong)
          expect(help).not.toContain(TYPE_HELP.beats(a, d));
    expect(TYPE_WORDS.normal.name).toBe('Normal');
  });
});

describe('Puff (recs FIGHT-14)', () => {
  it('a 0-Puff move is always there, so a bout never softlocks', () => {
    const s = party(freshWorld(), 2, 6);
    for (const c of [...s.sides[0], ...s.sides[1]]) c.puff = 0;
    expect(moveOf('bonk').puff).toBe(0);
    expect(battleAct(s, { k: 'move', move: 'tickle-storm' })).toBe(false);
    expect(battleAct(s, { k: 'strike' })).toBe(true);
    // Every move costs 0–5.
    for (const m of MOVES) expect(m.puff).toBeLessThanOrEqual(5);
  });

  it('starts at 3, comes back +2 a turn, and a breath gives +4', () => {
    const w = freshWorld();
    const s = party(w, 2, 7);
    expect(s.sides[0][0]!.puff).toBe(3);
    battleAct(s, { k: 'guard' });
    battleAct(s, { k: 'strike' });
    const a = s.sides[0][0]!;
    expect(a.puff).toBe(Math.min(a.puffMax, 3 + 4 + 2));
  });

  it('a Nubbin below 30% energy starts Yawny with Puff 1', () => {
    const w = freshWorld();
    w.nubbins[0]!.needs.energy = 0.2;
    const s = party(w);
    expect(s.sides[0][0]!.puff).toBe(1);
    expect(s.sides[0][1]!.puff).toBe(3);
    expect(s.log[0]).toEqual({ k: 'yawny', who: w.nubbins[0]!.id });
  });
});

describe('cosy statuses (recs FIGHT-15)', () => {
  const setup = () => {
    const s = party(freshWorld());
    return { s, by: fighter(10), to: fighter(10), rng: Rng.fromSeed(9) };
  };

  it('each major lasts its turns, then wears off', () => {
    for (const id of ['drowsy', 'dizzy', 'soggy', 'giggly', 'peckish', 'sticky'] as const) {
      const { s, by, to, rng } = setup();
      expect(inflict(s, rng, by, to, id, 1)).toBe(true);
      const turns = to.major!.turns;
      const [lo, hi] = BATTLE.status[id].turns;
      expect(turns).toBeGreaterThanOrEqual(lo);
      expect(turns).toBeLessThanOrEqual(hi);
      for (let i = 0; i < turns; i++) tickStatus(s, to);
      expect(to.major).toBeNull();
      expect(s.log.some((e) => e.k === 'status' && e.id === id && !e.on)).toBe(true);
    }
  });

  it('holds one major at a time; Soggy never takes on a Swim type', () => {
    const { s, by, to, rng } = setup();
    inflict(s, rng, by, to, 'giggly', 1);
    expect(inflict(s, rng, by, to, 'dizzy', 1)).toBe(false);
    expect(to.major!.id).toBe('giggly');
    const swimmer = fighter(10, { type: 'swim' });
    expect(inflict(s, rng, by, swimmer, 'soggy', 1)).toBe(false);
  });

  it('Drowsy skips its turn and wakes when bonked', () => {
    const w = freshWorld();
    const s = party(w, 2, 11);
    const foe = s.sides[1][0]!;
    foe.hp = foe.maxHp = 999;
    foe.major = { id: 'drowsy', turns: 3 };
    expect(canAct(s, Rng.fromSeed(1), foe)).toBe(false);
    s.sides[0].forEach((c) => (c.flutter = 0));
    for (let i = 0; i < 10 && foe.major; i++) battleAct(s, { k: 'strike', target: foe.id });
    expect(foe.major).toBeNull();
  });

  it('Peckish nibbles 1/16 of max HP a turn and never tucks anyone in', () => {
    const { s, to } = setup();
    to.major = { id: 'peckish', turns: 5 };
    const hp = to.hp;
    tickStatus(s, to);
    expect(to.hp).toBe(hp - Math.max(1, Math.round(to.maxHp / 16)));
    to.hp = 1;
    to.major = { id: 'peckish', turns: 5 };
    tickStatus(s, to);
    expect(to.hp).toBe(1);
  });

  it('moods stack to ±2 at ×1.25 a stage; personalities resist', () => {
    const { s, by, to, rng } = setup();
    for (let i = 0; i < 4; i++) shiftMood(s, rng, by, to, 'bonk', 1, 1);
    expect(to.moods.bonk).toBe(2);
    const cheerful = fighter(10, { personality: 'cheerful' });
    let landed = 0;
    for (let i = 0; i < 400; i++) {
      cheerful.moods = {};
      shiftMood(s, rng, by, cheerful, 'bonk', -1, 0.8);
      if (cheerful.moods.bonk === -1) landed++;
    }
    expect(landed / 400).toBeGreaterThan(0.3);
    expect(landed / 400).toBeLessThan(0.5);
  });

  it('every status and mood has an icon and a word, and every event formats', () => {
    for (const t of Object.values(STATUS_TEXT)) expect(t.icon && t.name).toBeTruthy();
    for (const t of Object.values(MOOD_TEXT)) expect(t.icon && t.up && t.down).toBeTruthy();
    for (const t of Object.values(TRAIT_TEXT)) expect(t.name && t.blurb).toBeTruthy();
    const line = formatEvent({ k: 'status', to: 'a', id: 'soggy', on: true }, () => 'Nono');
    expect(line).toContain('💧 Soggy');
  });
});

describe('moves as data (recs FIGHT-16)', () => {
  it('has about 60 moves, each with a name, a blurb and an anim', () => {
    expect(MOVES.length).toBeGreaterThanOrEqual(55);
    expect(new Set(MOVES.map((m) => m.id)).size).toBe(MOVES.length);
    for (const m of MOVES) {
      expect(BATTLE_MOVE_TEXT[m.id]?.name, m.id).toBeTruthy();
      expect(BATTLE_MOVE_TEXT[m.id]?.blurb, m.id).toBeTruthy();
      expect(m.anim, m.id).toBeTruthy();
    }
  });

  it('every critter, lesson, form, Eternal, final and species maps to a move', () => {
    const known = (id: string | undefined) =>
      expect(id && MOVES.some((m) => m.id === id)).toBe(true);
    for (const c of CRITTER_SPECIES) known(CRITTER_MOVE[c.id]);
    for (const l of LESSON_IDS) known(LESSON_MOVE[l]);
    for (const b of ['sun', 'moon', 'neutral'] as const) {
      known(CHAOS_MOVE[b]);
      for (const t of NUBBIN_TYPES) known(FORM_MOVE[`${b}:${t}`]);
    }
    for (const sp of SPECIES) {
      expect(speciesKit(sp.id).length, sp.id).toBe(2);
      for (const id of speciesKit(sp.id)) known(id);
      if (sp.stage === 'final' && sp.family !== 'chao')
        known(FINAL_MOVE[`${sp.family}:${sp.type}`]);
    }
  });

  it('a Nubbin learns from its parts, lessons and form', () => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    n.parts.ears = 'rabbit-ears';
    n.parts.arms = 'gorilla-arms';
    n.lessons.singing = 1;
    const k = sourcesOf(n);
    expect(k).toEqual(expect.arrayContaining(['ear-flop', 'chest-drum', 'lullaby', 'raspberry']));
    n.form = {
      band: 'sun',
      type: 'fly',
      second: null,
      leanAtEvolution: { normal: 0, swim: 0, fly: 0, run: 0, power: 0 },
    } as never;
    expect(sourcesOf(n)).toContain('halo-glide');
  });
});

describe('four move slots (recs FIGHT-17)', () => {
  it('an old save with no battle record gets known moves from its parts and lessons', () => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    n.parts.tail = 'cheetah-tail';
    n.lessons.dance = 2;
    delete n.battle;
    const reloaded = JSON.parse(JSON.stringify(w)) as World;
    const m = reloaded.nubbins[0]!;
    expect(m.battle).toBeUndefined();
    const b = peekBattle(m);
    expect(b.known).toEqual(expect.arrayContaining(['zoomies', 'jiggle-jig']));
    expect(b.slots.filter(Boolean)).toHaveLength(4);
  });

  it('a new move joins an empty slot, or asks to swap when all four are full', () => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    const ev: SimEvent[] = [];
    syncMoves(n, ev);
    n.battle!.slots = [n.battle!.slots[0]!, null, null, null];
    n.parts.ears = 'rabbit-ears';
    syncMoves(n, ev);
    expect(n.battle!.slots[1]).toBe('ear-flop');
    expect(ev.at(-1)).toMatchObject({ kind: 'moveLearned', move: 'ear-flop', slotted: true });
    n.battle!.slots = ['wobble', 'raspberry', 'tickle-storm', 'ear-flop'];
    n.parts.arms = 'bear-arms';
    syncMoves(n, ev);
    expect(ev.at(-1)).toMatchObject({ kind: 'moveLearned', move: 'bear-hug', slotted: false });
    expect(n.battle!.slots).not.toContain('bear-hug');
  });

  it('the slot editor takes only known moves, through a command', () => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    const ev: SimEvent[] = [];
    syncMoves(n, ev);
    applyCommand(
      w,
      { kind: 'battleSlots', nubbinId: n.id, slots: ['raspberry', null, null, null] },
      ev,
    );
    expect(n.battle!.slots).toEqual(['raspberry', null, null, null]);
    applyCommand(w, { kind: 'battleSlots', nubbinId: n.id, slots: ['moonshade-bonk'] }, ev);
    expect(n.battle!.slots[0]).toBe('raspberry');
    const s = party(w);
    expect(s.sides[0][0]!.moves).toEqual(['raspberry']);
  });

  it('egg → adult → rebirth keeps known moves and resets the slots to the best four', () => {
    const w = freshWorld();
    const n = w.nubbins[0]!;
    const ev: SimEvent[] = [];
    n.parts.ears = 'rabbit-ears';
    n.lessons.drawing = 1;
    syncMoves(n, ev);
    n.stage = 'adult';
    evolve(n, ev, w);
    syncMoves(n, ev);
    const known = [...n.battle!.known];
    expect(known).toContain('ear-flop');
    n.battle!.slots = ['raspberry', null, null, null];
    rebirth(n, ev);
    hatch(n, ev, 0);
    syncMoves(n, ev);
    expect(n.battle!.known).toEqual(expect.arrayContaining(known));
    expect(n.battle!.slots.filter(Boolean)).toHaveLength(4);
    expect(n.battle!.slots).not.toEqual(['raspberry', null, null, null]);
  });
});

describe('turn order (recs FIGHT-18)', () => {
  it('a faster user with equal priority always goes first', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const s = party(freshWorld(), 2, seed);
      const me = s.sides[0][0]!;
      me.zip = 200;
      for (const c of [...s.sides[0].slice(1), ...s.sides[1]]) c.zip = 100;
      s.choices = Object.fromEntries(s.sides[0].map((c) => [c.id, { k: 'strike' as const }]));
      const order = turnOrder(s, Rng.fromSeed(seed));
      const firstAttacker = order.find((o) => o.a.k !== 'guard')!;
      expect(firstAttacker.c.id).toBe(me.id);
    }
  });

  it('a priority +1 move beats a faster foe', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const s = party(freshWorld(), 1, seed);
      const me = s.sides[0][0]!;
      me.zip = 1;
      me.moves = ['belly-slide'];
      for (const c of s.sides[1]) c.zip = 999;
      // The foes bonk (a Sprout's breath would go first at priority +3).
      s.choices = { [me.id]: { k: 'move', move: 'belly-slide' } };
      for (const c of s.sides[1]) s.choices[c.id] = { k: 'strike' };
      expect(turnOrder(s, Rng.fromSeed(seed))[0]!.c.id).toBe(me.id);
    }
  });

  it('logs turnStart, the actions, then turnEnd', () => {
    const s = party(freshWorld(), 2, 3);
    for (const c of s.sides[0]) if (c.hp > 0) battleAct(s, { k: 'strike' });
    const ks = s.log.map((e) => e.k);
    expect(ks.indexOf('turnStart')).toBeLessThan(ks.indexOf('use'));
    expect(ks.lastIndexOf('use')).toBeLessThan(ks.indexOf('turnEnd'));
  });
});
