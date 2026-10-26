import { describe, expect, it } from 'vitest';
import type { Scene } from '../../src/config/story';
import {
  lineContext,
  loadArcade,
  loadAtlas,
  variantFor,
  type StoryLine,
} from '../../src/sim/atlas';
import { freshLine, type LineProgress } from '../../src/sim/side-saves';

// Story worlds read the Grove's flags, read-only, and their Grove variants play
// (review 2026-10-18 B, Bug 9).
async function line(id: string): Promise<StoryLine> {
  const all = [...(await loadAtlas()), ...(await loadArcade())];
  return all.find((l) => l.id === id)!;
}

function sceneOf(l: StoryLine, id: string): Scene {
  for (const q of l.quests) {
    if (q.complete.id === id) return q.complete;
    for (const s of q.steps) {
      if (s.scene.id === id) return s.scene;
      if (s.done?.id === id) return s.done;
    }
  }
  throw new Error(`no scene ${id} in ${l.id}`);
}

function progress(flags: LineProgress['flags'] = {}): LineProgress {
  return { ...freshLine(), flags };
}

describe('Grove flags reach the story worlds', () => {
  it('A19-8 plays the slow or grab memory from the Grove', async () => {
    const a19 = await line('A19');
    const hand = sceneOf(a19, 'a19-08-hand');
    expect(variantFor(a19, progress(), hand, { sableFirst: 'slow' }).id).toBe('a19-08-hand-slow');
    expect(variantFor(a19, progress(), hand, { sableFirst: 'grab' }).id).toBe('a19-08-hand-grab');
    expect(variantFor(a19, progress(), hand, {}).id).toBe('a19-08-hand');
  }, 30_000);

  it('A19-18 drops the memory line when sableFirst is unset, on either route', async () => {
    const a19 = await line('A19');
    const done = sceneOf(a19, 'a19-18-complete');
    expect(variantFor(a19, progress(), done, {}).id).toBe('a19-18-complete-unset');
    expect(variantFor(a19, progress({ 'a19-first': 'ran' }), done, {}).id).toBe(
      'a19-18-complete-ran-unset',
    );
    expect(variantFor(a19, progress(), done, { sableFirst: 'slow' }).id).toBe('a19-18-complete');
    expect(variantFor(a19, progress({ 'a19-first': 'ran' }), done, { sableFirst: 'grab' }).id).toBe(
      'a19-18-complete-ran',
    );
  }, 30_000);

  it('a Grove flag named for what it brings picks its variant (Fern, Clank)', async () => {
    const a24 = await line('A24');
    const council = sceneOf(a24, 'a24-02-council-done');
    expect(variantFor(a24, progress(), council, { s8Reunited: true }).id).toBe(
      'a24-02-council-done-fern',
    );
    expect(variantFor(a24, progress(), council, {}).id).toBe('a24-02-council-done');
    const pa5 = await line('PA5');
    const shed = sceneOf(pa5, 'pa5-01-shed');
    expect(variantFor(pa5, progress(), shed, { s21Done: true }).id).toBe('pa5-01-shed-clank');
  }, 30_000);

  it('Arcade Clank and Byte variants replace their host scenes (run-16 fixes)', async () => {
    const pa1 = await line('PA1');
    const shedDone = sceneOf(pa1, 'pa1-01-shed-done');
    expect(variantFor(pa1, progress(), shedDone, { s21Done: true }).id).toBe(
      'pa1-01-shed-done-clank',
    );
    const pa3 = await line('PA3');
    const end = sceneOf(pa3, 'pa3-17-complete');
    expect(variantFor(pa3, progress(), end, { s21Done: true }).id).toBe('pa3-17-complete-clank');
    expect(variantFor(pa3, progress(), end, {}).id).toBe('pa3-17-complete');
    const pa2 = await line('PA2');
    const lunch = sceneOf(pa2, 'pa2-06-complete');
    expect(variantFor(pa2, progress(), lunch, {}).id).toBe('pa2-06-complete-unset');
    expect(variantFor(pa2, progress(), lunch, { s7Done: true }).id).toBe('pa2-06-complete');
  }, 30_000);

  it('PA4 and PA5 memories, candy and Wisp variants are reachable (run-17 fixes)', async () => {
    const pa4 = await line('PA4');
    const shed = sceneOf(pa4, 'pa4-01-shed-done');
    expect(variantFor(pa4, progress(), shed, { wisp: 'sable' }).id).toBe(
      'pa4-01-shed-done-wisp-warm',
    );
    expect(variantFor(pa4, progress(), shed, { wisp: 'spared', s21Done: true }).id).toBe(
      'pa4-01-shed-done-wisp-warm-clank',
    );
    const end = sceneOf(pa4, 'pa4-18-complete');
    expect(variantFor(pa4, progress(), end, { wisp: 'driven' }).id).toBe(
      'pa4-18-complete-wisp-driven',
    );
    const rise = sceneOf(pa4, 'pa4-17-rise');
    expect(variantFor(pa4, progress({ 'pa4-candy': 'candy-left' }), rise).id).toBe(
      'pa4-17-rise-candy-left',
    );
    // A Grove value that happens to read 'left' must not pick the candy variant.
    expect(variantFor(pa4, progress(), rise, { s18: 'left' }).id).toBe('pa4-17-rise');
    // Each friend speaks once in pa4-17-friends, whatever was answered.
    const friends = sceneOf(pa4, 'pa4-17-friends');
    const kept = friends.lines.filter((l) => pa4.lineLive!(friends.id, l, {}));
    expect(kept.length).toBeLessThan(friends.lines.length);

    const pa5 = await line('PA5');
    const photos = sceneOf(pa5, 'pa5-06-complete');
    expect(variantFor(pa5, progress({ 'pa5-memories': 'photohunt' }), photos).id).toBe(
      'pa5-06-complete-photohunt',
    );
    expect(variantFor(pa5, progress({ 'pa5-memories': 'photoroad' }), photos).id).toBe(
      'pa5-06-complete',
    );
    const impa = sceneOf(pa5, 'pa5-15-impa');
    expect(variantFor(pa5, progress({ 'pa5-hunt': 'hunt' }), impa).id).toBe('pa5-15-impa-hunt');
    const q = sceneOf(pa5, 'pa5-18-question');
    expect(variantFor(pa5, progress({ 'pa5-14-told': 'oldman-told' }), q).id).toBe(
      'pa5-18-question-oldman-told',
    );
  }, 30_000);

  it('the context carries the Grove flags read-only, under the line’s own', async () => {
    const a19 = await line('A19');
    const grove = { sableFirst: 'slow' } as const;
    const ctx = lineContext([a19], {}, {}, grove);
    expect(ctx.grove).toEqual({ sableFirst: 'slow' });
    expect(Object.isFrozen(ctx.grove)).toBe(true);
  }, 30_000);
});
