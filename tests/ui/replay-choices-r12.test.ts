/** Lane C round 12 (R0618, CAMP-26): Watch again shows the choices and the one taken. */
import { describe, expect, it } from 'vitest';
import { overwriteSlot, replayScene } from '../../src/ui/chapter-select';

describe('Watch again', () => {
  it('names the choice that was taken, and the others, and sends nothing to the sim', () => {
    const ch = { line: 'hazel', n: 2, scenes: ['c2-corvin'], checkpoint: null };
    const taken = replayScene(ch, { corvinOffer: 'refused' })!;
    const text = taken.lines.map((l) => l.text).join('\n');
    expect(text).toMatch(/You chose: /);
    expect(text).toMatch(/The choices were: /);
    expect(taken.choices).toBeUndefined();
    const unknown = replayScene(ch, {})!;
    expect(unknown.lines.map((l) => l.text).join('\n')).toMatch(/You made a choice here/);
  });

  it('a branch over a full slot targets the last other slot', () => {
    const over = overwriteSlot({ mode: 'campaign', index: 1 });
    expect(over?.index).not.toBe(1);
  });
});
