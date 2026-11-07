import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import {
  lineNext,
  lineSceneDone,
  loadAtlas,
  loadArcade,
  type StoryLine,
} from '../../src/sim/atlas';
import { freshLine } from '../../src/sim/side-saves';
import { registerEduContent, sceneFor } from '../../src/sim/story-scenes';
import { applyCommand, createWorld } from '../../src/sim/world';
import { hasEduPage } from '../../src/ui/atlas';

registerEduContent(EDU);

/** Every scene a line can play: its steps' scenes, their done scenes and each quest's close. */
function sceneIds(line: StoryLine): string[] {
  return line.quests.flatMap((q) => [
    ...q.steps.flatMap((s) => [s.scene.id, ...(s.done ? [s.done.id] : [])]),
    q.complete.id,
  ]);
}

describe('R0687 (KIDS-19) the Atlas in a Learning Grove', () => {
  it('hasEduPage keeps exactly the pages that have a version for the band', async () => {
    const pages = [...(await loadAtlas()), ...(await loadArcade())];
    for (const band of EDU.EDU_BANDS) {
      const expected = pages.filter((l) =>
        l.quests.some((q) => q.steps.some((s) => !!EDU.eduSceneFor(band, s.scene.id))),
      );
      const shown = pages.filter((l) => hasEduPage(l, band));
      expect(shown.map((l) => l.id)).toEqual(expected.map((l) => l.id));
      expect(shown.length).toBeGreaterThan(0);
    }
    // Sprout has Atlas pages and none of Pixel's cartridges but PA1; the reader band has PA1 too.
    const sproutIds = pages.filter((l) => hasEduPage(l, 'sprout')).map((l) => l.id);
    expect(sproutIds.some((id) => /^A\d+$/.test(id))).toBe(true);
    // A page with no version for a band never shows in it (the filter is a real filter).
    const hidden = pages.filter((l) => !hasEduPage(l, 'sprout'));
    expect(hidden.length).toBeGreaterThan(0);
    for (const l of hidden)
      for (const id of sceneIds(l)) expect(EDU.eduSceneFor('sprout', id)).toBeUndefined();
  }, 30_000);

  it('an age-5 slot has a sprout version of the page, and finishing it writes only the side save', async () => {
    const world = createWorld(1, 0);
    applyCommand(world, { kind: 'eduStart', age: 5 }, []);
    expect(world.edu!.band).toBe('sprout');
    const pages = await loadAtlas();
    const page = pages.find((l) => hasEduPage(l, 'sprout'))!;
    const first = lineNext(page, freshLine());
    expect(first.kind).toBe('scene');
    if (first.kind !== 'scene') return;

    const before = JSON.stringify(world);
    const sprout = EDU.eduSceneFor('sprout', first.scene.id);
    expect(sprout).toBeDefined();
    expect(sprout!.lines.length).toBeGreaterThan(0);
    expect(sprout!.lines).not.toEqual(first.scene.lines);
    // The shelf's filter and the scene's end: the page's own progress is the only thing written.
    const progress = freshLine();
    const choice = sprout!.choices?.[0]?.id ?? null;
    lineSceneDone(page, progress, first.scene.id, choice);
    expect(Object.keys(progress.quests).length).toBeGreaterThan(0);
    expect(hasEduPage(page, 'sprout')).toBe(true);
    expect(JSON.stringify(world)).toBe(before);
  }, 30_000);

  // Atlas and Arcade scenes are not in the scene registry, so atlas.ts hands the scene itself in.
  it(
    'sceneFor gives an age-5 slot the sprout lines of an Atlas scene',
    async () => {
      const world = createWorld(1, 0);
      applyCommand(world, { kind: 'eduStart', age: 5 }, []);
      const page = (await loadAtlas()).find((l) => hasEduPage(l, 'sprout'))!;
      const first = lineNext(page, freshLine());
      if (first.kind !== 'scene') throw new Error('no scene');
      const before = JSON.stringify(world);
      const play = sceneFor(world, first.scene.id, undefined, first.scene);
      expect(play?.lines).toEqual(EDU.eduSceneFor('sprout', first.scene.id)!.lines);
      expect(JSON.stringify(world)).toBe(before);
    },
    30_000,
  );
});
