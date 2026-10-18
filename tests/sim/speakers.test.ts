import { describe, expect, it } from 'vitest';
import type { Quest } from '../../src/content/types';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { questSpeakerName, registerSideStories, speakerNameIn } from '../../src/sim/story-scenes';

registerSideStories(SIDE_STORY_CONTENT);

/**
 * Review B, minor bug 20: a quest speaker shows its declared name ("The Hooded Three"),
 * never its id ("hooded-three"), wherever the scene is played from.
 */

const quest = (id: string, speakers: [string, string][]): Quest =>
  ({ id, speakers: speakers.map(([sid, name]) => ({ id: sid, name, kind: 'other' })) }) as Quest;

describe('speaker name plates', () => {
  const quests = [
    quest('a13-01', [['clank', 'Clank']]),
    quest('a13-02', [['a13-pin', 'Pin']]),
    quest('s25-01', [['clank', 'Clank the Elder']]),
    quest('q21', [['tall-hood', 'The Tall Hood']]),
  ];

  it('takes the owning quest, then its family, then any quest', () => {
    expect(speakerNameIn(quests, 'q21-intro', 'tall-hood')).toBe('The Tall Hood');
    expect(speakerNameIn(quests, 'a13-01-s1', 'a13-pin')).toBe('Pin');
    expect(speakerNameIn(quests, 'a13-grove-clank-idle', 'clank')).toBe('Clank');
    expect(speakerNameIn(quests, 's25-01-s2', 'clank')).toBe('Clank the Elder');
    expect(speakerNameIn(quests, 'end-quiet', 'a13-pin')).toBe('Pin');
  });

  it('is undefined for an id no quest declares', () => {
    expect(speakerNameIn(quests, 'q21-intro', 'nobody-at-all')).toBeUndefined();
  });

  it('names the shrubbery quest speakers in the Grove', () => {
    for (const who of ['hooded-three', 'tall-hood']) {
      const name = questSpeakerName('q01-intro', who);
      expect(name).toBeDefined();
      expect(name).not.toContain('-');
    }
  });
});
