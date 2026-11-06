/** R0583 (lane A round 13): real start-line poses in Pixel (sheet frames) and 3D (rig poses). */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { START_POSE_3D, startRect } from '../../src/render/start-pose';
import { CHILD_NEUTRAL, drawChao, lookOf } from '../../src/render/sprites/chao';
import { START_CLIP, startFrameIndex, startKind, type StartKind } from '../../src/sim/race-persona';
import { ALL_POSES, EXPRESSIONS, MOTION_POSES } from '../../src/samples/species';
import type { Personality } from '../../src/sim/types';

const KINDS: StartKind[] = ['wave', 'hide', 'tongue', 'yawn'];

describe('start-line poses', () => {
  it('maps each personality to its own kind, clip and 3D pose', () => {
    const got = (['cheerful', 'shy', 'mischievous', 'lazy'] as Personality[]).map((p) =>
      startKind(p),
    );
    expect(got).toEqual(KINDS);
    expect(new Set(KINDS.map((k) => START_CLIP[k].clip)).size).toBe(4);
    expect(new Set(KINDS.map((k) => START_POSE_3D[k])).size).toBe(4);
  });

  it('gives the 3D rigs a real wave and a yawn, each with a face', () => {
    expect(START_POSE_3D.wave).toBe('wave');
    expect(START_POSE_3D.yawn).toBe('yawn');
    for (const p of ['wave', 'yawn'] as const) {
      expect(ALL_POSES).toContain(p);
      expect(EXPRESSIONS[p]).toBeDefined();
    }
    expect(MOTION_POSES).toContain('yawn');
    expect(EXPRESSIONS.yawn.gape).toBe(1);
    expect(EXPRESSIONS.yawn.lid).toBeGreaterThan(0.5);
  });

  it('holds frame 0 or a fixed frame under reduced motion and cycles otherwise', () => {
    for (const k of KINDS) {
      expect(startFrameIndex(k, 0, true)).toBe(startFrameIndex(k, 5000, true));
      const seen = new Set(
        [0, 1, 2, 3].map((i) => startFrameIndex(k, i * START_CLIP[k].ms, false)),
      );
      expect(seen.size).toBe(START_CLIP[k].frames);
    }
  });

  it('draws a tongue-out face that differs from the plain grin, in the side view', () => {
    const look = lookOf(CHILD_NEUTRAL, 'run');
    const base = {
      lift: 0,
      squash: 1,
      legs: 'together',
      arms: 'down',
      eyes: 'open',
      mouth: 'smile',
      wings: 0,
      waterline: false,
      headDrop: 0,
    } as const;
    const plain = drawChao('side', base, look);
    const tease = drawChao('side', { ...base, mouth: 'tongue' }, look);
    expect(Array.from(tease.data)).not.toEqual(Array.from(plain.data));
  });

  it('bakes the tease, peek, wave and yawn clips into the Chao sheet for every angle', () => {
    const src = readFileSync('src/render/sprites/chao.ts', 'utf8');
    for (const k of KINDS)
      expect(src).toContain("frameKey('" + START_CLIP[k].clip + "', angle, f)");
  });

  it('falls back to null for a sheet without the clip', () => {
    const empty = { frames: new Map() } as unknown as Parameters<typeof startRect>[0];
    expect(startRect(empty, 'wave', 0, false)).toBeNull();
  });
});
