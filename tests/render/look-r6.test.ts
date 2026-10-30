import { describe, expect, it } from 'vitest';
import { birthmarkKey, birthmarkOf } from '../../src/render/birthmark';
import { rarityOf } from '../../src/render/rarity';
import { cocoonShake, revealTurn } from '../../src/render/evolve-reveal';
import { EVOLVE_REVEAL, LIFECYCLE } from '../../src/config/tuning';
import { photoComedy, wrapCaption } from '../../src/ui/photo-comedy';
import { measureText } from '../../src/render/sprites/font';
import type { World } from '../../src/sim/types';
import { FLAVOUR, fieldNote } from '../../src/config/strings-look';
import { keyFlavour } from '../../src/ui/collection';
import { CRITTER_LABELS, ESSENCE_LABELS, SHOP_ITEMS } from '../../src/config/strings';
import { COSMETICS } from '../../src/config/cosmetics';
import { gagAt, gagPersonality, GAGS_IN_PLACE } from '../../src/render/gag-play';
import { CHILD_NEUTRAL, shadowColors } from '../../src/render/sprites/chao';
import { Group, type Mesh } from 'three';
import { Dresser } from '../../src/render3d/dress';
import type { Rigged } from '../../src/samples/species';
import { childLean, leanStep } from '../../src/render/sprites/child-hint';
import { SheetCache } from '../../src/render/sprites/sheets';
import { speciesArt } from '../../src/render/sprites/species-art';
import { nubbinLook } from '../../src/render3d/creature-pool';
import { specForKey } from '../../src/render3d/looks';
import { artSpec } from '../../src/render3d/art-species';
import { paletteOf } from '../../src/samples/nubbin-variants';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { heldEmote, heldMood } from '../../src/render/held-mood';

/** Lane E round 6: the child hint's fade (LOOK-49) and the hopping blobs (LOOK-45). */
const child = (alignment: number) => {
  const n = createEgg('c', { x: 0, z: 0 }, Rng.fromSeed(4));
  n.stage = 'child';
  n.alignment = alignment;
  return n;
};

describe('LOOK-49 child hint', () => {
  it('fades in between 0.2 and 0.5', () => {
    expect(childLean(0.1)).toEqual({ band: 'neutral', k: 0 });
    expect(childLean(0.35).band).toBe('sun');
    expect(childLean(0.35).k).toBeCloseTo(0.5);
    expect(childLean(-0.6)).toEqual({ band: 'moon', k: 1 });
    expect(leanStep(childLean(0.21), 4)).toBe(1);
    expect(leanStep(childLean(0.5), 4)).toBe(4);
  });

  it('gives -0.5, 0 and +0.5 three different looks in both modes', () => {
    const keys = [-0.5, 0, 0.5].map((a) => nubbinLook(child(a)).key);
    expect(keys[0]).toMatch(/^variant:child-moon/);
    expect(keys[1]).toMatch(/^variant:child(~|$)/);
    expect(keys[2]).toMatch(/^variant:child-sun/);
    const pixel = [-0.5, 0, 0.3, 0.5].map((a) => SheetCache.nubbinKey(child(a)));
    expect(new Set(pixel).size).toBe(4);
  });

  it('blends a partial lean between the neutral and the Sun child in 3D', () => {
    const k = nubbinLook(child(0.3)).key;
    expect(k).toContain('~hint:');
    const part = paletteOf(specForKey(k)).body;
    const full = paletteOf(specForKey('variant:child-sun')).body;
    const none = paletteOf(specForKey('variant:child')).body;
    expect(part).not.toBe(full);
    expect(part).not.toBe(none);
  });
});

describe('LOOK-45 hopping blobs', () => {
  it('marks the in-training digital line as hoppers in both modes', () => {
    for (const id of ['fuzzlet', 'chompet', 'jellop', 'hornpuff', 'driftlet', 'nibbit']) {
      const art = speciesArt(id)!;
      expect(art.move, id).toBe('hop');
      // Tokomon keeps its stub feet, tucked while it hops.
      if (id !== 'nibbit') expect(art.legs, id).toBe('none');
      expect(artSpec(id, art).hop, id).toBe(true);
    }
    expect(artSpec('dinolet', speciesArt('dinolet')!).hop).toBeUndefined();
  });
});

describe('LOOK-50 held reactions', () => {
  const held = (affection: number) => {
    const n = child(0);
    n.needs.affection = affection;
    n.behavior.state = 'held';
    return n;
  };
  it('hugs, dangles or flails by affection', () => {
    expect([10, 40, 80].map((a) => heldMood(held(a)))).toEqual(['flail', 'dangle', 'hug']);
    expect([10, 40, 80].map((a) => heldEmote(held(a)))).toEqual(['spiral', null, 'heart']);
  });
  it('a Moon adult held by a Sun Keeper squirms instead of hugging', () => {
    const n = held(90);
    n.stage = 'adult';
    n.form = { band: 'moon', type: 'run' } as NonNullable<typeof n.form>;
    expect(heldMood(n, 'sun')).toBe('dangle');
    expect(heldMood(n, 'moon')).toBe('hug');
  });
  it('is not held on the ground', () => {
    const n = held(80);
    n.behavior.state = 'wander';
    expect(heldEmote(n)).toBeNull();
  });
});

