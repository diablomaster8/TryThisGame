import { describe, expect, it } from 'vitest';
import { visualStateOfPose } from '../../src/render-common/visual-state';
import { BATTLE_POSES, EXPRESSIONS } from '../../src/samples/species';
import { BATTLE_CLIP_NAMES } from '../../src/render/sprites/animations';

// R0239: the Full 3D rigs have a pose of their own for each of the eight battle clips.
describe('R0239 battle rig poses', () => {
  it('has one pose per pixel clip, each with a face and a visual state', () => {
    expect([...BATTLE_POSES].sort()).toEqual([...BATTLE_CLIP_NAMES].sort());
    for (const p of BATTLE_POSES) {
      expect(EXPRESSIONS[p]).toBeDefined();
      expect(visualStateOfPose(p)).not.toBeNull();
    }
  });
});
