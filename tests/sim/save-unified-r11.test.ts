/**
 * Lane C round 11, the save helper: the unified slots (R0598), side saves per profile and
 * story worlds reading only the slot in play (R0626), 8 Hazel's Grove slots (R0621), room in
 * localStorage (R0623), the whole-profile backup (R0625) and big live saves in IndexedDB
 * (R0668). The rule throughout: nothing is lost.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryKv, setKvBackend } from '../../src/platform/idb';
import {
  clearSide,
  copySlot,
  legacySideKey,
  profileSideKey,
  readSave,
  readSide,
  readSlotJson,
  readStoryWorldSaves,
  setSaveSlot,
  slotKey,
  slotsFor,
  writeSave,
  writeSide,
  writeWorldsRead,
  type SaveMode,
} from '../../src/platform/storage';
import { setLiveSavesOn, parseStub } from '../../src/platform/live-store';
import { setUnifiedOn } from '../../src/platform/unified-keys';
import { lastSaveProblem, resetSaveRoom, archiveAllUnreadable } from '../../src/platform/save-room';
import {
  legacyRemovable,
  MIGRATED_KEY,
  migrateToUnified,
  planUnified,
  unifiedKey,
  type LegacySave,
} from '../../src/platform/migrate-unified';
import {
  backupDiff,
  backupText,
  collectBackup,
  parseBackup,
  restoreBackupExtras,
  restoreBackupSlot,
} from '../../src/platform/profile-backup';
import { crossSavesFrom, LANTERN_SCENE } from '../../src/sim/cross-saves';
import { startCampaign } from '../../src/sim/campaign';
import { deserialize, serialize, worldFingerprint } from '../../src/sim/save';
import { combineEndings, lineOfUnified, shapeOf, unifyWorld } from '../../src/sim/save-unify';
import { createWorld } from '../../src/sim/world';
import { storylineWorld } from './storyline-driver';
import type { World } from '../../src/sim/types';

const DIR = join(__dirname, '..', 'fixtures', 'saves');
const fixture = (f: string): string => readFileSync(join(DIR, f), 'utf8');

/** A v12 save: the v13 fixture before `lines` existed. */
function v12(): string {
  const d = JSON.parse(fixture('v13-fresh.json')) as {
    version: number;
    world: Record<string, unknown>;
  };
  d.version = 12;
  delete d.world.lines;
  return JSON.stringify(d);
}

function hazel(seed: number, at: number, change?: (w: World) => void): string {
  const w = createWorld(seed, 0);
  startCampaign(w, []);
  change?.(w);
  return serialize(w, at);
}

function line(id: string, seed: number, at: number): string {
  return serialize(storylineWorld(id, 'fern', seed).world, at);
}

const free = (seed: number, at: number): string => serialize(createWorld(seed, 0), at);

