import { describe, expect, it } from 'vitest';
import { CAMP10D } from '../../src/config/tuning';
import { boardCards } from '../../src/render/dress-camp10d';
import { dressItems } from '../../src/render/dress-d-rules';
import { startCampaign } from '../../src/sim/campaign';
import { createWorld } from '../../src/sim/world';

/** Lane C r10 agent D (R0607, R0639): the notice board and the lines' Grove changes. */
function world(chapter: number) {
  const w = createWorld(1, 0);
  startCampaign(w, []);
  w.campaign!.chapter = chapter;
  w.campaign!.queue = [];
  w.location = 'grove';
  w.keeper.pos = { x: 2, z: 18 };
  return w;
}
const item = (w: ReturnType<typeof world>, key: string) =>
  dressItems(w, {}, 0).find((i) => i.key === key);

describe('notice board and Grove-change props (R0607, R0639)', () => {
  it('stands the Grove board inside the gate from chapter 3, a card per waiting quest', () => {
    expect(item(world(2), 'notice-board')).toBeUndefined();
    const w = world(3);
    w.questBook = {
      v: 1,
      entries: {
        q1: { state: 'declined', area: 'grove/falls', offeredMs: 0, acceptedMs: null, declines: 1 },
      },
      offer: null,
      tracked: [],
      areas: {},
      here: null,
    };
    expect(boardCards(w)).toBeGreaterThanOrEqual(1);
    const b = item(w, 'notice-board')!;
    expect(b.shape).toBe('board');
    expect(b.n).toBe(Math.min(CAMP10D.props.boardCardsMax, boardCards(w)));
    expect(b.z).toBeGreaterThan(18);
    // A scene may hide it, and it is not drawn far from the Keeper.
    expect(dressItems(w, { props: { 'notice-board': 'hide' } }, 0).map((i) => i.key)).not.toContain(
      'notice-board',
    );
    w.keeper.pos = { x: 26, z: 34 };
    expect(item(w, 'notice-board')).toBeUndefined();
  });

  it("places each finished line's Grove change from its keepsake", () => {
    const w = world(12);
    expect(item(w, 'grove-change-grove-fold-habitat')).toBeUndefined();
    w.inventory.keepsakes.push('grove-fold-habitat', 'grove-beetle-shrine');
    expect(item(w, 'grove-change-grove-fold-habitat')?.shape).toBe('signpost');
    // The beetle shrine stands at the Hollow stairs, drawn once the Keeper is near them.
    expect(item(w, 'grove-change-grove-beetle-shrine')).toBeUndefined();
    w.keeper.pos = { x: -10, z: -10 };
    const s = item(w, 'grove-change-grove-beetle-shrine')!;
    expect(s.shape).toBe('shrine');
    expect(s.lit).toBe(true);
    // Not inside a line's region: there the region's own set is dressed.
    w.storyRegion = 'fold';
    w.keeper.pos = { x: 2, z: 18 };
    expect(item(w, 'grove-change-grove-fold-habitat')).toBeUndefined();
  });
});
