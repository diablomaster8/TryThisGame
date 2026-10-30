import { describe, expect, it } from 'vitest';
import { bestAllyAction } from '../../src/sim/battle';
import { openBout } from '../../src/sim/battle/resume';
import { hatch } from '../../src/sim/lifecycle';
import { catchUp } from '../../src/sim/offline';
import { deserialize, serialize } from '../../src/sim/save';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** Save and resume mid-battle (recs FIGHT-64). */
function grove(): World {
  const w = createWorld(23, 0);
  const base = w.nubbins[0]!;
  while (w.nubbins.length < 3)
    w.nubbins.push({ ...structuredClone(base), id: `nub-r${w.nubbins.length}` });
  for (const n of w.nubbins) {
    hatch(n, [], 0);
    for (const k of STAT_KEYS) n.stats[k].points = 2000;
  }
  w.karate.belt = 3;
  return w;
}

const reload = (w: World): World => deserialize(serialize(w, 0)).world;

function play(w: World, n: number, events: SimEvent[]): void {
  for (let i = 0; i < n && w.battle && !w.battle.result; i++)
    applyCommand(w, { kind: 'battleAct', action: bestAllyAction(w.battle) }, events);
}

describe('save and resume mid-battle (recs FIGHT-64)', () => {
  it('saving mid-turn, reloading and resolving with the same commands gives an identical log', () => {
    const a = grove();
    const events: SimEvent[] = [];
    applyCommand(
      a,
      { kind: 'battleStart', context: { kind: 'dojo', tier: 2, ids: a.nubbins.map((n) => n.id) } },
      events,
    );
    play(a, 3, events);
    const b = reload(a);
    expect(openBout(b)).toBe('turn');
    expect(JSON.stringify(b.battle)).toBe(JSON.stringify(a.battle));
    play(a, 400, events);
    play(b, 400, []);
    expect(b.battle!.result).not.toBeNull();
    expect(b.battle!.log).toEqual(a.battle!.log);
  });

  it('resume drops half-made picks; a draw ends it with no winner', () => {
    const w = grove();
    applyCommand(
      w,
      { kind: 'battleStart', context: { kind: 'party', tier: 1, ids: w.nubbins.map((n) => n.id) } },
      [],
    );
    applyCommand(w, { kind: 'battleAct', action: { k: 'guard' } }, []);
    expect(Object.keys(w.battle!.choices ?? {}).length).toBe(1);
    applyCommand(w, { kind: 'battleResume' }, []);
    expect(Object.keys(w.battle!.choices ?? {}).length).toBe(0);
    expect(w.battle!.active).toBe(0);
    applyCommand(w, { kind: 'battleDraw' }, []);
    expect(w.battle!.result?.winner).toBeNull();
    expect(openBout(w)).toBeNull();
  });

  it('a 7-day catch-up with an open battle leaves it untouched and finishes in time', () => {
    const w = grove();
    applyCommand(
      w,
      { kind: 'battleStart', context: { kind: 'dojo', tier: 1, ids: [w.nubbins[0]!.id] } },
      [],
    );
    const before = JSON.stringify(w.battle);
    const t0 = performance.now();
    catchUp(w, 7 * 86_400_000, 7 * 86_400_000);
    expect(performance.now() - t0).toBeLessThan(3000);
    expect(JSON.stringify(w.battle)).toBe(before);
  });
});

describe('needs held during a bout (recs FIGHT-64, FIGHT-85)', () => {
  it('the party neither starves nor tires while the bout is live, live or offline', () => {
    const w = grove();
    const id = w.nubbins[0]!.id;
    applyCommand(w, { kind: 'battleStart', context: { kind: 'dojo', tier: 1, ids: [id] } }, []);
    const n = w.nubbins[0]!;
    const hunger = n.needs.hunger;
    catchUp(w, 3_600_000, 3_600_000);
    expect(n.needs.hunger).toBeCloseTo(hunger, 3);
    applyCommand(w, { kind: 'battleDraw' }, []);
    catchUp(w, 3_600_000, 7_200_000);
    expect(n.needs.hunger).toBeLessThan(hunger);
    expect(w.battleHeld).toBeUndefined();
  });
});
