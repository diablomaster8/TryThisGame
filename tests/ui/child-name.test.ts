import { describe, expect, it } from 'vitest';
import { fillChild, greet } from '../../src/ui/child-name';

describe('R0719 (KIDS-51) the child’s name in lines', () => {
  const line = "On the signpost is a letter. {child's} name is on the front!";
  it('fills the name, or "your" at a sentence start', () => {
    expect(fillChild(line, 'Maya')).toBe(
      "On the signpost is a letter. Maya's name is on the front!",
    );
    expect(fillChild(line, '')).toBe('On the signpost is a letter. Your name is on the front!');
    expect(fillChild('Well done, {child}!', undefined)).toBe('Well done, you!');
    expect(fillChild('No token here.', 'Maya')).toBe('No token here.');
  });
  it('greets by name before the entry question', () => {
    expect(greet('Shall we?', 'Maya', (n) => `Hello, ${n}!`)).toBe('Hello, Maya! Shall we?');
    expect(greet('Shall we?', ' ', (n) => `Hello, ${n}!`)).toBe('Shall we?');
  });
});
