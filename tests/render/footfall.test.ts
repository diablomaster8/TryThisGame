// MOVE-46: footfalls follow the surface: the bridge is a deck (a tok, no dust), the stream
// is water (ripples), the plain is grass.
import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { Footfall } from '../../src/render/footfall';
import { deckY } from '../../src/sim/terrain';
import { createWorld } from '../../src/sim/world';

/** Two steps a stride apart at (x, z) ± 0.4 along x; the second step's surface. */
function stepAt(x: number, z: number, y = 0): string | null {
  const w = createWorld(1, 0);
  w.keeper.y = y;
  const f = new Footfall();
  f.step(w, x - 0.4, z);
  return f.step(w, x + 0.4, z);
}

describe('footfalls by surface (MOVE-46)', () => {
  it('steps on the bridge deck, in the pond water and on the grass', () => {
    let deck: [number, number, number] | null = null;
    for (let x = -40; x < 40 && !deck; x += 0.25)
      for (let z = -40; z < 40 && !deck; z += 0.25) {
        const y = deckY(x, z);
        if (y !== null && deckY(x - 0.4, z) !== null && deckY(x + 0.4, z) !== null)
          deck = [x, z, y];
      }
    expect(deck).not.toBeNull();
    expect(stepAt(deck![0], deck![1], deck![2])).toBe('deck');
    expect(stepAt(GROVE.pond.x, GROVE.pond.z)).toBe('water');
    expect(stepAt(-10, -26)).toBe('grass');
  });
});
