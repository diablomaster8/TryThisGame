import { describe, expect, it } from 'vitest';
import { SceneReplayGuard } from '../../src/ui/scene-replay-guard';

describe('SceneReplayGuard', () => {
  it('plays any queue head before a scene finishes', () => {
    const g = new SceneReplayGuard();
    expect(g.shouldPlay('c1-letter')).toBe(true);
    expect(g.shouldPlay(undefined)).toBe(false);
  });

  it('holds back a finished scene while the sim has not applied sceneDone', () => {
    const g = new SceneReplayGuard();
    g.markFinished('c1-letter');
    expect(g.shouldPlay('c1-letter')).toBe(false);
    expect(g.shouldPlay('c1-letter')).toBe(false);
  });

  it('plays the next scene once the head moves on', () => {
    const g = new SceneReplayGuard();
    g.markFinished('c1-letter');
    expect(g.shouldPlay('c1-gate')).toBe(true);
  });

  it('lets the same scene play again after the queue has moved past it', () => {
    const g = new SceneReplayGuard();
    g.markFinished('c1-letter');
    expect(g.shouldPlay(undefined)).toBe(false);
    expect(g.shouldPlay('c1-letter')).toBe(true);
  });
});
