import { describe, expect, it } from 'vitest';
import {
  NPC_LOOKS,
  STORY_NPC_LOOKS,
  STORY_SPEAKER_IDS,
  WEATHERED,
  npcLookOf,
} from '../../src/config/npc-looks';
import { trainerLook } from '../../src/render/keeper-look';
import { festivalNubbinSpots, festivalScene } from '../../src/render/stage-actors';
import { SheetCache } from '../../src/render/sprites/sheets';
import { specForKey, tintMods } from '../../src/render3d/looks';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { TRAINERS } from '../../src/sim/trainers';
import { BEETLE_SPEAKERS } from '../../src/content/storyline-beetle';
import { DAWNDUSK_SPEAKERS } from '../../src/content/storyline-dawndusk';
import { HUNDRED_SPEAKERS } from '../../src/content/storyline-hundred';
import { LOGGED_SPEAKERS } from '../../src/content/storyline-logged';

describe('story looks (C2, M1)', () => {
  it('gives every storyline speaker a look with its own accessory shape', () => {
    const speakers = [
      ...BEETLE_SPEAKERS,
      ...DAWNDUSK_SPEAKERS,
      ...HUNDRED_SPEAKERS,
      ...LOGGED_SPEAKERS,
    ].map((s) => s.id);
    expect(speakers).toHaveLength(10);
    for (const id of speakers) expect(STORY_NPC_LOOKS[id], id).toBeDefined();
    const shapes = speakers.map((id) => STORY_NPC_LOOKS[id]!.accessory);
    expect(new Set(shapes).size).toBe(shapes.length);
    expect(STORY_SPEAKER_IDS.sort()).toEqual([...speakers].sort());
  });

  it('never dresses a storyline speaker as the default Gardener', () => {
    const gardener = TRAINERS[0]!.look;
    for (const id of STORY_SPEAKER_IDS) {
      expect(trainerLook(id)).not.toEqual(gardener);
      expect(npcLookOf(id)).toBeDefined();
    }
  });

  it('gives each of Hazel’s Keepers an accessory of their own, apart from the story speakers', () => {
    for (const t of TRAINERS) expect(NPC_LOOKS[t.id], t.id).toBeDefined();
    const hazelShapes = Object.values(NPC_LOOKS).map((l) => l.accessory);
    // Ember and Hob both wear aprons, in different stories; no other shape repeats.
    const dupes = hazelShapes.filter((s, i) => hazelShapes.indexOf(s) !== i);
    expect(dupes).toEqual([]);
    expect(NPC_LOOKS.hazel?.patches).toBe(true);
  });

  it('builds a 3D Keeper spec for a story speaker with its accessory prims', () => {
    const plain = specForKey('keeper-sun');
    for (const id of STORY_SPEAKER_IDS) {
      const spec = specForKey(`keeper-sun~npc:${id}`);
      expect(spec, id).not.toBe(plain);
      const n = (s: typeof spec) =>
        s.torso.prims.length +
        s.head.prims.length +
        s.parts.reduce((a, p) => a + p.prims.length + (p.joint?.prims.length ?? 0), 0);
      expect(n(spec), id).toBeGreaterThan(n(plain));
    }
  });
});

describe('weathered Moss (C6)', () => {
  it('adds a weathered key to a Nubbin in the set, and drops it when the set empties', () => {
    const n = createEgg('moss', { x: 0, z: 0 }, Rng.fromSeed(1));
    n.stage = 'adult';
    const plainKey = SheetCache.nubbinKey(n);
    const plainMods = tintMods(n);
    WEATHERED.ids = new Set([n.id]);
    expect(SheetCache.nubbinKey(n)).toBe(`${plainKey}~weathered`);
    expect(tintMods(n)).toContain('~weathered');
    WEATHERED.ids = new Set();
    expect(SheetCache.nubbinKey(n)).toBe(plainKey);
    expect(tintMods(n)).toBe(plainMods);
  });

  it('greys the 3D spec: every prim colour loses its hue', () => {
    const base = specForKey('nubbin');
    const grey = specForKey('nubbin~weathered');
    const hex = grey.torso.prims[0]!.color;
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThan(40);
    expect(grey.torso.prims[0]!.color).not.toBe(base.torso.prims[0]!.color);
  });
});

describe('festival crowd (H9)', () => {
  it('spots Nubbins in the ring’s gaps, facing in', () => {
    const spots = festivalNubbinSpots('grove', 4.3, 6);
    expect(spots).toHaveLength(6);
    expect(festivalScene({ place: 'festival' })).toBe(true);
    expect(festivalScene({ cast: [{ who: 'fern', mark: 'festival-3' }] })).toBe(true);
    expect(festivalScene({ place: 'gate' })).toBe(false);
  });
});
