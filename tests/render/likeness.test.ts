import { describe, expect, it } from 'vitest';
import { likenessOf, overrideIds } from '../../src/render/sprites/likeness';
import { speciesArt } from '../../src/render/sprites/species-art';
import { SPECIES } from '../../src/sim/species';
import { chaoLikenessIds } from '../../src/render/sprites/likeness-chao';
import { likenessSheet } from '../tools/likeness-sheet';

describe('likeness sheets (R0436)', () => {
  it('every species with generic art has a sheet with a plan, colours and parts', () => {
    let n = 0;
    for (const s of SPECIES) {
      if (!speciesArt(s.id)) continue;
      n++;
      const l = likenessOf(s.id)!;
      expect(l.silhouette).toHaveLength(3);
      expect(l.keyColours.length).toBeGreaterThanOrEqual(2);
      expect(l.keyColours.length).toBeLessThanOrEqual(4);
      expect(l.mustHave.length).toBeGreaterThan(0);
      expect(l.plan).toBe(speciesArt(s.id)!.plan);
    }
    expect(n).toBeGreaterThan(150);
  });

  it('every species and Chao form has 3 words, 2-4 hex colours, 2+ parts and a plan', () => {
    const ids = [
      ...SPECIES.filter((s) => s.id !== 'chao' && speciesArt(s.id)).map((s) => s.id),
      ...chaoLikenessIds(),
    ];
    for (const id of ids) {
      const l = likenessOf(id)!;
      expect(l, id).toBeDefined();
      expect(
        l.silhouette.every((w) => w.length > 0),
        id,
      ).toBe(true);
      expect(l.keyColours.length, id).toBeGreaterThanOrEqual(2);
      expect(l.keyColours.length, id).toBeLessThanOrEqual(4);
      for (const c of l.keyColours) expect(c, id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(l.mustHave.length, id).toBeGreaterThanOrEqual(2);
      expect(l.plan.length, id).toBeGreaterThan(0);
    }
  });

  it('every override key is a real species id', () => {
    const real = new Set(SPECIES.map((s) => s.id));
    for (const k of overrideIds()) expect(real.has(k), k).toBe(true);
  });

  it('covers the stage looks', () => {
    for (const id of ['radiant:spookgrin', 'juv:spookgrin']) {
      const l = likenessOf(id)!;
      expect(l, id).toBeDefined();
      expect(l.keyColours.length).toBeLessThanOrEqual(4);
      expect(l.mustHave.length).toBeGreaterThanOrEqual(2);
    }
    expect(likenessOf('radiant:spookgrin')!.mustHave).toContain('gold crystal crown');
    expect(likenessOf('juv:spookgrin')!.mustHave).toContain('chibi round body');
    expect(likenessOf('first-sun-fly~radiant:sun')!.mustHave[0]).toContain('Chaos-tier');
  });
});

describe('Chao likeness sheets (R0436)', () => {
  it('every Chao form has a sheet derived from its variant spec', () => {
    const ids = chaoLikenessIds();
    expect(ids.length).toBeGreaterThan(150);
    for (const id of ids) {
      const l = likenessOf(id)!;
      expect(l, id).toBeDefined();
      expect(l.plan).toBe('chao');
      expect(l.silhouette).toHaveLength(3);
      expect(l.keyColours.length, id).toBeGreaterThanOrEqual(2);
      expect(l.keyColours.length).toBeLessThanOrEqual(4);
      for (const c of l.keyColours) expect(c).toMatch(/^#[0-9a-f]{6}$/);
      expect(l.mustHave).toContain('pointed crown');
    }
  });

  it('tells the forms apart: winged Sun forms, a tailed Eternal Moon, wingless Eternal Neutral', () => {
    expect(likenessOf('eternal-moon')!.mustHave).toContain('tail');
    expect(likenessOf('eternal-neutral')!.mustHave).not.toContain('tiny wings');
    expect(likenessOf('first-sun-swim')!.mustHave).toContain('ears');
    expect(likenessOf('eternal-sun')!.silhouette[0]).toBe('large');
  });

  it('gives each Chao form its own must-have list, from its real look', () => {
    const seen = new Map<string, string>();
    for (const id of chaoLikenessIds()) {
      const key = JSON.stringify(likenessOf(id)!.mustHave);
      expect(seen.get(key), `${id} repeats ${seen.get(key)}`).toBeUndefined();
      seen.set(key, id);
    }
    const m = likenessOf('first-moon-power')!.mustHave;
    expect(m).toEqual(expect.arrayContaining(['horns', 'wide body', 'black body', 'spiked ball']));
    expect(likenessOf('first-sun-swim')!.mustHave).toEqual(
      expect.arrayContaining(['crest fin', 'flipper hands', 'white body', 'halo ball']),
    );
    expect(likenessOf('second-sun-fly-run')!.mustHave.join('|')).toContain(
      'run tell at half strength',
    );
    expect(likenessOf('eternal-moon')!.mustHave.join('|')).toContain('devil tail');
    expect(likenessOf('look-angel')!.mustHave).toContain('four wings and a halo');
    expect(likenessOf('jewel-ruby')!.mustHave).toContain('jewel: ruby');
    expect(likenessOf('colour-sky-shiny')!.mustHave).toContain('shiny glossy sheen');
  });

  it('has nothing for an unknown id', () => {
    expect(likenessOf('no-such-form')).toBeUndefined();
  });
});

describe('likeness contact-sheet printer (R0436)', () => {
  it('prints a block per figure, covering the species and the Chao forms', () => {
    const all = likenessSheet();
    const blocks = all.filter((l) => l.startsWith('== '));
    expect(blocks.length).toBeGreaterThan(300);
    expect(all[all.length - 1]).toBe(`${blocks.length} figures`);
  });

  it('filters by family, id list and text', () => {
    const chao = likenessSheet({ family: 'chao' }).filter((l) => l.startsWith('== '));
    expect(chao.length).toBe(chaoLikenessIds().length);
    const two = likenessSheet({ ids: ['blazehound', 'first-sun-run'] });
    expect(two.filter((l) => l.startsWith('== '))).toHaveLength(2);
    expect(two.join('\n')).toContain('black stripes');
    expect(likenessSheet({ filter: 'zzzz' })).toEqual(['0 figures']);
  });

  it('swatches are plain hexes unless colour is asked for', () => {
    expect(likenessSheet({ ids: ['child'] }).join('\n')).not.toContain('\x1b[');
    expect(likenessSheet({ ids: ['child'], colour: true }).join('\n')).toContain('\x1b[48;2;');
  });
});
