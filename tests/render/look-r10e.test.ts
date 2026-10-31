import { describe, expect, it } from 'vitest';
import { bandedEmote, BAND_EMOTE_COLOURS, emoteBand } from '../../src/render/emote-band';
import { C, PALETTE } from '../../src/render/sprites/palette';
import { clipFor } from '../../src/render/world-view';
import { poseFor as chaoPose } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { speciesArt } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';
import { DINO_LEAN_DEG, METAL_ARM } from '../../src/config/tuning-look-r10e';
import { poseFor } from '../../src/render3d/actors';
import { EXPRESSIONS, MOTION_POSES } from '../../src/samples/species';
import { FIRST_VARIANTS } from '../../src/samples/nubbin-variants-first';
import { SECOND_VARIANTS } from '../../src/samples/nubbin-variants-second';
import { hatch } from '../../src/sim/lifecycle';
import type { Nubbin, SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

function child(): Nubbin {
  const world = createWorld(7, 0);
  const n = world.nubbins[0]!;
  const events: SimEvent[] = [];
  hatch(n, events, 0);
  return n;
}

describe('LOOK-21: crying is its own clip and pose in both modes', () => {
  it('maps cry to the cry clip (Pixel) and the cry pose (3D), not sad', () => {
    const n = child();
    n.behavior.state = 'cry';
    expect(clipFor(n)).toBe('cry');
    expect(poseFor(n, false, false)).toBe('cry');
    // On the move it walks; a pet still wins.
    expect(poseFor(n, true, false)).toBe('walk');
    expect(poseFor(n, false, true)).toBe('pet');
  });

  it('the 3D cry face screws the eyes shut and opens a wailing O, unlike sad', () => {
    expect(MOTION_POSES).toContain('cry');
    expect(EXPRESSIONS.cry.lid).toBe(1);
    expect(EXPRESSIONS.cry.gape).toBe(1);
    expect(EXPRESSIONS.cry).not.toEqual(EXPRESSIONS.sad);
  });
});

describe('LOOK-17: the reaction bubbles take the band colour', () => {
  it('keys Sun and Moon hearts, spirals and "!" by band; neutral and other shapes stay stock', () => {
    expect(bandedEmote('heart', 'moon')).toBe('heart@moon');
    expect(bandedEmote('spiral', 'sun')).toBe('spiral@sun');
    expect(bandedEmote('exclaim', 'moon')).toBe('exclaim@moon');
    expect(bandedEmote('heart', 'neutral')).toBe('heart');
    expect(bandedEmote('ball', 'moon')).toBe('ball');
    expect(bandedEmote('halo', 'sun')).toBe('halo');
  });

  it('reads the band from an Eternal, then an adult form; children stay neutral', () => {
    const n = child();
    n.alignment = 0.9;
    expect(emoteBand(n)).toBe('neutral');
    n.stage = 'adult';
    n.form = { band: 'moon', type: 'run', second: null, leanAtEvolution: { ...n.typeLean } };
    expect(emoteBand(n)).toBe('moon');
    n.eternal = 'sun';
    expect(emoteBand(n)).toBe('sun');
  });

  it('gives each band its own colours: cyan-white Sun, red-purple Moon, never the rose heart', () => {
    const sun = BAND_EMOTE_COLOURS.sun;
    const moon = BAND_EMOTE_COLOURS.moon;
    expect(sun.fill).not.toBe(C.rose);
    expect(moon.fill).not.toBe(C.rose);
    expect(sun.fill).not.toBe(moon.fill);
    const rgb = (i: number) => {
      const h = PALETTE[i]!;
      return [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)) as [number, number, number];
    };
    const [sr, sg, sb] = rgb(sun.fill);
    expect(sb).toBeGreaterThan(sr);
    expect(Math.min(sr, sg, sb)).toBeGreaterThan(180);
    const [mr, mg, mb] = rgb(moon.fill);
    expect(mr).toBeGreaterThan(mg);
    expect(mb).toBeGreaterThan(mg);
    expect(mr + mg + mb).toBeLessThan(rgb(C.rose).reduce((a, b) => a + b, 0));
  });
});

