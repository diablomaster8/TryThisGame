import { describe, expect, it } from 'vitest';
import { storyNeeds } from '../../src/story-chunks';

// A Free Grove with no story boots without the story chunks; a Learning Grove loads its own
// band and any band its lessons came from (review 2026-10-21, load size).
describe('what a save needs before play', () => {
  const save = (world: unknown) => JSON.stringify({ version: 1, world });
  it('reads the story and the bands from the stored save', () => {
    expect(storyNeeds(save({ campaign: null, edu: null }))).toEqual({ story: false, bands: [] });
    expect(storyNeeds(save({ campaign: { chapter: 1 } }))?.story).toBe(true);
    expect(
      storyNeeds(
        save({ campaign: null, edu: { band: 'sprout', lessons: { 'reader:x-l1': {} } } }),
      )?.bands.sort(),
    ).toEqual(['reader', 'sprout']);
    expect(
      storyNeeds(save({ edu: { band: 'reader', lessons: { odd: {} } } }))?.bands.sort(),
    ).toEqual(['reader', 'sprout']);
    expect(storyNeeds('not json')).toBeNull();
  });
});
