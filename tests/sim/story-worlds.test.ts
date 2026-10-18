/**
 * The story worlds that ship beside the Atlas: Pixel's cartridges, the Multiverse and
 * Neopia. Each loads as its own chunk, plays to its end in its own side save, and never
 * writes the Grove (canon 21): the last block runs every world's quests against a frozen
 * Grove save and checks it is unchanged.
 */
import { describe, expect, it } from 'vitest';
import {
  lineAct,
  lineAvailable,
  lineClosed,
  lineContext,
  lineNext,
  lineProgress,
  lineSceneDone,
  loadArcade,
  loadAtlas,
  loadMultiverse,
  loadNeopia,
  type StoryLine,
} from '../../src/sim/atlas';
import { REFLECTION_FLAG } from '../../src/sim/multiverse-rules';
import { serialize } from '../../src/sim/save';
import { freshLine, type LineProgress } from '../../src/sim/side-saves';
import { registerSideStories, sideStory } from '../../src/sim/story-scenes';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { createWorld } from '../../src/sim/world';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';

/** A whole world played through; the CI runner is slower than a desk machine. */
const PLAY_MS = 30_000;

type Pick = (sceneId: string, choices: string[]) => string | null;
const first: Pick = (_s, choices) => choices[0] ?? null;

/**
 * Play every line of one side save the way the shelf does, round and round, until no line
 * can move (the endgames wait for the lines they need). Returns the save's progress.
 */
function playSave(
  lines: StoryLine[],
  pick: Pick = first,
  extra: Record<string, boolean> = {},
): Record<string, LineProgress> {
  const progress: Record<string, LineProgress> = {};
  for (let moved = true, guard = 0; moved && guard < 200_000;) {
    moved = false;
    for (const line of lines) {
      const p = lineProgress(progress, line.id);
      for (let n = 0; n < 5000; n++, guard++) {
        const ctx = lineContext(lines, progress, extra);
        const next = lineNext(line, p, ctx);
        if (next.kind === 'finished' || next.kind === 'waiting') break;
        moved = true;
        if (next.kind === 'act') lineAct(line, p, ctx);
        else {
          const ids = (next.scene.choices ?? []).map((c) => c.id);
          lineSceneDone(line, p, next.scene.id, pick(next.scene.id, ids), ctx);
        }
      }
    }
  }
  return progress;
}

/** Every scene id a line would show, in order, with its choices, from one play. */
function sceneLog(lines: StoryLine[], pick: Pick, extra: Record<string, boolean> = {}) {
  const shown: Array<{ id: string; choices: string[] }> = [];
  playSave(
    lines,
    (id, choices) => {
      shown.push({ id, choices });
      return pick(id, choices);
    },
    extra,
  );
  return shown;
}

describe('Pixel’s cabinet', () => {
  it(
    'holds all five cartridges, each playing to its end in the Arcade save',
    async () => {
      const carts = await loadArcade();
      expect(carts.map((c) => c.id)).toEqual(['PA1', 'PA2', 'PA3', 'PA4', 'PA5']);
      const progress = playSave(carts);
      for (const c of carts) {
        expect(c.title).not.toBe(c.id);
        expect(progress[c.id]!.done, c.id).toBe(true);
        expect(progress[c.id]!.rewards.length, c.id).toBeGreaterThan(0);
      }
      expect(lineAvailable(carts[0]!, { matureContent: 'off', learningGrove: false })).toBe(true);
    },
    PLAY_MS,
  );
});

describe('the Multiverse', () => {
  it('is adult throughout, so only Mature content 18+ shows it', async () => {
    const lines = await loadMultiverse();
    for (const l of lines) {
      expect(lineAvailable(l, { matureContent: 'teen', learningGrove: false }), l.id).toBe(false);
      expect(lineAvailable(l, { matureContent: 'adult', learningGrove: false }), l.id).toBe(true);
      expect(lineAvailable(l, { matureContent: 'adult', learningGrove: true }), l.id).toBe(false);
    }
  });

  it(
    'plays every line and all six endgames to the end',
    async () => {
      const lines = await loadMultiverse();
      const progress = playSave(lines);
      for (const l of lines) expect(progress[l.id]!.done, l.id).toBe(true);
      expect(progress.E!.flags['mv-complete']).toBe(true);
    },
    PLAY_MS,
  );

  it('holds the endgames until the lines they need are finished', async () => {
    const lines = await loadMultiverse();
    const e = lines.find((l) => l.id === 'E')!;
    const progress: Record<string, LineProgress> = {};
    expect(lineNext(e, lineProgress(progress, 'E'), lineContext(lines, progress)).kind).toBe(
      'waiting',
    );
  });

  it(
    'plays one Civil War path only, and E6 offers the wish and the Eternal only when earned',
    async () => {
      const lines = await loadMultiverse();
      const reg = sceneLog(lines, (id, c) =>
        id === 'mv-e1-act' ? 'registration' : (c[0] ?? null),
      );
      const ids = reg.map((s) => s.id);
      expect(
        ids.some((i) => i.startsWith('mv-e1-unmask')),
        'mv-e1-unmask',
      ).toBe(true);
      expect(
        ids.some((i) => i.startsWith('mv-e1-safehouse')),
        'mv-e1-safehouse',
      ).toBe(false);
      expect(
        ids.some((i) => i.startsWith('mv-e6-tony')),
        'mv-e6-tony',
      ).toBe(true);
      expect(
        ids.some((i) => i.startsWith('mv-e6-steve')),
        'mv-e6-steve',
      ).toBe(false);
      const core = reg.find((s) => s.id === 'mv-e6-corescene')!;
      expect(core.choices).toEqual(['trap']);
      expect(
        ids.some((i) => i.startsWith('mv-e6-endtrap')),
        'mv-e6-endtrap',
      ).toBe(true);
      expect(
        ids.some((i) => i.startsWith('mv-e6-endwish')),
        'mv-e6-endwish',
      ).toBe(false);

      const res = sceneLog(
        lines,
        (id, c) => {
          if (id === 'mv-e1-act') return c.find((x) => x !== 'registration') ?? null;
          if (c.includes('save') && c.includes('spend')) return 'save';
          if (id === 'mv-e6-corescene') return 'eternal';
          return c[0] ?? null;
        },
        { [REFLECTION_FLAG]: true },
      );
      const rids = res.map((s) => s.id);
      expect(
        rids.some((i) => i.startsWith('mv-e1-safehouse')),
        'mv-e1-safehouse',
      ).toBe(true);
      expect(
        rids.some((i) => i.startsWith('mv-e1-unmask')),
        'mv-e1-unmask',
      ).toBe(false);
      expect(res.find((s) => s.id === 'mv-e6-corescene')!.choices.sort()).toEqual(
        ['eternal', 'trap', 'wish'].sort(),
      );
      expect(
        rids.some((i) => i.startsWith('mv-e6-endeternal')),
        'mv-e6-endeternal',
      ).toBe(true);
      expect(
        rids.some((i) => i.startsWith('mv-e6-endtrap')),
        'mv-e6-endtrap',
      ).toBe(false);
    },
    PLAY_MS,
  );
});

