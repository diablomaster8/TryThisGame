/**
 * The pixel shiny glint (LOOK-30): a sweep from one shared sheet per head size, 4 frames
 * every 2 s, only from the front-ish angles, and laid on the head the sprite was drawn with.
 */
import { describe, expect, it } from 'vitest';
import { glintPlace, SHINY_GLINT } from '../../src/render/sprites/shiny-glint';
import { shapeFor } from '../../src/render/sprites/chao';
import { frameKey } from '../../src/render/sprites/animations';

describe('shiny glint', () => {
  it('shows the sweep for a moment every 2 s, never from behind', () => {
    const child = shapeFor(null, null, false, null);
    const key = frameKey('idle', 'front', 0);
    expect(glintPlace(key, child, 0, 0)?.key).toBe(frameKey('shiny', 'front', 0));
    expect(glintPlace(key, child, SHINY_GLINT.frameMs * 2, 0)?.key).toBe(
      frameKey('shiny', 'front', 2),
    );
    expect(glintPlace(key, child, SHINY_GLINT.everyMs / 2, 0)).toBeNull();
    expect(glintPlace(frameKey('idle', 'back', 0), child, 0, 0)).toBeNull();
    expect(glintPlace(frameKey('sleep', 'front', 0), child, 0, 0)).toBeNull();
  });

  it('sits on the upper half of the sprite, inside its width', () => {
    const g = glintPlace(frameKey('idle', 'side', 0), shapeFor(null, null, false, null), 0, 0)!;
    expect(g.key).toBe(frameKey('shiny', 'side', 0));
    expect(Math.abs(g.right)).toBeLessThan(0.1);
    // The head's middle is above the sprite's middle, the cell inside the frame.
    expect(g.up + g.h / 2).toBeGreaterThan(0.4);
    expect(g.up).toBeGreaterThan(0);
    expect(g.up + g.h).toBeLessThan(1);
  });
});
