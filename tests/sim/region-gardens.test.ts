import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import { gardenDwellers, regionShown } from '../../src/sim/region-gardens';
import { applyCommand, createWorld } from '../../src/sim/world';

/** R13 lane D (WORLD-34): the lands' Nubbin gardens are mirrors; the recolour option. */
function landWorld() {
  const w = createWorld(41, 0);
  const n = w.nubbins[0]!;
  hatch(n, [], w.timeMs);
  n.stage = 'adult';
  n.alignment = 0.8;
  w.unlocks.sunGrove = true;
  w.location = 'region:sunlands';
  return { w, n };
}

describe('Sun and Moon gardens (WORLD-34)', () => {
  it('a Sun adult strolls the Sun lands as a mirror, the real Nubbin untouched', () => {
    const { w, n } = landWorld();
    const home = { ...n.pos };
    expect(gardenDwellers(w, 'sunlands')).toEqual([n]);
    const a = regionShown(w);
    expect(a).toHaveLength(1);
    expect(a[0]!.id).toBe(n.id);
    expect(a[0]).not.toBe(n);
    const x0 = a[0]!.pos.x;
    w.timeMs += 5000;
    regionShown(w);
    expect(a[0]!.pos.x).not.toBe(x0);
    expect(n.pos).toEqual(home);
  });
  it('a Moon adult does not stroll the Sun lands, and Sun adults skip the Moon lands', () => {
    const { w, n } = landWorld();
    n.alignment = -0.8;
    expect(regionShown(w)).toHaveLength(0);
    w.location = 'region:moonlands';
    expect(regionShown(w)).toHaveLength(1);
    n.alignment = 0.8;
    expect(regionShown(w)).toHaveLength(0);
  });
  it('the Grove dresses for you only when asked', () => {
    const { w } = landWorld();
    w.keeper.alignment = 'sun';
    applyCommand(w, { kind: 'switchKeeper', alignment: 'sun' }, []);
    expect(w.grove).toBe('main');
    applyCommand(w, { kind: 'setSettings', settings: { ...w.settings, groveDresses: true } }, []);
    expect(w.grove).toBe('sun');
    applyCommand(w, { kind: 'switchKeeper', alignment: 'moon' }, []);
    expect(w.grove).toBe('main');
  });
});
