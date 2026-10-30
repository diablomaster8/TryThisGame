import { describe, expect, it } from 'vitest';
import { BATTLE_R6 } from '../../src/config/tuning-battle-r6';
import { bestAllyAction, createBattle, replay } from '../../src/sim/battle';
import { ladderBelt, ladderContext, ladderOf } from '../../src/sim/battle/ladder';
import {
  decodeReplayCode,
  encodeReplayCode,
  funniestMoment,
} from '../../src/sim/battle/replay';
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
  applyCommand(w, { kind: 'battleAct', action: { k: 'debug', set: { op: win ? 'win' : 'lose' } } }, events);
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
    const again = replay(back.start, back.actions.map((x) => x.a));
    expect(again.log).toEqual(live.log);
    expect(again.result).toEqual(live.result);
    expect(decodeReplayCode('GRB1:!!!')).toBeNull();
    expect(decodeReplayCode('not a code')).toBeNull();
  });

  it('the postcard picks the biggest crit, else a Dizzy self-bonk', () => {
    const hit = (dmg: number, crit = false) =>
      ({ k: 'hit', by: 'a', to: 'b', dmg, strong: false, guarded: false, crit }) as const;
    expect(funniestMoment([hit(9), hit(4, true), hit(6, true)])).toMatchObject({ kind: 'crit', dmg: 6 });
    expect(funniestMoment([hit(9), { k: 'boing', who: 'a', dmg: 2 }])).toMatchObject({ kind: 'boing' });
    expect(funniestMoment([hit(3), hit(7)])).toMatchObject({ kind: 'hit', dmg: 7 });
    expect(funniestMoment([])).toBeNull();
  });
});
