/**
 * The four-legged plan (LOOK-06): every listed species stands on four legs. Set
 * QUAD_SHEET=path.png to also write a contact sheet of every quad, five angles and
 * the six walk frames.
 */
import { writeFileSync } from 'node:fs';
import { KEEPER_ACTS } from '../../src/config/tuning-more/soul-ambient-games';
import { describe, expect, it } from 'vitest';
import { poseFor } from '../../src/render/sprites/chao';
import { drawCreature, type CreatureSpec } from '../../src/render/sprites/creature';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { BEHAVIOR, GROVE3D } from '../../src/config/tuning';
import { artSpec } from '../../src/render3d/art-species';
import type { Prim } from '../../src/samples/sculpted';
import { blitScaled, encodePng, solid } from '../tools/png';

const QUADS = Object.keys(SPECIES_ART).filter((id) => SPECIES_ART[id]!.plan === 'quad');
const LISTED =
  'bulblet budback bloomback kindlefox blazebrush blazepup blazehound emberfoal blazesteed rockhorn stampbull fluffkit tidefox sparkfox flarefox gemcat thornbelle thornbeau thornlad nibbler gnawmaw dawdlet floepup floeglide ferrysong voltkit'.split(
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

  it('is longer than tall from the side', () => {
    for (const id of QUADS) {
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

/** The lowest and highest point a prim reaches. */
const reach = (q: Prim) => q.radii?.y ?? Math.max(q.r, q.r2 ?? 0);
const lowY = (q: Prim) => Math.min(q.a.y, q.b?.y ?? Infinity) - reach(q);
const highY = (q: Prim) => Math.max(q.a.y, q.b?.y ?? -Infinity) + reach(q);

describe('quad tail set and gait (R0375)', () => {
  it('sets a low tail lower than a high one, in both renderers', () => {
    const low: CreatureSpec = { ...SPECIES_ART.nibbler!, addons: [] };
    const high: CreatureSpec = { ...low, quad: { ...low.quad, tailSet: 'high' as const } };
    // Pixel: in the side view the tail is the leftmost thing drawn; its top row moves down.
    const top = (pc: PixelCanvas) => {
      for (let x = 0; x < pc.width; x++)
        for (let y = 0; y < pc.height; y++) if (pc.data[y * pc.width + x]) return y;
      return -1;
    };
    const ph = top(drawCreature('side', poseFor('idle', 0), high));
    const pl = top(drawCreature('side', poseFor('idle', 0), low));
    expect(pl).toBeGreaterThan(ph);
    // 3D: the tail part's root is lower on the body.
    const root = (s: CreatureSpec) => artSpec('t', s).parts.find((p) => p.name === 'tail')!.pivot.y;
    expect(root(low)).toBeLessThan(root(high));
  });

  it('keeps the feet planted at walkSpeed: every quad walks inside the gait clock range', () => {
    // render3d/gait.ts plays the walk at walkSpeed / natural speed, between 0.35 and
    // maxCadence; inside that range the swing matches the ground and nothing slides. The
    // swing legs' stride is 2π · hip height · legSwing (species.ts), scaled to the figure.
    for (const id of QUADS) {
      const art = SPECIES_ART[id]!;
      const s = artSpec(id, art);
      const all = [...s.torso.prims, ...s.head.prims, ...s.parts.flatMap((p) => p.prims)];
      const footY = Math.min(...all.map(lowY));
      const tall = Math.max(...all.map(highY)) - footY;
      const legs = s.parts.filter((p) => p.name.startsWith('leg'));
      expect(legs.length, id).toBe(4);
      const hip = legs.reduce((m, p) => m + p.pivot.y - footY, 0) / legs.length;
      const stride = 2 * Math.PI * hip * Math.min(1, 0.55 * (s.stride?.length ?? 1));
      const natural =
        (stride * ((GROVE3D.nubbinHeight * art.size) / tall)) / (s.stride?.period ?? 0.8);
      const cadence = BEHAVIOR.walkSpeed / natural;
      expect(cadence, id).toBeGreaterThan(0.35);
      expect(cadence, id).toBeLessThan(GROVE3D.maxCadence);
      // R0375 (lane F r13): and at a Nubbin's run, so the seals no longer slide either.
      expect(KEEPER_ACTS.runSpeed / natural, id).toBeLessThanOrEqual(GROVE3D.maxCadence);
    }
  });
});

if (process.env.QUAD_SHEET) it('writes a quad contact sheet', () => {
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
