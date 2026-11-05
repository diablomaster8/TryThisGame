/**
 * Lane C round 13b (R0669): the in-game way into a read-only visit. The picker lists only the
 * other Keepers' saved slots, builds the `?visit=` address, and a visit started from it writes
 * no byte of either Keeper's save; the player's own slot is marked so Leave brings them home.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryKv } from '../../src/platform/idb';
import { startCampaign } from '../../src/sim/campaign';
import { serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';

function hazel(seed: number, at: number): string {
  const w = createWorld(seed, 0);
  startCampaign(w, []);
  return serialize(w, at);
}

let store = new Map<string, string>();
let session = new Map<string, string>();
let db = memoryKv();

beforeEach(() => {
  store = new Map();
  session = new Map();
  db = memoryKv();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  });
  vi.stubGlobal('sessionStorage', {
    getItem: (k: string) => session.get(k) ?? null,
    setItem: (k: string, v: string) => void session.set(k, v),
    removeItem: (k: string) => void session.delete(k),
  });
});
afterEach(() => vi.unstubAllGlobals());

async function boot() {
  vi.resetModules();
  const idb = await import('../../src/platform/idb');
  idb.setKvBackend(db);
  const storage = await import('../../src/platform/storage');
  const profiles = await import('../../src/platform/profiles');
  const picker = await import('../../src/ui/visit-picker');
  await storage.restoreFromMirror();
  return { storage, profiles, picker };
}

describe('the in-game visit picker (R0669, round 13)', () => {
  it('lists only the other Keepers, builds the address, and leaves both saves byte-identical', async () => {
    const mine = hazel(1, 100);
    store.set('grove.save.campaign', mine);
    let s = await boot();
    // One Keeper on the device: nothing to visit.
    expect(s.picker.visitChoices()).toEqual([]);
    s.profiles.addProfile('keeper', 'Robin', '🦊');
    s.storage.setKeeperProfile('p2');
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    const theirs = hazel(6, 600);
    s.storage.writeSave(theirs);
    s.profiles.markLastProfile('p1');
    s = await boot();
    expect(s.storage.keeperProfile()).toBe('p1');
    const choices = s.picker.visitChoices();
    expect(choices.map((c) => [c.profile, c.slot.mode, c.slot.index])).toEqual([
      ['p2', 'campaign', 1],
    ]);
    // The active Keeper never appears in the list.
    expect(choices.some((c) => c.profile === 'p1')).toBe(false);
    expect(s.picker.visitUrl(choices[0]!, '?debug', '/play/')).toBe(
      '/play/?debug=&visit=p2&vslot=campaign%3A1',
    );

    // The tap marks the player's own slot, then the visit reads and writes nothing.
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    expect(s.storage.hasResumeSlot()).toBe(false);
    s.storage.markResumeSlot(s.storage.currentSlot());
    expect(s.storage.hasResumeSlot()).toBe(true);
    const before = new Map(store);
    const dbBefore = new Map(db.data);
    expect(s.storage.beginVisit('p2')).toBe(true);
    // No choices are offered from inside a visit.
    expect(s.picker.visitChoices()).toEqual([]);
    s.storage.setSaveSlot({ mode: 'campaign', index: 1 });
    expect(s.storage.readSave()).toBe(theirs);
    expect(s.storage.writeSave(hazel(6, 9999))).toBe(false);
    s.storage.markResumeSlot({ mode: 'free', index: 1 }); // refused during a visit
    await new Promise((r) => setTimeout(r, 0));
    expect(store).toEqual(before);
    expect(db.data).toEqual(dbBefore);
    s.storage.endVisit();
    // Leave: the player's own slot comes back, both saves as they were.
    expect(s.storage.takeResumeSlot()).toEqual({ mode: 'campaign', index: 1 });
    expect(s.storage.readSave()).toBe(mine);
    s.storage.setKeeperProfile('p2');
    expect(s.storage.readSave()).toBe(theirs);
  });
});