describe('LOOK-08: the Greymon line leans forward; MetalGreymon has one metal arm', () => {
  const headZ = (id: string) => {
    const s = artSpec(id, speciesArt(id)!);
    return { s, z: s.head.pivot.z, eyeZ: s.eyes.z };
  };

  it('leans Greymon, MetalGreymon and SkullGreymon 25 degrees, not Charizard', () => {
    const t = Math.tan((DINO_LEAN_DEG * Math.PI) / 180);
    for (const id of ['hornsaur', 'ironsaur', 'bonesaur']) {
      const { s, z } = headZ(id);
      // The head sits well forward of the hips (its height over them times tan 25).
      expect(z, id).toBeGreaterThan((s.head.pivot.y - s.hipY) * t * 0.9);
      const leg = s.parts.find((p) => p.name.startsWith('leg'))!;
      expect(leg.pivot.z, id).toBeLessThan(0.2);
    }
    const char = headZ('cinderwing');
    expect(char.z).toBeLessThan(0.3);
  });

  it('gives MetalGreymon a single steel arm and a clawed body-coloured one', () => {
    const s = artSpec('ironsaur', speciesArt('ironsaur')!);
    const armL = s.parts.find((p) => p.name === 'armL')!;
    const armR = s.parts.find((p) => p.name === 'armR')!;
    expect(armR.prims.some((p) => p.color === METAL_ARM.steel)).toBe(true);
    expect(armL.prims.some((p) => p.color === METAL_ARM.steel)).toBe(false);
    // Greymon keeps two flesh arms.
    const g = artSpec('hornsaur', speciesArt('hornsaur')!);
    for (const p of g.parts.filter((q) => q.name.startsWith('arm')))
      expect(p.prims.some((q) => q.color === METAL_ARM.steel)).toBe(false);
  });

  it('draws the Pixel MetalGreymon with one steel fist, unlike two', () => {
    const art = speciesArt('ironsaur')!;
    const one = Array.from(drawCreature('front', chaoPose('idle', 0), art).data);
    const both = Array.from(
      drawCreature('front', chaoPose('idle', 0), {
        ...art,
        extras: art.extras!.filter((x) => x !== 'metalArm'),
      }).data,
    );
    expect(one).not.toEqual(both);
  });
});

describe('LOOK-11: a Run touch grows the crown ×1.4 and sweeps it back', () => {
  const tipOf = (id: string, list: typeof FIRST_VARIANTS) => {
    const v = list.find((x) => x.id === id)!;
    const tip = v.spec.head.prims.find((p) => p.tag === 'tip')!;
    return tip.a;
  };

  it('pushes the tip further from the root and leans it further back than the first evolution', () => {
    // The Run touch also lifts the body (and the head) by 0.12 after the sweep.
    const root = { y: 2.35, z: 0 };
    const runRoot = { y: 2.47, z: 0 };
    for (const band of ['neutral', 'sun', 'moon'] as const)
      for (const type of ['normal', 'fly', 'power'] as const) {
        const first = tipOf(`first-${band}-${type}`, FIRST_VARIANTS);
        const run = tipOf(`second-${band}-${type}-run`, SECOND_VARIANTS);
        const len = (p: { y: number; z: number }, o: { y: number; z: number }) =>
          Math.hypot(p.y - o.y, p.z - o.z);
        expect(len(run, runRoot) / len(first, root), `${band} ${type}`).toBeCloseTo(1.4, 1);
        // Leans further back (toward -z) about its root, whichever way the crown pointed.
        const lean = (p: { y: number; z: number }, o: { y: number; z: number }) =>
          Math.atan2(p.z - o.z, p.y - o.y);
        expect(lean(run, runRoot), `${band} ${type}`).toBeLessThan(lean(first, root) - 0.2);
        // The head's sculpt box still holds the point.
        const v = SECOND_VARIANTS.find((x) => x.id === `second-${band}-${type}-run`)!;
        expect(v.spec.head.box[1].y).toBeGreaterThan(run.y);
        expect(v.spec.head.box[0].z).toBeLessThan(run.z);
      }
  });
});
