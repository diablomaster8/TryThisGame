import { afterEach, describe, expect, it, vi } from 'vitest';
import { ATLAS_A15, ATLAS_A15_VARIANTS } from '../../src/content/atlas-a15';
import { ATLAS_A16, ATLAS_A16_VARIANTS } from '../../src/content/atlas-a16';
import { ATLAS_A21, A21_VARIANTS } from '../../src/content/atlas-a21';
import type { Quest } from '../../src/content/types';
import {
  SLOTS_PER_MODE,
  clearSide,
  readGroveSaves,
  readSide,
  sideKey,
  slotKey,
  writeSide,
  SIDE_SAVES,
} from '../../src/platform/storage';
import {
  ATLAS_FESTIVALS,
  festivalsUnlocked,
  lineAct,
  lineAvailable,
  lineNext,
  lineProgress,
  lineSceneDone,
  variantFor,
  type StoryLine,
} from '../../src/sim/atlas';
import {
  arcadeDone,
  atlasDone,
  atlasFlag,
  atlasPagesDone,
  crossSavesFrom,
  longGrassLantern,
  LANTERN_SCENE,
} from '../../src/sim/cross-saves';
import { loseReflection, oldestEternal, reflectEternal } from '../../src/sim/reflection';
import { serialize } from '../../src/sim/save';
import {
  freshAtlas,
  freshLine,
  parseArcade,
  parseAtlas,
  parseMultiverse,
  serializeSide,
  SIDE_SAVE_VERSION,
  type AtlasSave,
  type LineProgress,
} from '../../src/sim/side-saves';
import { applyCommand, createWorld } from '../../src/sim/world';
import { startCampaign } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';

function line(id: string, quests: Quest[], variants: StoryLine['variants']): StoryLine {
  return { id, title: id, quests, variants };
}

/** Play a line to its end the way the shelf does, always taking the first choice. */
function playThrough(l: StoryLine, p: LineProgress, limit = 2000): number {
  let moves = 0;
  for (; moves < limit; moves++) {
    const next = lineNext(l, p);
    if (next.kind === 'finished') break;
    if (next.kind === 'act') lineAct(l, p);
    else lineSceneDone(l, p, next.scene.id, next.scene.choices?.[0]?.id ?? null);
  }
  return moves;
}

/** A Grove save as the game writes it. */
function groveJson(seed: number, change?: (w: World) => void): string {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  change?.(w);
  return serialize(w, 1);
}

function fakeStorage(): Map<string, string> {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
  return store;
}

afterEach(() => vi.unstubAllGlobals());

describe('side saves (canon 21, 29, 30)', () => {
  it('keep keys of their own, apart from every Grove slot', () => {
    const grove = new Set<string>();
    for (const mode of ['free', 'campaign', 'edu'] as const)
      for (let i = 1; i <= SLOTS_PER_MODE; i++) grove.add(slotKey({ mode, index: i }));
    const side = SIDE_SAVES.map(sideKey);
    expect(new Set(side).size).toBe(3);
    for (const k of side) expect(grove.has(k)).toBe(false);
  });

  it('write only their own key, and read the Grove saves but never the Learning Grove', () => {
    const store = fakeStorage();
    store.set(slotKey({ mode: 'free', index: 1 }), 'free-1');
    store.set(slotKey({ mode: 'campaign', index: 3 }), 'camp-3');
    store.set(slotKey({ mode: 'edu', index: 1 }), 'edu-1');
    const before = new Map(store);
    expect(writeSide('atlas', serializeSide(freshAtlas()))).toBe(true);
    expect(readSide('atlas')).not.toBeNull();
    for (const [k, v] of before) expect(store.get(k)).toBe(v);
    expect(readGroveSaves().sort()).toEqual(['camp-3', 'free-1']);
    expect(clearSide('atlas')).toBe(true);
    expect(readSide('atlas')).toBeNull();
  });

  it('survive blocked storage', () => {
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
    expect(readSide('arcade')).toBeNull();
    expect(writeSide('arcade', '{}')).toBe(false);
    expect(clearSide('arcade')).toBe(false);
    expect(readGroveSaves()).toEqual([]);
  });

  it('parse broken, missing and too-new saves as fresh ones, and round-trip', () => {
    expect(parseAtlas(null).pages).toEqual({});
    expect(parseAtlas('not json').pages).toEqual({});
    expect(
      parseArcade(JSON.stringify({ version: SIDE_SAVE_VERSION + 1, carts: { PA1: {} } })).carts,
    ).toEqual({});
    const a: AtlasSave = freshAtlas();
    a.pages.A15 = {
      quests: { 'a15-01': { step: 1, stage: 'act' } },
      flags: { x: 'y' },
      done: false,
    };
    expect(parseAtlas(serializeSide(a))).toEqual(a);
    // A save written before versions existed migrates up to the current version.
    expect(parseAtlas(JSON.stringify({ pages: a.pages })).version).toBe(SIDE_SAVE_VERSION);
  });
});

