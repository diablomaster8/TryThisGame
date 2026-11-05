/**
 * Lane C round 12, agent A: the game plays the unified slots (R0598 CAMP-05), with the one-time
 * move at boot, the catch-up copy, step 8 (legacy keys go only after 3 loads and with the
 * archive), Keeper profiles with their own slots (R0653), a read-only visit (R0669), storage
 * filled to quota (R0623) and big saves in IndexedDB on by default (R0668). Every test boots
 * fresh modules over the same fake localStorage and IndexedDB, as a reload would.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryKv } from '../../src/platform/idb';
import { startCampaign } from '../../src/sim/campaign';
import { deserialize, serialize, worldFingerprint } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';
import { storylineWorld } from './storyline-driver';

const DIR = join(__dirname, '..', 'fixtures', 'saves');
const fixture = (f: string): string => readFileSync(join(DIR, f), 'utf8');

function hazel(seed: number, at: number): string {
  const w = createWorld(seed, 0);
  startCampaign(w, []);
  return serialize(w, at);
}
const line = (id: string, seed: number, at: number): string =>
  serialize(storylineWorld(id, 'fern', seed).world, at);
const free = (seed: number, at: number): string => serialize(createWorld(seed, 0), at);

/** One legacy save per mode: the 7 modes of the old title. */
const SEVEN: Record<string, string> = {
  'grove.save.campaign': hazel(1, 100),
  'grove.save.v1': free(3, 300),
  'grove.save.edu': fixture('v15-fresh.json'),
  'grove.save.hundred': line('hundred', 4, 400),
  'grove.save.logged': line('logged', 5, 200),
  'grove.save.beetle': line('beetle', 6, 250),
  'grove.save.dawndusk': line('dawn', 7, 150),
};

let store = new Map<string, string>();
let db = memoryKv();
let limit = Infinity;

function fakeStorage(): void {
  const size = (): number => [...store].reduce((s, [k, v]) => s + (k.length + v.length) * 2, 0);
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      const before = store.get(k);
      store.set(k, v);
      if (size() > limit) {
        if (before === undefined) store.delete(k);
        else store.set(k, before);
        const e = new Error('full');
        e.name = 'QuotaExceededError';
        throw e;
      }
    },
    removeItem: (k: string) => void store.delete(k),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  });
}

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

/** A page load: fresh modules, the same storage and database, then the boot run. */
async function boot(run = true) {
  vi.resetModules();
  const idb = await import('../../src/platform/idb');
  idb.setKvBackend(db);
  const storage = await import('../../src/platform/storage');
  const keys = await import('../../src/platform/unified-keys');
  const profiles = await import('../../src/platform/profiles');
  const room = await import('../../src/platform/save-room');
  if (run) await storage.restoreFromMirror();
  return { storage, keys, profiles, room };
}

