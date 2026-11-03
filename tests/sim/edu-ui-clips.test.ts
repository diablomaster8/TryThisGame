import { describe, expect, it } from 'vitest';
import { EDU_CLIP_IDS, EDU_UI_TEXT, clipsForText, planUiClips } from '../../src/config/edu-clips';
import { EDU_PICKER_TEXT, EDU_SAY_TEXT, EDU_WRONG_TEXT } from '../../src/config/strings-kids';
import { EDU_TEXT } from '../../src/config/strings';
import { colourRound, letterRound, shapeRound } from '../../src/minigames/edu/games';
import { spoken } from '../../src/ui/edu-voice';
import { Rng } from '../../src/sim/rng';
import { playUiText } from '../../src/platform/edu-audio';

describe('R0699 fixed-line clips', () => {
  it('gives every fixed spoken line a clip id', () => {
    const lines = [
      EDU_PICKER_TEXT.say,
      EDU_TEXT.breakSay,
      EDU_TEXT.tryAgain,
      EDU_TEXT.almost,
      EDU_TEXT.showAnswer,
      EDU_WRONG_TEXT.first,
      EDU_WRONG_TEXT.saved,
      ...EDU_TEXT.wellDone,
      ...EDU_SAY_TEXT.numbers,
    ];
    for (const l of lines) {
      const ids = clipsForText(l);
      expect(ids, l).not.toBeNull();
      for (const id of ids!) expect(EDU_CLIP_IDS).toContain(id);
    }
  });

  it('assembles templated prompts from parts, for every age', () => {
    for (const age of [3, 4, 5, 6] as const)
      for (let seed = 0; seed < 40; seed++) {
        const rng = new Rng(seed);
        for (const r of [colourRound(age, rng), shapeRound(age, rng), letterRound(age, rng)]) {
          const prompt = spoken(r.prompt);
          // Only the template shapes are in scope; others must simply not claim a clip.
          const ids = clipsForText(prompt);
          if (ids) for (const id of ids) expect(EDU_UI_TEXT[id], prompt).toBeDefined();
        }
      }
    expect(clipsForText('Tap the red one.')).toEqual(['part-tap-the', 'colour-red', 'part-one']);
    expect(clipsForText('Find a circle in the Grove!')).toEqual([
      'part-find-a',
      'shape-circle',
      'part-in-the-grove',
    ]);
    expect(clipsForText('Tap the letter G.')).toEqual(['part-tap-the-letter', 'letter-G']);
    expect(clipsForText('Tap the dragon.')).toBeNull();
  });

  it('uses recordings only when every clip is recorded', () => {
    const some = new Set(['part-tap-the', 'part-one']);
    expect(planUiClips('Tap the red one.', some)).toBeNull();
    const all = new Set(EDU_CLIP_IDS);
    expect(planUiClips('Tap the red one.', all)).toHaveLength(3);
    // Nothing recorded yet, so nothing is claimed and the voice speaks.
    expect(playUiText('Tap the red one.')).toBe(false);
  });
});
