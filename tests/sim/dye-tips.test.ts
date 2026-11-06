import { describe, expect, it } from 'vitest';
import { dye } from '../../src/sim/accessories';
import { DYE_COLORS_ALL, type SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';
import { SheetCache } from '../../src/render/sprites/sheets';
import { specForKey } from '../../src/render3d/looks';

describe('wing and crown tip dyes (R0427)', () => {
  it('there are twelve dyes', () => {
    expect(DYE_COLORS_ALL).toHaveLength(12);
  });
  it('only adults take them, and a dye is used up', () => {
    const w = createWorld(3, Date.UTC(2026, 6, 1));
    const n = w.nubbins[0]!;
    w.inventory.dyes.teal = 2;
    const ev: SimEvent[] = [];
    n.stage = 'child';
    expect(dye(w, n.id, 'wingTip', 'teal', ev)).toBe(false);
    expect(w.inventory.dyes.teal).toBe(2);
    n.stage = 'adult';
    expect(dye(w, n.id, 'wingTip', 'teal', ev)).toBe(true);
    expect(dye(w, n.id, 'crownTip', 'teal', ev)).toBe(true);
    expect(n.wingDye).toBe('teal');
    expect(n.crownDye).toBe('teal');
    expect(w.inventory.dyes.teal).toBe(0);
  });
  it('the sheet key and the 3D spec change with the dye', () => {
    const w = createWorld(3, Date.UTC(2026, 6, 1));
    const n = { ...w.nubbins[0]!, species: 'chao', stage: 'adult' as const };
    const plain = SheetCache.nubbinKey(n);
    expect(SheetCache.nubbinKey({ ...n, crownDye: 'navy' })).not.toBe(plain);
    expect(specForKey('nubbin~wingtip:coral~crowntip:navy')).not.toBe(specForKey('nubbin'));
  });
});
