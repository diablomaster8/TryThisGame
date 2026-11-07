import { afterEach, describe, expect, it } from 'vitest';
import { HOLLOW_KID, HOLLOW_KID_LESSON } from '../../src/content/edu-hollow-kid';
import { R10B3 } from '../../src/config/tuning-more/dungeon-poof-kid-mode';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { actStartDepth } from '../../src/config/dungeon-acts';
import { battleAct } from '../../src/sim/battle/core';
import { chooseAction, bestAllyAction } from '../../src/sim/battle/ai';
import { cellCentre, cellOf, runFloor, type Cell, type Floor } from '../../src/sim/dungeon';
import { navMask } from '../../src/sim/dungeon-nav';
import { actBossDepth, actFloor } from '../../src/sim/dungeon-acts';
import { setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { berriesPicked, kidBerryCells } from '../../src/sim/dungeon-kid-play';
import { createEdu } from '../../src/sim/edu';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { hollowKidLine } from '../../src/ui/hollow-kid-voice';

// Lane B round 10, helper b3: kid mode's read-aloud captions, counting berries, tag boss and
// the scripted four-year-old (R0188, DUNG-45).

const words = (t: string): number => t.split(/\s+/).filter(Boolean).length;

/**
 * `edu` true puts the world in the sprout band, where Hollow runs are Glow Cave runs (R0690) whose way
 * down waits for a puzzle; the tag boss and the scripted child walk the plain kid floors instead.
 */
function kidWorld(seed = 5, edu = true): World {
  const world = createWorld(seed, 0);
  const rng = Rng.fromSeed(9);
  while (world.nubbins.length < 3)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) hatch(n, [], 0);
  if (edu) world.edu = createEdu(4);
  else applyCommand(world, { kind: 'hollowKid', on: true }, []);
  return world;
}

function step(world: World): SimEvent[] {
  return stepWorld(world, SIM.stepMs);
}

/** Play a bout the way a small child does with the sprout AI's help: a turn per tap. */
function playBout(world: World): number {
  const s = world.battle!;
  const pick = Rng.fromSeed(7);
  for (let i = 0; i < 400 && !s.result; i++) {
    const me = s.sides[0][s.active];
    const a =
      s.phase === 'replace' || !me ? bestAllyAction(s) : chooseAction(s, me.id, 'keeper', pick);
    if (battleAct(s, a)) continue;
    if (!battleAct(s, bestAllyAction(s))) battleAct(s, { k: 'guard' });
  }
  return s.turn;
}

afterEach(() => setEncounterHandler(null));

/** An open cell near a room's middle. */
function roomSpot(f: Floor, i: number): Cell {
  const r = f.rooms[i]!;
  const open = navMask(f, false);
  const cx = Math.floor(r.x + r.w / 2);
  const cy = Math.floor(r.y + r.h / 2);
  for (let d = 0; d < 4; d++)
    for (let y = cy - d; y <= cy + d; y++)
      for (let x = cx - d; x <= cx + d; x++) if (open[y * f.cols + x]) return { x, y };
  return { x: cx, y: cy };
}

/** A few cells along the shortest open way from `a` to `b`, or null when it can't be reached. */
function toward(f: Floor, a: Cell, b: Cell, ahead = 2): Cell | null {
  const open = navMask(f, false);
  const from = new Int32Array(f.cols * f.rows).fill(-1);
  const s0 = a.y * f.cols + a.x;
  const g = b.y * f.cols + b.x;
  const q = [s0];
  from[s0] = s0;
  for (let h = 0; h < q.length && from[g] === -1; h++) {
    const i = q[h]!;
    const x = i % f.cols;
    for (const j of [i + 1, i - 1, i + f.cols, i - f.cols]) {
      if (j < 0 || j >= open.length || from[j] !== -1) continue;
      if (Math.abs((j % f.cols) - x) > 1 || (!open[j] && j !== g)) continue;
      from[j] = i;
      q.push(j);
    }
  }
  if (from[g] === -1) return null;
  const path = [g];
  while (path[path.length - 1] !== s0) path.push(from[path[path.length - 1]!]!);
  path.reverse();
  const k = path[Math.min(ahead, path.length - 1)]!;
  return { x: k % f.cols, y: Math.floor(k / f.cols) };
}

