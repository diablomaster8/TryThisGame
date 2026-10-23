import { describe, expect, it } from 'vitest';
import { SCENE_STAGES } from '../../src/config/scene-stages';
import { STAGE_MARKS } from '../../src/config/stage-marks';
import { CAMPAIGN_SCENES } from '../../src/content/campaign';
import { STORYLINE_BEETLE } from '../../src/content/storyline-beetle';
import { STORYLINE_DAWN, STORYLINE_DUSK } from '../../src/content/storyline-dawndusk';
import { STORYLINE_HUNDRED } from '../../src/content/storyline-hundred';
import { STORYLINE_LOGGED } from '../../src/content/storyline-logged';

const LINES = [
  STORYLINE_HUNDRED,
  STORYLINE_LOGGED,
  STORYLINE_BEETLE,
  STORYLINE_DAWN,
  STORYLINE_DUSK,
];

describe('authored scene stages (campaign graphics C1)', () => {
  const ids = new Set<string>(CAMPAIGN_SCENES.map((s) => s.id));
  for (const sl of LINES)
    for (const c of sl.chapters) {
      ids.add(c.opening.id);
      ids.add(c.closing.id);
      for (const b of c.beats ?? []) ids.add(b.scene.id);
    }
  for (const sl of LINES) for (const s of sl.extra) ids.add(s.id);

  it('names only scenes that exist, and marks that exist', () => {
    const marks = new Set(Object.values(STAGE_MARKS).flatMap((m) => Object.keys(m)));
    for (const [id, st] of Object.entries(SCENE_STAGES)) {
      expect(ids.has(id), id).toBe(true);
      // `floor-*` marks belong to the Hollow Below floor under way (render/floor-marks.ts).
      for (const c of st.cast ?? [])
        expect(marks.has(c.mark) || c.mark.startsWith('floor-'), `${id}: ${c.mark}`).toBe(true);
    }
  });

  it('stages every storyline chapter opening and closing', () => {
    for (const sl of LINES)
      for (const c of sl.chapters) {
        expect(SCENE_STAGES[c.opening.id], c.opening.id).toBeDefined();
        expect(SCENE_STAGES[c.closing.id], c.closing.id).toBeDefined();
      }
  });

  it('stages every beat and every extra scene of the four storylines (H2, N2)', () => {
    for (const sl of LINES) {
      for (const c of sl.chapters)
        for (const b of c.beats ?? []) expect(SCENE_STAGES[b.scene.id], b.scene.id).toBeDefined();
      for (const s of sl.extra) expect(SCENE_STAGES[s.id], s.id).toBeDefined();
    }
  });

  it('stages every Hazel ending scene (N2)', () => {
    for (const s of CAMPAIGN_SCENES.filter((x) => /^end-(?!epi-)/.test(x.id)))
      expect(SCENE_STAGES[s.id]?.shot?.kind, s.id).toBeDefined();
  });

  it("sets Dawn & Dusk's hour by its half (M13)", () => {
    for (const sl of [STORYLINE_DAWN, STORYLINE_DUSK])
      for (const c of sl.chapters)
        for (const s of [c.opening, c.closing])
          expect(SCENE_STAGES[s.id]?.hour).toBe(sl.id === 'dawn' ? 6.5 : 19);
  });
});
