import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SAVE_BACKUPS, SLOT_LABEL } from '../../src/config/tuning';
import { memoryKv, setKvBackend } from '../../src/platform/idb';
import {
  countCheckpoints,
  dropSlotStores,
  listBackups,
  takeBackup,
  writeCheckpoint,
} from '../../src/platform/save-backups';
import { INDEX_KEY, parseIndex } from '../../src/platform/slot-index';
import { restoreTrash, trashSlot } from '../../src/platform/slot-trash';
import {
  clearSlot,
  labelSlot,
  readSlotIndex,
  setSaveSlot,
  slotId,
  slotKey,
  storylineFinished,
  writeSave,
  type SaveSlot,
} from '../../src/platform/storage';
import { freshCampaignState } from '../../src/sim/campaign';
import { deserialize, serialize } from '../../src/sim/save';
import { cleanSlotLabel, cleanSlotName } from '../../src/sim/slot-label';
import {
  chapterKeysOf,
  checkpointCount,
  noteCheckpoint,
  stampEnding,
} from '../../src/sim/story-marks';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/**
 * Lane C r10 agent B: rolling backups and chapter checkpoints in IndexedDB (an in-memory
 * stand-in here), the slot index the title reads, slot names and tags, and ending dates.
 */

let reads = 0;
function fakeStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => {
      reads += 1;
      return store.get(k) ?? null;
    },
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
  return store;
}

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

function save(at: number, seed = 1): string {
  return serialize(createWorld(seed, 0), at);
}

beforeEach(() => setKvBackend(memoryKv()));
afterEach(() => {
  setKvBackend(null);
  vi.unstubAllGlobals();
});

describe('rolling backups (R0659)', () => {
  it('keeps one per interval, newest first, at most perSlot', async () => {
    const slot = 'free:1';
    const step = SAVE_BACKUPS.everyMs;
    expect(await takeBackup(slot, save(1), 1)).toBe(true);
    // Too soon: not kept.
    expect(await takeBackup(slot, save(2), 2)).toBe(false);
    for (let i = 1; i <= SAVE_BACKUPS.perSlot + 1; i++)
      expect(await takeBackup(slot, save(1 + i * step), 1 + i * step)).toBe(true);
    const list = await listBackups(slot);
    expect(list.map((b) => b.n)).toEqual([1, 2, 3].slice(0, SAVE_BACKUPS.perSlot));
    expect(list[0]!.savedAtWallMs).toBe(1 + (SAVE_BACKUPS.perSlot + 1) * step);
    expect(list[1]!.savedAtWallMs).toBe(1 + SAVE_BACKUPS.perSlot * step);
  });

  it('a forced backup ignores the interval but never keeps the same save twice', async () => {
    const json = save(5);
    expect(await takeBackup('campaign:2', json, 5, true)).toBe(true);
    expect(await takeBackup('campaign:2', json, 6, true)).toBe(false);
    expect(await takeBackup('campaign:2', save(7), 7, true)).toBe(true);
    expect((await listBackups('campaign:2')).length).toBe(2);
  });

  it('a restored backup deserialises to the same world it saved', async () => {
    const w = createWorld(3, 0);
    w.slotLabel = { name: 'Rainy', tag: 'moon' };
    const json = serialize(w, 10);
    await takeBackup('free:2', json, 10, true);
    const [b] = await listBackups('free:2');
    expect(b!.json.length * 2).toBe(json.length * 2);
    expect(serialize(deserialize(b!.json).world, 10)).toBe(json);
  });

  it('blocked IndexedDB keeps nothing and never throws', async () => {
    setKvBackend(memoryKv(true));
    expect(await takeBackup('free:1', save(1), 1, true)).toBe(false);
    expect(await listBackups('free:1')).toEqual([]);
    expect(await writeCheckpoint('free:1', 'hazel/1', save(1))).toBeNull();
    expect(await countCheckpoints('free:1')).toBe(0);
    await expect(dropSlotStores('free:1')).resolves.toBeUndefined();
  });
});