describe('kid mode text (R0188)', () => {
  it('keeps every kid line to 14 words or fewer, with an approved standard', () => {
    const all = [
      ...Object.values(HOLLOW_KID.shrine),
      ...Object.values(HOLLOW_KID.find),
      ...HOLLOW_KID.berries,
      HOLLOW_KID.tag.start,
      ...HOLLOW_KID.tag.tags,
      `${HOLLOW_KID.tag.tags[2]} ${HOLLOW_KID.tag.home}`,
      ...(HOLLOW_KID_LESSON.lines ?? []).map((l) => l.text),
    ];
    for (const t of all) expect(words(t), t).toBeLessThanOrEqual(14);
    expect(HOLLOW_KID_LESSON.standard).toBe('K.CC.B.5');
    expect(HOLLOW_KID.berries).toHaveLength(R10B3.berries.count);
  });

  it('captions shrines and finds in a kid run only', () => {
    const w = kidWorld();
    applyCommand(w, { kind: 'enterAct', act: 0 }, []);
    expect(hollowKidLine(w, { kind: 'shrineUsed', shrine: 'sunny' })).toBe(HOLLOW_KID.shrine.sunny);
    expect(
      hollowKidLine(w, { kind: 'dungeonFound', loot: 'seed', amount: 1, param: null, by: null }),
    ).toBe(HOLLOW_KID.find.seed);
    const grown = kidWorld(5, false);
    applyCommand(grown, { kind: 'hollowKid', on: false }, []);
    applyCommand(grown, { kind: 'enterAct', act: 0 }, []);
    expect(hollowKidLine(grown, { kind: 'shrineUsed', shrine: 'sunny' })).toBeNull();
  });
});

describe('the counting berries (R0188)', () => {
  it('lays all five on every kid floor, even where the landmark plugs the way down', () => {
    // Lane B r10 merge: 38 of 900 kid floors had none (the planner's landmark cells cut the path).
    for (let seed = 1; seed <= 20; seed++)
      for (let act = 0; act < 5; act++)
        for (let k = 0; k < 3; k++) {
          const f = actFloor(seed, act, actStartDepth(act) + k, HOLLOW.genVersion, 'cosy', true);
          expect(kidBerryCells(f), `seed ${seed} act ${act} level ${k}`).toHaveLength(5);
        }
  }, 60_000);

  it('lays five along the way down, picked one by one, and plays the lesson at five', () => {
    const w = kidWorld();
    applyCommand(w, { kind: 'enterAct', act: 0 }, []);
    const f = runFloor(w)!;
    const cells = kidBerryCells(f);
    expect(cells).toHaveLength(5);
    expect(kidBerryCells(f)).toBe(cells);
    const run = w.dungeon!;
    const said: number[] = [];
    for (const c of cells) {
      w.keeper.pos = cellCentre(f, c);
      for (const e of step(w)) if (e.kind === 'hollowKid' && e.what === 'berry') said.push(e.n);
    }
    expect(said).toEqual([1, 2, 3, 4, 5]);
    expect(berriesPicked(run)).toBe(5);
    expect(w.edu!.lessons[HOLLOW_KID_LESSON.id]).toEqual({ best: null });
  });

  it('never appears on a grown-up run', () => {
    const w = kidWorld(5, false);
    applyCommand(w, { kind: 'hollowKid', on: false }, []);
    applyCommand(w, { kind: 'enterAct', act: 0 }, []);
    const f = runFloor(w)!;
    for (const c of kidBerryCells(f)) {
      w.keeper.pos = cellCentre(f, c);
      expect(step(w).some((e) => e.kind === 'hollowKid')).toBe(false);
    }
  });
});