describe('the Atlas runner', () => {
  const a15 = line('A15', ATLAS_A15, ATLAS_A15_VARIANTS);
  const a2 = line('A16', ATLAS_A16, ATLAS_A16_VARIANTS);

  it('plays a whole page to the end, keeping its flags in its own progress', () => {
    const save = freshAtlas();
    const p = lineProgress(save.pages, 'A15');
    const moves = playThrough(a15, p);
    expect(moves).toBeLessThan(2000);
    expect(p.done).toBe(true);
    expect(Object.keys(p.quests)).toHaveLength(ATLAS_A15.length);
    expect(Object.keys(p.flags).length).toBeGreaterThan(0);
  });

  it('plays pages in any order, each keeping its place', () => {
    const save = freshAtlas();
    const p15 = lineProgress(save.pages, 'A15');
    for (let i = 0; i < 5; i++) {
      const n = lineNext(a15, p15);
      if (n.kind === 'act') lineAct(a15, p15);
      else if (n.kind === 'scene') lineSceneDone(a15, p15, n.scene.id, null);
    }
    const mark = JSON.stringify(p15);
    const p2 = lineProgress(save.pages, 'A16');
    playThrough(a2, p2);
    expect(p2.done).toBe(true);
    expect(JSON.stringify(p15)).toBe(mark);
    playThrough(a15, p15);
    expect(p15.done).toBe(true);
  });

  it('ignores a scene that is not the one due', () => {
    const p = freshLine();
    const before = JSON.stringify(p);
    lineSceneDone(a15, p, 'not-a-scene', null);
    expect(JSON.stringify(p)).toBe(before);
  });

  it('picks the variant that answers a flag', () => {
    const v = ATLAS_A15_VARIANTS.find((s) => s.id === 'a15-14-screen-done-reconciled')!;
    const base = { id: 'a15-14-screen-done', lines: [] };
    const p = freshLine();
    expect(variantFor(a15, p, base)).toBe(base);
    p.flags.someChoice = 'reconciled';
    expect(variantFor(a15, p, base)).toBe(v);
  });

  it('hides teen pages unless Mature content allows them, and keeps the Learning Grove out', () => {
    // A1, A3 and A4 are the teen pages; a stand-in keeps this test on committed scripts.
    const a1 = line(
      'A1',
      ATLAS_A15.map((q) => ({ ...q, audience: 'teen' as const })),
      [],
    );
    const a21 = line('A21', ATLAS_A21, A21_VARIANTS);
    expect(lineAvailable(a21, { matureContent: 'off', learningGrove: false })).toBe(true);
    expect(lineAvailable(a21, { matureContent: 'off', learningGrove: true })).toBe(false);
    expect(lineAvailable(a1, { matureContent: 'off', learningGrove: false })).toBe(false);
    expect(lineAvailable(a1, { matureContent: 'teen', learningGrove: false })).toBe(true);
    expect(lineAvailable(a15, { matureContent: 'off', learningGrove: false })).toBe(true);
    expect(lineAvailable(a1, { matureContent: 'adult', learningGrove: true })).toBe(false);
  });
});

describe('cross-save lookups are read-only', () => {
  function atlasWith(pages: Record<string, Partial<LineProgress>>): string {
    const a = freshAtlas();
    for (const [id, p] of Object.entries(pages)) a.pages[id] = { ...freshLine(), ...p };
    return serializeSide(a);
  }

  it('answer atlasDone, atlasFlag, arcadeDone and longGrassLantern', () => {
    const atlas = atlasWith({
      A15: { done: true, flags: { 'a15-heart': 'kept' } },
      A2: { quests: { 'a02-01': { step: 3, stage: 'finished' } } },
    });
    const arcade = JSON.stringify({
      version: 1,
      carts: { PA2: { quests: {}, flags: {}, done: true } },
    });
    const lit = groveJson(3, (w) => {
      startCampaign(w, []);
      w.campaign!.seen.push(LANTERN_SCENE);
    });
    const x = crossSavesFrom(atlas, arcade, [groveJson(2), lit]);
    expect(atlasDone(x, 'A15')).toBe(true);
    expect(atlasDone(x, 'A2')).toBe(false);
    expect(atlasDone(x, 'a02-01')).toBe(true);
    expect(atlasFlag(x, 'A15', 'a15-heart')).toBe('kept');
    expect(atlasFlag(x, 'A9', 'nothing')).toBeUndefined();
    expect(arcadeDone(x, 'PA2')).toBe(true);
    expect(arcadeDone(x, 'PA1')).toBe(false);
    expect(atlasPagesDone(x)).toEqual(['A15']);
    expect(longGrassLantern(crossSavesFrom(null, null, [groveJson(2)]))).toBe(false);
    expect(longGrassLantern(crossSavesFrom(null, null, ['broken']))).toBe(false);
    // The lantern only reads true once some Hazel's Grove save has seen the dawn scene.
    expect(longGrassLantern(x)).toBe(true);
  });

  it('are frozen, so no lookup can write a save', () => {
    const x = crossSavesFrom(atlasWith({ A15: { done: true } }), null, []);
    expect(Object.isFrozen(x)).toBe(true);
    expect(Object.isFrozen(x.atlas.pages.A15)).toBe(true);
    expect(() => {
      (x.atlas.pages.A15 as LineProgress).done = false;
    }).toThrow();
  });

  it('never change the Grove save they read', () => {
    const store = fakeStorage();
    const json = groveJson(5);
    store.set(slotKey({ mode: 'free', index: 1 }), json);
    const x = crossSavesFrom(readSide('atlas'), readSide('arcade'), readGroveSaves());
    atlasDone(x, 'A1');
    longGrassLantern(x);
    festivalsUnlocked(x);
    oldestEternal(readGroveSaves());
    expect(store.get(slotKey({ mode: 'free', index: 1 }))).toBe(json);
    expect([...store.keys()]).toEqual([slotKey({ mode: 'free', index: 1 })]);
  });
});