/** localStorage over a Map, with `length`/`key` and an optional size limit (UTF-16 bytes). */
function fakeStorage(limitBytes = Infinity): Map<string, string> {
  const store = new Map<string, string>();
  const size = (): number => [...store].reduce((s, [k, v]) => s + (k.length + v.length) * 2, 0);
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      const before = store.get(k);
      store.set(k, v);
      if (size() > limitBytes) {
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
  return store;
}

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

let db = memoryKv();
beforeEach(() => {
  db = memoryKv();
  setKvBackend(db);
  resetSaveRoom();
});
afterEach(() => {
  vi.unstubAllGlobals();
  setKvBackend(null);
  setLiveSavesOn(null);
  setSaveSlot({ mode: 'free', index: 1 });
});

describe('stage A: the unified shape, losing nothing (R0598)', () => {
  it('v12, v13 and v14 saves load and come through unify unchanged', () => {
    for (const json of [
      v12(),
      fixture('v13-fresh.json'),
      fixture('v13-played.json'),
      fixture('v14-played.json'),
    ]) {
      const { world, savedAtWallMs } = deserialize(json);
      const unified = unifyWorld(world);
      expect(worldFingerprint(unified)).toBe(worldFingerprint(world));
      const again = deserialize(serialize(unified, savedAtWallMs));
      expect(worldFingerprint(again.world)).toBe(worldFingerprint(world));
    }
  });

  it('a Hazel save is untouched; a separate campaign becomes an unbegun spine plus its line', () => {
    const h = deserialize(hazel(1, 5)).world;
    expect(shapeOf(h)).toBe('hazel');
    expect(worldFingerprint(unifyWorld(h))).toBe(worldFingerprint(h));
    for (const id of ['hundred', 'logged', 'beetle', 'dawn', 'dusk']) {
      const w = deserialize(line(id, 2, 7)).world;
      expect(shapeOf(w)).toBe('line');
      const u = unifyWorld(w);
      expect(u.campaign!.storyline).toBeNull();
      expect(u.campaign!.chapter).toBe(0);
      // The line is the whole old campaign, field for field.
      expect(JSON.stringify(u.lines[id])).toBe(JSON.stringify(w.campaign));
      // Everything else in the world is the same.
      const strip = (x: World): string => worldFingerprint({ ...x, campaign: null, lines: {} });
      expect(strip(u)).toBe(strip(w));
      // It survives a save and a load, and gives back what went in.
      const back = deserialize(serialize(u, 7)).world;
      expect(JSON.stringify(lineOfUnified(back)!.line)).toBe(JSON.stringify(w.campaign));
      // The input was not touched.
      expect(w.campaign!.storyline).toBe(id);
    }
  });

  it('Combine endings copies an ended line and its keepsakes, never the roster', () => {
    const h = deserialize(hazel(1, 5)).world;
    const other = deserialize(line('hundred', 2, 7)).world;
    other.campaign!.ending = 'quiet';
    other.inventory.keepsakes.push('hundred-ribbon');
    const out = combineEndings(h, other);
    expect(out.lines.hundred!.ending).toBe('quiet');
    expect(out.inventory.keepsakes).toContain('hundred-ribbon');
    expect(out.nubbins.map((n) => n.id)).toEqual(h.nubbins.map((n) => n.id));
    // An unfinished line is not copied.
    const open = deserialize(line('logged', 3, 7)).world;
    expect(combineEndings(h, open).lines.logged).toBeUndefined();
  });
});

describe('stage B: legacy saves into unified slots (R0598)', () => {
  const seven = (): LegacySave[] => [
    {
      mode: 'campaign',
      index: 1,
      key: slotKey({ mode: 'campaign', index: 1 }),
      json: hazel(1, 100),
    },
    {
      mode: 'campaign',
      index: 2,
      key: slotKey({ mode: 'campaign', index: 2 }),
      json: hazel(2, 50),
    },
    { mode: 'free', index: 1, key: slotKey({ mode: 'free', index: 1 }), json: free(3, 300) },
    {
      mode: 'hundred',
      index: 1,
      key: slotKey({ mode: 'hundred', index: 1 }),
      json: line('hundred', 4, 400),
    },
    {
      mode: 'logged',
      index: 1,
      key: slotKey({ mode: 'logged', index: 1 }),
      json: line('logged', 5, 200),
    },
    {
      mode: 'beetle',
      index: 1,
      key: slotKey({ mode: 'beetle', index: 1 }),
      json: line('beetle', 6, 250),
    },
    {
      mode: 'dawndusk',
      index: 1,
      key: slotKey({ mode: 'dawndusk', index: 1 }),
      json: line('dawn', 7, 150),
    },
    {
      mode: 'edu',
      index: 2,
      key: slotKey({ mode: 'edu', index: 2 }),
      json: fixture('v14-fresh.json'),
    },
  ];

  it('fills p1 with Hazel first, then the rest newest first; the Learning Grove goes to k1', () => {
    const plan = planUnified(seven());
    expect(plan.p1.map((s) => s?.from ?? null)).toEqual([
      'grove.save.campaign',
      'grove.save.campaign.2',
      'grove.save.hundred',
      'grove.save.v1',
      'grove.save.beetle',
      'grove.save.logged',
      'grove.save.dawndusk',
      null,
    ]);
    expect(plan.k1.map((s) => s?.from ?? null)).toEqual([null, 'grove.save.edu.2', null]);
    expect(plan.older).toEqual([]);
    // Round 12: every slot is the save as it was, byte for byte (a line still plays as one).
    for (const s of [...plan.p1, ...plan.k1]) {
      if (!s) continue;
      const from = seven().find((x) => x.key === s.from)!.json;
      expect(s.json).toBe(from);
      expect(worldFingerprint(deserialize(s.json).world)).toBe(
        worldFingerprint(deserialize(from).world),
      );
    }
  });

  it('a ninth save is listed as older, not dropped; an unreadable one is kept aside', () => {
    const nine = [
      ...seven(),
      { mode: 'campaign' as SaveMode, index: 3, key: 'grove.save.campaign.3', json: hazel(8, 10) },
      { mode: 'free' as SaveMode, index: 2, key: 'grove.save.free.2', json: free(9, 1) },
      { mode: 'free' as SaveMode, index: 3, key: 'grove.save.free.3', json: '{broken' },
    ];
    const plan = planUnified(nine);
    expect(plan.p1.every((s) => s !== null)).toBe(true);
    expect(plan.older).toEqual(['grove.save.free.2']);
    expect(plan.unreadable).toEqual(['grove.save.free.3']);
  });

  it('archives every legacy key first, writes the new slots, and never removes a legacy key', async () => {
    const store = fakeStorage();
    for (const s of seven()) store.set(s.key, s.json);
    store.set('grove.save.campaign.unreadable.1', '{old');
    store.set(legacySideKey('atlas'), '{"atlas":1}');
    const before = new Map(store);
    setUnifiedOn(false);
    expect(await migrateToUnified(1000)).toBe('off');
    setUnifiedOn(null);
    expect(await migrateToUnified(1000, true)).toBe('migrated');
    for (const [k, v] of before) {
      expect(store.get(k)).toBe(v);
      const kept = JSON.parse(db.data.get(`archive\u0000${k}`)!) as { key: string; json: string };
      expect(kept).toMatchObject({ key: k, json: v });
    }
    expect(store.get(unifiedKey('p1', 1))).toBe(before.get('grove.save.campaign'));
    expect(worldFingerprint(deserialize(store.get(unifiedKey('k1', 2))!).world)).toBe(
      worldFingerprint(deserialize(before.get('grove.save.edu.2')!).world),
    );
    expect(store.get(profileSideKey('atlas', 'p1'))).toBe('{"atlas":1}');
    expect(store.has(MIGRATED_KEY)).toBe(true);
    expect(await migrateToUnified(2000, true)).toBe('done-before');
    expect(legacyRemovable(2, true)).toBe(false);
    expect(legacyRemovable(3, false)).toBe(false);
    expect(legacyRemovable(3, true)).toBe(true);
  });

  it('writes nothing when the archive fails', async () => {
    setKvBackend(memoryKv(true));
    const store = fakeStorage();
    for (const s of seven()) store.set(s.key, s.json);
    const before = new Map(store);
    expect(await migrateToUnified(1000, true)).toBe('archive-failed');
    expect(store).toEqual(before);
  });
});

describe('side saves per profile, story worlds read the slot in play (R0626)', () => {
  it('keeps two profiles apart, inherits the old key in p1, and gives a child no Multiverse', () => {
    const store = fakeStorage();
    store.set(legacySideKey('atlas'), 'old-atlas');
    setSaveSlot({ mode: 'campaign', index: 1 });
    expect(readSide('atlas')).toBe('old-atlas');
    expect(writeSide('atlas', 'p1-atlas')).toBe(true);
    setSaveSlot({ mode: 'edu', index: 1 });
    expect(readSide('atlas')).toBeNull();
    expect(writeSide('atlas', 'k1-atlas')).toBe(true);
    expect(writeSide('multiverse', '{}')).toBe(false);
    expect(readSide('multiverse')).toBeNull();
    setSaveSlot({ mode: 'free', index: 2 });
    expect(readSide('atlas')).toBe('p1-atlas');
    expect(store.get(profileSideKey('atlas', 'k1'))).toBe('k1-atlas');
    expect(store.get(legacySideKey('atlas'))).toBe('old-atlas');
    expect(clearSide('atlas')).toBe(true);
    expect(readSide('atlas')).toBeNull();
    expect(store.get(profileSideKey('atlas', 'k1'))).toBe('k1-atlas');
  });

  it('the lantern variant follows only the slot being played', () => {
    const store = fakeStorage();
    const lit = hazel(3, 5, (w) => w.campaign!.seen.push(LANTERN_SCENE));
    store.set(slotKey({ mode: 'campaign', index: 1 }), lit);
    store.set(slotKey({ mode: 'campaign', index: 2 }), hazel(4, 5));
    setSaveSlot({ mode: 'campaign', index: 2 });
    expect(crossSavesFrom(null, null, readStoryWorldSaves()).lanternLit).toBe(false);
    setSaveSlot({ mode: 'campaign', index: 1 });
    expect(crossSavesFrom(null, null, readStoryWorldSaves()).lanternLit).toBe(true);
    setSaveSlot({ mode: 'campaign', index: 2 });
    writeWorldsRead('every');
    expect(crossSavesFrom(null, null, readStoryWorldSaves()).lanternLit).toBe(true);
    setSaveSlot({ mode: 'edu', index: 1 });
    expect(readStoryWorldSaves()).toEqual([]);
  });
});

describe('8 Hazel slots (R0621)', () => {
  it('Hazel has 8 distinct slots, the other modes 3, and Copy reaches slot 8', () => {
    expect(slotsFor('campaign')).toBe(8);
    expect(slotsFor('free')).toBe(3);
    const keys = new Set(
      Array.from({ length: 8 }, (_, i) => slotKey({ mode: 'campaign', index: i + 1 })),
    );
    expect(keys.size).toBe(8);
    const store = fakeStorage();
    store.set(slotKey({ mode: 'campaign', index: 1 }), hazel(1, 9));
    expect(copySlot({ mode: 'campaign', index: 1 }, { mode: 'campaign', index: 8 })).toBe(true);
    expect(store.get('grove.save.campaign.8')).toBe(store.get('grove.save.campaign'));
  });
});

describe('room in localStorage (R0623)', () => {
  it('frees only unreadable copies IndexedDB holds, then retries', async () => {
    const json = free(1, 5);
    const store = fakeStorage(160_000 + 20_000 + json.length * 2 - 1000);
    store.set('grove.save.free.2.unreadable.1', 'x'.repeat(40_000));
    store.set('grove.save.free.3.unreadable.1', 'y'.repeat(40_000));
    setSaveSlot({ mode: 'free', index: 1 });
    // Nothing archived yet: nothing may be freed, so a too-big write reports full.
    store.set('filler', 'z'.repeat(10_000));
    expect(writeSave(json)).toBe(false);
    expect(lastSaveProblem()).toBe('full');
    expect(store.has('grove.save.free.2.unreadable.1')).toBe(true);
    // Once IndexedDB holds them, the same write frees them and succeeds.
    expect(await archiveAllUnreadable()).toBe(2);
    expect(writeSave(json)).toBe(true);
    expect(lastSaveProblem()).toBeNull();
    expect(readSave()).toBe(json);
    expect(db.data.get('unreadable\u0000grove.save.free.2.unreadable.1')).toBe('x'.repeat(40_000));
  });

  it('says blocked, not full, when storage throws something else', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => undefined,
    });
    expect(writeSave('{}')).toBe(false);
    expect(lastSaveProblem()).toBe('blocked');
  });
});

