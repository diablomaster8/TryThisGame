import { describe, expect, it } from 'vitest';
import { CG4_A1 } from '../../src/config/tuning-a1';
import {
  headTurnToward,
  moodGesture,
  POSE_CUES,
  pixelPose,
  seatOf,
} from '../../src/render/stage-pose';
import { ALL_POSES, EXPRESSIONS, STAGE_POSES } from '../../src/samples/species';
import { KEEPER_SPEC } from '../../src/samples/keeper-spec';

describe('stage poses (campaign graphics 4, package a1)', () => {
  it('turns a head at most 60 degrees, scaled by its strength', () => {
    const lim = Math.PI / 3;
    // The speaker straight behind: clamped.
    expect(Math.abs(headTurnToward({ x: 0, z: 0 }, 0, { x: 0, z: -5 }, 1))).toBeCloseTo(lim);
    // To the right (+x) at 45 degrees: the full angle, halved for a crowd Nubbin.
    expect(headTurnToward({ x: 0, z: 0 }, 0, { x: 1, z: 1 }, 1)).toBeCloseTo(Math.PI / 4);
    expect(headTurnToward({ x: 0, z: 0 }, 0, { x: 1, z: 1 }, 0.5)).toBeCloseTo(Math.PI / 8);
    // On the same spot: no turn.
    expect(headTurnToward({ x: 0, z: 0 }, 1, { x: 0, z: 0 }, 1)).toBe(0);
  });

  it('defaults a gesture from the mood: sad looks down, happy nods', () => {
    expect(moodGesture('sad')).toBe('down');
    expect(moodGesture('happy')).toBe('nod');
    expect(moodGesture('neutral')).toBeNull();
    expect(moodGesture(undefined)).toBeNull();
  });

  it('seats on the tuning table when the mark has no seatY of its own', () => {
    expect(seatOf('grove', 'fold-door-1')).toBe(CG4_A1.seats['fold-door-1']);
    expect(seatOf('grove', 'no-such-mark')).toBe(0);
  });

  it('gives every stage pose an expression, and the Keeper its own sit, kneel and item-get', () => {
    for (const p of STAGE_POSES) {
      expect(ALL_POSES).toContain(p);
      expect(EXPRESSIONS[p]).toBeDefined();
      expect(KEEPER_SPEC.poses?.[p]).toBeTypeOf('function');
    }
    for (const g of ['nod', 'shrug', 'point', 'down', 'chest'] as const)
      expect(KEEPER_SPEC.gestures?.[g]).toBeTypeOf('function');
  });

  it('picks the pixel frame for a cue: a gesture while held, then the seat', () => {
    POSE_CUES.clear();
    const has = (): boolean => true;
    POSE_CUES.set('x', {
      pose: 'sit',
      seatY: 0.2,
      gesture: 'nod',
      gestureAge: 0.2,
      attend: null,
      body: 0,
      face: 0.4,
    });
    expect(pixelPose('x', 0, has)).toMatchObject({ clip: 'g-nod', face: 0.4, lift: 0.2 });
    POSE_CUES.get('x')!.gestureAge = 5;
    expect(pixelPose('x', 0, has)).toMatchObject({ clip: 'sit', lift: 0.2 });
    // Walking keeps its own frames.
    expect(pixelPose('x', 0, has, true)).toBeNull();
    expect(pixelPose('nobody', 0, has)).toBeNull();
    POSE_CUES.clear();
  });
});
