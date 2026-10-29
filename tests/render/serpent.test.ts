/**
 * The serpent body plan (LOOK-05): long from the side, and moving by a wave. Set
 * SERPENT_SHEET=path.png to also write a contact sheet of every serpent, five angles and
 * the six walk frames.
 */
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { blitScaled, encodePng, solid } from '../tools/png';

const SERPENTS = Object.keys(SPECIES_ART).filter((id) => SPECIES_ART[id]!.plan === 'serpent');

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

describe('serpent plan', () => {
  it('covers the long-bodied species', () => {
    for (const id of ['stormwyrm', 'boulderwyrm', 'seaserpent', 'skyserpent', 'coilet'])
      expect(SERPENTS).toContain(id);
  });

  it('is clearly longer than tall from the side', () => {
    for (const id of SERPENTS) {
      const b = bounds(drawCreature('side', poseFor('idle', 0), SPECIES_ART[id]!));
      // The raised head caps this inside a 32 px frame; the 3D chain carries the full 2.5x.
      expect(b.w / b.h, id).toBeGreaterThan(1.0);
    }
  });

  it('slithers: every walk frame differs from the last', () => {
    for (const id of SERPENTS) {
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

it.skipIf(!process.env.SERPENT_SHEET)('writes a serpent contact sheet', () => {
  const angles = ['front', 'frontQuarter', 'side', 'backQuarter', 'back'] as const;
  const scale = 3;
  const cell = 34 * scale;
  const width = cell * (angles.length + 6);
  const height = cell * SERPENTS.length;
  const rgba = solid(width, height, '#3a3550');
  SERPENTS.forEach((id, r) => {
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
  writeFileSync(process.env.SERPENT_SHEET!, encodePng(width, height, rgba));
});

describe('serpent plan in 3D', () => {
  it('lays each spine out at least 2.5 times as long as it is tall', async () => {
    const { serpentChain } = await import('../../src/render3d/art-serpent');
    for (const id of SERPENTS) {
      const ch = serpentChain(SPECIES_ART[id]!);
      const h = ch.layout.head;
      const tip = ch.nodes[ch.nodes.length - 1]!;
      const long = h.z + h.r.z - (tip.z - ch.radii[ch.radii.length - 1]!);
      const tall = h.y + h.r.y;
      expect(long / tall, id).toBeGreaterThanOrEqual(2.5);
    }
  });
});