describe('chapter checkpoints (R0619)', () => {
  it('chapters 1 to 3 make three checkpoints, the first snapshot kept, keys in the book', async () => {
    const w = createWorld(4, 0);
    w.campaign = freshCampaignState(0);
    const slot = 'campaign:1';
    const events: SimEvent[] = [
      { kind: 'chapter', chapter: 1 },
      { kind: 'chapter', chapter: 2 },
      { kind: 'chapter', chapter: 3, line: 'hundred' },
      { kind: 'chapter', chapter: 3 },
    ];
    const keys = chapterKeysOf(events, w);
    expect(keys).toEqual(['hazel/1', 'hazel/2', 'hundred/3', 'hazel/3']);
    for (const key of keys.filter((k) => k.startsWith('hazel'))) {
      const id = await writeCheckpoint(slot, key, serialize(w, 1));
      expect(id).toBe(`${slot}/${key}`);
      applyCommand(w, { kind: 'checkpointKept', key, id: id! }, []);
    }
    expect(await countCheckpoints(slot)).toBe(3);
    expect(checkpointCount(w)).toBe(3);
    // A second write of a chapter keeps the first snapshot.
    const first = serialize(w, 1);
    await writeCheckpoint(slot, 'hazel/9', first);
    await writeCheckpoint(slot, 'hazel/9', serialize(w, 2));
    noteCheckpoint(w, 'hazel/1', 'other');
    expect(w.campaign.checkpoints!['hazel/1']).toBe(`${slot}/hazel/1`);
    // The keys survive a save round trip unchanged.
    const json = serialize(w, 3);
    expect(serialize(deserialize(json).world, 3)).toBe(json);
  });

  it('erasing a slot deletes its checkpoints and backups, not other slots', async () => {
    fakeStorage();
    const a: SaveSlot = { mode: 'campaign', index: 1 };
    const b: SaveSlot = { mode: 'campaign', index: 2 };
    for (const s of [a, b]) {
      await writeCheckpoint(slotId(s), 'hazel/1', save(1));
      await takeBackup(slotId(s), save(1), 1, true);
    }
    clearSlot(a);
    await tick();
    await tick();
    expect(await countCheckpoints(slotId(a))).toBe(0);
    expect(await listBackups(slotId(a))).toEqual([]);
    expect(await countCheckpoints(slotId(b))).toBe(1);
    expect((await listBackups(slotId(b))).length).toBe(1);
  });
});

describe('ending dates (R0642)', () => {
  it('stamps the sim and wall time once, and they round-trip', () => {
    const w = createWorld(5, 0);
    w.campaign = freshCampaignState(0);
    w.timeMs = 1234;
    w.lastWallMs = 1_700_000_000_000;
    stampEnding(w, w.campaign);
    w.timeMs = 9999;
    stampEnding(w, w.campaign);
    expect(w.campaign.endedMs).toBe(1234);
    expect(w.campaign.endedWallMs).toBe(1_700_000_000_000);
    const json = serialize(w, 1);
    expect(serialize(deserialize(json).world, 1)).toBe(json);
  });
});

describe('slot index (R0622)', () => {
  const filled: SaveSlot[] = [
    { mode: 'free', index: 1 },
    { mode: 'free', index: 2 },
    { mode: 'free', index: 3 },
    { mode: 'campaign', index: 1 },
    { mode: 'campaign', index: 2 },
    { mode: 'campaign', index: 3 },
    { mode: 'edu', index: 1 },
    { mode: 'hundred', index: 1 },
  ];

  it('the title reads one key with 8 filled slots', () => {
    fakeStorage();
    filled.forEach((s, i) => {
      setSaveSlot(s);
      expect(writeSave(save(100 + i, i + 1))).toBe(true);
    });
    reads = 0;
    const index = readSlotIndex();
    expect(reads).toBe(1);
    expect(Object.keys(index.slots).sort()).toEqual(filled.map(slotId).sort());
    expect(index.lastPlayed).toBe('hundred:1');
    expect(index.slots['free:2']!.summary.savedAtWallMs).toBe(101);
    // The bytes are the stored length.
    expect(index.slots['free:1']!.bytes).toBe(save(100, 1).length * 2);
    // storylineFinished reads the index too.
    reads = 0;
    storylineFinished('dawndusk', 'dawn');
    expect(reads).toBe(1);
  });

  it('a missing or corrupt index rebuilds from the saves with no data loss', () => {
    const store = fakeStorage();
    filled.forEach((s, i) => {
      setSaveSlot(s);
      writeSave(save(100 + i, i + 1));
    });
    const before = readSlotIndex();
    store.delete(INDEX_KEY);
    const rebuilt = readSlotIndex();
    expect(rebuilt.slots).toEqual(before.slots);
    for (const s of filled) expect(store.get(slotKey(s))).toBeDefined();
    store.set(INDEX_KEY, '{nope');
    expect(readSlotIndex().slots).toEqual(before.slots);
    expect(parseIndex(store.get(INDEX_KEY) ?? null)).not.toBeNull();
  });

  it('erasing a slot drops it from the index', () => {
    fakeStorage();
    setSaveSlot({ mode: 'free', index: 2 });
    writeSave(save(1));
    clearSlot({ mode: 'free', index: 2 });
    expect(readSlotIndex().slots['free:2']).toBeUndefined();
  });

  it('a slot put back from Recently erased is in the index again', () => {
    fakeStorage();
    const slot: SaveSlot = { mode: 'free', index: 2 };
    setSaveSlot(slot);
    writeSave(save(1));
    expect(trashSlot(slot, 1000)).toBe(true);
    expect(readSlotIndex().slots['free:2']).toBeUndefined();
    expect(restoreTrash(slot)).toBe(true);
    expect(readSlotIndex().slots['free:2']).toBeDefined();
  });
});

