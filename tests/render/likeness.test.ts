import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { sdf, type Prim } from '../../src/samples/sculpted';
import { ALL_VARIANTS } from '../../src/samples/nubbin-variant-catalogue';
import { CHILD, NEUTRAL_ADULT, paletteOf } from '../../src/samples/nubbin-variants';
import { CHILD_PART_SCALE, withCritterParts } from '../../src/samples/nubbin-critter-parts';
import type { SpeciesSpec } from '../../src/samples/species';
import {
  CHARACTER_LOOKS,
  CHILD_NEUTRAL,
  drawChao,
  lookOf,
  poseFor,
} from '../../src/render/sprites/chao';
import { C, color } from '../../src/render/sprites/palette';
import { LINEUP_LOOKS } from '../../src/samples/nubbin-variants-lineup';
import { NUBBIN_SPEC } from '../../src/samples/species-data';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { artSpec } from '../../src/render3d/art-species';
import { SPECIES } from '../../src/sim/species';
import { drawCreature } from '../../src/render/sprites/creature';
import { BIRD_SPAN } from '../../src/render/sprites/creature-bird';
import { FLAME_PART, flameScale } from '../../src/render3d/art-flame';

/**
 * Likeness checks on the Chao-line 3D specs (LOOK-67): small data tests that catch the
 * regressions found by eye before, such as the crown shade painting over the yellow tip.
 */

/** Points on a tip prim's surface that the rest of the head does not cover. */
function exposedTipPoints(spec: SpeciesSpec, tip: Prim): THREE.Vector3[] {
  const others = spec.head.prims.filter((p) => p !== tip);
  const rx = tip.radii?.x ?? tip.r;
  const ry = tip.radii?.y ?? tip.r;
  const rz = tip.radii?.z ?? tip.r;
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < 12; i++)
    for (let j = 0; j < 24; j++) {
      const th = ((i + 0.5) / 12) * Math.PI;
      const ph = (j / 24) * Math.PI * 2;
      const p = new THREE.Vector3(
        tip.a.x + rx * Math.sin(th) * Math.cos(ph),
        tip.a.y + ry * Math.cos(th),
        tip.a.z + rz * Math.sin(th) * Math.sin(ph),
      );
      if (others.every((o) => sdf(p, o) > 0.02)) out.push(p);
    }
  return out;
}

