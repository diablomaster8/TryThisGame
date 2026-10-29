import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { POND_DIP } from '../../src/config/tuning-move';
import { keeperDip, keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

// MOVE-65: with the Swim perk a jump into the pond dips under; each pond spot's shell is one-time.

const SUB = 1000 / 60;

/** A Keeper with the Swim perk standing in the pond, 2 u from its centre. */
function inPond(seed = 1): World {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  n.stage = 'adult';
  n.needs.affection = 100;
  n.form = { ...(n.form ?? {}), type: 'swim' } as NonNullable<typeof n.form>;
  w.nubbins = [n];
  const p = { x: GROVE.pond.x + 2, z: GROVE.pond.z };
  w.keeper.pos = p;
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.grounded = true;
  return w;
}

/** A jump let go at once (a short hop), until it lands; the events. */
function hop(w: World, held: boolean): SimEvent[] {
  const ev: SimEvent[] = [];
  applyCommand(w, { kind: 'jump', down: true }, ev);
  if (!held) applyCommand(w, { kind: 'jump', down: false }, ev);
  for (let i = 0; i < 120; i++) {
    updateKeeper(w, SUB, ev);
    if (ev.some((e) => e.kind === 'keeperLanded')) break;
  }
  return ev;
}

describe('the pond dip (MOVE-65)', () => {
  it('a let-go jump dips for 1.5 s; a held one floats', () => {
    const w = inPond();
    expect(keeperFooting(w, w.keeper.pos.x, w.keeper.pos.z).on).toBe('water');
    const ev = hop(w, false);
    expect(ev.some((e) => e.kind === 'keeperDipped')).toBe(true);
    expect(keeperDip(w)).not.toBeNull();
    for (let i = 0; i < Math.ceil(POND_DIP.ms / SUB) + 1; i++) updateKeeper(w, SUB, []);
    expect(keeperDip(w)).toBeNull();
    const held = hop(w, true);
    expect(held.some((e) => e.kind === 'keeperDipped')).toBe(false);
  });

  it('a pond spot gives its shells once per save', () => {
    const w = inPond(3);
    let found = 0;
    for (let i = 0; i < 40; i++) {
      const ev = hop(w, false);
      for (const e of ev) if (e.kind === 'keeperDipped' && e.shells > 0) found++;
      for (let j = 0; j < 100; j++) updateKeeper(w, SUB, []);
    }
    expect(found).toBe(1);
    expect(w.pondFinds).toHaveLength(1);
  });
});
