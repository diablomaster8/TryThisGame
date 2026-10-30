import { describe, expect, it } from 'vitest';
import { REACT_INFER } from '../../src/config/story-react';
import { BOOK1_SCENES as BOOK1 } from '../../src/content/campaign-book1';

// R0303 / R0368: stage reactions, set on a line or read from its narration.

const infer = (text: string) => REACT_INFER.find(([re]) => re.test(text))?.[1] ?? null;

describe('story stage reactions', () => {
  it('reads the Nubbin verbs from narration', () => {
    expect(infer('Your Nubbin sneezes. A spark.')).toBe('sneeze');
    expect(infer('Your Nubbin presses against your leg and stays there.')).toBe('lean');
    expect(infer('Then your Nubbin giggles.')).toBe('giggle');
    expect(infer('Sparks sneezes.')).toBeNull();
  });

  it('the chapter 1 sneeze sets its own spark and sound', () => {
    const lines = JSON.stringify(BOOK1);
    expect(lines).toMatch(/"sfx":"sneeze","gag":true,"react":\{"who":"nubbin","as":"spark"\}/);
  });
});
