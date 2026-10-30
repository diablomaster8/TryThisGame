import { describe, expect, it } from 'vitest';
import { requestLine } from '../../src/config/strings-fun-r6';
import { REQUEST_VOICE } from '../../src/config/strings-requests';
import { TRAINERS } from '../../src/sim/trainers';

// R0327 (FUN-38): every request kind has a voiced ask and thanks for every Keeper.

const KINDS =
  'pet feed fruit race karate lanterns photo visit craft water hug lesson expedition gather hollow'.split(
    ' ',
  );

describe('request voices', () => {
  it('covers every kind and Keeper, with Nubbin lines narrated', () => {
    for (const k of KINDS) {
      expect(REQUEST_VOICE[k]).toBeDefined();
      for (const t of TRAINERS) {
        expect(requestLine(k, t.id, false, 'ask')).toBe(REQUEST_VOICE[k]!.by[t.id]!.ask);
        expect(requestLine(k, t.id, false, 'thanks')!.length).toBeLessThanOrEqual(140);
      }
      expect(requestLine(k, 'Kiki', true, 'ask')).toContain('Kiki');
    }
  });
});