describe('festivals unlock by sets of pages', () => {
  it('open with any two lines of a set, and not with one', () => {
    const a = freshAtlas();
    a.pages.A3 = { ...freshLine(), done: true };
    let x = crossSavesFrom(serializeSide(a), null, []);
    expect(festivalsUnlocked(x)).toEqual([]);
    a.pages.A23 = { ...freshLine(), done: true };
    a.pages.A2 = { ...freshLine(), done: true };
    x = crossSavesFrom(serializeSide(a), null, []);
    expect(festivalsUnlocked(x)).toEqual(['remembering']);
    const arcade = {
      version: 1,
      carts: { PA1: { ...freshLine(), done: true }, PA4: { ...freshLine(), done: true } },
    };
    x = crossSavesFrom(serializeSide(a), JSON.stringify(arcade), []);
    expect(festivalsUnlocked(x)).toEqual(['remembering', 'highScore']);
  });

  it('cover every Atlas page in at most one set', () => {
    const seen = new Set<string>();
    for (const f of ATLAS_FESTIVALS)
      for (const id of f.lines) {
        expect(seen.has(id)).toBe(false);
        seen.add(id);
      }
  });

  it('are remembered by the Grove once announced', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'atlasFestival', id: 'voyage' }, []);
    applyCommand(w, { kind: 'atlasFestival', id: 'voyage' }, []);
    expect(w.atlasFestivals).toEqual(['voyage']);
  });
});

describe("E6's reflection (canon 21)", () => {
  function withEternal(seed: number, name: string, ageMs: number): string {
    return groveJson(seed, (w) => {
      const n = w.nubbins[0]!;
      n.name = name;
      n.eternal = 'sun';
      n.ageMs = ageMs;
    });
  }

  it('reflects the oldest living Eternal across Grove saves, into the Multiverse save only', () => {
    const groves = [withEternal(1, 'Young', 1_000), withEternal(2, 'Elder', 9_000), groveJson(3)];
    const copies = [...groves];
    const mv = parseMultiverse(null);
    const r = reflectEternal(mv, groves);
    expect(r?.name).toBe('Elder');
    expect(r?.eternal).toBe('sun');
    expect(mv.reflection).toEqual(r);
    expect(groves).toEqual(copies);
    // Opening E6 again keeps the same reflection.
    expect(reflectEternal(mv, [withEternal(4, 'Newer', 99_000)])?.name).toBe('Elder');
    expect(parseMultiverse(serializeSide(mv)).reflection?.name).toBe('Elder');
  });

  it('is lost only from the Multiverse save, and never made again', () => {
    const groves = [withEternal(1, 'Elder', 9_000)];
    const mv = parseMultiverse(null);
    reflectEternal(mv, groves);
    loseReflection(mv);
    expect(mv.reflection).toBeNull();
    expect(reflectEternal(mv, groves)).toBeNull();
    expect(oldestEternal(groves)?.name).toBe('Elder');
  });

  it('is null when no Grove has an Eternal', () => {
    expect(reflectEternal(parseMultiverse(null), [groveJson(1), 'broken'])).toBeNull();
  });
});

describe('every Atlas page', () => {
  it('loads, has a title and plays to its end', async () => {
    const { loadAtlas } = await import('../../src/sim/atlas');
    const pages = await loadAtlas();
    // Pages join as their scripts land; A11–A21 are the first committed.
    expect(pages.length).toBeGreaterThanOrEqual(11);
    expect(pages.map((p) => p.id)).toContain('A15');
    const save = freshAtlas();
    for (const page of pages) {
      expect(page.title).not.toBe(page.id);
      const p = lineProgress(save.pages, page.id);
      playThrough(page, p);
      expect(p.done, page.id).toBe(true);
    }
  });
});