describe('LOOK-54 rebirth stars', () => {
  const rig = (key: string): Rigged => {
    const group = new Group();
    group.userData.lookKey = key;
    return { group, bones: { head: new Group(), hips: new Group() } } as unknown as Rigged;
  };
  const meshCount = (g: Group) => {
    let k = 0;
    g.traverse((o) => {
      if ((o as Mesh).isMesh) k++;
    });
    return k;
  };

  it('a twice-reborn Nubbin wears two stars in 3D, a ring past three', () => {
    const d = new Dresser();
    const r = rig('variant:child');
    const n = child(0);
    n.rebirths = 2;
    d.update(r, n);
    expect(meshCount(r.bones.head as Group)).toBe(4);
    d.update(r, { ...n, rebirths: 5 });
    expect(meshCount(r.bones.head as Group)).toBe(1);
    d.update(r, { ...n, rebirths: 0 });
    expect(meshCount(r.bones.head as Group)).toBe(0);
    d.dispose();
  });

  it('keys the pixel sheet by rebirths (capped at 4)', () => {
    const n = child(0);
    const k = (r: number) => SheetCache.nubbinKey({ ...n, rebirths: r });
    expect(k(2)).not.toBe(k(1));
    expect(k(4)).toBe(k(9));
  });
});

describe('LOOK-64 Shadow face', () => {
  it('lights the ember eyes and rims a bonded one in Pixel', () => {
    expect(specForKey('variant:child~shadow').eyes.glow).toBe(0.4);
    expect(shadowColors(CHILD_NEUTRAL, true).rim).toBeDefined();
    expect(shadowColors(CHILD_NEUTRAL).rim).toBeUndefined();
    const n = child(0);
    n.shadow = true;
    const wary = SheetCache.nubbinKey(n);
    n.bond = true;
    expect(SheetCache.nubbinKey(n)).not.toBe(wary);
  });
});

describe('LOOK-61 hats on every line', () => {
  it('seats a straw hat on Pikachu, Agumon and Snorlax in 3D, never a character look', () => {
    const d = new Dresser();
    for (const id of ['zapkin', 'dinolet', 'snoozelump']) {
      const group = new Group();
      group.userData.lookKey = `art:${id}`;
      const r = { group, bones: { head: new Group(), hips: new Group() } } as unknown as Rigged;
      const n = { ...child(0), species: id, hat: 'straw' };
      d.update(r, n);
      const head = r.bones.head as Group;
      expect(head.children.length, id).toBe(1);
      // On top of the head dome, not inside it.
      expect(head.children[0]!.position.y, id).toBeGreaterThan(0);
      d.update(r, { ...n, hat: 'look-fox' });
      expect(head.children.length + (r.bones.hips as Group).children.length, id).toBe(0);
    }
    d.dispose();
  });
});

describe('FUN-04 personality gags', () => {
  it('plays at least 4 gags in 10 minutes for each personality, in its own set', () => {
    for (const p of ['cheerful', 'shy', 'mischievous', 'lazy'] as const) {
      const n = { ...child(0), id: `nub-${p}`, stage: 'adult' as const, personality: p };
      let plays = 0;
      let was = false;
      for (let t = 0; t < 600_000; t += 100) {
        const g = gagAt(n, t, true);
        if (g && !was) {
          plays++;
          expect(GAGS_IN_PLACE[p]).toContain(g.id);
        }
        was = !!g;
      }
      expect(plays, p).toBeGreaterThanOrEqual(4);
      expect(gagAt(n, 1000, false)).toBeNull();
    }
  });
  it('gives a child its leaning at half the rate, wobbly', () => {
    const c = child(0);
    c.childCare = { pets: 40, throws: 0, feeds: 0 } as typeof c.childCare;
    expect(gagPersonality(c)).toBe('cheerful');
    let g = null;
    for (let t = 0; t < 400_000 && !g; t += 100) g = gagAt(c, t, true);
    expect(g?.look.emote).toBe('question');
  });
});

describe('FUN-28 flavour lines', () => {
  it('has a dry line for every shop item, critter, essence and wearable', () => {
    for (const id of Object.keys(SHOP_ITEMS)) expect(FLAVOUR.shop[id], id).toBeTruthy();
    for (const id of Object.keys(CRITTER_LABELS)) expect(FLAVOUR.critter[id], id).toBeTruthy();
    for (const id of Object.keys(ESSENCE_LABELS)) expect(FLAVOUR.essence[id], id).toBeTruthy();
    for (const c of COSMETICS) expect(FLAVOUR.wear[c.id], c.id).toBeTruthy();
    const all = Object.values(FLAVOUR).flatMap((g) => Object.values(g));
    for (const line of all) {
      expect(line.length, line).toBeLessThanOrEqual(100);
      expect(line, line).not.toMatch(/—/);
    }
  });
});