describe('the whole-profile backup (R0625)', () => {
  it('export, clear, restore gives every slot and the Atlas back exactly', async () => {
    const store = fakeStorage();
    const saves: Record<string, string> = {};
    for (let i = 1; i <= 8; i++) saves[slotKey({ mode: 'campaign', index: i })] = hazel(i, i * 10);
    saves[slotKey({ mode: 'hundred', index: 1 })] = line('hundred', 20, 5);
    saves[slotKey({ mode: 'edu', index: 1 })] = fixture('v14-fresh.json');
    for (const [k, v] of Object.entries(saves)) store.set(k, v);
    store.set(profileSideKey('atlas', 'p1'), '{"atlas":"mine"}');
    await db.put('checkpoints', 'campaign:1/c2', saves['grove.save.campaign']!);
    const text = backupText(await collectBackup('p1', 99));
    const p = parseBackup(text)!;
    expect(p.broken).toEqual([]);
    expect(Object.keys(p.backup.slots)).toHaveLength(9);
    // The child's slot is not in the Keeper's backup.
    expect(p.backup.slots['edu:1']).toBeUndefined();
    store.clear();
    db.data.clear();
    const rows = backupDiff(p, () => null);
    expect(rows.every((r) => r.yours === null && r.theirs !== null)).toBe(true);
    for (const r of rows) expect(restoreBackupSlot(p, r.id, null, 100)).toBe(true);
    await restoreBackupExtras(p, 100);
    for (const [k, v] of Object.entries(saves)) {
      if (k.includes('.edu')) continue;
      expect(worldFingerprint(deserialize(store.get(k)!).world)).toBe(
        worldFingerprint(deserialize(v).world),
      );
    }
    expect(store.get(profileSideKey('atlas', 'p1'))).toBe('{"atlas":"mine"}');
    expect(db.data.get('checkpoints\u0000campaign:1/c2')).toBe(saves['grove.save.campaign']);
  });

  it('never overwrites silently: a filled slot is kept in the trash, the slot in play is refused', async () => {
    const store = fakeStorage();
    store.set('grove.save.campaign', hazel(1, 10));
    const p = parseBackup(backupText(await collectBackup('p1', 1)))!;
    const mine = hazel(2, 20);
    store.set('grove.save.campaign', mine);
    expect(backupDiff(p, () => mine)[0]!.same).toBe(false);
    expect(restoreBackupSlot(p, 'campaign:1', 'campaign:1', 30)).toBe(false);
    expect(store.get('grove.save.campaign')).toBe(mine);
    expect(restoreBackupSlot(p, 'campaign:1', null, 30)).toBe(true);
    expect(JSON.parse(store.get('grove.trash.campaign.1')!).json).toBe(mine);
    expect(parseBackup('{"format":"other"}')).toBeNull();
  });
});

