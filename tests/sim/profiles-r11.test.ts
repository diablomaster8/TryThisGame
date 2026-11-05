/**
 * Lane C round 11, helper "profiles": chapter select and its branch (R0618, R0619), the
 * caper packs (R0638), the Sandbox start (R0627), the profile registry (R0628, R0653) and
 * what the title does after the move into unified slots (R0598: Older saves, Combine endings).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryKv, setKvBackend } from '../../src/platform/idb';
import { migrateToUnified, unifiedKey } from '../../src/platform/migrate-unified';
import {
  addProfile,
  deleteProfile,
  listDeleted,
  listProfiles,
  renameProfile,
  restoreProfile,
  purgeDeleted,
} from '../../src/platform/profiles';
import { writeCheckpoint } from '../../src/platform/save-backups';
import { readSlotJson, readSlotSummary, setSaveSlot, slotKey } from '../../src/platform/storage';
import {
  combineInto,
  endingSources,
  hazelTargets,
  olderSaves,
  swapOlder,
} from '../../src/platform/unified-after';
import { PROFILES } from '../../src/config/tuning-camp11-profiles';
import { startCampaign } from '../../src/sim/campaign';
import { chapterOfScene, chapterSelect, currentChapterKeys } from '../../src/sim/chapter-select';
import { grantPackReward, packOf, packProgress, packQuests } from '../../src/sim/pack-rewards';
import { deserialize, serialize, worldFingerprint } from '../../src/sim/save';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';
import { branchFrom } from '../../src/ui/chapter-select';
import { storylineWorld } from './storyline-driver';

function fakeStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  });
  return store;
}

function hazelAt(chapter: number): World {
  const w = createWorld(7, 0);
  startCampaign(w, []);
  const c = w.campaign!;
  c.chapter = chapter;
  c.step = 0;
  c.seen.push('c4-close', 'c4-open', 'c5-open', 's9-ask');
  c.seenMs['c4-open'] = 10;
  c.seenMs['c4-close'] = 20;
  c.seenMs['c5-open'] = 30;
  c.checkpoints = { 'hazel/4': 'campaign:1/hazel/4' };
  return w;
}

let db = memoryKv();
beforeEach(() => {
  db = memoryKv();
  setKvBackend(db);
});
afterEach(() => {
  vi.unstubAllGlobals();
  setKvBackend(null);
  setSaveSlot({ mode: 'free', index: 1 });
});

describe('chapter select (R0618, R0619)', () => {
  it('lists finished chapters with their scenes in first-seen order, and changes nothing', () => {
    const w = hazelAt(6);
    const before = worldFingerprint(w);
    expect(chapterOfScene('c4-open')).toBe(4);
    expect(chapterOfScene('h-c2-close')).toBe(2);
    expect(chapterOfScene('s9-ask')).toBeNull();
    const done = chapterSelect(w);
    const four = done.find((d) => d.line === 'hazel' && d.n === 4)!;
    expect(four.scenes).toEqual(['c4-open', 'c4-close']);
    expect(four.checkpoint).toBe('campaign:1/hazel/4');
    expect(done.find((d) => d.n === 5)!.checkpoint).toBeNull();
    expect(done.some((d) => d.n === 6)).toBe(false); // the chapter in play is not finished
    expect(worldFingerprint(w)).toBe(before);
  });

  it('names the chapters in play for checkpoints after catch-up', () => {
    const w = hazelAt(6);
    expect(currentChapterKeys(w)).toEqual(['hazel/6']);
  });

  it('branches from a checkpoint into an empty slot at its chapter, step 0, with its flags', async () => {
    const store = fakeStorage();
    const live = hazelAt(9);
    setSaveSlot({ mode: 'campaign', index: 2 });
    store.set(slotKey({ mode: 'campaign', index: 2 }), serialize(live, 1));
    const snap = hazelAt(6);
    snap.campaign!.flags['c5-kept-lamp'] = true;
    const id = await writeCheckpoint('campaign:2', 'hazel/6', serialize(snap, 1));
    expect(id).not.toBeNull();
    const liveBefore = store.get(slotKey({ mode: 'campaign', index: 2 }));
    const said = await branchFrom({ line: 'hazel', n: 6, scenes: [], checkpoint: id });
    expect(said).toContain('Slot 1');
    const branch = deserialize(readSlotJson({ mode: 'campaign', index: 1 })!).world;
    expect(branch.campaign!.chapter).toBe(6);
    expect(branch.campaign!.step).toBe(0);
    expect(branch.campaign!.flags['c5-kept-lamp']).toBe(true);
    expect(branch.campaign!.checkpoints).toBeUndefined();
    expect(readSlotSummary({ mode: 'campaign', index: 1 })?.label?.name).toBe('Branch of 2 · Ch 6');
    // The live save is never rewound.
    expect(store.get(slotKey({ mode: 'campaign', index: 2 }))).toBe(liveBefore);
  });

  it('without a checkpoint (IndexedDB blocked) offers Watch again only', async () => {
    setKvBackend(memoryKv(true));
    fakeStorage();
    setSaveSlot({ mode: 'campaign', index: 1 });
    const said = await branchFrom({ line: 'hazel', n: 3, scenes: [], checkpoint: null });
    expect(said).toMatch(/Watch again only/);
  });
});

describe('caper packs (R0638)', () => {
  it('the Python pack is Q1–Q20 and keeps its keepsake once', () => {
    const w = createWorld(3, 0);
    startCampaign(w, []);
    const c = w.campaign!;
    expect(packOf('q01')).toBe('python');
    expect(packOf('q20')).toBe('python');
    expect(packOf('q21')).toBe('bean');
    expect(packOf('s9')).toBeNull();
    expect(packProgress(c, 'python')).toEqual({ done: 0, of: 20, next: 'q01' });
    const events: SimEvent[] = [];
    for (const id of packQuests('python').slice(0, 19))
      c.fun[id] = { status: 'done', step: 0 } as never;
    expect(grantPackReward(w, c, 'q19', events)).toBe(false);
    c.fun.q20 = { status: 'done', step: 0 } as never;
    expect(grantPackReward(w, c, 'q20', events)).toBe(true);
    expect(grantPackReward(w, c, 'q20', events)).toBe(false);
    expect(w.inventory.keepsakes.filter((k) => k === 'pack-python')).toHaveLength(1);
    expect(packProgress(c, 'python').next).toBeNull();
  });
});

describe('Sandbox start (R0627)', () => {
  it('a Sandbox with 6 grown Nubbins starts the story and keeps all 6 and its visitors', () => {
    const w = createWorld(11, 0);
    const egg = w.nubbins[0]!;
    w.nubbins = Array.from({ length: 6 }, (_, i) => ({
      ...structuredClone(egg),
      id: `nub-s${i}`,
      stage: 'adult' as const,
    }));
    w.npcs = [{ ...(w.npcs[0] ?? {}), id: 'npc-visitor', trainer: 'zed', guest: true } as never];
    expect(w.campaign).toBeNull();
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'setTrainer', id: 'fern' }, events);
    applyCommand(w, { kind: 'campaignStart', flow: 'open' }, events);
    expect(w.campaign?.chapter).toBe(1);
    for (let i = 0; i < 6; i++) expect(w.nubbins.some((n) => n.id === `nub-s${i}`)).toBe(true);
    expect(w.npcs.some((n) => n.id === 'npc-visitor')).toBe(true);
  });
});

describe('profiles (R0628, R0653)', () => {
  it('create, rename, delete into the archive, restore inside 30 days', async () => {
    const store = fakeStorage();
    expect(listProfiles().map((p) => p.id)).toEqual(['p1', 'k1']);
    const p = addProfile('keeper', '  Gran  ', '🧑‍🌾')!;
    expect(p.id).toBe('p2');
    expect(renameProfile('p2', 'Grandma')).toBe(true);
    store.set(unifiedKey('p2', 1), '{"slot":1}');
    store.set('grove.side.atlas.p2', '{"atlas":2}');
    expect(await deleteProfile('p1', 0)).toBe(false); // the fixed ones stay
    expect(await deleteProfile('p2', 1000)).toBe(true);
    expect(store.has(unifiedKey('p2', 1))).toBe(false);
    expect(listProfiles().some((x) => x.id === 'p2')).toBe(false);
    expect(listDeleted(2000).map((d) => d.profile.name)).toEqual(['Grandma']);
    expect(await restoreProfile('p2', 1000 + PROFILES.keepDeletedMs - 1)).toBe(true);
    expect(store.get(unifiedKey('p2', 1))).toBe('{"slot":1}');
    expect(store.get('grove.side.atlas.p2')).toBe('{"atlas":2}');
    expect(listProfiles().find((x) => x.id === 'p2')?.name).toBe('Grandma');
  });

  it('a deleted profile past the window cannot come back, and is purged', async () => {
    fakeStorage();
    addProfile('child', 'Ada', '🌱');
    expect(await deleteProfile('k2', 0)).toBe(true);
    expect(await restoreProfile('k2', PROFILES.keepDeletedMs)).toBe(false);
    expect(await purgeDeleted(PROFILES.keepDeletedMs)).toBe(1);
    expect(listDeleted(0)).toHaveLength(0);
  });

  it('stops at the most profiles a device keeps', () => {
    fakeStorage();
    for (let i = 0; i < 10; i++) addProfile('keeper', `K${i}`, '🙂');
    expect(listProfiles()).toHaveLength(PROFILES.max);
    expect(addProfile('child', 'One more', '🌱')).toBeNull();
  });

  it('blocked storage reads as the two fixed profiles and writes nothing', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    });
    expect(listProfiles()).toHaveLength(2);
    expect(addProfile('keeper', 'X', '🙂')).toBeNull();
  });
});

describe('after the move (R0598: Older saves, Combine endings)', () => {
  it('swaps an older save into a free slot and combines a finished line into Hazel', async () => {
    const store = fakeStorage();
    const hz = createWorld(5, 0);
    startCampaign(hz, []);
    store.set('grove.save.campaign', serialize(hz, 50));
    const done = storylineWorld('hundred', 'fern', 9).world;
    done.campaign!.ending = 'home';
    done.inventory.keepsakes.push('line-hundred-test');
    store.set('grove.save.hundred', serialize(done, 40));
    // 1 Hazel + 1 line + 3 Free Groves + 6 more lines = 11 saves, so 3 do not fit in 8.
    for (let i = 1; i <= 3; i++)
      store.set(slotKey({ mode: 'free', index: i }), serialize(createWorld(20 + i, 0), 30 - i));
    for (const m of ['logged', 'beetle'] as const)
      for (let i = 1; i <= 3; i++)
        store.set(
          slotKey({ mode: m, index: i }),
          serialize(storylineWorld(m, 'fern', 40 + i).world, 10 + i),
        );
    expect(await migrateToUnified(100, true)).toBe('migrated');
    const older = olderSaves();
    expect(older.length).toBeGreaterThan(0);
    // No room: every slot is full, so the swap is refused and nothing moves.
    expect(swapOlder(older[0]!.key, 8)).toBe(false);
    store.delete(unifiedKey('p1', 8));
    expect(swapOlder(older[0]!.key, 8)).toBe(true);
    expect(store.has(older[0]!.key)).toBe(true); // the legacy key stays
    expect(olderSaves().length).toBe(older.length - 1);
    expect(hazelTargets()).toEqual([1]);
    // Round 12: a moved save is read from its unified slot.
    expect(endingSources()).toContain(unifiedKey('p1', 2));
    const rosterBefore = deserialize(store.get(unifiedKey('p1', 1))!).world.nubbins.map(
      (n) => n.id,
    );
    expect(combineInto('grove.save.hundred', 1)).toBe(true);
    const after = deserialize(store.get(unifiedKey('p1', 1))!).world;
    expect(after.lines.hundred?.ending).toBe('home');
    expect(after.inventory.keepsakes).toContain('line-hundred-test');
    expect(after.nubbins.map((n) => n.id)).toEqual(rosterBefore);
  });
});
