import { describe, expect, it } from 'vitest';
import { beatFor, beatPose, PetBeats, PET_BEAT_MS } from '../../src/render/pet-reactions';
import { petToast, PET_TOASTS } from '../../src/config/strings-look';
import type { Nubbin } from '../../src/sim/types';

const nub = (personality: Nubbin['personality'] = null, energy = 1) =>
  ({ id: 'a', personality, needs: { energy } }) as unknown as Nubbin;

describe('pet beats (FUN-09)', () => {
  it('gives each of the six actions its own beat', () => {
    const beats = (['tickle', 'hug', 'groom', 'praise', 'highFive', 'tuckIn'] as const).map((a) =>
      beatFor(a, 'cheerful', 1, false),
    );
    expect(new Set(beats).size).toBe(6);
  });

  it('turns a second tickle within 5 s into hiccups', () => {
    const b = new PetBeats();
    expect(b.start(nub(), 'tickle', true, 0)).toBe('giggle');
    expect(b.start(nub(), 'tickle', true, 3000)).toBe('hiccup');
    expect(b.start(nub(), 'tickle', true, 4000)).toBe('giggle');
  });

  it('plays the high five by personality', () => {
    expect(beatFor('highFive', 'shy', 1, false)).toBe('miss');
    expect(beatFor('highFive', 'mischievous', 1, false)).toBe('tease');
    expect(beatFor('highFive', 'lazy', 1, false)).toBe('slap');
  });

  it('squishes a hug to 0.85 tall and ends on time', () => {
    expect(beatPose('squish', 0.125).sh).toBeCloseTo(0.85);
    const b = new PetBeats();
    b.start(nub(), 'hug', true, 0);
    expect(b.pose('a', PET_BEAT_MS.squish + 1)).toBeNull();
  });

  it('has a distinct toast per action and personality', () => {
    const lines = Object.values(PET_TOASTS).flatMap((s) => Object.values(s));
    expect(new Set(lines).size).toBe(lines.length);
    expect(petToast('Kiki', 'hug', 'shy')).toBe('Kiki goes still, then leans in.');
    for (const l of lines) expect(l.length).toBeLessThan(100);
  });
});
