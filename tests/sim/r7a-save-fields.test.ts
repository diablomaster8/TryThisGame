import { describe, expect, it } from 'vitest';
import { deserialize, serialize } from '../../src/sim/save';
import { createEdu } from '../../src/sim/edu';
import { createWorld } from '../../src/sim/world';

// Lane A r7: the round's optional fields ride through a v13 save and load, and a save
// without them loads with them absent (each reads as its default).
describe('lane A r7 optional save fields', () => {
  it('survive a save and load', () => {
    const w = createWorld(5, 0);
    const n = w.nubbins[0]!;
    n.eggShakes = 2;
    n.childCare.touches = 3;
    n.childCare.tucks = 1;
    n.remembered = [{ id: 'x', name: 'Pip', atMs: 10 }];
    w.keeper.idleMs = 1234;
    w.settings.slapstick = 'gentle';
    w.edu = createEdu(6, 'reader');
    w.edu.readToMe = true;
    const back = deserialize(serialize(w, 0)).world;
    const m = back.nubbins[0]!;
    expect(m.eggShakes).toBe(2);
    expect(m.childCare.touches).toBe(3);
    expect(m.childCare.tucks).toBe(1);
    expect(m.remembered?.[0]?.name).toBe('Pip');
    expect(back.keeper.idleMs).toBe(1234);
    expect(back.settings.slapstick).toBe('gentle');
    expect(back.edu?.readToMe).toBe(true);
  });

  it('a save without them loads with them unset', () => {
    const back = deserialize(serialize(createWorld(5, 0), 0)).world;
    expect(back.nubbins[0]!.eggShakes).toBeUndefined();
    expect(back.settings.slapstick).toBeUndefined();
  });
});
