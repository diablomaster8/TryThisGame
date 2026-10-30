import { describe, expect, it } from 'vitest';
import { shyLine } from '../../src/ui/shy-lines';
import type { Nubbin } from '../../src/sim/types';

// R0350 (FUN-61): Sable's refusals change with how far her trust has come.
const sable = (trust: number): Nubbin =>
  ({ name: 'Sable', shadow: true, bond: false, trust }) as unknown as Nubbin;

describe('R0350 shy lines', () => {
  it('differ across the three trust bands', () => {
    const far = shyLine(sable(10), false, 'tickle', 'main');
    const near = shyLine(sable(25), false, 'tickle', 'main');
    const allows = shyLine(sable(35), true, 'tickle', 'main');
    expect(far).toMatch(/step back|bee/);
    expect(near).toMatch(/paw|leans in/);
    expect(allows).toMatch(/admit|Barely/);
    expect(new Set([far, near, allows]).size).toBe(3);
  });

  it('leave a bonded or trusting Nubbin and an ordinary one to the usual toast', () => {
    expect(shyLine(sable(60), true, 'tickle', 'main')).toBeNull();
    expect(shyLine({ ...sable(10), bond: true } as Nubbin, false, 'tickle', 'main')).toBeNull();
    expect(shyLine({ ...sable(10), shadow: false } as Nubbin, false, 'tickle', 'main')).toBeNull();
  });

  it('use short lines in the sprout band', () => {
    for (const t of [5, 25])
      expect(shyLine(sable(t), false, 'hug', 'sprout')!.split(' ').length).toBeLessThanOrEqual(8);
  });
});
