/* hot/perf-leaks E4: the autosave moved off the animation frame into idle time. The idle path
 * must write exactly what the old in-frame path wrote (save text and slot index), pick up a sim
 * step that lands before it runs, and give way to a synchronous save (tab hidden). */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AUTOSAVE_MAX_WAIT_MS,
  AutosaveQueue,
  writeWorld,
  type AutosaveHost,
  type IdleSlice,
} from '../../src/platform/autosave';
import {
  setSaveSlot,
  slotKey,
  summarize,
  summarizeData,
  writeSave,
  type SaveSlot,
} from '../../src/platform/storage';
import { serialize } from '../../src/sim/save';
import { startCampaign } from '../../src/sim/campaign';
import { catchUp } from '../../src/sim/offline';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

const SLOT: SaveSlot = { mode: 'free', index: 2 };
const AT = 1_700_000_000_000;

function fakeStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  });
  return store;
}

/** A host whose idle slices the test hands out by hand. */
function manualHost(): AutosaveHost & {
  waiting: Array<(s: IdleSlice) => void>;
  run(slice?: Partial<IdleSlice>): void;
  t: number;
} {
  const h = {
    t: 0,
    waiting: [] as Array<(s: IdleSlice) => void>,
    idle(cb: (s: IdleSlice) => void) {
      h.waiting.push(cb);
      return () => {
        h.waiting = h.waiting.filter((x) => x !== cb);
      };
    },
    now: () => h.t,
    run(slice: Partial<IdleSlice> = {}) {
      const cb = h.waiting.shift();
      cb?.({
        didTimeout: slice.didTimeout ?? false,
        timeRemaining: slice.timeRemaining ?? (() => 50),
      });
    },
  };
  return h;
}

function grown(world: World): World {
  const ev: SimEvent[] = [];
  applyCommand(world, { kind: 'debugGive', what: 'egg', amount: 8 - world.nubbins.length }, ev);
  for (const n of world.nubbins) applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, ev);
  world.settings.offlineAging.mode = 'indefinite';
  catchUp(world, 2 * 3_600_000, 0);
  return world;
}

const WORLDS: Array<[string, () => World]> = [
  ['fresh', () => createWorld(11, 0)],
  ['8 adults', () => grown(createWorld(12, 0))],
  [
    'mid-dungeon',
    () => {
      const w = grown(createWorld(13, 0));
      applyCommand(w, { kind: 'enterDungeon', daily: false }, []);
      for (let i = 0; i < 20; i++) stepWorld(w, 100, AT + i * 100);
      return w;
    },
  ],
  [
    'campaign',
    () => {
      const w = createWorld(14, 0);
      startCampaign(w, []);
      for (let i = 0; i < 50; i++) stepWorld(w, 100, AT + i * 100);
      return w;
    },
  ],
];

beforeEach(() => setSaveSlot(SLOT));
afterEach(() => vi.unstubAllGlobals());

describe('the idle autosave writes what the in-frame save wrote', () => {
  for (const [name, make] of WORLDS) {
    it(`same bytes and same slot index: ${name}`, () => {
      const w = make();
      if (name === 'mid-dungeon') expect(w.dungeon).toBeTruthy();
      if (name === 'campaign') expect(w.campaign).toBeTruthy();
      // The old path: serialise and write inside the frame.
      const before = fakeStorage();
      expect(writeSave(serialize(w, AT))).toBe(true);
      const old = new Map(before);
      vi.unstubAllGlobals();
      // The new path: asked for by the frame, written in an idle slice.
      const after = fakeStorage();
      const host = manualHost();
      const q = new AutosaveQueue(host);
      q.request(() => writeWorld(w, AT));
      expect(after.size).toBe(0);
      host.run();
      expect(q.pending).toBe(false);
      expect(after.get(slotKey(SLOT))).toBe(serialize(w, AT));
      expect([...after.entries()].sort()).toEqual([...old.entries()].sort());
    });
  }

  it('reads the summary from the object as from its JSON, odd numbers included', () => {
    for (const [, make] of WORLDS) {
      const w = make();
      expect(summarizeData({ savedAtWallMs: AT, world: w })).toEqual(summarize(serialize(w, AT)));
    }
    const w = createWorld(15, 0);
    startCampaign(w, []);
    w.timeMs = Number.NaN;
    (w.campaign as unknown as { chapter: number }).chapter = Number.POSITIVE_INFINITY;
    expect(summarizeData({ savedAtWallMs: Number.NaN, world: w })).toEqual(
      summarize(JSON.stringify({ version: 16, savedAtWallMs: Number.NaN, world: w })),
    );
  });
});

describe('a sim step or a synchronous save between the request and the write', () => {
  it('a sim step before the slice is in the save (one consistent snapshot, the newer one)', () => {
    const store = fakeStorage();
    const w = grown(createWorld(21, 0));
    const host = manualHost();
    const q = new AutosaveQueue(host);
    q.request(() => writeWorld(w, AT));
    const stale = serialize(w, AT);
    stepWorld(w, 100, AT);
    const fresh = serialize(w, AT);
    expect(fresh).not.toBe(stale);
    host.run();
    expect(store.get(slotKey(SLOT))).toBe(fresh);
  });

  it('waits for a slice long enough, but never past its deadline', () => {
    fakeStorage();
    const host = manualHost();
    const q = new AutosaveQueue(host);
    q.costMs = 6;
    let writes = 0;
    q.request(() => void writes++);
    host.run({ timeRemaining: () => 2 }); // too short: asks again
    expect(writes).toBe(0);
    expect(host.waiting.length).toBe(1);
    host.run({ timeRemaining: () => 10 });
    expect(writes).toBe(1);
    q.request(() => void writes++);
    host.run({ didTimeout: true, timeRemaining: () => 0 });
    expect(writes).toBe(2);
    q.request(() => void writes++);
    host.t += AUTOSAVE_MAX_WAIT_MS;
    host.run({ timeRemaining: () => 1 }); // past the deadline: runs in whatever slice comes
    expect(writes).toBe(3);
    expect(q.costMs).toBeLessThanOrEqual(40);
  });

  it('a hidden-tab save while one waits writes the current state now, and the idle one never runs', () => {
    const store = fakeStorage();
    const w = grown(createWorld(22, 0));
    const host = manualHost();
    const q = new AutosaveQueue(host);
    let idleWrites = 0;
    q.request(() => {
      idleWrites++;
      writeWorld(w, AT);
    });
    stepWorld(w, 100, AT);
    // What Game.save does on visibilitychange-hidden: drop the waiting one, write now.
    q.drop();
    expect(writeWorld(w, AT + 1)).toBe(true);
    expect(store.get(slotKey(SLOT))).toBe(serialize(w, AT + 1));
    expect(host.waiting.length).toBe(0);
    host.run();
    expect(idleWrites).toBe(0);
    expect(q.pending).toBe(false);
    // The next autosave is asked for as usual.
    q.request(() => void idleWrites++);
    host.run();
    expect(idleWrites).toBe(1);
  });
});
