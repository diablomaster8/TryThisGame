import { describe, expect, it } from 'vitest';
import { READ3D } from '../../src/config/tuning';
import { CAMPAIGN_SCENES } from '../../src/content/campaign';
import { keepOff } from '../../src/render3d/crowd';
import { hourOf } from '../../src/render3d/staging';

const n = (text: string) => ({ who: 'narrator', text });

describe('story staging in Full 3D', () => {
  it('reads the hour from a scene’s opening narration', () => {
    const s = READ3D.stage;
    expect(hourOf([n('Late afternoon. The light has gone long and yellow.')])).toBe(s.goldenHour);
    expect(hourOf([n('Dusk. The lamps are lit along the path.')])).toBe(s.duskHour);
    expect(hourOf([n('It is night, and the pond is black.')])).toBe(s.nightHour);
    expect(hourOf([n('Dawn comes grey over the hill.')])).toBe(s.morningHour);
    expect(hourOf([n('The kettle is cold.')])).toBeNull();
  });

  it('ignores spoken lines and narration past the opening', () => {
    expect(hourOf([{ who: 'fern', text: 'See you tonight, at dusk!' }])).toBeNull();
    expect(hourOf([n('A gate.'), n('A man.'), n('That night he was gone.')])).toBeNull();
  });

  it('lights the campaign’s late-afternoon arrival at the gate', () => {
    const scene = CAMPAIGN_SCENES.find((s) => s.id === 'c2-corvin');
    expect(scene && hourOf(scene.lines)).toBe(READ3D.stage.goldenHour);
  });

  it('draws a figure clear of a post it stands on', () => {
    const r = READ3D.post.keepOff;
    const p = keepOff({ x: 0.1, z: 0 }, [{ x: 0, z: 0 }]);
    expect(Math.hypot(p.x, p.z)).toBeCloseTo(r);
    expect(keepOff({ x: 3, z: 0 }, [{ x: 0, z: 0 }])).toEqual({ x: 3, z: 0 });
  });
});

describe('story staging: named nights', () => {
  it('does not light "the Long Night" or "Lantern Night" as the hour', () => {
    expect(hourOf([n('He has sat there since the Long Night.')])).toBeNull();
    expect(hourOf([n('On Lantern Night it comes down for an hour.')])).toBeNull();
  });
});