describe('FUN-69 field notes', () => {
  it('gives every Chao form, its second evolutions and the Eternals a note', () => {
    for (const band of ['sun', 'moon', 'neutral'])
      for (const type of ['swim', 'fly', 'run', 'power', 'normal']) {
        expect(fieldNote(`chao:${band}:${type}`)).toBeTruthy();
        expect(fieldNote(`chao:${band}:${type}:fly`)).toBe(fieldNote(`chao:${band}:${type}`));
        expect(keyFlavour(`chao:${band}:${type}`)).toBeTruthy();
      }
    for (const e of ['sun', 'moon', 'neutral']) expect(fieldNote(`chao:eternal:${e}`)).toBeTruthy();
    expect(keyFlavour('hat:straw')).toBe(FLAVOUR.wear.straw);
  });
});

describe('FUN-39 photo comedy', () => {
  it('20 seeded photos give 2+ photobombs and a caption on every one, each fitting the frame', () => {
    const a = { ...child(0), id: 'a', name: 'Juniper' };
    const b = { ...child(0), id: 'b', name: 'Kiki' };
    const world = { nubbins: [a, b] } as unknown as World;
    let bombs = 0;
    for (let shot = 1; shot <= 20; shot++) {
      const f = photoComedy(world, a, shot);
      if (f.bomber) bombs++;
      expect(f.caption).toContain('Juniper');
      for (const line of wrapCaption(f.caption, 148))
        expect(measureText(line)).toBeLessThanOrEqual(148);
    }
    expect(bombs).toBeGreaterThanOrEqual(2);
  });
});

describe('LOOK-62 evolution reveal', () => {
  it('shakes the evolving cocoon only at the end, and spins the new form one turn', () => {
    const c = { stage: 'cocoon' as const, cocoonKind: 'evolve' as const, stageMs: 0 };
    expect(cocoonShake(c, 100)).toBe(0);
    let moved = false;
    for (let t = 0; t < 400; t += 17)
      if (cocoonShake({ ...c, stageMs: LIFECYCLE.cocoonMs - 600 }, t) !== 0) moved = true;
    expect(moved).toBe(true);
    expect(
      cocoonShake({ ...c, cocoonKind: 'depart' as const, stageMs: LIFECYCLE.cocoonMs - 600 }, 50),
    ).toBe(0);
    expect(revealTurn(1000, 1000 + EVOLVE_REVEAL.spinMs / 2, false)).toBeGreaterThan(Math.PI);
    expect(revealTurn(1000, 1000 + EVOLVE_REVEAL.spinMs + 1, false)).toBe(0);
    expect(revealTurn(1000, 1100, true)).toBe(0);
  });
});

describe('LOOK-58 rarity', () => {
  it('sorts Nubbins into four tiers', () => {
    const n = child(0);
    expect(rarityOf({ ...n, eggColor: 'plain', tone: null, shiny: false })).toBe('common');
    expect(rarityOf({ ...n, eggColor: 'plain', tone: 'red', shiny: false })).toBe('uncommon');
    expect(rarityOf({ ...n, eggColor: 'plain', tone: null, shiny: true })).toBe('rare');
    expect(rarityOf({ ...n, eggColor: 'plain', tone: null, shiny: false, finish: 'glass' })).toBe(
      'legendary',
    );
    expect(rarityOf({ ...n, eggColor: 'plain', tone: null, shiny: false, eternal: 'sun' })).toBe(
      'legendary',
    );
  });
});

describe('LOOK-53 birthmarks', () => {
  it('marks about one in five Chao, a few rare ones, the same in both modes', () => {
    let marked = 0;
    let rare = 0;
    for (let seed = 1; seed <= 2000; seed++) {
      const m = birthmarkOf({ seed, species: 'chao', stage: 'child' });
      if (m) marked++;
      if (m && (m.kind === 'star' || m.kind === 'heart')) rare++;
    }
    expect(marked / 2000).toBeGreaterThan(0.16);
    expect(marked / 2000).toBeLessThan(0.24);
    expect(rare).toBeGreaterThan(20);
    expect(rare).toBeLessThan(110);
    expect(birthmarkOf({ seed: 5, species: 'zapkin', stage: 'child' })).toBeNull();
    // A marked child's 3D key carries the mark, and the spec gains marks.
    let seed = 1;
    while (!birthmarkOf({ seed, species: 'chao', stage: 'child' })) seed++;
    const n = { ...child(0), seed };
    const key = nubbinLook(n).key;
    expect(key).toContain('~mark:');
    expect(specForKey(key).marks.length).toBeGreaterThan(specForKey('variant:child').marks.length);
    expect(SheetCache.nubbinKey(n)).toContain(`:m${birthmarkKey(birthmarkOf(n))}`);
  });
});
