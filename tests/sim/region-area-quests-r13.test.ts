/**
 * R0650 (CAMP-58): a questline's chapters sit in the line's areas, and the map's region page
 * groups them by area with the current chapter marked.
 */
import { describe, expect, it } from 'vitest';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import { storylineRule } from '../../src/sim/storyline-rules';
import { registerStorylines, storylines } from '../../src/sim/story-scenes';
import { chapterAreaGroups } from '../../src/ui/map-regions';

registerStorylines(STORYLINE_CONTENT);

describe('region pages list quests per area (R0650)', () => {
  it('every chapter area is an area its line has', () => {
    for (const s of storylines()) {
      const areas = storylineRule(s.id)?.areas ?? [];
      for (const ch of s.chapters)
        if (ch.area) expect(areas, `${s.id} ch ${ch.n}`).toContain(ch.area);
    }
  });

  it('the Hundred Days and Logged In place their chapters; the others have no areas', () => {
    const placed = (id: string) =>
      storylines()
        .find((s) => s.id === id)!
        .chapters.filter((c) => c.area).length;
    expect(placed('hundred')).toBeGreaterThanOrEqual(8);
    expect(placed('logged')).toBeGreaterThanOrEqual(5);
    expect(placed('beetle')).toBe(0);
  });

  it('groups by area in the line order, marks the current chapter, and keeps "anywhere" last', () => {
    const hundred = storylines().find((s) => s.id === 'hundred')!;
    const areas = storylineRule('hundred')!.areas;
    const groups = chapterAreaGroups(hundred.chapters, 4, areas);
    expect(groups.map((g) => g.area)).toEqual([
      'meadow',
      'shore',
      'cave',
      'mountain',
      'mire',
      'mill',
    ]);
    const shore = groups.find((g) => g.area === 'shore')!;
    expect(shore.rows).toEqual([{ n: 4, title: 'The Shore', state: 'now' }]);
    expect(groups.find((g) => g.area === 'meadow')!.rows.map((r) => r.state)).toEqual([
      'done',
      'done',
      'done',
      'later',
      'later',
    ]);
    const logged = storylines().find((s) => s.id === 'logged')!;
    const lg = chapterAreaGroups(logged.chapters, 2, storylineRule('logged')!.areas);
    expect(lg.at(-1)!.area).toBeNull();
    expect(lg.at(-1)!.rows.map((r) => r.n)).toEqual([6]);
  });
});
