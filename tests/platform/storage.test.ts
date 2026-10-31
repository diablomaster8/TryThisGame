import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INDEX_KEY } from '../../src/platform/slot-index';
import {
  clearSave,
  hasSave,
  readSave,
  readSlotIndex,
  setSaveSlot,
  slotId,
  slotKey,
  storageAvailable,
  writeSave,
  type SaveSlot,
} from '../../src/platform/storage';
import { serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';

/**
 * TECH-43: the storage layer past the save-safety cases. A full quota, a localStorage that
 * throws on access (Safari with site data blocked), and the slot index the title reads.
 * IndexedDB is absent in Node, so the mirror and backups take their own "unavailable" path.
 */

const SLOT: SaveSlot = { mode: 'free', index: 2 };
const SAVE = serialize(createWorld(7, 0), 1_000);

function fakeStorage(opts: { quota?: number } = {}): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      const used = [...store].reduce((s, [key, val]) => s + (key === k ? 0 : val.length), 0);
      if (opts.quota !== undefined && used + v.length > opts.quota) {
        throw new DOMException('full', 'QuotaExceededError');
      }
      store.set(k, v);
    },
    removeItem: (k: string) => void store.delete(k),
  });
  return store;
}

beforeEach(() => setSaveSlot(SLOT));
afterEach(() => vi.unstubAllGlobals());

describe('storage (TECH-43)', () => {
  it('writes and reads the current slot under its own key', () => {
    const store = fakeStorage();
    expect(storageAvailable()).toBe(true);
    expect(writeSave(SAVE)).toBe(true);
    expect(store.get(slotKey(SLOT))).toBe(SAVE);
    expect(readSave()).toBe(SAVE);
    expect(hasSave(SLOT)).toBe(true);
    expect(hasSave({ mode: 'free', index: 3 })).toBe(false);
  });

  it('reports a full quota as a failed write and keeps the last good save', () => {
    const store = fakeStorage({ quota: SAVE.length * 4 });
    expect(writeSave(SAVE)).toBe(true);
    const huge = SAVE + ' '.repeat(SAVE.length * 4);
    expect(() => writeSave(huge)).not.toThrow();
    expect(writeSave(huge)).toBe(false);
    expect(store.get(slotKey(SLOT))).toBe(SAVE);
  });

  it('keeps running when touching localStorage throws at all', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
    try {
      expect(storageAvailable()).toBe(false);
      expect(readSave()).toBe(null);
      expect(writeSave(SAVE)).toBe(false);
      expect(hasSave(SLOT)).toBe(false);
      expect(clearSave()).toBe(false);
      const index = readSlotIndex();
      expect(index.slots).toEqual({});
      expect(index.lastPlayed).toBe(null);
    } finally {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    }
  });

  it('keeps the slot index in step with writes and clears', () => {
    const store = fakeStorage();
    writeSave(SAVE);
    let index = readSlotIndex();
    expect(Object.keys(index.slots)).toEqual([slotId(SLOT)]);
    expect(index.lastPlayed).toBe(slotId(SLOT));
    expect(index.slots[slotId(SLOT)]!.bytes).toBe(SAVE.length * 2);

    clearSave();
    index = readSlotIndex();
    expect(index.slots[slotId(SLOT)]).toBeUndefined();
    expect(store.has(slotKey(SLOT))).toBe(false);
  });

  it('rebuilds a broken or missing index from the saves that are there', () => {
    const store = fakeStorage();
    store.set(slotKey({ mode: 'campaign', index: 1 }), SAVE);
    store.set(INDEX_KEY, '{not json');
    const index = readSlotIndex();
    expect(Object.keys(index.slots)).toEqual(['campaign:1']);
    // The rebuilt index is stored, so the next read does not scan again.
    expect(JSON.parse(store.get(INDEX_KEY)!).slots['campaign:1']).toBeTruthy();
  });
});
