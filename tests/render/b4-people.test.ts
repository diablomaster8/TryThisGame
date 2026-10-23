import { afterEach, describe, expect, it } from 'vitest';
import { LOOK_STATE, STORY_ONLY_LOOKS, storyId } from '../../src/config/npc-looks';
import { expressionOf } from '../../src/render/sprites/faces';
import { lookFor, TALE_GRADE } from '../../src/config/campaign-look';
import { TRAINERS, type TrainerLook } from '../../src/sim/trainers';

const same = (a: TrainerLook, b: TrainerLook): boolean =>
  (Object.keys(a) as (keyof TrainerLook)[]).every((k) => a[k] === b[k]);

afterEach(() => {
  LOOK_STATE.tale = false;
  LOOK_STATE.campaign = 'hazel';
  LOOK_STATE.chapter = 0;
  TALE_GRADE.pixelPost = false;
});

describe('package b4: people', () => {
  it('draws Fern in a story look no trainer shares (K4)', () => {
    const id = storyId('fern');
    expect(id).not.toBe('fern');
    for (const t of TRAINERS) expect(same(STORY_ONLY_LOOKS[id]!.trainer, t.look), t.id).toBe(false);
  });

  it('ages Hazel: young in a tale, stooped with a stick from chapter 11 (K38)', () => {
    expect(storyId('hazel')).toBe('hazel');
    LOOK_STATE.chapter = 11;
    expect(storyId('hazel')).toBe('hazel-old');
    expect(STORY_ONLY_LOOKS['hazel-old']!.stick).toBe(true);
    LOOK_STATE.tale = true;
    expect(storyId('hazel')).toBe('young-hazel');
    expect(STORY_ONLY_LOOKS['young-hazel']!.scale!).toBeLessThan(
      STORY_ONLY_LOOKS['hazel-old']!.scale!,
    );
  });

  it('maps moods to four face shapes (K8)', () => {
    expect(expressionOf('happy')).toBe('smile');
    expect(expressionOf('sad')).toBe('frown');
    expect(expressionOf('shock')).toBe('surprised');
    expect(expressionOf('soft')).toBe('closed');
    expect(expressionOf('neutral')).toBeNull();
  });

  it('gives a tale its own grade, unless the pixel post pass draws it (K11)', () => {
    const at = { campaign: 'hazel', chapter: 4, storyChapter: null, half: null } as const;
    expect(lookFor(at, { tale: true }).key).toBe('tale');
    expect(lookFor(at, {}).key).toBe('hazel');
    TALE_GRADE.pixelPost = true;
    expect(lookFor(at, { tale: true }).key).toBe('hazel');
  });
});
