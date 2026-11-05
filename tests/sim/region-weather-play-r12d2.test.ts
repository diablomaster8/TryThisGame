import { afterEach, describe, expect, it } from 'vitest';
import { WEATHER_PLAY } from '../../src/config/tuning-r12d2';
import { skyForce } from '../../src/sim/region-weather-live';
import {
  ghostShipHere,
  millWheelMul,
  stepWeatherPlay,
  windGlideMul,
} from '../../src/sim/region-weather-play';
import { regionMarks } from '../../src/sim/region-marks';
import { regionLocation } from '../../src/sim/region-walk';
import type { RegionId } from '../../src/config/regions';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

function at(region: RegionId) {
  const w = createWorld(5, 0);
  w.location = regionLocation(region);
  return w;
}

afterEach(() => {
  skyForce.kind = null;
});

describe('weather you can use (R0137)', () => {
  it('wind lengthens a glide by 30% on the ridge only', () => {
    skyForce.kind = 'wind';
    expect(windGlideMul(at('ridge'))).toBe(WEATHER_PLAY.windGlide);
    expect(windGlideMul(at('shore'))).toBe(1);
    expect(windGlideMul(createWorld(5, 0))).toBe(1);
    skyForce.kind = 'clear';
    expect(windGlideMul(at('ridge'))).toBe(1);
  });

  it('rain turns the mill wheel faster, in the Wood only', () => {
    skyForce.kind = 'rain';
    expect(millWheelMul(at('wood'))).toBe(WEATHER_PLAY.millRain);
    expect(millWheelMul(at('ridge'))).toBe(1);
    skyForce.kind = 'clear';
    expect(millWheelMul(at('wood'))).toBe(1);
  });

  it('the ghost ship is on the shore in fog only, and is a mark while it is out', () => {
    const w = at('shore');
    skyForce.kind = 'clear';
    expect(ghostShipHere(w)).toBeNull();
    expect(regionMarks(w).some((m) => m.kind === 'ghost')).toBe(false);
    skyForce.kind = 'fog';
    expect(ghostShipHere(w)).not.toBeNull();
    expect(regionMarks(w).some((m) => m.kind === 'ghost')).toBe(true);
    expect(ghostShipHere(at('wood'))).toBeNull();
  });

  it('seeing it says so once a sighting, first time then again', () => {
    const w = at('shore');
    const g = WEATHER_PLAY.ghost;
    w.keeper.pos.x = g.x;
    w.keeper.pos.z = g.z - 10;
    const ev: SimEvent[] = [];
    skyForce.kind = 'fog';
    stepWeatherPlay(w, ev);
    stepWeatherPlay(w, ev);
    skyForce.kind = 'clear';
    stepWeatherPlay(w, ev);
    skyForce.kind = 'fog';
    stepWeatherPlay(w, ev);
    const gags = ev.filter((e) => e.kind === 'regionGag') as Array<{ first: boolean }>;
    expect(gags.map((e) => e.first)).toEqual([true, false]);
  });
});
