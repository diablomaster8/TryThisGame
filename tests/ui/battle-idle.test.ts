import { describe, expect, it } from 'vitest';
import { idleKind, idlePose } from '../../src/ui/battle-idle';

/** Personality idles in battle (recs FIGHT-78). */
describe('battle idles', () => {
  it('maps personality and moody traits to their idle', () => {
    expect(idleKind({ personality: 'cheerful', eternal: false })).toBe('bounce');
    expect(idleKind({ personality: 'shy', eternal: false })).toBe('peek');
    expect(idleKind({ personality: 'mischievous', eternal: false })).toBe('tongue');
    expect(idleKind({ personality: 'lazy', eternal: false })).toBe('yawn');
    expect(idleKind({ personality: 'lazy', eternal: false, moody: 'grumpy' })).toBe('cross');
    expect(idleKind({ personality: null, eternal: false, moody: 'sleepy' })).toBe('nod');
    expect(idleKind({ personality: null, eternal: true })).toBe('float');
  });

  it('plays once every 3–6 s for under a second, the same for the same seed', () => {
    let on = 0;
    let runs = 0;
    let was = false;
    for (let t = 0; t < 60_000; t += 50) {
      const p = idlePose('bounce', 'a', 7, t, false);
      const playing = p.glyph !== '';
      if (playing) on += 50;
      if (playing && !was) runs++;
      was = playing;
    }
    expect(runs).toBeGreaterThanOrEqual(9);
    expect(runs).toBeLessThanOrEqual(21);
    expect(on / runs).toBeLessThanOrEqual(950);
    expect(idlePose('bounce', 'a', 7, 1234, false)).toEqual(
      idlePose('bounce', 'a', 7, 1234, false),
    );
  });

  it('reduced motion keeps the pose still', () => {
    for (let t = 0; t < 20_000; t += 50) {
      const p = idlePose('bounce', 'a', 7, t, true);
      expect(p.dx).toBe(0);
      expect(p.dy).toBe(0);
    }
  });
});
