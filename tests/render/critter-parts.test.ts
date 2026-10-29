import { describe, expect, it } from 'vitest';
import { PART_SIZE } from '../../src/config/tuning-look';
import { CRITTER_LABELS } from '../../src/config/strings';
import { PART_STYLES } from '../../src/render/sprites/parts';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { partStep, partSteps } from '../../src/render/sprites/part-size';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';
import {
  parsePartSteps,
  parsePartsMod,
  partsModBody,
  partsTinted,
  withCritterParts,
} from '../../src/samples/nubbin-critter-parts';
import { CHILD } from '../../src/samples/nubbin-variants';
import {
  ALL_CRITTERS,
  CRITTER_SPECIES,
  RARE_CRITTERS,
  giveCritter,
  partId,
} from '../../src/sim/critters';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { Nubbin, SimEvent } from '../../src/sim/types';

/** R0401–R0403 (LOOK-34/35/36): eight part slots, more critters, parts sized by stat. */

function child(): Nubbin {
  const n = createEgg('n1', { x: 0, z: 0 }, Rng.fromSeed(1));
  n.stage = 'child';
  return n;
}

describe('critter part slots', () => {
  it('penguin, then parrot, then boar fill six or more slots', () => {
    const n = child();
    const ev: SimEvent[] = [];
    for (const id of ['penguin', 'parrot', 'boar']) giveCritter(n, id, Rng.fromSeed(2), ev);
    expect(Object.values(n.parts).filter(Boolean).length).toBeGreaterThanOrEqual(6);
    expect(n.parts.arms).toBe('penguin-arms');
    expect(n.parts.wings).toBe('parrot-wings');
    expect(n.parts.face).toBe('parrot-face');
    expect(n.parts.legs).toBe('boar-legs');
    expect(n.parts.horn).toBe('boar-horn');
  });

  it('every critter, rare ones too, has a name and a style for every slot it sets', () => {
    expect(ALL_CRITTERS.length).toBeGreaterThanOrEqual(26);
    expect(RARE_CRITTERS.every((c) => c.rare)).toBe(true);
    expect(CRITTER_SPECIES.some((c) => c.rare)).toBe(false);
    for (const c of ALL_CRITTERS) {
      expect(CRITTER_LABELS[c.id], c.id).toBeTruthy();
      for (const slot of c.parts) {
        const id = partId(c.id, slot);
        expect(PART_STYLES[id], id).toBeDefined();
      }
    }
  });

  it('parses the old four-entry look keys unchanged', () => {
    const old = 'rabbit-ears,rabbit-tail,-,peacock-back';
    expect(parsePartsMod(old)).toEqual({
      ears: 'rabbit-ears',
      tail: 'rabbit-tail',
      back: 'peacock-back',
    });
    expect(parsePartSteps(old)).toEqual({});
    expect(partsTinted(old)).toBe(false);
  });

  it('round-trips eight slots, size steps and the band tint through the key', () => {
    const parts = {
      ears: 'boar-ears',
      tail: 'parrot-tail',
      arms: 'penguin-arms',
      back: null,
      legs: 'boar-legs',
      horn: 'boar-horn',
      face: 'parrot-face',
      wings: 'parrot-wings',
    };
    const body = partsModBody(parts, { ears: 0, legs: 2, wings: 1 }, true);
    expect(parsePartsMod(body)).toEqual({
      ears: 'boar-ears',
      tail: 'parrot-tail',
      arms: 'penguin-arms',
      legs: 'boar-legs',
      horn: 'boar-horn',
      face: 'parrot-face',
      wings: 'parrot-wings',
    });
    expect(parsePartSteps(body)).toEqual({ ears: 0, legs: 2, wings: 1 });
    expect(partsTinted(body)).toBe(true);
    // A Nubbin with only the first four slots keeps a four-entry key.
    const four = { ears: 'rabbit-ears', tail: null, arms: null, back: null };
    expect(partsModBody(four)).toBe('rabbit-ears,-,-,-');
  });
});

describe('critter part size (LOOK-36)', () => {
  it('steps by the level of the critter type stat, in three steps', () => {
    const n = child();
    n.parts.tail = 'seal-tail';
    n.stats.swim.points = 1000; // level 10
    expect(partStep('seal-tail', n.stats)).toBe(0);
    n.stats.swim.points = 5000;
    expect(partStep('seal-tail', n.stats)).toBe(1);
    n.stats.swim.points = 9000;
    expect(partStep('seal-tail', n.stats)).toBe(2);
    expect(partSteps(n)).toEqual({ tail: 2 });
    expect(PART_SIZE.steps[2]).toBeGreaterThan(PART_SIZE.steps[0] * 1.3);
  });

  it('draws bigger parts at Swim 90 than at Swim 10 in Pixel', () => {
    const look = lookOf(CHILD_NEUTRAL, null, null, {
      ears: null,
      tail: 'seal-tail',
      arms: null,
      back: null,
    });
    const inked = (step: 0 | 2) => {
      const pc = drawChao('side', poseFor('idle', 0), { ...look, partSteps: { tail: step } });
      return Array.from(pc.data).filter((v) => v !== 0).length;
    };
    expect(inked(2)).toBeGreaterThan(inked(0));
  });

  it('grows the 3D part with its step', () => {
    const radius = (step: 0 | 2) => {
      const spec = withCritterParts(CHILD, { tail: 'seal-tail' }, { tail: step });
      const tail = spec.parts.find((p) => p.name === 'tail')!;
      return Math.max(...tail.prims.map((p) => p.radii?.x ?? p.r));
    };
    expect(radius(2)).toBeGreaterThan(radius(0) * 1.3);
  });

  it('builds every critter part in 3D, the head slots into the head', () => {
    for (const c of ALL_CRITTERS) {
      const parts = Object.fromEntries(c.parts.map((s) => [s, partId(c.id, s)]));
      const spec = withCritterParts(CHILD, parts);
      expect(spec, c.id).not.toBe(CHILD);
      if (c.parts.includes('horn'))
        expect(spec.head.prims.length, c.id).toBeGreaterThan(CHILD.head.prims.length);
      if (c.parts.includes('legs'))
        expect(
          spec.parts.filter((p) => p.name.startsWith('leg')),
          c.id,
        ).toHaveLength(2);
      if (c.parts.includes('wings')) expect(spec.wings, c.id).toBeUndefined();
    }
  });

  it('leans a tinted part toward the body colour', () => {
    const colour = (tint: boolean) =>
      withCritterParts(CHILD, { tail: 'skunk-tail' }, {}, tint).parts.find(
        (p) => p.name === 'tail',
      )!.prims[0]!.color;
    expect(colour(true)).not.toBe(colour(false));
  });

  it('draws all eight slots filled at every angle', () => {
    const look = lookOf(CHILD_NEUTRAL, null, null, {
      ears: 'boar-ears',
      tail: 'parrot-tail',
      arms: 'penguin-arms',
      back: 'turtle-back',
      legs: 'deer-legs',
      horn: 'unicorn-horn',
      face: 'raccoon-face',
      wings: 'bat-wings',
    });
    for (const angle of DRAWN_ANGLES)
      for (const clip of ['idle', 'walk', 'swim', 'sleep', 'happy'] as const)
        expect(() => drawChao(angle, poseFor(clip, 1), look), `${angle} ${clip}`).not.toThrow();
  });
});
