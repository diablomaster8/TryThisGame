import { Group, type Mesh, type MeshStandardMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { PART_STYLES } from '../../src/render/sprites/parts';
import { DYE_COLORS } from '../../src/render/sprites/chao';
import { color } from '../../src/render/sprites/palette';
import { keeperOutfit } from '../../src/render/keeper-look';
import { characterLook, nubbinLook } from '../../src/render3d/creature-pool';
import { DRESS_HATS, Dresser } from '../../src/render3d/dress';
import { keeperColours, knownLook, specForKey } from '../../src/render3d/looks';
import { PART_SLOTS, partsModBody } from '../../src/samples/nubbin-critter-parts';
import { variantById } from '../../src/samples/nubbin-variant-catalogue';
import { paletteOf } from '../../src/samples/nubbin-variants';
import { JEWELS } from '../../src/samples/nubbin-variants-colour';
import { parseSculpt, sculptData, serializeSculpt } from '../../src/samples/sculpt-spec';
import {
  speciesSurfaces,
  surfaceData,
  type Rigged,
  type SpeciesSpec,
} from '../../src/samples/species';
import { HAT_PRIZES, LOOK_PRIZES } from '../../src/minigames/race/screen';
import { createEgg, JEWEL_EGG_COLORS } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { HAT_IDS } from '../../src/sim/shop';
import { TRAINERS } from '../../src/sim/trainers';
import type { Nubbin, PartSlot } from '../../src/sim/types';

/**
 * Full 3D dresses a Nubbin from its look key and the Dresser: critter parts, character looks,
 * jewels and the Keeper's outfit go through `specForKey` without falling back to the base,
 * keys are deterministic, and every hat the pixel view draws has a 3D counterpart.
 */
const slotOf = (id: string): PartSlot => {
  const tail = id.split('-').pop()!;
  return (
    tail === 'ears' || tail === 'tail' || tail === 'arms' || tail === 'back' ? tail : 'ears'
  ) as PartSlot;
};

const partKey = (slot: PartSlot, id: string) =>
  PART_SLOTS.map((s) => (s === slot ? id : '-')).join(',');

const names = (spec: SpeciesSpec) => spec.parts.map((p) => p.name);

/**
 * Serialises every surface as the sculpt farm does before posting it to a worker, and marches
 * it back from the parsed data as the worker would (at a low grid), expecting a real surface.
 */
const serialises = (spec: SpeciesSpec) => {
  for (const s of speciesSurfaces(spec)) {
    const data = parseSculpt(serializeSculpt(surfaceData(spec, s, 0.3)));
    expect(sculptData(data).getAttribute('position').count).toBeGreaterThan(0);
  }
};

function nubbin(over: Partial<Nubbin> = {}): Nubbin {
  const n = createEgg('n1', { x: 0, z: 0 }, Rng.fromSeed(3));
  return { ...n, stage: 'child', alignment: 0, ...over };
}

const adultForm = (band: 'sun' | 'moon' | 'neutral', type: 'run' | 'swim' | 'normal') => ({
  band,
  type,
  second: null,
  leanAtEvolution: { normal: 0, swim: 0, fly: 0, run: 0, power: 0 },
});

describe('critter parts in 3D', () => {
  const bases = [
    'variant:child',
    'variant:first-sun-run',
    'variant:eternal-moon',
    'variant:look-fox',
  ];

  it('builds every part id on children, adults, Eternals and looks', () => {
    for (const [id] of Object.entries(PART_STYLES)) {
      const slot = slotOf(id);
      for (const base of bases) {
        const plain = specForKey(base);
        const spec = specForKey(`${base}~parts:${partKey(slot, id)}`);
        expect(spec, `${base} ${id}`).not.toBe(plain);
        const added = spec.parts.filter((p) => !plain.parts.includes(p));
        const prefix = { ears: 'ear', tail: 'tail', arms: 'arm', back: 'back' }[slot];
        expect(added.length, `${base} ${id}`).toBeGreaterThan(0);
        for (const p of spec.parts.filter((q) => q.name.startsWith(prefix))) {
          // Every primitive inside its box, so nothing is clipped by the sculpt grid.
          for (const q of p.prims) {
            expect(q.a.x).toBeGreaterThan(p.box[0].x);
            expect(q.a.x).toBeLessThan(p.box[1].x);
            expect(q.a.y).toBeGreaterThan(p.box[0].y);
            expect(q.a.y).toBeLessThan(p.box[1].y);
          }
        }
        if (slot === 'back') expect(spec.wings).toBeUndefined();
      }
    }
  });

  it('serialises parts for the sculpt workers (no unnamed hooks)', () => {
    serialises(
      specForKey(
        'variant:first-neutral-swim~parts:rabbit-ears,raccoon-tail,gorilla-arms,peacock-back',
      ),
    );
  });

  it('colours a part from its style', () => {
    const spec = specForKey('variant:child~parts:-,tiger-tail,-,-');
    const tail = spec.parts.find((p) => p.name === 'tail')!;
    expect(tail.prims.map((p) => p.color)).toContain(color(PART_STYLES['tiger-tail']!.color));
    expect(tail.prims.map((p) => p.color)).toContain(color(PART_STYLES['tiger-tail']!.accent));
  });

  it('keeps the slot names the poser animates', () => {
    const spec = specForKey('variant:child~parts:otter-ears,otter-tail,bear-arms,parrot-back');
    for (const n of ['earL', 'earR', 'tail', 'armL', 'armR', 'backL', 'backR'])
      expect(names(spec)).toContain(n);
    expect(names(specForKey('variant:child~parts:peacock-ears,-,-,-'))).toContain('earCrest');
  });
});

describe('character looks, jewels and the Eternals', () => {
  it('every character look resolves, on a child and over an adult form', () => {
    for (const id of LOOK_PRIZES) {
      expect(variantById(id), id).toBeTruthy();
      expect(knownLook(`variant:${id}`)).toBe(true);
      const look = paletteOf(variantById(id)!.spec);
      const adult = specForKey(`variant:first-moon-swim~look:${id}`);
      expect(adult.torso.prims.find((p) => p.tag === 'belly')!.color).toBe(look.body);
      const eternal = specForKey(`variant:eternal-sun~look:${id}`);
      expect(eternal.torso.prims.find((p) => p.tag === 'belly')!.color).toBe(look.body);
    }
  });

  it('every jewel gives its gem palette and facets on any Chao form', () => {
    expect(JEWELS.map((j) => j.name).sort()).toEqual([...JEWEL_EGG_COLORS].sort());
    for (const j of JEWELS)
      for (const base of ['variant:child', 'variant:first-sun-power', 'variant:eternal-moon']) {
        const spec = specForKey(`${base}~egg:${j.name}`);
        expect(spec.surface.detail, `${base} ${j.name}`).toBe('facet');
        expect(spec.torso.prims.find((p) => p.tag === 'belly')!.color).toBe(j.body);
        expect(spec.eyes.iris).toBe(j.crownShade);
      }
  });

  it('the Eternals exist as the three Chaos forms', () => {
    for (const band of ['sun', 'moon', 'neutral'])
      expect(variantById(`eternal-${band}`)).toBeTruthy();
    const hero = variantById('eternal-sun')!.spec;
    expect(hero.ball?.shape).toBe('halo');
    expect(hero.wings?.shape).toBe('feather');
    expect(variantById('eternal-moon')!.spec.ball?.shape).toBe('spikes');
  });
});

describe('nubbinLook keys', () => {
  it('a child with parts', () => {
    const n = nubbin({
      parts: { ears: 'rabbit-ears', tail: null, arms: null, back: 'condor-back' },
    });
    expect(nubbinLook(n).key).toBe('variant:child~parts:rabbit-ears,-,-,condor-back');
    expect(nubbinLook(n).key).toBe(nubbinLook({ ...n }).key);
  });

  it('a jewel adult', () => {
    const n = nubbin({ stage: 'adult', eggColor: 'ruby', form: adultForm('sun', 'run') });
    expect(nubbinLook(n).key).toBe('variant:first-sun-run~egg:ruby');
    expect(specForKey(nubbinLook(n).key).surface.detail).toBe('facet');
  });

  it('an Eternal with a character look and parts', () => {
    const n = nubbin({
      stage: 'adult',
      eggColor: 'sky',
      form: adultForm('neutral', 'normal'),
      eternal: 'sun',
      hat: 'look-fox',
      parts: { ears: null, tail: 'skunk-tail', arms: null, back: null },
    });
    expect(characterLook(n)).toBe('look-fox');
    // The look's palette replaces the egg colour, as in the pixel view.
    expect(nubbinLook(n).key).toBe('variant:eternal-sun~look:look-fox~parts:-,skunk-tail,-,-');
  });

  it('a child with a character look wears the whole figure', () => {
    const n = nubbin({ hat: 'look-rose', shiny: true });
    expect(nubbinLook(n).key).toBe('variant:look-rose~shiny');
  });

  it('parts body is empty when no slot is set', () => {
    expect(partsModBody({ ears: null, tail: null, arms: null, back: null })).toBe('');
  });
});

describe('the Keeper look rule in 3D', () => {
  it('dresses the Keeper in each trainer outfit with the side trim', () => {
    for (const t of TRAINERS)
      for (const side of ['sun', 'moon'] as const) {
        const spec = specForKey(`keeper-${side}~npc:${t.id}`);
        const o = keeperOutfit(t.id, side);
        const all = [spec.torso, spec.head, ...spec.parts].flatMap((p) => p.prims);
        const tee = all.find((p) => p.tag === 'tee');
        expect(tee?.color, `${t.id} ${side}`).toBe(color(o.shirt));
        expect(all.find((p) => p.tag === 'hair')!.color).toBe(color(o.hair));
        expect(keeperColours(t.id, side).trim).toBe(color(o.shirtShade));
      }
  });

  it('story Keepers (visitors) dress too', () => {
    const spec = specForKey('keeper-moon~npc:corvin');
    expect(spec.name).toBe('Moon Keeper');
    expect(keeperColours('corvin', 'moon').tee).toBe(color(keeperOutfit('corvin', 'moon').shirt));
  });
});

describe('the Dresser', () => {
  const rig = (key: string): Rigged => {
    const group = new Group();
    group.userData.lookKey = key;
    return { group, bones: { head: new Group(), hips: new Group() } } as unknown as Rigged;
  };
  const meshes = (g: Group) => {
    const out: Mesh[] = [];
    g.traverse((o) => {
      if ((o as Mesh).isMesh) out.push(o as Mesh);
    });
    return out;
  };

  it('draws every hat the pixel view has', () => {
    for (const h of [...HAT_IDS, ...HAT_PRIZES, ...LOOK_PRIZES]) expect(DRESS_HATS).toContain(h);
  });

  it('dresses, dyes, skips unchanged Nubbins and strips', () => {
    const d = new Dresser();
    const r = rig('variant:first-sun-run');
    const n = nubbin({
      stage: 'adult',
      form: adultForm('sun', 'run'),
      hat: 'straw',
      hatDye: 'sky',
      scarf: 'rose',
      glasses: true,
    });
    d.update(r, n);
    const head = r.bones.head!;
    expect(head.children.length).toBe(3);
    const first = head.children[0];
    d.update(r, n);
    expect(head.children[0]).toBe(first);
    const cols = meshes(head).map((m) => (m.material as MeshStandardMaterial).color.getHexString());
    expect(cols).toContain(color(DYE_COLORS.sky).slice(1));
    // A look on an adult hangs its accessory; the fox's tails go on the hips.
    d.update(r, { ...n, hat: 'look-fox', scarf: null, glasses: false });
    expect(r.bones.hips!.children.length).toBe(1);
    expect(head.children.length).toBe(0);
    // A child with a look wears the figure, not a hat.
    const c = rig('variant:look-fox');
    d.update(c, nubbin({ hat: 'look-fox' }));
    expect(c.bones.head!.children.length + c.bones.hips!.children.length).toBe(0);
    d.strip(r);
    expect(r.bones.hips!.children.length).toBe(0);
    d.dispose();
  });

  it('puts every hat on every special form without error', () => {
    const d = new Dresser();
    for (const key of [
      'variant:child',
      'variant:eternal-moon',
      'variant:eternal-neutral',
      'variant:look-dream',
    ])
      for (const hat of DRESS_HATS) {
        const r = rig(key);
        d.update(r, nubbin({ stage: 'adult', form: adultForm('neutral', 'normal'), hat }));
        expect(r.bones.head!.children.length + r.bones.hips!.children.length).toBe(1);
      }
    d.dispose();
  });
});
