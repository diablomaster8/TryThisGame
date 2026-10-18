import { afterEach, describe, expect, it, vi } from 'vitest';
import { SAVE_SAFETY } from '../../src/config/tuning';
import {
  backupUnreadable,
  modeOfWorld,
  readUnreadable,
  slotKey,
  unreadableKey,
  type SaveSlot,
} from '../../src/platform/storage';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, importProblem, nubbinProblem, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/**
 * The guards that keep a save from being lost: an unreadable save is copied aside before
 * a fresh start, and an import must be sound and of the slot's own mode.
 */

function fakeStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
  return store;
}

function hatchedWorld(seed: number): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  return w;
}

afterEach(() => vi.unstubAllGlobals());

const SLOT: SaveSlot = { mode: 'campaign', index: 2 };

describe('unreadable saves are kept, never overwritten', () => {
  it('keeps the newest copies beside the slot, newest first, and leaves the slot alone', () => {
    const store = fakeStorage();
    store.set(slotKey(SLOT), 'broken-1');
    expect(backupUnreadable(SLOT, 'broken-1')).toBe(true);
    expect(backupUnreadable(SLOT, 'broken-2')).toBe(true);
    expect(backupUnreadable(SLOT, 'broken-3')).toBe(true);
    expect(SAVE_SAFETY.unreadableKept).toBe(2);
    expect(readUnreadable(SLOT)).toEqual(['broken-3', 'broken-2']);
    expect(store.get(unreadableKey(SLOT, 1))).toBe('broken-3');
    // The copies live under their own keys; the slot itself is untouched.
    expect(store.get(slotKey(SLOT))).toBe('broken-1');
    expect(unreadableKey(SLOT, 1)).not.toBe(slotKey(SLOT));
  });

  it('does not push an older copy out when the same broken save fails again on reload', () => {
    fakeStorage();
    backupUnreadable(SLOT, 'older');
    backupUnreadable(SLOT, 'same');
    backupUnreadable(SLOT, 'same');
    backupUnreadable(SLOT, 'same');
    expect(readUnreadable(SLOT)).toEqual(['same', 'older']);
  });

  it('keeps each slot’s copies apart', () => {
    fakeStorage();
    backupUnreadable({ mode: 'free', index: 1 }, 'free');
    backupUnreadable({ mode: 'edu', index: 1 }, 'edu');
    expect(readUnreadable({ mode: 'free', index: 1 })).toEqual(['free']);
    expect(readUnreadable({ mode: 'edu', index: 1 })).toEqual(['edu']);
    expect(readUnreadable({ mode: 'free', index: 2 })).toEqual([]);
  });

  it('reports failure when storage refuses the copy, so the game can hold off saving', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => undefined,
    });
    expect(backupUnreadable(SLOT, 'broken')).toBe(false);
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    });
    expect(backupUnreadable(SLOT, 'broken')).toBe(false);
    expect(readUnreadable(SLOT)).toEqual([]);
  });
});

describe('an imported save belongs to one mode', () => {
  it('reads the mode from the world', () => {
    expect(modeOfWorld(createWorld(1, 0))).toBe('free');
    expect(modeOfWorld({ edu: null, campaign: { storyline: null } })).toBe('campaign');
    expect(modeOfWorld({ edu: { age: 4 }, campaign: { storyline: null } })).toBe('edu');
    expect(modeOfWorld({ edu: { age: 4 }, campaign: null })).toBe('edu');
    for (const id of ['hundred', 'logged', 'beetle'] as const)
      expect(modeOfWorld({ campaign: { storyline: id } })).toBe(id);
    expect(modeOfWorld({ campaign: { storyline: 'dawn' } })).toBe('dawndusk');
    expect(modeOfWorld({ campaign: { storyline: 'dusk' } })).toBe('dawndusk');
    // An unknown storyline id is still a story save, never a Free or Learning Grove one.
    expect(modeOfWorld({ campaign: { storyline: 'someday' } })).toBe('campaign');
  });
});

describe('an imported save must be sound', () => {
  it('passes a real save, before and after a round trip', () => {
    const w = hatchedWorld(7);
    expect(w.nubbins.length).toBeGreaterThan(0);
    expect(importProblem(w)).toBeNull();
    expect(importProblem(deserialize(serialize(w, 1)).world)).toBeNull();
  });

  it('refuses an empty Nubbin instead of letting it reach the render loop', () => {
    /** The import path as Settings runs it: load, then the import check. */
    const importJson = (nubbins: unknown[]): string | null => {
      const file = JSON.parse(serialize(hatchedWorld(8), 1)) as {
        world: { nubbins: unknown[] };
      };
      file.world.nubbins = nubbins;
      try {
        return importProblem(deserialize(JSON.stringify(file)).world);
      } catch {
        return 'load failed';
      }
    };
    expect(importJson([{}])).not.toBeNull();
    // Load is lenient on purpose and lets this one through; the import check catches it.
    expect(importJson([{ behavior: { state: 'sit' } }])).toBe('no id');
  });

  it('names the broken field', () => {
    const base = () =>
      JSON.parse(JSON.stringify(hatchedWorld(9).nubbins[0])) as Record<string, unknown>;
    expect(nubbinProblem(null)).toBe('not an object');
    expect(nubbinProblem([])).toBe('not an object');
    const noStage = base();
    noStage.stage = 'teen';
    expect(nubbinProblem(noStage)).toMatch(/bad stage/);
    const nanPos = base();
    nanPos.pos = { x: Number.NaN, z: 0 };
    expect(nubbinProblem(nanPos)).toMatch(/bad pos/);
    const badGrade = base();
    (badGrade.stats as Record<string, { grade: string }>).fly!.grade = 'Z';
    expect(nubbinProblem(badGrade)).toMatch(/bad fly stat/);
    const noNeeds = base();
    delete noNeeds.needs;
    expect(nubbinProblem(noNeeds)).toMatch(/bad needs/);
    const noBehavior = base();
    noBehavior.behavior = {};
    expect(nubbinProblem(noBehavior)).toMatch(/bad behavior/);
  });

  it('refuses two Nubbins with the same id', () => {
    const w = hatchedWorld(10);
    const copy = JSON.parse(JSON.stringify(w.nubbins[0])) as World['nubbins'][number];
    w.nubbins.push(copy);
    expect(importProblem(w)).toMatch(/repeated id/);
  });
});
