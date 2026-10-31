import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SLOT_TRASH } from '../../src/config/tuning-r9d3';
import { keepInTrash, listTrash, restoreTrash, trashSlot } from '../../src/platform/slot-trash';
import { hasSave, slotKey, type SaveSlot } from '../../src/platform/storage';

/** TECH-29: an erased slot is kept for a week and can be put back while its slot is empty. */
describe('slot trash', () => {
  let store: Map<string, string>;
  beforeEach(() => {
    store = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
  });
  afterEach(() => vi.unstubAllGlobals());
  const slot: SaveSlot = { mode: 'free', index: 2 };

  it('erase keeps a copy, and Restore brings the exact save back', () => {
    store.set(slotKey(slot), '{"v":1}');
    expect(trashSlot(slot, 1000)).toBe(true);
    expect(hasSave(slot)).toBe(false);
    expect(listTrash(['free'], 3, 2000).map((e) => e.slot)).toEqual([slot]);
    expect(restoreTrash(slot)).toBe(true);
    expect(store.get(slotKey(slot))).toBe('{"v":1}');
    expect(listTrash(['free'], 3, 2000)).toEqual([]);
  });

  it('never restores over a slot that holds a save again', () => {
    store.set(slotKey(slot), 'old');
    trashSlot(slot, 0);
    store.set(slotKey(slot), 'new');
    expect(restoreTrash(slot)).toBe(false);
    expect(store.get(slotKey(slot))).toBe('new');
  });

  it('drops copies older than a week', () => {
    store.set(slotKey(slot), 'x');
    keepInTrash(slot, 0);
    expect(listTrash(['free'], 3, SLOT_TRASH.keepMs)).toHaveLength(1);
    expect(listTrash(['free'], 3, SLOT_TRASH.keepMs + 1)).toHaveLength(0);
    expect(store.size).toBe(1);
  });

  it('keeps running with storage blocked', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked, removeItem: blocked });
    expect(keepInTrash(slot, 0)).toBe(false);
    expect(listTrash(['free'], 3, 0)).toEqual([]);
    expect(restoreTrash(slot)).toBe(false);
  });
});
