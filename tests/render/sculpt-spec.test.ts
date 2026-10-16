import { describe, expect, it } from 'vitest';
import { SCULPT_RES } from '../../src/config/tuning';
import { KEEPER_SPEC } from '../../src/samples/keeper-spec';
import { ALL_VARIANTS } from '../../src/samples/nubbin-variant-catalogue';
import {
  parseSculpt,
  sculptCacheKey,
  sculptCodeVersion,
  sculptData,
  sculptHash,
  serializeSculpt,
  type SculptData,
} from '../../src/samples/sculpt-spec';
import { sculpt, SCULPT_BAND } from '../../src/samples/sculpted';
import {
  sculptSurface,
  speciesSurfaces,
  surfaceData,
  type SpeciesSpec,
} from '../../src/samples/species';
import { FENNEL_SPEC, NUBBIN_SPEC } from '../../src/samples/species-data';
import { BOLDER_SPEC, MOSSLING_SPEC, ROSTER } from '../../src/samples/species-roster';
import { predictBuildMs, resForBenchmark } from '../../src/render3d/sculpt-res';

/**
 * The sculpt spec has to survive a trip to a worker as JSON and come back as exactly the
 * geometry the live spec makes, and its cache key has to change whenever the geometry
 * would and stay put when it would not.
 */
const every = (spec: SpeciesSpec, quality = 1): SculptData[] =>
  speciesSurfaces(spec).map((s) => surfaceData(spec, s, quality));

const attrs = (g: ReturnType<typeof sculpt>) =>
  Object.fromEntries(Object.entries(g.attributes).map(([k, a]) => [k, Array.from(a.array)]));

describe('sculpt spec serialiser', () => {
  it('serialises every species, variant and the Keeper', () => {
    const specs = [NUBBIN_SPEC, KEEPER_SPEC, ...ROSTER, ...ALL_VARIANTS.map((v) => v.spec)];
    for (const spec of specs) {
      for (const d of every(spec)) {
        const json = serializeSculpt(d);
        expect(parseSculpt(json)).toEqual(d);
      }
    }
  });

  it('names the rules a spec uses: shades, colour rules, fur', () => {
    const fennel = every(FENNEL_SPEC)[0]!;
    expect(fennel.shades.map((s) => s.rule)).toEqual(
      ['gradient', 'marks', 'stripes'].filter((r) => r !== 'marks' || FENNEL_SPEC.marks.length > 0),
    );
    expect(fennel.color?.rule).toBe('fennel.colors');
    expect(fennel.fur?.rule).toBe('fennel.fur');
    expect(every(BOLDER_SPEC)[0]!.color?.rule).toBe('bolder.colors');
    const mossCap = every(MOSSLING_SPEC)[1]!;
    expect(mossCap.shades.filter((s) => s.rule === 'spots').length).toBe(2);
  });

  it('marches the same geometry from parsed data as from the live spec', () => {
    for (const spec of [NUBBIN_SPEC, FENNEL_SPEC, MOSSLING_SPEC]) {
      const surface = { ...speciesSurfaces(spec)[0]!, res: 28 };
      const live = attrs(sculptSurface(spec, surface));
      const data = parseSculpt(serializeSculpt(surfaceData(spec, surface)));
      expect(attrs(sculptData(data))).toEqual(live);
    }
    // Fennel carries fur attributes through the trip.
    const f = sculptData(
      parseSculpt(
        serializeSculpt(
          surfaceData(FENNEL_SPEC, {
            ...speciesSurfaces(FENNEL_SPEC)[0]!,
            res: 24,
          }),
        ),
      ),
    );
    expect(f.getAttribute('furLen')).toBeTruthy();
    expect(f.getAttribute('glow')).toBeTruthy();
  });

  it('scales the grid by quality, never below 24', () => {
    const full = every(NUBBIN_SPEC)[0]!;
    expect(full.res).toBe(104);
    expect(every(NUBBIN_SPEC, 64 / 104)[0]!.res).toBe(64);
    expect(every(NUBBIN_SPEC, 0.01)[0]!.res).toBe(24);
  });
});

