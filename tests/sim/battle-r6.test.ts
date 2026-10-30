import { describe, expect, it } from 'vitest';
import { BATTLE_R6 } from '../../src/config/tuning-battle-r6';
import { bestAllyAction, createBattle, replay } from '../../src/sim/battle';
import { ladderBelt, ladderContext, ladderOf } from '../../src/sim/battle/ladder';
import { decodeReplayCode, encodeReplayCode, funniestMoment } from '../../src/sim/battle/replay';
import { battleAct } from '../../src/sim/battle/core';
import { hatch, rebirth } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function one(seed = 31): World {
  const w = createWorld(seed, 0);
  hatch(w.nubbins[0]!, [], 0);
  return w;
}

/** Plays (or, with `win`, settles) the fighter's next ladder bout through the world commands. */
function ladderBout(w: World, events: SimEvent[], win: boolean): void {
  const n = w.nubbins[0]!;
  const context = ladderContext(n)!;
  applyCommand(w, { kind: 'battleStart', context }, events);
  expect(w.battle?.context).toEqual(context);
  applyCommand(
    w,
    { kind: 'battleAct', action: { k: 'debug', set: { op: win ? 'win' : 'lose' } } },
    events,
  );
}

describe('the Dojo Ladder (recs FIGHT-99)', () => {
  it('winning five ladders sets the belt to 5, and it lasts through a rebirth', () => {
    const w = one();
    const events: SimEvent[] = [];
    const n = w.nubbins[0]!;
    for (let belt = 1; belt <= BATTLE_R6.ladder.belts; belt++)
      for (let b = 0; b < BATTLE_R6.ladder.bouts; b++) ladderBout(w, events, true);
    expect(ladderBelt(n)).toBe(5);
    expect(ladderOf(n).beltHistory.map((h) => h.belt)).toEqual([1, 2, 3, 4, 5]);
    expect(w.inventory.hats).toContain(BATTLE_R6.ladder.hat);
    expect(ladderContext(n)).toBeNull();
    expect(events.filter((e) => e.kind === 'ladderStep' && e.beltWon).length).toBe(5);
    rebirth(n, []);
    expect(ladderBelt(n)).toBe(5);
  });

  it('a loss sends the Nubbin back to the belt’s first bout', () => {
    const w = one();
    const events: SimEvent[] = [];
    ladderBout(w, events, true);
    ladderBout(w, events, true);
    expect(ladderOf(w.nubbins[0]!).step).toBe(2);
    ladderBout(w, events, false);
    expect(ladderOf(w.nubbins[0]!).step).toBe(0);
    expect(ladderBelt(w.nubbins[0]!)).toBe(0);
  });

  it('refuses a ladder bout that is not the fighter’s next one, and sharpens the AI', () => {
    const w = one();
    const n = w.nubbins[0]!;
    expect(createBattle(w, { kind: 'dojo', tier: 1, ids: [n.id], ladder: 2 }, 1)).toBeNull();
    const s = createBattle(w, ladderContext(n)!, 1)!;
    expect(s.ai).toBe('sprout');
    expect(s.sides[0].length).toBe(1);
  });
});

describe('replay codes and postcards (recs FIGHT-100)', () => {
  it('pasting a code replays an identical bout', () => {
    const w = one(44);
    const start = createBattle(w, { kind: 'dojo', tier: 1, ids: [w.nubbins[0]!.id] }, 9)!;
    const live = JSON.parse(JSON.stringify(start)) as typeof start;
    const actions: { atMs: number; a: ReturnType<typeof bestAllyAction> }[] = [];
    for (let i = 0; i < 200 && !live.result; i++) {
      const a = bestAllyAction(live);
      if (battleAct(live, a)) actions.push({ atMs: 0, a });
      else break;
    }
    expect(live.result).not.toBeNull();
    const code = encodeReplayCode({ seed: start.seed, start, actions });
    expect(code.startsWith('GRB1:')).toBe(true);
    const back = decodeReplayCode(code)!;
    const again = replay(
      back.start,
      back.actions.map((x) => x.a),
    );
    expect(again.log).toEqual(live.log);
    expect(again.result).toEqual(live.result);
    expect(decodeReplayCode('GRB1:!!!')).toBeNull();
    expect(decodeReplayCode('not a code')).toBeNull();
  });

  it('the postcard picks the biggest crit, else a Dizzy self-bonk', () => {
    const hit = (dmg: number, crit = false) =>
      ({ k: 'hit', by: 'a', to: 'b', dmg, strong: false, guarded: false, crit }) as const;
    expect(funniestMoment([hit(9), hit(4, true), hit(6, true)])).toMatchObject({
      kind: 'crit',
      dmg: 6,
    });
    expect(funniestMoment([hit(9), { k: 'boing', who: 'a', dmg: 2 }])).toMatchObject({
      kind: 'boing',
    });
    expect(funniestMoment([hit(3), hit(7)])).toMatchObject({ kind: 'hit', dmg: 7 });
    expect(funniestMoment([])).toBeNull();
  });
});

