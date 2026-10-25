import { describe, expect, it } from 'vitest';
import { GRANDCHILD3D } from '../../src/config/tuning-fx3d';
import { GROVE3D } from '../../src/config/tuning';
import { keeperOutfit } from '../../src/render/keeper-look';
import { color } from '../../src/render/sprites/palette';
import { keeperLook } from '../../src/render3d/creature-pool';
import { specForKey } from '../../src/render3d/looks';
import type { SpeciesSpec } from '../../src/samples/species';
import { TRAINERS } from '../../src/sim/trainers';
import type { Keeper } from '../../src/sim/types';

const prims = (s: SpeciesSpec) => [s.torso, s.head, ...s.parts].flatMap((p) => p.prims);
/** What tells two figures apart at a glance: hair colour and shape, headwear, colours. */
const silhouette = (s: SpeciesSpec) => {
  const all = prims(s);
  return JSON.stringify({
    hair: all.filter((p) => p.tag === 'hair').map((p) => [p.kind, p.color]),
    head: all.filter((p) => p.tag !== 'hair').map((p) => p.tag),
    marks: s.marks.length,
  });
};
const keeper = (alignment: 'sun' | 'moon') => ({ alignment }) as Keeper;

// fx-rules 2026-10-25: the player's avatar is Hazel's grandchild, never the trainer NPC.
describe("the player's 3D avatar", () => {
  it('is the grandchild in the picked role outfit for each side', () => {
    for (const t of TRAINERS)
      for (const side of ['sun', 'moon'] as const) {
        const look = keeperLook(keeper(side), t.id);
        expect(look.key).toBe(`grandchild-${side}~outfit:${t.id}`);
        expect(look.height).toBeCloseTo(GROVE3D.keeperHeight * GRANDCHILD3D.heightShare);
        const spec = specForKey(look.key);
        const all = prims(spec);
        const o = keeperOutfit(t.id, side);
        expect(all.find((p) => p.tag === 'tee')?.color, `${t.id} ${side}`).toBe(color(o.shirt));
        expect(all.find((p) => p.tag === 'shorts')?.color).toBe(color(o.pants));
        // Its own hair, skin and eyes whatever the role.
        expect(all.find((p) => p.tag === 'hair')?.color).toBe(GRANDCHILD3D.hair);
        expect(all.find((p) => p.tag === 'head')?.color).toBe(GRANDCHILD3D.skin);
        expect(spec.eyes.iris).toBe(GRANDCHILD3D.iris);
        expect(all.some((p) => p.tag === 'goggles')).toBe(false);
        expect(all.some((p) => p.tag === 'clip')).toBe(true);
      }
  });

  it('switching side changes only the outfit trim and badge, not the figure', () => {
    const sun = specForKey(keeperLook(keeper('sun'), 'fern').key);
    const moon = specForKey(keeperLook(keeper('moon'), 'fern').key);
    const hair = (s: SpeciesSpec) => prims(s).filter((p) => p.tag === 'hair' || p.tag === 'clip');
    expect(JSON.stringify(hair(sun))).toBe(JSON.stringify(hair(moon)));
    expect(sun.marks).not.toEqual(moon.marks);
  });

  it('never matches any trainer NPC rig', () => {
    const npcs = TRAINERS.flatMap((t) =>
      (['sun', 'moon'] as const).map((side) =>
        silhouette(specForKey(`keeper-${side}~npc:${t.id}`)),
      ),
    );
    for (const t of TRAINERS) {
      const me = silhouette(specForKey(keeperLook(keeper('sun'), t.id).key));
      expect(npcs).not.toContain(me);
    }
  });
});
