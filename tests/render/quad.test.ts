/**
 * The four-legged plan (LOOK-06): every listed species stands on four legs. Set
 * QUAD_SHEET=path.png to also write a contact sheet of every quad, five angles and
 * the six walk frames.
 */
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { blitScaled, encodePng, solid } from '../tools/png';

const QUADS = Object.keys(SPECIES_ART).filter((id) => SPECIES_ART[id]!.plan === 'quad');
const LISTED =
  'bulblet budback bloomback kindlefox blazebrush blazepup blazehound emberfoal blazesteed rockhorn stampbull fluffkit tidefox sparkfox flarefox gemcat thornbelle thornbeau thornlad nibbler gnawmaw dawdlet floepup floeglide ferrysong snoozelump voltkit'.split(
    ' ',
  );

/** The opaque bounding box, in physical pixels. */
function bounds(pc: PixelCanvas): { w: number; h: number } {
  let x0 = Infinity;
  let x1 = -1;
  let y0 = Infinity;
  let y1 = -1;
  for (let y = 0; y < pc.height; y++)
    for (let x = 0; x < pc.width; x++)
      if (pc.data[y * pc.width + x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
  return { w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

describe('quad plan', () => {
  it('covers every four-legged species', () => {
    for (const id of LISTED) expect(QUADS, id).toContain(id);
  });

  it('is longer than tall from the side, seated Snorlax aside', () => {
    for (const id of QUADS.filter((q) => q !== 'snoozelump')) {
      const b = bounds(drawCreature('side', poseFor('idle', 0), SPECIES_ART[id]!));
      expect(b.w / b.h, id).toBeGreaterThan(0.85);
    }
  });

  it('walks: every walk frame differs from the last', () => {
    for (const id of QUADS) {
      const frames = [0, 1, 2, 3, 4, 5].map(
        (f) => drawCreature('side', poseFor('walk', f), SPECIES_ART[id]!).data,
      );
      frames.forEach((f, i) => {
        const prev = frames[(i + 5) % 6]!;
        expect(
          f.some((v, k) => v !== prev[k]),
          `${id} frame ${i}`,
        ).toBe(true);
      });
    }
  });
});

it.skipIf(!process.env.QUAD_SHEET)('writes a quad contact sheet', () => {
  const angles = ['front', 'frontQuarter', 'side', 'backQuarter', 'back'] as const;
  const scale = 3;
  const cell = 34 * scale;
  const width = cell * (angles.length + 6);
  const height = cell * QUADS.length;
  const rgba = solid(width, height, '#3a3550');
  QUADS.forEach((id, r) => {
    const spec = SPECIES_ART[id]!;
    angles.forEach((angle, c) =>
      blitScaled(
        rgba,
        width,
        drawCreature(angle, poseFor('idle', 0), spec),
        c * cell,
        r * cell,
        scale,
      ),
    );
    for (let f = 0; f < 6; f++)
      blitScaled(
        rgba,
        width,
        drawCreature('side', poseFor('walk', f), spec),
        (angles.length + f) * cell,
        r * cell,
        scale,
      );
  });
  writeFileSync(process.env.QUAD_SHEET!, encodePng(width, height, rgba));
});