beforeEach(() => {
  store = new Map();
  db = memoryKv();
  limit = Infinity;
  fakeStorage();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

const MODE_OF: Record<string, { mode: string; index: number }> = {
  'grove.save.campaign': { mode: 'campaign', index: 1 },
  'grove.save.v1': { mode: 'free', index: 1 },
  'grove.save.edu': { mode: 'edu', index: 1 },
  'grove.save.hundred': { mode: 'hundred', index: 1 },
  'grove.save.logged': { mode: 'logged', index: 1 },
  'grove.save.beetle': { mode: 'beetle', index: 1 },
  'grove.save.dawndusk': { mode: 'dawndusk', index: 1 },
};

describe('the game plays the unified slots (R0598)', () => {
  it('moves all 7 modes at boot, each loading byte for byte, the archive holding them all', async () => {
    for (const [k, v] of Object.entries(SEVEN)) store.set(k, v);
    const { storage } = await boot();
    for (const [k, v] of Object.entries(SEVEN)) {
      const slot = MODE_OF[k] as Parameters<typeof storage.setSaveSlot>[0];
      storage.setSaveSlot(slot);
      expect(storage.slotKey(slot)).toMatch(/^grove\.(p1|k1)\.slot\.\d$/);
      expect(storage.readSave()).toBe(v);
      expect(worldFingerprint(deserialize(storage.readSave()!).world)).toBe(
        worldFingerprint(deserialize(v).world),
      );
      // Copy first: the legacy key is still there, and the archive has its text.
      expect(store.get(k)).toBe(v);
      expect(JSON.parse(db.data.get(`archive\u0000${k}`)!).json).toBe(v);
    }
    expect(store.get('grove.k1.slot.1')).toBe(SEVEN['grove.save.edu']);
  });

  it('writes go to the unified slot, and a reload lands on the same slots', async () => {
    for (const [k, v] of Object.entries(SEVEN)) store.set(k, v);
    let { storage } = await boot();
    storage.setSaveSlot({ mode: 'hundred', index: 1 });
    const key = storage.slotKey({ mode: 'hundred', index: 1 });
    const next = line('hundred', 4, 900);
    expect(storage.writeSave(next)).toBe(true);
    expect(store.get(key)).toBe(next);
    expect(store.get('grove.save.hundred')).toBe(SEVEN['grove.save.hundred']);
    // A new save in an empty slot claims the first free unified slot.
    storage.setSaveSlot({ mode: 'free', index: 2 });
    const fresh = free(11, 950);
    expect(storage.writeSave(fresh)).toBe(true);
    const freeKey = storage.slotKey({ mode: 'free', index: 2 });
    expect(freeKey).toMatch(/^grove\.p1\.slot\.\d$/);
    ({ storage } = await boot());
    expect(storage.slotKey({ mode: 'hundred', index: 1 })).toBe(key);
    expect(storage.slotKey({ mode: 'free', index: 2 })).toBe(freeKey);
    storage.setSaveSlot({ mode: 'hundred', index: 1 });
    expect(storage.readSave()).toBe(next);
    storage.setSaveSlot({ mode: 'free', index: 2 });
    expect(storage.readSave()).toBe(fresh);
  });

  it('nine saves and more: the overflow stays in its legacy key and is never removed', async () => {
    for (const [k, v] of Object.entries(SEVEN)) store.set(k, v);
    store.set('grove.save.campaign.2', hazel(8, 90));
    store.set('grove.save.campaign.3', hazel(9, 80));
    store.set('grove.save.free.2', free(10, 1));
    const before = new Map(store);
    const { storage, keys } = await boot();
    const marker = JSON.parse(store.get(keys.MIGRATED_KEY)!) as { older: string[] };
    expect(marker.older).toEqual(['grove.save.free.2']);
    // The older save still plays from where it always was.
    storage.setSaveSlot({ mode: 'free', index: 2 });
    expect(storage.slotKey({ mode: 'free', index: 2 })).toBe('grove.save.free.2');
    expect(storage.readSave()).toBe(before.get('grove.save.free.2'));
    for (let i = 0; i < 4; i++) {
      const s = await boot();
      for (const k of Object.keys(MODE_OF)) {
        s.storage.setSaveSlot(MODE_OF[k] as Parameters<typeof s.storage.setSaveSlot>[0]);
        expect(s.storage.readSave()).toBe(before.get(k));
        s.storage.noteSlotLoaded();
      }
    }
    // Step 8 ran: the moved legacy slot keys went, the overflow and the archive stayed.
    await boot();
    for (const k of Object.keys(MODE_OF)) expect(store.has(k)).toBe(false);
    expect(store.get('grove.save.free.2')).toBe(before.get('grove.save.free.2'));
    for (const [k, v] of before)
      if (k.startsWith('grove.save.'))
        expect(JSON.parse(db.data.get(`archive\u0000${k}`)!).json).toBe(v);
    // And every slot still loads its own save.
    const s = await boot();
    for (const k of Object.keys(MODE_OF)) {
      s.storage.setSaveSlot(MODE_OF[k] as Parameters<typeof s.storage.setSaveSlot>[0]);
      expect(s.storage.readSave()).toBe(before.get(k));
    }
  });

  it('step 8 waits for 3 loads of that slot', async () => {
    store.set('grove.save.campaign', SEVEN['grove.save.campaign']!);
    let s = await boot();
    for (let i = 0; i < 2; i++) {
      s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
      s.storage.noteSlotLoaded();
      s = await boot();
    }
    expect(store.has('grove.save.campaign')).toBe(true);
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    s.storage.noteSlotLoaded();
    await boot();
    expect(store.has('grove.save.campaign')).toBe(false);
  });

  it('never moves or removes anything when the archive write fails', async () => {
    for (const [k, v] of Object.entries(SEVEN)) store.set(k, v);
    db = memoryKv(true);
    const before = new Map(store);
    for (let i = 0; i < 4; i++) {
      const { storage, keys } = await boot();
      expect(keys.unifiedActive()).toBe(false);
      storage.setSaveSlot({ mode: 'campaign', index: 1 });
      expect(storage.slotKey({ mode: 'campaign', index: 1 })).toBe('grove.save.campaign');
      storage.noteSlotLoaded();
    }
    // Only the slot index (a cache) was written; every save is where it was.
    for (const [k, v] of before) expect(store.get(k)).toBe(v);
    expect([...store.keys()].some((k) => /^grove\.[pk]1\./.test(k))).toBe(false);
  });

  it('an old tab writing the legacy key after the move is caught up; an erased slot stays erased', async () => {
    store.set('grove.save.campaign', hazel(1, 100));
    store.set('grove.save.v1', free(3, 300));
    let { storage } = await boot();
    const newer = hazel(1, 5000);
    store.set('grove.save.campaign', newer);
    storage.clearSlot({ mode: 'free', index: 1 });
    ({ storage } = await boot());
    storage.setSaveSlot({ mode: 'campaign', index: 1 });
    expect(storage.readSave()).toBe(newer);
    storage.setSaveSlot({ mode: 'free', index: 1 });
    expect(storage.readSave()).toBeNull();
  });

  it('the kill switch goes back to the legacy keys', async () => {
    store.set('grove.save.campaign', SEVEN['grove.save.campaign']!);
    await boot();
    store.set('grove.unified.off', '1');
    const { storage, keys } = await boot();
    expect(keys.unifiedActive()).toBe(false);
    expect(storage.slotKey({ mode: 'campaign', index: 1 })).toBe('grove.save.campaign');
  });

  it('a big legacy save behind an IndexedDB pointer is archived and copied in full', async () => {
    const big = JSON.parse(hazel(2, 77)) as { world: Record<string, unknown> };
    (big.world as { padding?: string }).padding = 'x'.repeat(150_000);
    const json = JSON.stringify(big);
    await db.put('live', 'grove.save.campaign', json);
    store.set(
      'grove.save.campaign',
      JSON.stringify({ idb: 'grove.save.campaign', savedAtWallMs: 77, bytes: json.length * 2 }),
    );
    const { storage } = await boot();
    storage.setSaveSlot({ mode: 'campaign', index: 1 });
    expect(storage.readSave()).toBe(json);
    expect(JSON.parse(db.data.get('archive\u0000grove.save.campaign')!).json).toBe(json);
  });
});

describe('Keeper profiles with their own slots (R0653)', () => {
  it('a second Keeper writes its own unified slots, ids and side saves; p1 is untouched', async () => {
    store.set('grove.save.campaign', SEVEN['grove.save.campaign']!);
    const { storage, profiles } = await boot();
    const p2 = profiles.addProfile('keeper', 'Robin', '🦊')!;
    expect(p2.id).toBe('p2');
    storage.setKeeperProfile('p2');
    const slot = { mode: 'campaign' as const, index: 1 };
    expect(storage.hasSave(slot)).toBe(false);
    storage.setSaveSlot(slot);
    const mine = hazel(5, 500);
    expect(storage.writeSave(mine)).toBe(true);
    expect(store.get('grove.p2.slot.1')).toBe(mine);
    expect(storage.slotId(slot)).toBe('p2/campaign:1');
    expect(storage.readSlotIndex().slots['p2/campaign:1']).toBeDefined();
    storage.writeSide('atlas', '{"a":2}');
    expect(store.get('grove.side.atlas.p2')).toBe('{"a":2}');
    storage.setKeeperProfile('p1');
    expect(storage.readSlotJson(slot)).toBe(SEVEN['grove.save.campaign']);
    expect(storage.readSlotIndex().slots['campaign:1']).toBeDefined();
    // Reload: the Keeper played last comes back with their own slots.
    profiles.markLastProfile('p2');
    const again = await boot();
    expect(again.storage.keeperProfile()).toBe('p2');
    expect(again.storage.readSlotJson(slot)).toBe(mine);
    // Delete and restore inside the window.
    again.storage.setKeeperProfile('p1');
    expect(await again.profiles.deleteProfile('p2', 1000)).toBe(true);
    expect(store.has('grove.p2.slot.1')).toBe(false);
    expect(await again.profiles.restoreProfile('p2', 2000)).toBe(true);
    again.storage.setKeeperProfile('p2');
    expect(again.storage.readSlotJson(slot)).toBe(mine);
  });
});

describe('a read-only visit (R0669)', () => {
  it('reads the other Keeper and changes no byte of storage', async () => {
    store.set('grove.save.campaign', SEVEN['grove.save.campaign']!);
    let s = await boot();
    s.profiles.addProfile('keeper', 'Robin', '🦊');
    s.storage.setKeeperProfile('p2');
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    const theirs = hazel(6, 600);
    s.storage.writeSave(theirs);
    s.profiles.markLastProfile('p1');
    s = await boot();
    expect(s.storage.keeperProfile()).toBe('p1');
    const before = new Map(store);
    const dbBefore = new Map(db.data);
    expect(s.storage.beginVisit('p2')).toBe(true);
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    expect(s.storage.readSave()).toBe(theirs);
    expect(s.storage.noteSlotLoaded()).toBe(0);
    expect(s.storage.writeSave(hazel(6, 9999))).toBe(false);
    expect(s.storage.clearSave()).toBe(false);
    expect(s.storage.clearSlot({ mode: 'campaign', index: 1 })).toBe(false);
    expect(s.storage.writeSide('atlas', '{}')).toBe(false);
    expect(s.storage.labelSlot({ mode: 'campaign', index: 1 }, { name: 'x' })).toBe(false);
    expect(s.storage.backupUnreadable({ mode: 'campaign', index: 1 }, '{bad')).toBe(false);
    await tick();
    expect(store).toEqual(before);
    expect(db.data).toEqual(dbBefore);
    s.storage.endVisit();
    expect(s.storage.readSave()).toBe(SEVEN['grove.save.campaign']);
  });

  it('is refused for your own profile and before the move', async () => {
    const s = await boot(false);
    expect(s.storage.beginVisit('p2')).toBe(false);
    const t = await boot();
    expect(t.storage.beginVisit('p1')).toBe(false);
  });
});

describe('child profiles beyond k1 (R0653, round 13)', () => {
  it('keeps each child profile Learning Grove apart, and reloads onto the one played last', async () => {
    store.set('grove.save.edu', SEVEN['grove.save.edu']!);
    let s = await boot();
    const kid = s.profiles.addProfile('child', 'Wren', '🦊')!;
    expect(kid.id).toBe('k2');
    const slot = { mode: 'edu' as const, index: 1 };
    // k1 plays its own slot; k2 starts empty and gets its own save in a free unified slot.
    expect(s.storage.childProfile()).toBe('k1');
    expect(s.storage.hasSave(slot)).toBe(true);
    s.storage.setChildProfile('k2');
    expect(s.storage.childProfile()).toBe('k2');
    expect(s.storage.hasSave(slot)).toBe(false);
    s.storage.setSaveSlot(slot);
    const mine = fixture('v15-fresh.json').replace(/\s+$/, '');
    expect(s.storage.writeSave(mine)).toBe(true);
    expect(s.storage.hasSave(slot)).toBe(true);
    expect(s.storage.readSlotSummaryOf('k2', slot)).not.toBeNull();
    // k1's save is untouched.
    expect(s.storage.readSlotJson({ mode: 'edu', index: 1 })).toBe(mine);
    s.storage.setChildProfile('k1');
    expect(s.storage.readSlotJson(slot)).toBe(SEVEN['grove.save.edu']);
    // The slot index follows the child in play.
    expect(s.storage.readSlotIndex().slots['edu:1']).toBeDefined();
    // A reload with k2 played last plays k2.
    s.profiles.markLastProfile('k2');
    s = await boot();
    expect(s.storage.childProfile()).toBe('k2');
    expect(s.storage.readSlotJson(slot)).toBe(mine);
  });

  it('refuses another child before the unified slots are on', async () => {
    const s = await boot(false);
    s.storage.setChildProfile('k2');
    expect(s.storage.childProfile()).toBe('k1');
  });

  it('deletes and restores a child profile with its Groves', async () => {
    store.set('grove.save.edu', SEVEN['grove.save.edu']!);
    const s = await boot();
    s.profiles.addProfile('child', 'Wren', '🦊');
    s.storage.setChildProfile('k2');
    s.storage.setSaveSlot({ mode: 'edu', index: 1 });
    const mine = fixture('v15-fresh.json').replace(/\s+$/, '');
    s.storage.writeSave(mine);
    s.storage.setChildProfile('k1');
    expect(await s.profiles.deleteProfile('k2', 1000)).toBe(true);
    expect(s.profiles.listProfiles().map((p) => p.id)).toEqual(['p1', 'k1']);
    expect(await s.profiles.restoreProfile('k2', 2000)).toBe(true);
    expect(s.storage.readSlotSummaryOf('k2', { mode: 'edu', index: 1 })).not.toBeNull();
  });
});

describe('storage filled to quota (R0623)', () => {
  it('frees archived unreadable copies, then saves; when truly full says so without throwing', async () => {
    const s = await boot();
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    expect(s.storage.writeSave(hazel(1, 1))).toBe(true);
    // An unreadable copy, kept in IndexedDB too.
    expect(s.storage.backupUnreadable({ mode: 'campaign', index: 1 }, 'x'.repeat(40_000))).toBe(
      true,
    );
    await s.room.archiveAllUnreadable();
    // Fill localStorage to the brim.
    const used = [...store].reduce((n, [k, v]) => n + (k.length + v.length) * 2, 0);
    limit = used + 1_000;
    let i = 0;
    try {
      for (;;) localStorage.setItem(`filler.${i++}`, 'y'.repeat(100));
    } catch (e) {
      expect((e as Error).name).toBe('QuotaExceededError');
    }
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    // Bigger than before: it fits only once the unreadable copy is freed.
    const save = JSON.stringify({ ...JSON.parse(hazel(1, 2)), pad: 's'.repeat(10_000) });
    expect(s.storage.writeSave(save)).toBe(true);
    expect([...store.keys()].some((k) => k.includes('.unreadable.'))).toBe(false);
    expect(store.get(s.storage.slotKey({ mode: 'campaign', index: 1 }))).toBe(save);
    expect(s.room.lastSaveProblem()).toBeNull();
    // Nothing left to free: the write is refused, the old save stays, the HUD is told.
    const bigger = JSON.stringify({ ...JSON.parse(save), pad: 'z'.repeat(60_000) });
    expect(s.storage.writeSave(bigger)).toBe(false);
    expect(s.room.lastSaveProblem()).toBe('full');
    expect(store.get(s.storage.slotKey({ mode: 'campaign', index: 1 }))).toBe(save);
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });
});

describe('big saves in IndexedDB, on by default (R0668)', () => {
  function bigSave(at: number): string {
    const data = JSON.parse(serialize(createWorld(5, 0), at)) as { world: Record<string, unknown> };
    (data.world as { padding?: string[] }).padding = Array.from({ length: 1000 }, () =>
      'a'.repeat(500),
    );
    return JSON.stringify(data);
  }

  it('a 1 MB save round-trips through a reload with the shipped flags', async () => {
    let s = await boot();
    s.storage.setSaveSlot({ mode: 'campaign', index: 2 });
    const json = bigSave(4321);
    expect(json.length * 2).toBeGreaterThan(1_000_000);
    expect(s.storage.writeSave(json)).toBe(true);
    await tick();
    await tick();
    const key = s.storage.slotKey({ mode: 'campaign', index: 2 });
    expect(store.get(key)!.length).toBeLessThan(200);
    s = await boot();
    s.storage.setSaveSlot({ mode: 'campaign', index: 2 });
    expect(s.storage.readSave()).toBe(json);
    expect(worldFingerprint(deserialize(s.storage.readSave()!).world)).toBe(
      worldFingerprint(deserialize(json).world),
    );
  });

  it('the autosave on hide writes the full text at once, so a killed tab keeps it', async () => {
    const s = await boot();
    s.storage.setSaveSlot({ mode: 'campaign', index: 3 });
    vi.stubGlobal('document', { hidden: true });
    const json = bigSave(5555);
    expect(s.storage.writeSave(json)).toBe(true);
    const key = s.storage.slotKey({ mode: 'campaign', index: 3 });
    // Before IndexedDB answers (the tab could die here): the full save is in localStorage.
    expect(store.get(key)).toBe(json);
    await tick();
    await tick();
    expect(store.get(key)!.length).toBeLessThan(200);
  });
});
