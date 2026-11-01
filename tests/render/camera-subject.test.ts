import { describe, expect, it } from 'vitest';
import { cameraSubject, sheetShift, type Spot } from '../../src/render/camera-subject';
import { clearShift } from '../../src/render/view-shift';

// HOT-3: the camera follows the Keeper, the talker while a dialogue line is up, then the Keeper.
describe('HOT-3 camera subject', () => {
  const keeper: Spot = { x: 1, z: 2 };
  const cast: Record<string, Spot> = { hazel: { x: 5, z: -3 } };
  const spotOf = (who: string): Spot | null => cast[who] ?? null;

  it('is the Keeper with no dialogue open', () => {
    expect(cameraSubject(keeper, null, spotOf)).toEqual({ at: keeper, talker: false });
  });

  it('is the speaker during dialogue, and the Keeper again once it closes', () => {
    const lines: (string | null)[] = ['hazel', 'narrator', 'you', 'hazel', null];
    const seen = lines.map((who) => cameraSubject(keeper, who, spotOf).at);
    expect(seen).toEqual([cast.hazel, keeper, keeper, cast.hazel, keeper]);
  });

  it('falls back to the Keeper when the speaker is not in the scene', () => {
    expect(cameraSubject(keeper, 'corvin', spotOf)).toEqual({ at: keeper, talker: false });
  });
});

describe('HOT-3 sheet shift', () => {
  it('moves nothing when the docked desktop sheet leaves the Keeper clear', () => {
    const s = clearShift(1280, 800, { left: 900, top: 0, right: 1280, bottom: 800 });
    expect(sheetShift(s, 0.1)).toEqual({ x: 0, y: 0 });
  });

  it('still lifts the view when a bottom sheet reaches the Keeper', () => {
    const s = clearShift(375, 812, { left: 0, top: 450, right: 375, bottom: 812 });
    expect(sheetShift(s, 0.1)).toEqual(s);
  });
});
