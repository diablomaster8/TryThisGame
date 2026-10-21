import { describe, expect, it } from 'vitest';
import { EGG, LIFECYCLE, SIM } from '../../src/config/tuning';
import { lifespanMs } from '../../src/sim/slips';
import type { Nubbin, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Review 2026-10-21, Bug 40: the debug panel's force buttons.
function hatched(): { w: World; n: Nubbin } {
  const w = createWorld(3, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 2; i++) stepWorld(w, SIM.stepMs);
  return { w, n: w.nubbins[0]! };
}

describe('debug force commands', () => {
  it('Force evolve refuses a Nubbin already in its cocoon', () => {
    const { w, n } = hatched();
    n.stage = 'cocoon';
    n.cocoonKind = 'evolve';
    applyCommand(w, { kind: 'debugForceEvolve', nubbinId: n.id }, []);
    expect(n.stage).toBe('cocoon');
    expect(n.form).toBeNull();
  });

  it('Force end of life reaches the end of a lengthened lifespan', () => {
    const { w, n } = hatched();
    applyCommand(w, { kind: 'debugForceEvolve', nubbinId: n.id }, []);
    expect(n.stage).toBe('adult');
    n.spanScale = 3;
    expect(lifespanMs(n)).toBeGreaterThan(LIFECYCLE.adultMs);
    applyCommand(w, { kind: 'debugForceEndOfLife', nubbinId: n.id }, []);
    stepWorld(w, SIM.stepMs);
    expect(n.stage).toBe('cocoon');
    expect(['rebirth', 'depart']).toContain(n.cocoonKind);
  });
});
