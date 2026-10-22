import { describe, expect, it, vi } from 'vitest';
import * as EDU from '../../src/content/edu';
import { EDU_READER } from '../../src/content/edu-reader';
import { EDU_READER_WORLDS } from '../../src/content/edu-reader-worlds';
import { EDU_SPROUT } from '../../src/content/edu-sprout';
import { EDU_SPROUT_WORLDS } from '../../src/content/edu-sprout-worlds';
import { eduApi, type EduBandSet } from '../../src/content/edu-kit';
import type { EduBand } from '../../src/content/types';

// The Learning Grove loads one band at a time, and each band's Atlas and Arcade versions
// only on demand (review 2026-10-21, load size). The parts must say exactly what the joined
// module says, so a slot reads the same lines whichever way its chunks arrived.
const PARTS: Record<EduBand, { core: EduBandSet; worlds: EduBandSet }> = {
  sprout: { core: EDU_SPROUT, worlds: EDU_SPROUT_WORLDS },
  reader: { core: EDU_READER, worlds: EDU_READER_WORLDS },
};
const WORLD = /^(a\d+|pa\d+)-/;

describe('the edu band chunks', () => {
  for (const band of EDU.EDU_BANDS) {
    it(`${band}: the band chunk alone answers every non-Atlas lookup as the full module`, () => {
      const core = eduApi({ [band]: PARTS[band].core });
      const all = EDU.eduScenes(band);
      for (const [id, scene] of all) {
        if (WORLD.test(id)) continue;
        expect(core.eduSceneFor(band, id)).toBe(scene);
        expect([...core.eduGlossary(band, id)]).toEqual([...EDU.eduGlossary(band, id)]);
        for (const l of scene.lessons) expect(core.eduLesson(l.id)).toBe(EDU.eduLesson(l.id));
      }
      for (const q of PARTS[band].core.quests) {
        expect(core.eduQuestTitle(band, q.of)).toBe(EDU.eduQuestTitle(band, q.of));
        for (const step of Object.keys(q.goals))
          expect(core.eduGoal(band, q.of, step)).toBe(EDU.eduGoal(band, q.of, step));
      }
      for (let n = 0; n < 15; n++)
        expect(core.eduChapterText(band, n)).toBe(EDU.eduChapterText(band, n));
      // The other band is not in this chunk.
      const other: EduBand = band === 'sprout' ? 'reader' : 'sprout';
      expect(core.eduSceneFor(other, 'c1-letter')).toBeUndefined();
    });

    it(`${band}: the worlds chunk holds exactly the Atlas and Arcade scenes`, () => {
      const worlds = eduApi({ [band]: PARTS[band].worlds }).eduScenes(band);
      const all = [...EDU.eduScenes(band).keys()];
      expect([...worlds.keys()].sort()).toEqual(all.filter((id) => WORLD.test(id)).sort());
      expect(PARTS[band].worlds.campaign).toHaveLength(0);
    });
  }
});

describe('the band loader', () => {
  it('loads only the asked band, then the other band and the worlds on demand', async () => {
    vi.resetModules();
    const ss = await import('../../src/sim/story-scenes');
    await ss.loadEduScripts(['sprout']);
    expect(ss.eduBandLoaded('sprout')).toBe(true);
    expect(ss.eduBandLoaded('reader')).toBe(false);
    const m = ss.eduContent()!;
    expect(m.eduSceneFor('sprout', 'c1-letter')).toStrictEqual(
      EDU.eduSceneFor('sprout', 'c1-letter'),
    );
    expect(m.eduSceneFor('reader', 'c1-letter')).toBeUndefined();
    // The language questlines come with any band.
    expect(ss.sideStory(EDU.EDU_LANG_QUESTS[0]!.id)).toBeDefined();

    // A lesson from the other band (the grown-up view) starts that band loading.
    const readerLesson = EDU.eduScenes('reader').get('c1-letter')!.lessons[0]!.id;
    expect(m.eduLesson(readerLesson)).toBeUndefined();
    await ss.loadEduScripts(['reader']); // the same load in flight
    expect(ss.eduBandLoaded('reader')).toBe(true);
    expect(ss.eduContent()!.eduLesson(readerLesson)).toStrictEqual(EDU.eduLesson(readerLesson));

    // An Atlas scene's lookup starts its band's worlds chunk.
    const atlasId = [...EDU.eduScenes('sprout').keys()].find((id) => /^a\d+-/.test(id))!;
    expect(ss.eduContent()!.eduSceneFor('sprout', atlasId)).toBeUndefined();
    await vi.waitFor(
      () =>
        expect(ss.eduContent()!.eduSceneFor('sprout', atlasId)).toStrictEqual(
          EDU.eduSceneFor('sprout', atlasId),
        ),
      { timeout: 20_000, interval: 50 },
    );
  }, 60_000);
});
