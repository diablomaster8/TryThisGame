import { describe, expect, it } from 'vitest';
import { dressItems } from '../../src/render/dress-d-rules';
import { startCampaign } from '../../src/sim/campaign';
import { createWorld } from '../../src/sim/world';

/** R0630: the doors to the story worlds, as props (render/story-doors.ts). */
const keys = (w: ReturnType<typeof createWorld>, dark = 0) =>
  dressItems(w, {}, dark)
    .filter((i) => i.key.startsWith('door-'))
    .map((i) => i.key);

describe('story world doors (R0630)', () => {
  it('stands the Atlas and the rainbow gate in the Free Grove; the rift needs 18+ and night', () => {
    const w = createWorld(1, 0);
    w.location = 'grove';
    w.keeper.pos = { x: -7, z: 18 };
    expect(keys(w)).toContain('door-atlas');
    expect(keys(w)).not.toContain('door-rift');
    w.settings.matureContent = 'adult';
    w.keeper.pos = { x: -2, z: -2 };
    expect(keys(w, 0.2)).not.toContain('door-rift');
    expect(keys(w, 0.9)).toContain('door-rift');
    expect(keys(w)).toContain('door-gate');
  });

  it("opens the cabinet beside a built workshop after chapter 5 in Hazel's Grove", () => {
    const w = createWorld(1, 0);
    startCampaign(w, []);
    w.campaign!.queue = [];
    w.location = 'grove';
    w.keeper.pos = { x: 0, z: 0 };
    w.placed.push({ id: 'p1', kind: 'workshop', pos: { x: 4, z: 4 } });
    w.campaign!.chapter = 5;
    expect(keys(w)).not.toContain('door-cabinet');
    w.campaign!.chapter = 6;
    expect(keys(w)).toContain('door-cabinet');
    w.edu = null;
  });
});