describe('the act boss is a game of tag (R0188)', () => {
  it('runs from the Keeper, is tagged three times, and goes home beaten with no fight', () => {
    const w = kidWorld(5, false);
    applyCommand(w, { kind: 'enterAct', act: 0 }, []);
    const run = w.dungeon!;
    // Bounded: a floor with no way down must fail this test, not spin it forever (a CI hang).
    for (let guard = 0; run.depth < actBossDepth(0); guard++) {
      expect(guard, `still on depth ${run.depth}`).toBeLessThan(60);
      run.packs = [];
      applyCommand(w, { kind: 'dungeonGo', to: 'down' }, []);
      if (run.pendingPos) w.keeper.pos = { ...run.pendingPos };
      for (let i = 0; i < 3; i++) step(w);
    }
    run.packs = run.packs!.filter((p) => p.id === 'pack-boss');
    const boss = run.packs[0]!;
    w.keeper.pos = { x: boss.pos.x + 3, z: boss.pos.z };
    run.graceUntilMs = 0;
    const events: SimEvent[] = [];
    let ms = 0;
    // The child just keeps walking at the boss.
    for (; ms < 90_000 && !events.some((e) => e.kind === 'bossBeaten'); ms += SIM.stepMs) {
      applyCommand(w, { kind: 'moveKeeperTo', pos: { ...boss.pos } }, events);
      events.push(...step(w));
    }
    const tags = events.filter((e) => e.kind === 'hollowKid' && e.what === 'tag');
    expect(events.some((e) => e.kind === 'hollowKid' && e.what === 'tagStart')).toBe(true);
    expect(tags.map((e) => (e.kind === 'hollowKid' ? e.n : 0))).toEqual([1, 2, 3]);
    expect(events.some((e) => e.kind === 'bossBeaten')).toBe(true);
    expect(events.some((e) => e.kind === 'encounterStarted')).toBe(false);
    expect(w.battle ?? null).toBeNull();
    expect(boss.state).toBe('beaten');
    // A short, happy game: well under a minute of chasing.
    expect(ms).toBeLessThan(60_000);
  });
});

