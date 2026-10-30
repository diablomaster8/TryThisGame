import { describe, expect, it } from 'vitest';
import { WEATHER_GAGS } from '../../src/config/tuning-fun';
import { gagFor } from '../../src/ui/nubbin-gags';

// R0329 (FUN-40): each weather shows its gag within 60 s at ×1.

const nub = (id: string, state = 'wander') =>
  ({ id, stage: 'child', behavior: { state } }) as unknown as Parameters<typeof gagFor>[0];

function within60(weather: 'rain' | 'snow' | 'clear', want: string, since: number | null = null) {
  const all = [nub('a'), nub('b'), nub('c')];
  for (let t = 0; t < 60_000; t += 100)
    for (const n of all) if (gagFor(n, all, weather, t, since) === want) return true;
  return false;
}

describe('weather gags', () => {
  it('rain: a leaf umbrella that blows inside out', () => {
    expect(within60('rain', 'leaf')).toBe(true);
    expect(within60('rain', 'leafFlip')).toBe(true);
  });
  it('snow: a flake on the tongue, then a shiver', () => {
    expect(within60('snow', 'tongue')).toBe(true);
    expect(within60('snow', 'shiver')).toBe(true);
  });
  it('clear after rain: a puddle splash; plain clear: nothing', () => {
    expect(within60('clear', 'puddle', 0)).toBe(true);
    expect(within60('clear', 'puddle', null)).toBe(false);
  });
  it('two swimmers paddle in time', () => {
    const all = [nub('a', 'swim'), nub('b', 'swim')];
    const t = WEATHER_GAGS.paddleMs * 3 + 100;
    expect(all.map((n) => gagFor(n, all, 'clear', t, null))).toEqual(['paddle', 'paddle']);
  });
});