describe('slot names and tags (R0649)', () => {
  it('cleans names: trimmed, no markup or control characters, capped', () => {
    expect(cleanSlotName('  Mo\u0007ss  <b>Grove</b>  ')).toBe('Moss bGrove/b');
    expect(cleanSlotName('x'.repeat(40)).length).toBe(SLOT_LABEL.nameMax);
    expect(cleanSlotLabel({ name: '', tag: 'nope' })).toBeNull();
    expect(cleanSlotLabel({ name: 'A', tag: 'star' })).toEqual({ name: 'A', tag: 'star' });
    expect(cleanSlotLabel({ name: '', tag: 'sun' })).toEqual({ name: '', tag: 'sun' });
  });

  it('a rename survives a reload, an export and import, and a backup restore', async () => {
    const store = fakeStorage();
    const slot: SaveSlot = { mode: 'free', index: 1 };
    setSaveSlot(slot);
    writeSave(save(50));
    expect(labelSlot(slot, { name: "Pip's Grove", tag: 'leaf' })).toBe(true);
    // Reload: the index and the save both carry it.
    expect(readSlotIndex().slots['free:1']!.summary.label).toEqual({
      name: "Pip's Grove",
      tag: 'leaf',
    });
    const json = store.get(slotKey(slot))!;
    const world: World = deserialize(json).world;
    expect(world.slotLabel).toEqual({ name: "Pip's Grove", tag: 'leaf' });
    // Export then import: identical.
    const exported = serialize(world, 60);
    expect(serialize(deserialize(exported).world, 60)).toBe(exported);
    // A backup taken after the rename restores with it.
    await takeBackup(slotId(slot), json, 60, true);
    const [b] = await listBackups(slotId(slot));
    expect(deserialize(b!.json).world.slotLabel).toEqual({ name: "Pip's Grove", tag: 'leaf' });
    // Clearing the label removes it from the save.
    labelSlot(slot, null);
    expect(deserialize(store.get(slotKey(slot))!).world.slotLabel).toBeUndefined();
  });

  it('a bad label in a file is cleaned or dropped on load', () => {
    const w = createWorld(9, 0);
    (w as unknown as { slotLabel: unknown }).slotLabel = { name: 5, tag: 'zzz' };
    expect(deserialize(serialize(w, 1)).world.slotLabel).toBeUndefined();
  });
});

describe('endings shelf dates (R0642)', () => {
  it('a reached ending carries its date; unreached ones none', async () => {
    const { endingShelf } = await import('../../src/ui/journal-search');
    const [road] = endingShelf([
      {
        id: 'hazel',
        title: 'H',
        endings: { a: { title: 'A', how: 'ha' }, b: { title: 'B', how: 'hb' } },
        reached: new Set(['a']),
        at: { a: 42 },
      },
    ]);
    expect(road!.items.map((i) => i.at)).toEqual([42, null]);
  });
});