describe('the Battle Book (recs FIGHT-84)', () => {
  it('learning a move adds its page entry, counted as have / total', async () => {
    const { battleBook } = await import('../../src/sim/battle/book');
    const { collectMoveCards } = await import('../../src/sim/battle/rewards');
    const w = one(52);
    const before = battleBook(w);
    expect(before.total).toBeGreaterThanOrEqual(55);
    w.nubbins[0]!.battle = {
      known: ['bubble-blow'],
      slots: ['bubble-blow', null, null, null],
      wins: 0,
      losses: 0,
      befriended: 0,
      life: 0,
    };
    collectMoveCards(w);
    const after = battleBook(w);
    expect(after.moves.find((m) => m.id === 'bubble-blow')?.learned).toBe(true);
    expect(after.learned).toBe(
      before.learned + (before.moves.find((m) => m.id === 'bubble-blow')?.learned ? 0 : 1),
    );
  });
});

describe('slapstick fumbles (recs FUN-74)', () => {
  it('about one move in twenty fumbles harmlessly, and the rival laughs off its next action', () => {
    let moves = 0;
    let fumbles = 0;
    let laughs = 0;
    for (let seed = 1; seed <= 60; seed++) {
      const w = one(seed);
      const s = createBattle(w, { kind: 'dojo', tier: 1, ids: [w.nubbins[0]!.id] }, seed)!;
      for (let i = 0; i < 200 && !s.result; i++) if (!battleAct(s, bestAllyAction(s))) break;
      for (const e of s.log) {
        if (e.k === 'hit' || e.k === 'miss' || e.k === 'fumble') moves++;
        if (e.k === 'fumble') fumbles++;
        if (e.k === 'skip' && e.why === 'giggly') laughs++;
      }
    }
    expect(fumbles / moves).toBeGreaterThan(0.02);
    expect(fumbles / moves).toBeLessThan(0.09);
    expect(laughs).toBeGreaterThan(0);
  });
});

describe('push into the pond (recs FUN-74)', () => {
  it('a bonker bonks a non-swimmer into deep water: splash, soggy, never hurt by the water', async () => {
    const { createTactics, tacticsAct, unitOf } =
      await import('../../src/sim/battle/tactics/engine');
    const { mapFromRows } = await import('../../src/sim/battle/tactics/map');
    const { unitFromLevels } = await import('../../src/sim/battle/tactics/units');
    const pond = mapFromRows(['.....', '...~.', '.....']);
    const a = unitFromLevels({
      id: 'a',
      side: 0,
      species: 'chao',
      level: 30,
      at: { x: 1, y: 1 },
      type: 'power',
      job: 'bonker',
    });
    const f = unitFromLevels({
      id: 'f',
      side: 1,
      species: 'chao',
      level: 30,
      at: { x: 2, y: 1 },
      type: 'power',
    });
    f.swimmer = false;
    const s = createTactics({
      seed: 3,
      map: pond,
      allies: [a],
      foes: [f],
      context: { kind: 'dojo', tier: 1, ids: [] },
      ai: [null, null],
    });
    s.active = 'a';
    s.acted = false;
    s.moved = false;
    let splashed = false;
    for (let i = 0; i < 10 && !splashed; i++) {
      tacticsAct(s, { k: 'act', move: 'bonk', x: 2, y: 1 });
      splashed = s.log.some((e) => e.k === 'splash');
      if (!splashed && s.log.some((e) => e.k === 'hit')) break;
    }
    expect(splashed).toBe(true);
    const foe = unitOf(s, 'f')!;
    expect(foe.x).toBe(2);
    expect(foe.c.major?.id).toBe('soggy');
  });
});
