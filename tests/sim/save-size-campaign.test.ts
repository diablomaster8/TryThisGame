import { describe, expect, it } from 'vitest';
import { serialize } from '../../src/sim/save';
import { moss, runCampaign, sable } from './campaign-driver';

/** R0497 (TECH-56): a save after a whole campaign stays far inside a browser's ~5 MB. Needs the stories. */
describe('save size after a campaign', () => {
  it('a finished campaign stays under 64 kB', () => {
    const { world } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'free' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => (moss(w)!.needs.affection = 80),
      },
    );
    const kb = serialize(world, 0).length / 1024;
    console.info(`save size: finished campaign ${kb.toFixed(1)} kB`);
    expect(kb).toBeLessThanOrEqual(64);
  }, 600_000);
});