describe('big live saves in IndexedDB (R0668)', () => {
  /** A save of about 1 MB: a valid world with a long diary. */
  function bigSave(): string {
    const w = createWorld(5, 0);
    const pad = 'a'.repeat(500);
    const data = JSON.parse(serialize(w, 1234)) as { world: Record<string, unknown> };
    data.world.slotLabel = { name: 'Big' };
    (data.world as { padding?: string[] }).padding = Array.from({ length: 1000 }, () => pad);
    return JSON.stringify(data);
  }

  it('a 1 MB save round-trips and a reload restores it exactly', async () => {
    setLiveSavesOn(true);
    const store = fakeStorage();
    setSaveSlot({ mode: 'campaign', index: 4 });
    const json = bigSave();
    expect(json.length * 2).toBeGreaterThan(1_000_000);
    expect(writeSave(json)).toBe(true);
    expect(readSave()).toBe(json);
    await tick();
    await tick();
    const raw = store.get('grove.save.campaign.4')!;
    expect(parseStub(raw)?.idb).toBe('grove.save.campaign.4');
    expect(raw.length).toBeLessThan(200);
    // A reload: fresh modules, same storage and database.
    vi.resetModules();
    const idb2 = await import('../../src/platform/idb');
    idb2.setKvBackend(db);
    const s2 = await import('../../src/platform/storage');
    s2.setSaveSlot({ mode: 'campaign', index: 4 });
    expect(s2.readSave()).toBe(raw);
    await s2.restoreFromMirror();
    expect(s2.readSave()).toBe(json);
    expect(s2.readSlotJson({ mode: 'campaign', index: 4 })).toBe(json);
  });

  it('keeps the full copy in localStorage when IndexedDB will not take it', async () => {
    setLiveSavesOn(true);
    setKvBackend(memoryKv(true));
    const store = fakeStorage();
    setSaveSlot({ mode: 'campaign', index: 5 });
    const json = bigSave();
    expect(writeSave(json)).toBe(true);
    await tick();
    await tick();
    expect(store.get('grove.save.campaign.5')).toBe(json);
  });

  it('a smaller save afterwards replaces the pointer, and the flag off changes nothing', async () => {
    setLiveSavesOn(true);
    const store = fakeStorage();
    setSaveSlot({ mode: 'campaign', index: 6 });
    writeSave(bigSave());
    const small = free(2, 3);
    writeSave(small);
    await tick();
    await tick();
    expect(store.get('grove.save.campaign.6')).toBe(small);
    expect(readSlotJson({ mode: 'campaign', index: 6 })).toBe(small);
    setLiveSavesOn(false);
    const big = bigSave();
    writeSave(big);
    expect(store.get('grove.save.campaign.6')).toBe(big);
  });
});
