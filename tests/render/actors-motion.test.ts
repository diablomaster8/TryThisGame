import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import { poseFor } from '../../src/render3d/actors';
import { ItemKit, shellKey } from '../../src/render3d/item-kit';
import { ALL_POSES, EXPRESSIONS } from '../../src/samples/species';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import type { BehaviorState, Item, Nubbin, Reaction } from '../../src/sim/types';

/** A Nubbin in a given state; adults get stat points by name. */
function nubbin(
  state: BehaviorState,
  opts: { adult?: boolean; fly?: number; swim?: number; reaction?: Reaction } = {},
): Nubbin {
  const n = createEgg('n', { x: 0, z: 0 }, Rng.fromSeed(3));
  n.stage = opts.adult ? 'adult' : 'child';
  n.behavior.state = state;
  n.behavior.reaction = opts.reaction ?? null;
  n.needs.hunger = 1;
  n.needs.happiness = 20;
  n.stats.fly.points = opts.fly ?? 0;
  n.stats.swim.points = opts.swim ?? 0;
  return n;
}

describe('poseFor (3D poses by the pixel view rule)', () => {
  it('cries, and sits sad when low or hungry', () => {
    expect(poseFor(nubbin('cry'), false, false)).toBe('sad');
    const low = nubbin('sit');
    low.needs.happiness = -50;
    expect(poseFor(low, false, false)).toBe('sad');
    const hungry = nubbin('sit');
    hungry.needs.hunger = 0.1;
    expect(poseFor(hungry, false, false)).toBe('sad');
    expect(poseFor(nubbin('sit'), false, false)).toBe('idle');
    // A low Nubbin on the move walks, as the pixel view's walk clip does.
    expect(poseFor(low, true, false)).toBe('walk');
  });

  it('gives the reactions a body', () => {
    expect(poseFor(nubbin('react', { reaction: 'dizzy' }), false, false)).toBe('dizzy');
    expect(poseFor(nubbin('react', { reaction: 'surprised' }), false, false)).toBe('surprised');
    expect(poseFor(nubbin('react', { reaction: 'love' }), false, false)).toBe('love');
    expect(poseFor(nubbin('react', { reaction: 'sad' }), false, false)).toBe('sad');
    expect(poseFor(nubbin('react', { reaction: 'happy' }), false, false)).toBe('happy');
  });

  it('tumbles when thrown, and pets win over everything', () => {
    expect(poseFor(nubbin('thrown'), false, false)).toBe('tumble');
    expect(poseFor(nubbin('cry'), false, true)).toBe('pet');
  });

  it('flaps only for a flying adult on the move', () => {
    expect(poseFor(nubbin('wander', { adult: true, fly: 3000 }), true, false)).toBe('flap');
    expect(poseFor(nubbin('wander', { adult: true, fly: 3000 }), false, false)).toBe('idle');
    expect(poseFor(nubbin('wander', { adult: true }), true, false)).toBe('walk');
    expect(poseFor(nubbin('wander', { fly: 3000 }), true, false)).toBe('walk');
  });

  it('strokes only for a swimming adult; the rest wade', () => {
    expect(poseFor(nubbin('swim', { adult: true, swim: 3000 }), true, false)).toBe('swim');
    expect(poseFor(nubbin('swim', { adult: true }), true, false)).toBe('walk');
    expect(poseFor(nubbin('swim', { swim: 3000 }), true, false)).toBe('walk');
  });
});

describe('the motion poses', () => {
  it('have a face for every pose, and the sad one frowns', () => {
    for (const p of ALL_POSES) expect(EXPRESSIONS[p]).toBeDefined();
    expect(EXPRESSIONS.sad.frown).toBe(1);
    expect(EXPRESSIONS.surprised.gape).toBe(1);
    expect(EXPRESSIONS.dizzy.spin).toBe(true);
  });
});

describe('ItemKit (shared props, nothing leaked)', () => {
  const fruit = (id: string): Item =>
    ({ id, kind: 'fruit', pos: { x: 0, z: 0 }, y: 0 }) as unknown as Item;
  const toy = (id: string): Item =>
    ({ id, kind: 'toy', toy: 'radio', pos: { x: 0, z: 0 }, y: 0 }) as unknown as Item;

  it('shares one geometry and material per item kind and colour', () => {
    const kit = new ItemKit();
    const a = kit.item(fruit('a')).mesh as THREE.Mesh;
    const b = kit.item(fruit('b')).mesh as THREE.Mesh;
    expect(a.geometry).toBe(b.geometry);
    expect(a.material).toBe(b.material);
    const t1 = kit.item(toy('t1')).mesh;
    const t2 = kit.item(toy('t2')).mesh;
    const m1 = t1.children[0] as THREE.Mesh;
    const m2 = t2.children[0] as THREE.Mesh;
    expect(m1.geometry).toBe(m2.geometry);
    expect(m1.material).toBe(m2.material);
    kit.dispose();
  });

  it('keeps shared things on release and frees them on dispose', () => {
    const kit = new ItemKit();
    const m = kit.item(fruit('a')).mesh as THREE.Mesh;
    const geo = vi.spyOn(m.geometry, 'dispose');
    const mat = vi.spyOn(m.material as THREE.Material, 'dispose');
    kit.release(m);
    expect(geo).not.toHaveBeenCalled();
    expect(mat).not.toHaveBeenCalled();
    kit.dispose();
    expect(geo).toHaveBeenCalled();
    expect(mat).toHaveBeenCalled();
    expect(kit.counts).toEqual({ geometries: 0, materials: 0, toys: 0 });
  });

  it('disposes a cocoon material (its own, as it fades) when the cocoon goes', () => {
    const kit = new ItemKit();
    const n = createEgg('c', { x: 0, z: 0 }, Rng.fromSeed(2));
    n.stage = 'cocoon';
    n.cocoonKind = 'depart';
    const a = kit.shell(n);
    const b = kit.shell(n);
    expect(a.geometry).toBe(b.geometry);
    expect(a.material).not.toBe(b.material);
    const spy = vi.spyOn(a.material as THREE.Material, 'dispose');
    kit.release(a);
    expect(spy).toHaveBeenCalled();
    expect(shellKey(n)).toBe('shell:cocoon:depart');
    kit.dispose();
  });
});
