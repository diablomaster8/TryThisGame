import { describe, expect, it } from 'vitest';
import { cameraSubject, sheetShift, type Spot } from '../../src/render/camera-subject';
import { walkLead } from '../../src/render/camera';
import { clearShift } from '../../src/render/view-shift';
import { CAMERA, KEEPER } from '../../src/config/tuning';
import { CAMERA_FOLLOW } from '../../src/config/tuning-sim';

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

// HOT-3b: a tap target is never the camera subject. The Keeper walks to the tap at full speed
// and the camera follows the same way on a phone as on a desktop: it never runs ahead to the
// tap point, so the Keeper never walks across a view parked on blank map.
describe('HOT-3b tap-to-move', () => {
  it.each([1, 2])('keeps the camera on the Keeper, not the tap point, at %sx pace', (pace) => {
    const tap = { x: 9, z: -6 };
    const keeper = { x: 0, z: 0 };
    const cam = { ...keeper };
    const len = Math.hypot(tap.x, tap.z);
    const dir = { x: tap.x / len, z: tap.z / len };
    const dt = 1 / 60;
    let worst = 0;
    while (Math.hypot(tap.x - keeper.x, tap.z - keeper.z) > 0.05) {
      const left = Math.hypot(tap.x - keeper.x, tap.z - keeper.z);
      const step = Math.min(KEEPER.speed * pace * dt, left);
      keeper.x += dir.x * step;
      keeper.z += dir.z * step;
      // No dialogue: the subject is the Keeper, whatever spot a lookup would give.
      const { at } = cameraSubject(keeper, null, () => tap);
      const lead = walkLead(CAMERA_FOLLOW.lookAhead, pace, false);
      const aim = { x: at.x + dir.x * lead, z: at.z + dir.z * lead };
      const t = 1 - Math.exp(-CAMERA.followRate * dt);
      cam.x += (aim.x - cam.x) * t;
      cam.z += (aim.z - cam.z) * t;
      worst = Math.max(worst, Math.hypot(cam.x - keeper.x, cam.z - keeper.z));
    }
    expect(worst).toBeLessThan(0.3);
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
