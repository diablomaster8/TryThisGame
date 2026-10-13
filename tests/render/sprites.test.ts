import { describe, expect, it } from 'vitest';
import { viewAngle, viewIndex } from '../../src/render/sprites/angles';
import { CLIPS, frameAt, frameKey } from '../../src/render/sprites/animations';
import { atlasSize, cellRect } from '../../src/render/sprites/atlas';
import {
  adultColors,
  CHARACTER_LOOKS,
  CHILD_NEUTRAL,
  drawChao,
  lookOf,
  poseFor,
  shapeFor,
  VARIANT_COLORS,
  variantColors,
} from '../../src/render/sprites/chao';
import { PART_STYLES } from '../../src/render/sprites/parts';
import { CRITTER_SPECIES, partId } from '../../src/sim/critters';
import { C } from '../../src/render/sprites/palette';
import { PixelCanvas } from '../../src/render/sprites/pixel-canvas';

describe('viewIndex', () => {
  it('faces the camera when facing equals the camera yaw', () => {
    expect(viewIndex(0, 0)).toBe(0);
    expect(viewIndex(1.3, 1.3)).toBe(0);
  });

  it('shows the back when facing away', () => {
    expect(viewIndex(Math.PI, 0)).toBe(4);
  });

  it('mirrors the left-facing views', () => {
    expect(viewAngle(Math.PI / 2, 0)).toEqual({ angle: 'side', flip: false });
    expect(viewAngle(-Math.PI / 2, 0)).toEqual({ angle: 'side', flip: true });
    expect(viewAngle(-Math.PI / 4, 0)).toEqual({ angle: 'frontQuarter', flip: true });
    expect(viewAngle((3 * Math.PI) / 4, 0)).toEqual({ angle: 'backQuarter', flip: false });
  });

  it('wraps large and negative angles', () => {
    expect(viewIndex(Math.PI * 4, 0)).toBe(0);
    expect(viewIndex(-Math.PI * 3, 0)).toBe(4);
  });
});

describe('animations', () => {
  it('loops frames by elapsed time', () => {
    expect(frameAt(CLIPS.walk, 0)).toBe(0);
    expect(frameAt(CLIPS.walk, 100)).toBe(1);
    expect(frameAt(CLIPS.walk, 100 * 6)).toBe(0);
    expect(frameKey('walk', 'side', 2)).toBe('walk:side:2');
  });
});

describe('atlas math', () => {
  it('lays frames out on a grid', () => {
    expect(cellRect(0, 32, 32, 10)).toEqual({ x: 0, y: 0, w: 32, h: 32 });
    expect(cellRect(11, 32, 32, 10)).toEqual({ x: 32, y: 32, w: 32, h: 32 });
    expect(atlasSize(95, 32, 32, 10)).toEqual({ width: 320, height: 320, rows: 10 });
    expect(atlasSize(0, 16, 16, 4).rows).toBe(1);
  });
});

describe('PixelCanvas', () => {
  it('plots, clips and outlines', () => {
    const pc = new PixelCanvas(8, 8);
    pc.px(3, 3, C.grass);
    pc.px(-1, 0, C.grass);
    pc.px(99, 99, C.grass);
    expect(pc.get(3, 3)).toBe(C.grass);
    expect(pc.get(2, 3)).toBe(-1);
    pc.outline(C.ink);
    expect(pc.get(2, 3)).toBe(C.ink);
    expect(pc.get(4, 3)).toBe(C.ink);
    expect(pc.get(2, 2)).toBe(-1); // 4-neighbour only
    expect(pc.bounds()).toEqual({ x: 2, y: 2, w: 3, h: 3 });
  });

  it('mirrors and recolours', () => {
    const pc = new PixelCanvas(4, 1);
    pc.px(0, 0, C.rose);
    const m = pc.mirrored();
    expect(m.get(3, 0)).toBe(C.rose);
    expect(m.get(0, 0)).toBe(-1);
    m.recolor({ [C.rose]: C.mint });
    expect(m.get(3, 0)).toBe(C.mint);
  });
});

