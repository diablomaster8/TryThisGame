import { describe, expect, it } from 'vitest';
import { KEEPSAKE_LOOKS } from '../../src/config/keepsake-looks';
import { dressItems, shelfKeepsakes } from '../../src/render/dress-d-rules';
import { startCampaign } from '../../src/sim/campaign';
import { createWorld } from '../../src/sim/world';

function campaignWorld(queue: string[]) {
  const w = createWorld(1, 0);
  startCampaign(w, []);
  w.campaign!.queue = queue;
  w.location = 'grove';
  return w;
}
const keys = (w: ReturnType<typeof campaignWorld>, stage = {}, dark = 0) =>
  dressItems(w, stage, dark).map((i) => i.key);

describe('package d dressing rules (campaign graphics M1, M2, M7, M17, H11)', () => {
  it('stands the chapter 1 step vignette and the signpost letter while c1 is unread', () => {
    const w = campaignWorld(['c1-letter']);
    expect(keys(w)).toEqual(expect.arrayContaining(['kettle', 'cup', 'window-shelf', 'signpost']));
    const post = dressItems(w, {}, 0).find((i) => i.key === 'signpost')!;
    expect(post.glint).toBe(true);
    w.campaign!.queue = [];
    w.campaign!.seen.push('c1-letter');
    expect(keys(w)).not.toContain('signpost');
    expect(keys(w)).toContain('kettle');
  });

  it('lets a scene hide or show a prop through stage.props', () => {
    const w = campaignWorld(['c1-letter']);
    expect(keys(w, { props: { kettle: 'hide' } })).not.toContain('kettle');
    expect(keys(w, { props: { 'step-pie': 'show' } })).toContain('step-pie');
  });

  it('lights the porch from dusk and shows only keepsakes that are objects on the shelf', () => {
    const w = campaignWorld([]);
    expect(dressItems(w, {}, 0).find((i) => i.key === 'porch-light')!.lit).toBe(false);
    expect(dressItems(w, {}, 0.9).find((i) => i.key === 'porch-light')!.lit).toBe(true);
    expect(keys(w)).not.toContain('keepsake-shelf');
    w.inventory.keepsakes.push('s5-dusty-trowel', 'a-title-not-a-thing');
    expect(shelfKeepsakes(w)).toEqual(['s5-dusty-trowel']);
    const out = dressItems(w, {}, 0);
    expect(out.find((i) => i.key === 'keepsake-shelf')!.ids).toEqual(['s5-dusty-trowel']);
    expect(out.find((i) => i.key === 'keepsake-glint')).toBeUndefined();
    w.inventory.keepsakes.push('s31-rock');
    expect(dressItems(w, {}, 0).find((i) => i.key === 'keepsake-glint')!.glint).toBe(true);
  });

  it('puts nothing out away from the campaign', () => {
    const w = createWorld(1, 0);
    expect(dressItems(w, {}, 0)).toEqual([]);
  });

  it('gives every look a shape and two colours', () => {
    for (const look of Object.values(KEEPSAKE_LOOKS)) {
      expect(look.color).toMatch(/^#[0-9a-f]{6}$/);
      expect(look.accent).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