describe('a scripted four-year-old (R0188 done-when)', () => {
  // Five seeded levels; the child's pace and pauses are `R10B3.kidPath` (a model, not a child).
  it.each([3, 12, 21, 57, 99])(
    'seed %i: finishes an Act I level in 3–5 min, no bout over 60 s, no line over 14 words',
    (seed) => {
      const w = kidWorld(seed, false);
      applyCommand(w, { kind: 'enterAct', act: 0 }, []);
      const run = w.dungeon!;
      expect(run.kid).toBe(true);
      const startDepth = run.depth;
      expect(startDepth).toBe(actStartDepth(0));
      const K = R10B3.kidPath;
      let walkMs = 0;
      let encs = 0;
      let talkMs = 0;
      let boutMs = 0;
      let longest = 0;
      let rooms = 0;
      let lastRoom = -1;
      let stuck = 0;
      let last = { ...w.keeper.pos };
      const lines: string[] = [];
      let done = false;
      const f = runFloor(w)!;
      const berries = kidBerryCells(f);
      const todo = f.rooms.map((_, i) => i);
      const seenRoom = new Set<number>();
      for (let t = 0; t < 20 * 60_000 && !done; t += SIM.stepMs) {
        // A bout: the child taps a move each turn; the turns are what take the time.
        if (w.battle && !w.battle.result) {
          const turns = playBout(w);
          const ms = turns * K.boutTurnMs;
          boutMs += ms;
          longest = Math.max(longest, ms);
        }
        if (!w.keeper.moveTarget && !run.encounter) {
          // A berry in sight comes first: small children go straight for the shiny thing.
          const want = berries.findIndex(
            (c, i) =>
              !run.taken.includes(`kid-berry-${i}`) &&
              Math.hypot(cellCentre(f, c).x - w.keeper.pos.x, cellCentre(f, c).z - w.keeper.pos.z) <
                8,
          );
          // Then any critter pack nearby: they want to say hello (which starts a bout).
          const pack = run.packs?.find(
            (p) =>
              p.state !== 'beaten' &&
              !p.id.includes('boss') &&
              Math.hypot(p.pos.x - w.keeper.pos.x, p.pos.z - w.keeper.pos.z) < 12,
          );
          if (want >= 0) {
            applyCommand(w, { kind: 'moveKeeperTo', pos: cellCentre(f, berries[want]!) }, []);
          } else if (pack && toward(f, cellOf(f, w.keeper.pos), cellOf(f, pack.pos))) {
            const next = toward(f, cellOf(f, w.keeper.pos), cellOf(f, pack.pos))!;
            applyCommand(w, { kind: 'moveKeeperTo', pos: cellCentre(f, next) }, []);
          } else {
            // Then every room in turn, nearest first (a small child wants to see it all), then
            // the stairs.
            const here = cellOf(f, w.keeper.pos);
            while (todo.length && seenRoom.has(todo[0]!)) todo.shift();
            todo.sort((a, b) => {
              const ra = f.rooms[a]!;
              const rb = f.rooms[b]!;
              const da = Math.abs(ra.x + ra.w / 2 - here.x) + Math.abs(ra.y + ra.h / 2 - here.y);
              const db = Math.abs(rb.x + rb.w / 2 - here.x) + Math.abs(rb.y + rb.h / 2 - here.y);
              return da - db;
            });
            const goal = todo.length > 0 ? roomSpot(f, todo[0]!) : (f.stairsDown ?? f.chest);
            const next = toward(f, here, goal, stuck > 10 ? 1 : 2);
            if (next === null) {
              if (todo.length) seenRoom.add(todo.shift()!);
              else applyCommand(w, { kind: 'dungeonGo', to: 'down' }, []);
            } else if (!todo.length && next.x === goal.x && next.y === goal.y) {
              applyCommand(w, { kind: 'dungeonGo', to: 'down' }, []);
            } else applyCommand(w, { kind: 'moveKeeperTo', pos: cellCentre(f, next) }, []);
          }
        }
        const events = step(w);
        encs += events.filter((e) => e.kind === 'encounterStarted').length;
        walkMs += SIM.stepMs;
        for (const e of events) {
          const line = hollowKidLine(w, e);
          if (line) {
            lines.push(line);
            talkMs += (words(line) / K.wordsPerSecond) * 1000 + K.captionPauseMs;
          }
        }
        const moved = Math.hypot(w.keeper.pos.x - last.x, w.keeper.pos.z - last.z);
        stuck = moved < 0.01 ? stuck + 1 : 0;
        if (stuck > 30) w.keeper.moveTarget = null;
        // Stuck at a step up out of a pool: the child taps Jump, as the guide's arrow shows.
        if (stuck === 20) applyCommand(w, { kind: 'jump', down: false }, []);
        if (stuck === 40) applyCommand(w, { kind: 'jump', down: true }, []);
        // A ledge or a pool in the way: the child gives that room up and goes on.
        if (stuck > 60 && todo.length) {
          seenRoom.add(todo.shift()!);
          stuck = 0;
        }
        last = { ...w.keeper.pos };
        if (w.dungeon !== run || run.depth !== startDepth) {
          done = true;
          break;
        }
        const c = cellOf(f, w.keeper.pos);
        const room = f.rooms.findIndex(
          (r) => c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h,
        );
        if (room >= 0) seenRoom.add(room);
        if (room >= 0 && room !== lastRoom) {
          rooms++;
          lastRoom = room;
        }
      }
      expect(done).toBe(true);
      // The child's own pace: slower taps than the sim's Keeper walks, a look round each room,
      // every caption listened to, and each bout turn tapped and watched.
      const total = walkMs / K.paceShare + rooms * K.lookMs + talkMs + boutMs;
      expect(total).toBeGreaterThanOrEqual(3 * 60_000);
      expect(total).toBeLessThanOrEqual(5 * 60_000);
      // The child met at least one pack, and no bout ran past a minute.
      expect(encs).toBeGreaterThan(0);
      expect(longest).toBeLessThanOrEqual(60_000);
      expect(lines.length).toBeGreaterThan(0);
      for (const l of lines) expect(words(l), l).toBeLessThanOrEqual(14);
      // Nothing on the way asked for a quest.
      expect(Object.keys(w.hollow.actQuests ?? {})).toEqual([]);
    },
  );
});