describe('Neopia', () => {
  it(
    'plays its plots and every quest line, each in the Neopia save',
    async () => {
      const lines = await loadNeopia();
      expect(lines.map((l) => l.id)).toContain('NP');
      const quests = lines.flatMap((l) => l.quests.map((q) => q.code));
      expect(new Set(quests).size).toBe(13 + 32);
      const progress = playSave(lines.filter((l) => l.id !== 'NQ-jhudora'));
      for (const l of lines.filter((x) => x.id !== 'NQ-jhudora'))
        expect(progress[l.id]!.done, l.id).toBe(true);
      const jhudora = lines.find((l) => l.id === 'NQ-jhudora')!;
      playSave([jhudora]);
      const all = { ...progress, 'NQ-jhudora': freshLine() };
      expect(lineClosed(jhudora, all['NQ-jhudora'], lineContext(lines, all))).toBe(true);
    },
    PLAY_MS,
  );

  it('closes the rival faerie chain once one is begun, never one already begun', async () => {
    const lines = await loadNeopia();
    const illusen = lines.find((l) => l.id === 'NQ-illusen')!;
    const jhudora = lines.find((l) => l.id === 'NQ-jhudora')!;
    const progress: Record<string, LineProgress> = {};
    const ctx = () => lineContext(lines, progress);
    expect(lineClosed(jhudora, undefined, ctx())).toBe(false);
    Object.assign(progress, playSave([illusen]));
    expect(progress['NQ-illusen']!.flags['neo-side-illusen']).toBe(true);
    expect(lineClosed(jhudora, progress['NQ-jhudora'], ctx())).toBe(true);
    expect(lineClosed(illusen, progress['NQ-illusen'], ctx())).toBe(false);
  });

  it('keeps every reward in Neopia: no blessing, recipe or decor names a Grove effect', async () => {
    const lines = await loadNeopia();
    const groveEffect =
      /\bGrove\b|Nubbin’s egg|karate dojo|Collection book|cottage|for the pet you choose/;
    for (const q of lines.flatMap((l) => l.quests))
      for (const r of q.rewards) expect(r.description, r.id).not.toMatch(groveEffect);
  });
});

describe('no story world writes the Grove (canon 21)', () => {
  function deepFreeze<T>(value: T): T {
    if (value && typeof value === 'object') {
      for (const v of Object.values(value as Record<string, unknown>)) deepFreeze(v);
      Object.freeze(value);
    }
    return value;
  }

  it(
    'runs every story-world quest against a frozen Grove save and finds it unchanged',
    async () => {
      const world = createWorld(7, 0);
      const events: SimEvent[] = [];
      for (const n of world.nubbins) hatch(n, events, 0);
      const before = serialize(world, 1);
      deepFreeze(world);
      registerSideStories(SIDE_STORY_CONTENT);
      const worlds: Array<[string, StoryLine[]]> = [
        ['atlas', await loadAtlas()],
        ['arcade', await loadArcade()],
        ['multiverse', await loadMultiverse()],
        ['neopia', await loadNeopia()],
      ];
      for (const [name, lines] of worlds) {
        const progress = playSave(lines);
        for (const l of lines)
          expect(progress[l.id]!.done || l.closed !== undefined, l.id).toBe(true);
        // None of these quests is in the Grove's own registry, so the Grove engine can never
        // grant their rewards or set their flags in a Grove save.
        for (const q of lines.flatMap((l) => l.quests))
          expect(sideStory(q.id), `${name} ${q.id}`).toBeUndefined();
      }
      expect(serialize(world, 1)).toBe(before);
    },
    PLAY_MS,
  );
});