describe('drawChao', () => {
  const NEUTRAL = lookOf(CHILD_NEUTRAL);

  it('produces a full-size sprite at every angle with feet on the ground row', () => {
    for (const angle of ['front', 'frontQuarter', 'side', 'backQuarter', 'back'] as const) {
      const pc = drawChao(angle, poseFor('idle', 0), NEUTRAL);
      const b = pc.bounds();
      expect(b).not.toBeNull();
      expect(b!.h).toBeGreaterThan(18);
      expect(b!.w).toBeGreaterThan(12);
      expect(b!.y + b!.h - 1).toBe(31); // outline row under the feet
    }
  });

  it('shows eyes from the front and none from the back', () => {
    const front = drawChao('front', poseFor('idle', 0), NEUTRAL);
    const back = drawChao('back', poseFor('idle', 0), NEUTRAL);
    const count = (pc: PixelCanvas, c: number) => {
      let n = 0;
      for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (pc.get(x, y) === c) n++;
      return n;
    };
    expect(count(front, C.ink)).toBeGreaterThan(8);
    // The back has no eyes; a stray outline pixel or two is fine.
    expect(count(back, C.ink)).toBeLessThan(count(front, C.ink) - 6);
    expect(count(back, C.blush)).toBeGreaterThan(count(front, C.blush)); // wings
  });

  it('is deterministic', () => {
    const a = drawChao('side', poseFor('walk', 2), NEUTRAL);
    const b = drawChao('side', poseFor('walk', 2), NEUTRAL);
    expect(Array.from(a.data)).toEqual(Array.from(b.data));
  });

  it('every critter part has a style and changes the drawing', () => {
    const base = drawChao('front', poseFor('idle', 0), NEUTRAL);
    for (const species of CRITTER_SPECIES) {
      const parts = { ears: null, tail: null, arms: null, back: null } as Record<
        'ears' | 'tail' | 'arms' | 'back',
        string | null
      >;
      for (const slot of species.parts) {
        const id = partId(species.id, slot);
        expect(PART_STYLES[id], id).toBeDefined();
        parts[slot] = id;
      }
      const withParts = drawChao(
        'front',
        poseFor('idle', 0),
        lookOf(CHILD_NEUTRAL, null, null, parts),
      );
      expect(Array.from(withParts.data), species.id).not.toEqual(Array.from(base.data));
    }
  });

  it('egg colours recolour the body and survive into adult palettes; shiny and two-tone differ', () => {
    const sky = variantColors(CHILD_NEUTRAL, 'sky');
    expect(sky.body).toBe(VARIANT_COLORS.sky!.body);
    expect(variantColors(CHILD_NEUTRAL, 'plain')).toEqual(CHILD_NEUTRAL);
    const adult = variantColors(adultColors('sun', 'power'), 'rose', false, null, 'sun');
    expect(adult.body).toBe(VARIANT_COLORS.rose!.body);
    expect(adult.belly).toBe(C.white);
    const twoTone = variantColors(CHILD_NEUTRAL, 'mint', false, 'gold');
    expect(twoTone.belly).toBe(VARIANT_COLORS.gold!.body);
    const shiny = variantColors(CHILD_NEUTRAL, 'mint', true);
    expect(shiny.outline).toBe(C.white);
    const a = drawChao('front', poseFor('idle', 0), lookOf(twoTone));
    const b = drawChao('front', poseFor('idle', 0), lookOf(variantColors(CHILD_NEUTRAL, 'mint')));
    expect(Array.from(a.data)).not.toEqual(Array.from(b.data));
  });

  it('character looks and hats draw something on the head', () => {
    const plain = drawChao('front', poseFor('idle', 0), NEUTRAL);
    for (const id of Object.keys(CHARACTER_LOOKS)) {
      const withLook = drawChao(
        'front',
        poseFor('idle', 0),
        lookOf(CHARACTER_LOOKS[id]!.colors, null, null, undefined, false, id),
      );
      expect(Array.from(withLook.data), id).not.toEqual(Array.from(plain.data));
    }
    for (const hat of ['straw', 'crown', 'beanie', 'flower', 'bucket']) {
      const withHat = drawChao(
        'front',
        poseFor('idle', 0),
        lookOf(CHILD_NEUTRAL, null, null, undefined, false, hat),
      );
      expect(Array.from(withHat.data), hat).not.toEqual(Array.from(plain.data));
    }
  });

  it('types change the silhouette and second evolutions add a lighter touch', () => {
    expect(shapeFor('run', null).legLength).toBeGreaterThan(shapeFor('swim', 'run').legLength);
    expect(shapeFor('swim', 'run').legLength).toBeGreaterThan(0);
    expect(shapeFor('fly', null).wingScale).toBeGreaterThan(1);
    expect(shapeFor(null, null).grow).toBe(0);
    const run = drawChao('side', poseFor('idle', 0), lookOf(CHILD_NEUTRAL, 'run'));
    expect(run.bounds()!.h).toBeGreaterThan(
      drawChao('side', poseFor('idle', 0), NEUTRAL).bounds()!.h,
    );
  });
});