describe('sculpt cache key', () => {
  const base = every(NUBBIN_SPEC)[0]!;
  const clone = (): SculptData => parseSculpt(serializeSculpt(base));

  it('files by look, surface and resolution', () => {
    expect(sculptCacheKey('variant:child~egg:gold', 3, base).key).toBe(
      'variant:child~egg:gold#3@104',
    );
  });

  it('is stable for equal specs and carries the code version', () => {
    const a = sculptCacheKey('nubbin', 0, base);
    const b = sculptCacheKey('nubbin', 0, clone());
    expect(b).toEqual(a);
    expect(a.version.startsWith(`${sculptCodeVersion()}:`)).toBe(true);
    expect(sculptHash(base)).toMatch(/^[0-9a-f]{14}$/);
  });

  it('changes when anything that shapes the geometry changes', () => {
    const v = (d: SculptData) => sculptCacheKey('nubbin', 0, d).version;
    const seen = new Set([v(base)]);
    const colour = clone();
    colour.prims[0]!.color = '#123456';
    const moved = clone();
    moved.prims[0]!.a[1] += 0.01;
    const blend = clone();
    blend.blend += 0.01;
    const shade = clone();
    (shade.shades[0]!.args as number[])[0] = 1.3;
    const grid = clone();
    grid.res = 64;
    for (const d of [colour, moved, blend, shade, grid]) {
      expect(seen.has(v(d))).toBe(false);
      seen.add(v(d));
    }
  });
});

describe('sculpt resolution benchmark', () => {
  it('predicts growth with a power of the grid', () => {
    expect(predictBuildMs(10, SCULPT_RES.benchRes * 2, 1)).toBeCloseTo(
      10 * SCULPT_RES.openingWork * 2 ** SCULPT_RES.exponent,
    );
  });

  it('matches the calibration: a desktop gets 104, a mid-range phone 64', () => {
    // Maor's PC reads 15-23 ms at boot with 4 workers. A 2022 mid-range phone is taken
    // as about four times slower on one core, with 4 workers too (8 cores); unmeasured.
    expect(resForBenchmark(23, 4)).toBe(104);
    expect(resForBenchmark(80, 4)).toBe(64);
    expect(resForBenchmark(120, 4)).toBe(48);
  });

  it('gives fast devices the authored grid and slow ones a coarser one', () => {
    expect(resForBenchmark(0.5, 4)).toBe(104);
    const steps = [1, 2, 4, 8, 16, 32, 64].map((ms) => resForBenchmark(ms, 3));
    for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeLessThanOrEqual(steps[i - 1]!);
    expect(resForBenchmark(1000, 1)).toBe(48);
  });
});

describe('sculpt speed-ups keep the mesh', () => {
  const surfaces = [NUBBIN_SPEC, FENNEL_SPEC, BOLDER_SPEC, MOSSLING_SPEC, KEEPER_SPEC].flatMap(
    (spec) => speciesSurfaces(spec).map((s) => surfaceData(spec, s, 36 / 104)),
  );

  it('the narrow band gives the same mesh as evaluating every voxel', () => {
    for (const d of surfaces) {
      SCULPT_BAND.on = false;
      const full = attrs(sculptData(d));
      SCULPT_BAND.on = true;
      expect(attrs(sculptData(d))).toEqual(full);
    }
  });

  it('welds the soup into an indexed mesh with every vertex used and none repeated', () => {
    for (const d of surfaces.slice(0, 8)) {
      const g = sculptData(d);
      const index = g.index!.array;
      const pos = g.getAttribute('position');
      expect(index.length % 3).toBe(0);
      expect(pos.count).toBeLessThan(index.length);
      const used = new Uint8Array(pos.count);
      for (const i of index) used[i] = 1;
      expect(used.every((u) => u === 1)).toBe(true);
      const seen = new Set<string>();
      for (let i = 0; i < pos.count; i++) seen.add(`${pos.getX(i)},${pos.getY(i)},${pos.getZ(i)}`);
      expect(seen.size).toBe(pos.count);
    }
  });
});
