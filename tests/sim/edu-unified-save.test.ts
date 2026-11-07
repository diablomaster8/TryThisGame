/**
 * R0726 (KIDS-58): what shipped for the Learning Grove on the unified save. The Learning Grove
 * is the child profile `k1`..`kN` (platform/storage.ts), not a `world.profile` field. A legacy
 * edu save moves into the child profile's slot with its `edu` block untouched, and graduation
 * (`eduToCampaign`, R0727) turns a copy into a campaign save without disturbing the original.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryKv } from '../../src/platform/idb';
import { eduToCampaign } from '../../src/sim/edu-graduate';
import { deserialize, serialize } from '../../src/sim/save';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld, tick } from './campaign-driver';

/** A reader's Learning Grove save with a few minutes of play in it. */
function eduSave(): string {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'eduStart', age: 6, band: 'reader' }, events);
  tick(world, events, 400);
  return serialize(world, 1);
}

let store = new Map<string, string>();
const db = memoryKv();

beforeEach(() => {
  store = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

async function boot() {
  vi.resetModules();
  const idb = await import('../../src/platform/idb');
  idb.setKvBackend(db);
  const storage = await import('../../src/platform/storage');
  await storage.restoreFromMirror();
  return storage;
}

describe('the Learning Grove as a child profile on the unified save (R0726)', () => {
  it('moves a legacy edu save into child profile k1 with the edu block identical', async () => {
    const eduJson = eduSave();
    store.set('grove.save.edu', eduJson);
    const storage = await boot();
    expect(storage.isChildProfile('k1')).toBe(true);
    expect(storage.isChildProfile('p1')).toBe(false);
    expect(storage.profileModes('k1')).toEqual(['edu']);
    expect(storage.profileModes('p1')).not.toContain('edu');
    storage.setSaveSlot({ mode: 'edu', index: 1 });
    expect(storage.profileOf({ mode: 'edu', index: 1 })).toBe('k1');
    expect(storage.slotKey({ mode: 'edu', index: 1 })).toBe('grove.k1.slot.1');
    const moved = deserialize(storage.readSave()!).world;
    const before = deserialize(eduJson).world;
    expect(before.edu).not.toBeNull();
    expect(moved.edu).toEqual(before.edu);
  });

  it('graduates a copy into a campaign save and leaves the child profile slot as it was', async () => {
    store.set('grove.save.edu', eduSave());
    const storage = await boot();
    storage.setSaveSlot({ mode: 'edu', index: 1 });
    const slotBefore = storage.readSave()!;
    const eduBefore = deserialize(slotBefore).world.edu;
    expect(eduBefore).not.toBeNull();

    const graduated = eduToCampaign(slotBefore, 2);
    expect(graduated).not.toBeNull();
    // The campaign save has no learning block (the shipped design: no world.profile field)...
    expect(deserialize(graduated!).world.edu).toBeNull();
    // ...and the child's own slot still holds the identical edu block.
    expect(storage.readSave()).toBe(slotBefore);
    expect(deserialize(storage.readSave()!).world.edu).toEqual(eduBefore);
  });
});
