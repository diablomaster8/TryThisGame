import { describe, expect, it } from 'vitest';
import { GAG_LOOKS, gagLook } from '../../src/render/gag-looks';
import { CLIPS } from '../../src/render/sprites/animations';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';

/** Clips the Chao sheet draws beside the stock `CLIPS` (buildChaoSheet). */
const EXTRA: Record<string, number> = { sit: 2, surprised: 1, peek: 2, wave: 2, clap: 2 };

describe('comic idle gag looks (FUN-04, sprite side)', () => {
  it('gives each personality four gags, each on a clip the sheet draws', () => {
    const per = new Map<string, number>();
    for (const [id, g] of Object.entries(GAG_LOOKS)) {
      per.set(g.personality, (per.get(g.personality) ?? 0) + 1);
      const frames = CLIPS[g.clip as keyof typeof CLIPS]?.frames ?? EXTRA[g.clip];
      expect(frames, id).toBeDefined();
      expect(g.frames, id).toBeLessThanOrEqual(frames!);
    }
    expect([...per.values()]).toEqual([4, 4, 4, 4]);
  });

  it('plays a child gag slower and unsure', () => {
    expect(gagLook('clap', true).ms).toBeGreaterThan(GAG_LOOKS.clap.ms);
    expect(gagLook('clap', true).emote).toBe('question');
  });

  it('draws a glide frame with the wings out flat, unlike the flap (LOOK-24)', () => {
    const look = lookOf(CHILD_NEUTRAL, 'fly');
    const glide = drawChao('back', { ...poseFor('flap', 0), wings: 2 }, look);
    expect(Array.from(glide.data)).not.toEqual(
      Array.from(drawChao('back', poseFor('flap', 0), look).data),
    );
  });
});
