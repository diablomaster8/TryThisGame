/**
 * The player's pixel avatar is Hazel's grandchild (fix pass 2026-10-25): skin and hair no
 * trainer wears, a child's build with no hat, dressed in the picked role's outfit with the
 * side's trim, so it never looks like the NPC of the role it took.
 */
import { describe, expect, it } from 'vitest';
import { keeperOutfit, trainerLook } from '../../src/render/keeper-look';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import {
  drawKeeperFrame,
  GRANDCHILD,
  grandchildLook,
  KEEPER_STAGE_CLIPS,
} from '../../src/render/sprites/keeper';
import { npcLookOf } from '../../src/config/npc-looks';
import { TRAINERS } from '../../src/sim/trainers';

describe('the grandchild avatar', () => {
  it("wears skin and hair none of the ten trainers wears, in the role's outfit", () => {
    expect(TRAINERS.length).toBe(10);
    for (const t of TRAINERS) {
      expect(t.look.hair).not.toBe(GRANDCHILD.hair);
      expect(t.look.skin).not.toBe(GRANDCHILD.skin);
      for (const side of ['sun', 'moon'] as const) {
        const outfit = keeperOutfit(t.id, side);
        const g = grandchildLook(outfit);
        expect(g.shirt).toBe(outfit.shirt);
        expect(g.pants).toBe(outfit.pants);
        expect(g.hatBand).toBe(outfit.hatBand);
        expect(g.skin).toBe(GRANDCHILD.skin);
        expect(g.hair).toBe(GRANDCHILD.hair);
      }
    }
  });

  it('draws a different figure from the NPC of the same role, at every angle', () => {
    for (const t of TRAINERS) {
      const g = grandchildLook(keeperOutfit(t.id, t.band));
      for (const angle of DRAWN_ANGLES) {
        const npc = drawKeeperFrame(angle, 'idle', 0, trainerLook(t.id), npcLookOf(t.id));
        const you = drawKeeperFrame(angle, 'idle', 0, g, undefined, undefined, true);
        expect(Array.from(you.data)).not.toEqual(Array.from(npc.data));
        // A child: never taller than a grown figure in the same outfit (allowing for the cowlick).
        const adult = drawKeeperFrame(angle, 'idle', 0, keeperOutfit(t.id, t.band));
        const top = (pc: { data: ArrayLike<number>; width: number }) =>
          Math.floor(Array.from(pc.data).findIndex((v) => v !== 0) / pc.width);
        expect(top(you)).toBeGreaterThanOrEqual(top(adult) - 2);
      }
    }
  });

  it('changes only the outfit trim between Sun and Moon', () => {
    const sun = grandchildLook(keeperOutfit('fern', 'sun'));
    const moon = grandchildLook(keeperOutfit('fern', 'moon'));
    expect(sun.hatBand).not.toBe(moon.hatBand);
    expect({ ...sun, hatBand: 0, shirtShade: 0 }).toEqual({ ...moon, hatBand: 0, shirtShade: 0 });
  });

  it('draws every walk, idle and stage frame', () => {
    const g = grandchildLook(keeperOutfit('marina', 'sun'));
    for (const angle of DRAWN_ANGLES) {
      for (let f = 0; f < 6; f++)
        expect(drawKeeperFrame(angle, 'walk', f, g, undefined, undefined, true).bounds()).not.toBe(
          null,
        );
      for (const clip of Object.keys(KEEPER_STAGE_CLIPS) as Array<keyof typeof KEEPER_STAGE_CLIPS>)
        expect(drawKeeperFrame(angle, clip, 0, g, undefined, undefined, true).bounds()).not.toBe(
          null,
        );
    }
  });
});