describe('Chao likeness (3D specs)', () => {
  const chao = ALL_VARIANTS.filter((v) => v.spec.head.prims.some((p) => p.tag === 'tip'));

  it('has Chao variants to check', () => {
    expect(chao.length).toBeGreaterThan(20);
  });

  it('paints every tip in its band tip colour and never under a mark', () => {
    const bad: string[] = [];
    for (const v of chao) {
      const tip = paletteOf(v.spec).tip;
      for (const t of v.spec.head.prims.filter((p) => p.tag === 'tip')) {
        // The children and templates wear the band's tip; adults take the type hue there.
        if (v.family === 'child' && t.color !== tip)
          bad.push(`${v.id}: tip ${t.color}, band tip ${tip}`);
        const pts = exposedTipPoints(v.spec, t);
        if (pts.length === 0) bad.push(`${v.id}: tip hidden inside the head`);
        for (const m of v.spec.marks) {
          const soft = m.soft ?? 0.06;
          const mark = { ...m, r: m.r ?? 0, tag: 'mark' } as Prim;
          const worst = Math.min(...pts.map((p) => sdf(p, mark)));
          if (worst < soft) bad.push(`${v.id}: mark ${m.color} reaches the tip`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('Chao likeness (pixel)', () => {
  it('rocks the head a pixel on the walk contact frames (the waddle)', () => {
    expect(poseFor('walk', 0).rock).toBe(1);
    expect(poseFor('walk', 3).rock).toBe(-1);
    expect(poseFor('walk', 1).rock ?? 0).toBe(0);
    const look = lookOf(CHILD_NEUTRAL);
    const a = drawChao('front', { ...poseFor('walk', 0), rock: 0 }, look);
    const b = drawChao('front', poseFor('walk', 0), look);
    let diff = 0;
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) if (a.get(x, y) !== b.get(x, y)) diff++;
    expect(diff).toBeGreaterThan(4);
  });

  it('wears no belly patch or cheek blush at rest, and blushes when loved', () => {
    const look = lookOf(CHILD_NEUTRAL);
    const count = (c: number, pose: string) => {
      const pc = drawChao('front', poseFor(pose as 'idle', 0), look);
      let n = 0;
      for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (pc.get(x, y) === c) n++;
      return n;
    };
    expect(count(C.roseLight, 'idle')).toBe(0);
    expect(count(C.roseLight, 'love')).toBeGreaterThan(0);
    const two = drawChao(
      'front',
      poseFor('idle', 0),
      lookOf({ ...CHILD_NEUTRAL, bellyPatch: C.white }),
    );
    const plain = drawChao('front', poseFor('idle', 0), look);
    let patch = 0;
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) if (two.get(x, y) !== plain.get(x, y)) patch++;
    expect(patch).toBeGreaterThan(10);
  });
});

describe('child critter parts (LOOK-66)', () => {
  it('draws the same part smaller on a child than on its adult form', () => {
    const parts = { ears: 'rabbit-ears', tail: null, arms: null, back: null };
    const ink = (pc: { get(x: number, y: number): number }) => {
      let n = 0;
      for (let y = 0; y < 14; y++) for (let x = 0; x < 32; x++) if (pc.get(x, y) === C.pale) n++;
      return n;
    };
    const child = drawChao('front', poseFor('idle', 0), lookOf(CHILD_NEUTRAL, null, null, parts));
    const adult = drawChao(
      'front',
      poseFor('idle', 0),
      lookOf(CHILD_NEUTRAL, 'normal', null, parts),
    );
    expect(ink(child)).toBeLessThan(ink(adult));
  });

  it('shrinks a child spec’s sculpted parts about their pivots', () => {
    const child = withCritterParts(CHILD, { ears: 'rabbit-ears' });
    const adult = withCritterParts(NEUTRAL_ADULT, { ears: 'rabbit-ears' });
    const size = (s: SpeciesSpec) =>
      s.parts.filter((p) => p.name.startsWith('ear')).flatMap((p) => p.prims)[0]!;
    const r = (q: Prim) => q.radii?.x ?? q.r;
    expect(r(size(child)) / r(size(adult))).toBeCloseTo(CHILD_PART_SCALE);
  });
});

describe('likeness suite (LOOK-67)', () => {
  it('keeps the Chao head 1.25-1.45x the body width', () => {
    // Power forms widen the body on purpose (their tell), so they are left out.
    for (const v of ALL_VARIANTS.filter((x) => x.family !== 'special' && !x.id.includes('power'))) {
      const head = v.spec.head.prims.find((p) => p.tag === 'head');
      const body = v.spec.torso.prims.find((p) => p.tag === 'belly');
      if (!head?.radii || !body?.radii) continue;
      // Run forms lean the body to ×0.88 on purpose (LOOK-19), so their head reads wider.
      const lean = v.id.includes('run') ? 0.88 : 1;
      const k = (head.radii.x / body.radii.x) * lean;
      expect(k, v.id).toBeGreaterThanOrEqual(1.25);
      expect(k, v.id).toBeLessThanOrEqual(1.45);
    }
  });

  it('gives the child the same wing and tip colour in pixel and 3D', () => {
    // CIE76 colour difference in Lab (D65).
    const lab = (hex: string) => {
      const c = new THREE.Color(hex); // linear RGB
      const x = (c.r * 0.4124 + c.g * 0.3576 + c.b * 0.1805) / 0.95047;
      const y = c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
      const z = (c.r * 0.0193 + c.g * 0.1192 + c.b * 0.9505) / 1.08883;
      const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
      return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))] as const;
    };
    const dE = (a: string, b: string) => {
      const p = lab(a);
      const q = lab(b);
      return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    };
    expect(dE(color(CHILD_NEUTRAL.wing), NUBBIN_SPEC.wings!.color)).toBeLessThanOrEqual(8);
    const tip = NUBBIN_SPEC.head.prims.find((p) => p.tag === 'tip')!.color;
    expect(dE(color(CHILD_NEUTRAL.tip), tip)).toBeLessThanOrEqual(8);
  });

  it('has every character look in both modes', () => {
    const pixel = Object.keys(CHARACTER_LOOKS).sort();
    const sculpted = LINEUP_LOOKS.map((v) => v.id).sort();
    expect(pixel).toEqual(sculpted);
  });
});

describe('species eyes in 3D (LOOK-40)', () => {
  it('gives each pixel eye type its own 3D eye', () => {
    const byType = new Map<string, string>();
    for (const [id, art] of Object.entries(SPECIES_ART)) {
      if (art.irisColor || byType.has(art.eyes)) continue;
      const e = artSpec(id, art).eyes;
      byType.set(art.eyes, JSON.stringify([e.style, e.lid, e.irisScale, e.tall, e.roll]));
    }
    expect(byType.size).toBeGreaterThanOrEqual(5);
    expect(new Set(byType.values()).size).toBe(byType.size);
  });

  it('keeps a species iris colour where it is part of the likeness', () => {
    expect(artSpec('dinolet', SPECIES_ART.dinolet!).eyes.iris).toBe('#58a838');
  });

  it('gives the snakes and the Charmander line slit pupils in both modes', () => {
    for (const id of ['coilet', 'hoodcoil', 'cinderkit', 'cinderclaw', 'cinderwing']) {
      expect(SPECIES_ART[id]!.pupil).toBe('slit');
      expect(artSpec(id, SPECIES_ART[id]!).eyes.pupil).toBe('slit');
    }
    expect(artSpec('zapkin', SPECIES_ART.zapkin!).eyes.pupil).toBeUndefined();
  });
});

describe('Gen-1 likeness fixes (LOOK-39)', () => {
  it('swims Magikarp, Goldeen and Seaking on the fish plan', () => {
    for (const id of ['flopfish', 'silkfin', 'hornfin']) expect(SPECIES_ART[id]!.plan).toBe('fish');
  });

  it('makes Snorlax and Gengar wider in both modes', () => {
    for (const id of ['snoozelump', 'spookgrin']) {
      const art = SPECIES_ART[id]!;
      const plain = { ...art };
      delete plain.girth;
      const w = (s: typeof art) => artSpec(id, s).torso.prims[0]!;
      expect(art.girth).toBeGreaterThan(1.2);
      expect(JSON.stringify(w(art))).not.toBe(JSON.stringify(w(plain)));
    }
  });
});

describe('digital-line likeness fixes (LOOK-41)', () => {
  it('dresses Yukidarumon in a bucket hat and mitts, and paints Monzaemon a chest heart', () => {
    const snow = SPECIES_ART.snowlump!;
    expect(snow.addons?.map((e) => e.kind)).toContain('bucketHat');
    expect(snow.arms).toBe('boxing');
    expect(SPECIES_ART.hugbear!.addons?.map((e) => e.kind)).toContain('heart');
    const marks = artSpec('hugbear', SPECIES_ART.hugbear!).marks;
    const plain = artSpec('hugbear', { ...SPECIES_ART.hugbear!, addons: [] }).marks;
    expect(marks.length).toBe(plain.length + 3);
  });
});

/**
 * The reference table for LOOK-67 check 3: every species whose reference walks on four
 * legs, by its inspiration (`ref` in the sim's species data, never shown).
 */
const FOUR_LEGGED = [
  'Bulbasaur',
  'Ivysaur',
  'Venusaur',
  'Vulpix',
  'Ninetales',
  'Growlithe',
  'Arcanine',
  'Ponyta',
  'Rapidash',
  'Rhyhorn',
  'Tauros',
  'Eevee',
  'Vaporeon',
  'Jolteon',
  'Flareon',
  'Persian',
  'Slowpoke',
  'Lapras',
];

describe('likeness suite: four-legged references (LOOK-67)', () => {
  it('draws every four-legged reference on the quad plan', () => {
    const byRef = new Map(SPECIES.map((s) => [s.ref, s.id]));
    for (const ref of FOUR_LEGGED) {
      const id = byRef.get(ref);
      expect(id, ref).toBeDefined();
      expect(SPECIES_ART[id!]!.plan, `${ref} (${id})`).toBe('quad');
    }
  });
});

describe('bird plan (LOOK-39)', () => {
  const birds = ['frostplume', 'boltplume', 'blazeplume'];
  const box = (id: string, angle: 'front' | 'side') => {
    const pc = drawCreature(angle, poseFor('idle', 0), SPECIES_ART[id]!);
    return pc.bounds()!;
  };

  it('puts the three legendary birds on the bird plan, each in its own dress', () => {
    for (const id of birds) expect(SPECIES_ART[id]!.plan).toBe('bird');
    const dress = birds.map((id) => JSON.stringify(SPECIES_ART[id]!.bird));
    expect(new Set(dress).size).toBe(3);
  });

  it('spreads the wings well past the body from the front', () => {
    for (const id of birds) {
      const b = box(id, 'front');
      // The body is about 9 px wide at this size; the span is BIRD_SPAN times that.
      expect(b.w, id).toBeGreaterThanOrEqual(Math.round(9 * BIRD_SPAN) - 2);
      expect(b.h, id).toBeGreaterThan(b.w * 0.8);
    }
  });

  it('stands on thin legs with a small head in 3D, the wings big and raised', () => {
    for (const id of birds) {
      const s = artSpec(id, SPECIES_ART[id]!);
      expect(s.wings?.size, id).toBeGreaterThan(1.5);
      expect(s.wings?.raise, id).toBeGreaterThan(0);
      expect(s.parts.filter((p) => p.name.startsWith('leg')).length, id).toBe(2);
      expect(
        s.parts.some((p) => p.name === 'tail'),
        id,
      ).toBe(true);
    }
  });
});

describe('flame tails and raised wings (LOOK-10)', () => {
  it('gives every flame tail a flame part of its own and a flicker hook', () => {
    for (const id of ['cinderkit', 'cinderclaw', 'cinderwing']) {
      const s = artSpec(id, SPECIES_ART[id]!);
      expect(
        s.parts.map((p) => p.name),
        id,
      ).toContain(FLAME_PART);
      expect(s.extras, id).toBeDefined();
    }
  });

  it('flickers between 0.9 and 1.1, still when asked', () => {
    const v = Array.from({ length: 60 }, (_, i) => flameScale(i / 360));
    expect(Math.min(...v)).toBeGreaterThanOrEqual(0.9 - 1e-9);
    expect(Math.max(...v)).toBeLessThanOrEqual(1.1 + 1e-9);
    expect(Math.max(...v) - Math.min(...v)).toBeGreaterThan(0.19);
    expect(flameScale(0.04, true)).toBe(1);
  });

  it('sweeps Charmander’s flame out past the head, so it shows from the front', () => {
    const s = artSpec('cinderkit', SPECIES_ART.cinderkit!);
    const head = s.head.prims.find((p) => p.tag === 'head')!;
    const flame = s.parts.find((p) => p.name === FLAME_PART)!;
    const x = Math.max(...flame.prims.map((p) => Math.abs((p.b ?? p.a).x)));
    expect(x).toBeGreaterThan(head.radii!.x);
  });

  it('raises Charizard’s wings 20 degrees', () => {
    const w = artSpec('cinderwing', SPECIES_ART.cinderwing!).wings!;
    expect(w.raise! * (180 / Math.PI)).toBeCloseTo(20, 0);
  });
});

describe('weakest-likeness fixes, round 9 (LOOK-39, LOOK-41)', () => {
  it('gives Charizard a muzzle on the tall plan, Gyarados its open mouth, Tauros three tails', () => {
    expect(SPECIES_ART.cinderwing!.plan).toBe('tall');
    expect(SPECIES_ART.cinderwing!.extras).toContain('dinoSnout');
    expect(SPECIES_ART.stormwyrm!.addons?.map((e) => e.kind)).toContain('gape');
    const tails = SPECIES_ART.stampbull!.addons?.find((e) => e.kind === 'foxTails');
    expect(tails?.n).toBe(3);
  });

  it('dresses the digital line: Angemon, the insects, Andromon, Etemon and the slugs', () => {
    const kinds = (id: string) => SPECIES_ART[id]!.addons?.map((e) => e.kind) ?? [];
    expect(kinds('haloknight')).toContain('angelWings');
    expect(SPECIES_ART.haloknight!.gen1b).toContain('staff');
    for (const id of ['thunderbug', 'snapjaw', 'buzzwing']) {
      expect(kinds(id), id).toEqual(expect.arrayContaining(['fourArms', 'insectWings']));
      expect(SPECIES_ART[id]!.legs, id).toBe('long');
    }
    expect(kinds('gearknight')).toContain('tubes');
    expect(SPECIES_ART.groovape!.gen1b).toContain('mic');
    for (const id of ['slugbert', 'muckblob']) {
      expect(kinds(id), id).toEqual(expect.arrayContaining(['gape', 'drool']));
      expect(SPECIES_ART[id]!.eyes, id).toBe('stalk');
    }
  });

  it('sculpts the new parts in 3D', () => {
    const n = (id: string, strip: (a: (typeof SPECIES_ART)[string]) => object) => {
      const art = SPECIES_ART[id]!;
      const full = artSpec(id, art);
      const bare = artSpec(id, { ...art, ...strip(art) });
      const count = (s: typeof full) =>
        s.torso.prims.length +
        s.head.prims.length +
        s.parts.reduce((k, p) => k + p.prims.length, 0);
      return count(full) - count(bare);
    };
    expect(n('haloknight', () => ({ addons: [], gen1b: [] }))).toBeGreaterThan(6);
    expect(n('gearknight', () => ({ addons: [] }))).toBeGreaterThan(2);
    expect(n('groovape', () => ({ gen1b: [] }))).toBeGreaterThan(1);
  });
});
